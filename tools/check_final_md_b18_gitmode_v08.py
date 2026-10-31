#!/usr/bin/env python3
"""Procet V0.8 B18：Git模式感知的Markdown链接审计。仅规划仓只读；不能代替GitHub渲染或产品验收。"""
import argparse
import json
import re
import subprocess
from pathlib import Path

from check_final_md_b16_ast_v08 import scan_doc, classify

SHA = re.compile(r'^[a-f0-9]{40}$')
REGULAR_MODES = {'100644', '100755'}


def classify_with_modes(source, href, objects, scans):
    # 先让B16判定URI/path/fragment；遇到特殊Git对象时进一步收紧资格。
    status, target = classify(source, href, set(objects), scans)
    if not target or status in {'REJECT_ESCAPE_REPO', 'REJECT_UNSAFE_PATH', 'REJECT_INVALID_PERCENT',
                                'REJECT_INVALID_URI', 'REJECT_INVALID_UTF8_PERCENT'}:
        return status, target
    parts = target.split('/')
    for n in range(1, len(parts) + 1):
        prefix = '/'.join(parts[:n])
        item = objects.get(prefix)
        if item is None:
            continue
        mode = item['mode']
        if mode == '120000':
            return 'UNKNOWN_GIT_SYMLINK', target
        if mode == '160000':
            return 'UNKNOWN_GITLINK', target
        if mode not in REGULAR_MODES and mode != '040000':
            return 'UNKNOWN_GIT_OBJECT_MODE', target
    return status, target


def audit_docs(docs, objects):
    scans = {p: scan_doc(content) for p, content in docs.items()}
    findings = []
    for source, parsed in scans.items():
        for href, token in parsed['urls']:
            status, target = classify_with_modes(source, href, objects, scans)
            findings.append({'source': source, 'token': token, 'href': href, 'target': target, 'status': status})
    return findings


def read_git_objects(commit):
    if not SHA.fullmatch(commit):
        raise ValueError('须使用精确40位commit SHA')
    raw = subprocess.check_output(['git', 'ls-tree', '-r', '-z', commit])
    objects = {}
    for entry in raw.split(b'\0'):
        if not entry:
            continue
        meta, path = entry.split(b'\t', 1)
        mode, kind, sha = meta.decode('ascii').split(' ')
        path = path.decode('utf-8', errors='strict')
        objects[path] = {'mode': mode, 'kind': kind, 'sha': sha}
    docs = {}
    for path, obj in objects.items():
        if path.lower().endswith('.md') and obj['mode'] in REGULAR_MODES and obj['kind'] == 'blob':
            docs[path] = subprocess.check_output(['git', 'cat-file', 'blob', obj['sha']]).decode('utf-8', errors='strict')
    return docs, objects


def selftest(fixture):
    data = json.loads(Path(fixture).read_text(encoding='utf-8'))
    assert data['scope'] == 'SYNTHETIC_ONLY'
    assert data['gates']['fullRepoAst'] == 'NOT_RUN'
    assert len({c['id'] for c in data['cases']}) == len(data['cases'])
    for case in data['cases']:
        docs = {'docs/index.md': case['source'], **data['supportingDocuments']}
        objects = {p: {'mode': '100644', 'kind': 'blob', 'sha': '0' * 40} for p in docs}
        objects.update({p: {'mode': m, 'kind': 'commit' if m == '160000' else 'blob', 'sha': '1' * 40}
                        for p, m in case.get('objectOverrides', {}).items()})
        findings = [x for x in audit_docs(docs, objects) if x['source'] == 'docs/index.md']
        assert len(findings) == 1, (case['id'], findings)
        assert findings[0]['status'] == case['expected'], (case['id'], case['expected'], findings[0]['status'])
    print(json.dumps({'level': 'SYNTHETIC_ONLY', 'casesPassed': len(data['cases']),
                      'realGitFullRepo': 'NOT_RUN', 'product': 'NOT_RUN'}, ensure_ascii=False))


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--self-test', action='store_true')
    cli.add_argument('--fixture', default=str(Path(__file__).resolve().parents[1] /
                      'docs/architecture/v0.8/final-md-b18-gitmode-fixtures-v08.json'))
    cli.add_argument('--commit')
    cli.add_argument('--out')
    args = cli.parse_args()
    if args.self_test:
        selftest(args.fixture)
        return
    if not args.commit:
        cli.error('指定--self-test或--commit固定SHA')
    docs, objects = read_git_objects(args.commit)
    findings = audit_docs(docs, objects)
    counts = {s: sum(x['status'] == s for x in findings) for s in sorted({x['status'] for x in findings})}
    report = {'level': 'LOCAL_GFM_SUBSET_NOT_GITHUB_RENDERER', 'exactCommit': args.commit,
              'markdownCount': len(docs), 'gitObjects': len(objects), 'linkCount': len(findings),
              'statuses': counts, 'unresolved': [x for x in findings if not x['status'].startswith('PASS_') and
                                                 x['status'] != 'EXTERNAL_NOT_CHECKED'],
              'realOwnerSigned': 'NOT_VERIFIED', 'realConsumer': 'NOT_RUN', 'product': 'NOT_RUN'}
    output = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if args.out:
        Path(args.out).write_text(output, encoding='utf-8')
    else:
        print(output)


if __name__ == '__main__':
    main()

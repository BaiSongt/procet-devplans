#!/usr/bin/env python3
"""规划文档 AST 链接候选核验；不等于 GitHub 渲染器一致性或产品验收。"""
import argparse
import json
import posixpath
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit

try:
    from markdown_it import MarkdownIt
except ImportError:
    print('UNKNOWN_DEPENDENCY: 需要 markdown-it-py，不能声明全仓AST通过', file=sys.stderr)
    sys.exit(3)

MD = MarkdownIt('commonmark', {'html': True}).enable('table').enable('strikethrough')
HEX40 = re.compile(r'^[a-f0-9]{40}$')

def slug(text):
    s = re.sub(r'<[^>]*>', '', text).strip().lower()
    return re.sub(r'[^\w\- ]', '', s).replace(' ', '-')

def tokens_for(markdown):
    tokens = MD.parse(markdown)
    links = []
    anchors = []
    repeats = Counter()
    for i, token in enumerate(tokens):
        if token.type == 'heading_open' and i + 1 < len(tokens):
            inline = tokens[i + 1]
            title = ''.join(c.content for c in (inline.children or []) if c.type in ('text', 'code_inline'))
            base = slug(title)
            anchor = base + (('-' + str(repeats[base])) if repeats[base] else '')
            anchors.append(anchor)
            repeats[base] += 1
        if token.type == 'inline':
            for child in token.children or []:
                if child.type == 'link_open':
                    links.append(child.attrGet('href') or '')
                if child.type == 'image':
                    links.append(child.attrGet('src') or '')
    return links, anchors

def classify(src, href, object_modes, known_anchors):
    # 先排除危险或不属于本仓的 URI；不进行联网访问，也不宣称外链通过。
    uri = urlsplit(href)
    if uri.scheme.lower() in ('javascript', 'data', 'vbscript'):
        return 'REJECT_UNSAFE_URI'
    if uri.scheme or uri.netloc:
        return 'EXTERNAL_NOT_CHECKED'
    if href.startswith('/'):
        return 'UNKNOWN_SITE_ABSOLUTE'
    raw = unquote(uri.path)
    dest = posixpath.normpath(posixpath.join(posixpath.dirname(src), raw)) if raw else src
    if dest == '..' or dest.startswith('../'):
        return 'REJECT_OUTSIDE_REPOSITORY'
    pieces = PurePosixPath(dest).parts
    for n in range(1, len(pieces) + 1):
        pref = '/'.join(pieces[:n])
        if object_modes.get(pref) == '120000':
            return 'UNKNOWN_GIT_SYMLINK'
        if object_modes.get(pref) == '160000':
            return 'UNKNOWN_GITLINK'
    if dest not in object_modes:
        return 'REJECT_MISSING_TARGET'
    if object_modes[dest] == '040000':
        return 'UNKNOWN_DIRECTORY_RENDER'
    if object_modes[dest] not in ('100644', '100755'):
        return 'UNKNOWN_OBJECT_MODE'
    if uri.fragment:
        frag = unquote(uri.fragment)
        if dest not in known_anchors:
            return 'UNKNOWN_TARGET_ANCHORS'
        if frag not in known_anchors[dest]:
            return 'UNKNOWN_ANCHOR_PARITY'
    return 'PASS_AST_CANDIDATE'

def git(repo, *args):
    p = subprocess.run(['git', '-C', repo, *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode:
        raise RuntimeError('git read failed: ' + p.stderr.decode('utf-8', 'replace')[:250])
    return p.stdout

def scan(repo, commit):
    if not HEX40.fullmatch(commit):
        raise ValueError('必须提供固定40位exact commit，不接受可移动分支名')
    raw = git(repo, 'ls-tree', '-rz', '--full-tree', commit)
    modes = {}
    shas = {}
    for item in raw.split(b'\0'):
        if not item:
            continue
        meta, pathname = item.split(b'\t', 1)
        mode, typ, sha = meta.decode().split(' ')
        name = pathname.decode('utf-8')
        modes[name] = mode
        shas[name] = sha
    object_count = len(modes)
    for obj in list(modes):
        parts = PurePosixPath(obj).parts
        for n in range(1, len(parts)):
            modes.setdefault('/'.join(parts[:n]), '040000')
    paths = [p for p in modes if p.lower().endswith('.md') and modes[p] in ('100644', '100755')]
    contents = {p: git(repo, 'show', commit + ':' + p).decode('utf-8', 'replace') for p in paths}
    parsed = {p: tokens_for(content) for p, content in contents.items()}
    anchors = {p: set(pair[1]) for p, pair in parsed.items()}
    statuses = Counter()
    failures = []
    for p, pair in parsed.items():
        for href in pair[0]:
            status = classify(p, href, modes, anchors)
            statuses[status] += 1
            if status.startswith('REJECT'):
                failures.append({'source': p, 'destination': href, 'status': status})
    return {'exactCommit': commit, 'parser': 'markdown-it-py/commonmark+table; GitHub parity NOT_RUN',
            'markdownCount': len(paths), 'totalGitObjects': object_count, 'linkCounts': dict(statuses),
            'failures': failures, 'githubRenderParity': 'NOT_RUN', 'product': 'NOT_RUN',
            'allLinksPassed': False, 'reason': 'AST候选不等于GitHub renderer官方对等核验'}

def selftest():
    root = Path(__file__).resolve().parents[1]
    fixture = json.loads((root / 'docs/capabilities/CAP-01-08/gfm-ast-b97-fixtures-v08.json').read_text(encoding='utf-8'))
    trace = json.loads((root / 'research/traces/FINAL-MD-B97-AST-V08.json').read_text(encoding='utf-8'))
    source = json.loads((root / 'research/sources/FINAL-MD-B97-AST-V08.json').read_text(encoding='utf-8'))
    assert fixture['syntheticOnly'] is True and fixture['productPass'] is False
    assert source['registeredRecords'] == len(source['sources']) == 4
    sid = {x['id'] for x in source['sources']}
    assert len(sid) == 4
    case_ids = set()
    for c in fixture['pathCases']:
        assert c['id'] not in case_ids
        case_ids.add(c['id'])
        got = classify(c['source'], c['href'], fixture['objectModes'], fixture['knownAnchors'])
        assert got == c['expected'], (c['id'], got, c['expected'])
    links, headings = tokens_for(fixture['markdownFixture'])
    assert links == fixture['expectedParsedLinks'], links
    assert headings == fixture['expectedHeadingCandidates'], headings
    assert len(links) == 3 and 'missing.md' not in links
    for t in fixture['astAssertions']:
        assert t['id'] not in case_ids
        case_ids.add(t['id'])
        assert t['expected'] is True
    assert trace['ruleCount'] == len(trace['rules']) == 6
    for rule in trace['rules']:
        assert rule['capabilityId'] == 'CAP-01-08'
        assert set(rule['sourceIds']) <= sid and rule['sourceIds']
        assert set(rule['fields']) <= set(fixture['contractFields']) and rule['fields']
        assert set(rule['originalWorkPackages']) <= set(trace['originalWorkPackages'])
        assert set(rule['positiveIds']) <= case_ids and set(rule['negativeOrUnknownIds']) <= case_ids
        assert rule['positiveIds'] and rule['negativeOrUnknownIds']
    print('B97_AST_SYNTHETIC_PASS pathCases=12 astAssertions=3 traceRules=6; ACTUAL_REPO_NOT_RUN')

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--self-test', action='store_true')
    p.add_argument('--repo')
    p.add_argument('--commit')
    p.add_argument('--out')
    a = p.parse_args()
    if a.self_test:
        selftest()
        return
    if not (a.repo and a.commit):
        p.error('真实仓审计需要 --repo 与 --commit')
    data = scan(a.repo, a.commit)
    result = json.dumps(data, ensure_ascii=False, indent=2)
    if a.out:
        with open(a.out, 'w', encoding='utf-8') as f:
            f.write(result + '\n')
    else:
        print(result)
    if data['failures']:
        sys.exit(2)

if __name__ == '__main__':
    main()

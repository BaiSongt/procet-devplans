"""F1-03规划JSON检查；不调用产品、不访问网络、不修改仓库。"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from pathlib import Path, PurePosixPath
from urllib.parse import urlsplit


def validate(trace: dict, register: dict) -> list[str]:
    errors: list[str] = []

    def require(ok: bool, message: str) -> None:
        if not ok:
            errors.append(message)

    def ids(items: list[str], expected: set[str], label: str) -> None:
        require(len(items) == len(set(items)), label + '存在重复编号')
        require(set(items) == expected, label + '编号集合不完整')

    require(trace.get('schemaVersion') == 'procet-planning-trace-v1', '追踪版本错误')
    require(register.get('schemaVersion') == 'procet-research-register-v1', '登记版本错误')
    require(trace.get('workPackageId') == 'F1-03', '工作包编号错误')
    require(trace.get('status') == 'drafted_pending_review', '不能误标设计已批准')
    require(trace.get('productAcceptance') == 'not_run', '不能误标产品已验收')
    rules = trace['rules']
    sources = register['sources']
    rule_ids = {f'BND-R{i:02d}' for i in range(1, 11)}
    source_ids = {f'SRC-BOUND-{i:03d}' for i in range(1, 9)}
    test_ids = {f'F1-03-T{i:02d}' for i in range(1, 21)}
    ids([r['id'] for r in rules], rule_ids, '规则')
    ids([s['id'] for s in sources], source_ids, '来源')
    ids(trace['sourceIds'], source_ids, '追踪来源')
    ids(trace['acceptanceTests'], test_ids, '验收')
    ids(trace['subtasks'], {f'F1-03-S{i:02d}' for i in range(1, 11)}, '子任务')
    evidence_ids = {e['id'] for e in trace['codeEvidence']}
    require(len(evidence_ids) == len(trace['codeEvidence']), '代码证据编号重复')
    for e in trace['codeEvidence']:
        require(bool(re.fullmatch(r'[0-9a-f]{40}', e['commit'])), '代码证据需完整SHA')
    covered: set[str] = set()
    used: set[str] = set()
    for rule in rules:
        r_sources = set(rule['sourceIds'])
        r_tests = set(rule['tests'])
        require(r_sources <= source_ids, rule['id'] + '引用未登记来源')
        require(r_tests <= test_ids and bool(r_tests), rule['id'] + '验收映射非法')
        require(bool(rule['fields']), rule['id'] + '缺字段映射')
        require(rule['status'] == 'planned_only', rule['id'] + '误标产品执行')
        require(set(rule.get('codeEvidenceIds', [])) <= evidence_ids, '未登记代码证据')
        if not r_sources:
            require(rule['kind'] == 'internal_design_decision', '内部选择冒充外部依据')
        covered.update(r_tests)
        used.update(r_sources)
    require(covered == test_ids, '验收存在未覆盖项')
    require(used == source_ids, '来源登记存在未引用项')
    by_rule = {r['id']: r for r in rules}
    required = ['title', 'authors', 'publisher', 'edition', 'published', 'url',
                'accessedOn', 'accessDepth', 'locator', 'supports', 'limits']
    for source in sources:
        require(all(source.get(key) for key in required), source['id'] + '元数据缺失')
        u = urlsplit(source['url'])
        require(u.scheme == 'https' and bool(u.hostname) and not u.username
                and not u.password and not u.query, source['id'] + 'URL不适合公开登记')
        require(source['accessDepth'] in {'catalog_abstract', 'section_text',
                                        'full_text', 'not_obtained'}, '读取深度非法')
        for rid in source['rules']:
            require(rid in by_rule and source['id'] in by_rule[rid]['sourceIds'],
                    source['id'] + '反向规则映射不一致')
    for path in trace['paths'].values():
        p = PurePosixPath(path)
        require(not p.is_absolute() and '..' not in p.parts and '\\' not in path,
                '追踪目标必须是仓内相对路径')
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--self-test', action='store_true', help='另检验8组检查器负例')
    args = parser.parse_args()
    root = args.root.resolve()
    paths = ['research/traces/F1-03.json', 'research/sources/F1-03.json']
    try:
        blobs = [(root / p).read_bytes() for p in paths]
        trace, register = [json.loads(b) for b in blobs]
        errors = validate(trace, register)
        negative_passed = 0
        if args.self_test and not errors:
            for case in range(8):
                t, r = copy.deepcopy(trace), copy.deepcopy(register)
                if case == 0: r['sources'].pop()
                if case == 1: r['sources'].append(copy.deepcopy(r['sources'][0]))
                if case == 2: t['rules'][0]['sourceIds'].append('SRC-NOT-REGISTERED')
                if case == 3: t['productAcceptance'] = 'passed'
                if case == 4: t['codeEvidence'][0]['commit'] = 'short'
                if case == 5:
                    for rule in t['rules']:
                        rule['tests'] = [v for v in rule['tests'] if v != 'F1-03-T20']
                if case == 6: r['sources'][0]['url'] += '?token=synthetic'
                if case == 7: t['paths']['plan'] = '../outside.md'
                if validate(t, r):
                    negative_passed += 1
                else:
                    errors.append(f'检查器负例{case + 1}未拒绝')
        hashes = {p: hashlib.sha1(b'blob ' + str(len(b)).encode() + b'\0' + b).hexdigest()
                  for p, b in zip(paths, blobs)}
        print(json.dumps({'scope': 'F1-03_two_json_structure_only',
                          'sources': len(register['sources']), 'rules': len(trace['rules']),
                          'acceptanceIds': len(trace['acceptanceTests']),
                          'subtasks': len(trace['subtasks']), 'negativeCasesPassed': negative_passed,
                          'errors': errors, 'gitBlobHashes': hashes,
                          'notChecked': ['Markdown正文', '全仓链接', '旧61条来源', '产品验收']},
                         ensure_ascii=False, indent=2))
        return 1 if errors else 0
    except (OSError, UnicodeError, ValueError, TypeError, KeyError, AttributeError) as exc:
        print(json.dumps({'status': 'failed', 'error': str(exc)}, ensure_ascii=False))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())

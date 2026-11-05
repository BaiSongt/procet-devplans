#!/usr/bin/env python3
"""B82：固定Git提交的Markdown AST链接/标题锚点保守核验；只读，不等于GitHub渲染。"""
import argparse
import html.parser
import json
import posixpath
import re
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlsplit

try:
    from markdown_it import MarkdownIt
except ImportError as exc:
    raise SystemExit('需要已批准的markdown-it-py依赖；禁止工具自行联网安装') from exc

SHA = re.compile(r'^[0-9a-f]{40}$')
HEX_ERROR = re.compile(r'%(?![0-9a-fA-F]{2})')
SIMPLE = re.compile(r'^[A-Za-z0-9 _-]+$')
REGULAR = {'100644', '100755'}
MD = MarkdownIt('commonmark', {'html': True}).enable(['table', 'strikethrough'])


class HtmlInfo(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.urls, self.ids = [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for attr in (('href',) if tag == 'a' else ('src',) if tag in ('img', 'source') else ()):
            if a.get(attr):
                self.urls.append((a[attr], 'html-' + tag))
        if a.get('id'):
            self.ids.append(a['id'])
        if tag == 'a' and a.get('name'):
            self.ids.append(a['name'])

    handle_startendtag = handle_starttag


def scan(content):
    tokens = MD.parse(content)
    urls, ids, uncertain = [], set(), False
    anchor_unsafe, collisions, used = set(), set(), set()
    for i, tok in enumerate(tokens):
        if tok.type == 'heading_open' and i + 1 < len(tokens):
            nxt = tokens[i + 1]
            if nxt.type == 'inline':
                title = ''.join(t.content for t in (nxt.children or []) if t.type in ('text', 'code_inline'))
                if not SIMPLE.fullmatch(title) or not title.strip():
                    uncertain = True
                else:
                    base = title.strip().lower().replace(' ', '-')
                    slug = base
                    counter = 0
                    while slug in used:
                        counter += 1
                        slug = f'{base}-{counter}'
                    if counter or base in used:
                        collisions.add(base)
                        anchor_unsafe.add(slug)
                    if base in used:
                        collisions.add(base)
                        anchor_unsafe.add(base)
                    ids.add(slug)
                    used.add(slug)
        if tok.type in ('html_block', 'html_inline'):
            h = HtmlInfo()
            h.feed(tok.content)
            urls.extend(h.urls)
            for x in h.ids:
                if x in ids:
                    anchor_unsafe.add(x)
                ids.add(x)
        if tok.type == 'inline':
            for ch in tok.children or []:
                if ch.type in ('link_open', 'image'):
                    url = ch.attrs.get('href' if ch.type == 'link_open' else 'src')
                    if url:
                        urls.append((url, ch.type))
                elif ch.type == 'html_inline':
                    h = HtmlInfo()
                    h.feed(ch.content)
                    urls.extend(h.urls)
                    for x in h.ids:
                        if x in ids:
                            anchor_unsafe.add(x)
                        ids.add(x)
    return {'urls': urls, 'ids': ids, 'uncertain': uncertain,
            'anchorUnsafe': anchor_unsafe, 'collisions': collisions}


def classify(source, href, tree, scans):
    if HEX_ERROR.search(href):
        return 'REJECT_INVALID_PERCENT', None
    try:
        uri = urlsplit(href)
    except ValueError:
        return 'REJECT_INVALID_URI', None
    if uri.scheme or uri.netloc or href.startswith('//'):
        return 'EXTERNAL_NOT_CHECKED', None
    if uri.query:
        return 'UNKNOWN_QUERY', None
    try:
        path = unquote(uri.path, errors='strict')
        fragment = unquote(uri.fragment, errors='strict')
    except UnicodeError:
        return 'REJECT_INVALID_UTF8_PERCENT', None
    if '\\' in path or '\x00' in path + fragment or '%' in path:
        return 'UNKNOWN_UNSAFE_NORMALIZATION', None
    if path.startswith('/'):
        target = posixpath.normpath(path.lstrip('/'))
    elif path:
        target = posixpath.normpath(posixpath.join(posixpath.dirname(source), path))
    else:
        target = source
    if target == '..' or target.startswith('../'):
        return 'REJECT_ESCAPE_REPO', target
    parts = target.split('/')
    for n in range(1, len(parts) + 1):
        entry = tree.get('/'.join(parts[:n]))
        if not entry:
            continue
        if entry['mode'] in ('120000', '160000'):
            return ('UNKNOWN_GITLINK' if entry['mode'] == '160000' else 'UNKNOWN_SYMLINK'), target
        if entry['mode'] not in REGULAR and entry['mode'] != '040000':
            return 'UNKNOWN_GIT_MODE', target
    if target not in tree:
        if target + '/README.md' in tree:
            return 'UNKNOWN_DIRECTORY', target
        return 'REJECT_MISSING_PATH', target
    if not fragment:
        return 'PASS_LOCAL_PATH', target
    parsed = scans.get(target)
    if parsed is None:
        return 'UNKNOWN_UNPARSED_TARGET', target
    if fragment in parsed['anchorUnsafe'] or fragment in parsed['collisions']:
        return 'UNKNOWN_COLLIDING_ANCHOR', target
    if fragment in parsed['ids']:
        return 'PASS_ANCHOR_CANDIDATE', target
    if parsed['uncertain']:
        return 'UNKNOWN_RENDERER_SLUG', target
    return 'REJECT_MISSING_ANCHOR', target


def audit(docs, tree):
    scans = {p: scan(src) for p, src in docs.items()}
    return [{'source': p, 'href': href, 'token': kind, 'status': status, 'target': target}
            for p, s in scans.items() for href, kind in s['urls']
            for status, target in (classify(p, href, tree, scans),)]


def read_git(sha):
    if not SHA.fullmatch(sha):
        raise ValueError('需要40位精确Git commit SHA')
    entries = subprocess.check_output(['git', 'ls-tree', '-r', '-z', sha]).split(b'\x00')
    tree, docs = {}, {}
    for item in entries:
        if not item:
            continue
        metadata, path = item.split(b'\t', 1)
        mode, kind, blob = metadata.decode('ascii').split(' ')
        path = path.decode('utf-8', errors='strict')
        tree[path] = {'mode': mode, 'kind': kind, 'sha': blob}
    for path, item in tree.items():
        if path.lower().endswith('.md') and item['mode'] in REGULAR and item['kind'] == 'blob':
            docs[path] = subprocess.check_output(['git', 'cat-file', 'blob', item['sha']]).decode('utf-8')
    return docs, tree


def validate_evidence_chain(fixture, trace_path, sources_path):
    data = json.loads(Path(fixture).read_text(encoding='utf-8'))
    trace = json.loads(Path(trace_path).read_text(encoding='utf-8'))
    sources = json.loads(Path(sources_path).read_text(encoding='utf-8'))
    case_ids = {c['id'] for c in data['cases']}
    source_ids = {s['id'] for s in sources['sources']}
    used_cases, used_sources = set(), set()
    assert len(source_ids) == len(sources['sources']), '来源ID不唯一'
    assert len({r['id'] for r in trace['rules']}) == len(trace['rules']), '规则ID不唯一'
    for source in sources['sources']:
        assert all(source.get(k) for k in ('author', 'version', 'published', 'accessed', 'url', 'readDepth', 'limitations'))
    for r in trace['rules']:
        assert r['sourceIds'] and set(r['sourceIds']) <= source_ids, r['id']
        assert r['fields'] and r['caps'] and r['workPackages'] and r['acceptanceIds'], r['id']
        assert set(r['acceptanceIds']) <= case_ids, r['id']
        used_cases.update(r['acceptanceIds'])
        used_sources.update(r['sourceIds'])
    assert used_cases == case_ids, f'未映射案例: {sorted(case_ids - used_cases)}'
    assert used_sources == source_ids, f'未使用来源: {sorted(source_ids - used_sources)}'
    assert {'PASS_LOCAL_PATH', 'REJECT_MISSING_PATH', 'UNKNOWN_COLLIDING_ANCHOR'} <= {c['expected'] for c in data['cases']}
    return len(trace['rules']), len(source_ids)


def selftest(fixture, trace_path, sources_path):
    data = json.loads(Path(fixture).read_text(encoding='utf-8'))
    rules, sources = validate_evidence_chain(fixture, trace_path, sources_path)
    assert data['scope'] == 'SYNTHETIC_ONLY'
    ids = [c['id'] for c in data['cases']]
    assert len(ids) == len(set(ids))
    for c in data['cases']:
        docs = {'docs/index.md': c['source'], **data.get('supportingDocuments', {})}
        tree = {p: {'mode': '100644', 'kind': 'blob', 'sha': '0' * 40} for p in docs}
        for p, mode in c.get('objectOverrides', {}).items():
            tree[p] = {'mode': mode, 'kind': 'commit' if mode == '160000' else 'blob', 'sha': '1' * 40}
        found = [x for x in audit(docs, tree) if x['source'] == 'docs/index.md']
        if c['expected'] == 'NO_LINK':
            assert not found, (c['id'], found)
        else:
            assert len(found) == 1 and found[0]['status'] == c['expected'], (c['id'], c['expected'], found)
    print(json.dumps({'scope': 'SYNTHETIC_ONLY', 'count': len(ids), 'passed': len(ids), 'rules': rules, 'sources': sources,
                      'fullRepoAst': 'NOT_RUN', 'githubRendererParity': 'NOT_RUN'}, ensure_ascii=False))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--self-test', action='store_true')
    p.add_argument('--fixtures', default=str(Path(__file__).resolve().parents[1] / 'docs/architecture/v0.8/final-md-b82-anchor-fixtures-v08.json'))
    p.add_argument('--trace', default=str(Path(__file__).resolve().parents[1] / 'research/traces/FINAL-MD-B82-ANCHOR-V08.json'))
    p.add_argument('--sources', default=str(Path(__file__).resolve().parents[1] / 'research/sources/FINAL-MD-B82.json'))
    p.add_argument('--commit')
    p.add_argument('--out')
    a = p.parse_args()
    if a.self_test:
        selftest(a.fixtures, a.trace, a.sources)
        return
    if not a.commit:
        p.error('指定--self-test或--commit固定Git SHA')
    docs, tree = read_git(a.commit)
    findings = audit(docs, tree)
    by_status = {s: sum(f['status'] == s for f in findings) for s in sorted({f['status'] for f in findings})}
    result = {'level': 'LOCAL_GFM_SUBSET_NOT_RENDERER', 'exactCommit': a.commit,
              'markdownCount': len(docs), 'gitObjectCount': len(tree), 'links': len(findings),
              'statuses': by_status, 'unresolved': [f for f in findings if not f['status'].startswith('PASS_')
                                                 and f['status'] != 'EXTERNAL_NOT_CHECKED'],
              'githubRendererParity': 'NOT_RUN', 'ownerSignatures': 'NOT_VERIFIED',
              'independentConsumers': 'NOT_RUN', 'productAcceptance': 'NOT_RUN'}
    output = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if a.out:
        with open(a.out, 'w', encoding='utf-8') as f:
            f.write(output)
    else:
        print(output)


if __name__ == '__main__':
    main()

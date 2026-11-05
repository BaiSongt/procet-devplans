#!/usr/bin/env python3
"""Procet V0.8：只读Markdown AST本地引用与锚点预检；不能代表GitHub实际渲染或产品验收。"""
import argparse
import html.parser
import json
import posixpath
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit

try:
    from markdown_it import MarkdownIt
except ImportError as exc:
    raise SystemExit('缺少markdown-it-py；使用已审批的离线环境安装依赖，不自动联网') from exc

SHA_RE = re.compile(r'^[0-9a-f]{40}$')
PERCENT_BAD = re.compile(r'%(?![0-9a-fA-F]{2})')
# Unicode或标点复杂标题可能与GitHub渲染后处理有差异：保留UNKNOWN，不虚报精确锚点。
SIMPLE_TITLE = re.compile(r'^[a-zA-Z0-9 _-]+$')


def parser():
    return MarkdownIt('commonmark', {'html': True}).enable(['table', 'strikethrough'])


class HtmlRefs(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.urls, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('a', 'img', 'source'):
            attr = 'href' if tag == 'a' else 'src'
            if a.get(attr):
                self.urls.append((a[attr], f'html-{tag}-{attr}'))
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'a' and a.get('name'):
            self.ids.add(a['name'])

    handle_startendtag = handle_starttag


def heading_plain(children):
    return ''.join(t.content for t in children if t.type in ('text', 'code_inline'))


def scan_doc(content):
    tokens = parser().parse(content)
    urls, ids, uncertain_ids = [], set(), set()
    seen = {}
    for idx, token in enumerate(tokens):
        if token.type == 'heading_open' and idx + 1 < len(tokens):
            nxt = tokens[idx + 1]
            if nxt.type == 'inline':
                title = heading_plain(nxt.children or [])
                # 有条件的白名单，不把近似slug算法冒充GitHub完整实现。
                if SIMPLE_TITLE.fullmatch(title) and title.strip():
                    slug = title.strip().lower().replace(' ', '-')
                    count = seen.get(slug, 0)
                    ids.add(slug if count == 0 else f'{slug}-{count}')
                    seen[slug] = count + 1
                else:
                    uncertain_ids.add(title)
        if token.type.startswith('html_'):
            fragment = HtmlRefs()
            fragment.feed(token.content)
            urls.extend(fragment.urls)
            ids.update(fragment.ids)
        if token.type == 'inline':
            for ch in token.children or []:
                if ch.type in ('link_open', 'image'):
                    href = ch.attrs.get('href' if ch.type == 'link_open' else 'src')
                    if href:
                        urls.append((href, ch.type))
                if ch.type == 'html_inline':
                    fragment = HtmlRefs()
                    fragment.feed(ch.content)
                    urls.extend(fragment.urls)
                    ids.update(fragment.ids)
    return {'urls': urls, 'ids': ids, 'uncertain_ids': uncertain_ids}


def classify(base, raw, tree, scans):
    if PERCENT_BAD.search(raw):
        return 'REJECT_INVALID_PERCENT', None
    try:
        url = urlsplit(raw)
    except ValueError:
        return 'REJECT_INVALID_URI', None
    if url.scheme or url.netloc or raw.startswith('//'):
        return 'EXTERNAL_NOT_CHECKED', None
    repo_root_relative = url.path.startswith('/')
    if url.query:
        return 'UNKNOWN_QUERY_SEMANTICS', None
    try:
        target = unquote(url.path, encoding='utf-8', errors='strict')
        frag = unquote(url.fragment, encoding='utf-8', errors='strict')
    except UnicodeError:
        return 'REJECT_INVALID_UTF8_PERCENT', None
    if '%' in target:
        return 'UNKNOWN_PERCENT_AFTER_DECODE', None
    if '\\' in target or '\x00' in target or '\x00' in frag:
        return 'REJECT_UNSAFE_PATH', None
    result = (posixpath.normpath(target.lstrip('/')) if repo_root_relative
              else posixpath.normpath(posixpath.join(posixpath.dirname(base), target)) if target else base)
    if result == '..' or result.startswith('../'):
        return 'REJECT_ESCAPE_REPO', result
    if result not in tree:
        if result + '/README.md' in tree or result == '.' and 'README.md' in tree:
            return 'UNKNOWN_DIRECTORY_RENDERING', result
        return 'REJECT_MISSING_PATH', result
    if not frag:
        return 'PASS_LOCAL_PATH', result
    if result not in scans:
        return 'UNKNOWN_TARGET_UNPARSED', result
    if frag in scans[result]['ids']:
        return 'PASS_LOCAL_ANCHOR_CANDIDATE', result
    if scans[result]['uncertain_ids']:
        return 'UNKNOWN_RENDERER_SLUG', result
    return 'REJECT_MISSING_ANCHOR', result


def audit_docs(docs, tree=None):
    tree = set(docs) if tree is None else set(tree)
    scans = {p: scan_doc(s) for p, s in docs.items()}
    findings = []
    for path, parsed in scans.items():
        for raw, token in parsed['urls']:
            status, target = classify(path, raw, tree, scans)
            findings.append({'file': path, 'token': token, 'href': raw, 'target': target, 'status': status})
    return findings


def git_docs(commit):
    if not SHA_RE.fullmatch(commit):
        raise ValueError('必须指定固定40位提交SHA')
    raw = subprocess.check_output(['git', 'ls-tree', '-r', '-z', commit])
    blobs = {}
    for entry in raw.split(b'\0'):
        if not entry:
            continue
        metadata, name = entry.split(b'\t', 1)
        mode, kind, sha = metadata.decode('ascii').split(' ')
        name = name.decode('utf-8', errors='strict')
        if kind != 'blob':
            continue
        blobs[name] = sha
    docs = {}
    for path, sha in blobs.items():
        if path.lower().endswith('.md'):
            docs[path] = subprocess.check_output(['git', 'cat-file', 'blob', sha]).decode('utf-8', errors='strict')
    return docs, blobs


def selftest():
    fixture = Path(__file__).resolve().parents[1] / 'docs/architecture/v0.8/final-markdown-b16-ast-fixtures-v08.json'
    if not fixture.is_file():
        raise AssertionError(f'缺失独立合成fixture：{fixture}')
    spec = json.loads(fixture.read_text(encoding='utf-8'))
    assert spec['scope'] == 'SYNTHETIC_ONLY'
    assert spec['gates'] == {'fullRepoAst': 'NOT_RUN', 'githubRender': 'NOT_RUN', 'product': 'NOT_RUN'}
    cases = spec['cases']
    assert len({x['id'] for x in cases}) == len(cases), '案例ID重复'
    for case in cases:
        docs = dict(spec['supportingDocuments'])
        docs['docs/index.md'] = case['source']
        findings = [x for x in audit_docs(docs) if x['file'] == 'docs/index.md']
        assert len(findings) == 1, (case['id'], findings)
        assert findings[0]['status'] == case['expected'], (case['id'], case['expected'], findings[0]['status'])
    for code in spec['inertCode']:
        assert audit_docs({'docs/index.md': code}) == [], '代码段内的伪链接不得入AST'
    print(json.dumps({'status': 'PASS_SYNTHETIC_ONLY', 'individualCases': len(cases), 'inertCodeCases': len(spec['inertCode']),
                      'realRepository': 'NOT_RUN', 'product': 'NOT_RUN'}, ensure_ascii=False))


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--self-test', action='store_true')
    cli.add_argument('--commit', help='固定exact commit SHA；只读Git对象')
    cli.add_argument('--out', help='可选本地JSON报告路径（默认stdout）；不会修改仓库')
    ns = cli.parse_args()
    if ns.self_test:
        selftest(); return
    if not ns.commit:
        cli.error('必须提供--self-test或--commit SHA')
    docs, tree = git_docs(ns.commit)
    result = audit_docs(docs, tree)
    counts = {s: sum(x['status'] == s for x in result) for s in sorted({x['status'] for x in result})}
    report = {'scope': 'LOCAL_GFM_SUBSET_AST_NOT_GITHUB_RENDERED', 'exactHead': ns.commit,
              'markdownCount': len(docs), 'links': len(result), 'statuses': counts,
              'unresolved': [x for x in result if not x['status'].startswith('PASS_') and x['status'] != 'EXTERNAL_NOT_CHECKED'],
              'productAcceptance': 'NOT_RUN', 'ownerSignatures': 'NOT_VERIFIED', 'l3': 'PENDING_HUMAN'}
    serialized = json.dumps(report, ensure_ascii=False, indent=2)
    if ns.out:
        with open(ns.out, 'w', encoding='utf-8') as f:
            f.write(serialized + '\n')
    else:
        print(serialized)


if __name__ == '__main__':
    main()

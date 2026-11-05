#!/usr/bin/env python3
"""B150：只读Markdown链接AST子集审计；不宣称GitHub GFM渲染器一致或产品通过。"""
import argparse
import collections
import json
import posixpath
import re
import subprocess
import sys
import unicodedata
from urllib.parse import unquote, urlsplit

def run_git(*args):
    p = subprocess.run(["git", *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode:
        raise RuntimeError(p.stderr.decode("utf-8", "replace"))
    return p.stdout

def parser():
    try:
        from markdown_it import MarkdownIt
    except ImportError as exc:
        raise RuntimeError("缺少可选markdown-it-py依赖，AST校验记NOT_RUN") from exc
    return MarkdownIt("commonmark").enable("table").enable("strikethrough")

def slug(s):
    s = s.strip().lower()
    s = "".join(c for c in s if c.isspace() or c in "-_" or not unicodedata.category(c).startswith("P"))
    return re.sub(r"\s+", "-", s)

def tokens(md, engine):
    ts = engine.parse(md)
    links, headings = [], []
    for i, t in enumerate(ts):
        if t.type == "heading_open" and i + 1 < len(ts):
            headings.append(slug(ts[i + 1].content))
        if t.type == "inline":
            for x in t.children or []:
                if x.type == "link_open":
                    links.append(x.attrGet("href") or "")
                if x.type == "image":
                    links.append(x.attrGet("src") or "")
    seen, anchors = collections.Counter(), set()
    for h in headings:
        n = seen[h]
        anchors.add(h if not n else h + "-" + str(n))
        seen[h] += 1
    return links, anchors

def resolve(source, href, tree, md_files, engine):
    if not href or href.startswith("//"):
        return "EXTERNAL_OR_EMPTY"
    parts = urlsplit(href)
    if parts.scheme:
        return "EXTERNAL_OR_EMPTY" if parts.scheme in ("http", "https", "mailto", "tel") else "UNKNOWN_SCHEME"
    path = unquote(parts.path)
    if "\x00" in path or "\\" in path:
        return "INVALID_TARGET"
    root = "" if path.startswith("/") else posixpath.dirname(source)
    dest = posixpath.normpath(posixpath.join(root, path.lstrip("/"))) if path else source
    if dest == ".." or dest.startswith("../"):
        return "OUTSIDE_REPO"
    if dest not in tree:
        return "DIRECTORY" if any(x.startswith(dest.rstrip("/") + "/") for x in tree) else "BROKEN"
    mode, _ = tree[dest]
    if mode == "120000":
        return "SYMLINK_UNKNOWN"
    if mode == "160000":
        return "GITLINK_UNKNOWN"
    if mode not in ("100644", "100755"):
        return "MODE_UNKNOWN"
    if parts.fragment:
        if not dest.lower().endswith(".md") or dest not in md_files:
            return "FRAGMENT_UNKNOWN"
        if unquote(parts.fragment) not in tokens(md_files[dest], engine)[1]:
            return "FRAGMENT_BROKEN_OR_RENDERER_DIFF"
    return "RESOLVED"

def fixtures(path):
    data = json.load(open(path, encoding="utf-8"))
    rules = {r["id"]: r for r in data["rules"]}
    tests = data["cases"]
    if len(rules) != 8 or len(tests) != 40:
        raise AssertionError("规划规则/用例数量不符合8/40")
    ids = set()
    for t in tests:
        rule = rules[t["ruleId"]]
        vals = t["values"]
        if t["id"] in ids or t["id"] not in rule["testIds"] or set(vals) != set(rule["fields"]):
            raise AssertionError("重复ID/字段缺失/映射错误：" + t["id"])
        ids.add(t["id"])
        failing = [f for f in rule["fields"] if vals[f] is not True]
        expected = rule["failure"] if failing else "PASS_SYNTHETIC"
        if t["expected"] != expected:
            raise AssertionError("期望不符合判定：" + t["id"])
        if t["type"] == "POSITIVE" and failing:
            raise AssertionError("正例包含失败字段")
        if t["type"] == "NEGATIVE_SINGLE_FIELD" and len(failing) != 1:
            raise AssertionError("负例并非恰一个变异字段")
    return len(tests)

def selftest(engine):
    files = {"docs/index.md": "# 标题\n# 标题\n[内链](guide.md) [锚](#标题-1) [图](../img/p.png)\n[引用][x]\n\n[x]: guide.md#章\n\n~~~md\n[假](missing.md)\n~~~",
             "docs/guide.md": "# 章\n", "img/p.png": "p", "docs/sym": "target"}
    tree = {x: ("120000" if x == "docs/sym" else "100644", "synthetic") for x in files}
    cases = [("docs/index.md", "guide.md", "RESOLVED"), ("docs/index.md", "#标题-1", "RESOLVED"),
             ("docs/index.md", "../img/p.png", "RESOLVED"), ("docs/index.md", "guide.md#章", "RESOLVED"),
             ("docs/index.md", "lost.md", "BROKEN"), ("docs/index.md", "../../escape", "OUTSIDE_REPO"),
             ("docs/index.md", "sym", "SYMLINK_UNKNOWN"), ("docs/index.md", "https://example.com", "EXTERNAL_OR_EMPTY")]
    for src, uri, expected in cases:
        if resolve(src, uri, tree, files, engine) != expected:
            raise AssertionError("AST链接合成断言失败：" + uri)
    if "missing.md" in tokens(files["docs/index.md"], engine)[0] or len(tokens(files["docs/index.md"], engine)[0]) != 4:
        raise AssertionError("代码围栏/引用型链接解析失败")
    return len(cases) + 1

def read_tree(ref):
    if not re.fullmatch("[0-9a-f]{40}", ref):
        raise ValueError("必须显式指定40位exact commit SHA")
    actual = run_git("rev-parse", "--verify", ref + "^{commit}").decode().strip()
    if actual != ref:
        raise AssertionError("HEAD与期望修订不一致")
    tree = {}
    for entry in run_git("ls-tree", "-r", "-z", ref).split(b"\x00"):
        if not entry:
            continue
        meta, path = entry.split(b"\t", 1)
        mode, typ, blob = meta.decode("ascii").split(" ")
        tree[path.decode("utf-8")] = (mode, blob)
    md_files = {}
    for path, (mode, blob) in tree.items():
        if path.lower().endswith(".md") and mode in ("100644", "100755"):
            md_files[path] = run_git("cat-file", "blob", blob).decode("utf-8")
    return tree, md_files

def main():
    ap = argparse.ArgumentParser(description="T5-03:固定Git HEAD的Markdown AST子集链接审计")
    ap.add_argument("--ref", help="精确40位Git commit SHA")
    ap.add_argument("--fixtures", help="B150规则/正反用例JSON")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    try:
        engine = parser()
        if a.selftest or a.fixtures:
            result = {"scope": "GFM_SUBSET_ONLY"}
            if a.selftest: result["syntheticParserAssertions"] = selftest(engine)
            if a.fixtures: result["syntheticRuleAssertions"] = fixtures(a.fixtures)
            print(json.dumps(result, ensure_ascii=False))
            return 0
        if not a.ref: raise ValueError("未给--ref，真实全仓审计NOT_RUN")
        tree, docs = read_tree(a.ref)
        records = [{"path": path, "href": href, "status": resolve(path, href, tree, docs, engine)}
                   for path, md in sorted(docs.items()) for href in tokens(md, engine)[0]]
        blockers = {"BROKEN", "OUTSIDE_REPO", "INVALID_TARGET", "FRAGMENT_BROKEN_OR_RENDERER_DIFF"}
        unknown = [r for r in records if r["status"] not in ("RESOLVED", "DIRECTORY", "EXTERNAL_OR_EMPTY")]
        result = {"head": a.ref, "gitEntries": len(tree), "markdownFiles": len(docs), "linkCount": len(records),
                  "statusCounts": dict(collections.Counter(x["status"] for x in records)), "unresolved": unknown,
                  "fullGfmRendererParity": "NOT_VERIFIED", "productAcceptance": "NOT_RUN"}
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if any(x["status"] in blockers for x in unknown) else 2 if unknown else 0
    except (RuntimeError, AssertionError, UnicodeError, ValueError) as exc:
        print(json.dumps({"status":"NOT_RUN_OR_FAILED","reason":str(exc)},ensure_ascii=False),file=sys.stderr)
        return 3

if __name__ == "__main__":
    sys.exit(main())

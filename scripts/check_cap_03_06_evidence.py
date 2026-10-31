#!/usr/bin/env python3
"""独立新建：CAP-03-06规划链路检查，非历史Python原件恢复。

用法：
  python scripts/check_cap_03_06_evidence.py --self-test
  python scripts/check_cap_03_06_evidence.py --repo-root .
仅做文档/字段/规则的静态一致性检查，不做CAD、OCCT、NC、GUI或产品验收。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from copy import deepcopy
from pathlib import Path

CAP = "CAP-03-06"
SOURCE_IDS = {f"SRC-FEDIT-{i:03d}" for i in range(1, 5)}
RULE_IDS = {f"FEDIT-R{i:02d}" for i in range(1, 11)}
PACKAGES = {"B0-02", "F1-03", "F1-04", "T5-02"}


def ensure(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def read_json(root: Path, relative: str) -> dict:
    return json.loads((root / relative).read_text(encoding="utf-8"))


def verify(source: dict, trace: dict, fixtures: dict) -> dict:
    ensure(source.get("capabilityId") == trace.get("capabilityId") == fixtures.get("capabilityId") == CAP, "能力编号不一致")
    sources = source.get("sources", [])
    rules = trace.get("rules", [])
    cases = fixtures.get("cases", [])
    ensure(source.get("registeredRecords") == len(sources) == 4, "必须有4项来源登记")
    ensure(len(rules) == trace.get("ruleCount") == 10, "规则总数应为10")
    ensure(len(cases) == trace.get("acceptanceCount") == 20, "验收总数应为20")
    by_id = {x["id"]: x for x in sources}
    by_rule = {x["id"]: x for x in rules}
    by_case = {x["id"]: x for x in cases}
    ensure(set(by_id) == SOURCE_IDS and len(by_id) == len(sources), "来源ID重复、缺失或意外扩充")
    ensure(set(by_rule) == RULE_IDS and len(by_rule) == len(rules), "规则ID重复或不连续")
    ensure(len(by_case) == len(cases) == 20, "验收ID重复")
    incoming = {sid: set() for sid in SOURCE_IDS}
    for src in sources:
        for k in ("title", "publisher", "edition", "published", "url", "accessedOn", "accessDepth", "locator", "supports", "limits", "rules"):
            ensure(src.get(k) not in (None, "", []), f"来源缺字段：{src['id']} {k}")
        ensure(src["accessDepth"] in {"catalog_abstract", "section_text", "full_text", "not_obtained"}, "阅读深度枚举异常")
        ensure(re.match(r"^https://[^?#\s]+$", src["url"]) is not None, "不允许非HTTPS或带凭据/查询参数的链接")
        ensure(src["accessedOn"] == "2026-10-19", "日期不可含糊")
    for i in range(1, 11):
        rid = f"FEDIT-R{i:02d}"
        rule = by_rule[rid]
        ensure(rule.get("target") == CAP and rule.get("statement"), f"缺规则目标/断言 {rid}")
        ensure(rule.get("fieldPaths"), f"缺来源→字段映射 {rid}")
        ensure(rule.get("sourceIds") and set(rule["sourceIds"]) <= SOURCE_IDS, f"来源未注册 {rid}")
        ensure(rule.get("workPackageIds") and set(rule["workPackageIds"]) <= PACKAGES, f"原工作包编号错误 {rid}")
        for sid in rule["sourceIds"]:
            incoming[sid].add(rid)
        for num, kind, attr in ((2*i-1, "positive", "positiveAcceptanceId"), (2*i, "negative", "negativeAcceptanceId")):
            cid = f"{CAP}-T{num:02d}"
            ensure(rule.get(attr) == cid and cid in by_case, f"测试缺失或映射错误 {cid}")
            case = by_case[cid]
            ensure(case.get("ruleId") == rid and case.get("polarity") == kind, f"验收规则或正反标签错误 {cid}")
            ensure(case.get("execution") == "NOT_RUN_PRODUCT", f"不得将规划检查伪装产品PASS {cid}")
            ensure(all(case.get(k) for k in ("given", "when", "then", "evidenceRequired")), f"验收输入/动作/断言缺失 {cid}")
            if kind == "negative":
                ensure(case.get("expectedStatus") == "REJECT_OR_FAIL_CLOSED", f"反例必须拒绝/保守关闭 {cid}")
    expected_cases = {f"{CAP}-T{i:02d}" for i in range(1, 21)}
    ensure(set(by_case) == expected_cases, "验收存在孤立或跳号")
    for source_id, expected_rules in incoming.items():
        ensure(set(by_id[source_id]["rules"]) == expected_rules, f"来源反向规则映射不闭合 {source_id}")
    return {"status": "PASS_PLANNING_ONLY", "sourceRecords": 4, "rules": 10, "positive": 10, "negative": 10, "productAcceptance": "NOT_RUN"}


def self_test() -> int:
    base = Path(__file__).resolve().parents[1]
    sources = read_json(base, "research/sources/CAP-03-06.json")
    rules = []
    source_rules = {s["id"]: set(s["rules"]) for s in sources["sources"]}
    cases = []
    for i in range(1, 11):
        rid = f"FEDIT-R{i:02d}"
        rules.append({"id": rid, "target": CAP, "statement": f"规则{i}", "fieldPaths": ["sourceRef"],
                      "sourceIds": sorted(k for k, vals in source_rules.items() if rid in vals),
                      "workPackageIds": ["B0-02"],
                      "positiveAcceptanceId": f"{CAP}-T{2*i-1:02d}", "negativeAcceptanceId": f"{CAP}-T{2*i:02d}"})
        for num, polarity in ((2*i-1, "positive"), (2*i, "negative")):
            cases.append({"id": f"{CAP}-T{num:02d}", "ruleId": rid, "polarity": polarity,
                          "execution": "NOT_RUN_PRODUCT", "expectedStatus": "REJECT_OR_FAIL_CLOSED" if polarity == "negative" else "ACCEPT_OR_REVIEW",
                          "given": "独立测试输入", "when": "通过真实接口运行", "then": "应检查指定结果", "evidenceRequired": ["源码和模型SHA"]})
    trace = {"capabilityId": CAP, "rules": rules, "ruleCount": 10, "acceptanceCount": 20}
    fixtures = {"capabilityId": CAP, "cases": cases}
    verify(sources, trace, fixtures)
    mutations = {
        "duplicate_source": lambda a,b,c: a["sources"].__setitem__(1, dict(a["sources"][1], id=a["sources"][0]["id"])),
        "missing_source": lambda a,b,c: b["rules"][0].__setitem__("sourceIds", ["SRC-UNKNOWN"]),
        "missing_fields": lambda a,b,c: b["rules"][0].__setitem__("fieldPaths", []),
        "wrong_owner": lambda a,b,c: b["rules"][0].__setitem__("target", "CAP-OTHER"),
        "false_pass": lambda a,b,c: c["cases"][0].__setitem__("execution", "PASS"),
        "wrong_negative": lambda a,b,c: c["cases"][1].__setitem__("polarity", "positive"),
        "orphan_case": lambda a,b,c: c["cases"][1].__setitem__("ruleId", "FEDIT-R99"),
        "unsafe_url": lambda a,b,c: a["sources"][0].__setitem__("url", a["sources"][0]["url"]+"?token=bad"),
    }
    for name, mutate in mutations.items():
        a,b,c = map(deepcopy, (sources,trace,fixtures))
        mutate(a,b,c)
        try:
            verify(a,b,c)
        except ValueError:
            continue
        raise AssertionError(f"变异未拒绝：{name}")
    print(json.dumps({"status": "PASS_SELF_TEST_ONLY", "mutationsRejected": len(mutations), "productAcceptance": "NOT_RUN"}, ensure_ascii=False))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", default=None)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    root = Path(args.repo_root).resolve() if args.repo_root else Path(__file__).resolve().parents[1]
    result = verify(read_json(root, "research/sources/CAP-03-06.json"),
                    read_json(root, "research/traces/CAP-03-06.json"),
                    read_json(root, "docs/capabilities/CAP-03-06/fixtures.json"))
    print(json.dumps(result, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as err:
        print(f"FAIL_PLANNING: {err}", file=sys.stderr)
        sys.exit(1)
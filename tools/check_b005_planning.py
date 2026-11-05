#!/usr/bin/env python3
"""B0-05独立规划结构校验，绝不判定产品测试。"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))

def check():
    src = load("research/sources/B0-05.json")
    trace = load("research/traces/B0-05.json")
    fixture = load("docs/work-packages/B0-05/fixtures.json")
    assert src["registeredRecords"] == len(src["sources"]) == 7
    sources = {x["id"] for x in src["sources"]}
    assert len(sources) == 7
    assert len(trace["rules"]) == 10
    ids = {x["ruleId"] for x in trace["rules"]}
    assert len(ids) == 10
    cases = fixture["scenarios"]
    assert len(cases) == 20
    cdict = {x["id"]: x for x in cases}
    assert len(cdict) == 20
    for rule in trace["rules"]:
        assert set(rule["sourceIds"]).issubset(sources), rule
        assert rule["fieldRefs"], rule
        assert rule["workPackage"] == "B0-05"
        assert rule["workSubtask"].startswith("B0-05-S")
        for key, polarity in (("positiveAcceptance", "positive"), ("negativeAcceptance", "negative")):
            case = cdict[rule[key]]
            assert case["ruleId"] == rule["ruleId"]
            assert case["polarity"] == polarity
            assert case["productStatus"] == "NOT_RUN"
            assert case["evidenceRequired"]
    assert all(x["ruleId"] in ids for x in cases)
    assert trace["productTests"] == fixture["productExecution"] == "NOT_RUN"
    print("PLANNING_PASS B0-05: 7 sources, 10 rules, 20 positive/negative cases; PRODUCT_NOT_RUN")
if __name__ == "__main__":
    check()

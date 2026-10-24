#!/usr/bin/env python3
"""W2-01规划规则、正反用例及基线Owner静态校验；不启动产品/CI。"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))
src=load("research/sources/W2-01.json")
trace=load("research/traces/W2-01.json")
fx=load("docs/work-packages/W2-01/fixtures.json")
owner=load("docs/work-packages/W2-01/asset-owner-consumer-matrix.json")
baseline=load("docs/architecture/v0.8/business-assets.json")
states=load("docs/work-packages/W2-01/workflow-state.json")
assert len(src["sources"])==8 and src["registeredRecords"]==8
assert len(trace["rules"])==10 and len(fx["cases"])==20
assert {x["assetId"] for x in owner["assets"]}=={x["id"] for x in baseline["assets"]}
assert all(x["signoff"]=="PENDING_HUMAN_CROSS_DOMAIN" for x in owner["assets"])
source_ids={s["id"] for s in src["sources"]}
cases={c["id"]:c for c in fx["cases"]}
def result(gates,rule):
    if not gates[rule["fixtureGate"]]:
        return ("UNKNOWN" if rule["fixtureGate"]=="aMinimalInputs" else "REJECTED",rule["failureCode"])
    return ("DRAFT_HANDOFF_ONLY","HANDOFF_DRAFT_ONLY")
assert len(cases)==20
for rule in trace["rules"]:
    assert rule["sourceIds"] and set(rule["sourceIds"])<=source_ids
    assert rule["fields"] and rule["assets"]
    for polarity, test_id in (("positive",rule["positiveTestId"]),("negative",rule["negativeTestId"])):
        case=cases[test_id]
        assert case["polarity"]==polarity and case["ruleId"]==rule["id"]
        gate=case["input"]["gates"]
        assert gate[rule["fixtureGate"]]==(polarity=="positive")
        assert sum(v is False for v in gate.values())==(0 if polarity=="positive" else 1)
        assert result(gate,rule)==(case["expected"]["status"],case["expected"]["reason"])
        assert case["product"]=="NOT_RUN" and case["expected"]["mayPublish"] is False
        # 故意错误变异：翻转当条核心前置条件，结论必须变化。
        mutation=dict(gate)
        mutation[rule["fixtureGate"]]=not mutation[rule["fixtureGate"]]
        assert result(mutation,rule)!=(case["expected"]["status"],case["expected"]["reason"])
assert "CANCELLED->COMMITTED_DRAFT" in states["forbidden"]
assert "COMMITTED_DRAFT->D16_RELEASED" in states["forbidden"]
print("PASS W2-01: 8 sources, 10 rule chains, 20 cases, 20 mutated negatives, 17 unsigned baseline owners; PRODUCT NOT_RUN")

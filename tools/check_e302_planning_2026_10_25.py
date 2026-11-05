#!/usr/bin/env python3
"""E3-02规划静态与正反合成规则校验，不执行产品NC。"""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def read(x):return json.loads((root/x).read_text(encoding="utf8"))
s=read("research/sources/E3-02.json");t=read("research/traces/E3-02.json");f=read("docs/work-packages/E3-02/fixtures.json");o=read("docs/work-packages/E3-02/asset-owner-consumer-matrix.json")
ids={x["id"] for x in s["sources"]};cases={x["id"]:x for x in f["cases"]}
assert len(ids)==9 and len(t["rules"])==10 and len(cases)==20 and len(o["assets"])==17
for r in t["rules"]:
    assert set(r["sourceIds"])<=ids and r["fields"] and r["assets"]
    for ok,cid in [(True,r["positiveTestId"]),(False,r["negativeTestId"])]:
        c=cases[cid]
        assert c["ruleId"]==r["id"] and c["gates"][r["fixtureGate"]]==ok
        assert all(c["gates"].values())==ok
        assert c["expectedCode"]==("D12_PLANNING_ONLY_NOT_PRODUCT_PASS" if ok else r["failureCode"])
assert all(not x["signedOff"] for x in o["assets"])
assert all(x["product"]=="NOT_RUN" for x in cases.values())
print("PASS: 9 sources, 10 rules, 20 positive/negative, 17 unsigned owners; PRODUCT NOT_RUN")

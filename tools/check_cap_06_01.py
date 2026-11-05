#!/usr/bin/env python3
# 原CAP-06-01规划追踪/正反合成校验：不运行Solver、OCCT或产品数据库。
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def read(x): return json.loads((R/x).read_text(encoding="utf-8"))
t=read("research/traces/CAP-06-01.json")
s=read("research/sources/CAP-06-01.json")
f=read("docs/capabilities/CAP-06-01/fixtures.json")
a=read("docs/capabilities/CAP-06-01/asset-owner-candidates.json")
b=read("docs/architecture/v0.8/business-assets.json")
assert len(t["rules"])==10 and len(f["cases"])==20 and len(s["sources"])==s["registeredRecords"]==10
assert {x["assetId"]:x["baselineBusinessOwner"] for x in a["assets"]}=={x["id"]:x["owner"] for x in b["assets"]}
ids={x["id"] for x in s["sources"]}
assert len(ids)==10
seen=set()
for rule in t["rules"]:
    assert rule["capabilityId"]=="CAP-06-01" and rule["sourceIds"] and all(v in ids for v in rule["sourceIds"]) and rule["assets"] and rule["field"]
    for test_id,expected in ((rule["positiveTestId"],True),(rule["negativeTestId"],False)):
        assert test_id not in seen
        seen.add(test_id)
        items=[x for x in f["cases"] if x["id"]==test_id]
        assert len(items)==1
        x=items[0]
        assert x["ruleId"]==rule["id"] and x["expectedAccepted"] is expected and x["input"]["property"]==rule["field"]
        value=x["input"]["value"]
        actual=(value is not None) if rule["operator"]=="present" else (value==rule["passValue"])
        assert actual is expected, test_id
        assert x["expectedCode"]==("SYNTHETIC_ELIGIBLE" if expected else rule["failureCode"])
assert len(seen)==20
print("CAP-06-01 合成规划追踪10规则/20正反/10来源/17候选Owner PASS；产品NOT_RUN")

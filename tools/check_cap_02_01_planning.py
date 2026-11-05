#!/usr/bin/env python3
# 机床资源规划结构校验，规划PASS不等于产品PASS
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def get(p): return json.loads((R/p).read_text(encoding="utf-8"))
def main():
 s=get("research/sources/CAP-02-01.json");t=get("research/traces/CAP-02-01.json");f=get("docs/capabilities/CAP-02-01/fixtures.json")
 ids={v["id"] for v in s["sources"]};assert len(ids)==s["registeredRecords"]==7
 assert len(t["rules"])==10 and len(f["scenarios"])==f["scenarioCount"]==20
 assert len(f["legacyAcceptanceIdsPreserved"])==8
 tests={v["id"]:v for v in f["scenarios"]};assert len(tests)==20
 for r in t["rules"]:
  assert r["fields"] and r["assets"] and r["workPackages"] and set(r["sourceIds"])<=ids
  pair=[tests[k] for k in r["tests"]]
  assert {x["polarity"] for x in pair}=={"positive","negative"}
  assert all(r["id"] in x["ruleIds"] and x["productStatus"]=="NOT_RUN" for x in pair)
  n=next(x for x in pair if x["polarity"]=="negative")
  assert n["expectedOutcome"]=="REJECT" and n["expectedError"]==r["failureCode"]
 print("PASS 7/10/20；产品NOT_RUN")
if __name__=="__main__":main()

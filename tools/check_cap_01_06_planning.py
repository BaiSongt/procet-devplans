#!/usr/bin/env python3
"""CAP-01-06静态校验：来源、规则、字段、双向验收；不运行产品代码。"""
import json, copy, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(p): return json.loads((ROOT/p).read_text(encoding="utf-8"))
def check(s,t,f):
 a={x["id"] for x in s["sources"]};b={x["id"] for x in t["rules"]};c={x["id"]:x for x in f["cases"]}
 assert len(a)==8 and len(b)==10 and len(c)==20 and s["registeredRecords"]==8
 assert f["preservedLegacyIds"]==[f"CAP-01-06-AT-{i:02d}" for i in range(1,9)]
 assert t["capabilityId"]==f["capabilityId"]=="CAP-01-06"
 for x in s["sources"]: assert x["url"] and x["accessDepth"] and x["locator"] and x["limits"]
 for r in t["rules"]:
  assert set(r["sourceIds"])<=a and len(r["fields"])>=2 and r["workPackages"] and r["assets"]
  assert len(r["tests"])>=2 and set(r["tests"])<=set(c)
  assert {c[v]["polarity"] for v in r["tests"]}>={"positive","negative"}
  assert r["productAcceptance"]=="NOT_RUN"
 for q in f["cases"]:
  assert q["ruleIds"] and set(q["ruleIds"])<=b and q["productStatus"]==q["execution"]=="NOT_RUN"
  assert all(q["id"] in next(x for x in t["rules"] if x["id"]==rid)["tests"] for rid in q["ruleIds"])
  assert all(q[v] for v in ("given","when","then","expectedCode"))
 assert t["productAcceptance"]=="NOT_RUN"
if __name__=="__main__":
 s=read("research/sources/CAP-01-06.json");t=read("research/traces/CAP-01-06.json");f=read("docs/capabilities/CAP-01-06/fixtures.json");check(s,t,f)
 if "--self-test" in sys.argv:
  bad=[(copy.deepcopy(s),copy.deepcopy(t),copy.deepcopy(f)) for _ in range(3)]
  bad[0][0]["sources"].pop();bad[1][1]["rules"][0]["sourceIds"]=["UNKNOWN"];bad[2][2]["cases"][8]["polarity"]="positive"
  for a,b,c in bad:
   try: check(a,b,c)
   except (AssertionError,KeyError,StopIteration): continue
   raise AssertionError("错误变异未检出")
 print("CAP-01-06规划关系PASS；产品验收NOT_RUN")

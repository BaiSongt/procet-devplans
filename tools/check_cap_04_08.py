#!/usr/bin/env python3
"""CAP-04-08 规划来源→规则→字段→正反验收静态校验。产品功能不在此验证。"""
import copy
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = ROOT / "docs/capabilities/CAP-04-08"

def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))

def check(src, trace, fixture, impact):
    errors = []
    sid = [s["id"] for s in src["sources"]]
    rules = trace["rules"]
    rid = [r["id"] for r in rules]
    tests = fixture["scenarios"]
    tid = [t["id"] for t in tests]
    if len(sid) != 7 or len(set(sid)) != 7 or src["registeredRecords"] != 7:
        errors.append("SOURCE_COUNT_OR_DUPLICATE")
    if len(rid) != 10 or len(set(rid)) != 10:
        errors.append("RULE_COUNT_OR_DUPLICATE")
    if len(tid) != 20 or len(set(tid)) != 20:
        errors.append("TEST_COUNT_OR_DUPLICATE")
    for r in rules:
        attached = [t for t in tests if r["id"] in t.get("ruleIds", [])]
        if len(attached) != 2 or {t["polarity"] for t in attached} != {"positive","negative"}:
            errors.append("POLARITY:"+r["id"])
        if not r.get("fields") or not r.get("workPackages") or not r.get("assets"):
            errors.append("FIELD_OR_OWNER:"+r["id"])
        if any(x not in sid for x in r.get("sourceIds", [])):
            errors.append("MISSING_RULE_SOURCE:"+r["id"])
        if set(r["tests"]) != {t["id"] for t in attached}:
            errors.append("TEST_EDGE:"+r["id"])
    for t in tests:
        if t["ruleIds"][0] not in rid or any(s not in sid for s in t["sourceIds"]):
            errors.append("MISSING_TEST_REFERENCE:"+t["id"])
        if not t.get("testEntry") or t.get("productStatus") != "NOT_RUN":
            errors.append("EXECUTION_BOUNDARY:"+t["id"])
        if t["polarity"] == "negative" and t.get("expectedOutcome") != "REJECT":
            errors.append("NEGATIVE_NOT_REJECTED:"+t["id"])
    if impact.get("capabilityId") != "CAP-04-08" or len(impact.get("changeClasses",[])) != 4:
        errors.append("IMPACT_MATRIX")
    return errors

def main():
    src=load("research/sources/CAP-04-08.json")
    tr=load("research/traces/CAP-04-08.json")
    fx=load("docs/capabilities/CAP-04-08/fixtures.json")
    mx=load("docs/capabilities/CAP-04-08/impact-matrix.json")
    assert not check(src,tr,fx,mx), check(src,tr,fx,mx)
    # 七次故意错误变异必须被识别
    for i in range(7):
        a,b,c,d=map(copy.deepcopy,(src,tr,fx,mx))
        if i==0: a["sources"][1]["id"]=a["sources"][0]["id"]
        if i==1: b["rules"][0]["sourceIds"]=["NO_SUCH_SOURCE"]
        if i==2: b["rules"][0]["fields"]=[]
        if i==3: c["scenarios"][0]["polarity"]="negative"
        if i==4: c["scenarios"][1]["expectedOutcome"]="ACCEPT"
        if i==5: c["scenarios"][0]["productStatus"]="PASS"
        if i==6: d["changeClasses"]=[]
        assert check(a,b,c,d), "变异未被识别: "+str(i)
    print(json.dumps({"status":"PASS_STATIC_ONLY","sources":7,"rules":10,"cases":20,
                      "mutationTests":7,"product":"NOT_RUN","L3":"PENDING"},ensure_ascii=False))
if __name__ == "__main__":
    try: main()
    except Exception as exc:
        print("FAIL_STATIC_ONLY:",str(exc),file=sys.stderr)
        raise

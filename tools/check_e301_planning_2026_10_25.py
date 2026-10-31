#!/usr/bin/env python3
# 本工具只做规划文件、来源、正反规则及纯数学向量检查，不连接产品/用户库。
import json, math, pathlib, sys
P = pathlib.Path(__file__).resolve().parents[1]
def get(p): return json.loads((P/p).read_text(encoding="utf-8"))
def check():
    s=get("research/sources/E3-01.json"); t=get("research/traces/E3-01.json")
    f=get("docs/work-packages/E3-01/fixtures.json"); g=get("docs/work-packages/E3-01/geometry-vectors.json")
    o=get("docs/work-packages/E3-01/asset-owner-consumer-matrix.json")
    ids={x["id"] for x in s["sources"]}
    assert len(ids)==len(s["sources"])==s["registeredRecords"]==8
    assert len(t["rules"])==10 and len(f["cases"])==20 and len(f["gateKeys"])==10
    assert len({r["id"] for r in t["rules"]})==10 and len({z["id"] for z in f["cases"]})==20
    fx={x["id"]:x for x in f["cases"]}; gates=set(f["gateKeys"])
    for x in s["sources"]:
        assert all(x.get(k) for k in ("title","authors","publisher","edition","published","url","accessedOn","accessDepth","locator","limits"))
    for r in t["rules"]:
        p=fx[r["positiveTestId"]]; n=fx[r["negativeTestId"]]; k=r["fixtureGate"]
        assert k in gates and set(r["sourceIds"])<=ids and r["fields"] and r["assets"]
        assert p["ruleId"]==r["id"]==n["ruleId"] and p["polarity"]=="positive" and n["polarity"]=="negative"
        assert set(p["gates"])==gates==set(n["gates"])
        assert all(p["gates"].values()) and [z for z,v in n["gates"].items() if not v]==[k]
        assert n["expectedCode"]==r["failureCode"] and p["product"]==n["product"]=="NOT_RUN"
    assert len(o["assets"])==17 and [a["id"] for a in o["assets"]]==["D%02d"%i for i in range(1,18)]
    assert all(a["approval"]=="PENDING_CROSS_DOMAIN_REVIEW" for a in o["assets"])
    assert len(g["arcCases"])==6 and len(g["linkCases"])==4
    for a in g["arcCases"]:
        q,e,c=a["start"],a["end"],a["center"]
        r1=math.hypot(q[0]-c[0],q[1]-c[1]);r2=math.hypot(e[0]-c[0],e[1]-c[1])
        v=("DEGENERATE_RADIUS" if min(r1,r2)<=g["tolerance"] else
           "RADIUS_MISMATCH" if abs(r1-r2)>g["tolerance"] else
           "HELIX_REQUIRED" if a["kind"]=="ARC" and abs(q[2]-e[2])>g["tolerance"] else "VALID")
        assert v==a["expected"],a["id"]
    for x in g["linkCases"]:
        v="LINK_CONTRACT_CANDIDATE_ONLY" if x["clearanceKnown"] and x["frameExact"] and x["strategySupported"] else "UNKNOWN_NOT_SAFE"
        assert v==x["expected"]
    assert t["productAcceptance"]=="NOT_RUN"
    print("PLANNING_PASS: 8 source / 10 rules / 20 positive-negative / 6 geometry / 4 link / 17 owner candidates. PRODUCT_NOT_RUN")
if __name__=="__main__":
    try: check()
    except Exception as exc: print("PLANNING_FAIL:",repr(exc),file=sys.stderr);sys.exit(1)

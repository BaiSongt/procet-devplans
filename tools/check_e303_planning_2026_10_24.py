#!/usr/bin/env python3
"""E3-03规划静态检查：验证来源、规则、字段门和20个合成正反例。非NC解释器。"""
import argparse
import json
from pathlib import Path
import copy
import hashlib
import sys

def load(root, path):
    return json.loads((root / path).read_text(encoding="utf-8"))

def check_gate(rule, sample):
    field = rule["fixtureGate"]
    if sample.get(field) is not True:
        return {"status": rule["negativeStatus"], "reason": rule["failureCode"]}
    return {"status": "READY_FOR_D14", "reason": "OK"}

def check(root, self_test=False):
    source = load(root,"research/sources/E3-03.json")
    trace = load(root,"research/traces/E3-03.json")
    fixtures = load(root,"docs/work-packages/E3-03/fixtures.json")
    owners = load(root,"docs/work-packages/E3-03/asset-owner-consumer-matrix.json")
    baseline = load(root,"docs/architecture/v0.8/business-assets.json")
    rules=trace["rules"]
    cases=fixtures["cases"]
    sources=source["sources"]
    assert len(sources)==source["registeredRecords"]==9
    assert len(rules)==10 and len(cases)==fixtures["count"]==20
    ids=[s["id"] for s in sources]
    assert len(set(ids))==9
    for s in sources:
        assert s["url"].startswith("https://")
        assert s["accessDepth"] in {"catalog_abstract","section_text"}
        assert s["authors"] and s["edition"] and s["locator"] and s["limits"]
    assert [x["id"] for x in owners["assets"]]==[x["id"] for x in baseline["assets"]]
    assert all(x["signature"]=="PENDING_HUMAN" for x in owners["assets"])
    rs={r["id"]:r for r in rules}
    assert len(rs)==10
    cs={c["id"]:c for c in cases}
    assert len(cs)==20
    positive=negative=mutants=0
    for r in rules:
        assert r["sourceIds"] and set(r["sourceIds"]).issubset(ids)
        assert r["fields"] and r["assets"] and r["fixtureGate"]
        assert r["positiveTestId"] in cs and r["negativeTestId"] in cs
        for tid,pol in [(r["positiveTestId"],"positive"),(r["negativeTestId"],"negative")]:
            c=cs[tid]
            assert c["ruleId"]==r["id"] and c["polarity"]==pol
            assert check_gate(r,c["input"])==c["expected"],tid
            positive+=pol=="positive"
            negative+=pol=="negative"
        if self_test:
            bad=copy.deepcopy(cs[r["positiveTestId"]])
            bad["input"][r["fixtureGate"]]=False
            assert check_gate(r,bad["input"])==cs[r["negativeTestId"]]["expected"]
            mutants+=1
    canonical=fixtures["exampleNC"]
    assert hashlib.sha256(canonical["program"].encode("utf-8")).hexdigest()==canonical["sha256"]
    assert canonical["bytesEncoding"]=="UTF-8_NO_TRAILING_NEWLINE"
    print(json.dumps({"result":"PASS","scope":"PLANNING_SYNTHETIC_ONLY","rules":len(rules),"sources":len(sources),"positive":positive,"negative":negative,"mutants":mutants,"owners":len(owners["assets"]),"product":"NOT_RUN"},ensure_ascii=False))
    return True

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--root",default=".")
    parser.add_argument("--self-test",action="store_true")
    args=parser.parse_args()
    try:
        check(Path(args.root),args.self_test)
    except (AssertionError,KeyError,ValueError,OSError,TypeError) as exc:
        print("FAIL: %s"%exc,file=sys.stderr)
        sys.exit(1)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""仅检查CAP-01-08规划追踪，不是产品测试。"""
import json
from pathlib import Path

def check(root):
    j=lambda p:json.loads((root/p).read_text(encoding="utf-8"))
    s=j("research/sources/CAP-01-08.json")
    t=j("research/traces/CAP-01-08.json")
    f=j("docs/capabilities/CAP-01-08/fixtures.json")
    idx=j("research/source-index.json")
    assert len(s["sources"])==7 and len(t["rules"])==10 and len(f["scenarios"])==20
    ss={x["id"] for x in s["sources"]}
    tt={x["id"] for x in f["scenarios"]}
    assert len(ss)==7 and len(tt)==20
    assert sum(x["kind"]=="positive" for x in f["scenarios"])==10
    assert sum(x["kind"]=="negative" for x in f["scenarios"])==10
    cover=set()
    for r in t["rules"]:
        assert r["fields"] and r["assets"] and r["workPackages"] and set(r["sourceIds"])<=ss and set(r["tests"])<=tt
        cover.update(r["tests"])
    assert cover==tt and all(x["ruleIds"] for x in f["scenarios"])
    assert len([r for r in idx["registries"] if r["path"]=="research/sources/CAP-01-08.json"])==1
    assert idx["registeredRecords"]==sum(r["registeredRecords"] for r in idx["registries"])
    print("PASS planning; PRODUCT NOT_RUN")

if __name__=="__main__":check(Path(__file__).resolve().parents[1])

#!/usr/bin/env python3
"""CAP-01-07规划静态交叉校验：与产品验收完全分离。"""
import json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def load(p):return json.loads((ROOT/p).read_text(encoding="utf-8"))
def check(source,trace,fixtures):
    sources=source["sources"];rules=trace["rules"];tests=fixtures["cases"]
    def req(ok,msg):
        if not ok:raise AssertionError(msg)
    ids=[s["id"] for s in sources];tid=[t["id"] for t in tests]
    req(len(ids)==7 and len(set(ids))==7,"来源数量或ID重复")
    req(len(rules)==10 and len(tests)==20 and len(set(tid))==20,"规则/验收数量或ID")
    req(fixtures["preservedLegacyIds"]==[f"CAP-01-07-AT-{i:02d}" for i in range(1,9)],"原AT不可改")
    covered=set()
    for r in rules:
        req(r["sourceIds"] and set(r["sourceIds"])<=set(ids),"未登记来源")
        req(bool(r.get("fields")),"无字段映射")
        links=r["tests"];req(len(links)==2 and set(links)<=set(tid),"验收缺失")
        polarity={next(t["polarity"] for t in tests if t["id"]==a) for a in links}
        req(polarity=={"positive","negative"},"同规则必须包含正反例")
        covered.update(links)
    req(covered==set(tid),"游离验收")
    req(all(t["productStatus"]=="NOT_RUN" and t["execution"]=="NOT_RUN" for t in tests),"冒充产品验收")
    req(all(s.get("locator") and s.get("limits") and s.get("url") for s in sources),"来源元数据")
    return {"status":"PASS_PLANNING_STRUCTURE_ONLY","rules":10,"tests":20,"sources":7,"product":"NOT_RUN"}
def main():
    print(json.dumps(check(load("research/sources/CAP-01-07.json"),load("research/traces/CAP-01-07.json"),load("docs/capabilities/CAP-01-07/fixtures.json")),ensure_ascii=False))
if __name__=="__main__":main()

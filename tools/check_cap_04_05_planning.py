#!/usr/bin/env python3
# 仅校验规划文档追踪及合成刚体矩阵，不代表实际产品验收。
import copy
import json
import math
import pathlib
import sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
def read(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))
def validate(trace, cases, registry, mathcase):
    errors = []
    sources = {s["id"]: s for s in registry.get("sources", [])}
    rules = {r["id"]: r for r in trace.get("rules", [])}
    scenarios = {c["id"]: c for c in cases.get("scenarios", [])}
    if len(sources) != 8 or len(rules) != 10 or len(scenarios) != 20:
        errors.append("expected_8_sources_10_rules_20_cases")
    if len(set(registry.get("sources", [])[i]["id"] for i in range(len(registry.get("sources", []))))) != len(registry.get("sources", [])):
        errors.append("duplicate_source")
    if set(trace.get("registeredSources", [])) != set(sources):
        errors.append("unregistered_source")
    if trace.get("productAcceptance") != "NOT_RUN" or cases.get("productAcceptance") != "NOT_RUN":
        errors.append("product_status_must_remain_not_run")
    for r in rules.values():
        if not r.get("fields") or not r.get("workPackages") or not r.get("assets"):
            errors.append("rule_missing_field_or_asset:"+r["id"])
        if not set(r.get("sourceIds", [])).issubset(sources):
            errors.append("rule_missing_source:"+r["id"])
        cc = [scenarios.get(x) for x in r.get("tests", [])]
        if len(cc) != 2 or any(x is None for x in cc):
            errors.append("rule_missing_case_pair:"+r["id"])
        elif {x.get("polarity") for x in cc} != {"positive","negative"}:
            errors.append("rule_case_polarity:"+r["id"])
    for c in scenarios.values():
        if not set(c.get("ruleIds", [])).issubset(rules):
            errors.append("case_missing_rule:"+c["id"])
        if not set(c.get("sourceIds", [])).issubset(sources):
            errors.append("case_missing_source:"+c["id"])
        for rid in c.get("ruleIds", []):
            if rid in rules:
                r=rules[rid]
                if c["id"] not in r.get("tests", []) or not set(r["fields"]).issubset(c.get("fields", [])):
                    errors.append("case_rule_field_disconnect:"+c["id"])
        want = "ACCEPT" if c.get("polarity") == "positive" else "REJECT"
        if c.get("expectedOutcome") != want or c.get("productStatus") != "NOT_RUN":
            errors.append("case_outcome_or_status:"+c["id"])
    m = mathcase["stage2"]["T_S2_P"]
    p = mathcase["sample"]["partPoint"]
    actual = [sum(m[i][j]*p[j] for j in range(4)) for i in range(4)]
    if any(abs(a-b)>1e-9 for a,b in zip(actual, mathcase["sample"]["stage2Point"])):
        errors.append("wrong_transform_order")
    rr=[row[:3] for row in m[:3]]
    det=(rr[0][0]*(rr[1][1]*rr[2][2]-rr[1][2]*rr[2][1])
        -rr[0][1]*(rr[1][0]*rr[2][2]-rr[1][2]*rr[2][0])
        +rr[0][2]*(rr[1][0]*rr[2][1]-rr[1][1]*rr[2][0]))
    if not math.isclose(det,1,abs_tol=1e-9):
        errors.append("non_right_handed")
    return errors
def main():
    t=read("research/traces/CAP-04-05.json")
    c=read("docs/capabilities/CAP-04-05/fixtures.json")
    s=read("research/sources/CAP-04-05.json")
    m=read("docs/capabilities/CAP-04-05/transfer-examples.json")
    errors=validate(t,c,s,m)
    if errors: raise SystemExit("FAIL: "+", ".join(errors))
    if "--self-test" in sys.argv:
        mutants=[]
        f=copy.deepcopy(c); f["scenarios"][0]["sourceIds"]=["GHOST"]; mutants.append((t,f,s,m))
        f=copy.deepcopy(c); f["scenarios"][1]["polarity"]="positive"; mutants.append((t,f,s,m))
        f=copy.deepcopy(c); f["scenarios"][3]["expectedOutcome"]="ACCEPT"; mutants.append((t,f,s,m))
        f=copy.deepcopy(c); f["scenarios"][0]["fields"]=[]; mutants.append((t,f,s,m))
        f=copy.deepcopy(c); f["productAcceptance"]="PASS"; mutants.append((t,f,s,m))
        z=copy.deepcopy(t); z["rules"][0]["tests"]=["CAP-04-05-T01"]; mutants.append((z,c,s,m))
        z=copy.deepcopy(t); z["registeredSources"]=z["registeredSources"][:-1]; mutants.append((z,c,s,m))
        k=copy.deepcopy(m); k["stage2"]["T_S2_P"][0][0]=1; mutants.append((t,c,s,k))
        for i, candidate in enumerate(mutants,1):
            if not validate(*candidate): raise SystemExit("MUTATION_ESCAPE_"+str(i))
        print("PASS 8 deliberate fault mutations rejected; still NOT_RUN product")
    print("PASS planning trace 8 sources, 10 rules, 20 cases, example; product NOT_RUN")
if __name__ == "__main__": main()

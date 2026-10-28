#!/usr/bin/env node
// 仅校验CAP-02-06规划JSON与合成案例，不能替代产品/计量测试。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const reg=read("research/sources/CAP-02-06.json"),t=read("research/traces/CAP-02-06-v08-supplement.json");
const f=read("docs/capabilities/CAP-02-06/research-fixtures-v08.json"),idx=read("research/source-index.json"),progress=read("tracking/progress.json");
const at=(o,k)=>k.split(".").reduce((v,p)=>v?.[p],o),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const accepts=(r,x)=>r.criteria.every(c=>c.op==="eq"&&same(at(x,c.path),c.value));
assert.equal(reg.registeredRecords,8);assert.equal(t.rules.length,10);
assert.equal(f.positives.length,10);assert.equal(f.negatives.length,40);assert.equal(f.mathCases.length,4);
assert.equal(idx.registeredRecords,idx.registries.reduce((s,r)=>s+r.registeredRecords,0));
assert.equal(progress.research.registeredSources,idx.registeredRecords);
assert.equal(idx.registries.filter(r=>r.path==="research/sources/CAP-02-06.json").length,1);
for(const r of t.rules){
assert.equal(r.criteria.length,4);assert.deepEqual(r.fields,r.criteria.map(c=>c.path));
for(const id of r.sourceIds)assert.ok(reg.sources.some(s=>s.id===id),id);
const p=f.positives.find(x=>x.ruleId===r.id);assert.ok(p&&accepts(r,p.input));
const ns=f.negatives.filter(x=>x.ruleId===r.id);assert.equal(ns.length,4);
for(const n of ns){assert.ok(!accepts(r,n.input),n.id);
const diffs=r.criteria.filter(c=>!same(at(n.input,c.path),at(p.input,c.path)));
assert.equal(diffs.length,1);assert.equal(diffs[0].path,n.mutatedField);}
}
for(const q of f.mathCases){
const value=q.kind==="UM_TO_MM"?q.input.um/1000:q.kind==="STANDARD_UC"?Math.sqrt(q.input.u1**2+q.input.u2**2+2*q.input.cov):"INDETERMINATE";
const expected=Object.values(q.expected)[0];assert.ok(typeof value==="number"?Math.abs(value-expected)<1e-11:value===expected,q.id);
}
assert.ok(f.statusScenarios.every(x=>x.execution==="NOT_RUN"));
console.log("CAP-02-06规划合成54/54 PASS; 状态8仅设计；产品与真实消费者NOT_RUN");

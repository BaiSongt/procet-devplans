#!/usr/bin/env node
// T5-01中文校验工具：仅针对规划JSON字段合成验收，不能替代产品/权限/LLM实测。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const traces=load("research/traces/T5-01.json"),registry=load("research/sources/T5-01.json");
const fixtures=load("docs/work-packages/T5-01/fixtures.json"),owner=load("docs/work-packages/T5-01/asset-owner-candidates.json");
const base=load("docs/architecture/v0.8/business-assets.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v===undefined||v===null?undefined:v[k],o);
const evaluate=(r,input)=>r.criteria.every(c=>c.op==="eq" && get(input,c.path)===c.value);
assert.equal(traces.workPackageId,"T5-01");assert.equal(traces.rules.length,10);
assert.equal(registry.sources.length,10);assert.equal(fixtures.cases.length,20);
assert.equal(fixtures.mutations.length,10);assert.equal(owner.assets.length,17);
assert.deepEqual(owner.assets.map(x=>x.id),base.assets.map(x=>x.id));
const ids=new Set(registry.sources.map(s=>s.id));assert.equal(ids.size,10);
let count=0;for(const r of traces.rules){
 assert.ok(r.criteria.length>=2);assert.ok(r.fields.length>=2);
 for(const s of r.sourceIds)assert.ok(ids.has(s),s);
 for(const a of r.assets)assert.ok(base.assets.some(x=>x.id===a),a);
 for(const c of r.criteria)assert.ok(r.fields.includes(c.path));
 const positive=fixtures.cases.find(x=>x.id===r.positiveTestId),negative=fixtures.cases.find(x=>x.id===r.negativeTestId);
 const mutant=fixtures.mutations.find(x=>x.ruleId===r.id);
 for(const x of [positive,negative,mutant])assert.ok(x && x.ruleId===r.id);
 assert.equal(evaluate(r,positive.input),true,r.id+" positive");
 assert.equal(evaluate(r,negative.input),false,r.id+" negative");
 assert.equal(evaluate(r,mutant.input),false,r.id+" mutation");
 assert.notEqual(mutant.mutatedField,mutant.pairedNegativeField,r.id+" distinct");
 assert.ok(r.fields.includes(mutant.mutatedField));
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 assert.equal(same(negative.input,mutant.input),false);
 count+=3;
}
console.log("T5-01规划合成PASS "+count+"/30；真实LLM、业务Owner、GPU、NC、独立消费者未执行");

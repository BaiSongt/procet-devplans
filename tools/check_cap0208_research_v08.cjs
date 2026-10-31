#!/usr/bin/env node
// 只校验规划证据与正反样例；不执行产品/CAD/NC/机床。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const s=read("research/sources/CAP-02-08.json"),t=read("research/traces/CAP-02-08-v08-supplement.json"),f=read("docs/capabilities/CAP-02-08/research-fixtures-v08.json"),i=read("research/source-index.json"),p=read("tracking/progress.json"),old=read("research/traces/CAP-02-08.json");
const get=(o,k)=>k.split(".").reduce((v,n)=>v?.[n],o),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),accept=(r,x)=>r.criteria.every(c=>c.op==="eq"&&eq(get(x,c.path),c.value));
assert.equal(s.registeredRecords,10);assert.equal(s.sources.length,10);assert.equal(t.rules.length,12);assert.equal(f.positives.length,12);assert.equal(f.negatives.length,48);assert.equal(f.mathCases.length,8);
assert.equal(old.rules.length,10);assert.equal(old.acceptanceIds.length,20);
assert.equal(i.registeredRecords,i.registries.reduce((n,r)=>n+r.registeredRecords,0));assert.equal(p.research.registeredSources,i.registeredRecords);
assert.equal(i.registries.filter(x=>x.path==="research/sources/CAP-02-08.json").length,1);
for(const r of t.rules){assert.equal(r.criteria.length,4);assert.deepEqual(r.fields,r.criteria.map(c=>c.path));
for(const sid of r.sourceIds)assert.ok(s.sources.some(x=>x.id===sid));
const a=f.positives.find(x=>x.ruleId===r.id);assert.ok(a&&accept(r,a.input));
const n=f.negatives.filter(x=>x.ruleId===r.id);assert.equal(n.length,4);
for(const x of n){assert.equal(x.baselineId,a.id);assert.ok(!accept(r,x.input));
const changed=r.criteria.filter(c=>!eq(get(a.input,c.path),get(x.input,c.path)));assert.equal(changed.length,1);assert.equal(changed[0].path,x.mutatedField);}}
const calc=q=>{const x=q.input;switch(q.kind){
case"M_TO_MM":return x.value*(x.unit==="m"?1000:1);
case"RANGE":return x.available>=x.required;
case"MUST":return x.statuses.includes("INCOMPATIBLE")?"REJECTED":x.statuses.includes("STALE")?"STALE":x.statuses.includes("UNKNOWN")?"BLOCKED_UNKNOWN":"CANDIDATE";
case"AABB":return x.overlap&&x.fkIk&&x.collision;
case"MATE":return x.keyEqual&&x.realGeometryMate;
case"FIVE_AXIS":return x.nominalAxisCount>=5&&x.fkIk&&x.controllerCoverage;
case"PREFERENCE":return x.must.includes("INCOMPATIBLE")?"REJECTED":"CANDIDATE";
default:throw Error("unknown math case: "+q.kind);}};
for(const q of f.mathCases)assert.ok(eq(calc(q),q.expected),q.id);
assert.equal(f.statusScenarios.length,8);assert.ok(f.statusScenarios.every(x=>x.execution==="NOT_RUN"));
console.log("CAP-02-08研究V0.8规划合成68/68 PASS；真实产品/NC/B5/消费者NOT_RUN");

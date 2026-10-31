#!/usr/bin/env node
// 规划JSON合成只读校验，非产品/CAD/机床通过。
"use strict";const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const s=read("research/sources/CAP-02-07.json"),t=read("research/traces/CAP-02-07-v08-supplement.json");
const f=read("docs/capabilities/CAP-02-07/research-fixtures-v08.json"),i=read("research/source-index.json"),p=read("tracking/progress.json");
const at=(o,k)=>k.split(".").reduce((v,n)=>v?.[n],o),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),accepts=(r,x)=>r.criteria.every(c=>c.op==="eq"&&eq(at(x,c.path),c.value));
assert.equal(s.registeredRecords,8);assert.equal(t.rules.length,10);assert.equal(f.positives.length,10);assert.equal(f.negatives.length,40);assert.equal(f.mathCases.length,5);
assert.equal(i.registeredRecords,i.registries.reduce((v,x)=>v+x.registeredRecords,0));assert.equal(p.research.registeredSources,i.registeredRecords);
assert.equal(i.registries.filter(x=>x.path==="research/sources/CAP-02-07.json").length,1);
for(const r of t.rules){assert.equal(r.criteria.length,4);assert.deepEqual(r.fields,r.criteria.map(x=>x.path));
for(const id of r.sourceIds)assert.ok(s.sources.some(x=>x.id===id));
const a=f.positives.find(x=>x.ruleId===r.id);assert.ok(a&&accepts(r,a.input));
const n=f.negatives.filter(x=>x.ruleId===r.id);assert.equal(n.length,4);
for(const v of n){assert.ok(!accepts(r,v.input));const diff=r.criteria.filter(c=>!eq(at(a.input,c.path),at(v.input,c.path)));assert.equal(diff.length,1);assert.equal(diff[0].path,v.mutatedField);}}
const calc=q=>q.kind==="MM_TO_M"?q.input.mm/1000:q.kind==="MIRROR_DETERMINANT"?q.input.diagonal.reduce((a,b)=>a*b,1):q.kind==="L_SHAPE_BBOX_FALSE_POSITIVE"?q.input.point[0]>q.input.armMax&&q.input.point[1]>q.input.armMax&&q.input.point[0]<=q.input.bbox[2]&&q.input.point[1]<=q.input.bbox[3]:q.kind==="LOCAL_TRANSLATION"?q.input.parentX+q.input.childX:q.input.meshBefore!==q.input.meshAfter&&q.input.exactHash==="hashA";
for(const q of f.mathCases)assert.ok(eq(calc(q),q.expected.value));assert.ok(f.statusScenarios.length===8&&f.statusScenarios.every(x=>x.execution==="NOT_RUN"));
console.log("CAP-02-07规划合成55/55 PASS；Node之外真实产品、独立消费者NOT_RUN");
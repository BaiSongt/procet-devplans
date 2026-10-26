#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const base=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(base,p),"utf8"));
const t=read("research/traces/CAP-09-02.json"), f=read("docs/capabilities/CAP-09-02/fixtures.json"),s=read("research/sources/CAP-09-02.json");
assert.equal(s.registeredRecords,9);assert.equal(t.rules.length,10);assert.equal(f.cases.length,30);assert.equal(f.vectorOracleCases.length,8);
const ids=new Set(s.sources.map(x=>x.id));let count=0;
for(const r of t.rules){assert.ok(r.sourceIds.every(x=>ids.has(x)));const c=f.cases.filter(x=>x.ruleId===r.id);assert.equal(c.length,3);
assert.notEqual(c[1].mutatedField,c[2].mutatedField);
for(const z of c){const passed=r.criteria.every(q=>q.path.split(".").reduce((a,k)=>a?.[k],z.input)===q.value);assert.equal(z.expected,passed?"PASS":"REJECT");count++;}}
function calc(v){const p=v.point||[0,0,0];if(v.kind==="RELATIVE")return p.map((x,i)=>x-v.work[i]);if(v.kind==="Z90_PIVOT"){let x=p[0]-v.pivot[0],y=p[1]-v.pivot[1];return [v.pivot[0]-y,v.pivot[1]+x,p[2]];}if(v.kind==="Z_AFTER_X"){let a=[p[0],-p[2],p[1]];return [-a[1],a[0],a[2]];}if(v.kind==="DET"){let r=v.r;return r[0]*(r[4]*r[8]-r[5]*r[7])-r[1]*(r[3]*r[8]-r[5]*r[6])+r[2]*(r[3]*r[7]-r[4]*r[6]);}if(v.kind==="REAL_B5_UNKNOWN")return null;throw Error(v.kind);}
function same(a,b){if(Array.isArray(a))return Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>same(x,b[i]));return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-9;}
for(const v of f.vectorOracleCases){let a=calc(v),state=a===null?"UNKNOWN":same(a,v.expected)?"PASS":"REJECT";assert.equal(state,v.state,v.id);count++;}
for(const p of [t.specification,t.ui,t.fixtures,t.sourceRegistry,t.validator,"docs/capabilities/CAP-09-02/independent-consumer-handoff.md"]){assert.ok(fs.existsSync(path.join(base,p)),p)}
console.log("规划合成 "+count+"/38 PASS；产品/控制器/实机/消费者 NOT_RUN");

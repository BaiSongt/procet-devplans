#!/usr/bin/env node
// 规划合成正反验收，不是NC、B5、OCCT或产品验证。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const t=read("research/traces/CAP-09-08.json"),s=read("research/sources/CAP-09-08.json"),f=read("docs/capabilities/CAP-09-08/fixtures.json"),owner=read("docs/capabilities/CAP-09-08/asset-owner-candidates.json"),ex=read("docs/capabilities/CAP-09-08/report.example.json");
const at=(x,p)=>p.split(".").reduce((a,k)=>a?.[k],x);
const result=(r,v)=>r.criteria.every(c=>c.op==="eq"&&at(v,c.path)===c.value)?"PASS":"REJECT";
const status=v=>!v.acl||!v.cas||!v.frameExact||!v.epoch||v.cancelled||v.lateAck?"REJECT_TRANSACTION":!v.fresh?"STALE":v.violation?"REJECT_ENGINEERING":v.clOnly||!v.nc||!v.semantics||!v.joints||!v.actualBinding||!v.d15||!v.independent||!v.coverage||v.unknown||v.renderOnly?"UNKNOWN":"REVIEW_READY_SYNTHETIC_ONLY";
assert.equal(t.rules.length,10);assert.equal(s.sources.length,9);assert.equal(s.registeredRecords,9);assert.equal(f.cases.length,30);assert.equal(f.semanticCases.length,14);assert.equal(owner.entries.length,17);assert(owner.entries.every(x=>x.ownerExactSignoff==="PENDING_HUMAN"));assert.equal(ex.origin,"SYNTHETIC_PLANNING_SAMPLE");assert.equal(ex.status,"UNKNOWN");
const sources=new Set(s.sources.map(x=>x.id));let n=0;
for(const r of t.rules){assert.equal(r.fields.length,4);assert.equal(r.criteria.length,4);assert(r.sourceIds.length>=2&&r.sourceIds.every(x=>sources.has(x)));assert.deepEqual(r.workPackages,["F1-02","E3-04","E3-05","U4-04"]);for(const scenario of ["POSITIVE","NEGATIVE","INDEPENDENT_FIELD_MUTATION"]){const match=f.cases.filter(x=>x.ruleId===r.id&&x.scenario===scenario);assert.equal(match.length,1);assert.equal(result(r,match[0].input),match[0].expected,match[0].id);n++;}}
for(const c of f.semanticCases){assert.equal(status(c.input),c.expected,c.id);n++;}
assert.equal(n,44);console.log("CAP-09-08 规划合成 "+n+"/44 PASS，不代表产品PASS");

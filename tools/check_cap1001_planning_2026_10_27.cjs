#!/usr/bin/env node
// CAP-10-01 规划字段与门禁合成验证；不运行真实NC、控制器或机床。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const t=read("research/traces/CAP-10-01.json"),s=read("research/sources/CAP-10-01.json");
const f=read("docs/capabilities/CAP-10-01/fixtures.json"),owner=read("docs/capabilities/CAP-10-01/asset-owner-candidates.json");
const ex=read("docs/capabilities/CAP-10-01/manifest.example.json");
const at=(x,p)=>p.split(".").reduce((a,k)=>a?.[k],x);
const check=(r,v)=>r.criteria.every(c=>c.op==="eq"&&at(v,c.path)===c.value)?"PASS":"REJECT";
const gate=v=>{
 if(!v.acl||!v.cas||!v.epoch||v.cancelled||v.lateAck)return "REJECT_TRANSACTION";
 if(!v.fresh)return "STALE";
 if(v.symlink||!Array.isArray(v.paths)||v.paths.some(x=>typeof x!=="string"||!x||x.startsWith("/")||x.includes("\\")||x.split("/").some(y=>!y||y==="."||y==="..")||x.includes("\0"))||new Set(v.paths.map(x=>x.toLowerCase())).size!==v.paths.length)return "REJECT_CONTENT";
 if(!v.ncExact||!v.tools||!v.setup||!v.d15||!v.independent||!v.coverage||!v.actualBinding||v.unknown||v.clOnly)return "BLOCKED_UNKNOWN";
 if(v.signed)return "REJECT_UNAUTHORISED_SIGNOFF";
 return "READY_FOR_HUMAN_REVIEW_SYNTHETIC_ONLY";
};
assert.equal(s.sources.length,9);assert.equal(s.registeredRecords,9);assert.equal(t.rules.length,10);
assert.equal(f.cases.length,30);assert.equal(f.releaseGateCases.length,18);assert.equal(owner.entries.length,17);
assert(owner.entries.every(x=>x.ownerSignoff==="PENDING_HUMAN"));
assert(ex.doNotDeploy===true&&ex.candidate.approval==="NOT_APPROVED");
const src=new Set(s.sources.map(x=>x.id));assert.equal(src.size,9);let n=0;
for(const r of t.rules){
 assert.equal(r.fields.length,4);assert.equal(r.criteria.length,4);assert(r.sourceIds.every(x=>src.has(x)));assert.deepEqual(r.workPackages,["E3-06","T5-03"]);
 for(const scenario of ["POSITIVE","NEGATIVE","INDEPENDENT_FIELD_MUTATION"]){
   const cs=f.cases.filter(c=>c.ruleId===r.id&&c.scenario===scenario);assert.equal(cs.length,1);assert.equal(check(r,cs[0].input),cs[0].expected,cs[0].id);n++;
 }
 for(const field of r.fields){
   const obj={};for(const ff of r.fields){const [a,b]=ff.split(".");obj[a]??={};obj[a][b]=ff!==field;}
   assert.equal(check(r,obj),"REJECT",field);n++;
 }
}
for(const c of f.releaseGateCases){assert.equal(gate(c.input),c.expected,c.id);n++;}
assert.equal(n,88);console.log("CAP-10-01 规划合成: "+n+"/88 PASS；独立真实产品消费者 NOT_RUN");

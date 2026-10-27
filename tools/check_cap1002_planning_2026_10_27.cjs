#!/usr/bin/env node
// CAP-10-02 规划合成字段映射与状态门禁；绝不生成数字签名或上机资格。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const t=read("research/traces/CAP-10-02.json"),s=read("research/sources/CAP-10-02.json");
const f=read("docs/capabilities/CAP-10-02/fixtures.json");
const a=read("docs/capabilities/CAP-10-02/approval.example.json");
const at=(v,p)=>p.split(".").reduce((x,k)=>x?.[k],v);
const rule=(r,v)=>r.criteria.every(c=>c.op==="eq"&&at(v,c.path)===c.value)?"PASS":"REJECT";
const gate=x=>{
 if(!x.acl||!x.cas||!x.epoch||x.cancelled||x.lateAck)return"REJECT_TRANSACTION";
 if(!x.humanReviewer||!x.separation||!x.policyCurrent)return"REJECT_POLICY";
 if(x.revoked||!x.signatureVerified||!x.keyCurrent)return"REJECT_SIGNATURE";
 if(!x.finalNc||!x.d15||!x.independent||!x.d10||x.unknown||x.clOnly||!x.offlineTrustPolicy||x.contentChanged)return"BLOCKED_UNKNOWN";
 return"READY_FOR_HUMAN_REVIEW_SYNTHETIC_ONLY";
};
assert.equal(s.registeredRecords,9);assert.equal(s.sources.length,9);assert.equal(t.rules.length,10);
assert.equal(f.cases.length,70);assert.equal(f.approvalGateCases.length,14);
assert(a.doNotDeploy===true&&a.signature.signature==="NOT_SIGNED");
const unique=new Set(s.sources.map(x=>x.id));assert.equal(unique.size,9);
let n=0;
for(const r of t.rules){
 assert.equal(r.fields.length,4);assert.equal(r.criteria.length,4);
 assert(r.sourceIds.every(x=>unique.has(x)));assert.deepEqual(r.workPackages,["E3-06","T5-03"]);
 const cc=f.cases.filter(x=>x.ruleId===r.id);assert.equal(cc.length,7);
 for(const c of cc){assert.equal(rule(r,c.input),c.expected,c.id);n++;}
}
for(const c of f.approvalGateCases){assert.equal(gate(c.input),c.expected,c.id);n++;}
assert.equal(n,84);console.log("CAP-10-02规划合成 "+n+"/84 PASS；签名/真实NC/独立消费者 NOT_RUN");

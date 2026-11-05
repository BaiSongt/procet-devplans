// B185：独立Node只读结构与合成门禁，不访问产品或真实机床。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function checkRule(id,x){
const hash=v=>typeof v==="string"&&/^sha256:[a-f0-9]{64}$/.test(v);
switch(id){
case "B185-R01":return x.identity.projectScope==="project:7"&&x.identity.revision===7&&hash(x.identity.hash)&&x.identity.frame.startsWith("D04:setup1:");
case "B185-R02":return x.stage.sealed===true&&hash(x.stage.manifestHash)&&x.stage.manifestHash===x.stage.actualHash&&x.stage.bytesVerified===true;
case "B185-R03":return x.guard.expectedHead==="r12"&&x.guard.expectedHead===x.guard.currentHead&&x.guard.allowed===true&&x.guard.aclEpochCurrent===true;
case "B185-R04":return x.freeze.candidateRef.startsWith("D06:")&&hash(x.freeze.digest)&&x.freeze.unchanged===true&&x.freeze.mappingComplete===true;
case "B185-R05":return x.cancel.generation===9&&x.cancel.generation===x.cancel.activeGeneration&&x.cancel.cancelled===false&&x.cancel.authorized===true;
case "B185-R06":return x.idem.key.length>0&&hash(x.idem.payloadHash)&&x.idem.payloadHash===x.idem.recordedHash&&x.idem.sameReceipt===true;
case "B185-R07":return x.recovery.domainCommitted===true&&x.recovery.planRef.startsWith("D05:")&&x.recovery.projectVisible===true&&x.recovery.receiptConsistent===true;
case "B185-R08":return x.boundary.managedPort===true&&x.boundary.d04D10Separated===true&&x.boundary.guiCliAgentSame===true&&x.boundary.ncIndependent===true;
default:return false;
}}
function decide(x){
if(x.cancel.cancelled)return "CANCELLED";
if(x.cancel.generation!==x.cancel.activeGeneration)return "LATE_ACK_IGNORED";
if(!x.guard.allowed||!x.guard.aclEpochCurrent)return "REJECT_ACL";
if(x.guard.expectedHead!==x.guard.currentHead)return "REJECT_STALE";
if(x.idem.payloadHash!==x.idem.recordedHash)return "IDEMPOTENCY_CONFLICT";
if(!x.stage.sealed)return "PREVIEW_ONLY";
if(!x.stage.bytesVerified||x.stage.manifestHash!==x.stage.actualHash)return "UNKNOWN_RECOVERY";
if(!x.recovery.domainCommitted)return "STAGED_NOT_VISIBLE";
if(!x.recovery.projectVisible||!x.recovery.receiptConsistent||!x.recovery.planRef)return "UNKNOWN_RECOVERY";
return "COMMITTED_DRAFT";
}
function patch(x,k,v){const p=k.split(".");assert.equal(p.length,2);x[p[0]][p[1]]=v;}
function inspect(f,t,s){assert.equal(t.rules.length,8);assert.equal(f.cases.length,40);assert.equal(f.goldens.length,10);assert.equal(s.records.length,5);
const known=new Set(s.records.map(x=>x.id));let count=0;
for(const r of t.rules){assert.equal(r.fields.length,4);r.sourceIds.forEach(k=>assert.ok(known.has(k)));const cs=f.cases.filter(c=>c.ruleId===r.id);assert.equal(cs.length,5);assert.deepEqual(cs.filter(c=>c.kind==="single_field_negative").map(c=>c.changedField),r.fields);}
for(const c of f.cases){const x=structuredClone(f.baseline);if(c.changedField)patch(x,c.changedField,c.patchValue);assert.equal(checkRule(c.ruleId,x),c.expected,c.id);count++;}
for(const g of f.goldens){const x=structuredClone(f.baseline);Object.entries(g.changes).forEach(([k,v])=>patch(x,k,v));assert.equal(decide(x),g.expected,g.id);count++;}
return count;}
if(require.main===module){const root=path.join(__dirname,".."),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const n=inspect(load("docs/capabilities/CAP-01-05/handoff-recovery-b185-fixtures-v08.json"),load("research/traces/CAP-01-05-handoff-recovery-b185-v08.json"),load("research/sources/CAP-01-05-handoff-recovery-b185.json"));console.log("B185 规划合成 "+n+"/50；产品与真实断电 NOT_RUN");}
module.exports={checkRule,decide,inspect};

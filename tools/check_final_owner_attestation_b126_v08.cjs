#!/usr/bin/env node
// 只读规划校验器：合成PASS不代表用户/Owner签署或产品验收。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.join(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const hex=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const getAt=(o,p)=>p.split(".").reduce((q,k)=>q?.[k],o);
const setAt=(o,p,v)=>{const k=p.split(".");let x=o;for(const y of k.slice(0,-1))x=x[y];x[k.at(-1)]=v};
function judge(id,x){switch(id){
case "B126-R01":return x.sign.asset==="D16"&&x.sign.ownerPort==="10.ReleasePort"&&x.sign.ownerActor==="D16-Owner-SYNTHETIC"&&hex(x.sign.ownerDigest);
case "B126-R02":return x.consumer.actor==="QA-SYNTHETIC"&&x.consumer.independent===true&&x.consumer.actualRead===true&&x.consumer.readDigest===x.exact.hash;
case "B126-R03":return !!x.exact.revision&&hex(x.exact.hash)&&!!x.exact.frame&&!!x.exact.scope;
case "B126-R04":return ["gui","cli","agent"].every(k=>x.entry[k]==="10.ReleasePort.readExact")&&x.entry.sameOwner===true;
case "B126-R05":return hex(x.write.expectedHead)&&x.write.expectedHead===x.write.currentHead&&x.write.aclLive===true&&x.write.scopeCurrent===true;
case "B126-R06":return x.receipt.cancelled===false&&x.receipt.lateAck===false&&x.receipt.duplicateCommit===false&&x.receipt.originalReceiptKnown===true;
case "B126-R07":return hex(x.execution.finalNcHash)&&x.execution.d13Known===true&&x.execution.d15FromFinalHash===x.execution.finalNcHash&&x.execution.d16ExactBind===true;
case "B126-R08":return x.migration.oldReader===true&&x.migration.originalBytesVerified===true&&!!x.migration.rollbackRef&&x.migration.frozenUnchanged===true;
default:return false;
}}
if(require.main===module){
 const baseline=read("docs/architecture/v0.8/business-assets.json"),owners=read("docs/architecture/v0.8/owner-interface-review-v08.json");
 const l=read("tracking/owner-attestation-readiness-b126.json"),src=read("research/sources/FINAL-OWNER-ATTESTATION-B126.json"),tr=read("research/traces/FINAL-OWNER-ATTESTATION-B126-V08.json"),fx=read("docs/architecture/v0.8/final-owner-attestation-b126-fixtures-v08.json");
 assert.equal(baseline.assets.length,17);assert.equal(owners.contracts.length,17);
 assert.equal(baseline.assets.reduce((n,x)=>n+x.outputs.length,0),44);
 assert.equal(l.assets.length,17);assert.equal(new Set(l.assets.map(x=>x.id)).size,17);
 assert.equal(l.realOwnerSigned,0);assert.equal(l.realIndependentConsumerPassed,0);
 for(const row of l.assets){
 const b=baseline.assets.find(x=>x.id===row.id),o=owners.contracts.find(x=>x.assetId===row.id);assert.ok(b&&o,row.id);
 assert.equal(o.ownerCandidate,row.owner);assert.equal(o.producerPort,row.producerPort);
 assert.deepEqual(row.consumers,b.outputs);
 assert.deepEqual(row.crossDomainConsumers,b.outputs.filter(id=>owners.contracts.find(y=>y.assetId===id).ownerDomain!==o.ownerDomain));
 assert.deepEqual(row.readEntry,o.readEntry);
 assert.equal(row.ownerEvidence,null);assert.equal(row.independentConsumerEvidence,null);
 assert.equal(row.ownerSignature,"PENDING_HUMAN");assert.equal(row.consumerResult,"NOT_RUN");
 }
 assert.equal(src.sources.length,7);assert.equal(tr.rules.length,8);assert.equal(fx.cases.length,40);assert.equal(fx.goldens.length,5);
 for(const r of tr.rules){assert.equal(r.fields.length,4);assert.equal(r.negative.length,4);for(const id of r.sourceIds)assert.ok(src.sources.some(x=>x.id===id),id);}
 for(const c of fx.cases){
 assert.equal(judge(c.ruleId,c.input),c.expected==="PLANNING_PASS",c.id);
 const r=tr.rules.find(x=>x.id===c.ruleId);assert.ok(r.positive.includes(c.id)||r.negative.includes(c.id),c.id);
 if(c.mutatedField){const base=structuredClone(fx.cases.find(x=>x.ruleId===c.ruleId&&x.expected==="PLANNING_PASS").input);
 setAt(base,c.mutatedField,getAt(c.input,c.mutatedField));assert.deepEqual(base,c.input,c.id);}
 }
 const obs={assetCount:baseline.assets.length,edgeCount:baseline.assets.reduce((n,x)=>n+x.outputs.length,0),candidateOwnerPorts:owners.contracts.length,actualOwnerSignatures:l.realOwnerSigned,actualConsumerPass:l.realIndependentConsumerPassed};
 for(const g of fx.goldens)assert.equal(obs[g.id],g.expected,g.id);
 console.log("B126 PLANNING_ONLY: 40/40 synthetics; 5/5 structural; Owner/consumer 0/17; PRODUCT NOT_RUN");
}
module.exports={judge};

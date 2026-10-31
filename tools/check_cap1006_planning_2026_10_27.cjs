#!/usr/bin/env node
"use strict";
// 此程序仅校验合成规划文件；不触及付费CI、机床、控制器、客户或产品数据库。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=load("research/sources/CAP-10-06.json"),t=load("research/traces/CAP-10-06.json"),f=load("docs/capabilities/CAP-10-06/fixtures.json"),c=load("docs/capabilities/CAP-10-06/workorder-contract.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
function gate(x){if(!x.acl||!x.authorized||x.claimsD15ByTelemetry||x.requestStartFromPlanning)return "REJECT";if(!x.scopeCurrent||!x.casExact||x.cancelled||x.lateAck)return "STALE";if(!x.d15OraclePass||!x.d16HumanSigned||!x.approvedPackExact)return "BLOCK_RELEASE";if(!x.d10FrameExact||!x.jobMatched||!x.ncByteMatch||!x.localOperatorApproved||!x.sourceClockKnown||!x.qualityGood||!x.independentConsumerEvidence)return "UNKNOWN";if(x.jobAborted)return "ABORTED";if(!x.workComplete)return "IN_PROGRESS";if(!x.independentQualityAccepted)return "COMPLETION_REPORTED_NOT_QUALITY_APPROVED";return "EVIDENCE_CLOSED_NOT_CYCLESTART";}
assert.equal(s.registeredRecords,8);assert.equal(s.sources.length,8);assert.equal(new Set(s.sources.map(q=>q.id)).size,8);
assert.equal(t.rules.length,10);assert.equal(f.cases.length,50);assert.equal(f.gateCases.length,22);assert.equal(c.owningDomain,"10");assert.equal(c.authorization.remoteCycleStartAllowed,false);
const sources=new Set(s.sources.map(q=>q.id));let count=0;
for(const r of t.rules){assert.equal(r.criteria.length,4);assert.equal(r.fields.length,4);assert(r.sourceIds.length>=2&&r.sourceIds.every(x=>sources.has(x)));assert.deepEqual(r.workPackages,["E3-06","T5-03"]);const examples=f.cases.filter(q=>q.ruleId===r.id);assert.equal(examples.length,5);for(const x of examples){assert.equal(r.criteria.every(q=>q.op==="eq"&&get(x.input,q.path)===q.value)?"PASS":"REJECT",x.expected,x.id);if(x.mutatedField){assert(r.fields.includes(x.mutatedField));assert.deepEqual(r.fields.filter(k=>get(x.input,k)!==true),[x.mutatedField]);}count++;}}
for(const x of f.gateCases){assert.equal(gate(x.input),x.expected,x.id);assert(!["PASS","CYCLESTART"].includes(x.expected));count++;}
assert.equal(count,72);console.log("CAP-10-06: "+count+"/"+count+" 规划合成PASS；真实ERP/MES/OPC/NC/机床与独立消费者NOT_RUN");

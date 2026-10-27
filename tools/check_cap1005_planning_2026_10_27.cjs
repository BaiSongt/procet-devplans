#!/usr/bin/env node
"use strict";
// 仅校验规划合成样例，不连接产品仓、工厂机床和NC控制器。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=read("research/sources/CAP-10-05.json"),t=read("research/traces/CAP-10-05.json"),f=read("docs/capabilities/CAP-10-05/fixtures.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
function gate(x){if(!x.acl||!x.authorized||x.writeAttempt||x.claimsEngineeringPass)return "REJECT";if(!x.scopeCurrent||!x.casExact||x.cancelled||x.lateAck)return "STALE";if(x.bufferGap||!x.agentSequenceContinuous)return "GAP";if(!x.readOnly||!x.opcGood||!x.sourceClockKnown||!x.deviceMapped||!x.sourceReachable||!x.consumerVerified)return "UNKNOWN";if(!x.d10FrameVerified)return "OBSERVED_NO_FRAME";if(!x.d16Linked)return "OBSERVED_UNBOUND";return "OBSERVED_BOUND_NOT_VERIFIED";}
assert.equal(s.registeredRecords,8);assert.equal(t.rules.length,10);assert.equal(f.cases.length,50);assert.equal(f.gateCases.length,18);
const ids=new Set(s.sources.map(q=>q.id));assert.equal(ids.size,8);let count=0;
for(const r of t.rules){assert.equal(r.criteria.length,4);assert.equal(r.fields.length,4);assert(r.sourceIds.every(id=>ids.has(id)));assert.deepEqual(r.workPackages,["E3-06","T5-03"]);assert.equal(f.cases.filter(c=>c.ruleId===r.id).length,5);for(const c of f.cases.filter(c=>c.ruleId===r.id)){assert.equal(r.criteria.every(q=>q.op==="eq"&&get(c.input,q.path)===q.value)?"PASS":"REJECT",c.expected,c.id);if(c.mutatedField)assert.deepEqual(r.fields.filter(x=>get(c.input,x)!==true),[c.mutatedField]);count++;}}
for(const c of f.gateCases){assert.equal(gate(c.input),c.expected,c.id);assert.notEqual(c.expected,"PASS");count++;}
assert.equal(count,68);console.log("CAP-10-05: 68/68规划合成PASS；Node/MTConnect/OPC/产品/独立消费者实际验证仍NOT_RUN");

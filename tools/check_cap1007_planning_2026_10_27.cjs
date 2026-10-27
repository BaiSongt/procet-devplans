#!/usr/bin/env node
"use strict";
// 只检查公开规划数据与合成案例，不运行产品仓/NC/机床/收费CI。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=load("research/sources/CAP-10-07.json"),tr=load("research/traces/CAP-10-07.json"),f=load("docs/capabilities/CAP-10-07/fixtures.json"),c=load("docs/capabilities/CAP-10-07/engineering-change-contract.json");
const get=(x,p)=>p.split(".").reduce((o,k)=>o?.[k],x);
function gate(x){if(!x.acl||!x.ownerAuthorized||x.requestRemoteStart||x.rewriteFrozen||x.provenanceFabricated)return "REJECT";if(!x.scopeEpochCurrent||!x.casExact||x.cancelled||x.lateAck||x.staleRevision)return "STALE";if(!x.d17EventAppendOnly||!x.noAlarmAckAsRepair||!x.newBranchCreated)return "BLOCK_CHANGE";if(!x.sourceVerified||!x.d10FrameExact||!x.machineProfileExact||!x.impactClosureComplete)return "UNKNOWN";if(!x.d15IndependentPass||!x.d16NewHumanSigned||!x.d13d14FromFinalNc)return "BLOCK_RELEASE";if(!x.independentQualityAccepted)return "PENDING_QUALITY";if(!x.localMachineAuthority)return "PENDING_LOCAL_AUTH";return "CHANGE_EVIDENCE_READY_NOT_CYCLESTART";}
assert.equal(src.sources.length,8);assert.equal(src.registeredRecords,8);assert.equal(new Set(src.sources.map(s=>s.id)).size,8);
assert.equal(tr.rules.length,10);assert.equal(f.cases.length,50);assert.equal(f.gateCases.length,20);
assert.equal(c.owningDomain,"10");assert.equal(c.commandSurface.remoteCycleStart,false);
const ids=new Set(src.sources.map(x=>x.id));let count=0;
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.equal(r.criteria.length,4);
assert(r.sourceIds.length>=2&&r.sourceIds.every(id=>ids.has(id)));assert.deepEqual(r.workPackages,["E3-06","T5-03"]);
const ex=f.cases.filter(x=>x.ruleId===r.id);assert.equal(ex.length,5);assert.equal(ex.filter(x=>x.expected==="PASS").length,1);
for(const x of ex){const actual=r.criteria.every(q=>q.op==="eq"&&get(x.input,q.path)===q.value)?"PASS":"REJECT";assert.equal(actual,x.expected,x.id);
if(x.mutatedField){assert(r.fields.includes(x.mutatedField));const base=ex.find(y=>y.expected==="PASS").input;
assert.equal(get(base,x.mutatedField),true);assert.equal(get(x.input,x.mutatedField),false);
for(const field of r.fields.filter(z=>z!==x.mutatedField))assert.equal(get(x.input,field),get(base,field),x.id+":额外字段变化");}count++;}}
for(const x of f.gateCases){assert.equal(gate(x.input),x.expected,x.id);count++;}
console.log("CAP-10-07 合成规划验证 "+count+"/"+count+" PASS；不等于产品PASS");

#!/usr/bin/env node
// CAP-09-06规划专用：中文注释；仅合成合同校验，不解释实际NC文件。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const trace=load("research/traces/CAP-09-06.json"),registry=load("research/sources/CAP-09-06.json"),fx=load("docs/capabilities/CAP-09-06/fixtures.json"),own=load("docs/capabilities/CAP-09-06/asset-owner-candidates.json");
const lookup=(o,p)=>p.split(".").reduce((x,k)=>x?.[k],o);
function checkRule(rule,input){return rule.criteria.every(c=>c.op==="eq" && lookup(input,c.path)===c.value)?"PASS":"REJECT";}
function gate(s){
  if(s.cancelled||!s.acl||!s.cas||!s.epoch)return"REJECT_LATE_OR_UNAUTHORIZED";
  if(s.stale)return"STALE";
  if(s.clOnly||!s.finalNcHash||!s.controllerProfile||!s.remapClosure||!s.modalKnown||!s.executionBudget||!s.d13Typed||!s.d14JointSeries||!s.physicalEvidence||!s.independentOracle||!s.coverageComplete)return"UNKNOWN";
  if(!s.engineeredBoundsClear)return"REJECT_ENGINEERING";
  return"REVIEW_READY_SYNTHETIC_ONLY";
}
assert.equal(trace.rules.length,10);assert.equal(registry.sources.length,registry.registeredRecords);assert.equal(fx.cases.length,30);assert.equal(fx.semanticCases.length,16);
assert.deepEqual([...new Set(registry.sources.map(s=>s.id))].length,registry.registeredRecords);
assert.equal(own.entries.length,17);assert(own.entries.every(e=>e.ownerExactSignoff==="PENDING_HUMAN"));
const ids=new Set(registry.sources.map(s=>s.id));let count=0;
for(const rule of trace.rules){
 assert.equal(rule.fields.length,4);assert.equal(rule.criteria.length,4);assert(rule.sourceIds.length>=2);
 assert(rule.sourceIds.every(id=>ids.has(id)));assert(rule.workPackages.every(id=>["F1-02","E3-04","E3-05","U4-04"].includes(id)));
 assert(rule.assets.every(id=>/^D(0[1-9]|1[0-7])$/.test(id)));
 const group=fx.cases.filter(c=>c.ruleId===rule.id);assert.equal(group.length,3);
 assert.deepEqual(group.map(c=>c.scenario).sort(),["INDEPENDENT_FIELD_MUTATION","NEGATIVE","POSITIVE"]);
 for(const c of group){assert.equal(checkRule(rule,c.input),c.expected,c.id);if(c.mutatedField)assert(rule.fields.includes(c.mutatedField));count++;}
}
for(const c of fx.semanticCases){assert.equal(gate(c.input),c.expected,c.id);count++;}
assert.equal(count,46);
console.log("CAP-09-06 PLANNING_ONLY SYNTHETIC "+count+"/"+count+" PASS; 产品NC/OCCT/机床/独立消费者NOT_RUN");

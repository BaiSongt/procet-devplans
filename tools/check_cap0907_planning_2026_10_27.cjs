#!/usr/bin/env node
// 本工具只测试CAP-09-07规划JSON和独立合成负例，绝不是NC或机床安全认证。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const t=read("research/traces/CAP-09-07.json"),s=read("research/sources/CAP-09-07.json"),f=read("docs/capabilities/CAP-09-07/fixtures.json"),o=read("docs/capabilities/CAP-09-07/asset-owner-candidates.json"),i=read("docs/capabilities/CAP-09-07/interface-contract.json");
const at=(ob,p)=>p.split(".").reduce((v,k)=>v?.[k],ob);
function ruleResult(rule,input){return rule.criteria.every(c=>c.op==="eq"&&at(input,c.path)===c.value)?"PASS":"REJECT";}
function safety(v){
 if(v.cancelled||v.lateAck||!v.acl||!v.cas||!v.epoch)return"REJECT_TRANSACTION";
 if(!v.revisionFresh)return"STALE";
 if(v.hardJointViolation||v.collisionWitness)return"REJECT_ENGINEERING";
 if(v.clOnly||v.staticOnly||!v.ncExact||!v.d13Typed||!v.d14Timed||!v.d10Actual||!v.controllerKnown||!v.physicalJointLimits||!v.axisLimits||!v.homed||!v.toolAndFixtureModels||!v.pairCoverage||!v.oracleIndependent||!v.intervalCoverage||!v.validConservativeCertificate||!v.scopeValid)return"UNKNOWN";
 return"REVIEW_READY_SYNTHETIC_ONLY";
}
function bound(b){
 if(!Number.isFinite(b.dA)||!Number.isFinite(b.dB)||!Number.isFinite(b.margin))return"UNKNOWN";
 if(b.dA<=b.margin||b.dB<=b.margin)return b.dA<=0||b.dB<=0?"REJECT_ENGINEERING":"UNKNOWN";
 if(!Number.isFinite(b.maxDistanceChange)||b.maxDistanceChange<0)return"UNKNOWN";
 return Math.min(b.dA,b.dB)-b.maxDistanceChange>b.margin?"BOUND_CANDIDATE_SYNTHETIC_ONLY":"UNKNOWN";
}
assert.equal(t.rules.length,10);assert.equal(s.registeredRecords,10);assert.equal(s.sources.length,10);assert.equal(new Set(s.sources.map(v=>v.id)).size,10);
assert.equal(f.cases.length,30);assert.equal(f.semanticCases.length,20);assert.equal(f.boundCases.length,6);assert.equal(o.entries.length,17);
assert(o.entries.every(v=>v.ownerExactSignoff==="PENDING_HUMAN"));assert.equal(i.output.asset,"D15");
const sourceIds=new Set(s.sources.map(v=>v.id));let count=0;
for(const rule of t.rules){assert.equal(rule.criteria.length,4);assert.equal(rule.fields.length,4);assert(rule.sourceIds.length>=2&&rule.sourceIds.every(x=>sourceIds.has(x)));assert(rule.assets.every(x=>/^D(0[1-9]|1[0-7])$/.test(x)));assert.deepEqual(rule.workPackages,["F1-02","E3-04","E3-05","U4-04"]);
 const group=f.cases.filter(v=>v.ruleId===rule.id);assert.deepEqual(group.map(v=>v.scenario).sort(),["INDEPENDENT_FIELD_MUTATION","NEGATIVE","POSITIVE"]);for(const v of group){assert.equal(ruleResult(rule,v.input),v.expected,v.id);if(v.mutatedField)assert(rule.fields.includes(v.mutatedField));count++;}
}
for(const v of f.semanticCases){assert.equal(safety(v.input),v.expected,v.id);count++;}
for(const v of f.boundCases){assert.equal(bound(v),v.expected,v.id);count++;}
assert.equal(count,56);
console.log("CAP-09-07 PLANNING_ONLY SYNTHETIC "+count+"/56 PASS; 真实NC/OCCT/机床/独立消费者NOT_RUN");

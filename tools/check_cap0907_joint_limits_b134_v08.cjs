// B134：规划合成门禁，非LinuxCNC/NC/B5机床产品认证。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=read("research/sources/CAP-09-07-joint-limits-b134.json"),r=read("research/traces/CAP-09-07-joint-limits-b134-v08.json"),f=read("docs/capabilities/CAP-09-07/joint-limits-b134-fixtures-v08.json");
const states={"refs.d03Revision":"UNKNOWN","refs.d10Revision":"UNKNOWN","refs.d04NominalOnly":"REJECT","refs.frameHashExact":"STALE","mode.kinTypeKnown":"UNKNOWN","mode.modeRevisionExact":"STALE","mode.interpreterMotionSynced":"STALE","mode.offsetsRequalified":"UNKNOWN","axis.axisEnvelopePinned":"UNKNOWN","axis.axisWithinBounds":"REJECT_ENGINEERING","axis.frameExact":"STALE","axis.finalNcSource":"REJECT","joint.physicalLimitsPinned":"UNKNOWN","joint.homingEvidence":"UNKNOWN","joint.physicalJointsWithinBounds":"REJECT_ENGINEERING","joint.noOneToOneAssumption":"REJECT","interval.timeCoverage":"UNKNOWN","interval.branchContinuity":"UNKNOWN","interval.turnCountExact":"UNKNOWN","interval.speedAccelerationQualified":"UNKNOWN","nc.finalD12Hash":"STALE","nc.d13IndependentInterpret":"UNKNOWN","nc.d14PhysicalTimeline":"UNKNOWN","nc.d15IndependentOracle":"UNKNOWN","ui.oneBabylonWorld":"REJECT","ui.leftTaskPanel":"REJECT","ui.sameDomainPort":"REJECT","ui.previewReadOnly":"REJECT","commit.aclRechecked":"REJECT","commit.casExactChecked":"STALE","commit.cancelLateAckFenced":"STALE","commit.migrationRollbackFrozen":"REJECT"};
const get=(a,p)=>p.split(".").reduce((v,k)=>v?.[k],a);
function judge(a){for(const rule of r.rules)for(const key of rule.fields)if(get(a,key)!==get(f.baseline,key))return states[key];return "PLANNING_CANDIDATE_NOT_PRODUCT_PASS";}
function calc(x,a){const q=Math.round((x+0.8*a)*1e6)/1e6;return{q,axisPass:Math.abs(x)<=1&&Math.abs(a)<=1,jointPass:Math.abs(q)<=1.2};}
assert.equal(s.records.length,7);assert.equal(r.rules.length,8);assert.equal(f.tests.length,40);assert.equal(f.goldens.length,6);
const S=new Set(s.records.map(x=>x.id)),T=new Set(f.tests.map(x=>x.id));assert.equal(S.size,7);assert.equal(T.size,40);
for(const rule of r.rules){assert.equal(rule.fields.length,4);assert.equal(rule.tests.length,5);for(const id of rule.sourceIds)assert.ok(S.has(id));for(const id of rule.tests)assert.ok(T.has(id));}
let p=0,n=0;for(const t of f.tests){assert.equal(judge(t.input),t.expect,t.id);const d=r.rules.flatMap(x=>x.fields).filter(k=>get(t.input,k)!==get(f.baseline,k));if(t.kind==="positive"){assert.deepEqual(d,[]);p++;}else{assert.deepEqual(d,[t.changedField],t.id);n++;}}
for(const g of f.goldens)assert.deepEqual(calc(g.input.x,g.input.a),g.expected,g.id);assert.equal(p,8);assert.equal(n,32);
console.log(JSON.stringify({kind:"PLANNING_SYNTHETIC_ONLY",positive:p,negative:n,goldens:6,actualNC:"NOT_RUN",actualB5:"NOT_RUN"}));

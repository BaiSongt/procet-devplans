"use strict";
// B108规划合成只读校验，不连接机床或改动正式资产。
const fs=require("node:fs");
const path=require("node:path");
function judge(x){
const fin=n=>typeof n==="number"&&Number.isFinite(n);
if(!x||!x.refs||!x.axis||!x.limits||!x.timing||!x.source||!x.workflow||!x.verification)return "UNKNOWN";
for(const k of ["d03","d04","d10"]){
const r=x.refs[k];if(!r||!r.id||!r.revision||!r.hash||!r.expectedHash||!r.frame)return "UNKNOWN";
if(r.hash!==r.expectedHash)return "STALE";
}
if(!x.refs.controllerProfileHash||!x.refs.unitPolicy||!x.refs.frameProof)return "UNKNOWN";
if(x.refs.frameProof!=="EXPLICIT_D04_TO_D10")return "STALE";
const w=x.workflow;
if(!w.acl||!w.cas||w.scopeEpoch!==w.ackScopeEpoch||w.cancelled||w.lateAck)return "STALE";
if(!w.sameDomainPort||!w.leftTaskPanel||w.engineCount!==1||w.sceneCount!==1||w.agentMayBypassOwner)return "REJECT";
if(x.verification.d15==="VERIFIED"||x.verification.d16==="RELEASED")return "REJECT";
if(x.source.provenance!=="FINAL_NC_D13"||x.source.d13Status!=="KNOWN"||!x.source.controllerDialect||!x.source.motionProfileExact)return "UNKNOWN";
const a=x.axis,l=x.limits,t=x.timing;
if(a.mode!=="FINITE_BOUNDED"||!l.profileKnown)return "UNKNOWN";
if(![a.previousPhysicalDeg,a.nextPhysicalDeg,a.nextDisplayDeg,a.nextTurnIndex,t.dtSec,t.previousRateDegPerSec,l.minPhysicalDeg,l.maxPhysicalDeg,l.maxRateDegPerSec,l.maxAccelerationDegPerSec2].every(fin))return "UNKNOWN";
if(!Number.isInteger(a.nextTurnIndex)||a.nextDisplayDeg<0||a.nextDisplayDeg>=360||Math.abs(a.nextPhysicalDeg-(360*a.nextTurnIndex+a.nextDisplayDeg))>1e-8)return "REJECT";
if(a.poseOnlyDedup)return "REJECT";
if(!a.previousBranchId||!a.nextBranchId)return "UNKNOWN";
if(a.previousBranchId!==a.nextBranchId){
if(!a.approvedBranchTransition)return "REJECT";
if(!a.independentFkEvidence)return "UNKNOWN";
}
if(l.minPhysicalDeg>=l.maxPhysicalDeg||a.previousPhysicalDeg<l.minPhysicalDeg||a.previousPhysicalDeg>l.maxPhysicalDeg||a.nextPhysicalDeg<l.minPhysicalDeg||a.nextPhysicalDeg>l.maxPhysicalDeg)return "REJECT";
if(t.dtSec<=0||l.maxRateDegPerSec<=0||l.maxAccelerationDegPerSec2<=0)return "REJECT";
const rate=(a.nextPhysicalDeg-a.previousPhysicalDeg)/t.dtSec;
if(Math.abs(rate)>l.maxRateDegPerSec+1e-9||Math.abs((rate-t.previousRateDegPerSec)/t.dtSec)>l.maxAccelerationDegPerSec2+1e-9)return "REJECT";
return "CANDIDATE_ONLY";
}
function applyPatch(input, changes){const x=JSON.parse(JSON.stringify(input));for(const c of changes){const keys=c.path.split(".");let p=x;for(let i=0;i<keys.length-1;i++)p=p[keys[i]];p[keys[keys.length-1]]=c.value;}return x;}
function run(){const root=path.resolve(__dirname,"..");const f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-09-03/branch-winding-b108-fixtures-v08.json"),"utf8"));const t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-09-03-branch-winding-b108-v08.json"),"utf8"));const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-09-03-branch-winding-b108.json"),"utf8"));let fail=[];const ids=new Set(f.cases.map(c=>c.id));const srcIds=new Set(s.sources.map(v=>v.id));if(s.registeredRecords!==s.sources.length||t.ruleCount!==t.rules.length||ids.size!==f.cases.length)fail.push("registry/rule/case count mismatch");for(const r of t.rules){if(!r.sourceIds?.length||!r.fields?.length||!r.positive?.length||!r.originalWorkPackages?.length)fail.push(r.id+": incomplete trace");for(const v of r.sourceIds||[])if(!srcIds.has(v))fail.push(r.id+": missing source "+v);for(const v of [...(r.positive||[]),...(r.negative||[]),...(r.unknown||[]),...(r.stale||[])])if(!ids.has(v))fail.push(r.id+": missing case "+v);}for(const c of f.cases){const got=judge(applyPatch(f.base,c.changes));if(got!==c.expected)fail.push(c.id+" expected "+c.expected+" got "+got);}for(const g of f.analyticGoldens){if(g.turns!==undefined&&Math.abs(g.turns*360+g.displayDeg-g.physicalDeg)>1e-10)fail.push(g.id+" winding mismatch");if(g.previousDeg!==undefined&&Math.abs((g.nextDeg-g.previousDeg)/g.dtSec-g.rateDegPerSec)>1e-10)fail.push(g.id+" rate mismatch");}const result={status:fail.length?"FAIL":"PASS",cases:f.cases.length,sourceRecords:s.sources.length,rules:t.rules.length,mathGoldens:f.analyticGoldens.length,fail,classification:"SYNTHETIC_PLANNING_ONLY",product:"NOT_RUN",independentConsumer:"NOT_RUN"};console.log(JSON.stringify(result,null,2));if(fail.length)process.exitCode=1;}
run();

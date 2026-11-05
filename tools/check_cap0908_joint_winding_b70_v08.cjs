#!/usr/bin/env node
"use strict";
// B70 只读规划校验；合成通过不等于独立D15工程通过。
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
function judge(o){
 if(!o||!o.run||!o.joints||!o.ui||!o.evidence||!o.tx)return "UNKNOWN";
 const r=o.run,j=o.joints,u=o.ui,e=o.evidence,t=o.tx;
 if(t.cancelled||t.lateAck||t.epochExact===false||t.generationExact===false||r.d12BytesExact===false||r.d13RevisionExact===false||r.d14RevisionExact===false||r.d10BindingExact===false||r.d03MachineExact===false)return "STALE";
 if(t.actorAuthorized!==true||t.casExact!==true||t.rollbackReadersPaired!==true||e.claimsPassFromPlayback||e.syntheticAsProduct||e.d16ReleaseApproved||e.frozenHistoryPreserved!==true||e.independentConsumerResult!=="NOT_RUN")return "REJECT";
 if(u.sceneCount!==1||u.panel!=="LEFT_UNIFIED"||u.port!=="PlaybackEvidencePort"||u.writesD14!==false||u.writesD15!==false||u.endpointQuaternionSlerp!==false||u.inferShortestPath!==false||u.allowGapFill!==false)return "REJECT";
 if(r.sourceKind==="D11_CL_ONLY")return "DISPLAY_ONLY";
 if(r.sourceKind!=="D12_FINAL_NC"||r.frameProofExact===false||r.d04SeparateFromD10===false||(r.angularUnit!=null&&r.angularUnit!=="deg"))return "REJECT";
 if(!r.controllerProfileKnown||!r.machineAxisTopologyKnown||r.frameProofExact==null||r.d04SeparateFromD10==null||r.angularUnit==null)return "UNKNOWN";
 for(const key of ["d12Hash","d13Hash","d14Hash","d10Hash","d03Hash"])if(typeof r[key]!=="string"||!/^sha256:[0-9a-f]{64}$/.test(r[key]))return "UNKNOWN";
 if(["timebase","intervalCoverage","mode","interpolationAuthority"].some(k=>j[k]==="UNKNOWN")||e.d15Status==="UNKNOWN")return "UNKNOWN";
 if(j.timebase!=="D14_MONOTONIC_SECONDS"||j.intervalCoverage!=="FULL"||j.mode!=="UNWRAPPED_JOINT"||j.interpolationAuthority!=="D14_EXACT")return "REJECT";
 if(!Array.isArray(j.samples)||j.samples.length<2||j.samples.some(s=>!s||!Number.isFinite(s.t)||!Number.isFinite(s.unwrappedDeg)))return "UNKNOWN";
 for(let i=1;i<j.samples.length;i++)if(j.samples[i].t<=j.samples[i-1].t)return "REJECT";
 if(!Number.isFinite(j.expectedAccumulatedDeltaDeg))return "UNKNOWN";
 if(Math.abs(j.samples[j.samples.length-1].unwrappedDeg-j.samples[0].unwrappedDeg-j.expectedAccumulatedDeltaDeg)>1e-8)return "REJECT";
 return e.d15Status==="NOT_RUN"?"CANDIDATE_ONLY":"REJECT";
}
function patched(o,p){const c=JSON.parse(JSON.stringify(o));for(const item of p){let t=c,a=item.path.split(".");for(const k of a.slice(0,-1))t=t[k];t[a[a.length-1]]=item.value}return c}
const fixtures=read("docs/capabilities/CAP-09-08/joint-winding-b70-fixtures-v08.json"),trace=read("research/traces/CAP-09-08-joint-winding-b70-v08.json"),sources=read("research/sources/CAP-09-08-joint-winding-b70.json");
if(!fixtures.syntheticOnly||sources.registeredRecords!==sources.sources.length)throw Error("来源与合成标签异常");
const ids=new Set(sources.sources.map(s=>s.id)), caseMap=new Map(fixtures.cases.map(c=>[c.id,c]));
if(caseMap.size!==fixtures.cases.length||trace.rules.length!==8)throw Error("验收ID/规则异常");
for(const r of trace.rules){
 if(!r.fields.length||!r.originalWorkPackages.length||!r.assets.length)throw Error("字段、包或资产为空: "+r.id);
 for(const s of r.sourceIds)if(!ids.has(s))throw Error("来源失联 "+s);
 for(const c of r.acceptanceIds)if(!caseMap.has(c))throw Error("验收失联 "+c);
 if(!r.acceptanceIds.some(id=>caseMap.get(id).expected==="CANDIDATE_ONLY")||!r.acceptanceIds.some(id=>caseMap.get(id).expected!=="CANDIDATE_ONLY"))throw Error("规则缺正反 "+r.id);
}
const tally={};for(const c of fixtures.cases){if(!trace.rules.some(r=>r.id===c.ruleId&&r.acceptanceIds.includes(c.id)))throw Error("孤立验收 "+c.id);const v=judge(patched(fixtures.base,c.patches));if(v!==c.expected)throw Error(c.id+" actual="+v+" expected="+c.expected);tally[v]=(tally[v]||0)+1;}
console.log(JSON.stringify({level:"PLANNING_SYNTHETIC_ONLY",total:fixtures.cases.length,tally,independentConsumer:"NOT_RUN",productAcceptance:"NOT_RUN"}));

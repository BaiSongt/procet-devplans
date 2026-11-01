"use strict";
// 规划合成检查，不作为真实NC解释器或机床安全认证。
const fs=require("node:fs"),path=require("node:path");const root=path.resolve(__dirname,"..");const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const f=load("docs/capabilities/CAP-09-06/feed-time-b90-fixtures-v08.json"),t=load("research/traces/CAP-09-06-feed-time-b90-v08.json"),s=load("research/sources/CAP-09-06-feed-time-b90.json");
const judge=function judge(i){
if(!i||!i.refs||!i.modal||!i.workflow)return"REJECT";const{refs:r,modal:m,workflow:w}=i;
if(w.cancelled)return"CANCELLED";
if(!w.cas||!w.taskGenerationExact||r.d12Hash!==r.expectedD12Hash||r.d10Hash!==r.expectedD10Hash)return"STALE";
if(!w.acl||w.lateAck||!w.sameDomainPort||w.babylonWorlds!==1||!w.leftTaskPanel||!w.originalFreezePreserved)return"REJECT";
if(w.d15Granted||w.d16Published||m.actualSecondsVerified||m.timeType!=="COMMAND_ONLY")return"REJECT";
if(!/^sha256:[a-f0-9]{64}$/.test(r.d12Hash)||!/^sha256:[a-f0-9]{64}$/.test(r.d10Hash)||!/^sha256:[a-f0-9]{64}$/.test(r.controllerProfileHash)||!/^sha256:[a-f0-9]{64}$/.test(r.d08FrozenHash)||!r.frame)return"UNKNOWN";
if(!["linuxcnc-2.9-mill","haas-ngc-mill","haas-ngc-lathe"].includes(m.dialect)||m.dialect==="haas-ngc-lathe"||m.controllerKind!=="mill")return"UNKNOWN";
if(!["G93","G94","G95"].includes(m.feedMode)||!["G0","G1","G2","G3"].includes(m.motion)||!["G61","G61.1","G64"].includes(m.pathMode))return"UNKNOWN";
if(m.pathMode==="G64"&&(!Number.isFinite(m.blendToleranceMm)||m.blendToleranceMm<=0))return"UNKNOWN";
if(m.motion==="G0")return m.commandedSeconds===null?"CANDIDATE_ONLY":"REJECT";
if(m.feedMode==="G93"&&!m.feedWordPresent)return"REJECT";
if(!Number.isFinite(m.f)||m.f<=0)return"REJECT";
if(m.feedMode==="G94"&&m.newlySwitchedToG94&&!m.freshFeedAfterSwitch)return"REJECT";
if(m.feedMode==="G95"&&(!m.spindleSpeedFeedback||!Number.isFinite(m.spindleRpm)||m.spindleRpm<=0))return"UNKNOWN";
if(m.unit!=="MM"||!Number.isFinite(m.pathLengthMm)||m.pathLengthMm<0)return"UNKNOWN";
const expected=m.feedMode==="G93"?60/m.f:m.feedMode==="G94"?60*m.pathLengthMm/m.f:60*m.pathLengthMm/(m.f*m.spindleRpm);
return Number.isFinite(m.commandedSeconds)&&Math.abs(expected-m.commandedSeconds)<1e-8?"CANDIDATE_ONLY":"REJECT";
};
if(f.cases.length!==27||t.rules.length!==9||s.sources.length!==7)throw Error("基础数量不符");
const ids=new Set(),rids=new Set(t.rules.map(r=>r.id)),sids=new Set(s.sources.map(r=>r.id));
for(const r of t.rules){if(r.sourceIds.some(x=>!sids.has(x))||r.fields.length===0||r.originalWorkPackages.length===0)throw Error("规则来源或字段缺失 "+r.id);}
for(const c of f.cases){if(ids.has(c.id)||!rids.has(c.ruleId)||judge(c.input)!==c.expected)throw Error("验收失败 "+c.id);ids.add(c.id);}
for(const r of t.rules)for(const id of r.positiveIds.concat(r.negativeIds))if(!ids.has(id))throw Error("无验收反例 "+id);
for(const g of f.arithmeticGoldens){const val=g.mode==="G93"?60/g.f:g.mode==="G94"?60*g.lengthMm/g.f:60*g.lengthMm/(g.f*g.rpm);if(Math.abs(val-g.expectedSeconds)>1e-12)throw Error("数值预期 "+g.id);}
console.log("B90 规划合成27/27 + 数值Golden3/3；独立控制器/机床/消费者 NOT_RUN。");

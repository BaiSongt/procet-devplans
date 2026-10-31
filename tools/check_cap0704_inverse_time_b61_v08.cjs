"use strict";
// B61：只针对结构化模拟块的规划合成验收；不解析真实NC、不连接机床。
const fs=require("node:fs"),assert=require("node:assert/strict");
const analyze=function analyze(v){
 const o=v.owner,n=v.nc,e=v.execution,u=v.ui,l=v.legacy;
 if(o.acl!=="ALLOW"||o.cancelled||e.d15PassClaim||e.d16ReleaseClaim||e.clPreviewAsNcPass||e.materialSweepClaim||e.servoDurationCertifiedWithoutD14)return {state:"REJECT",times:[]};
 if(o.rev!==o.currentRev||o.hash!==o.currentHash||o.frame!==o.currentFrame||o.scopeEpoch!==o.currentScopeEpoch||o.taskGeneration!==o.receiptGeneration||n.sourceHash!==n.d13ReadHash||n.profileHash!==n.d13ProfileHash||n.d10Hash!==n.consumerD10Hash)return {state:"STALE",times:[]};
 if(!o.frame||!n.profileKnown||n.profile!=="LINUXCNC_2_9"||n.unknownMacro||l.readOnlyLegacy||!n.initialMode)return {state:"UNKNOWN",times:[]};
 if(e.d04Owner!=="D04"||e.d10Owner!=="D10"||e.d10InCl||!e.ncFromD12||!e.d13ReadsFinalNc||!e.frozenD08Unchanged||u.engineCount!==1||u.sceneCount!==1||u.canvasCount!==1||u.panel!=="LEFT"||u.fontMaxPx>12||u.port!=="D13.FeedSemanticPort"||!Array.isArray(u.entries)||u.entries.slice().sort().join(",")!=="AGENT,CLI,GUI"||!l.rollbackAsNewRevision||l.unknownCanPass)return {state:"REJECT",times:[]};
 let feedMode=n.initialMode, motion=null, currentF=null,needsNewF=false;
 const times=[];
 for(const b of n.blocks){
  if(b.g!==undefined&&b.g!==null){
   if(!["G93","G94","G95"].includes(b.g))return {state:"UNKNOWN",times:[]};
   if(feedMode!==b.g){feedMode=b.g;needsNewF=feedMode!=="G93";currentF=null;}
  }
  if(b.motion!==undefined&&b.motion!==null){
   if(!["G0","G1","G2","G3"].includes(b.motion))return {state:"UNKNOWN",times:[]};
   motion=b.motion;
  }
  if(b.f!==undefined&&b.f!==null&&(!Number.isFinite(b.f)||b.f<=0))return {state:"REJECT",times:[]};
  if(feedMode!=="G93"&&b.f!==undefined&&b.f!==null){currentF=b.f;needsNewF=false;}
  const isMove=b.axes===true&&(motion==="G1"||motion==="G2"||motion==="G3");
  if(b.axes&&motion===null)return {state:"UNKNOWN",times:[]};
  if(!isMove)continue;
  if(feedMode==="G93"){
   if(b.f===undefined||b.f===null)return {state:"REJECT",times:[]};
   times.push({line:b.line,nominalSeconds:60/b.f});
  }else{
   if(needsNewF||currentF===null)return {state:"REJECT",times:[]};
   if(feedMode==="G95"&&!n.spindleSpeedKnown)return {state:"UNKNOWN",times:[]};
  }
 }
 return {state:"LOCAL_FEED_CANDIDATE",times};
};
const patch=(obj,path,value)=>{const a=path.split(".");let cur=obj;for(let i=0;i<a.length-1;i++)cur=cur[a[i]];cur[a.at(-1)]=value;};
const fixture=JSON.parse(fs.readFileSync(process.argv[2]||"docs/capabilities/CAP-07-04/inverse-time-b61-fixtures-v08.json","utf8"));
const trace=JSON.parse(fs.readFileSync(process.argv[3]||"research/traces/CAP-07-04-inverse-time-b61-v08.json","utf8"));
const registry=JSON.parse(fs.readFileSync(process.argv[4]||"research/sources/CAP-07-04-inverse-time-b61.json","utf8"));
const allIds=new Set(),sourceIds=new Set(registry.sources.map(x=>x.id)),counts={};
assert.equal(registry.registeredRecords,registry.sources.length);
for(const c of fixture.cases){
 assert(!allIds.has(c.id),"重复验收ID");allIds.add(c.id);
 const v=JSON.parse(JSON.stringify(fixture.base));
 for(const [k,x]of Object.entries(c.edits))patch(v,k,x);
 const result=analyze(v);assert.equal(result.state,c.expected,c.id);
 if(c.expectedNominalSeconds!==null)assert.deepEqual(result.times.map(x=>x.nominalSeconds),c.expectedNominalSeconds,c.id+":时间Golden");
 counts[result.state]=(counts[result.state]||0)+1;
}
assert.equal(trace.rules.length,8);
for(const rule of trace.rules){
 assert(rule.fields.length>0&&rule.sourceIds.length>0&&rule.originalWorkPackages.length>0&&rule.negativeTestIds.length>0,rule.id+":无追踪");
 for(const s of rule.sourceIds)assert(sourceIds.has(s),rule.id+":来源缺失 "+s);
 for(const c of [...rule.positiveTestIds,...rule.negativeTestIds,...rule.unknownTestIds])assert(allIds.has(c),rule.id+":用例缺失 "+c);
}
console.log(JSON.stringify({kind:"PLANNING_SYNTHETIC_ONLY",status:"PASS",count:fixture.cases.length,counts,independentConsumer:"NOT_RUN",productAcceptance:"NOT_RUN"}));

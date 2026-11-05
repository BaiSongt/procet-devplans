'use strict';
// B40：D17现场观察与变更回流的只读规划合成验证。中文注释；不执行制造产品操作。
const fs=require('node:fs'),path=require('node:path');
const judge=function judge(x){
 const h=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 const s=v=>typeof v==="string"&&v.length>0;
 const num=v=>typeof v==="number"&&Number.isFinite(v);
 if(x["ui.port"]!=="10.FieldEngineeringChangePort"||x["ui.channels"]!=="GUI|CLI|Agent"||x["ui.babylonWorlds"]!==1||x["ui.leftTaskPanel"]!==true||x["ui.shadowReader"]!=="SHADOW_READ_ONLY"||x["ui.consumerStatus"]!=="NOT_RUN")return "REJECT";
 if(x["flow.d04"]!=="D04-r2"||x["flow.d10"]!=="D10-r4"||x["flow.d16AutoRelease"]!==false||x["flow.clAsNc"]!==false||x["flow.d15"]!=="NOT_RUN")return "REJECT";
 if(!["KNOWN_SUBSET","UNKNOWN"].includes(x["flow.d13"])||!["PLANNED_ONLY","NOT_RUN"].includes(x["flow.d14"]))return "REJECT";
 if(x["flow.d13"]==="UNKNOWN"||x["flow.d14"]==="NOT_RUN")return "UNKNOWN";
 if(x["owner.lateAckAdopted"]!==false)return "REJECT";
 if(!s(x["owner.expectedRevision"])||!s(x["owner.currentRevision"])||!h(x["owner.expectedHash"])||!h(x["owner.currentHash"])||!s(x["owner.expectedFrame"])||!s(x["owner.currentFrame"]))return "REJECT";
 if(x["owner.currentRevision"]!==x["owner.expectedRevision"]||x["owner.currentHash"]!==x["owner.expectedHash"]||x["owner.currentFrame"]!==x["owner.expectedFrame"]||x["owner.expectedFrame"]!=="PART"||
 ![x["owner.aclEpoch"],x["owner.aclNow"],x["owner.scopeEpoch"],x["owner.scopeNow"],x["owner.cancelEpoch"],x["owner.ackEpoch"]].every(Number.isSafeInteger)||x["owner.aclEpoch"]!==x["owner.aclNow"]||x["owner.scopeEpoch"]!==x["owner.scopeNow"]||x["owner.cancelEpoch"]!==x["owner.ackEpoch"]||x["owner.cancelled"]!==false)return "STALE";
 if(x["change.newDraftOnly"]!==true||x["change.freezeBefore"]!==x["change.freezeAfter"]||x["change.sourceRelationBound"]!==true||x["change.overwritePrior"]!==false)return "REJECT";
 if(x["feedback.d17AppendOnly"]!==true||x["feedback.correctionAsNew"]!==true||x["feedback.autoRepair"]!==false)return "REJECT";
 if(x["feedback.externalQualityOwner"]!==true||x["feedback.manualReview"]!==true)return "UNKNOWN";
 if(x["stream.perItemContinuityAsserted"]!==false)return "REJECT";
 if(!s(x["stream.instance"])||!s(x["stream.expectedInstance"])||![x["stream.requestSeq"],x["stream.firstSeq"],x["stream.lastSeq"]].every(Number.isSafeInteger)||x["stream.requestSeq"]<0||x["stream.firstSeq"]<0||x["stream.lastSeq"]<0)return "REJECT";
 if(x["stream.instance"]!==x["stream.expectedInstance"])return "STALE";
 if(x["stream.windowConfirmed"]!==true||x["stream.requestSeq"]<x["stream.firstSeq"]||x["stream.requestSeq"]>x["stream.lastSeq"]||x["stream.firstSeq"]>x["stream.lastSeq"])return "UNKNOWN";
 if(![x["time.eventUtcMs"],x["time.ingestUtcMs"],x["time.errorBoundMs"],x["time.policyMaxErrorMs"],x["time.runStartUtcMs"],x["time.runEndUtcMs"]].every(num))return "REJECT";
 if(x["time.claimsCausality"]!==false)return "REJECT";
 if(x["time.clockQualified"]!==true||x["time.errorBoundMs"]<0||x["time.errorBoundMs"]>x["time.policyMaxErrorMs"]||x["time.runEndUtcMs"]<x["time.runStartUtcMs"])return "UNKNOWN";
 if(x["time.eventUtcMs"]<x["time.runStartUtcMs"]-x["time.errorBoundMs"]||x["time.eventUtcMs"]>x["time.runEndUtcMs"]+x["time.errorBoundMs"])return "UNLINKED";
 if(!s(x["observation.eventId"])||!h(x["observation.rawSha"])||!s(x["observation.dataItemId"])||x["observation.ackMeansResolved"]!==false||x["observation.ackStartsMachine"]!==false)return "REJECT";
 if(!["SAMPLE","EVENT","CONDITION"].includes(x["observation.category"])||!["WARNING","FAULT","NORMAL","UNAVAILABLE"].includes(x["observation.state"])||x["observation.state"]==="UNAVAILABLE")return "UNKNOWN";
 if(!s(x["binding.d16"])||!s(x["binding.d10"])||!s(x["binding.expectedMachine"])||!s(x["binding.actualMachine"])||!s(x["binding.expectedController"])||!s(x["binding.actualController"]))return "REJECT";
 if(x["binding.actualMachine"]!==x["binding.expectedMachine"]||x["binding.actualController"]!==x["binding.expectedController"]||x["binding.rawD12MatchesD16"]!==true)return "STALE";
 if(x["binding.d10Frame"]!=="MACHINE"||x["binding.receiverProof"]!=="REHASHED_EXACT")return "UNKNOWN";
 if(x["change.ncChanged"]===true||x["change.machineChanged"]===true)return "BLOCK_RELEASE";
 if(x["change.ncChanged"]!==false||x["change.machineChanged"]!==false)return "REJECT";
 return "PROPOSE_ONLY";
};
function run(root=path.join(__dirname,'..')){
 const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const fx=load("docs/capabilities/CAP-10-07/event-provenance-b40-fixtures-v08.json"),tr=load("research/traces/CAP-10-07-event-provenance-b40-v08.json"),sr=load("research/sources/CAP-10-07-event-provenance-b40.json");
 const cases=new Map(fx.cases.map(c=>[c.id,c])),sources=new Set(sr.sources.map(s=>s.id));
 if(cases.size!==fx.cases.length||sources.size!==sr.sources.length)throw Error('来源或样例ID重复');
 for(const r of tr.rules){
  if(!r.sourceIds.length||!r.sourceIds.every(s=>sources.has(s)))throw Error('缺少来源:'+r.id);
  if(!r.positiveIds.length||!r.negativeIds.length)throw Error('规则没有正反验收:'+r.id);
  if(!r.fields.length||!r.fields.every(f=>Object.hasOwn(fx.baseline,f)))throw Error('规则未覆盖基础字段:'+r.id);
  for(const [key,kind] of [['positiveIds','positive'],['negativeIds','negative'],['unknownIds','unknown']]){
   if(!r[key].every(id=>cases.has(id)&&cases.get(id).kind===kind))throw Error('case引用或类别不正确:'+r.id+':'+key);
  }
 }
 const counts={positive:0,negative:0,unknown:0};
 for(const c of fx.cases){
  if(c.kind==='negative'&&(Object.keys(c.patch).length!==1||c.changedField!==Object.keys(c.patch)[0]))throw Error('负例非单字段:'+c.id);
  const got=judge({...fx.baseline,...c.patch});if(got!==c.expected)throw Error(c.id+': '+got+' != '+c.expected);
  counts[c.kind]++;
 }
 for(const [k,v] of Object.entries(counts))if(v!==fx[k+'Count'])throw Error('计数不一致:'+k);
 return {status:'PLANNING_SYNTHETIC_PASS',total:fx.cases.length,counts,independentConsumer:'NOT_RUN',realMTConnect:'NOT_RUN',NC:'NOT_RUN',approval:'PENDING_HUMAN'};
}
if(require.main===module){try{console.log(JSON.stringify(run()));}catch(e){console.error(e.stack||e.message);process.exitCode=1;}}
module.exports={judge,run};

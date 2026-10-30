'use strict';
// B41：仅执行规划合成契约与追踪；不运行工业机床或对D15签发PASS。
const fs=require('node:fs'), path=require('node:path');
const judge=function judge(x){
 const sha=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 const id=v=>typeof v==="string"&&v.length>0;
 const int=v=>Number.isSafeInteger(v);
 if(!["refs.d10","refs.d12","refs.d13","refs.d14"].every(k=>id(x[k]))||!sha(x["refs.d12Sha"]))return "REJECT";
 if(x["refs.d10"]!=="D10-r4"||x["refs.d12"]!=="D12-r9"||x["refs.d13"]!=="D13-r5"||x["refs.d14"]!=="D14-r7")return "STALE";
 if(x["refs.d11AsNc"]!==false)return "REJECT";
 if(![x["call.byteStart"],x["call.byteEnd"]].every(int)||x["call.byteStart"]<0||x["call.byteStart"]>=x["call.byteEnd"]||!id(x["call.a"])||!id(x["call.b"])||x["call.a"]===x["call.b"]||!id(x["call.jointA"])||!id(x["call.jointB"])||x["call.jointA"]===x["call.jointB"]||x["call.expansionComplete"]!==true)return "REJECT";
 if(x["timeline.timeUnknown"]===true)return "UNKNOWN";
 const vals=["timeline.startUs","timeline.endUs","timeline.aEndUs","timeline.bStartUs","timeline.reportedGapStartUs","timeline.reportedGapEndUs"].map(k=>x[k]);
 if(!vals.every(int)||x["timeline.unit"]!=="us"||x["timeline.kind"]!=="D14_SIMULATED"||!(vals[0]===0&&vals[0]<vals[2]&&vals[2]<vals[3]&&vals[3]<vals[1]&&vals[2]===vals[4]&&vals[3]===vals[5])||x["timeline.timeUnknown"]!==false)return "REJECT";
 if(!int(x["seek.cursorUs"])||x["seek.cursorUs"]<x["timeline.startUs"]||x["seek.cursorUs"]>x["timeline.endUs"]||typeof x["seek.rate"]!=="number"||!Number.isFinite(x["seek.rate"])||Math.abs(x["seek.rate"])>16||x["seek.readOnly"]!==true||x["seek.reverseWrites"]!==false)return "REJECT";
 if(!sha(x["seek.d14HashBefore"])||!sha(x["seek.d14HashAfter"])||!sha(x["seek.d15HashBefore"])||!sha(x["seek.d15HashAfter"])||x["seek.d14HashBefore"]!==x["seek.d14HashAfter"]||x["seek.d15HashBefore"]!==x["seek.d15HashAfter"])return "REJECT";
 if(x["report.d15Status"]==="UNKNOWN")return "UNKNOWN";
 if(x["report.d15Status"]!=="NOT_RUN"||x["report.label"]!=="NC_PLAYBACK_UNVERIFIED"||x["report.coverageGapVisible"]!==true||x["report.claimsCertified"]!==false||x["report.staticSampleClaimsCcd"]!==false||x["report.findingRef"]!=="NONE")return "REJECT";
 if(!sha(x["provenance.byteSha"])||!sha(x["provenance.callSetHash"])||!sha(x["provenance.d14Hash"]))return "REJECT";
 if(x["provenance.byteSha"]!==x["refs.d12Sha"]||x["provenance.d14Hash"]!==x["seek.d14HashBefore"])return "STALE";
 if(x["provenance.synthetic"]!==true||x["provenance.machineExportAllowed"]!==false)return "REJECT";
 if(x["ui.port"]!=="09.PlaybackEvidencePort"||x["ui.channels"]!=="GUI|CLI|Agent"||x["ui.worldCount"]!==1||x["ui.leftTaskPanel"]!==true||x["ui.fontMaxPx"]!==12||x["ui.selectionCommits"]!==false)return "REJECT";
 if(![x["owner.aclExpected"],x["owner.aclCurrent"],x["owner.scopeExpected"],x["owner.scopeCurrent"],x["owner.cancelEpoch"],x["owner.ackEpoch"]].every(int)||!sha(x["owner.expectedHash"])||!sha(x["owner.currentHash"])||!id(x["owner.expectedRevision"])||!id(x["owner.currentRevision"])||!id(x["owner.expectedFrame"])||!id(x["owner.currentFrame"]))return "REJECT";
 if(x["owner.expectedRevision"]!==x["owner.currentRevision"]||x["owner.expectedHash"]!==x["owner.currentHash"]||x["owner.expectedFrame"]!==x["owner.currentFrame"]||x["owner.aclExpected"]!==x["owner.aclCurrent"]||x["owner.scopeExpected"]!==x["owner.scopeCurrent"]||x["owner.cancelEpoch"]!==x["owner.ackEpoch"])return "STALE";
 if(x["owner.cancelled"]!==false||x["owner.lateAckAdopted"]!==false)return "REJECT";
 if(x["flow.d04"]!=="D04-r2"||x["flow.d10"]!=="D10-r4"||x["flow.d04"]===x["flow.d10"]||x["flow.d16Auto"]!==false||x["flow.frozenOverwritten"]!==false||x["flow.migrationShadow"]!==true||x["flow.consumerStatus"]!=="NOT_RUN")return "REJECT";
 if(x["binding.controllerSemanticsKnown"]!==true)return "UNKNOWN";
 return "PREVIEW_ONLY";
};
function run(root=path.join(__dirname,'..')){
 const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const sources=load('research/sources/CAP-09-08-replay-instances-b41.json'),trace=load('research/traces/CAP-09-08-replay-instances-b41-v08.json'),fx=load('docs/capabilities/CAP-09-08/replay-instances-b41-fixtures-v08.json');
 const ids=new Set(sources.sources.map(x=>x.id)),cases=new Map(fx.cases.map(x=>[x.id,x]));
 if(ids.size!==sources.sources.length||cases.size!==fx.cases.length)throw Error('重复来源或用例ID');
 if(trace.rules.length!==8||!fx.syntheticOnly)throw Error('追踪数量或合成标识异常');
 for(const r of trace.rules){
  if(!r.sourceIds.length||!r.sourceIds.every(id=>ids.has(id)))throw Error('规则来源丢失：'+r.id);
  if(!r.fields.length||!r.fields.every(f=>Object.hasOwn(fx.baseline,f)))throw Error('规则字段缺失：'+r.id);
  if(!r.positiveIds.length||!r.negativeIds.length)throw Error('缺正反验收：'+r.id);
  for(const [key,kind] of [['positiveIds','positive'],['negativeIds','negative'],['unknownIds','unknown']]){
   if(!r[key].every(id=>cases.has(id)&&cases.get(id).kind===kind))throw Error('验收引用类别不匹配：'+r.id);
  }
 }
 const counts={positive:0,negative:0,unknown:0};
 for(const c of fx.cases){
  if(c.kind==='negative'&&(Object.keys(c.patch).length!==1||c.changedField!==Object.keys(c.patch)[0]))throw Error('负例非单字段：'+c.id);
  if(judge({...fx.baseline,...c.patch})!==c.expected)throw Error('不符：'+c.id);
  counts[c.kind]++;
 }
 for(const k of Object.keys(counts))if(counts[k]!==fx[k+'Count'])throw Error('分组计数不一致：'+k);
 return {status:'PLANNING_SYNTHETIC_PASS',counts,total:fx.cases.length,realNC:'NOT_RUN',independentConsumers:'0/17',D15:'NOT_RUN',L3:'PENDING_HUMAN'};
}
if(require.main===module){try{console.log(JSON.stringify(run()));}catch(e){console.error(e.stack||e.message);process.exitCode=1;}}
module.exports={judge,run};

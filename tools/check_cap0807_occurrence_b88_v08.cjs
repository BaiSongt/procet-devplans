#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const judge=function judge(rule,c){
 const h=x=>typeof x==="string"&&/^sha256:[0-9a-f]{64}$/.test(x);
 switch(rule){
 case "E88-R1":
  if(!c.refs.d09Revision||!h(c.refs.d09Hash)||!h(c.refs.d12Hash)||!h(c.refs.profileHash)||!h(c.refs.closureHash))return "UNKNOWN";
  if(c.refs.expectedD09Hash!==c.refs.d09Hash)return "STALE";
  if(!c.refs.d04Frame||!c.refs.d10Frame||(c.refs.d04Frame==="UNSPECIFIED"&&c.refs.d10Frame==="UNSPECIFIED"))return "REJECT";
  if(!c.refs.d10Revision)return "UNKNOWN";
  return "CANDIDATE_ONLY";
 case "E88-R2":
  if(!c.span.closurePinned)return "UNKNOWN";
  if(c.span.offsetUnit!=="BYTE"||c.span.keyUsesN)return "REJECT";
  if(!Number.isSafeInteger(c.span.from)||!Number.isSafeInteger(c.span.to)||!Number.isSafeInteger(c.span.fileBytes)||c.span.from<0||c.span.to<=c.span.from||c.span.to>c.span.fileBytes)return "REJECT";
  return "CANDIDATE_ONLY";
 case "E88-R3":
  if(!Array.isArray(c.occ.occurrences)||c.occ.occurrences.length<2||c.occ.keyForm!=="NC_PROFILE_CLOSURE_PATH_ORDINAL")return "UNKNOWN";
  {const keys=new Set();for(const x of c.occ.occurrences){
    if(typeof x.eventOrdinal!=="string"||!/^(0|[1-9]\d*)$/.test(x.eventOrdinal))return "REJECT";
    if(!Array.isArray(x.callPath)||!x.callPath.length||x.callPath.some(s=>typeof s!=="string"||!s.includes("#")))return "UNKNOWN";
    const key=[c.refs.d12Hash,c.refs.profileHash,c.refs.closureHash,x.callPath.join(">"),x.eventOrdinal].join("|");
    if(keys.has(key))return "REJECT"; keys.add(key);
  }}return "CANDIDATE_ONLY";
 case "E88-R4":
  return c.flow.profile==="linuxcnc-2.9"&&c.flow.expansion==="COMPLETE"&&c.flow.dynamicIndirectResolved&&c.flow.callStackComplete&&!c.flow.stepBudgetExceeded?"CANDIDATE_ONLY":"UNKNOWN";
 case "E88-R5":
  if(!c.lineage.graphAcyclic||!c.lineage.postActivityId)return "REJECT";
  return c.lineage.includesD09D12&&c.lineage.generatedOnlyReason&&c.lineage.ambiguousMappingsExplicit?"CANDIDATE_ONLY":"UNKNOWN";
 case "E88-R6":
  if(!c.invalidate.d08Frozen||!c.invalidate.oldMappingImmutable)return "REJECT";
  if(c.invalidate.manualEdit&&c.invalidate.downstream==="CURRENT")return "STALE";
  return c.invalidate.rollbackTargetCertified?"CANDIDATE_ONLY":"UNKNOWN";
 case "E88-R7":
  if(c.txn.cancelled||c.txn.lateAck)return "CANCELLED";
  if(!c.txn.acl)return "REJECT";
  return c.txn.cas&&c.txn.taskGenerationExact?"CANDIDATE_ONLY":"CONFLICT";
 case "E88-R8":
  if(!c.ui.sameDomainPort||c.ui.sceneCount!==1||!c.ui.leftPanel||!c.ui.clPreviewLabeled)return "REJECT";
  if(c.ui.d15==="PASS"&&c.ui.independentConsumers!=="EXECUTED")return "REJECT";
  if(c.ui.d16!=="BLOCKED"&&c.ui.d15!=="PASS")return "REJECT";
  return "CANDIDATE_ONLY";
 default:return "REJECT";
 }
};
function main(){
 const f=load("docs/capabilities/CAP-08-07/occurrence-b88-fixtures-v08.json"), t=load("research/traces/CAP-08-07-occurrence-b88-v08.json"), s=load("research/sources/CAP-08-07-occurrence-b88.json");
 const ids=new Set(f.cases.map(x=>x.id)),sourceIds=new Set(s.sources.map(x=>x.id)),issues=[];
 if(ids.size!==f.cases.length||f.cases.length!==33||t.rules.length!==8||s.sources.length!==8)issues.push("数量/唯一性错误");
 for(const r of t.rules){if(!r.fields.length||!r.assets.length||!r.originalWorkPackages.length||r.capabilityId!=="CAP-08-07")issues.push(r.id+":字段资产原包缺失");if(r.sourceIds.some(x=>!sourceIds.has(x)))issues.push(r.id+":来源缺失");for(const id of [...r.positiveIds,...r.negativeIds])if(!ids.has(id))issues.push(r.id+":用例缺失 "+id);}
 for(const x of f.cases){if(!t.rules.some(r=>r.id===x.ruleId))issues.push(x.id+":未登记规则");const actual=judge(x.ruleId,x.input);if(actual!==x.expected)issues.push(x.id+" expected "+x.expected+" actual "+actual);}
 if(issues.length){console.error(issues.join("\n"));process.exitCode=1;return;}
 console.log("B88: 33/33 规划合成期望匹配（8候选/25负例）。不构成D13/D15/产品验证。");
}
if(require.main===module)main();
module.exports={judge,main};

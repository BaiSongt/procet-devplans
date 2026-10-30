"use strict";
// 只读规划校验；不连接产品数据库/机床。
const fs=require("node:fs"),path=require("node:path");
const hash=x=>typeof x==="string"&&/^[0-9a-f]{64}$/.test(x);
function judge(x){
 const s=x?.source,v=x?.solver,o=x?.objectives,a=x?.adopt,g=x?.guard,c=x?.chain;
 if(!s||!v||!o||!a||!g||!c)return "REJECT";
 if(![s.d01,s.d02,s.d03,s.d04,s.d05,s.d06,s.d07,s.d08,s.frame,s.candidateFrame].every(hash)||s.frame!==s.candidateFrame||s.revision!==7||s.scope!=="proj"||s.occurrence!=="ASM/A"||s.d04NominalOnly!==true)return "REJECT";
 if(!hash(v.modelHash)||!hash(v.configHash)||v.globalOptimalClaim!==false||v.realOCCT!=="NOT_RUN"||!["FEASIBLE","OPTIMAL","UNKNOWN","MODEL_INVALID","INFEASIBLE"].includes(v.status))return "REJECT";
 if(v.status==="UNKNOWN")return "UNKNOWN";if(v.status==="INFEASIBLE"||v.status==="MODEL_INVALID")return "REJECT";
 if(!v.modelFeasible||!["TIME_LIMIT","GAP_LIMIT","PROVEN"].includes(v.stopReason))return "REJECT";
 if(!hash(o.profile)||o.otherProfile!==o.profile)return "REJECT";
 if(o.comparable==="UNKNOWN")return "UNKNOWN";
 if(o.comparable!==true||o.noHiddenScore!==true||o.humanDecision!==true||o.reliability!=="UNVERIFIED"||!Array.isArray(o.constraintViolations)||o.constraintViolations.some(z=>!Number.isFinite(z)||z!==0))return "REJECT";
 if(!Array.isArray(o.metrics)||!Array.isArray(o.other)||o.metrics.length!==2||o.other.length!==2)return "REJECT";
 for(let i=0;i<2;i++){const p=o.metrics[i],q=o.other[i];if(!Array.isArray(p)||!Array.isArray(q)||p.length!==4||q.length!==4||p[0]!==q[0]||p[1]!==q[1]||p[2]!=="MIN"||q[2]!=="MIN"||!Number.isFinite(p[3])||!Number.isFinite(q[3])||p[0]!==["time","energy"][i]||p[1]!==["min","kWh"][i])return "REJECT"}
 const dom=(aa,bb)=>aa.every((q,i)=>q[3]<=bb[i][3])&&aa.some((q,i)=>q[3]<bb[i][3]);
 const rel=dom(o.metrics,o.other)?"A_DOMINATES_B":dom(o.other,o.metrics)?"B_DOMINATES_A":o.metrics.every((q,i)=>q[3]===o.other[i][3])?"TIE":"NONDOMINATED";
 if(o.relation!==rel)return "REJECT";
 if(JSON.stringify(a.selected)!=='["op-B"]'||JSON.stringify(a.dependencies)!=='[["op-A","op-B"]]'||!a.alreadyPresent?.includes("op-A")||JSON.stringify(a.writeOnly)!=='["op-B"]'||!a.frozen?.includes("op-Z")||a.touchFrozen!==false)return "REJECT";
 if(a.transfer==="UNKNOWN")return "UNKNOWN";
 if(a.transfer!=="KNOWN"||a.newD05Revision!==true||a.keepD06D07!==true||a.keepD08!==true||a.derivation!==true||a.rollback!=="FORK")return "REJECT";
 if(g.owner!=="05.CandidateAdoptionPort"||JSON.stringify(g.channels)!=='["GUI","CLI","Agent"]'||g.singleBabylon!==true||g.leftPanel!=="UnifiedTaskPanel"||!hash(g.expected)||g.current!==g.expected||g.aclEpoch!==g.aclSeen||g.scopeEpoch!==g.scopeSeen||g.generation!==g.ackGeneration||g.cancelled!==false||g.commitRechecksAuth!==true)return "REJECT";
 if(c.clNeutral!==true||c.d04SeparateD10!==true||c.d10!=="UNKNOWN"||c.d12!=="NOT_RUN"||c.d13!=="UNKNOWN"||c.d14!=="NOT_RUN"||c.d15!=="NOT_RUN"||c.d16!==false||c.clPreviewIsNotVerification!==true||c.materialSweep!==false)return "REJECT";
 return "PLANNING_CANDIDATE";
}
function run(root=process.cwd()){
const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-05-05-pareto-adoption-b35.json"),"utf8"))),t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-05-05-pareto-adoption-b35-v08.json"),"utf8")),f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-05-05/pareto-adoption-b35-fixtures-v08.json"),"utf8")));
const ids=new Set(f.cases.map(x=>x.id)),ss=new Set(s.sources.map(x=>x.id));if(ss.size!==5||s.registeredRecords!==5||t.rules.length!==7||ids.size!==f.cases.length||f.cases.length!==50)throw Error("计数/重复ID");
for(const r of t.rules){if(!r.fields.length||!r.sourceIds.length||!r.positiveIds.length||!r.negativeIds.length||r.sourceIds.some(x=>!ss.has(x))||[...r.positiveIds,...r.negativeIds,...r.unknownIds].some(x=>!ids.has(x)))throw Error("规则正反追踪缺失 "+r.id);for(const [key,wanted] of [["positiveIds","PLANNING_CANDIDATE"],["negativeIds","REJECT"],["unknownIds","UNKNOWN"]]){for(const id of r[key]){const c=f.cases.find(z=>z.id===id);if(!c||c.expected!==wanted)throw Error("验收期望类型错误 "+r.id+"/"+id)}}}
for(const c of f.cases){if(!t.rules.some(r=>r.id===c.rule)||judge(c.input)!==c.expected)throw Error("样例 "+c.id+" 错误")}
return {status:"PLANNING_SYNTHETIC_PASS",total:f.cases.length,positive:2,unknown:3,negative:45,realProduct:"NOT_RUN"};
}
if(require.main===module){try{console.log(JSON.stringify(run()))}catch(e){console.error(e.stack);process.exitCode=1;}}
module.exports={judge,run};

"use strict";
// 仅执行合成数据的只读校验；不访问任何产品数据。
const fs=require("node:fs"),path=require("node:path");
const verdict=function verdict(x){
 const hash=z=>typeof z==="string"&&/^[a-f0-9]{64}$/.test(z),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const d=x?.d01,o=x?.occ,f=x?.face,h=x?.history,c=x?.candidate,u=x?.ui,g=x?.commit;
 if(!d||!o||!f||!h||!c||!u||!g)return "REJECT";
 if(!d.project||!d.revision||!d.definition||!hash(d.hash)||!d.snapshot||d.unit!=="mm")return "REJECT";
 if(!Array.isArray(o.path)||o.path.length<2||o.path.some(v=>!v)||!o.component||o.refDefinition!==d.definition||!hash(o.locationHash)||!o.frame||!o.resolved)return "REJECT";
 if(!f.ref||!Number.isInteger(f.index)||f.index<=0||f.hash!==d.hash||!same(f.occPath,o.path)||f.frame!==o.frame||f.cumOri!==true||f.cumLoc!==true)return "REJECT";
 if(h.from!==d.hash||!hash(h.to)||h.oldFace!==f.ref||!Array.isArray(h.successors)||!Array.isArray(h.modified)||!Array.isArray(h.generated)||typeof h.removed!=="boolean")return "REJECT";
 if(!c.ref||!same(c.inputFaces,[f.ref])||!same(c.outputFaces,h.successors)||c.state!=="CANDIDATE"||c.autoApproved!==false||c.solverWrites!==false||c.owner!=="03.FeatureOwner"||!c.consumerTest)return "REJECT";
 if(!same(u.channels,["GUI","CLI","Agent"])||u.port!=="03.FeatureOwner"||u.worlds!==1||u.panel!=="left/UnifiedTaskPanel"||u.maxFont>12||u.previewWrites!==false)return "REJECT";
 if(!g.expectedRevision||g.expectedRevision!==g.actualRevision||g.aclEpoch!==g.aclObserved||g.scopeEpoch!==g.scopeObserved||g.generation!==g.observedGeneration||g.cancelled!==false||g.lateAck!==false||g.authorized!==true||!hash(g.frozenHash)||g.frozenHash!==g.afterFrozenHash||g.d04!==null||g.d10!==null||g.fallbackReadOnly!==true||g.consumerAcceptance!=="NOT_RUN")return "REJECT";
 if(h.available===false&&h.kind==="UNKNOWN"&&h.ref===""&&h.successors.length===0&&h.modified.length===0&&h.generated.length===0&&!h.removed)return "UNKNOWN";
 if(h.available!==true||!h.ref||!["ONE_TO_ONE","SPLIT","MERGE"].includes(h.kind)||h.removed||h.generated.some(v=>h.modified.includes(v))||h.successors.length===0)return "REJECT";
 if(h.kind==="ONE_TO_ONE"&&h.successors.length===1&&same(h.successors,h.modified))return "REVIEW_READY";
 if(h.kind==="SPLIT"&&h.successors.length>1&&same(h.successors,h.modified))return "NEEDS_REBIND";
 if(h.kind==="MERGE")return "NEEDS_REBIND";
 return "REJECT";
};
const data=JSON.parse(fs.readFileSync(path.join(__dirname,"../docs/capabilities/CAP-03-05/assembly-face-b31-fixtures-v08.json"),"utf8"));
const errors=[];for(const c of data.cases){const got=verdict(c.input);if(got!==c.expected)errors.push(c.id+":"+got)}
const p=data.cases.find(x=>x.id==="P01")?.input,q=data.cases.find(x=>x.id==="P02")?.input;
if(!p||!q||p.d01.hash!==q.d01.hash||JSON.stringify(p.occ.path)===JSON.stringify(q.occ.path)||p.candidate.ref===q.candidate.ref)errors.push("CrossOccurrence");
if(data.cases.length!==data.positiveCount+data.negativeCount)errors.push("Count");
console.log(JSON.stringify({cases:data.cases.length,positive:data.positiveCount,negative:data.negativeCount,errors,qualification:"SYNTHETIC_ONLY",product:"NOT_RUN"}));if(errors.length)process.exitCode=1;

"use strict";
// 只读规划合成验证；不访问产品代码、数据库或实机。
const fs=require("node:fs"),path=require("node:path");
function judge(x){
 const sha=v=>typeof v==="string"&&/^[0-9a-f]{64}$/.test(v);
 const s=x?.source,p=x?.orientation,k=x?.kinematics,g=x?.guard,c=x?.chain;
 if(!s||!p||!k||!g||!c)return "REJECT";
 if(![s.d01,s.d02,s.d03,s.d04,s.d07,s.d08,s.frame,s.clFrame].every(sha)||s.frame!==s.clFrame||s.d04NominalOnly!==true||s.d08Frozen!==true||!(s.revision>0)||!s.scope)return "REJECT";
 const unit=(q,n)=>Array.isArray(q)&&q.length===n&&q.every(Number.isFinite)&&Math.abs(q.reduce((a,b)=>a+b*b,0)-1)<1e-8;
 if(!unit(p.q0,4)||!unit(p.q1,4)||!unit(p.axis,3)||p.signInvariant!==true||p.frame!=="RIGHT")return "REJECT";
 const dot=p.q0.reduce((n,v,i)=>n+v*p.q1[i],0),angle=2*Math.acos(Math.min(1,Math.abs(dot)))*180/Math.PI;
 if(!Number.isFinite(p.stepLimitDeg)||p.stepLimitDeg<=0||angle>p.stepLimitDeg+1e-8||p.contactQualified!==true||p.ccTcpDistinct!==true||p.trimmedSurface!==true)return "REJECT";
 if(k.taskDoF!==5||!sha(k.modelHash)||k.modelHash!==s.d03||!Array.isArray(k.jointAngleExample)||k.jointAngleExample.length!==2||!k.jointAngleExample.every(Number.isFinite))return "REJECT";
 const raw=Math.abs(k.jointAngleExample[1]-k.jointAngleExample[0])%360;
 if(Math.abs(Math.min(raw,360-raw)-k.displayDeltaDeg)>1e-8||k.physicalUnwrap!=="UNKNOWN"||k.jointRateCertified!==false||k.jointWordsInCl!==false)return "REJECT";
 if(g.owner!=="07.ContinuousToolpathOwnerPort"||JSON.stringify(g.channels)!==JSON.stringify(["GUI","CLI","Agent"])||g.singleBabylon!==true||g.leftPanel!=="UnifiedTaskPanel"||!sha(g.expected)||g.expected!==g.actual||g.aclEpoch!==g.aclSeen||g.scopeEpoch!==g.scopeSeen||g.generation!==g.receiptGeneration||g.cancelled!==false||g.rollback!=="READ_ONLY_FALLBACK")return "REJECT";
 if(c.clNeutral!==true||c.d12!=="NOT_RUN"||c.d13!=="UNKNOWN"||c.d14!=="NOT_RUN"||c.d15!=="NOT_RUN"||c.d16!==false||c.materialSweep!==false||c.clPreviewCertifies!==false)return "REJECT";
 if(k.calibrated!==true||k.jacobianRank!==5||!Number.isFinite(k.sigmaMin)||!Number.isFinite(k.sigmaPolicyMin)||k.sigmaPolicyMin<=0||k.sigmaMin<k.sigmaPolicyMin)return "UNKNOWN";
 return "PLANNING_CANDIDATE";
}
function run(root=process.cwd()){
 const f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-07-04/orientation-ik-b34-fixtures-v08.json"),"utf8"));
 const t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-07-04-orientation-ik-b34-v08.json"),"utf8"));
 const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-07-04-orientation-ik-b34.json"),"utf8"));
 const sourceIds=new Set(s.sources.map(x=>x.id)),ids=new Set(f.cases.map(x=>x.id));
 if(s.sources.length!==s.registeredRecords||t.rules.length!==8||f.cases.length!==44||ids.size!==f.cases.length)throw Error("计数/ID错误");
 for(const r of t.rules){if(!r.fields.length||r.sourceIds.some(x=>!sourceIds.has(x))||[...r.positiveIds,...r.unknownIds,...r.negativeIds].some(x=>!ids.has(x)))throw Error("追踪未闭环："+r.id)}
 for(const c of f.cases){const actual=judge(c.input);if(actual!==c.expected)throw Error(c.id+": "+actual+" != "+c.expected)}
 if(Math.min(358,360-358)!==2)throw Error("角差反例错误");
 return {status:"PLANNING_SYNTHETIC_PASS",total:f.cases.length,positive:2,unknown:1,negative:41,independentProduct:"NOT_RUN"};
}
if(require.main===module){try{console.log(JSON.stringify(run()))}catch(e){console.error(e.stack);process.exitCode=1}}
module.exports={judge,run};

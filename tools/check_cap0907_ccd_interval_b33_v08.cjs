"use strict";
// B33只读规划校验；不访问产品仓，不运行FCL/OCCT，不产生安全PASS。
const fs=require("node:fs"),path=require("node:path");
const hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const pathTo=(obj,p,v)=>{const keys=p.split(".");let d=obj;for(let i=0;i<keys.length-1;i++)d=d[keys[i]];d[keys.at(-1)]=v;};
function verdict(x){
 const s=x.source,g=x.geometry,w=x.guard;
 if([s.finalNcHash,s.d13Hash,s.d14Hash,s.d03KinematicsHash,s.d10BindingHash,s.profileHash].some(v=>!hash(v))||s.frame!==g.frame||!s.exactRevision)return {status:"STALE"};
 if(!s.d04NominalOnly||!s.fromFinalNc)return {status:"REJECT"};
 if(w.expectedRevision!==w.actualRevision||w.observedHash!==s.finalNcHash||w.aclEpoch!==w.aclObserved||w.scopeEpoch!==w.scopeObserved||w.cancelGeneration!==w.ackGeneration||w.cancelled||w.lateAck||!w.authorized||!w.cas)return {status:"STALE"};
 if(w.owner!=="09.SafetyVerificationOwner"||JSON.stringify(w.channels)!=='["GUI","CLI","Agent"]'||!w.oneBabylonScene||w.taskPanel!=="left/UnifiedTaskPanel"||!(w.fontMaxPx<=12&&w.fontMaxPx>0)||w.beforeFrozenHash!==w.afterFrozenHash||w.rollback!=="READ_ONLY_EXACT_REVISION"||w.dependentInvalidation!=="EXPLICIT"||w.consumer!=="NOT_RUN"||w.d16!=="BLOCKED"||w.l3!=="PENDING_HUMAN")return {status:"REJECT"};
 if(g.allowCollision||g.allowlistScope!=="NONE")return {status:"REJECT"};
 if(!hash(g.shapeAHash)||!hash(g.shapeBHash)||g.pair!=="HOLDER_FIXTURE"||!g.intervalsComplete||!g.timeMonotonic||!g.physicalJointPathProven||!g.envelopeProven||g.rotating||g.model!=="LINEAR_TRANSLATION_1D"||g.solver!=="ANALYTIC_INTERVAL"||g.solverVersion!=="B33_MATH_V1"||g.onlyEndpointSampling)return {status:"UNKNOWN"};
 if([g.startX,g.endX,g.fixedX,g.radiusSum,g.margin,g.errorBound].some(v=>!Number.isFinite(v))||g.radiusSum<0||g.margin<0||g.errorBound<0)return {status:"UNKNOWN"};
 const x0=g.startX-g.fixedX,x1=g.endX-g.fixedX;
 const closest=(x0<=0&&x1>=0)||(x1<=0&&x0>=0)?0:Math.min(Math.abs(x0),Math.abs(x1));
 const clearance=closest-g.radiusSum;
 if(clearance<0){let firstContact=null;if(x1!==x0){const a=(-g.radiusSum-x0)/(x1-x0),b=(g.radiusSum-x0)/(x1-x0);firstContact=[a,b].filter(t=>t>=0&&t<=1).sort((u,v)=>u-v)[0]??null;}return {status:"SYNTHETIC_COLLISION_WITNESS",firstContact,clearance};}
 if(clearance-g.errorBound>g.margin)return {status:"SYNTHETIC_CLEARANCE_CANDIDATE",clearance};
 return {status:"UNKNOWN",clearance};
}
const fixtures=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../docs/capabilities/CAP-09-07/ccd-interval-b33-fixtures-v08.json"),"utf8"));
const trace=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../research/traces/CAP-09-07-ccd-interval-b33-v08.json"),"utf8"));
const sources=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../research/sources/CAP-09-07-ccd-interval-b33.json"),"utf8"));
const issues=[],ids=new Set(fixtures.cases.map(x=>x.id)),sourceIds=new Set(sources.sources.map(x=>x.id));
if(fixtures.positiveCount+fixtures.negativeCount!==fixtures.cases.length)issues.push("count");
for(const c of fixtures.cases){const x=JSON.parse(JSON.stringify(fixtures.base));for(const [p,v] of Object.entries(c.patch))pathTo(x,p,v);const got=verdict(x);if(got.status!==c.expected)issues.push(c.id+":"+got.status+"!="+c.expected);if(c.assertFirstContact!==undefined&&Math.abs(got.firstContact-c.assertFirstContact)>1e-12)issues.push(c.id+":timeOfImpact");}
for(const r of trace.rules){if(!r.fields.length||!r.workPackageIds.length||r.sourceIds.some(x=>!sourceIds.has(x))||[...r.positiveIds,...r.negativeIds].some(x=>!ids.has(x)))issues.push(r.id+":traceIncomplete");}
const nc=fixtures.cases.find(x=>x.id==="P02");if(!nc||nc.expected!=="SYNTHETIC_COLLISION_WITNESS")issues.push("no_midpath_collision");
console.log(JSON.stringify({caseCount:fixtures.cases.length,positive:fixtures.positiveCount,negative:fixtures.negativeCount,traceRules:trace.rules.length,issues,level:"SYNTHETIC_ONLY",independentNodeProcess:"RAN_ONLY_WHEN_THIS_FILE_IS_ACTUALLY_EXECUTED",actualFCL:"NOT_RUN",actualOCCT:"NOT_RUN",actualD15:"NOT_RUN",D16:"BLOCKED"}));
if(issues.length)process.exitCode=1;

"use strict";
// B60：规划合成检查器，绝不连接或操纵机床。
const fs=require("node:fs"),assert=require("node:assert/strict");
const judge=function judge(v){
const o=v.owner,p=v.pose,e=v.execution,u=v.ui,l=v.legacy;
if(o.acl!=="ALLOW"||o.cancelled)return "REJECT";
if(o.rev!==o.actualRev||o.hash!==o.actualHash||o.frame!==o.actualFrame||o.epoch!==o.actualEpoch||o.generation!==o.ackGeneration||p.poseHash!==p.clPoseHash)return "STALE";
if(!p.fullFrame||l.vectorOnly||p.R===null||!p.fromFrame||!p.toFrame)return "UNKNOWN";
if(!Array.isArray(p.R)||p.R.length!==3||!p.R.every(x=>Array.isArray(x)&&x.length===3&&x.every(Number.isFinite)))return "REJECT";
const r=p.R, col=i=>[r[0][i],r[1][i],r[2][i]],dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],x=col(0),y=col(1),z=col(2),eps=p.tol;
if(!Number.isFinite(eps)||eps<=0||eps>1e-4||p.unit!=="mm")return "REJECT";
if(Math.abs(dot(cross(x,y),z)-1)>eps||[x,y,z].some(w=>Math.abs(dot(w,w)-1)>eps)||Math.abs(dot(x,y))>eps||Math.abs(dot(x,z))>eps||Math.abs(dot(y,z))>eps)return "REJECT";
if(!Array.isArray(p.axisX)||!Array.isArray(p.axisZ)||p.axisX.length!==3||p.axisZ.length!==3||!p.axisX.every(Number.isFinite)||!p.axisZ.every(Number.isFinite))return "REJECT";
if(p.axisX.some((a,i)=>Math.abs(a-x[i])>eps)||p.axisZ.some((a,i)=>Math.abs(a-z[i])>eps))return "REJECT";
if(p.mode!=="INDEXED_3_PLUS_2"||p.rotaryDuringCut||p.clMachineAxes||!p.retracted)return "REJECT";
if(e.d04Owner!=="D04"||e.d10Owner!=="D10"||e.d10InCl||e.post==="G10_L2_R_AS_UNIVERSAL_TILT")return "REJECT";
if(!["POST_PENDING","CONTROLLER_SPECIFIC_REQUIRES_EVIDENCE"].includes(e.post))return "UNKNOWN";
if(e.clClaimD15||e.clClaimD16||e.materialSweepClaim||!e.frozenUnchanged)return "REJECT";
if(u.engines!==1||u.scenes!==1||u.canvases!==1||u.panel!=="LEFT"||u.port!=="D09.IndexedPosePort"||u.entries.slice().sort().join(",")!=="AGENT,CLI,GUI"||u.fontMax>12)return "REJECT";
if(!l.rollbackNewRev||l.unknownAsPass)return "REJECT";
return "LOCAL_CANDIDATE";
};
function patch(obj,path,value){let a=path.split("."),x=obj;for(let i=0;i<a.length-1;i++)x=x[a[i]];x[a.at(-1)]=value;}
const f=JSON.parse(fs.readFileSync(process.argv[2]||"docs/capabilities/CAP-07-03/indexed-roll-b60-fixtures-v08.json","utf8"));
const t=JSON.parse(fs.readFileSync(process.argv[3]||"research/traces/CAP-07-03-indexed-roll-b60-v08.json","utf8"));
const ids=new Set(),counts={};
for(const c of f.cases){assert(!ids.has(c.id),"重复验收ID");ids.add(c.id);const v=JSON.parse(JSON.stringify(f.base));for(const [k,x]of Object.entries(c.edits))patch(v,k,x);let actual=judge(v);assert.equal(actual,c.expected,c.id);counts[actual]=(counts[actual]||0)+1;}
for(const r of t.rules){assert(r.fields.length&&r.sourceIds.length&&r.originalWorkPackages.length&&r.negativeTestIds.length,"规则字段/来源/反例缺失");for(const id of [...r.positiveTestIds,...r.negativeTestIds,...r.unknownTestIds])assert(ids.has(id),"失配的规则验收引用");}
console.log(JSON.stringify({kind:"PLANNING_SYNTHETIC_ONLY",status:"PASS",count:f.cases.length,counts,independentConsumers:"NOT_RUN",productAcceptance:"NOT_RUN"}));

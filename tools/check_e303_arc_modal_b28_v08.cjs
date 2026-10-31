// 原E3-03 B28；仅规划合成的只读校验工具，非真实NC解释器。
'use strict';
const fs=require('node:fs'),path=require('node:path');
const validate=function validate(x){
 const H=v=>typeof v==="string"&&/^[0-9a-f]{64}$/.test(v),r=x.refs||{},m=x.modal||{},a=x.arc||{},g=x.gate||{};
 if(x.schema!=="procet-b28-arc-synthetic-v1"||!["nc","d04","d10","frame","profile"].every(k=>H(r[k]))||r.d04===r.d10||r.profileId!=="LinuxCNC-2.9-doc-only"||r.controllerApproved!==false)return"B28-R1";
 const P={G17:{a:[0,1],w:["I","J"],h:2},G18:{a:[0,2],w:["I","K"],h:1},G19:{a:[1,2],w:["J","K"],h:0}}[m.plane];
 if(!P||!["G90","G91"].includes(m.distance)||!["G90.1","G91.1"].includes(m.center)||m.unit!=="G21"||m.feedMode!=="G94"||!(m.feed>0)||!H(m.preHash)||!H(m.postHash))return"B28-R2";
 if(!["G2","G3"].includes(a.mode)||!["CENTER","RADIUS"].includes(a.format)||!Array.isArray(a.start)||!Array.isArray(a.end)||a.start.length!==3||a.end.length!==3||![...a.start,...a.end].every(Number.isFinite))return"B28-R3";
 if(!Number.isInteger(a.turns)||a.turns<1||a.turns>8)return"B28-R4";
 let chord=Math.hypot(...P.a.map(k=>a.end[k]-a.start[k]));
 if(a.format==="CENTER"){
  if(a.radius!==null||!a.ijk||Object.keys(a.ijk).some(k=>!P.w.includes(k))||!Object.keys(a.ijk).length||m.center==="G90.1"&&P.w.some(k=>!Object.hasOwn(a.ijk,k)))return"B28-R3";
  const c=P.a.map((k,i)=>m.center==="G90.1"?(a.ijk[P.w[i]]??0):a.start[k]+(a.ijk[P.w[i]]??0));
  if(!c.every(Number.isFinite)||Math.hypot(...P.a.map((k,i)=>a.start[k]-c[i]))<1e-8||Math.abs(Math.hypot(...P.a.map((k,i)=>a.start[k]-c[i]))-Math.hypot(...P.a.map((k,i)=>a.end[k]-c[i])))>1e-8)return"B28-R3";
 }else{
  if(a.ijk!==null||!Number.isFinite(a.radius)||!a.radius||chord<1e-10)return"B28-R4";
  if(chord>2*Math.abs(a.radius)+1e-10)return"B28-R5";
  if((2*Math.abs(a.radius)-chord)/(2*Math.abs(a.radius))<0.01)return"B28-R5-UNKNOWN";
 }
 if(a.cutterComp!=="G40"||a.macro!==false||a.rotary!==false||!Number.isFinite(a.helixDisplacement)||Math.abs(a.end[P.h]-a.start[P.h]-a.helixDisplacement)>1e-9)return"B28-R6";
 if(!Number.isInteger(a.sourceLine)||a.sourceLine<1||!H(a.blockHash))return"B28-R7";
 if(g.port!=="08.NcExecutionPort.interpret"||g.channels?.join("|")!=="GUI|CLI|Agent"||g.worlds!==1||g.panel!=="UnifiedTaskPanel.left"||g.expectedRevision!==g.observedRevision||g.aclEpoch!==g.aclObserved||g.scopeEpoch!==g.scopeObserved||g.generation!==g.generationObserved||g.cancelled!==false||g.lateAckAdopted!==false||g.d13!=="SYNTHETIC_ONLY"||g.d14!=="NOT_RUN"||g.d15!=="NOT_RUN"||g.d16!=="BLOCKED")return"B28-R8";
 return"PASS";
};
const patch=(o,k,v)=>{let ks=k.split("."),q=o;for(const key of ks.slice(0,-1))q=q[key];q[ks.at(-1)]=v};
function main(root=path.resolve(__dirname,'..')){
const f=JSON.parse(fs.readFileSync(path.join(root,'docs/work-packages/E3-03/arc-modal-b28-fixtures-v08.json'),'utf8'));
const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/E3-03-arc-modal-b28.json'),'utf8'));
const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/E3-03-arc-modal-b28-v08.json'),'utf8'));
if(!f.syntheticOnly||f.cases.length!==21||s.sources.length!==4||t.rules.length!==8)throw Error('计数断链');
const sid=new Set(s.sources.map(z=>z.id)),cid=new Set(f.cases.map(z=>z.id));
for(const r of t.rules){if(r.sourceIds.some(k=>!sid.has(k))||!r.negativeIds.length||r.negativeIds.some(k=>!cid.has(k))||r.positiveIds.some(k=>!cid.has(k))||r.workPackageIds[0]!=='E3-03')throw Error('来源验收断链'+r.id);for(const p of r.fields){let v=f.base;for(const k of p.split('.')){if(v==null||!(k in v))throw Error('字段断链 '+p);v=v[k]}}}
for(const c of f.cases){let x=JSON.parse(JSON.stringify(f.base));for(const p of c.patches)patch(x,p.path,p.value);let v=validate(x);if(v!==c.expected)throw Error(c.id+': '+v+' expected '+c.expected)}
console.log('PASS_SYNTHETIC_ONLY 5正16反（含1个UNKNOWN），共21/21');
}
if(require.main===module)main();
module.exports={validate,main};

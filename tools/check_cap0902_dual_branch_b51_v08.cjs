'use strict';
// Procet B51规划合成判定：非产品运动学实现，所有注释与报告均以规划证据分级。
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const judge=function judge(v){
  const bad="REJECT", unknown="UNKNOWN", yes="ACCEPT_SYNTHETIC";
  if(!v||typeof v!=="object")return bad;
  if(!v.refs||v.refs.scope!=="project-demo/setup-1"||!Number.isInteger(v.refs.scopeEpoch)||v.refs.scopeEpoch<1)return bad;
  const re=/^[a-f0-9]{64}$/;
  for(const [k,owner] of [["d03","D03"],["d04","D04"],["d10","D10"]]){
    const r=v.refs[k];
    if(!r||r.asset!==owner||r.owner!==owner||!Number.isInteger(r.revision)||r.revision<=0||!re.test(r.contentHash)||r.frameRef!=="M")return bad;
  }
  if(!v.math||v.math.unit!=="mm"||v.math.columnConvention!=="T_A_B*p_B"||v.math.rightHanded!==true||v.math.scale!==1)return bad;
  if(!v.graph||!Array.isArray(v.graph.tool)||!Array.isArray(v.graph.work)||v.graph.tool.length!==2||v.graph.work.length!==1)return bad;
  const [s,t]=v.graph.tool,[w]=v.graph.work;
  if(s.id!=="spindle"||s.parent!=="M"||t.id!=="tcp"||t.parent!=="spindle"||w.id!=="work"||w.parent!=="M"||new Set([s.id,t.id,w.id]).size!==3)return bad;
  for(const a of [s,t,w]){
    if(!Array.isArray(a.translation)||a.translation.length!==3||a.translation.some(z=>!Number.isFinite(z))||!Number.isFinite(a.yawDeg))return bad;
  }
  if(!v.gantry||!Array.isArray(v.gantry.jointIds)||v.gantry.jointIds.length!==2||v.gantry.jointIds[0]===v.gantry.jointIds[1]||v.gantry.jointIds.some(z=>typeof z!=="string"||!z)||!Array.isArray(v.gantry.axisLetters)||v.gantry.axisLetters.length!==2||v.gantry.axisLetters.some(z=>z!=="Y")||v.gantry.hasPhysicalSeparation!==true||!Array.isArray(v.gantry.position)||v.gantry.position.length!==2||v.gantry.position.some(z=>!Number.isFinite(z))||Math.abs(v.gantry.position[0]-v.gantry.position[1])>1e-8)return bad;
  if(!v.evidence||v.evidence.provenance!=="SYNTHETIC"||v.evidence.realMachineCalibration!=="NOT_RUN")return bad;
  if(!v.execution||v.execution.d04!=="DESIGN_SETUP"||v.execution.d10!=="PHYSICAL_BINDING_SEPARATE"||v.execution.finalNc!=="NOT_PRESENT"||v.execution.d13!=="UNKNOWN"||v.execution.d14!=="NOT_RUN"||v.execution.d15!=="NOT_RUN"||v.execution.d16!=="BLOCKED"||v.execution.clAnimation!=="PREVIEW_ONLY")return bad;
  if(!v.transaction||v.transaction.casFresh!==true||v.transaction.permissionEpochCurrent!==true||v.transaction.scopeEpochCurrent!==true||v.transaction.cancelled!==false||v.transaction.lateReceipt!==false||v.transaction.freezePreserved!==true||v.transaction.rollbackRef!=="old-revision")return bad;
  if(!v.ui||v.ui.singleScene!==true||v.ui.leftUnifiedTaskPanel!==true||v.ui.allEntrypointsSharePort!==true)return bad;
  if(v.evidence.pivotKnown==="UNKNOWN"||v.evidence.toolMountKnown==="UNKNOWN"||v.gantry.homing==="UNKNOWN")return unknown;
  if(v.evidence.pivotKnown!=="SYNTHETIC"||v.evidence.toolMountKnown!=="SYNTHETIC"||v.gantry.homing!=="SYNTHETIC")return bad;
  const rad=Math.PI/180;
  function compose(parent,n){
    const c=Math.cos(parent.a),sn=Math.sin(parent.a),q=n.translation;
    return {x:parent.x+c*q[0]-sn*q[1],y:parent.y+sn*q[0]+c*q[1],z:parent.z+q[2],a:parent.a+n.yawDeg*rad};
  }
  const origin={x:0,y:0,z:0,a:0};
  const tool=compose(compose(origin,s),t), work=compose(origin,w);
  const dx=tool.x-work.x,dy=tool.y-work.y,c=Math.cos(work.a),sn=Math.sin(work.a);
  const result=[c*dx+sn*dy,-sn*dx+c*dy,tool.z-work.z,(tool.a-work.a)/rad];
  if(!v.golden||!Array.isArray(v.golden.relativeTcpInWork)||v.golden.relativeTcpInWork.length!==4||v.golden.relativeTcpInWork.some((z,i)=>!Number.isFinite(z)||Math.abs(result[i]-z)>1e-8))return bad;
  return yes;
};
const applyOverride=function applyOverride(obj,key,val){
  const parts=key.split(".");
  let node=obj;
  for(let i=0;i<parts.length-1;i++){if(node==null||!(parts[i] in node))throw Error("invalid override path "+key);node=node[parts[i]];}
  const last=parts[parts.length-1];
  if(node==null||!(last in node))throw Error("invalid override final "+key);
  node[last]=val;
};
function run(){
 const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-09-02/dual-branch-b51-fixtures-v08.json'),'utf8'));
 const tr=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-09-02-dual-branch-b51-v08.json'),'utf8'));
 const sr=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-09-02-dual-branch-b51.json'),'utf8'));
 const ids=new Set(f.cases.map(x=>x.id)); const sources=new Set(sr.sources.map(x=>x.id));
 if(ids.size!==f.cases.length||tr.rules.length!==8||sr.sources.length!==6)throw Error('ID/count mismatch');
 const covered=new Set();for(const rule of tr.rules){
  if(!rule.sourceIds.length||!rule.sourceIds.every(id=>sources.has(id)))throw Error('source link '+rule.id);
  for(const id of [...rule.positiveIds,...rule.negativeIds,...rule.unknownIds]){if(!ids.has(id))throw Error('fixture link '+id);covered.add(id);}
 }
 if(covered.size!==ids.size)throw Error('untraced fixtures');
 let ok=0;for(const item of f.cases){const x=JSON.parse(JSON.stringify(f.base));
  for(const [key,value] of Object.entries(item.overrides||{}))applyOverride(x,key,value);
  const value=judge(x);if(value!==item.expected)throw Error(item.id+': expected '+item.expected+' got '+value);ok++;
 }
 return {verdict:'PLANNING_SYNTHETIC_ONLY',passed:ok,total:f.cases.length,independentNode:'RAN_IF_EXECUTED_AS_NODE',realOCCT:'NOT_RUN',realMachine:'NOT_RUN',realConsumers:'0/17'};
}
if(require.main===module){try{console.log(JSON.stringify(run(),null,2));}catch(e){console.error(e);process.exitCode=1;}}
module.exports={judge,applyOverride,run};

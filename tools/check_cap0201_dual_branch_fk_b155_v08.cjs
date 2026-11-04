#!/usr/bin/env node
"use strict";
// B155：仅只读规划JSON；不是Procet/OCCT/LinuxCNC真实运行。
const fs=require("node:fs"),path=require("node:path");
function approx(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8}
function judge(rule,d){
 switch(rule){
 case "B155-R01":return d.parentLinksValid===true&&d.acyclic===true&&d.rootCount===1&&Number.isInteger(d.nodeCount)&&d.nodeCount>=2;
 case "B155-R02":return approx(d.axisNorm,1)&&d.axisFrame==="PARENT_LOCAL"&&d.zeroRigid===true&&d.angleUnit==="RAD";
 case "B155-R03":return typeof d.spindleLeaf==="string"&&typeof d.workpieceLeaf==="string"&&d.spindleLeaf!==d.workpieceLeaf&&d.branchIndependent===true&&/^sha256:[a-f0-9]{32,64}$/.test(d.snapshotHash);
 case "B155-R04":return [d.spindleWorldX,d.workpieceWorldX,d.relativeWorkX].every(Number.isFinite)&&approx(d.relativeWorkX,d.spindleWorldX-d.workpieceWorldX)&&d.relativeFrame==="WORK_FROM_SPINDLE";
 case "B155-R05":return [d.pivotX,d.localOffsetX,d.angleDeg,d.observedWorldX].every(Number.isFinite)&&approx(d.observedWorldX,d.pivotX+d.localOffsetX*Math.cos(d.angleDeg*Math.PI/180));
 case "B155-R06":return [d.homeJointRad,d.zeroJointRad,d.homeMinusZeroRad].every(Number.isFinite)&&approx(d.homeJointRad-d.zeroJointRad,d.homeMinusZeroRad)&&d.homeEvidence==="MEASURED";
 case "B155-R07":return d.machineRevision==="D03-r7"&&d.expectedRevision===d.machineRevision&&/^sha256:[a-f0-9]{32,64}$/.test(d.contentHash)&&d.aclAllowed===true;
 case "B155-R08":return d.resourceStage==="D03"&&d.executionBindingStage==="D10"&&d.ncProof==="NOT_RUN"&&d.consumerGate==="REQUIRES_INDEPENDENT";
 default:return false;
 }
}
function poseRel(w,s){let a=-w.yaw*Math.PI/180,dx=s.x-w.x,dy=s.y-w.y;return {x:Math.cos(a)*dx-Math.sin(a)*dy,y:Math.sin(a)*dx+Math.cos(a)*dy,yaw:s.yaw-w.yaw}}
function poseAt(p,pt){let a=p.yaw*Math.PI/180;return {x:p.x+Math.cos(a)*pt.x-Math.sin(a)*pt.y,y:p.y+Math.sin(a)*pt.x+Math.cos(a)*pt.y}}
function goldenJudge(g){
 const x=g.input;
 let actual;
 switch(g.kind){
 case "RELATIVE":actual=poseRel(x.work,x.spindle);break;
 case "PIVOT":actual=poseAt(x.pivot,x.point);break;
 case "ORDER_NONCOMMUTES":{const a=poseAt(x.translate,poseAt(x.rotate,x.point)),b=poseAt(x.rotate,poseAt(x.translate,x.point));actual=Math.hypot(a.x-b.x,a.y-b.y)>1e-8;break;}
 case "HOME_DELTA":actual=x.home-x.zero;break;
 default:throw Error("UNKNOWN_GOLDEN");
 }
 if(typeof g.expected==="number")return approx(actual,g.expected);
 if(typeof g.expected==="boolean")return actual===g.expected;
 return Object.keys(g.expected).every(k=>approx(actual[k],g.expected[k]));
}
function main(){
 const root=path.resolve(__dirname,"..");
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
 const s=read("research/sources/CAP-02-01-dual-branch-fk-b155.json"),t=read("research/traces/CAP-02-01-dual-branch-fk-b155-v08.json"),f=read("docs/capabilities/CAP-02-01/dual-branch-fk-b155-fixtures-v08.json");
 if(s.records.length!==6||t.rules.length!==8||f.cases.length!==40||f.goldens.length!==8)throw Error("计数异常");
 const src=new Set(s.records.map(x=>x.id)),seen=new Set();let pos=0,neg=0;
 for(const r of t.rules){
  if(r.fields.length!==4||r.sourceIds.some(x=>!src.has(x))||r.testIds.length!==5)throw Error("规则来源缺失："+r.id);
  const p=f.cases.find(x=>x.id===r.id+"-P");
  if(!p||p.expect!=="PASS"||!judge(r.id,p.record))throw Error("正例失败："+r.id);pos++;
  for(let j=0;j<4;j++){
   const n=f.cases.find(x=>x.id===r.id+"-N"+(j+1));
   if(!n||n.expect!=="FAIL"||n.mutatedField!==r.fields[j]||judge(r.id,n.record))throw Error("反例未拒绝："+r.id+"-"+j);
   const changes=Object.keys(p.record).filter(k=>JSON.stringify(p.record[k])!==JSON.stringify(n.record[k]));
   if(changes.length!==1||changes[0]!==r.fields[j])throw Error("反例不是单字段："+n.id);neg++;
  }
  for(const id of r.testIds){if(seen.has(id)||!f.cases.some(x=>x.id===id))throw Error("重复/缺失："+id);seen.add(id);}
 }
 for(const g of f.goldens)if(!goldenJudge(g))throw Error("数学Golden失败："+g.id);
 if(pos!==8||neg!==32||seen.size!==40)throw Error("覆盖不符合要求");
 console.log(JSON.stringify({status:"PASS_PLANNING_SYNTHETIC_ONLY",positives:pos,independentNegatives:neg,goldens:8,total:48,product:"NOT_RUN"}));
}
if(require.main===module)main();

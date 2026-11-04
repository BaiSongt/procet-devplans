#!/usr/bin/env node
"use strict";
// B156：只读规划合成校验器，非真实OCCT/Post/控制器/产品验收。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sag=function sag(R,a,n){return R*(1-Math.cos(a/(2*n)))};
const minN=function minN(R,a,t){return Math.ceil(a/(2*Math.acos(1-t/R)))};
const judge=function judge(id,d){
switch(id){
case "B156-R01":return /^sha256:[0-9a-f]{64}$/.test(d.clHash||"")&&d.frameExact==="D04@r7:WCS"&&d.sourceState==="EXACT"&&d.frozenPreserved===true;
case "B156-R02":return Number.isFinite(d.radiusMm)&&d.radiusMm>0&&Number.isFinite(d.sweepRad)&&d.sweepRad>0&&d.sweepRad<=2*Math.PI&&Number.isInteger(d.segments)&&d.segments>=1&&Number.isFinite(d.maxSagittaMm)&&d.maxSagittaMm>0&&sag(d.radiusMm,d.sweepRad,d.segments)<=d.maxSagittaMm+1e-12;
case "B156-R03":return d.algorithm==="OCCT_QUASI"&&d.isDone===true&&d.boundEvidence==="INDEPENDENT_INTERVAL_CERT"&&d.algorithmVersion==="8.0.1";
case "B156-R04":return [d.geomMm,d.postMm,d.ctrlMm,d.totalMm].every(x=>Number.isFinite(x)&&x>=0)&&Math.abs(d.totalMm-(d.geomMm+d.postMm+d.ctrlMm))<1e-10&&d.totalMm<=.10000000001;
case "B156-R05":return d.norm==="WCS_TCP_MM"&&d.sameFrame===true&&d.controllerMode==="G64_P_Q_PINNED"&&/^sha256:[0-9a-f]{64}$/.test(d.controllerProfileHash||"");
case "B156-R06":return d.neutralClOwnedBy==="D09"&&d.postOwnedBy==="D12"&&d.reparseFinalNc==="D13"&&d.d15Status==="NOT_RUN";
case "B156-R07":return d.ownerPort==="CAM_DOMAIN_PORT"&&d.aclCasRecheck===true&&d.epochAndCancelChecked===true&&d.singleWorldLeftPanel===true;
case "B156-R08":return d.unknownBlocksRelease===true&&d.frozenImmutable===true&&d.legacyReaderKept===true&&d.consumerAcceptance==="NOT_RUN";default:return false;
}};
const goldenValue=function goldenValue(q){let x=q.input;return q.kind==="SAG"?sag(x.a,x.b,x.c):q.kind==="MIN_N"?minN(x.a,x.b,x.c):q.kind==="BUDGET"?x.a+x.b+x.c:NaN};
const verifyAll=function verifyAll(s,t,f){
 if(s.records.length!==6||t.rules.length!==8||f.cases.length!==40||f.goldens.length!==8)throw Error("counts");
 const ids=new Set();
 for(const r of t.rules){
  if(r.fields.length!==4||r.sourceIds.some(a=>!s.records.some(b=>b.id===a)))throw Error(r.id+" source/field");
  const p=f.cases.find(x=>x.id===r.id+"-P");
  if(!p||p.expect!=="PASS"||!judge(r.id,p.record))throw Error("POS "+r.id);
  for(let i=0;i<4;i++){
   let n=f.cases.find(x=>x.id===r.id+"-N"+(i+1));if(!n||n.expect!=="FAIL"||n.mutatedField!==r.fields[i]||judge(r.id,n.record))throw Error("NEG "+r.id);
   const differences=Object.keys(p.record).filter(k=>JSON.stringify(p.record[k])!==JSON.stringify(n.record[k]));
   if(differences.length!==1||differences[0]!==r.fields[i])throw Error("NON_SINGLE_FIELD "+n.id);
  }
  for(const id of r.testIds){if(ids.has(id)||!f.cases.some(x=>x.id===id))throw Error("traceIds");ids.add(id)}
 }
 for(const q of f.goldens)if(Math.abs(goldenValue(q)-q.expected)>1e-10)throw Error(q.id+" GOLDEN");
 return {status:"PASS_PLANNING_SYNTHETIC_ONLY",positives:8,independentNegatives:32,goldens:8,total:48};
};
if(require.main===module){const result=verifyAll(read("research/sources/CAP-07-07-chord-budget-b156.json"),read("research/traces/CAP-07-07-chord-budget-b156-v08.json"),read("docs/capabilities/CAP-07-07/chord-budget-b156-fixtures-v08.json"));console.log(JSON.stringify(result));}

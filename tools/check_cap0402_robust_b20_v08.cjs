#!/usr/bin/env node
'use strict';
// 只读规划合成检验：未运行OCCT/ICP，绝不把合成PASS等同真实产品PASS。
const fs=require('node:fs');
const path=require('node:path');
const validate=function validate(s){
 const e=[];const check=(c,ok)=>{if(!ok)e.push(c)};
 const finite3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
 const pattern=/^D0[14](?:\.Stock)?@sha256:[a-f0-9]{64}$/;
 check("R01_SOURCE_ID",pattern.test(s.targetCadExactRef||"")&&pattern.test(s.stockExactRef||"")&&Array.isArray(s.cadOccurrencePath)&&s.cadOccurrencePath.length>0&&s.topologyQualified===true&&s.correspondenceHash===s.currentCorrespondenceHash);
 check("R02_UNIT_FRAME",s.sourceUnit==="mm"&&s.targetUnit==="mm"&&s.expectedFrame===s.outputFrame&&s.outputFrame==="D04.Setup@rev8");
 const ptsOK=p=>Array.isArray(p)&&p.length>=3&&p.every(finite3);
 const ranked=p=>{if(!ptsOK(p))return false;for(let i=1;i<p.length;i++)for(let j=i+1;j<p.length;j++){let a=p[i].map((x,k)=>x-p[0][k]),b=p[j].map((x,k)=>x-p[0][k]);let cross=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];if(cross.reduce((x,y)=>x+y*y,0)>1e-16)return true}return false};
 const pointsOK=ptsOK(s.sourcePts)&&ptsOK(s.targetPts)&&s.sourcePts.length===s.targetPts.length&&ranked(s.sourcePts)&&ranked(s.targetPts);
 check("R03_OBSERVABILITY",pointsOK);
 const M=s.rotation, rowOK=Array.isArray(M)&&M.length===3&&M.every(finite3);
 let rigid=false;
 if(rowOK&&finite3(s.translation)){
  const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
  const det=M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1])-M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0])+M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]);
  rigid=Math.abs(det-1)<1e-10&&M.every((a,i)=>M.every((b,j)=>Math.abs(dot(a,b)-(i===j?1:0))<1e-10));
 }
 check("R04_RIGID",rigid&&s.withScaling===false);
 if(pointsOK&&rigid&&s.withScaling===false){
  const fit=s.sourcePts.every((p,i)=>{let q=M.map((row,j)=>row.reduce((v,x,k)=>v+x*p[k],s.translation[j]));return Math.hypot(...q.map((v,j)=>v-s.targetPts[i][j]))<=1e-8});
  check("R05_RESIDUAL",fit);
 }
 check("R06_QUALIFICATION",s.algorithm==="UMEYAMA_RIGID"&&s.solverProfileRef==="SYNTHETIC_RIGID_V1"&&s.solutionStatus==="candidate"&&s.metrologyQualified===false&&s.datumApproved===false&&s.engineeringVerified===false);
 check("R07_UI_OWNER",s.engineCount===1&&s.sceneCount===1&&s.canvasCount===1&&s.leftTaskPanelCount===1&&s.previewOnly===true&&Array.isArray(s.consumerOwnerPorts)&&s.consumerOwnerPorts.length===3&&s.consumerOwnerPorts.every(x=>x==="D04.OwnerPort"));
 check("R08_CAS_ACK",s.expectedRevision===s.currentRevision&&s.scopeEpoch===s.responseScopeEpoch&&s.permissionEpoch===s.responsePermissionEpoch&&s.permissionCurrent===true&&s.cancelled===false&&s.lateAckApplied===false);
 check("R09_D04_D10",s.executionBindingUpdated===false&&s.ncValidation==="unknown"&&s.releaseStatus==="blocked");
 return e;
};
const apply=(b,c)=>{const s=JSON.parse(JSON.stringify(b));for(const p of c.patches||[c]){if(p.field)s[p.field]=p.value}return s};
function run(fixtures,trace){
 const failures=[];let passed=0;
 const sources=new Set(trace.sources.map(x=>x.id)),cases=new Set(fixtures.cases.map(x=>x.id));
 for(const rule of trace.rules){
  for(const src of rule.sourceIds){if(!sources.has(src))failures.push({rule:rule.id,error:'SOURCE_NOT_REGISTERED',src})}
  for(const field of rule.fields){if(!Object.hasOwn(fixtures.baseline,field))failures.push({rule:rule.id,error:'FIELD_NOT_PRESENT',field})}
  for(const id of [...rule.positiveTests,...rule.negativeTests]){if(!cases.has(id))failures.push({rule:rule.id,error:'TEST_NOT_FOUND',id})}
 }
 for(const c of fixtures.cases){
  const actual=validate(apply(fixtures.baseline,c)).sort();
  const expected=[...c.expectedCodes].sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected))failures.push({case:c.id,expected,actual});else passed++;
 }
 return {classification:'PLANNING_SYNTHETIC_ONLY',passed,total:fixtures.cases.length,failures};
}
if(require.main===module){
 const arg=process.argv;
 if(!arg.includes('--self-test')){console.error('用法: node tools/check_cap0402_robust_b20_v08.cjs --self-test');process.exitCode=2}
 else{
  const f=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/capabilities/CAP-04-02/robust-b20-fixtures-v08.json'),'utf8'));
  const t=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../research/traces/CAP-04-02-robust-b20-v08.json'),'utf8'));
  const result=run(f,t);console.log(JSON.stringify(result,null,2));if(result.failures.length)process.exitCode=1;
 }
}
module.exports={validate,apply,run};

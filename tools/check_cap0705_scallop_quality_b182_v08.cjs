#!/usr/bin/env node
'use strict';
// 中文注释：规划数据正反验收，不调用真实OCCT/NC/机床。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-07-05-scallop-quality-b182-v08.json"),'utf8'));
const fixture=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-07-05/scallop-quality-b182-fixtures-v08.json"),'utf8'));
const source=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-07-05-scallop-quality-b182.json"),'utf8'));
function get(o,p){return p.split('.').reduce((v,k)=>v==null?undefined:v[k],o)}
function valid(def,v){
 if(def.kind==='hash')return typeof v==='string'&&new RegExp(def.pattern).test(v);
 if(def.kind==='positive_finite')return typeof v==='number'&&Number.isFinite(v)&&v>0;
 if(def.kind==='nonnegative_finite')return typeof v==='number'&&Number.isFinite(v)&&v>=0;
 if(def.kind==='equals')return v===def.value;
 return false;
}
function judge(rule,x){
 if(!rule.fields.every(f=>valid(trace.fieldDefinitions[f],get(x,f))))return 'REJECT';
 return x.geometry.stepoverMm<=2*x.geometry.radiusMm?'PASS':'REJECT';
}
function math(g){
 if(g.model!=='PLANAR_NORMAL_BALL')return {status:'UNKNOWN_MODEL'};
 if(!(typeof g.r==='number'&&Number.isFinite(g.r)&&g.r>0))return {status:'INVALID_RADIUS'};
 if(g.op==='forward'){
  if(!(typeof g.s==='number'&&Number.isFinite(g.s)&&g.s>=0&&g.s<=2*g.r))return {status:'INVALID_STEP_DOMAIN'};
  return {status:'OK',value:g.r-Math.sqrt(g.r*g.r-g.s*g.s/4)};
 }
 if(g.op==='inverse'){
  if(!(typeof g.h==='number'&&Number.isFinite(g.h)&&g.h>=0&&g.h<=g.r))return {status:'INVALID_HEIGHT_DOMAIN'};
  return {status:'OK',value:2*Math.sqrt(2*g.r*g.h-g.h*g.h)};
 }
 if(g.op==='monotonic'){
  if(![g.s1,g.s2].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=2*g.r))return {status:'INVALID_STEP_DOMAIN'};
  const h=s=>g.r-Math.sqrt(g.r*g.r-s*s/4);
  return {status:'OK',value:h(g.s1)<h(g.s2)};
 }
 return {status:'UNKNOWN_OPERATION'};
}
function run(){
 if(source.records.length!==8||source.registeredRecords!==8||new Set(source.records.map(x=>x.id)).size!==8)throw Error('source count');
 if(trace.rules.length!==8||Object.keys(trace.fieldDefinitions).length!==32||fixture.cases.length!==40||fixture.goldens.length!==10)throw Error('fixture count');
 const sources=new Set(source.records.map(x=>x.id)),seen=new Set();let passed=0;
 for(const rule of trace.rules){
  if(rule.fields.length!==4||rule.testIds.length!==5||rule.sourceIds.some(id=>!sources.has(id))||!rule.caps.includes('CAP-07-05')||!rule.originalWorkPackages.includes('E3-01'))throw Error('trace '+rule.id);
  for(const id of rule.testIds){
   if(seen.has(id))throw Error('duplicate '+id);seen.add(id);
   const c=fixture.cases.find(t=>t.id===id&&t.ruleId===rule.id);
   if(!c)throw Error('missing '+id);
   const obj=JSON.parse(JSON.stringify(fixture.baseline));
   if(c.mutation){
    if(!rule.fields.includes(c.mutation.field))throw Error('field not in rule '+id);
    const [g,k]=c.mutation.field.split('.');obj[g][k]=c.mutation.value;
   }
   if(judge(rule,obj)!==c.expect)throw Error('case '+id);
   passed++;
  }
 }
 for(const g of fixture.goldens){
  const result=math(g);
  if(result.status!==g.expect)throw Error('math status '+g.id);
  if(g.expect==='OK'&&(typeof g.expected==='number'?Math.abs(result.value-g.expected)>1e-10:result.value!==g.expected))throw Error('math value '+g.id);
  passed++;
 }
 if(passed!==50)throw Error('tested '+passed);
 console.log('B182 PLANNING SYNTHETIC '+passed+'/50 PASS; PRODUCT NOT_RUN; L3 PENDING_HUMAN');
}
if(require.main===module)run();
module.exports={judge,math,run};

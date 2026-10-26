// 规划证据检查器：只验证CAP-09-04数据与合成算例，不接触产品和用户数据。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=json('research/sources/CAP-09-04.json'),trace=json('research/traces/CAP-09-04.json'),fx=json('docs/capabilities/CAP-09-04/fixtures.json'),owner=json('docs/capabilities/CAP-09-04/asset-owner-candidates.json');
const get=(obj,p)=>p.split('.').reduce((v,k)=>v?.[k],obj), ids=new Set(src.sources.map(s=>s.id));let passed=0;
if(src.sources.length!==9||ids.size!==9||trace.rules.length!==10||fx.cases.length!==30||fx.mathVectors.length!==8||owner.entries.length!==17)throw Error('COUNT_OR_DUP');
for(const s of src.sources){if(!s.url.startsWith('https://')||!s.accessDepth||!s.limits||!s.locator)throw Error('SOURCE_META');}
for(const r of trace.rules){
 if(!r.sourceIds.length||r.sourceIds.some(s=>!ids.has(s))||r.fields.length!==4||r.workPackages.join()!=='F1-02,E3-04,E3-05,U4-04'||r.criteria.length!==4)throw Error('TRACE');
 const related=fx.cases.filter(c=>c.ruleId===r.id);
 if(related.length!==3||new Set(related.map(c=>c.scenario)).size!==3)throw Error('COVERAGE');
 for(const c of related){
   if(c.scenario!=='POSITIVE'&&!r.fields.includes(c.mutatedField))throw Error('MUTATION_FIELD');
   const verdict=r.criteria.every(p=>get(c.input,p.path)===p.value)?'PASS':'REJECT';
   if(verdict!==c.expected)throw Error(c.id);passed++;
 }
}
const close=(a,b)=>Math.abs(a-b)<1e-9;
for(const v of fx.mathVectors){
 let result;
 if(v.T_spindle_gauge){
 const a=v.T_spindle_gauge.rotationYdeg*Math.PI/180,t=v.T_spindle_gauge.translationMm,p=v.gaugeToTipMm;
 const xyz=[t[0]+Math.cos(a)*p[0]+Math.sin(a)*p[2],t[1]+p[1],t[2]-Math.sin(a)*p[0]+Math.cos(a)*p[2]];
 result=xyz.every((e,i)=>close(e,v.expectedTipMm[i]))?'PASS':'REJECT';
 }else if(v.kind==='T_H_MISMATCH')result=v.profileRequiresAgreement&&v.toolId.slice(1)!==v.offsetRegister.slice(1)?'REJECT':'PASS';
 else if(v.kind==='UNCERTAIN_MOUNT')result=v.physicalInstallMeasured?'PASS':'UNKNOWN';
 else if(v.kind==='G43_1_DYNAMIC')result=v.controllerProfile==='UNKNOWN'?'UNKNOWN':'PASS';
 else if(v.kind==='LENGTH_REVISION_CHANGE')result=v.priorGaugeMm!==v.currentGaugeMm&&v.sameD15Revision?'STALE':'PASS';
 else if(v.kind==='MIXED_UNIT')result=v.gaugeLength.unit!==v.targetUnit&&!v.explicitConversion?'REJECT':'PASS';
 else throw Error('UNSUPPORTED_VECTOR:'+v.id);
 if(result!==(v.expected||'PASS'))throw Error(v.id+':'+result);passed++;
}
console.log(JSON.stringify({scope:'PLANNING_SYNTHETIC_ONLY',passed,NC:'NOT_RUN',B5:'NOT_RUN',independentConsumer:'NOT_RUN'}));

#!/usr/bin/env node
'use strict';
// B184 纯规则校验，不写产品数据；规划PASS≠产品PASS。
const fs=require('node:fs');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
const trace=JSON.parse(fs.readFileSync(path.join(base,'research/traces/CAP-06-02-dominance-b184-v08.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(base,'research/sources/CAP-06-02-dominance-b184.json'),'utf8'));
const fixtures=JSON.parse(fs.readFileSync(path.join(base,'docs/capabilities/CAP-06-02/dominance-b184-fixtures-v08.json'),'utf8'));
const judge=function judge(id,x){
 const hash=v=>typeof v==="string"&&/^sha256:[0-9a-f]{64}$/.test(v), iscost=a=>Array.isArray(a)&&a.length===2&&a.every(y=>Number.isFinite(y)&&y>=0);
 switch(id){
 case "B184-R01":return hash(x.state.lhsStockHash)&&x.state.lhsStockHash===x.state.rhsStockHash&&typeof x.state.lhsFrame==="string"&&x.state.lhsFrame.startsWith("D04:")&&x.state.lhsFrame===x.state.rhsFrame;
 case "B184-R02":return typeof x.guards.lhsRemaining==="string"&&x.guards.lhsRemaining.length>0&&x.guards.lhsRemaining===x.guards.rhsRemaining&&hash(x.guards.lhsGuardHash)&&x.guards.lhsGuardHash===x.guards.rhsGuardHash;
 case "B184-R03":{const a=x.pareto;return iscost(a.lhsCost)&&iscost(a.rhsCost)&&Array.isArray(a.units)&&a.units.length===2&&a.units.every(z=>typeof z==="string"&&z.length>0)&&a.objectiveCertified===true&&a.lhsCost.every((v,i)=>v<=a.rhsCost[i])&&a.lhsCost.some((v,i)=>v<a.rhsCost[i]);}
 case "B184-R04":{const a=x.bound;return Number.isFinite(a.lowerBound)&&a.lowerBound>=0&&Number.isFinite(a.incumbentCost)&&a.incumbentCost>=0&&a.admissible===true&&a.objectiveSame===true&&a.lowerBound>=a.incumbentCost;}
 case "B184-R05":{const a=x.beam;return a.truncated===true&&a.status==="UNKNOWN"&&a.assertsInfeasible===false&&Number.isInteger(a.omittedCount)&&a.omittedCount>0;}
 case "B184-R06":{const a=x.geometry;return a.booleanDone===true&&hash(a.exactBrepSha)&&a.checkerStatus==="VALID"&&a.protectedClear===true;}
 case "B184-R07":{const a=x.adoption;return a.solverOnlyD06===true&&a.viaD05Owner===true&&a.freezePreserved===true&&a.branchScoped===true;}
 case "B184-R08":{const a=x.commit;return a.singleManagedPort===true&&a.casAclRechecked===true&&a.lateAckRejected===true&&a.independentNcD15===true;}
 default:return false;}
};
const clone=x=>JSON.parse(JSON.stringify(x));
const apply=(o,p,v)=>{const a=p.split('.');for(let i=0;i<a.length-1;i++)o=o[a[i]];o[a.at(-1)]=v;};
function run(){
 const errors=[], ids=new Set(sources.records.map(s=>s.id));
 if(trace.rules.length!==8||sources.records.length!==7)errors.push('count');
 for(const r of trace.rules){if(r.fields.length!==4||r.testIds.length!==5||!r.sourceIds.every(id=>ids.has(id))||r.capabilityIds[0]!=='CAP-06-02')errors.push('trace:'+r.id)}
 const arr=[...fixtures.cases,...fixtures.goldens];let pass=0;
 for(const t of arr){const row=clone(fixtures.baseline);if(t.changedField)apply(row,t.changedField,t.patchValue);const got=judge(t.ruleId,row);if(got!==t.expected)errors.push(t.id+':got='+got);else pass++;}
 if(fixtures.cases.filter(x=>x.kind==='positive').length!==8||fixtures.cases.filter(x=>x.kind==='single_field_negative').length!==32||fixtures.goldens.length!==8)errors.push('fixtures-count');
 if(errors.length){console.error('FAIL',errors);process.exitCode=1;}else console.log('B184 PLANNING_SYNTHETIC_ONLY',pass+'/'+arr.length,'; PRODUCT_NOT_RUN');
}
run();

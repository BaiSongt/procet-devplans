#!/usr/bin/env node
// E3-04纯规划数据校验：不可替代真实NC、B5或D15产品测试。
import fs from 'node:fs';
import path from 'node:path';
const arg=process.argv.indexOf('--root'); const root=path.resolve(arg>=0 ? process.argv[arg+1] : '.');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
export function classify(rule, gates){const bad=Object.entries(gates).filter(([,v])=>v!==true).map(([k])=>k);return bad.length===0 ? {status:'CANDIDATE_FOR_D15_ONLY',code:'D14_EXPANDED_ONLY'} : bad.length===1&&bad[0]===rule.fixtureGate ? {status:rule.negativeStatus,code:rule.failureCode} : {status:'REJECTED',code:'UNSPECIFIED_OR_MULTIPLE_GATES'};}
export function verify(trace,fixtures,sources,matrix,machines){
assert(trace.workPackageId==='E3-04'&&fixtures.workPackageId==='E3-04','编号错误');
assert(trace.rules.length===10&&fixtures.cases.length===20&&sources.sources.length===9,'数量错误');
assert(matrix.assets.length===17&&new Set(matrix.assets.map(x=>x.id)).size===17,'资产ID错误');
assert(sources.registeredRecords===sources.sources.length,'来源计数错误');
const ids=new Set(sources.sources.map(x=>x.id));assert(ids.size===9,'来源ID重复');
const tests=new Map(fixtures.cases.map(x=>[x.id,x]));assert(tests.size===20,'样例ID重复');
for(const r of trace.rules){
 assert(r.workPackageId==='E3-04'&&r.fields.length>0&&r.assets.length>0,'字段/资产为空:'+r.id);
 assert(r.sourceIds.length>0&&r.sourceIds.every(id=>ids.has(id)),'无来源:'+r.id);
 assert(fixtures.gateKeys.includes(r.fixtureGate),'缺门禁:'+r.id);
 const p=tests.get(r.positiveTestId),n=tests.get(r.negativeTestId);assert(p&&n&&p.ruleId===r.id&&n.ruleId===r.id,'验收缺失:'+r.id);
 assert(p.polarity==='positive'&&n.polarity==='negative','正反极性错:'+r.id);
 const a=classify(r,p.gates),b=classify(r,n.gates);assert(a.status===p.expectedStatus&&a.code===p.expectedCode,'正例失败:'+r.id);assert(b.status===n.expectedStatus&&b.code===n.expectedCode,'反例失败:'+r.id);
 assert(Object.values(p.gates).every(v=>v===true),'正例门禁错:'+r.id);
 assert(Object.entries(n.gates).filter(([,v])=>v!==true).map(([k])=>k).join(',')===r.fixtureGate,'反例翻转门禁不唯一:'+r.id);
}
const cases=machines.cases;assert(cases.length===3&&cases.some(x=>x.id==='REAL-B5-PENDING'&&x.expectedStatus==='UNKNOWN'),'实际B5不可伪造');
const simple=cases.find(x=>x.id==='SYNTHETIC-3AXIS');
const tip=[simple.jointCoordinates[0],simple.jointCoordinates[1],simple.jointCoordinates[2]-simple.toolGaugeLengthMm];
assert(tip.every((x,i)=>Math.abs(x-simple.expectedTipMm[i])<1e-9),'三轴数学样例失败');
const ac=cases.find(x=>x.id==='SYNTHETIC-AC-HEAD'),[x,y,z,A,C]=ac.jointCoordinates,L=ac.toolGaugeLengthMm;
const at=[x-L*Math.sin(A)*Math.sin(C),y+L*Math.sin(A)*Math.cos(C),z-L*Math.cos(A)];
assert(at.every((v,i)=>Math.abs(v-ac.expectedTipMm[i])<1e-9),'AC示意旋转顺序失败');
return {rules:10,positive:10,negative:10,assets:17,sources:9,syntheticMath:2};}
if(import.meta.url===new URL('file://'+process.argv[1]).href){
const result=verify(load('research/traces/E3-04.json'),load('docs/work-packages/E3-04/fixtures.json'),load('research/sources/E3-04.json'),load('docs/work-packages/E3-04/asset-owner-consumer-matrix.json'),load('docs/work-packages/E3-04/machine-cases.json'));
if(process.argv.includes('--self-test')){const r=load('research/traces/E3-04.json').rules[0],g=Object.fromEntries(load('docs/work-packages/E3-04/fixtures.json').gateKeys.map(k=>[k,true]));assert(classify(r,{...g,[r.fixtureGate]:false}).status!=='CANDIDATE_FOR_D15_ONLY','故意错误被漏过');}
console.log(JSON.stringify({status:'PASS_PLANNING_ONLY',...result,product:'NOT_RUN'}));}

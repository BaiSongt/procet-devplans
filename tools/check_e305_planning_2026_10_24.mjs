#!/usr/bin/env node
// E3-05纯规划链条校验；不能替代实际NC/OCCT/机床或D16消费者。
import fs from 'node:fs';
import path from 'node:path';
const i=process.argv.indexOf('--root'),root=path.resolve(i>=0?process.argv[i+1]:'.');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const check=(b,m)=>{if(!b)throw Error(m)};
export function classify(rule, gates){
 const bad=Object.entries(gates).filter(([,v])=>v!==true).map(([k])=>k);
 return bad.length===0?{status:'PLANNING_GATE_CANDIDATE_NOT_ENGINEERING_PASS',code:'D15_PLANNING_READY_ONLY'}:
 bad.length===1&&bad[0]===rule.fixtureGate?{status:'PLANNING_BLOCKED_OR_UNKNOWN',code:rule.failureCode}:{status:'PLANNING_BLOCKED_OR_UNKNOWN',code:'MULTIPLE_GATE_FAILURES'};
}
export function validate(tr,fi,src,owners){
 check(tr.workPackageId==='E3-05'&&fi.workPackageId==='E3-05','包编号');
 check(tr.rules.length===10&&fi.cases.length===20,'规则/正反数量');
 check(src.sources.length===9&&src.registeredRecords===9,'来源数量');
 check(new Set(src.sources.map(x=>x.id)).size===9,'重复sourceId');
 check(owners.assets.length===17&&new Set(owners.assets.map(x=>x.id)).size===17,'17 Owner候选');
 const sids=new Set(src.sources.map(x=>x.id)),ids=new Set(),cids=new Set();
 for(const r of tr.rules){check(!ids.has(r.id),'重复规则ID');ids.add(r.id);check(r.fields.length&&r.assets.length&&r.sourceIds.length,'来源字段资产缺失');
 for(const s of r.sourceIds)check(sids.has(s),'不存在来源 '+s);
 for(const a of r.assets)check(owners.assets.some(x=>x.id===a),'不存在资产 '+a);
 for(const [pol,t] of [['positive',r.positiveTestId],['negative',r.negativeTestId]]){
 const f=fi.cases.find(x=>x.id===t);check(f&&f.ruleId===r.id&&f.polarity===pol,'验收映射失配 '+t);
 check(!cids.has(t),'重复case');cids.add(t);
 check(Object.keys(f.gates).length===10&&fi.gateKeys.every(k=>k in f.gates),'门禁字段缺失');
 const k=Object.entries(f.gates).filter(([,v])=>v!==true).map(([k])=>k);
 check(pol==='positive'?k.length===0:k.length===1&&k[0]===r.fixtureGate,'正反样本不精确');
 const got=classify(r,f.gates);check(got.status===f.expectedStatus&&got.code===f.expectedCode,'判定不符 '+t);
 check(f.requiredIndependentConsumer==='D16_NOT_RUN','独立消费者不可冒充PASS');
 }}
 check(cids.size===20,'验收有重复');
 return {rules:10,positive:10,negative:10,sources:9,ownerCandidates:17};
}
if(import.meta.url==='file://'+process.argv[1]){
 const tr=read('research/traces/E3-05.json'),fi=read('docs/work-packages/E3-05/fixtures.json'),src=read('research/sources/E3-05.json'),o=read('docs/work-packages/E3-05/asset-owner-consumer-matrix.json');
 const report=validate(tr,fi,src,o);
 if(process.argv.includes('--self-test')){for(const r of tr.rules){const yes=fi.cases.find(f=>f.id===r.positiveTestId);const changed={...yes.gates,[r.fixtureGate]:false};check(classify(r,changed).code===r.failureCode,'变异未捕获 '+r.id)}report.mutations=10}
 console.log(JSON.stringify({...report,status:'PLANNING_DATA_PASS_ONLY',product:'NOT_RUN',independentConsumer:'NOT_RUN'}));
}
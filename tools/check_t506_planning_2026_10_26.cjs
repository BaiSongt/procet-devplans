#!/usr/bin/env node
'use strict';
// 中文：仅校验规划来源、规则、资产映射及合成例，禁止称产品通过。
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=load('research/traces/T5-06.json'),s=load('research/sources/T5-06.json'),f=load('docs/work-packages/T5-06/fixtures.json'),o=load('docs/work-packages/T5-06/asset-owner-candidates.json');
const at=(obj,p)=>p.split('.').reduce((v,k)=>v==null?undefined:v[k],obj);
const valid=(r,inp)=>r.criteria.every(c=>c.op==='same'?at(inp,c.path)===at(inp,c.otherPath):c.op==='eq'&&at(inp,c.path)===c.value);
const check=(x,m)=>{if(!x)throw Error(m)};
check(t.rules.length===10&&s.sources.length===9&&o.assets.length===17,'结构计数不符');
const sourceIds=new Set(s.sources.map(a=>a.id)),assetIds=new Set(o.assets.map(a=>a.id)),seen=new Set();
check(sourceIds.size===9&&assetIds.size===17,'来源或资产编号重复');
for(let i=1;i<=17;i++)check(assetIds.has('D'+String(i).padStart(2,'0')),'资产D编号缺失');
for(const r of t.rules){
 check(r.sourceIds.every(id=>sourceIds.has(id))&&r.assets.every(id=>assetIds.has(id)),'来源/Owner悬空:'+r.id);
 check(r.criteria.length>=2&&new Set(r.fields).size===r.fields.length,'规则字段缺失:'+r.id);
 const local=f.cases.filter(x=>x.ruleId===r.id);check(local.length===3,'三类场景缺失:'+r.id);
 for(const c of local){check(!seen.has(c.id),'验收ID重复');seen.add(c.id);check(c.synthetic===true,'不许伪装实测');check((valid(r,c.input)?'PASS':'REJECT')===c.expected,'正反变异不匹配:'+c.id)}
 const pos=local.find(c=>c.id===r.positiveTestId),neg=local.find(c=>c.id===r.negativeTestId),mut=local.find(c=>c.id===r.mutationTestId);
 check(pos?.scenario==='POSITIVE'&&neg?.scenario==='NEGATIVE'&&mut?.scenario==='INDEPENDENT_FIELD_MUTATION'&&neg.mutatedField!==mut.mutatedField,'三类反证及字段不独立:'+r.id);
}
check(seen.size===30,'不是30合成验收');
check(o.assets.every(a=>a.approval==='PENDING_HUMAN'&&a.independentConsumer==='NOT_RUN'),'假签署/假消费者');
console.log('规划V8等价：T5-06 30/30合成PASS；9来源17资产映射OK；产品/实机/NC/恢复/独立消费者NOT_RUN。');

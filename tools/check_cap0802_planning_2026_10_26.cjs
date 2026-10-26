#!/usr/bin/env node
'use strict';
// 中文：仅验规划约束和合成夹具，不触达控制器、产品或用户数据库。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=read('research/traces/CAP-08-02.json'),s=read('research/sources/CAP-08-02.json'),f=read('docs/capabilities/CAP-08-02/fixtures.json'),o=read('docs/capabilities/CAP-08-02/asset-owner-candidates.json');
const at=(x,p)=>p.split('.').reduce((v,k)=>v==null?undefined:v[k],x);
const yes=(r,i)=>r.criteria.every(c=>c.op==='same'?at(i,c.path)===at(i,c.otherPath):c.op==='eq'&&at(i,c.path)===c.value);
const must=(x,m)=>{if(!x)throw Error(m)};
must(s.sources.length===10&&t.rules.length===10&&o.assets.length===17&&f.cases.length===30,'计数不符');
const ss=new Set(s.sources.map(x=>x.id)),aa=new Set(o.assets.map(x=>x.id));must(ss.size===10&&aa.size===17,'来源/资产重复');
for(let i=1;i<=17;i++)must(aa.has('D'+String(i).padStart(2,'0')),'缺资产D'+i);
let seen=new Set(),pass=0;
for(const r of t.rules){
 must(r.sourceIds.length>0&&r.sourceIds.every(id=>ss.has(id)),'来源悬空'+r.id);
 must(r.assets.length>0&&r.assets.every(id=>aa.has(id)),'资产悬空'+r.id);
 must(r.workPackages.join(',')==='E3-02,E3-03,U4-04','原工作包不符'+r.id);
 must(r.criteria.length>=3&&r.fields.length>=3,'字段与准则不足'+r.id);
 let cs=f.cases.filter(c=>c.ruleId===r.id);
 must(cs.length===3,'测试组不齐'+r.id);
 let p=cs.find(c=>c.id===r.positiveTestId),n=cs.find(c=>c.id===r.negativeTestId),m=cs.find(c=>c.id===r.mutationTestId);
 must(p?.scenario==='POSITIVE'&&n?.scenario==='NEGATIVE'&&m?.scenario==='INDEPENDENT_FIELD_MUTATION','三类场景错'+r.id);
 must(n.mutatedField!==m.mutatedField,'负例与变异同字段'+r.id);
 for(const c of cs){must(!seen.has(c.id),'用例重复'+c.id);seen.add(c.id);must(c.synthetic===true,'伪称实测');must((yes(r,c.input)?'PASS':'REJECT')===c.expected,'规则不符'+c.id);pass++}
}
must(o.assets.every(a=>a.approval==='PENDING_HUMAN'&&a.independentConsumer==='NOT_RUN'),'伪会签');
console.log('CAP-08-02 规划合成 '+pass+'/30 PASS；10来源17候选Owner；真实NC/控制器/消费者NOT_RUN，规划PASS≠产品PASS。');

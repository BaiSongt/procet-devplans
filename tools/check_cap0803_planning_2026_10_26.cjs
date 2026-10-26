#!/usr/bin/env node
'use strict';
// 中文：只验证规划合成数据，不触达产品仓、数据库或控制器。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=read('research/traces/CAP-08-03.json'),s=read('research/sources/CAP-08-03.json'),f=read('docs/capabilities/CAP-08-03/fixtures.json'),o=read('docs/capabilities/CAP-08-03/asset-owner-candidates.json');
const at=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x),must=(v,m)=>{if(!v)throw Error(m)};
must(s.sources.length===7&&t.rules.length===10&&f.cases.length===30&&o.assets.length===17,'数量不符');
let ss=new Set(s.sources.map(x=>x.id)),aa=new Set(o.assets.map(x=>x.id));must(ss.size===7&&aa.size===17,'ID重复');
for(let i=1;i<=17;i++)must(aa.has('D'+String(i).padStart(2,'0')),'Owner缺失');
let n=0;for(const r of t.rules){must(r.sourceIds.every(x=>ss.has(x))&&r.assets.every(x=>aa.has(x)),'来源/资产悬空');must(r.workPackages.join(',')==='E3-02,E3-03,U4-04','原包变更');let cs=f.cases.filter(c=>c.ruleId===r.id);must(cs.length===3,'测试不足');let p=cs.find(c=>c.id===r.positiveTestId),b=cs.find(c=>c.id===r.negativeTestId),m=cs.find(c=>c.id===r.mutationTestId);must(p?.scenario==='POSITIVE'&&b?.scenario==='NEGATIVE'&&m?.scenario==='INDEPENDENT_FIELD_MUTATION'&&b.mutatedField!==m.mutatedField,'独立变异不成立');for(const c of cs){let pass=r.criteria.every(x=>x.op==='eq'&&at(c.input,x.path)===x.value);must((pass?'PASS':'REJECT')===c.expected&&c.synthetic===true,'夹具失败'+c.id);n++}}
must(o.assets.every(x=>x.approval==='PENDING_HUMAN'&&x.independentConsumer==='NOT_RUN'),'伪会签');
console.log('CAP-08-03规划合成 '+n+'/30 PASS，产品/独立消费者NOT_RUN');

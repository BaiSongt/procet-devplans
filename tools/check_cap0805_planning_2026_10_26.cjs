#!/usr/bin/env node
'use strict';
// 中文：只校验规划夹具，绝不调用控制器、机床或客户数据库。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=read('research/sources/CAP-08-05.json'),t=read('research/traces/CAP-08-05.json'),f=read('docs/capabilities/CAP-08-05/fixtures.json'),o=read('docs/capabilities/CAP-08-05/asset-owner-candidates.json');
const check=(v,m)=>{if(!v)throw Error(m)},at=(v,p)=>p.split('.').reduce((a,k)=>a?.[k],v);
check(s.sources.length===8&&t.rules.length===10&&f.cases.length===30&&f.semanticCases.length===8&&o.assets.length===17,'规格数量不完整');
const si=new Set(s.sources.map(x=>x.id)),ai=new Set(o.assets.map(x=>x.id));check(si.size===8&&ai.size===17,'ID重复');
for(let i=1;i<=17;i++)check(ai.has('D'+String(i).padStart(2,'0')),'缺17资产编号');
let pass=0;
for(const r of t.rules){
 check(r.sourceIds.length&&r.sourceIds.every(x=>si.has(x))&&r.assets.every(x=>ai.has(x)),'缺来源资产');
 check(r.workPackages.join(',')==='E3-02,E3-03,U4-04','原工作包编号变更');
 const x=f.cases.filter(c=>c.ruleId===r.id);check(x.length===3,'缺正反变异');
 const p=x.find(c=>c.id===r.positiveTestId),n=x.find(c=>c.id===r.negativeTestId),m=x.find(c=>c.id===r.mutationTestId);
 check(p?.scenario==='POSITIVE'&&n?.scenario==='NEGATIVE'&&m?.scenario==='INDEPENDENT_FIELD_MUTATION'&&n.mutatedField!==m.mutatedField,'变异不独立');
 for(const c of x){const valid=r.criteria.every(k=>k.op==='eq'&&at(c.input,k.path)===k.value);check((valid?'PASS':'REJECT')===c.expected&&c.synthetic===true,'合成验证错误 '+c.id);pass++}
}
const evalSem=x=>x.callDepth>10||x.loopCount>10000?'UNKNOWN':x.script.includes('G83_Q_ZERO')||x.script.includes('M98_MISSING')?'REJECT':x.script.some(z=>['VENDOR_MACRO','MAIN_M99'].includes(z))?'UNKNOWN':x.profile!=='linuxcnc29'?'UNKNOWN':x.script.includes('G80')&&x.script.some(z=>['G81','G83_Q_POS'].includes(z))?'PASS':'UNKNOWN';
for(const x of f.semanticCases)check(evalSem(x)===x.expected,'语义合成失败 '+x.id);
check(o.assets.every(x=>x.approval==='PENDING_HUMAN'&&x.independentConsumer==='NOT_RUN'),'不能伪造签署');
console.log('CAP-08-05 合成规划 30/30 正反变异 + 8/8 语义 PASS；真实产品/消费者/机床 NOT_RUN');

// U4-06中文规划检查：来源→规则→字段→正反及差异变异。仅synthetic规划测试。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=load('research/traces/U4-06.json'),s=load('research/sources/U4-06.json'),f=load('docs/work-packages/U4-06/fixtures.json');
const at=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);const check=(r,v)=>r.criteria.every(c=>c.op==='eq'&&at(v,c.path)===c.value);
const ok=(x,m)=>{if(!x)throw Error(m)};
ok(t.rules.length===10&&s.sources.length===11&&f.cases.length===20&&f.mutations.length===10,'规则/来源/案例数不符');
const srcs=new Set(s.sources.map(x=>x.id));ok(srcs.size===11,'来源ID重复');let count=0;
for(const r of t.rules){ok(r.sourceIds.length>0&&r.sourceIds.every(x=>srcs.has(x))&&r.fields.every(x=>r.criteria.some(c=>c.path===x)),'追踪不全'+r.id);
const a=f.cases.find(x=>x.id===r.positiveTestId),b=f.cases.find(x=>x.id===r.negativeTestId),m=f.mutations.find(x=>x.ruleId===r.id);
ok(a&&b&&m&&a.ruleId===r.id&&b.ruleId===r.id,'缺配对'+r.id);
ok(a.expected==='PASS'&&check(r,a.input),'正例失败'+r.id);count++;
ok(b.expected==='REJECT'&&!check(r,b.input),'反例未拒绝'+r.id);count++;
ok(m.expected==='REJECT'&&!check(r,m.input)&&m.differentFieldFromPairedNegative&&m.mutatedField!==m.pairedNegativeField,'变异未拒绝/与反例重复'+r.id);count++;}
ok(count===30,'数量异常');console.log(JSON.stringify({item:'U4-06',syntheticPlanning:'PASS',cases:count,product:'NOT_RUN',independentNode:'NOT_RUN',realTauri:'NOT_RUN',realOwner:'NOT_RUN'}));

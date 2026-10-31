// 中文注释：只测试T5-03规划规则与合成数据，不构成任何产品/签名/NC通过。
const fs=require('node:fs'),path=require('node:path');
const load=x=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',x),'utf8'));
const r=load('research/traces/T5-03.json'),f=load('docs/work-packages/T5-03/fixtures.json'),s=load('research/sources/T5-03.json'),a=load('docs/architecture/v0.8/business-assets.json'),lock=load('docs/work-packages/T5-03/contract.example.json');
const ensure=(b,m)=>{if(!b)throw Error(m)};
const read=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
ensure(r.rules.length===10&&f.cases.length===20&&f.mutations.length===10&&s.sources.length===10,'数量不符');
ensure(lock.onlySynthetic===true&&lock.releaseGate.allowRelease===false&&lock.releaseGate.productTests==='NOT_RUN','模板冒充产品');
const src=new Set(s.sources.map(x=>x.id)),ass=new Set(a.assets.map(x=>x.id));let n=0;
for(const t of r.rules){
 ensure(t.sourceIds.every(x=>src.has(x))&&t.assets.every(x=>ass.has(x)),t.id+'来源/资产断链');
 const rows=[...f.cases,...f.mutations].filter(x=>x.ruleId===t.id);
 ensure(rows.length===3&&rows.filter(x=>x.expected==='REJECT').length===2,t.id+'三场景缺失');
 const neg=rows.filter(x=>x.expected==='REJECT');
 ensure(neg[0].mutatedField!==neg[1].mutatedField,t.id+'变异字段未独立');
 for(const e of rows){const outcome=t.criteria.every(c=>c.op==='eq'&&read(e.input,c.path)===c.value)?'PASS':'REJECT';ensure(outcome===e.expected,e.id+'判定错误');n++}
}
ensure(n===30,'未执行30场景');
console.log('T5-03 规划合成30/30 PASS；真实产品、Windows、签名与独立消费者 NOT_RUN');
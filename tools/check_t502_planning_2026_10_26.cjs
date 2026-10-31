// 中文注释：T5-02仅校验来源/字段及合成正反例，不代表产品验收
const fs=require('node:fs'),path=require('node:path');
const load=x=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',x),'utf8'));
const t=load('research/traces/T5-02.json'),f=load('docs/work-packages/T5-02/fixtures.json'),s=load('research/sources/T5-02.json'),a=load('docs/architecture/v0.8/business-assets.json');
const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
const ensure=(b,m)=>{if(!b)throw Error(m)};
ensure(t.rules.length===10&&f.cases.length===20&&f.mutations.length===10&&s.sources.length===11,'数量错误');
const sources=new Set(s.sources.map(x=>x.id)),assets=new Set(a.assets.map(x=>x.id));
let n=0;
for(const r of t.rules){
 ensure(r.sourceIds.every(x=>sources.has(x))&&r.assets.every(x=>assets.has(x)),r.id+'来源/资产缺失');
 const c=[...f.cases,...f.mutations].filter(x=>x.ruleId===r.id);
 ensure(c.length===3&&c.filter(x=>x.expected==='REJECT').map(x=>x.mutatedField)[0]!==c.filter(x=>x.expected==='REJECT').map(x=>x.mutatedField)[1],r.id+'变异字段不独立');
 for(const e of c){const actual=r.criteria.every(k=>k.op==='eq'&&get(e.input,k.path)===k.value)?'PASS':'REJECT';ensure(actual===e.expected,e.id+'状态错误');n++}
}
console.log('T5-02 SYNTHETIC '+n+'/30 PASS；产品/独立消费者 NOT_RUN');

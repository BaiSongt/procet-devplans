// 中文注释：T5-05规划合成字段验证，不能充当产品或真实消费者结果。
const fs=require('node:fs'),path=require('node:path');
const load=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const r=load('research/traces/T5-05.json'),f=load('docs/work-packages/T5-05/fixtures.json'),s=load('research/sources/T5-05.json'),a=load('docs/architecture/v0.8/business-assets.json'),c=load('docs/work-packages/T5-05/contract.example.json');
const ok=(x,m)=>{if(!x)throw Error(m)},at=(o,p)=>p.split('.').reduce((x,k)=>x?.[k],o);
ok(r.rules.length===10&&f.cases.length===20&&f.mutations.length===10&&s.sources.length===9,'数量异常');
ok(c.warning==='SYNTHETIC_EXAMPLE_NOT_PRODUCT'&&c.product==='NOT_RUN'&&a.assets.length===17,'状态假冒');
const src=new Set(s.sources.map(x=>x.id)),assets=new Set(a.assets.map(x=>x.id));ok(src.size===9,'来源重复');let count=0;
for(const rule of r.rules){ok(rule.sourceIds.every(x=>src.has(x))&&rule.assets.every(x=>assets.has(x))&&rule.fields.length===rule.criteria.length,'来源/字段/资产断链');const cs=[...f.cases,...f.mutations].filter(x=>x.ruleId===rule.id),neg=cs.filter(x=>x.expected==='REJECT');ok(cs.length===3&&neg.length===2&&neg[0].mutatedField!==neg[1].mutatedField,'独立变异缺失');for(const x of cs){ok(x.synthetic,'案例不是合成标记');const verdict=rule.criteria.every(z=>z.op==='same'?at(x.input,z.path)!==undefined&&at(x.input,z.path)===at(x.input,z.otherPath):z.op==='eq'&&at(x.input,z.path)===z.value)?'PASS':'REJECT';ok(verdict===x.expected,x.id+'校验失败');count++}}ok(count===30,'非30例');console.log('T5-05规划合成30/30 PASS，真实产品和独立Consumer NOT_RUN');

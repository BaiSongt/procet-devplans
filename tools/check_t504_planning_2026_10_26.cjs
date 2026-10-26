// 中文注释：只校验T5-04合成规划字段，不等于任何产品通过。
const fs=require('node:fs'),path=require('node:path');
const load=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const r=load('research/traces/T5-04.json'),f=load('docs/work-packages/T5-04/fixtures.json'),s=load('research/sources/T5-04.json'),a=load('docs/architecture/v0.8/business-assets.json'),l=load('docs/work-packages/T5-04/migration-ledger.example.json');
const ok=(x,m)=>{if(!x)throw new Error(m)};const val=(o,p)=>p.split('.').reduce((x,k)=>x?.[k],o);
ok(r.rules.length===10&&f.cases.length===20&&f.mutations.length===10&&s.sources.length===9,'数量不符');
ok(l.onlySynthetic&&l.product==='NOT_RUN'&&!l.cutoverAllowed,'模板冒充产品');
const src=new Set(s.sources.map(x=>x.id)),ass=new Set(a.assets.map(x=>x.id));ok(src.size===9,'来源ID重复');let count=0;
for(const rule of r.rules){ok(rule.sourceIds.every(x=>src.has(x))&&rule.assets.every(x=>ass.has(x)),'来源或Owner断链');ok(rule.criteria.length===rule.fields.length,'字段不匹配');const cases=[...f.cases,...f.mutations].filter(x=>x.ruleId===rule.id);ok(cases.length===3,'缺场景');const neg=cases.filter(x=>x.expected==='REJECT');ok(neg.length===2&&neg[0].mutatedField!==neg[1].mutatedField,'非独立变异');for(const c of cases){const v=rule.criteria.every(x=>x.op==='eq'&&val(c.input,x.path)===x.value)?'PASS':'REJECT';ok(v===c.expected,c.id+'失败');count++;}}
ok(count===30,'非30场景');console.log('T5-04 合成规划 30/30 PASS；产品及独立消费者 NOT_RUN');

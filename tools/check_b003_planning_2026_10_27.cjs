// B0-03原工作包研究追踪规划校验，不连接产品及用户数据
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=load('research/sources/B0-03.json'),t=load('research/traces/B0-03.json'),f=load('docs/work-packages/B0-03/fixtures.json'),g=load('docs/work-packages/B0-03/golden-cases.json');
const get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);
const assert=(x,m)=>{if(!x)throw Error(m)};
assert(s.registeredRecords===8&&s.sources.length===8,'SOURCES');
assert(t.rules.length===10&&f.cases.length===30,'RULES');
assert(g.casePairCount===12&&g.cases.length===12,'GOLDEN');
const sid=new Set(s.sources.map(x=>x.id));assert(sid.size===8,'UNIQUE_SOURCES');
let count=0;const rid=new Set(t.rules.map(x=>x.id));assert(rid.size===10,'UNIQUE_RULES');
for(const r of t.rules){
 assert(r.sourceIds.every(id=>sid.has(id))&&r.fields.length===4&&r.criteria.length===4,'TRACE '+r.id);
 assert(r.originalSubtaskId.match(/^B0-03-S0[1-8]$/)&&r.capabilities.length&&r.assets.length,'TARGET '+r.id);
 const cc=f.cases.filter(c=>c.ruleId===r.id);assert(cc.length===3&&new Set(cc.map(x=>x.scenario)).size===3,'PAIR '+r.id);
 for(const c of cc){const valid=r.criteria.every(x=>get(c.input,x.path)===x.value);
 const expected=valid?'PLANNING_PASS':'REJECT';
 assert(c.expected===expected,'RESULT '+c.id);
 if(c.scenario!=='POSITIVE'){assert(r.fields.includes(c.mutatedField)&&get(c.input,c.mutatedField)===false,'MUTATION '+c.id)}else assert(valid,'POSITIVE '+c.id);count++;
 }
}
for(let i=1;i<=12;i++){const id='GOLD-'+String(i).padStart(2,'0');const c=g.cases.find(x=>x.caseId===id);
assert(c&&rid.has(c.ruleId)&&c.capabilityId&&c.assets.length,'GOLD_TRACE '+id);
assert(c.positive.evidenceGate===true&&c.negative.evidenceGate===false,'GOLD_NEGATIVE '+id);
assert(c.positive.executionStatus==='NOT_RUN'&&c.negative.executionStatus==='NOT_RUN'&&c.productObservedResult===null,'REAL_TEST_FALSE_CLAIM '+id);
count+=2;
}
console.log(JSON.stringify({kind:'PLANNING_SYNTHETIC_ONLY',passed:count,ruleCases:30,goldenPairSpecifications:24,realOCCT:'NOT_RUN',realNC:'NOT_RUN',realB5:'NOT_RUN',independentConsumer:'NOT_RUN'}));

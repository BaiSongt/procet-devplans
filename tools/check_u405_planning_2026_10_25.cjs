// U4-05 规划追踪与正反/差异变异检查；不调用产品、不测GPU/WCAG符合性。
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const trace=load('research/traces/U4-05.json'),sources=load('research/sources/U4-05.json'),fixture=load('docs/work-packages/U4-05/fixtures.json');
const read=(o,p)=>p.split('.').reduce((x,k)=>x==null?undefined:x[k],o);
function match(rule,input){return rule.criteria.every(c=>{let v=read(input,c.path);switch(c.op){case 'eq':return v===c.value;case 'eqField':return v===read(input,c.other);case 'nonEmpty':return typeof v==='string'&&v.trim().length>0;case 'gte':return Number.isFinite(v)&&v>=c.value;case 'lte':return Number.isFinite(v)&&v<=c.value;default:throw new Error('unknown operator '+c.op)}})}
function assert(ok,msg){if(!ok)throw new Error(msg)}
const sourceIds=new Set(sources.sources.map(x=>x.id));assert(sourceIds.size===9,'来源ID重复');assert(trace.rules.length===10,'规则数不足');assert(fixture.cases.length===20&&fixture.mutations.length===10,'场景计数错误');
let passed=0,seen=new Set();
for(const rule of trace.rules){assert(!seen.has(rule.id),'规则ID重复');seen.add(rule.id);assert(rule.sourceIds.length>0&&rule.sourceIds.every(x=>sourceIds.has(x)),'来源缺失 '+rule.id);assert(rule.fields.length>0&&rule.criteria.length>0,'规则字段/表达式缺失');let pos=fixture.cases.find(x=>x.id===rule.positiveTestId),neg=fixture.cases.find(x=>x.id===rule.negativeTestId),mut=fixture.mutations.find(x=>x.ruleId===rule.id);assert(pos&&neg&&mut,'场景缺失 '+rule.id);assert(pos.ruleId===rule.id&&neg.ruleId===rule.id,'场景与规则不匹配');assert(pos.expected==='PASS'&&match(rule,pos.input),'正例失败 '+rule.id);passed++;assert(neg.expected==='REJECT'&&!match(rule,neg.input),'反例未拒绝 '+rule.id);passed++;assert(mut.expected==='REJECT'&&!match(rule,mut.input)&&mut.differentFieldFromPairedNegative&&mut.mutatedField!==mut.pairedNegativeField,'变异未拒绝/与反例重复 '+rule.id);passed++;}
assert(passed===30,'总验收数不足');console.log(JSON.stringify({item:'U4-05',syntheticPlanning:'PASS',passed,total:30,product:'NOT_RUN',realBabylon:'NOT_RUN',realOwner:'NOT_RUN',independentConsumer:'NOT_RUN'}));

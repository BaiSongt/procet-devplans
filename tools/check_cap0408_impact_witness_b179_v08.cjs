'use strict';
/* B179: 只读规划夹具变更阴性见证; 合成源不得冒充真实消费者通过 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const trace=read('research/traces/CAP-04-08-impact-witness-b179-v08.json'),src=read(trace.sourceRegistry),fixture=read(trace.fixtures);
const get=(x,p)=>p.split('.').reduce((o,k)=>o?.[k],x);
const put=(x,p,v)=>{const a=p.split('.');x[a[0]][a[1]]=v;};
const clone=x=>JSON.parse(JSON.stringify(x));
function valid(p,v,x){const spec=trace.fieldDefinitions[p];assert.ok(spec,'未知字段:'+p);if(spec.kind==='regex')return typeof v==='string'&&new RegExp(spec.pattern).test(v);if(spec.kind==='equalRef')return v===get(x,spec.ref);return Object.is(v,spec.value);}
const sorted=a=>[...a].sort();
function judge(x){
 if(!x.scopeValid)return {status:'UNKNOWN_SCOPE'};
 if(x.beforeEpoch!==x.afterEpoch)return {status:'RETRY_SNAPSHOT'};
 if(!x.closedWorld||!x.consumerAttested)return {status:'UNKNOWN_COMPLETENESS'};
 const nodes=new Set(x.nodes);
 if(nodes.size!==x.nodes.length||x.changed.some(n=>!nodes.has(n))||x.edges.some(e=>!Array.isArray(e)||e.length!==2||!nodes.has(e[0])||!nodes.has(e[1])))return {status:'UNKNOWN_DANGLING'};
 const adj=new Map(x.nodes.map(n=>[n,[]]));for(const [a,b]of x.edges)adj.get(a).push(b);
 const colors=new Map();function visit(n){const c=colors.get(n);if(c===1)return true;if(c===2)return false;colors.set(n,1);for(const v of adj.get(n))if(visit(v))return true;colors.set(n,2);return false;}
 for(const n of x.nodes)if(!colors.has(n)&&visit(n))return {status:'UNKNOWN_CYCLE'};
 if(x.changed.length===0)return {status:'NO_DOMAIN_CHANGE'};
 const seen=new Set(x.changed),queue=[...seen];let visited=0;
 while(queue.length){if(++visited>x.budget)return {status:'UNKNOWN_BUDGET'};const n=queue.shift();for(const v of adj.get(n))if(!seen.has(v)){seen.add(v);queue.push(v);}}
 return {status:'ELIGIBLE_FOR_OWNER_REVIEW_NOT_PRODUCT_PASS',affected:sorted([...seen].filter(n=>!x.changed.includes(n))),unaffected:sorted(x.nodes.filter(n=>!seen.has(n)))};
}
assert.equal(src.records.length,7);assert.equal(new Set(src.records.map(x=>x.id)).size,7);
assert.equal(trace.rules.length,8);assert.equal(Object.keys(trace.fieldDefinitions).length,32);
assert.equal(fixture.cases.length,40);assert.equal(fixture.goldens.length,8);
const sourceIds=new Set(src.records.map(s=>s.id));const allFields=trace.rules.flatMap(r=>r.fields);
assert.equal(new Set(allFields).size,32);const ids=new Set();let passed=0;
for(const r of trace.rules){assert.equal(r.fields.length,4);assert.equal(r.testIds.length,5);assert.deepEqual(r.originalWorkPackages,["F1-02","F1-04","W2-05","E3-04","U4-02"]);for(const s of r.sourceIds)assert.ok(sourceIds.has(s));}
for(const c of fixture.cases){
 assert.ok(!ids.has(c.id));ids.add(c.id);
 const r=trace.rules.find(z=>z.id===c.ruleId);assert.ok(r&&r.testIds.includes(c.id));
 const x=clone(fixture.baseline);
 if(c.changedField){assert.equal(c.kind,'single_field_negative');assert.ok(r.fields.includes(c.changedField));put(x,c.changedField,c.patchValue);
  const mutated=allFields.filter(p=>!Object.is(get(x,p),get(fixture.baseline,p)));
  assert.deepEqual(mutated,[c.changedField],c.id);
 }
 assert.equal(r.fields.every(p=>valid(p,get(x,p),x)),c.expected,c.id);passed++;
}
for(const g of fixture.goldens){assert.deepEqual(judge({...clone(fixture.graphBaseline),...g.patch}),g.expected,g.id);passed++;}
assert.equal(passed,48);
console.log('B179 48/48 SYNTHETIC_ONLY (8P/32N/8G); independent Owner/consumer, actual NC, machine NOT_RUN');

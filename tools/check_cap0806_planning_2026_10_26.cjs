#!/usr/bin/env node
// 中文注释：此程序只核对规划资料的机器可追踪性，不解释真实NC，不认证安全。
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const trace=read('research/traces/CAP-08-06.json'),src=read('research/sources/CAP-08-06.json'),fx=read('docs/capabilities/CAP-08-06/fixtures.json');
function at(obj,p){return p.split('.').reduce((v,k)=>v?.[k],obj);}
function evaluate(rule,input){return rule.criteria.every(c=>c.op==='eq'&&at(input,c.path)===c.value)?'PASS':'REJECT';}
function gate(v){if(!v.hashMatch||!v.aclValid||v.cancelled)return'REJECT';if(!v.encodingKnown||!v.dialectKnown)return'UNKNOWN';if(v.changed&&!v.d13Reparsed)return'STALE';if(!v.d15IndependentPass)return'BLOCKED';return'PLANNING_ELIGIBLE_ONLY';}
assert.equal(src.registeredRecords,src.sources.length);assert.equal(src.sources.length,8);assert.equal(trace.rules.length,10);assert.equal(fx.cases.length,30);assert.equal(fx.semanticCases.length,9);
const sourceIds=new Set(src.sources.map(s=>s.id));assert.equal(sourceIds.size,8);
const fixtureIds=new Set();let pass=0;
for(const rule of trace.rules){
 assert.equal(rule.fields.length,4);assert.equal(rule.criteria.length,4);
 for(const s of rule.sourceIds)assert(sourceIds.has(s),s);
 for(const a of rule.assets)assert(/^D(0[1-9]|1[0-7])$/.test(a),a);
 for(const id of [rule.positiveTestId,rule.negativeTestId,rule.mutationTestId]){
  const c=fx.cases.find(x=>x.id===id&&x.ruleId===rule.id);assert(c,id);assert(!fixtureIds.has(id));fixtureIds.add(id);
  assert.equal(evaluate(rule,c.input),c.expected,id);
  if(c.scenario!=='POSITIVE')assert(rule.fields.includes(c.mutatedField));
  pass++;
 }
 const neg=fx.cases.find(x=>x.id===rule.negativeTestId),mut=fx.cases.find(x=>x.id===rule.mutationTestId);
 assert.notEqual(neg.mutatedField,mut.mutatedField,'变异需测试独立字段');
}
for(const c of fx.semanticCases){assert.equal(gate(c.input),c.expected,c.id);pass++;}
console.log('CAP-08-06 planning synthetic:',pass+'/'+(fx.cases.length+fx.semanticCases.length),'PASS; 产品NOT_RUN');

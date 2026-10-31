#!/usr/bin/env node
// 中文注释：仅验证公开规划资料的链路与合成负例，不解释真实控制器NC。
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=read('research/sources/CAP-08-07.json'),tr=read('research/traces/CAP-08-07.json'),fx=read('docs/capabilities/CAP-08-07/fixtures.json');
const at=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
const evaluate=(rule,input)=>rule.criteria.every(c=>c.op==='eq'&&at(input,c.path)===c.value)?'PASS':'REJECT';
function gate(x){if(!x.hashMatch||!x.frameScopeExact||!x.aclValid||!x.casValid||!x.taskGenerationExact||x.cancelled)return'REJECT';
if(!x.manifestValid||!x.byteSpansValid||!x.manyToManyTyped)return'UNMAPPED';
if(x.sourceChanged||x.reposted||x.edited||x.profileChanged||x.setupChanged||x.bindingChanged)return'STALE';
if(!x.d13FinalNcRead||!x.controllerKnown||!x.controlFlowBounded)return'UNKNOWN';
if(!x.d14MotionEvidence||!x.d15IndependentPass)return'BLOCKED';return'TRACEABLE_ONLY_NOT_RELEASE';}
function mappingKind(x){if(x.ncHash!==x.expectedHash)return'STALE';if(!Array.isArray(x.sourceSpan)||x.sourceSpan.length!==2||x.sourceSpan[0]>=x.sourceSpan[1])return'UNMAPPED';
if(x.generatedReason)return'GENERATED_WITHOUT_CL';if(!x.links.length)return'UNMAPPED';return x.links.length>1?'MULTIPLE_CL_ORIGINS':'ONE_CL_ORIGIN';}
assert.equal(src.registeredRecords,8);assert.equal(src.sources.length,8);assert.equal(tr.rules.length,10);
assert.equal(fx.cases.length,30);assert.equal(fx.semanticCases.length,12);assert.equal(fx.mappingCases.length,5);
const ids=new Set(src.sources.map(s=>s.id));assert.equal(ids.size,8);let pass=0;const unique=new Set();
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.equal(r.criteria.length,4);
for(const s of r.sourceIds)assert(ids.has(s),'未知来源：'+s);
for(const a of r.assets)assert(/^D(0[1-9]|1[0-7])$/.test(a),'未知资产：'+a);
for(const t of [r.positiveTestId,r.negativeTestId,r.mutationTestId]){const x=fx.cases.find(c=>c.id===t&&c.ruleId===r.id);assert(x,t);assert(!unique.has(t));unique.add(t);
assert.equal(evaluate(r,x.input),x.expected,t);if(x.scenario!=='POSITIVE')assert(r.fields.includes(x.mutatedField));pass++;}
const n=fx.cases.find(c=>c.id===r.negativeTestId),m=fx.cases.find(c=>c.id===r.mutationTestId);
assert.notEqual(n.mutatedField,m.mutatedField,'独立字段变异未独立');}
for(const c of fx.semanticCases){assert.equal(gate(c.input),c.expected,c.id);pass++;}
for(const c of fx.mappingCases){assert.equal(mappingKind(c),c.expected,c.id);pass++;}
console.log('CAP-08-07 planning synthetic:',pass+'/'+(fx.cases.length+fx.semanticCases.length+fx.mappingCases.length),'PASS；产品与独立消费者NOT_RUN');

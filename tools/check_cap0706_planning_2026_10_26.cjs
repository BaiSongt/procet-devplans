#!/usr/bin/env node
// CAP-07-06 仅规划规则校验，非真实OCCT/NC/机床验收
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=read('research/sources/CAP-07-06.json'),t=read('research/traces/CAP-07-06.json'),f=read('docs/capabilities/CAP-07-06/fixtures.json');
const uniq=(xs,label)=>assert.equal(new Set(xs).size,xs.length,label+'重复');
function accepts(r,input){return r.criteria.every(c=>{const v=input[c.path];switch(c.op){case'eq':return v===c.value;case'gt':return typeof v==='number'&&Number.isFinite(v)&&v>c.value;case'sha256':return typeof v==='string'&&/^[a-f0-9]{64}$/i.test(v);case'sameField':return v===input[c.other];default:throw Error('未知操作符'+c.op)}})}
assert.equal(t.capabilityId,'CAP-07-06');assert.equal(f.capabilityId,'CAP-07-06');assert.equal(s.sources.length,9);assert.equal(s.registeredRecords,9);assert.equal(t.rules.length,10);assert.equal(f.cases.length,30);
uniq(s.sources.map(x=>x.id),'来源');uniq(t.rules.map(x=>x.id),'规则');uniq(f.cases.map(x=>x.id),'场景');
const srcIds=new Set(s.sources.map(x=>x.id));for(const r of t.rules){assert.ok(r.sourceIds.length&&r.sourceIds.every(x=>srcIds.has(x)));for(const k of ['positiveTestId','negativeTestId','mutationTestId']){const c=f.cases.find(x=>x.id===r[k]);assert.ok(c);assert.equal(c.ruleId,r.id);if(k!=='positiveTestId')assert.ok(r.fields.includes(c.mutatedField));}}
for(const c of f.cases){const r=t.rules.find(x=>x.id===c.ruleId);assert.ok(r);assert.equal(accepts(r,c.input)?'PASS':'REJECT',c.expected,c.id)}
console.log('CAP-07-06合成规划30/30 PASS；独立消费者/真实OCCT/NC/机床NOT_RUN，规划PASS≠产品PASS');
#!/usr/bin/env node
// CAP-07-05 规划合成规则检查；不运行真实OCCT/NC/控制器/机床。
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const trace=read('research/traces/CAP-07-05.json');
const source=read('research/sources/CAP-07-05.json');
const fixture=read('docs/capabilities/CAP-07-05/fixtures.json');
const requireUnique=(xs,label)=>assert.equal(new Set(xs).size,xs.length,label+'存在重复ID');
function accepts(rule,input){return rule.criteria.every(c=>{
 const v=input[c.path];
 switch(c.op){
 case 'eq':return v===c.value;
 case 'gt':return typeof v==='number'&&Number.isFinite(v)&&v>c.value;
 case 'gtField':return typeof v==='number'&&Number.isFinite(v)&&typeof input[c.other]==='number'&&v>input[c.other];
 case 'sameField':return v===input[c.other];
 case 'sha256':return typeof v==='string'&&/^[0-9a-f]{64}$/i.test(v);
 default:throw Error('未知规则算子：'+c.op);
 }
});}
assert.equal(trace.capabilityId,'CAP-07-05');assert.equal(fixture.capabilityId,'CAP-07-05');
assert.equal(trace.rules.length,10);assert.equal(fixture.cases.length,30);assert.equal(source.sources.length,9);
assert.equal(source.registeredRecords,source.sources.length);
requireUnique(source.sources.map(x=>x.id),'来源');requireUnique(trace.rules.map(x=>x.id),'规则');requireUnique(fixture.cases.map(x=>x.id),'场景');
const sources=new Set(source.sources.map(x=>x.id));
let checks=0;for(const r of trace.rules){
 assert.equal(r.sourceIds.length>0,true);assert.equal(r.fields.length>0,true);
 for(const src of r.sourceIds)assert.ok(sources.has(src),'缺少来源'+src);
 for(const key of ['positiveTestId','negativeTestId','mutationTestId']){
 const c=fixture.cases.find(x=>x.id===r[key]);
 assert.ok(c,'缺少'+key+':'+r.id);
 assert.equal(c.ruleId,r.id);assert.ok(r.fields.includes(c.mutatedField)||key==='positiveTestId');
 }
}
for(const c of fixture.cases){
 const rule=trace.rules.find(r=>r.id===c.ruleId);assert.ok(rule,'缺规则');
 const result=accepts(rule,c.input)?'PASS':'REJECT';
 assert.equal(result,c.expected,c.id+'预期不匹配');checks++;
}
console.log('CAP-07-05 规划合成 '+checks+'/30 PASS；OCCT/NC/实机/独立消费者 NOT_RUN；规划PASS≠产品PASS');

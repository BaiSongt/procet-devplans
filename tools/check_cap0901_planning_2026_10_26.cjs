#!/usr/bin/env node
"use strict";
// CAP-09-01 规划独立正反验收：只读取本仓规划JSON，不对产品或机床作认证
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const t=read("research/traces/CAP-09-01.json"),f=read("docs/capabilities/CAP-09-01/fixtures.json"),s=read("research/sources/CAP-09-01.json");
assert.equal(t.rules.length,10);assert.equal(f.cases.length,30);assert.equal(s.sources.length,10);
const ids=new Set(s.sources.map(x=>x.id));let n=0;
for(const rule of t.rules){
assert.equal(rule.fields.length,4);assert.ok(rule.sourceIds.every(id=>ids.has(id)));
for(const name of ["positiveTestId","negativeTestId","mutationTestId"]){
const x=f.cases.find(c=>c.id===rule[name]);assert.ok(x);
const pass=rule.criteria.every(c=>c.path.split(".").reduce((o,k)=>o?.[k],x.input)===c.value);
assert.equal(pass?"PASS":"REJECT",x.expected);if(x.mutatedField)assert.ok(rule.fields.includes(x.mutatedField));n++;
}
}
function calc(v){if(v.kind==="XYZ")return v.value;
if(v.kind==="ROT_X90_THEN_Z90"){const [x,y,z]=v.value;return [z,x,y]}
return null}
assert.deepEqual(calc({kind:"ROT_X90_THEN_Z90",value:[1,0,0]}),[0,1,0],"独立检查X正向旋转符号");
let k=0;for(const x of f.vectorOracleCases){const a=calc(x);
const actual=a===null?"UNKNOWN":a.every((v,i)=>Math.abs(v-x.expected[i])<1e-9)?"PASS":"REJECT";
assert.equal(actual,x.status,x.id);k++}
console.log("规划合成规则 "+n+"/30 与数学向量 "+k+"/5 PASS；真实产品/机床/独立消费者 NOT_RUN");

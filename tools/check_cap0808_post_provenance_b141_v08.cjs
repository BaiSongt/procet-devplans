#!/usr/bin/env node
// B141只读规划合成检查，不执行实际签名密码学或机床验证。
"use strict";
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=read("research/sources/CAP-08-08-post-provenance-b141.json"),t=read("research/traces/CAP-08-08-post-provenance-b141-v08.json"),f=read("docs/capabilities/CAP-08-08/post-provenance-b141-fixtures-v08.json");
const judge=(r,v)=>r.fields.every(x=>v[x]===true)?"PLANNING_CANDIDATE_ONLY":r.failureStatus;
const status=v=>!v.digest?"REJECT_ARTIFACT":!v.crypto?"UNKNOWN_SIGNATURE":!v.identity?"UNKNOWN_IDENTITY":!v.trustTime?"UNKNOWN_TIME":!v.builder?"UNKNOWN_BUILDER":!v.controller?"UNKNOWN_CONTROLLER":"PLANNING_CANDIDATE_ONLY";
let count=0;
function assert(v,msg){if(!v)throw Error(msg);++count}
assert(s.records.length===7&&new Set(s.records.map(x=>x.id)).size===7,"来源无效");
assert(t.rules.length===8&&f.groups.length===8,"规则无效");
for(const r of t.rules){
 const g=f.groups.find(x=>x.ruleId===r.id);
 assert(!!g&&r.sourceIds.every(x=>s.records.some(y=>y.id===x)),"孤立规则 "+r.id);
 assert(r.fields.length===4&&g.negative.length===4,"字段数 "+r.id);
 assert(r.tests.join("|")===[g.positive.id,...g.negative.map(x=>x.id)].join("|"),"验收ID "+r.id);
 assert(judge(r,g.positive.values)===g.positive.expected,"正例 "+r.id);
 for(const n of g.negative){
   assert(r.fields.filter(k=>n.values[k]!==g.positive.values[k]).length===1&&g.positive.values[n.mutatedField]!==n.values[n.mutatedField],"非独立变异 "+n.id);
   assert(judge(r,n.values)===n.expected,"负例 "+n.id);
 }
}
for(const x of f.goldens)assert(status(x.values)===x.expected,"Golden "+x.id);
console.log("B141规划校验："+count+"项断言PASS；8正32单字段反8状态Golden。真实签名/NC/机床 NOT_RUN。");

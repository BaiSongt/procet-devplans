#!/usr/bin/env node
// U4-04：仅读取规划仓合成fixtures；不加载产品、数据库或付费CI。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const tr=read("research/traces/U4-04.json"),fx=read("docs/work-packages/U4-04/fixtures.json"),src=read("research/sources/U4-04.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
function matches(r,x){return r.criteria.every(c=>{const v=get(x,c.path);if(c.op==="nonEmpty")return typeof v==="string"&&v.trim()!=="";if(c.op==="eqField")return v!==undefined&&v===get(x,c.other);if(c.op==="gt")return typeof v==="number"&&v>c.value;if(c.op==="eq")return v===c.value;throw Error("unknown op "+c.op)})}
if(tr.rules.length!==10||fx.cases.length!==20||fx.mutations.length!==10||src.sources.length!==9)throw Error("规则/场景/来源计数错误");
const sourceIDs=new Set(src.sources.map(x=>x.id));
if(sourceIDs.size!==9)throw Error("来源ID重复");
let count=0;
for(const r of tr.rules){
 if(r.workPackageId!=="U4-04"||!r.sourceIds.length||!r.sourceIds.every(x=>sourceIDs.has(x))||!r.criteria.length)throw Error("追踪不闭合 "+r.id);
 const paired=fx.cases.filter(x=>x.ruleId===r.id),mut=fx.mutations.filter(x=>x.ruleId===r.id);
 if(paired.length!==2||mut.length!==1||!paired.some(x=>x.expected==="PASS")||!paired.some(x=>x.expected==="REJECT"))throw Error("缺少独立正反 "+r.id);
 for(const x of [...paired,...mut]){
  const actual=matches(r,x.input)?"PASS":"REJECT";
  if(actual!==x.expected)throw Error(x.id+" 期望 "+x.expected+" 实际 "+actual);
  if(x.mutatedField&&(!x.differentFieldFromPairedNegative||x.mutatedField===x.pairedNegativeField))throw Error("错误变异字段重复 "+x.id);
  count++;
 }
}
if(count!==30)throw Error("验证数错误");
console.log("U4-04 规划合成 30/30 PASS；产品、Owner、机床独立消费者 NOT_RUN");

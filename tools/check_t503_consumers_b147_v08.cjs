#!/usr/bin/env node
// B147 只读规划门禁：不调用产品仓、不签名、不替代独立消费者。
// 运行：node tools/check_t503_consumers_b147_v08.cjs
"use strict";
const fs=require("node:fs");const path=require("node:path");
const root=path.resolve(__dirname,"..");
function load(p){return JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));}
function check(ok,msg){if(!ok)throw new Error(msg);}
const src=load("research/sources/T5-03-consumer-qualification-b147.json"),tr=load("research/traces/T5-03-consumer-qualification-b147-v08.json"),mx=load("docs/work-packages/T5-03/asset-consumer-matrix-b147-v08.json"),fx=load("docs/work-packages/T5-03/consumer-qualification-b147-fixtures-v08.json"),base=load("docs/architecture/v0.8/business-assets.json");
const sids=new Set(src.records.map(x=>x.id));
check(src.registeredRecords===5&&sids.size===5,"5 sources");
check(base.assets.length===17&&mx.entries.length===17,"17 assets");
check(new Set(mx.entries.map(e=>e.assetId)).size===17,"no duplicated assets");
const owner=new Map(base.assets.map(e=>[e.id,e]));
for(const e of mx.entries){
 const b=owner.get(e.assetId);check(b&&b.owner===e.ownerCandidate&&b.name===e.assetName,"asset owner mismatch "+e.assetId);
 check(owner.has(e.consumerAssetId)&&e.producerPort!==e.consumerPort,"consumer not distinct "+e.assetId);
 check(e.signoff==="PENDING_HUMAN"&&e.consumerTest==="NOT_RUN"&&e.consumerExecutable==="NOT_ASSIGNED","false product claim "+e.assetId);
 check(JSON.stringify(b.inputs)===JSON.stringify(e.upstreamAssetIds)&&JSON.stringify(b.outputs)===JSON.stringify(e.downstreamAssetIds),"asset edge mismatch "+e.assetId);
}
check(tr.rules.length===8&&fx.cases.length===40&&fx.assetChecks.length===17&&fx.goldens.length===8,"fixture cardinality");
for(const r of tr.rules){
 check(r.fields.length===4&&r.sourceIds.every(id=>sids.has(id)),"field/source mismatch "+r.id);
 const cases=fx.cases.filter(x=>x.ruleId===r.id);check(cases.length===5,"case count "+r.id);
 for(const c of cases){
  const bad=r.fields.filter(f=>c.values[f]!==true);
  const actual=bad.length?"FAIL":"PLANNING_CANDIDATE_ONLY";
  const expected=c.expected===r.failure?"FAIL":c.expected;
  check(actual===expected,"case verdict "+c.id);
  if(c.changedField)check(bad.length===1&&bad[0]===c.changedField,"not independent "+c.id);
 }
}
check(fx.assetChecks.every(x=>mx.entries.some(e=>e.assetId===x.assetId&&e.consumerAssetId===x.consumerAssetId)),"asset fixture mismatch");
check(mx.producerSignedCount===0&&mx.independentConsumerPassCount===0&&tr.planningPassNotProductPass===true,"false approval");
console.log("B147 规划结构PASS: 17资产/8规则/8正32反/17资产断言/8状态期望（未执行独立消费者与真实产品）");

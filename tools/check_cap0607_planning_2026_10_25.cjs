#!/usr/bin/env node
// 仅检验CAP-06-07规划合成数据，不运行OCCT、产品或独立消费者。
"use strict";
const fs=require("fs"),path=require("path"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const data=read("docs/capabilities/CAP-06-07/fixtures.json"),trace=read("research/traces/CAP-06-07.json"),sources=read("research/sources/CAP-06-07.json");
const reasons=["REJECT_EXACT","REJECT_NOT_INDEPENDENT","REJECT_TOPOLOGY","REJECT_VOLUME","REJECT_PROTECT","REJECT_TOLERANCE","REJECT_UNCALIBRATED","REJECT_FALSE_CONVERGENCE","REJECT_UNKNOWN_AS_PASS","REJECT_STALE_COMMIT"];
const validate=function validate(n,x){
const hash=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v),num=v=>typeof v==="number"&&Number.isFinite(v);
let ok=false;
switch(n){
case 1:ok=Number.isInteger(x.revision)&&x.revision>0&&hash(x.contentHash)&&hash(x.frameHash)&&hash(x.headHash)&&x.headHash===x.observedHead;break;
case 2:ok=x.processId!==x.generatorProcessId&&x.processId&&x.generatorProcessId&&hash(x.binaryHash)&&hash(x.generatorBinaryHash)&&x.binaryHash!==x.generatorBinaryHash&&x.recomputed===true;break;
case 3:ok=x.valid===true&&x.closed===true&&Number.isInteger(x.solidCount)&&x.solidCount>0&&x.checkedCount===x.solidCount;break;
case 4:ok=["before","removed","after","absTol","relTol"].every(k=>num(x[k]))&&x.absTol>0&&x.relTol>0&&x.before>0&&x.removed>=0&&x.after>=0&&Math.abs(x.before-x.removed-x.after)<=x.absTol+x.relTol*x.before;break;
case 5:ok=["intersection","maxIntersection"].every(k=>num(x[k]))&&x.maxIntersection>=0&&x.intersection>=0&&x.intersection<=x.maxIntersection&&x.islandsBefore===x.islandsAfter;break;
case 6:ok=x.unit==="mm"&&x.sourceUnit===x.unit&&x.policyVersion==="candidate-v1"&&["epsilon","minEpsilon","maxEpsilon"].every(k=>num(x[k]))&&x.minEpsilon>0&&x.epsilon>=x.minEpsilon&&x.epsilon<=x.maxEpsilon;break;
case 7:ok=x.holdoutDisjoint===true&&hash(x.trainHash)&&hash(x.holdoutHash)&&x.trainHash!==x.holdoutHash&&Number.isInteger(x.n)&&x.n>=x.minN&&x.minN>0&&num(x.ece)&&num(x.maxEce)&&x.ece>=0&&x.ece<=x.maxEce;break;
case 8:ok=Array.isArray(x.raw)&&x.raw.length===x.iterations&&x.raw.length>=3&&x.raw.every(num)&&x.stableSteps>=3&&x.oraclePass===true;break;
case 9:ok=x.budgetExhausted===true&&x.status==="UNKNOWN"&&x.publishAllowed===false;break;
case 10:ok=x.stageSealed===true&&hash(x.expectedHead)&&x.expectedHead===x.observedHead&&x.acl===true&&x.generation===x.receiptGeneration&&x.cancelGeneration<x.generation&&x.d08Preserved===true;break;
}
return ok?"PASS":reasons[n-1];
};
const tests=[...data.cases,...data.mutationCases],src=new Set(sources.sources.map(x=>x.id)),seen=new Set();
if(tests.length!==30||trace.rules.length!==10||data.cases.length!==20||data.mutationCases.length!==10||!data.syntheticOnly||!data.notOcctExecution)throw Error("测试数量或合成标记错误");
for(const r of trace.rules)if(!r.fields.length||!r.sourceIds.length||r.sourceIds.some(x=>!src.has(x)))throw Error("追踪不完整 "+r.id);
for(const t of tests){if(seen.has(t.id))throw Error("重复ID "+t.id);seen.add(t.id);if(validate(Number(t.ruleId.slice(-2)),t.input)!==t.expected)throw Error("合成规则失败 "+t.id)}
console.log("30/30 规划合成PASS；OCCT/消费者/产品 NOT_RUN");

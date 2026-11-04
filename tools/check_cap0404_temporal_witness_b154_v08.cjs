#!/usr/bin/env node
"use strict";
// 只读规划合成校验：不调用产品、联网、数据库或付费CI。所有注释为中文。
const fs=require("node:fs");
const path=require("node:path");
const judge=function judge(rule,d){
switch(rule){
case "B154-R01":return d.sourceRevision==="rev-D04-7"&&d.currentRevision===d.sourceRevision&&/^sha256:[0-9a-f]{16,}$/.test(d.sourceHash)&&d.frameId==="SETUP_A";
case "B154-R02":return Number.isFinite(d.queryTimeMs)&&Number.isFinite(d.validFromMs)&&Number.isFinite(d.validUntilMs)&&d.validFromMs<=d.queryTimeMs&&d.queryTimeMs<=d.validUntilMs&&d.clockDomain==="UTC";
case "B154-R03":return Number.isFinite(d.measurementTimeMs)&&Number.isFinite(d.queryTimeMs)&&Number.isFinite(d.maxAgeMs)&&d.measurementTimeMs<=d.queryTimeMs&&d.queryTimeMs-d.measurementTimeMs<=d.maxAgeMs&&d.maxAgeMs>0&&/^sha256:[0-9a-f]{16,}$/.test(d.measurementHash);
case "B154-R04":return [d.edge1FromMs,d.edge1UntilMs,d.edge2FromMs,d.edge2UntilMs].every(Number.isFinite)&&d.edge1FromMs<=d.edge1UntilMs&&d.edge2FromMs<=d.edge2UntilMs&&Math.max(d.edge1FromMs,d.edge2FromMs)<=Math.min(d.edge1UntilMs,d.edge2UntilMs);
case "B154-R05":return d.domainsSame===true&&d.clockSync==="VERIFIED"&&Number.isFinite(d.observedSkewMs)&&Number.isFinite(d.allowedSkewMs)&&d.allowedSkewMs>=0&&Math.abs(d.observedSkewMs)<=d.allowedSkewMs;
case "B154-R06":return d.edgeMode==="MEASURED_DYNAMIC"&&d.requestedSampleMode==="EXACT_ONLY"&&d.extrapolationAllowed===false&&d.selectionPolicy==="NO_LATEST_FALLBACK";
case "B154-R07":return d.expectedRevision===17&&d.actualRevision===d.expectedRevision&&d.aclAllowed===true&&d.cancelFence===false;
case "B154-R08":return d.d04Kind==="NOMINAL_FRAME"&&d.d10BindingSeparate===true&&d.d15Status==="NOT_RUN"&&d.consumerMode==="INDEPENDENT_ORACLE_REQUIRED";
default:return false
}};
const goldenJudge=function goldenJudge(g){
const x=g.values;
switch(g.kind){
case "TIME_IN_WINDOW":return x.from<=x.time&&x.time<=x.to;
case "INTERVAL_INTERSECT":return Math.max(x.af,x.bf)<=Math.min(x.at,x.bt);
case "AGE_IN_RANGE":return x.sample<=x.query&&x.query-x.sample<=x.maxAge;
case "SKEW_IN_RANGE":return Math.abs(x.skew)<=x.bound;
case "CACHE_EPOCH":return x.sourceEpoch===x.cacheEpoch;
case "CANCEL_REJECT":return x.cancelled===false&&x.ackGeneration===x.currentGeneration;
default:throw Error("unknown golden kind: "+g.kind)
}};
function main(){
 const root=path.resolve(__dirname,"..");
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
 const trace=read("research/traces/CAP-04-04-temporal-witness-b154-v08.json"),fixtures=read("docs/capabilities/CAP-04-04/temporal-witness-b154-fixtures-v08.json"),sources=read("research/sources/CAP-04-04-temporal-witness-b154.json");
 if(sources.records.length!==6||trace.rules.length!==8||fixtures.cases.length!==40||fixtures.goldens.length!==8)throw Error("计数/结构异常");
 const sourceIds=new Set(sources.records.map(s=>s.id));const seen=new Set();let positives=0,negatives=0;
 for(const rule of trace.rules){
  if(rule.fields.length!==4||rule.testIds.length!==5||rule.sourceIds.some(x=>!sourceIds.has(x)))throw Error("规则/来源缺失 "+rule.id);
  const pos=fixtures.cases.find(c=>c.id===rule.id+"-P");if(!pos||pos.expect!=="PASS"||!judge(rule.id,pos.record))throw Error("正例失败 "+rule.id);positives++;
  for(let j=0;j<4;j++){const id=rule.id+"-N"+(j+1),neg=fixtures.cases.find(c=>c.id===id);if(!neg||neg.expect!=="FAIL"||judge(rule.id,neg.record))throw Error("反例未拒绝 "+id);
   const differences=Object.keys(pos.record).filter(k=>JSON.stringify(pos.record[k])!==JSON.stringify(neg.record[k]));
   if(differences.length!==1||differences[0]!==rule.fields[j]||neg.mutatedField!==rule.fields[j])throw Error("非独立单字段反例 "+id);
   negatives++;
  }
  for(const id of rule.testIds){if(seen.has(id)||!fixtures.cases.some(c=>c.id===id))throw Error("验收引用重复/缺失 "+id);seen.add(id);}
 }
 for(const g of fixtures.goldens){if(goldenJudge(g)!==g.expected)throw Error("Golden不符合预期 "+g.id)}
 if(positives!==8||negatives!==32||seen.size!==40)throw Error("覆盖计数错误");
 console.log(JSON.stringify({status:"PASS_PLANNING_SYNTHETIC_ONLY",positives,negatives,goldens:8,total:48,product:"NOT_RUN"}));
}
if(require.main===module)main();

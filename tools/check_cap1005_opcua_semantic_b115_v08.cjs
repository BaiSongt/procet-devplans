"use strict";
// 中文注释：仅规划合成只读校验；真实OPC UA/NC/Owner消费者及L3不在本工具验证范围。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const s=read("research/sources/CAP-10-05-opcua-semantic-b115.json"),t=read("research/traces/CAP-10-05-opcua-semantic-b115-v08.json"),f=read("docs/capabilities/CAP-10-05/opcua-semantic-b115-fixtures-v08.json");
const judge=function judge(id,x){
  switch(id){
    case "B115-R01":return x.claimValid&&x.severity!=="Good"?"REJECT":x.severity!=="Good"||!x.valuePresent?"UNKNOWN":"CANDIDATE";
    case "B115-R02":return x.conflatesClock?"REJECT":!x.sourceTime||!x.serverTime||!x.ingestTime||!x.sourceClockTrusted?"UNKNOWN":"CANDIDATE";
    case "B115-R03":return !x.namespaceExact||!x.mappingRevisionPinned?"STALE":x.semanticsChanged&&!x.metadataFresh?"STALE":"CANDIDATE";
    case "B115-R04":return !x.rawPreserved?"REJECT":!x.parserRevisionPinned?"STALE":x.structureChanged&&!x.typeMetadataFresh?"UNKNOWN":"CANDIDATE";
    case "B115-R05":return x.continuousClaim?"REJECT":!Number.isInteger(x.queueSize)||x.queueSize<1?"UNKNOWN":x.overflow&&!x.gapLedgerWritten?"REJECT":x.overflow?"GAP":!x.gapLedgerWritten?"UNKNOWN":"CANDIDATE";
    case "B115-R06":return x.claimsRequestedRate?"REJECT":x.revisedSamplingMs<x.requestedSamplingMs?"UNKNOWN":!x.effectiveIntervalRecorded||!x.actualQueueRecorded?"UNKNOWN":"CANDIDATE";
    case "B115-R07":return x.claimsNcCompleted?"REJECT":x.machineToolVersion!=="1.02.0"||x.deprecatedProductionUsed||!x.jobModelMapped?"UNKNOWN":"CANDIDATE";
    case "B115-R08":return !x.aclCurrent?"REJECT":!x.d17Cas||x.cancelled||!x.d03Exact?"STALE":!x.samePort||!x.singleWorld||!x.leftPanel||x.claimsD15?"REJECT":"CANDIDATE";
    default:throw Error("未知规则 "+id);
  }
};
assert.equal(s.registeredRecords,s.sources.length);
assert.equal(new Set(s.sources.map(x=>x.id)).size,s.sources.length);
assert.equal(t.rules.length,8);assert.equal(new Set(f.cases.map(x=>x.id)).size,f.cases.length);
const si=new Set(s.sources.map(x=>x.id)),by=new Map(f.cases.map(x=>[x.id,x]));
for(const r of t.rules){
 assert.ok(r.fields.length>0&&r.originalWorkPackages.length>0&&r.caps.length>0&&r.assets.length>0);
 assert.ok(r.sourceIds.length>0&&r.sourceIds.every(id=>si.has(id)));
 assert.ok(r.positive.length>0&&r.negative.length>=3);
 for(const id of [...r.positive,...r.negative]){
  assert.ok(by.has(id),"丢失案例"+id);const c=by.get(id);
  assert.equal(c.rule,r.id);assert.ok(r.fields.every(k=>Object.hasOwn(c.input,k)),id);
  assert.equal(judge(c.rule,c.input),c.expect,id);
 }
}
for(const c of f.cases){assert.equal(judge(c.rule,c.input),c.expect,c.id);assert.notEqual(c.expect,"D15_PASS");}
console.log("B115规划合成："+f.cases.length+"/"+f.cases.length+"；同judge不等于独立Node之外的业务验收。");

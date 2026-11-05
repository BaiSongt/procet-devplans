#!/usr/bin/env node
// B80 规划合成检查器，不能替代真实UAX29/Owner/机床验收。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function judge(v) {
  if(!v||!v.source||!v.selector||!v.auth||!v.delivery)return"UNKNOWN";
  const s=v.source,q=v.selector,a=v.auth,d=v.delivery;
  if(a.cancelled===true)return"CANCELLED";
  if(a.postAcl!==true||a.tenantMatch!==true||a.permissionEpochCurrent!==true||s.revoked===true)return"REJECT";
  if(a.scopeEpochEqual!==true||a.casExpectedEqual!==true||s.ownerRevision!==s.currentRevision||s.rawHash!==s.currentRawHash||s.snapshotId!==s.currentSnapshotId)return"STALE";
  if(!s.ownerRevision||!s.rawHash||!s.frameOrNA||!s.unitOrNA||typeof s.normalizedText!=="string"||!s.normalizerId||!q.exact||!q.prefix||!q.suffix)return"UNKNOWN";
  if(s.normalizerId!=="PLAIN-LITERAL-V1"||q.normalizerId!==s.normalizerId)return"UNKNOWN";
  if(q.offsetUnit!=="UNICODE_CODE_POINT")return"REJECT";
  const cp=Array.from(s.normalizedText),lo=q.start,hi=q.end;
  if(!Number.isSafeInteger(lo)||!Number.isSafeInteger(hi)||lo<0||hi<=lo||hi>cp.length)return"REJECT";
  if(q.segmentationVersion!=="UAX29-49-UNICODE18"||q.boundaryEvidence!==true)return"UNKNOWN";
  // 本工具不实现完整UAX29；ZWJ、旗帜组合保守UNKNOWN，已知附加符截断REJECT。
  if(cp.some(c=>c==="\u200d"||/[\u{1F1E6}-\u{1F1FF}]/u.test(c)))return"UNKNOWN";
  if((lo>0&&lo<cp.length&&/\p{Mark}/u.test(cp[lo]))||(hi>0&&hi<cp.length&&/\p{Mark}/u.test(cp[hi])))return"REJECT";
  if(cp.slice(lo,hi).join("")!==q.exact)return"CONFLICT";
  const p=Array.from(q.prefix),t=Array.from(q.exact),u=Array.from(q.suffix);
  let matches=[];
  for(let i=0;i+t.length+i<=cp.length;i++){
    if(cp.slice(i,i+t.length).join("")!==q.exact)continue;
    if(cp.slice(0,i).slice(-p.length).join("")===q.prefix&&cp.slice(i+t.length,i+t.length+u.length).join("")===q.suffix)matches.push(i);
  }
  if(matches.length!==1||matches[0]!==lo)return"CONFLICT";
  if(d.sharedOwnerPort!==true||d.singleBabylon!==true||d.leftTaskPanel!==true||d.d04D10Separated!==true||d.frozenD08Preserved!==true||d.claimD15Pass===true||d.claimD16Released===true||d.agentOwnerWrite===true||d.clAnimationAsNcProof===true)return"REJECT";
  return"CANDIDATE_ONLY";
}
const p=path.resolve(__dirname,"../docs/capabilities/CAP-11-03/unicode-selector-b80-fixtures-v08.json");
const dataset=JSON.parse(fs.readFileSync(p,"utf8"));
assert.equal(dataset.syntheticOnly,true);assert.equal(dataset.cases.length,42);
const counts={};for(const c of dataset.cases){const got=judge(c.input);assert.equal(got,c.expected,c.id);counts[got]=(counts[got]||0)+1;}
console.log("B80_PLANNING_SYNTHETIC_PASS",dataset.cases.length,JSON.stringify(counts));
console.log("FULL_UAX29/ACTUAL_OWNER/INDEPENDENT_CONSUMERS/PRODUCT: NOT_RUN；规划PASS≠产品PASS");

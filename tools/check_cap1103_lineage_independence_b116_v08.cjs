"use strict";
// 中文注释：只读规划合成校验；不证明真实业务Owner/独立检索或NC工程安全。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const load=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,"..",p),"utf8"));
const s=load("research/sources/CAP-11-03-lineage-independence-b116.json"),t=load("research/traces/CAP-11-03-lineage-independence-b116-v08.json"),f=load("docs/capabilities/CAP-11-03/lineage-independence-b116-fixtures-v08.json");
const judge=function judge(id,x){switch(id){
case"B116-R01":return x.hasUnresolvedCycle?"REJECT":!x.rootDigestMatches?"STALE":!x.rootPinned||!x.graphAllEdgesResolved?"UNKNOWN":"CANDIDATE";
case"B116-R02":return !x.sameSourceNotDoubleCount?"REJECT":!x.lineageComplete||!x.aliasesResolved?"UNKNOWN":x.independentClaimCount>x.distinctPrimaryRoots?"REJECT":"CANDIDATE";
case"B116-R03":return !x.conflictDisclosed?"REJECT":!x.versionPinned?"STALE":!x.claimContextsComparable?"UNKNOWN":x.opposingEvidencePresent?"CONFLICT":"CANDIDATE";
case"B116-R04":return !x.accessLicenseValid?"REJECT":!x.exactSourceHash?"STALE":!x.normalizedSelectorMatch||!x.uniqueTarget?"UNKNOWN":"CANDIDATE";
case"B116-R05":return !x.claimWithinAccessDepth||!x.policySeparated||!x.noInventedNorms?"REJECT":!x.officialTextSectionRead?"UNKNOWN":"CANDIDATE";
case"B116-R06":return !x.independentRootsCounted||!x.notEquatingScoreToEvidence?"REJECT":!x.qualityMetricDefined||!x.denominatorPinned?"UNKNOWN":"CANDIDATE";
case"B116-R07":return !x.postFilterOwnerAcl||!x.revocationInvalidatesCache?"REJECT":!x.scopeEpochExact||!x.cancelFenceVerified||!x.ownerRevisionHashFrameExact?"STALE":"CANDIDATE";
case"B116-R08":return !x.sameDomainPort||!x.singleBabylonWorld||!x.leftUnifiedTaskPanel||!x.d04SeparatedFromD10||!x.frozenD08Preserved?"REJECT":!x.ownerCasAtWrite||!x.lateCancelReceiptIgnored?"STALE":!x.d13UnknownBlocksRelease?"UNKNOWN":"CANDIDATE";
default:throw Error("未知规则:"+id)}};
const countRoots=function countRoots(g){const by=new Map(g.nodes.map(n=>[n.id,n])),roots=new Set();let cycle=false,unknown=false;function walk(id,trail){if(trail.has(id)){cycle=true;return}const n=by.get(id);if(!n){unknown=true;return}if(n.kind==="primary"&&n.parents.length===0){roots.add(id);return}if(!n.parents.length){unknown=true;return}const nt=new Set(trail);nt.add(id);for(const p of n.parents)walk(p,nt)}for(const id of g.citations)walk(id,new Set());return {status:cycle?"REJECT":unknown?"UNKNOWN":roots.size<g.claimedIndependent?"REJECT":"CANDIDATE",count:cycle||unknown?null:roots.size}};
assert.equal(s.registeredRecords,s.sources.length);assert.equal(t.rules.length,8);
assert.equal(new Set(s.sources.map(v=>v.id)).size,s.sources.length);
assert.equal(new Set(f.cases.map(v=>v.id)).size,f.cases.length);
const sourceIds=new Set(s.sources.map(x=>x.id)),by=new Map(f.cases.map(x=>[x.id,x]));
for(const r of t.rules){assert.ok(r.sourceIds.length&&r.sourceIds.every(x=>sourceIds.has(x)));assert.ok(r.fields.length>=3&&r.caps.includes("CAP-11-03")&&r.originalWorkPackages.includes("T5-01")&&r.originalWorkPackages.includes("T5-02"));
 assert.ok(r.positive.length===1&&r.negative.length>=4);
 const pos=by.get(r.positive[0]);assert.ok(pos);assert.equal(judge(r.id,pos.input),"CANDIDATE");
 for(const nid of r.negative){const neg=by.get(nid);assert.ok(neg&&neg.rule===r.id);assert.ok(r.fields.every(field=>Object.hasOwn(neg.input,field)));
  assert.equal(judge(r.id,neg.input),neg.expect,nid);const changed=Object.keys(pos.input).filter(k=>JSON.stringify(pos.input[k])!==JSON.stringify(neg.input[k]));assert.deepEqual(changed,[neg.mutatedField],nid);}}
for(const c of f.cases)assert.equal(judge(c.rule,c.input),c.expect,c.id);
for(const g of f.goldens){const r=countRoots(g);assert.equal(r.status,g.expect,g.id);assert.equal(r.count,g.expectedDistinctRoots,g.id)}
console.log("B116同judge正反 "+f.cases.length+"/"+f.cases.length+"；图谱Golden "+f.goldens.length+"/"+f.goldens.length+"；规划不等于产品验收。");

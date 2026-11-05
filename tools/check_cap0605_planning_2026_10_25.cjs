#!/usr/bin/env node
/* Procet CAP-06-05 规划校验；不运行OCCT、NC、消费者、真实状态或签署 */
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const evaluateRule=function evaluateRule(id,x) {
  const sha = s => typeof s==="string" && /^[0-9a-f]{64}$/i.test(s);
  const sameSet = (a,b) => Array.isArray(a)&&Array.isArray(b)&&a.length===new Set(a).size&&b.length===new Set(b).size&&a.length===b.length&&a.every(v=>b.includes(v));
  if(id==="C0605-R01") return Array.isArray(x.refs)&&x.refs.length>=2&&x.refs.every(r=>r.assetId&&r.revision&&sha(r.hash)&&r.hashKind&&r.frame&&r.unit==="mm"&&r.scope===x.scope&&r.owner);
  if(id==="C0605-R02") {
    const ns=x.graph?.nodes;
    if(!Array.isArray(ns)||ns.length<2||!sha(x.graph.parentHash)||x.graph.parentHash!==x.graph.childParentHash) return false;
    const ids=new Map(ns.map(n=>[n.id,n]));if(ids.size!==ns.length)return false;
    const active=new Set(),done=new Set();
    function visit(id){if(active.has(id))return false;if(done.has(id))return true;const n=ids.get(id);if(!n||!Array.isArray(n.parents))return false;active.add(id);for(const parent of n.parents)if(!visit(parent))return false;active.delete(id);done.add(id);return true;}
    return ns.every(n=>visit(n.id));
  }
  if(id==="C0605-R03"){
    const s=x.material;if(!s||!Array.isArray(s.stockBefore)||!Array.isArray(s.removed)||!Array.isArray(s.stockAfter)||!Array.isArray(s.protected))return false;
    return s.removed.every(c=>s.stockBefore.includes(c))&&s.protected.every(c=>!s.removed.includes(c))&&sameSet(s.stockAfter,s.stockBefore.filter(c=>!s.removed.includes(c)));
  }
  if(id==="C0605-R04"){
    const b=x.fork;return !!(b&&b.parentPreserved&&sha(b.parentHash)&&b.frozenHashBefore===b.frozenHashAfter&&sha(b.frozenHashBefore)&&Array.isArray(b.children)&&b.children.length===2&&b.children[0].branch!==b.children[1].branch&&b.children[0].revision!==b.children[1].revision&&b.children[0].hash!==b.children[1].hash&&b.children.every(c=>c.parentHash===b.parentHash&&sha(c.hash)));
  }
  if(id==="C0605-R05"){
    const b=x.bytes;return !!(b&&b.algorithm==="SHA-256"&&b.hashKind==="RAW_PERSISTED_BREP_BYTES"&&b.formatVersion&&b.serializerVersion&&sha(b.observedSha)&&b.expectedSha===b.observedSha&&b.geometryEquivalenceClaimed===false&&x.syntheticOnly===true);
  }
  if(id==="C0605-R06"){
    const t=x.transform;return !!(t&&t.from==="PART"&&t.to==="SETUP-A"&&t.from!==t.to&&sha(t.hash)&&t.unit==="mm"&&t.rightHanded===true&&t.approved===true&&t.appliedOnce===true&&t.displayOnlyConversionExcluded===true);
  }
  if(id==="C0605-R07"){
    const e=x.evidence;return !!(e&&e.occtVersion==="8.0.1"&&e.preValid===true&&e.postValid===true&&e.hasErrors===false&&e.warningsReviewed===true&&e.independentReviewPlanned===true&&e.productExecution==="NOT_RUN"&&x.syntheticOnly===true);
  }
  if(id==="C0605-R08"){
    const c=x.commit;return !!(c&&c.seal==="SEALED"&&c.expectedHead===c.observedHead&&c.aclEpoch===c.observedAclEpoch&&c.taskGeneration===c.observedTaskGeneration&&c.cancelled===false&&c.lateReceiptAccepted===false&&c.idempotencyKey&&c.uniqueTerminal===true&&c.receiptState==="COMMITTED");
  }
  if(id==="C0605-R09"){
    const v=x.invalidation;return !!(v&&v.changed==="D07:S1"&&v.frozenUntouched===true&&v.setupIsolation===true&&sameSet(v.actual,v.expected)&&v.actual.every(a=>a.endsWith(":S1")&&!a.startsWith("D08:"))&&v.kept.includes("D08:S2")&&v.kept.includes("D04:S2"));
  }
  if(id==="C0605-R10"){
    const q=x.qualification;return !!(q&&q.claimedTier==="PLANNING_ONLY"&&q.d07Gate==="REQUIRED_NOT_RUN"&&q.d08ExactFrozen===true&&q.d13==="UNKNOWN"&&q.d15==="NOT_RUN"&&q.d16==="BLOCKED"&&q.fromClPreview===false&&x.syntheticOnly===true);
  }
  return false;
};
const fixtures=load("docs/capabilities/CAP-06-05/fixtures.json");
const trace=load("research/traces/CAP-06-05.json");
const sources=load("research/sources/CAP-06-05.json");
const owners=load("docs/capabilities/CAP-06-05/asset-owner-candidates.json");
const index=load("research/source-index.json");
assert.equal(fixtures.syntheticOnly,true);assert.equal(fixtures.notRealOcct,true);
assert.equal(fixtures.cases.length,20);assert.equal(trace.rules.length,10);assert.equal(sources.sources.length,10);assert.equal(owners.assets.length,17);
assert.equal(new Set(sources.sources.map(x=>x.id)).size,10);
assert.equal(new Set(trace.rules.map(x=>x.id)).size,10);
assert.equal(new Set(owners.assets.map(x=>x.id)).size,17);
assert.ok(index.registries.some(x=>x.path==="research/sources/CAP-06-05.json"));
const sid=new Set(sources.sources.map(x=>x.id));
let pos=0,neg=0;
for(const r of trace.rules){
  assert.equal(r.capabilityId,"CAP-06-05");assert.ok(r.fields.length>=3);assert.ok(r.assets.length>0);
  assert.ok(r.sourceIds.length>0&&r.sourceIds.every(x=>sid.has(x)));
  for(const [testId,isPositive] of [[r.positiveTestId,true],[r.negativeTestId,false]]){
    const c=fixtures.cases.find(x=>x.id===testId);assert.ok(c);assert.equal(c.ruleId,r.id);assert.equal(c.synthetic,true);
    assert.equal(evaluateRule(r.id,c.input),isPositive,`测试未区分正反: ${testId}`);
    assert.equal(c.expected,isPositive?"PASS":r.negativeReason);
    if(isPositive)pos++;else neg++;
  }
}
const m=load("docs/capabilities/CAP-06-05/mutation-fixtures.json");
assert.equal(m.cases.length,10);
for(const t of m.cases){assert.equal(evaluateRule(t.ruleId,t.input),false,`变异应拒绝: ${t.id}`);}
for(const f of ["docs/capabilities/CAP-06-05/README.md","docs/capabilities/CAP-06-05/UI.md","docs/capabilities/CAP-06-05/contract.example.json","docs/capabilities/CAP-06-05/invalidation-matrix.json","docs/capabilities/CAP-06-05/independent-consumer-handoff.md","research/topics/R-IMMSTATE-001.md"])assert.ok(fs.existsSync(path.join(root,f)),f);
console.log(JSON.stringify({CAP:"CAP-06-05",planningSynthetic:"PASS",positive:pos,negative:neg,mutations:m.cases.length,realOcct:"NOT_RUN",product:"NOT_RUN",independentConsumer:"NOT_RUN",ownerSignoff:"PENDING_HUMAN"}));

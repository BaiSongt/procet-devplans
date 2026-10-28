#!/usr/bin/env node
'use strict';
// 第九批只读规划校验：静态合成PASS不构成产品、NC或机床通过。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sha=p=>{const b=fs.readFileSync(path.join(root,p));return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+String.fromCharCode(0))).update(b).digest('hex')};
const audit=read('research/audits/REGISTRY-AUDIT-B09-2026-10-28.json'),idx=read('research/source-index.json');
const sup=read('research/traces/CAP-08-06-tooltable-loaded-state-supplement-v08.json'),fx=read('docs/architecture/v0.8/registry-audit-b09-fixtures-v08.json'),prog=read('tracking/registry-audit-progress-v08.json');
assert.equal(sha('research/source-index.json'),audit.sourceIndexBlobSha);
assert.equal(idx.registries.length,127);assert.equal(idx.registeredRecords,1075);
let count=0,covered=0,inline=0;const ids=new Set();
for(const x of audit.items){
 assert.equal(idx.registries[x.ordinal-1].path,x.registryPath);
 assert.equal(idx.registries[x.ordinal-1].registeredRecords,x.sourceCount);
 assert.equal(sha(x.registryPath),x.registryBlobSha);assert.equal(sha(x.tracePath),x.traceBlobSha);
 const src=read(x.registryPath).sources,trace=read(x.tracePath),refs=new Set(trace.rules.flatMap(r=>r.sourceIds||[]));
 assert.deepEqual(src.map(z=>z.id),x.sourceIds);
 const missing=src.filter(s=>!refs.has(s.id)).map(s=>s.id);assert.deepEqual(missing,x.unreferencedInOriginalSameNameTrace);
 for(const s of src){assert.ok(!ids.has(s.id),'重复来源ID '+s.id);ids.add(s.id);if(Array.isArray(s.rules)&&s.rules.length)inline++;}
 count+=src.length;covered+=src.length-missing.length;
}
assert.equal(count,84);assert.equal(covered,83);assert.equal(inline,0);
assert.deepEqual(audit.originalSameNameTraceUnreferenced,['C086-S7']);
assert.equal(audit.externalPagesActuallyReopened.length,7);
assert.equal(sha(sup.sourceRegistry),sup.originalRegistryBlobSha);assert.equal(sha(sup.originalTrace),sup.originalTraceBlobSha);
for(const r of sup.rules){for(const id of r.sourceIds)assert.ok(ids.has(id),'补证悬空来源 '+id);assert.ok(r.fields.length&&r.workPackages.length);}
function decide(x){const c=x.contract,w=x.workflow;
if(!(c.ncRawHash===c.ncExpectedHash&&c.toolTableFileHash===c.loadedToolTableHash&&c.toolFileRevision===c.loadedToolRevision&&c.toolSourceOwner==="D03"&&c.bindingOwner==="D10"&&c.toolFrame===c.bindingFrame&&c.controllerProfileHash===c.expectedProfileHash&&c.toolDependencySnapshotPinned&&c.toolReloadEvidenceChecked&&c.controllerStateEvidence==="INDEPENDENT_CAPTURED"&&c.noFileEqualsRuntimeAssumption))return"REJECT";
if(!(w.d12RevisionUnchanged&&w.d13InterpretedExact&&w.d14AxisRecomputed&&w.d15IndependentVerified&&w.d16Status==="HUMAN_REVIEW_REQUIRED"&&w.casRechecked&&w.aclRechecked&&w.scopeEpoch===w.currentEpoch&&!w.cancelled&&!w.lateReceipt&&w.ownerAuthorised&&w.guiSamePort&&w.cliSamePort&&w.agentSamePort&&w.worldCount===1&&w.leftTaskPanelCount===1&&w.fontMaxPx>0&&w.fontMaxPx<=12&&w.clOnlyNotNCProof&&w.noMaterialSweepClaim))return"REJECT";
return"PLANNING_CANDIDATE_NOT_PRODUCT_PASS";}
function gate(g){switch(g.kind){case"NC_BYTES_EDIT":return"NEW_D12_REVISION_D13_TO_D16_STALE";case"TOOL_FILE_EDIT":return"D12_UNCHANGED_DEPENDENCY_STALE";case"SAVED_ONLY":return"LOADED_STATE_UNKNOWN_BLOCK_D16";case"RELOAD_ACK_ONLY":return"NOT_A_D15_VERIFICATION";case"CANCEL_LATE":return"DISCARD_LATE_RECEIPT";case"CTRL_UNKNOWN":return"UNKNOWN_BLOCK_D16";case"CL_PREVIEW":return"CL_ONLY_NOT_NC_PROOF";case"D16_REQUEST":return g.realConsumer&&g.humanSignature?"HUMAN_REVIEW_CANDIDATE":"HUMAN_AND_CONSUMER_REQUIRED";default:return"REJECT";}}
const base=fx.cases[0].input;let validations=0;
for(const x of fx.cases){
 assert.equal(decide(x.input),x.expected,x.id);validations++;
 if(x.changedField){let changed=0;for(const g of ['contract','workflow'])for(const k of Object.keys(base[g]))if(base[g][k]!==x.input[g][k])changed++;assert.equal(changed,1,'非独立单字段 '+x.id);}
}
for(const g of fx.gates){assert.equal(gate(g),g.expected,g.id);validations++;}
assert.equal(fx.positiveCases,3);assert.equal(fx.independentSingleFieldNegatives,30);assert.equal(fx.gatesCount,8);assert.equal(validations,41);
assert.equal(prog.structuralAuditedRegistries,90);assert.equal(prog.structuralAuditedRegistrations,754);
console.log('B09原同名Trace 83/84+补证1；规划静态合成41/41；独立消费者/机床NOT_RUN');

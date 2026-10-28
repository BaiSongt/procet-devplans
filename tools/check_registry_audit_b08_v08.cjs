#!/usr/bin/env node
'use strict';
// B08只读本地规划核验；绝不写产品数据库、不启动CI、不把静态PASS当产品PASS。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sha=p=>{const b=fs.readFileSync(path.join(root,p));return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex')};
const audit=read('research/audits/REGISTRY-AUDIT-B08-2026-10-28.json'),index=read('research/source-index.json');
const sup=read('research/traces/T5-05-independent-consumer-supplement-v08.json');
const fx=read('docs/architecture/v0.8/registry-audit-b08-fixtures-v08.json'),progress=read('tracking/registry-audit-progress-v08.json');
assert.equal(sha('research/source-index.json'),audit.sourceIndexBlobSha);
assert.equal(index.registries.length,127);assert.equal(index.registeredRecords,1075);
let total=0,covered=0,inline=0;const seen=new Set();
for(const x of audit.items){
 assert.equal(index.registries[x.ordinal-1].path,x.registryPath);
 assert.equal(index.registries[x.ordinal-1].registeredRecords,x.sourceCount);
 assert.equal(sha(x.registryPath),x.registryBlobSha);assert.equal(sha(x.tracePath),x.traceBlobSha);
 const src=read(x.registryPath).sources,trace=read(x.tracePath),refs=new Set(trace.rules.flatMap(r=>r.sourceIds||[]));
 assert.equal(src.length,x.sourceCount);assert.deepEqual(src.map(s=>s.id),x.sourceIds);
 for(const id of refs)assert.ok(src.some(s=>s.id===id),'悬空source '+id);
 const missing=src.filter(s=>!refs.has(s.id)).map(s=>s.id);
 assert.deepEqual(missing,x.unreferencedInOriginalSameNameTrace);
 for(const s of src){assert.ok(!seen.has(s.id),'本批来源ID重复 '+s.id);seen.add(s.id);if(Array.isArray(s.rules)&&s.rules.length)inline++;}
 total+=src.length;covered+=src.length-missing.length;
}
assert.equal(total,94);assert.equal(covered,94);assert.equal(inline,0);
assert.equal(audit.externalPagesActuallyReopened.length,7);
assert.equal(sha('research/sources/T5-05.json'),sup.originalRegistryBlobSha);
assert.equal(sha('research/traces/T5-05.json'),sup.originalTraceBlobSha);
const t505=new Set(read('research/sources/T5-05.json').sources.map(s=>s.id));
for(const r of sup.rules)for(const id of r.sourceIds)assert.ok(t505.has(id),'补证来源悬空 '+id);
function decide(x){const c=x.contract,w=x.workflow;
 if(!(c.schemaValidated&&c.consumerExecuted&&c.consumerSuiteIndependent&&c.consumerEvidenceHash===c.sourceEvidenceHash&&c.producerRevision===c.consumerExpectedRevision&&c.producerHash===c.consumerExpectedHash&&c.producerFrame===c.consumerExpectedFrame&&c.units===c.consumerUnits&&c.ownerPort==='D09.OwnerPort'&&c.ownerAuthorized))return 'REJECT';
 if(!(w.finalArtifact==='FINAL_NC'&&w.setupId!=='UNKNOWN'&&w.executionBindingId!=='UNKNOWN'&&w.d12Postprocessed&&w.d13Known&&w.d14AxisTime&&w.d15IndependentValidated&&w.d16Review==='HUMAN_REQUIRED'&&w.casRechecked&&w.aclRechecked&&w.scopeEpoch===w.currentEpoch&&!w.cancelled&&!w.lateReceipt&&w.activeWorlds===1&&w.taskPanelCount===1&&w.guiSamePort&&w.cliSamePort&&w.agentSamePort&&w.fontMaxPx>0&&w.fontMaxPx<=12&&w.clAnimationNotProductProof&&w.materialSweepNotClaimed))return 'REJECT';
 return 'PLANNING_CANDIDATE_NOT_PRODUCT_PASS';
}
const base=fx.cases[0].input;
for(const x of fx.cases){
 assert.equal(decide(x.input),x.expected,x.id);
 if(x.id.startsWith('B08-N')){
 const delta=Object.keys(base.contract).filter(k=>base.contract[k]!==x.input.contract[k]).length+Object.keys(base.workflow).filter(k=>base.workflow[k]!==x.input.workflow[k]).length;
 assert.equal(delta,1,x.id+' 必须单字段变异');
 }
}
function gate(g){if(g.kind==='PREVIEW')return 'READ_ONLY';if(g.kind==='AGENT_SUGGEST')return 'DRAFT_ONLY';if(g.kind==='CL_ANIMATION')return 'NO_NC_VERIFICATION';if(g.kind==='CANCEL_LATE')return 'DISCARD_RECEIPT';if(g.kind==='POST_ONLY')return 'D15_NOT_RUN';if(g.kind==='D13_UNKNOWN')return 'BLOCK_D16';if(g.kind==='OWNER_COMMIT')return g.cas&&g.acl&&g.exact?'COMMIT_CANDIDATE':'DENY';if(g.kind==='D16_RELEASE')return g.realConsumer&&g.humanSignature?'HUMAN_RELEASE_REVIEW':'HUMAN_SIGNATURE_REQUIRED';return 'REJECT';}
for(const g of fx.gates)assert.equal(gate(g),g.expected,g.id);
assert.equal(fx.cases.length,28);assert.equal(fx.gates.length,8);assert.equal(fx.total,36);
assert.equal(progress.structuralAuditedRegistries,80);assert.equal(progress.structuralAuditedRegistrations,670);
console.log('B08规划结构94/94原Trace；36/36规划正反门禁；独立消费者与产品NOT_RUN');

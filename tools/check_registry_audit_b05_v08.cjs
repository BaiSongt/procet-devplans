#!/usr/bin/env node
'use strict';
// 第五批研究Registry：原Blob身份、直接映射与独立单字段反例只读校验。
// 仅规划数据，不调用产品库/NC/OCCT/B5，禁止将规划PASS冒充产品PASS。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const audit=read('research/audits/REGISTRY-AUDIT-B05-2026-10-28.json');
const index=read('research/source-index.json');
const matrix=read('docs/architecture/v0.8/cross-coverage-v08.json');
assert.equal(index.registries.length,127);
assert.equal(index.registeredRecords,1075);
assert.equal(index.registries.reduce((n,r)=>n+r.registeredRecords,0),1075);
const sourceData=new Map();
let observed=0, noInline=0;
for(const r of audit.registryItems){
  assert.ok(r.ordinal>=41&&r.ordinal<=50);
  const original=index.registries[r.ordinal-1];
  assert.equal(original.path,r.registryPath);
  assert.equal(original.registeredRecords,r.registryRecordCount);
  const raw=fs.readFileSync(path.join(root,r.registryPath));
  const sha=crypto.createHash('sha1').update(Buffer.from('blob '+raw.length)).update(Buffer.from([0])).update(raw).digest('hex');
  assert.equal(sha,r.registryGitBlobSha,r.registryPath);
  const src=JSON.parse(raw.toString('utf8')).sources;
  assert.equal(src.length,r.registryRecordCount,r.registryPath);
  for(const s of src){
    assert.ok(!sourceData.has(s.id),'重复来源ID '+s.id);
    sourceData.set(s.id,{...s,blobSha:sha,path:r.registryPath});
    if(!Array.isArray(s.rules)||s.rules.length===0)noInline++;
  }
  observed+=src.length;
  const entry=src.find(s=>s.id===r.sourceId);
  assert.ok(entry,'缺失登记 '+r.sourceId);
  assert.equal(entry.url,r.url);
  assert.equal(entry.accessDepth,r.readDepth);
  assert.ok(Array.isArray(r.authors)&&r.authors.length&&r.actuallyReadSection&&r.limitation);
  assert.ok(matrix.capabilities.find(c=>c.id===r.capabilityId)?.originalWorkPackages.includes(r.originalWorkPackageId),'原工作包直接边不成立');
}
assert.equal(observed,84);
assert.equal(noInline,84);
assert.equal(sourceData.size,84);
assert.equal(audit.registryItems.length,10);
assert.equal(audit.externalPagesActuallyRechecked,10);
assert.equal(audit.rules.length,10);
const fields=['sourceId','registryGitBlobSha','capabilityId','originalWorkPackageId','fieldPath','sourceUrl','readDepth','ownerRevision','ownerHash','ownerFrame','l3','product'];
const fx=audit.fixtures;
const positives=new Map(fx.cases.filter(c=>c.kind==='POS').map(c=>[c.ruleId,c]));
assert.equal(positives.size,10);
let pos=0,neg=0;
for(const c of fx.cases){
  const rule=audit.rules.find(r=>r.id===c.ruleId);
  assert.ok(rule,'规则缺失 '+c.ruleId);
  const base=positives.get(c.ruleId);
  assert.ok(base);
  assert.deepEqual(Object.keys(c.claim).sort(),fields.slice().sort());
  assert.equal(base.claim.sourceId,rule.sourceId);
  assert.equal(base.claim.registryGitBlobSha,rule.sourceBlob);
  assert.equal(base.claim.capabilityId,rule.capabilityId);
  assert.equal(base.claim.originalWorkPackageId,rule.originalWorkPackageId);
  assert.equal(base.claim.fieldPath,rule.fieldPath);
  assert.equal(base.claim.l3,'PENDING_HUMAN');
  assert.equal(base.claim.product,'NOT_RUN');
  const differences=fields.filter(k=>base.claim[k]!==c.claim[k]);
  assert.equal(differences.length,c.kind==='NEG'?1:0,c.id);
  if(c.kind==='NEG'){assert.equal(differences[0],c.changedField,c.id);neg++;}
  else pos++;
  assert.equal(c.expected,differences.length?'REJECT':'PLANNING_PASS',c.id);
}
assert.equal(pos,10);
assert.equal(neg,120);
const gate=g=>g.action==='OWNER_COMMIT'?
 (g.input.acl&&g.input.cas&&g.input.scopeEpochMatch&&g.input.revisionMatch&&g.input.hashMatch&&g.input.namedFrameMatch&&!g.input.cancelled&&!g.input.lateAck?'REVALIDATE_AND_COMMIT_CANDIDATE':'DENY'):
 (g.input.ncProduced&&g.input.semanticKnown&&g.input.axisTimelineKnown&&g.input.d15Validated&&g.input.controllerProfileKnown?'HUMAN_REVIEW_REQUIRED':'BLOCK_RELEASE');
for(const g of fx.gates) assert.equal(g.expected,gate(g),g.id);
assert.equal(fx.gates.length,12);
assert.equal(pos+neg+fx.gates.length,142);
assert.equal(fx.total,142);
assert.equal(audit.guardrails.L3,'PENDING_HUMAN');
console.log('B05 Registry规划证据/正反/门禁：142/142 PASS。真实Node消费者/OCCT/NC/B5/产品验收：NOT_RUN。');

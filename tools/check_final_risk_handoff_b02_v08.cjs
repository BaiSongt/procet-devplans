#!/usr/bin/env node
'use strict';
// V0.8只读规划门禁校验，不写产品或主分支，不代替正式签署和实机验收。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('research/audits/FINAL-RISK-HANDOFF-B02-2026-10-29.json');
const t=read('research/traces/FINAL-RISK-HANDOFF-B02-V08.json');
const f=read('docs/architecture/v0.8/final-risk-handoff-b02-fixtures-v08.json');
const fields=f.validityRequiredFields;
const valid=s=>s.ownerSignature===true&&s.independentConsumerPass===true&&s.samePort===true&&s.aclEpochCurrent===true&&s.casOk===true&&s.canceled===false&&s.lateAck===false&&fields.every(k=>Boolean(s.ref[k]))&&s.ncUnknown===false;
assert.equal(a.assets.length,17);assert.equal(a.domainRisks.length,11);assert.equal(a.zeroOriginalEdgeWorkPackages.length,10);
assert.equal(a.baseline.originalCapPackageEdges,312);assert.equal(a.baseline.sourceRecords,1075);
assert.equal(a.ownerSigned,0);assert.equal(a.independentConsumerPassed,0);
assert.equal(a.productVerification,'NOT_RUN');assert.equal(a.humanL3,'PENDING_HUMAN');assert.equal(a.globalGates.unknownSemanticsPublish,false);
assert.equal(new Set(a.assets.map(x=>x.assetId)).size,17);
assert(a.assets.every(x=>x.signoff==='PENDING_HUMAN'&&x.consumer==='NOT_RUN'&&x.product==='NOT_RUN'));
assert(a.zeroOriginalEdgeWorkPackages.every(x=>x.originalDirectEdges===0&&x.policy==='PRESERVE_ORIGINAL_ZERO_CANDIDATE_LINKS_ONLY'));
const sourceIds=new Set(a.authoritySources.map(x=>x.id));assert.equal(t.rules.length,6);
assert(t.rules.every(r=>r.sourceRefs.every(id=>sourceIds.has(id))&&r.caps.length&&r.packages.length&&r.fields.length));
for(const c of f.tests){assert(a.assets.some(x=>x.assetId===c.assetId),c.id);assert.equal(valid(c.state)?'ACCEPT':'REJECT',c.expected,c.id)}
assert.equal(f.tests.length,204);
console.log('规划合成门禁 '+f.tests.length+'/'+f.tests.length+' PASS；真实产品、独立消费者、正式Owner仍NOT_RUN/PENDING。');

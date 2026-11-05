#!/usr/bin/env node
'use strict';
// 第四批研究规划证据校验，只读；不执行产品代码、控制器、实机或独立消费者。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('research/audits/REGISTRY-AUDIT-B04-2026-10-28.json'),t=read('research/traces/REGISTRY-AUDIT-B04-V08.json'),f=read('docs/architecture/v0.8/registry-audit-b04-fixtures-v08.json'),index=read('research/source-index.json');
assert.equal(index.registries.length,127);assert.equal(index.registeredRecords,1075);
assert.equal(index.registries.reduce((sum,r)=>sum+r.registeredRecords,0),1075);
let count=0,inline=0;const ids=new Set();
for(const r of a.registries){const b=fs.readFileSync(path.join(root,r.path)),hash=crypto.createHash('sha1').update(Buffer.from('blob '+b.length)).update(Buffer.from([0])).update(b).digest('hex');assert.equal(hash,r.blobSha,r.path);
const src=JSON.parse(b.toString('utf8')).sources;assert.equal(src.length,r.records);assert.deepEqual(src.map(s=>s.id),r.sourceIds);assert.equal(index.registries.find(x=>x.path===r.path)?.registeredRecords,r.records);
for(const s of src){assert.ok(!ids.has(s.id));ids.add(s.id);inline+=Number(Array.isArray(s.rules)&&s.rules.length>0)}count+=src.length;}
assert.equal(count,84);assert.equal(ids.size,84);assert.equal(inline,32);
const observed=new Map(a.externallyRechecked.map(x=>[x.id,x])),rules=new Map(t.rules.map(x=>[x.id,x]));
assert.equal(observed.size,10);assert.equal(rules.size,10);
for(const v of observed.values()){const s=read(v.registryPath).sources.find(x=>x.id===v.id);assert.ok(s);assert.equal(s.url,v.url);assert.equal(s.accessDepth,v.readDepth);assert.ok(v.readLocator&&v.authors.length&&v.limitation);}
let n=0;for(const c of f.cases){const r=rules.get(c.ruleId);assert.ok(r);const gold={sourceId:r.sourceId,registryPath:r.registryPath,registryBlobSha:r.registryBlobSha,sourceUrl:r.sourceUrl,readDepth:r.readDepth,capabilityId:r.capabilityId,originalWorkPackageId:r.originalWorkPackageId,fieldPath:r.fieldPaths[0],ownerRevision:'SYNTHETIC_REV_A',ownerHash:'SYNTHETIC_HASH_A',ownerFrame:'SYNTHETIC_PART_FRAME',L3:'PENDING_HUMAN',product:'NOT_RUN'};
const diff=Object.keys(gold).filter(k=>gold[k]!==c.claim[k]);assert.equal(diff.length,c.kind==='NEG'?1:0,c.id);if(c.kind==='NEG')assert.equal(diff[0],c.field);assert.equal(diff.length===0?'PLANNING_PASS':'REJECT',c.expected,c.id);n++;}
const gate=g=>g.action==='COMMIT'?(g.input.acl&&g.input.cas&&!g.input.cancelled&&!g.input.epochChanged&&g.input.revisionMatch&&g.input.hashMatch&&g.input.frameMatch&&!g.input.lateAck?'OWNER_REVALIDATE':'DENY'):g.action==='RELEASE'?(g.input.ncProduced&&g.input.semanticKnown&&g.input.axisTimeline&&g.input.validated?'HUMAN_REVIEW_REQUIRED':'BLOCK_RELEASE'):'DENY';
for(const g of f.gates){assert.equal(gate(g),g.expected,g.id);n++;}assert.equal(n,148);
assert.equal(t.domainConstraints.L3,'PENDING_HUMAN');assert.equal(t.domainConstraints.product,'NOT_RUN');
console.log('B04 10份、84记录与148项规划证据合成 Node PASS；非产品PASS');

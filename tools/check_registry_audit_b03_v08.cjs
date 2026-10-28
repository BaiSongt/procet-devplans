#!/usr/bin/env node
'use strict';
// 第三批规划证据独立Node只读校验器；不执行产品/NC/机床或真实消费者验收。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('research/audits/REGISTRY-AUDIT-B03-2026-10-28.json'),t=read('research/traces/REGISTRY-AUDIT-B03-V08.json'),f=read('docs/architecture/v0.8/registry-audit-b03-fixtures-v08.json'),index=read('research/source-index.json');
assert.equal(index.registries.length,127);assert.equal(index.registeredRecords,1075);assert.equal(index.registries.reduce((n,x)=>n+x.registeredRecords,0),1075);
let total=0,inline=0;const ids=new Set();
for(const r of a.registries){const bytes=fs.readFileSync(path.join(root,r.path));
const hash=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length)).update(Buffer.from([0])).update(bytes).digest('hex');
assert.equal(hash,r.blobSha,r.path+'原Blob不同');
const src=JSON.parse(bytes.toString('utf8')).sources;assert.equal(src.length,r.records);
assert.deepEqual(src.map(x=>x.id),r.sourceIds);
assert.equal(index.registries.find(x=>x.path===r.path)?.registeredRecords,r.records);
for(const x of src){assert.ok(!ids.has(x.id),x.id);ids.add(x.id);inline+=Number(Array.isArray(x.rules)&&x.rules.length>0)}total+=src.length;}
assert.equal(total,71);assert.equal(ids.size,71);assert.equal(inline,49);
const checked=new Map(a.externallyRechecked.map(x=>[x.id,x])),rules=new Map(t.rules.map(x=>[x.id,x]));
for(const x of checked.values()){const entry=read(x.registryPath).sources.find(y=>y.id===x.id);assert.ok(entry);assert.equal(entry.url,x.url);assert.equal(entry.accessDepth,x.readDepth);assert.ok(x.readLocator&&x.limitation);}
const claim=x=>({sourceId:x.id,registryPath:x.registryPath,registryBlobSha:x.originalBlobSha,sourceUrl:x.url,readDepth:x.readDepth,capabilityId:x.capabilityId,originalWorkPackageId:x.originalWorkPackageId,fieldPath:x.fieldPath,L3:'PENDING_HUMAN',product:'NOT_RUN'});
let n=0;
for(const c of f.cases){const rule=rules.get(c.ruleId),entry=rule&&checked.get(rule.sourceId);
const right=entry&&claim(entry),ok=right&&JSON.stringify(right)===JSON.stringify(c.claim);
assert.equal(ok?'PLANNING_PASS':'REJECT',c.expected,c.id);
if(c.kind==='NEG')assert.equal(Object.keys(right).filter(k=>right[k]!==c.claim[k]).length,1,c.id);
n++;}
const gate=g=>g.action==='COMMIT'?(g.input.acl&&g.input.cas&&!g.input.cancelled&&!g.input.epochChanged&&g.input.revisionMatch&&!g.input.lateAck?'OWNER_REVALIDATE':'DENY'):g.action==='RELEASE'?(g.input.ncProduced&&g.input.semanticKnown&&g.input.axisTimeline&&g.input.validated?'HUMAN_REVIEW_REQUIRED':'BLOCK_RELEASE'):'DENY';
for(const g of f.gates){assert.equal(gate(g),g.expected,g.id);n++;}
assert.equal(n,118);assert.equal(t.domainConstraints.L3,'PENDING_HUMAN');assert.equal(t.domainConstraints.product,'NOT_RUN');
console.log('B03 10份/71登记/118正反及门禁 Node规划检查PASS；非产品PASS');

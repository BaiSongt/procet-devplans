#!/usr/bin/env node
'use strict';
// 本校验器仅对规划仓读取校验；不能冒充OCCT/NC/B5/独立消费者实测。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const audit=read('research/audits/REGISTRY-AUDIT-B02-2026-10-28.json');
const trace=read('research/traces/REGISTRY-AUDIT-B02-V08.json');
const fixtures=read('docs/architecture/v0.8/registry-audit-b02-fixtures-v08.json');
const index=read('research/source-index.json');
assert.equal(index.registries.length,127);assert.equal(index.registeredRecords,1075);
assert.equal(index.registries.reduce((n,x)=>n+x.registeredRecords,0),1075);
let total=0;const ids=new Set();
for(const x of audit.registries){
 const bytes=fs.readFileSync(path.join(root,x.path));
 const hash=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
 assert.equal(hash,x.blobSha,x.path+'源字节已变');
 const entries=JSON.parse(bytes.toString('utf8')).sources;
 assert.equal(entries.length,x.records);
 assert.equal(index.registries.find(z=>z.path===x.path)?.registeredRecords,x.records);
 for(const s of entries){assert.ok(!ids.has(s.id),s.id);ids.add(s.id);assert.ok(s.rules?.length>0,s.id)}
 total+=entries.length;
}
assert.equal(total,37);assert.equal(ids.size,37);
const sources=new Map(audit.externallyRechecked.map(c=>[c.id,c]));
const rules=new Map(trace.rules.map(r=>[r.id,r]));
for(const c of sources.values()){
 const entry=read(c.registryPath).sources.find(s=>s.id===c.id);
 assert.ok(entry);assert.equal(entry.url,c.url);assert.ok(c.limitation&&c.readLocator);
}
const claim=c=>({sourceId:c.id,registryPath:c.registryPath,registryBlobSha:c.originalBlobSha,sourceUrl:c.url,readDepth:c.readDepth,capabilityId:c.capabilityId,originalWorkPackageId:c.originalWorkPackageId,fieldPath:c.fieldPath,L3:'PENDING_HUMAN',product:'NOT_RUN'});
let n=0;
for(const t of fixtures.cases){const rule=rules.get(t.ruleId);const c=rule&&sources.get(rule.sourceId);
 const actual=c&&JSON.stringify(claim(c))===JSON.stringify(t.claim)?'PLANNING_PASS':'REJECT';
 assert.equal(actual,t.expected,t.id);n++;}
for(const g of fixtures.gates){const x=g.input;
 const actual=('cas' in x)?x.cas&&x.acl&&!x.cancelled?'DOMAIN_REVALIDATE':'DENY':x.nc&&x.known&&x.validated?'HUMAN_REVIEW_REQUIRED':'BLOCK_RELEASE';
 assert.equal(actual,g.expected,g.id);n++;}
assert.equal(n,108);assert.equal(trace.domainConstraints.product,'NOT_RUN');
console.log('规划审计B02 10 Registry/37来源/108正反及门禁 PASS；非产品PASS');

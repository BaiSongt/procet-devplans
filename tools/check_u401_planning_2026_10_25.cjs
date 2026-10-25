#!/usr/bin/env node
// U4-01 规划合成核验：只读取本规划仓，不能替代真实 GUI、Owner Port 或产品验收。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const trace=read('research/traces/U4-01.json'),registry=read('research/sources/U4-01.json'),fixture=read('docs/work-packages/U4-01/fixtures.json');
const assets=read('docs/work-packages/U4-01/asset-owner-candidates.json');
const valid=(i,d)=>{switch(i){
case 1:return ((()=>{const c=d.ctx||{};return ["projectId","documentId","documentRevision","documentHash","setupId","setupRevision","setupHash"].every(k=>!!c[k])&&!!c.frame?.id&&!!c.frame?.revision&&!!c.frame?.hash&&Number.isInteger(c.scopeEpoch)})());
case 2:return (["projectId","documentId","scopeEpoch"].every(k=>d.scope?.[k]===d.result?.[k])&&!!d.scope?.documentId);
case 3:return (d.action==="DISPLAY_CHANGE"&&d.before?.workMode===d.after?.workMode&&d.before?.displayMode!==d.after?.displayMode&&Array.isArray(d.businessWrites)&&d.businessWrites.length===0);
case 4:return (!d.dirty||( ["SAVE_DRAFT","DISCARD_CONFIRMED","CANCEL_NAVIGATION"].includes(d.resolution)&&(d.resolution!=="SAVE_DRAFT"||d.persistedDraft===true)));
case 5:return (["setupId","setupRevision","setupHash"].every(k=>!!d.request?.[k]&&d.request[k]===d.restored?.[k]));
case 6:return (!d.cancelled&&["scopeEpoch","generation","documentHash"].every(k=>d.expected?.[k]===d.reply?.[k])&&Number.isInteger(d.expected?.generation));
case 7:return ((()=>{const c=d.commit||{};return !!c.expectedHead&&c.expectedHead===c.currentHead&&c.aclEpochExpected===c.aclEpochCurrent&&c.hasWritePermission===true&&c.cancelled===false})());
case 8:return (d.scene?.sceneCount===1&&d.scene?.sceneId==="world-main"&&d.scene?.activeLeases<=1&&d.scene?.disposedOldOverlay===true);
case 9:return (d.edit?.frozenHashBefore===d.edit?.frozenHashAfter&&!!d.edit?.proposedRevision&&!d.edit?.mutatesFrozen);
case 10:return (d.restoration?.exists===false?d.restoration.status==="STALE_MISSING"&&d.restoration.fallbackSelected===false:d.restoration?.status==="RESOLVED");
default:throw Error('unknown rule '+i);
}};
assert.equal(trace.rules.length,10);assert.equal(registry.sources.length,9);assert.equal(fixture.cases.length,20);assert.equal(fixture.mutations.length,10);
assert.equal(new Set(registry.sources.map(x=>x.id)).size,9);assert.equal(assets.assets.length,17);
const sourceIDs=new Set(registry.sources.map(x=>x.id)),tests=new Map(fixture.cases.map(x=>[x.id,x]));
let passed=0;
for(let i=1;i<=10;i++){
const r=trace.rules[i-1],p=tests.get(r.positiveTestId),n=tests.get(r.negativeTestId),m=fixture.mutations[i-1];
assert.ok(r.fields.length>2);assert.ok(r.sourceIds.length>=2);assert.ok(r.sourceIds.every(x=>sourceIDs.has(x)));
assert.equal(p.ruleId,r.id);assert.equal(n.ruleId,r.id);assert.equal(m.ruleId,r.id);
assert.equal(valid(i,p.input),true,'positive '+r.id);assert.equal(valid(i,n.input),false,'negative '+r.id);
assert.equal(valid(i,m.input),false,'mutation '+r.id);
passed+=3;
}
console.log('U4-01 planning synthetic checks: '+passed+'/30 PASS; product/consumer/GUI tests NOT_RUN.');

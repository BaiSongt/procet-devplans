#!/usr/bin/env node
'use strict';
// 规划第七批Registry只读证据检查。规划通过不等于产品或WCAG验收。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),a=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sha=p=>{const b=fs.readFileSync(path.join(root,p));return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');};
const d=read('research/audits/REGISTRY-AUDIT-B07-2026-10-28.json'),index=read('research/source-index.json'),sup=read('research/traces/U4-02-accessibility-supplement-v08.json'),fx=read('docs/architecture/v0.8/registry-audit-b07-fixtures-v08.json'),progress=read('tracking/registry-audit-progress-v08.json'),matrix=read('docs/architecture/v0.8/cross-coverage-v08.json');
a.equal(index.registries.length,127);a.equal(index.registeredRecords,1075);a.equal(sha('research/source-index.json'),d.sourceIndexBlobSha);
let n=0,c=0,inline=0;const seen=new Set(),misses=[];
for(const x of d.items){
 a.equal(index.registries[x.ordinal-1].path,x.registryPath);
 a.equal(index.registries[x.ordinal-1].registeredRecords,x.sourceCount);
 a.equal(sha(x.registryPath),x.registryBlobSha);a.equal(sha(x.tracePath),x.traceBlobSha);
 const src=read(x.registryPath).sources,t=read(x.tracePath),refs=new Set(t.rules.flatMap(r=>r.sourceIds||[]));a.equal(src.length,x.sourceCount);a.deepEqual(src.map(s=>s.id),x.sourceIds);
 for(const id of refs)a.ok(src.some(s=>s.id===id),'悬空引用 '+id);
 const orphan=src.filter(s=>!refs.has(s.id)).map(s=>s.id);a.deepEqual(orphan,x.unreferencedInOriginalSameNameTrace);
 for(const s of src){a.ok(!seen.has(s.id),'重复来源ID '+s.id);seen.add(s.id);if(Array.isArray(s.rules)&&s.rules.length)inline++;}
 n+=src.length;c+=src.length-orphan.length;misses.push(...orphan);
}
a.equal(n,91);a.equal(c,90);a.equal(inline,0);a.deepEqual(misses,['SRC-U402-S02']);a.equal(d.externalPagesActuallyReopened.length,10);
a.ok(sup.rules[0].sourceIds.includes('SRC-U402-S02'));a.equal(sup.originalSourceBlobSha,d.items.find(x=>x.registryPath==='research/sources/U4-02.json').registryBlobSha);
a.ok(matrix.workPackages.find(x=>x.id==='U4-02').directOriginalCapabilities.includes('CAP-04-01'));
function decide(i){
 const u=i.ui,s=i.session;
 if(!(u.fontPx>0&&u.fontPx<=12&&u.targetW>=24&&u.targetH>=24&&u.taskPanelCount===1&&u.activeBabylonWorlds===1&&u.modalRole==='dialog'&&u.modalLabelled&&u.focusInside&&u.focusVisible&&u.notEntirelyObscured&&u.focusOrderPreserved&&u.keyboardOperable&&u.escAction==='CANCEL_NAVIGATION'&&['LIGHT','DARK'].includes(u.theme)))return 'REJECT';
 if(u.invokerExists?(u.focusAfterClose!=='INVOKER'):(u.focusAfterClose!=='LOGICAL_FALLBACK'||!u.logicalFallback))return 'REJECT';
 if(!(s.scopeEpoch===s.currentEpoch&&s.documentHash===s.currentDocumentHash&&s.cancelled&&!s.staleReceiptShown&&s.draftPreserved&&!s.approvalCreated&&s.writeViaOwnerPort&&s.casRechecked&&s.aclRechecked&&!s.cancelAckIsWrite))return 'REJECT';
 return 'PLANNING_PASS';
}
function gate(g){if(g.kind==='PREVIEW')return 'READ_ONLY';if(g.kind==='OWNER_COMMIT'){const x=g.input;return x.acl&&x.cas&&x.scope&&x.revision&&x.hash&&x.frame&&!x.cancelled&&!x.lateAck?'COMMIT_CANDIDATE_NOT_PRODUCT_PASS':'DENY';}return g.input.nc&&g.input.d13&&g.input.d14&&g.input.d15?'HUMAN_REVIEW_REQUIRED':'BLOCK_RELEASE';}
const base=fx.cases.find(x=>x.id==='B07-P01').input;
const diff=(b,i)=>['ui','session'].reduce((n,k)=>n+Object.keys(b[k]).filter(f=>b[k][f]!==i[k][f]).length,0);
for(const x of fx.cases){a.equal(decide(x.input),x.expected,x.id);if(x.id.startsWith('B07-N'))a.equal(diff(base,x.input),1,x.id);}
for(const x of fx.gates)a.equal(gate(x),x.expected,x.id);
a.equal(fx.cases.length,28);a.equal(fx.gates.length,6);a.equal(fx.total,34);
a.equal(progress.structuralAuditedRegistries,70);a.equal(progress.structuralAuditedRegistrations,576);
console.log('B07规划：10份91来源原Blob、90原同名Trace显式、1 WCAG增量、34/34样例PASS；产品/独立消费者NOT_RUN');

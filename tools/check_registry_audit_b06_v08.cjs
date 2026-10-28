#!/usr/bin/env node
'use strict';
// B06 同名Trace显式来源边与U4-01可访问性补证的独立只读校验。真实产品NOT_RUN。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),a=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const blob=p=>{const b=fs.readFileSync(path.join(root,p));return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');};
const d=get('research/audits/REGISTRY-AUDIT-B06-2026-10-28.json'),idx=get('research/source-index.json');
const sup=get('research/traces/U4-01-accessibility-supplement-v08.json'),fx=get('docs/architecture/v0.8/registry-audit-b06-fixtures-v08.json'),m=get('docs/architecture/v0.8/cross-coverage-v08.json');
a.equal(idx.registries.length,127);a.equal(idx.registeredRecords,1075);a.equal(blob('research/source-index.json'),d.sourceIndexBlobSha);
let total=0,mapped=0,inline=0;let missing=[];const globalIds=new Set();
for(const item of d.items){
 a.equal(idx.registries[item.ordinal-1].path,item.registryPath);a.equal(idx.registries[item.ordinal-1].registeredRecords,item.sourceCount);
 a.equal(blob(item.registryPath),item.registryBlobSha);a.equal(blob(item.tracePath),item.traceBlobSha);
 const src=get(item.registryPath).sources,trace=get(item.tracePath);a.equal(src.length,item.sourceCount);
 const ids=new Set(src.map(s=>s.id)),refs=new Set(trace.rules.flatMap(r=>r.sourceIds||[]));a.equal(ids.size,src.length);
 for(const id of refs)a.ok(ids.has(id),'dangling '+id);
 let c=0,orph=[];for(const s of src){a.ok(!globalIds.has(s.id));globalIds.add(s.id);if(Array.isArray(s.rules)&&s.rules.length)inline++;if(refs.has(s.id)){mapped++;c++;}else orph.push(s.id);}
 a.equal(c,item.sameNameTraceSourceIdCount);a.deepEqual(orph,item.missingInOriginalSameNameTrace);total+=src.length;
}
a.equal(total,92);a.equal(mapped,91);a.equal(inline,0);a.deepEqual(d.sameNameTraceOrphans,[{registryPath:'research/sources/U4-01.json',id:'SRC-U401-S01'}]);
a.equal(sup.rules[0].sourceIds[0],'SRC-U401-S01');a.ok(m.workPackages.find(x=>x.id==='U4-01').directOriginalCapabilities.includes('CAP-01-07'));
function ui(i){if(!(i.font>0&&i.font<=12&&i.focus&&i.keyboard&&i.taskPanels===1&&i.activeBabylonScenes===1&&i.ownerPort&&i.exactRevisionHashFrame&&i.cancelEpochMatch))return 'REJECT';if(!(i.width>0&&i.height>0))return 'REJECT';if(i.width<24||i.height<24)return(['spacing','equivalent','inline','user_agent_control','essential'].includes(i.exception)&&typeof i.exceptionEvidence==='string'&&i.exceptionEvidence.length>8)?'HUMAN_REVIEW_REQUIRED':'REJECT';return 'PLANNING_PASS';}
function gate(g){return g.kind==='PREVIEW'?'READ_ONLY':g.kind==='OWNER_COMMIT'?(g.input.acl&&g.input.cas&&g.input.scope&&g.input.revision&&g.input.hash&&g.input.frame&&!g.input.cancelled&&!g.input.lateAck?'COMMIT_CANDIDATE_NOT_PRODUCT_PASS':'DENY'):(g.input.nc&&g.input.d13&&g.input.d14&&g.input.d15?'HUMAN_REVIEW_REQUIRED':'BLOCK_RELEASE');}
for(const c of fx.cases)a.equal(ui(c.input),c.expected,c.id);
for(const g of fx.gates)a.equal(gate(g),g.expected,g.id);
a.equal(fx.total,29);a.equal(fx.cases.length,19);a.equal(fx.gates.length,10);
console.log('B06: 92来源ID、91原同名Trace边、1增量WCAG证据、29/29设计样例PASS；产品/NC/GUI NOT_RUN');

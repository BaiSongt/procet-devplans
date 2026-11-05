#!/usr/bin/env node
"use strict";
// B75规划只读检查：没有NC、机床、数据库或浏览器写入。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function judge(x){const {sources:s,execution:e,math:m,gate:g,chain:c,ui:u,migration:q}=x;
if(g.expectedSetupRev!==s.setupRev||g.expectedExecRev!==e.rev||g.expectedCadHash!==s.cadHash||g.expectedStockHash!==s.stockHash||g.scope!==g.expectedScope||g.scopeEpoch!==g.receiptEpoch||g.permissionEpoch!==g.receiptPermissionEpoch||g.cancelled)return "STALE";
if(!g.acl||!g.cas||e.g10P!==1||e.wcsSelected!=="G54"||e.wcsEntry!=="G54"||!e.g10WritesButDoesNotSelect||!e.offsetAppliedAfterRotation||!e.g53OnlyCurrentBlock||c.d04WroteControllerOffset||c.d16!=="BLOCKED"||c.clPlaybackPass||u.engines!==1||u.scenes!==1||u.canvases!==1||u.panel!=="UnifiedTaskPanel"||!u.previewOnly||!["GUI","CLI","Agent"].every(z=>u.channels.includes(z))||!q.oldReader||q.newReader===false||!q.freezeUnchanged||!q.rollbackRef||q.legacyUnknown)return "REJECT";
if(!s.cadRev||!s.cadHash||!s.stockRev||!s.stockHash||!s.setupRev||!s.setupHash||!s.setupFrame||!s.occurrence||!s.stockFrame||!s.unit||!e.owner||!e.rev||!e.hash||!e.frame||!e.dialect||!e.version||!e.toolMeasureEvidence||!c.d10BindingOwner||e.offsetRegistersKnown==null||e.persistenceKnown==null||!m.reported||q.newReader==null)return "UNKNOWN";
if(e.dialect!=="LinuxCNC"||e.version!=="2.9"||!e.offsetRegistersKnown||!e.persistenceKnown)return "UNKNOWN";
if((e.g52!==null&&e.g92!==null)||(e.g52===null&&e.g92===null))return "REJECT";
if(e.owner!=="D10"||c.d10BindingOwner!=="D10"||c.d13!=="UNKNOWN"||c.d14!=="NOT_RUN"||c.d15!=="NOT_RUN"||s.unit!=="mm")return "REJECT";
const rad=m.rotationDeg*Math.PI/180,co=Math.cos(rad),si=Math.sin(rad),p=m.point,o=m.machineOrigin,a=e.g52??e.g92;
const post=[o[0]+co*p[0]-si*p[1]+a[0],o[1]+si*p[0]+co*p[1]+a[1]],pre=[o[0]+co*(p[0]+a[0])-si*(p[1]+a[1]),o[1]+si*(p[0]+a[0])+co*(p[1]+a[1])];
if(![...post,...pre].every(Number.isFinite)||post.some((n,i)=>Math.abs(n-m.reported[i])>1e-9)||pre.every((n,i)=>Math.abs(n-m.reported[i])<1e-9))return "REJECT";return "CANDIDATE_ONLY";}
function applyPatch(src,patch){const v=JSON.parse(JSON.stringify(src));for(const [k,val] of Object.entries(patch)){const [a,b]=k.split(".");v[a][b]=val;}return v;}
const root=path.resolve(__dirname,"..");
const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-04-02-offset-evidence-b75.json"),"utf8"));
const t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-04-02-offset-evidence-b75-v08.json"),"utf8"));
const f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-04-02/offset-evidence-b75-fixtures-v08.json"),"utf8"));
assert.equal(s.sources.length,6);assert.equal(t.rules.length,8);assert.equal(f.total,24);assert.equal(f.cases.length,24);
const srcIds=new Set(s.sources.map(x=>x.id)),caseIds=new Set(f.cases.map(x=>x.id));assert.equal(caseIds.size,24);
for(const r of t.rules){assert.ok(r.sourceIds.length&&r.sourceIds.every(z=>srcIds.has(z)));const own=f.cases.filter(c=>c.ruleId===r.id);assert.equal(own.length,3);assert.ok(own.some(c=>c.expected==="CANDIDATE_ONLY"));assert.ok(own.some(c=>c.expected!=="CANDIDATE_ONLY"));assert.ok(own.every(c=>r.caseIds.includes(c.id)));}
for(const c of f.cases)assert.equal(judge(applyPatch(f.base,c.patch)),c.expected,c.id);
console.log("B75规划合成 24/24 PASS（8候选/8拒绝/5未知/3过期）；真实NC/OEM/17消费者 NOT_RUN");

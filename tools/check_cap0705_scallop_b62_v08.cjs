'use strict'; // Procet B62 中文规划层校验，不得当作NC实机认证
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const F=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/capabilities/CAP-07-05/scallop-b62-fixtures-v08.json'),'utf8'));
const T=JSON.parse(fs.readFileSync(path.join(__dirname,'../research/traces/CAP-07-05-scallop-b62-v08.json'),'utf8'));
const S=JSON.parse(fs.readFileSync(path.join(__dirname,'../research/sources/CAP-07-05-scallop-b62.json'),'utf8'));
function judge(q){const {owner:o,geometry:g,stage:s,quality:y,execution:e,ui:u,legacy:l}=q;
if(o.cancelled||o.rev!==o.currentRev||o.hash!==o.currentHash||o.frame!==o.currentFrame||o.scopeEpoch!==o.currentScopeEpoch||o.taskGeneration!==o.receiptGeneration||s.d07Hash!==s.previousOutputHash)return {status:'STALE'};
if(o.acl!=='ALLOW'||g.unit!=='mm'||![g.radiusMm,g.stepoverMm,g.targetCuspMm].every(Number.isFinite)||g.radiusMm<=0||g.stepoverMm<=0||g.stepoverMm>2*g.radiusMm||g.targetCuspMm<0)return {status:'REJECT'};
if(!s.d08FrozenUnchanged||!s.sameABFact||s.materialSweepClaim||s.d10CopiedToD04||!s.d09Neutral||s.d04Frame!==o.currentFrame||g.stepoverBasis!=='TANGENT_ARC_LENGTH'||u.engineCount!==1||u.sceneCount!==1||u.canvasCount!==1||u.panel!=='LEFT'||u.fontMaxPx>12||u.port!=='D09.StageFinishPort'||u.entries.length!==3||!['GUI','CLI','AGENT'].every(v=>u.entries.includes(v))||!l.readOnly||!l.rollbackAsNewRevision)return {status:'REJECT'};
if(y.raPassClaim||y.dimensionalPassClaim||y.cuspAsMeasuredPass||e.clAsD15||e.d15PassClaim||e.d16ReleaseClaim||e.unknownPassClaim)return {status:'REJECT'};
if(g.contactModel!=='BALL_ON_PLANE'||g.contactEvidence!=='EXACT'||g.toolType!=='BALL_NOSE'||!g.metricCertified||!g.normalDefined||!s.stockSealed||!s.protectedKnown||e.controllerUnknown)return {status:'UNKNOWN'};
const h=g.radiusMm-Math.sqrt(g.radiusMm*g.radiusMm-g.stepoverMm*g.stepoverMm/4);return {status:h<=g.targetCuspMm+1e-12?'LOCAL_SCALLOP_CANDIDATE':'REJECT',cuspMm:h};}
const ids=new Set(),counts={};for(const x of F.cases){assert.ok(!ids.has(x.id),'duplicate '+x.id);ids.add(x.id);const q=JSON.parse(JSON.stringify(F.base));for(const [p,val]of Object.entries(x.edits)){const k=p.split('.');assert.ok(k[1] in q[k[0]],p);q[k[0]][k[1]]=val;}const out=judge(q);assert.equal(out.status,x.expected,x.id);if('goldenCuspMm' in x)assert.ok(Math.abs(out.cuspMm-x.goldenCuspMm)<1e-12,x.id);counts[out.status]=(counts[out.status]||0)+1;}
assert.equal(S.registeredRecords,S.sources.length);const srcIds=new Set(S.sources.map(x=>x.id));assert.equal(srcIds.size,S.sources.length);assert.equal(T.rules.length,8);
for(const r of T.rules){assert.ok(r.fields.length&&r.originalWorkPackages.length);for(const id of r.sourceIds)assert.ok(srcIds.has(id));for(const id of [...r.positiveTestIds,...r.negativeTestIds,...r.unknownTestIds])assert.ok(ids.has(id));}
console.log(JSON.stringify({status:'PASS',synthetic:true,total:F.cases.length,counts,product:'NOT_RUN',independentConsumers:'NOT_RUN'},null,2));

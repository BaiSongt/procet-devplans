#!/usr/bin/env node
'use strict';
// 仅校验规划合成案例；独立真实计量、NC、机床及跨域消费者仍NOT_RUN。
const fs=require('node:fs'),path=require('node:path');
function judgeB84(x){
const s=x?.source,t=x?.transfer,m=x?.measurement,b=x?.boundary,u=x?.ui,c=x?.command,g=x?.migration;
const h=z=>typeof z==="string"&&/^[0-9a-f]{64}$/.test(z),str=z=>typeof z==="string"&&z.trim().length>0;
if(!s||!str(s.project)||!h(s.sourceHash)||!str(s.designRevision)||!str(s.occurrence)||!str(s.frame)||!Number.isInteger(s.scopeEpoch))return "UNKNOWN_SOURCE";
if(!t||t.designRevision!==s.designRevision||t.occurrence!==s.occurrence)return "STALE_SOURCE";
if(!str(t.fromStage)||!str(t.toStage)||t.fromStage===t.toStage||!str(t.fromFrame)||!str(t.toFrame)||t.fromFrame===t.toFrame)return "REJECT_TRANSFORM_DIRECTION";
if(t.transformKind!=="COORDINATE_CHANGE")return "UNKNOWN_TRANSFORM_SEMANTIC";
if(t.unit!=="mm")return "REJECT_UNIT";
const a=t.matrix;
if(!Array.isArray(a)||a.length!==4||a.some(r=>!Array.isArray(r)||r.length!==4||r.some(v=>!Number.isFinite(v))))return "REJECT_NON_RIGID";
if(a[3].some((v,i)=>Math.abs(v-[0,0,0,1][i])>1e-10))return "REJECT_NON_RIGID";
const dot=(i,j)=>a[0][i]*a[0][j]+a[1][i]*a[1][j]+a[2][i]*a[2][j];
for(let i=0;i<3;i++)for(let j=0;j<3;j++)if(Math.abs(dot(i,j)-(i===j?1:0))>1e-8)return "REJECT_NON_RIGID";
const det=a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]);
if(Math.abs(det-1)>1e-8)return "REJECT_NON_RIGID";
if(!m||!str(m.sourceId)||!str(m.targetId)||!str(m.sourceRevision)||!str(m.targetRevision)||!h(m.sourceHash)||!h(m.targetHash)||!m.calibrationSourceExact||!m.calibrationTargetExact)return "UNKNOWN_MEASUREMENT";
if(m.sourceStatus!=="CURRENT"||m.targetStatus!=="CURRENT")return "STALE_MEASUREMENT";
if(m.sourceFrame!==t.fromFrame||m.targetFrame!==t.toFrame)return "STALE_MEASUREMENT";
if(m.modelKind!=="SCALAR_TRANSLATION")return "UNKNOWN_MODEL";
if(m.modelUnit!=="mm")return "REJECT_UNIT";
if(m.modelFrame!==t.toFrame)return "STALE_FRAME";
if(!Number.isFinite(m.uSource)||!Number.isFinite(m.uTarget)||m.uSource<0||m.uTarget<0)return "REJECT_UNCERTAINTY";
if(m.rho===null||m.rho===undefined)return "UNKNOWN_CORRELATION";
if(!Number.isFinite(m.rho)||Math.abs(m.rho)>1)return "REJECT_CORRELATION";
if(m.budgetMm===null||m.budgetMm===undefined)return "UNKNOWN_BUDGET";
if(!Number.isFinite(m.budgetMm)||m.budgetMm<0)return "REJECT_BUDGET";
if(m.budgetKind!=="SYNTHETIC_K1")return "UNKNOWN_BUDGET_POLICY";
const variance=m.uSource*m.uSource+m.uTarget*m.uTarget+2*m.rho*m.uSource*m.uTarget;
if(variance< -1e-12)return "REJECT_CORRELATION";
if(!b?.d04NominalExact)return "UNKNOWN_NOMINAL_SETUP";
if(!b.d07MaterialExact)return "UNKNOWN_MATERIAL";
if(b.d10PhysicalBinding!=="UNBOUND_CANDIDATE_ONLY"||b.copyD04ToD10)return "REJECT_BOUNDARY";
if(b.overwriteFrozenD08)return "REJECT_FROZEN";
if(b.claimD16Released||b.clAnimationAsD15)return "REJECT_FALSE_RELEASE";
if(!u||u.guiPort!=="04.MultiSetupPort"||u.cliPort!==u.guiPort||u.agentPort!==u.guiPort||u.worldCount!==1||u.taskPanel!=="LEFT_UNIFIED"||u.previewWrites)return "REJECT_UI";
if(!c||!["PREVIEW","PROPOSE_TRANSFER"].includes(c.mode))return "UNKNOWN_COMMAND";
if(c.mode==="PREVIEW")return "DISPLAY_ONLY";
if(!c.authorized)return "REJECT_PERMISSION";
if(c.expectedRevision!==c.currentRevision||c.expectedHash!==c.currentHash||!h(c.expectedHash))return "STALE_CAS";
if(c.expectedFrame!==c.currentFrame||c.expectedFrame!==t.toFrame)return "STALE_FRAME";
if(c.scopeEpoch!==c.activeScopeEpoch||c.scopeEpoch!==s.scopeEpoch)return "STALE_SCOPE";
if(c.cancelled)return "REJECT_CANCELLED";
if(c.lateAck)return "REJECT_LATE_ACK";
if(!g?.legacyReaderPreserved||!str(g.rollbackRef))return "UNKNOWN_MIGRATION";
if(g.consumerClaimsPass)return "REJECT_FAKE_PASS";
return Math.sqrt(Math.max(0,variance))>m.budgetMm+1e-12?"RISK_REVIEW_REQUIRED":"QUALIFIED_DRAFT";
}
const fixturePath=process.argv[2]||path.resolve(__dirname,"../docs/capabilities/CAP-04-05/transfer-uncertainty-b84-fixtures-v08.json");
const fixture=JSON.parse(fs.readFileSync(fixturePath,'utf8'));
function patchOne(obj,p,v){const ks=p.split('.');let o=obj;for(let i=0;i<ks.length-1;i++)o=o[/^\d+$/.test(ks[i])?Number(ks[i]):ks[i]];o[/^\d+$/.test(ks[ks.length-1])?Number(ks[ks.length-1]):ks[ks.length-1]]=v;}
function materialize(item){const x=JSON.parse(JSON.stringify(fixture.base));for(const q of item.patches)patchOne(x,q.path,q.value);return x;}
const errors=[],seen=new Set(),byRule={};let passed=0;
for(const item of fixture.cases){if(seen.has(item.id)){errors.push('duplicate-case:'+item.id);continue;}seen.add(item.id);const got=judgeB84(materialize(item));if(got!==item.expected)errors.push(item.id+': '+got+' expected '+item.expected);else passed++;byRule[item.ruleId]=(byRule[item.ruleId]||0)+1;}
for(let n=1;n<=8;n++){const id='TU84-R'+String(n).padStart(2,'0');if(!byRule[id])errors.push('uncovered-rule:'+id);}
console.log(JSON.stringify({total:fixture.cases.length,passed,errors,status:'PLANNING_SYNTHETIC_ONLY',product:'NOT_RUN'},null,2));if(errors.length)process.exitCode=1;

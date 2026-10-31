#!/usr/bin/env node
"use strict";
// B71规划合成证据校验，不代表真实仪器或D17独立消费者通过。
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const judge=function judge(o){
 if(!o||!o.spec||!o.resource||!o.obs||!o.policy||!o.tx||!o.ui||!o.evidence)return "UNKNOWN";
 const {spec:s,resource:r,obs:m,policy:p,tx:t,ui:u,evidence:e}=o;
 if(t.cancelled||t.lateAck||t.scopeExact===false||t.generationExact===false||p.revisionExact===false||m.calibrationSnapshotMatch===false||r.calibrationValid===false||m.observationExact===false)return "STALE";
 if(t.actorAuthorized!==true||t.casExact!==true||t.duplicatePayloadSame!==true||s.approved===false||s.frozen===false||p.approved===false||p.acceptedRiskOwner===""||r.capabilityOnly===false||m.sourceKind==="D03_CAPABILITY"||e.claimsD15Pass||e.claimsD16Release||e.frozenHistoryPreserved!==true||e.migrationReadersPaired!==true||e.actualIndependentConsumer!=="NOT_RUN"||e.productAcceptance!=="NOT_RUN")return "REJECT";
 if(u.sceneCount!==1||u.panel!=="LEFT_UNIFIED"||u.port!=="MeasurementReviewPort"||u.writesD17!==false||u.directEntry!=="DOMAIN_USECASE"||u.displayOnly!==true)return "REJECT";
 if(p.decisionRule!=="INTERVAL_CONTAINMENT_V1"&&p.decisionRule!=null)return "REJECT";
 if(s.unit!=null&&s.unit!=="mm"||m.unit!=null&&m.unit!=="mm"||s.lowerMm>s.upperMm||[m.ucMm,m.expandedUMm,m.coverageFactor].some(x=>typeof x==="number"&&x<0)||m.coverageFactor===0)return "REJECT";
 const valid=x=>typeof x==="string"&&/^sha256:[a-f0-9]{64}$/.test(x);
 if(!valid(s.hash)||!valid(r.hash)||!valid(m.hash)||!valid(p.hash)||!s.revision||!r.revision||!m.revision||!p.revision||!p.decisionRule||!p.acceptedRiskOwner||t.receiptKnown!==true)return "UNKNOWN";
 if(s.approved!==true||s.frozen!==true||r.capabilityOnly!==true||r.measurementCapability!==true||r.calibrationValid!==true||m.sourceKind!=="D17_MEASURED_RESULT"||!m.methodEvidence||!m.uncertaintyBudgetRef||!m.observationExact||!m.calibrationSnapshotMatch||p.revisionExact!==true||p.approved!==true)return "UNKNOWN";
 if(s.frameRef!==m.frameRef||!s.frameRef)return "UNKNOWN";
 const f=[s.lowerMm,s.upperMm,m.valueMm,m.ucMm,m.expandedUMm,m.coverageFactor];
 if(f.some(x=>typeof x!=="number"||!Number.isFinite(x)))return "UNKNOWN";
 if(m.coverageFactor<=0||m.ucMm<0||m.expandedUMm<0||Math.abs(m.expandedUMm-m.ucMm*m.coverageFactor)>1e-9)return "REJECT";
 const lo=m.valueMm-m.expandedUMm,hi=m.valueMm+m.expandedUMm,eps=1e-10;
 if(lo>=s.lowerMm-eps&&hi<=s.upperMm+eps)return "CANDIDATE_CONFORMING";
 if(hi<s.lowerMm-eps||lo>s.upperMm+eps)return "CANDIDATE_NONCONFORMING";
 return "INDETERMINATE";
};
const patched=function patched(o,items){const v=JSON.parse(JSON.stringify(o));for(const it of items){const a=it.path.split(".");let d=v;for(const k of a.slice(0,-1))d=d[k];d[a.at(-1)]=it.value;}return v;};
const sources=read("research/sources/CAP-02-06-uncertainty-guard-b71.json"),traces=read("research/traces/CAP-02-06-uncertainty-guard-b71-v08.json"),fixtures=read("docs/capabilities/CAP-02-06/uncertainty-guard-b71-fixtures-v08.json");
if(!fixtures.syntheticOnly||sources.registeredRecords!==sources.sources.length||traces.rules.length!==8)throw Error("基础元数据异常");
const idSet=new Set(sources.sources.map(x=>x.id)),cmap=new Map(fixtures.cases.map(x=>[x.id,x]));
if(idSet.size!==sources.sources.length||cmap.size!==fixtures.cases.length)throw Error("ID重复");
for(const r of traces.rules){if(!r.sourceIds.every(id=>idSet.has(id))||!r.fields.length||!r.originalWorkPackages.length||!r.assets.length)throw Error("来源/字段/包失败 "+r.id);if(!r.acceptanceIds.every(id=>cmap.has(id)))throw Error("验收映射丢失 "+r.id);if(!r.acceptanceIds.some(id=>cmap.get(id).expected==="CANDIDATE_CONFORMING")||!r.acceptanceIds.some(id=>cmap.get(id).expected!=="CANDIDATE_CONFORMING"))throw Error("缺正反 "+r.id);}
const tally={};for(const c of fixtures.cases){if(!traces.rules.some(r=>r.id===c.ruleId&&r.acceptanceIds.includes(c.id)))throw Error("孤儿 "+c.id);const got=judge(patched(fixtures.base,c.patches));if(got!==c.expected)throw Error(c.id+" actual="+got+" expected="+c.expected);tally[got]=(tally[got]||0)+1;}
// 以整数微米进行第二份纯数学Golden，不能冒称独立质量消费者。
for(let i=1;i<=6;i++){const c=cmap.get("B71-M"+String(i).padStart(2,"0")),o=patched(fixtures.base,c.patches),q=x=>Math.round(x*1000),y=q(o.obs.valueMm),U=q(o.obs.expandedUMm),L=q(o.spec.lowerMm),H=q(o.spec.upperMm);const got=y-U>=L&&y+U<=H?"CANDIDATE_CONFORMING":y+U<L||y-U>H?"CANDIDATE_NONCONFORMING":"INDETERMINATE";if(got!==c.expected)throw Error("微米Golden "+c.id);}
console.log(JSON.stringify({level:"PLANNING_SYNTHETIC_ONLY",total:fixtures.cases.length,tally,integerMicrometerGoldens:6,realConsumer:"NOT_RUN",product:"NOT_RUN"}));

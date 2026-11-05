#!/usr/bin/env node
"use strict";
// B157：规划合成校验器；不执行真实OCCT/NC/机床连续碰撞测试。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
function judge(id,d){switch(id){
case "B157-R01":return ["d09Hash","fixtureHash","profileHash"].every(k=>/^sha256:[0-9a-f]{64}$/.test(d[k]||""))&&d.frameExact==="D10@r9:machine";
case "B157-R02":return d.occtIsDone===true&&Number.isFinite(d.occtDistanceMm)&&d.occtDistanceMm>=0&&Number.isFinite(d.occtDeflectionMm)&&d.occtDeflectionMm>=0&&d.occtDeflectionMm<=.01&&d.closedGeometryQualified===true;
case "B157-R03":return [d.minSampleMm,d.lipschitzMmPerParam,d.maxHalfGapParam,d.lowerBoundMm].every(Number.isFinite)&&d.minSampleMm>0&&d.lipschitzMmPerParam>=0&&d.maxHalfGapParam>=0&&d.lowerBoundMm>0&&d.lowerBoundMm<=d.minSampleMm-d.lipschitzMmPerParam*d.maxHalfGapParam+1e-12;
case "B157-R04":return [d.linearRateMmPerParam,d.angularRateRadPerParam,d.radiusMm,d.motionBoundMmPerParam].every(Number.isFinite)&&d.linearRateMmPerParam>=0&&d.angularRateRadPerParam>=0&&d.radiusMm>=0&&d.motionBoundMmPerParam>=d.linearRateMmPerParam+d.angularRateRadPerParam*d.radiusMm-1e-12;
case "B157-R05":return [d.clearanceLowerBoundMm,d.modelErrorMm,d.numericErrorMm,d.policyMarginMm].every(Number.isFinite)&&d.modelErrorMm>=0&&d.numericErrorMm>=0&&d.policyMarginMm>0&&d.clearanceLowerBoundMm>=d.modelErrorMm+d.numericErrorMm+d.policyMarginMm-1e-12;
case "B157-R06":return d.checkTier==="CL_PRECHECK_ONLY"&&d.finalNcReparsed===false&&d.d15Status==="NOT_RUN"&&d.d16Eligible===false;
case "B157-R07":return d.ownerPort==="D11_CL_PRECHECK_PORT"&&d.channels==="GUI_CLI_AGENT"&&d.oneWorldLeftPanel===true&&d.casAclCancelRecheck===true;
case "B157-R08":return d.changedD10MarksStale===true&&d.frozenD08Unchanged===true&&d.legacyUnknownReadOnly===true&&d.independentD15Needed===true;
default:return false;
}}
function computeGolden(g){let x=g.input;return g.kind==="LOWER"?x.a-x.b*x.c:g.kind==="MOTION"?x.a+x.b*x.c:g.kind==="MARGIN"?x.a-x.b-x.c-x.d:NaN}
function verifyAll(s,t,f){if(s.records.length!==6||t.rules.length!==8||f.cases.length!==40||f.goldens.length!==8)throw Error("count");const seen=new Set();for(const rule of t.rules){if(rule.fields.length!==4||rule.sourceIds.some(a=>!s.records.some(b=>a===b.id)))throw Error("mapping");const pos=f.cases.find(c=>c.id===rule.id+"-P");if(!pos||pos.expect!=="PASS"||!judge(rule.id,pos.record))throw Error("pos "+rule.id);for(let i=0;i<4;i++){const neg=f.cases.find(c=>c.id===rule.id+"-N"+(i+1));if(!neg||neg.expect!=="FAIL"||neg.mutatedField!==rule.fields[i]||judge(rule.id,neg.record))throw Error("neg "+rule.id);const diffs=Object.keys(pos.record).filter(k=>JSON.stringify(pos.record[k])!==JSON.stringify(neg.record[k]));if(diffs.length!==1||diffs[0]!==rule.fields[i])throw Error("not_single "+neg.id)}for(const id of rule.testIds){if(seen.has(id)||!f.cases.some(c=>c.id===id))throw Error("trace");seen.add(id)}}for(const g of f.goldens){if(!Number.isFinite(g.expected)||Math.abs(computeGolden(g)-g.expected)>1e-10)throw Error("golden")}return {status:"PASS_PLANNING_SYNTHETIC_ONLY",positive:8,negative:32,golden:8,total:48}}
if(require.main===module)console.log(JSON.stringify(verifyAll(read("research/sources/CAP-09-05-interval-clearance-b157.json"),read("research/traces/CAP-09-05-interval-clearance-b157-v08.json"),read("docs/capabilities/CAP-09-05/interval-clearance-b157-fixtures-v08.json"))));

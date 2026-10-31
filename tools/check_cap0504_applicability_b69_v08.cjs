#!/usr/bin/env node
'use strict';
// 本工具只验证工艺模板V0.8的规划合成输入，绝不代表NC/OEM认证。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const fixture=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-05-04/applicability-b69-fixtures-v08.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-05-04-applicability-b69-v08.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-05-04-applicability-b69.json'),'utf8'));
const judge=function judge(o){
const bad="REJECT",stale="STALE",na="NOT_APPLICABLE",unknown="UNKNOWN",candidate="CANDIDATE_ONLY";
if(!o||!o.template||!o.context||!o.owner||!o.view||!o.execution)return bad;
const {template:t,context:c,owner:w,view:v,execution:e}=o;
if(t.scope!==c.scope||t.lifecycle!=="APPROVED"||w.templateApprovalExact!==true)return bad;
if(!t.id||!t.revision||!t.schemaVersion||!/^sha256:[a-f0-9]{64}$/.test(t.hash||""))return bad;
if(!w.aclWrite||w.cancelled||w.port!=="Domain05.ProcessTemplateDomainPort"||[w.uiPort,w.cliPort,w.agentPort].some(x=>x!==w.port))return bad;
if(v.babylonSceneCount!==1||!v.leftUnifiedTaskPanel||v.maxFontPx>12||!["light","dark"].includes(v.theme)||v.previewOnly!==true)return bad;
if(!e.d04NominalOnly||e.d10PhysicalBindingInherited||e.d13UnknownMayPass||e.d15ValidationInherited||e.d16ReleaseInherited||c.originalD12NcInherited||!c.frozenD08Preserved)return bad;
if(w.expectedHead!==w.currentHead||w.scopeEpoch!==w.currentScopeEpoch||w.taskGeneration!==w.ackGeneration||!w.dependencyHashesCurrent)return stale;
const refs=[c.d01Exact,c.d02Exact,c.d03Exact,c.d04Exact];
if(refs.some(x=>!x||!x.id||!x.revision||!x.frameId||!/^sha256:[a-f0-9]{64}$/.test(x.hash||"")))return unknown;
if(c.frameGraphProof!=="EXACT"||!c.occurrencePath)return unknown;
const qs=[["material","material"],["featureClass","featureClass"],["processKind","processKind"],["slotId","slotId"]];
for(const [key,rkey] of qs){if(c[key]===null||c[key]===undefined||c[key]==="")continue; if(c[key]!==t.required[rkey])return na;}
if(Array.isArray(c.machineCapabilities)&&!c.machineCapabilities.includes(t.required.machineCapability))return na;
if(qs.some(([k])=>c[k]==null||c[k]==="")||!Array.isArray(c.machineCapabilities))return unknown;
const quantity=(x)=>{if(!x||x.dimension!=="LENGTH"||typeof x.value!=="number"||!Number.isFinite(x.value)||x.value<=0)return null;return x.unit==="mm"?x.value:x.unit==="in"?x.value*25.4:null;};
const d=quantity(c.diameter),s=quantity(c.stepOver);
if(d===null||s===null)return unknown;
if(d<t.diameterRangeMm[0]||d>t.diameterRangeMm[1]||s>t.maxStepOverMm)return na;
return candidate;
};
const expectedSources=new Set(sources.references.map(x=>x.id));
const expectedCases=new Set(fixture.cases.map(x=>x.id));
assert.equal(sources.references.length,sources.registeredRecords);
assert.equal(trace.ruleCount,trace.rules.length);
assert.equal(new Set(fixture.cases.map(x=>x.id)).size,fixture.cases.length);
for(const r of trace.rules){assert.equal(r.capabilityId,fixture.capabilityId);for(const id of r.sourceIds)assert(expectedSources.has(id),'来源未登记 '+id);for(const id of r.caseIds)assert(expectedCases.has(id),'验收ID未登记 '+id);}
let passed=0;const counts={};
for(const t of fixture.cases){const actual=judge(t.input);assert.equal(actual,t.expected,t.id+': '+t.comment);counts[actual]=(counts[actual]||0)+1;passed++;}
assert.equal(fixture.inchToMmExact,25.4);assert.equal(0.5*25.4,12.7);assert.equal(1*25.4,25.4);
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_PASS_NOT_PRODUCT',passed,total:fixture.cases.length,counts,realNc:'NOT_RUN',realConsumer:'NOT_RUN'},null,2));

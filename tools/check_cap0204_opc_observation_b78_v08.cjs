#!/usr/bin/env node
"use strict";
// 只读规划校验；不连接OPC服务器、不驱动物理夹具或NC。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function judge(x){const r=x.resource,p=x.setup,e=x.execution,s=x.sensor,g=x.gate,a=x.assessment,u=x.ui,m=x.migration;
if(r.revision!==g.expectedRevision||g.currentRevision!==g.expectedRevision||p.resourceRevision!==r.revision||e.bindingResourceHash!==r.hash||g.expectedScope!==g.currentScope||g.taskGen!==g.receiptGen||g.cancelled||g.lateAck)return"STALE";
if(!r.published||!g.acl||!g.cas||g.port!=="02.WorkholdingPort"||r.id!==e.fixtureId||e.machineId!==s.machineId||e.fixtureId!==s.fixtureId||p.frame!=="WF-r8"||s.sourceSystem!=="OPC_UA"||s.signalKind!=="PHYSICAL_FEEDBACK"||s.polarity!=="CLOSED_TRUE"||a.safetyClaim||a.d15==="PASS"||a.d16!=="BLOCKED"||u.sceneCount!==1||u.panel!=="UnifiedTaskPanel"||u.fontMaxPx>12||u.previewPersists||!["GUI","CLI","Agent"].every(v=>u.channels.includes(v))||!m.oldReader||!m.newReader||!m.rollbackSafe||!m.freezeUnchanged||m.abOverwrite)return"REJECT";
if(e.actualInstalled==null||!r.ratedSource||!e.profile||!s.nodeId||!s.provenanceHash||s.value==="UNKNOWN"||s.serviceResult==null||s.operationResult==null||s.dataValueStatus==null)return"UNKNOWN";
if(e.actualInstalled!==true||s.serviceResult==="BAD"||s.operationResult==="BAD")return"REJECT";
if(s.serviceResult!=="GOOD"||s.operationResult!=="GOOD"||s.dataValueStatus!=="GOOD"||s.value!=="CLOSED")return"UNKNOWN";
if(!Number.isFinite(s.maxAgeMs)||s.maxAgeMs<=0||!Number.isFinite(s.clockUncertaintyMs)||s.clockUncertaintyMs<0)return"UNKNOWN";
const a0=Date.parse(s.sourceTimestamp),a1=Date.parse(s.observedAt);if(!Number.isFinite(a0)||!Number.isFinite(a1))return"UNKNOWN";
if(a1-a0< -s.clockUncertaintyMs)return"UNKNOWN";
if(a1-a0+s.clockUncertaintyMs>s.maxAgeMs)return"STALE";
if(a.d13!=="UNKNOWN"||a.d14!=="NOT_RUN"||a.d15!=="NOT_RUN")return"UNKNOWN";
return u.displayOnly?"DISPLAY_ONLY":"OBSERVATION_CANDIDATE";}
function apply(x,d){let y=JSON.parse(JSON.stringify(x));for(const item of d){let a=item.path.split("."),z=y;for(let k of a.slice(0,-1))z=z[k];z[a.at(-1)]=item.value;}return y;}
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const f=read("docs/capabilities/CAP-02-04/opc-observation-b78-fixtures-v08.json"),t=read("research/traces/CAP-02-04-opc-observation-b78-v08.json"),s=read("research/sources/CAP-02-04-opc-observation-b78.json");
assert.equal(f.total,32);assert.equal(f.cases.length,32);assert.equal(t.rules.length,8);assert.equal(s.sources.length,7);
const ids=new Set(s.sources.map(x=>x.id)),caseIds=new Set(f.cases.map(x=>x.id));assert.equal(caseIds.size,32);assert.equal(ids.size,7);
for(const r of t.rules){assert.equal(r.caseIds.length,4);for(const id of r.sourceIds)assert.ok(ids.has(id));for(const id of r.caseIds)assert.ok(caseIds.has(id));}
for(const c of f.cases){assert.equal(judge(apply(f.base,c.delta)),c.expected,c.id);assert.ok(t.rules.find(r=>r.id===c.ruleId)?.caseIds.includes(c.id));assert.ok(c.delta.length<=1);}
console.log("B78同判定函数规划合成32/32 PASS；真实OPC/机床/独立消费者NOT_RUN");

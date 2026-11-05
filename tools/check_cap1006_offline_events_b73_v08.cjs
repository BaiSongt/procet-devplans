#!/usr/bin/env node
"use strict";
// B73只读规划验收；不调用设备、ERP/MES或产品接口。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function judge(x){const i=x.identity,e=x.event,v=x.evidence,g=x.gate;
if(i.frame!==i.expectedFrame||i.d12Hash!==i.expectedD12Hash||i.d16Hash!==i.expectedD16Hash||e.producerEpoch!==e.expectedEpoch||g.ownerRev!==g.expectedRev||g.scopeEpoch!==g.expectedEpoch||g.generation!==g.ackGeneration||g.cancelled||g.lateAck)return "STALE";
if(!g.acl||!g.cas||g.remoteStart||g.port!=="WorkOrderExecutionPort"||g.sceneCount!==1||g.panel!=="UnifiedTaskPanel"||g.previewWrites||!g.channels.includes("GUI")||!g.channels.includes("CLI")||!g.channels.includes("Agent")||!g.oldReader||!g.newReader||!g.freeze||g.abOverwrite)return "REJECT";
if(i.tenant!=="A"||i.plant!=="P1"||i.jobId!=="W1"||i.mesRevision!=="r2"||i.machine!=="M1"||!e.source||!e.id||!(/^[a-f0-9]{64}$/.test(e.payloadHash))||!["Store","NONE"].includes(e.opcMethod))return "REJECT";
if(e.seenHash!==null)return e.seenHash===e.payloadHash?"DUPLICATE_NOOP":"REJECT";
if(!e.schemaMapped||!(/^(0|[1-9][0-9]*)$/.test(e.seq))||!(/^(0|[1-9][0-9]*)$/.test(e.lastSeq)))return "UNKNOWN";
if(BigInt(e.seq)!==BigInt(e.lastSeq)+1n)return "GAP_HOLD";
if(e.type==="JOB_DONE"&&(e.jobState!=="Ended"||!v.jobResponse))return "UNKNOWN";
if(!["JOB_DONE","CYCLE_START","INSTRUCTION_RECEIVED"].includes(e.type)||!v.persisted||v.receiptKind!=="BUSINESS_COMMIT")return "UNKNOWN";
if(e.type==="JOB_DONE"&&(!v.cycle||!v.quality||!v.mes))return "UNKNOWN";
return g.previewOnly?"DISPLAY_ONLY":"CANDIDATE_ONLY";}
const root=path.resolve(__dirname,"..");const f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-10-06/offline-events-b73-fixtures-v08.json"),"utf8"));
const t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-10-06-offline-events-b73-v08.json"),"utf8"));
const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-10-06-offline-events-b73.json"),"utf8"));
assert.equal(s.sources.length,7);assert.equal(t.rules.length,8);const srcIds=new Set(s.sources.map(x=>x.id));
for(const r of t.rules){assert.ok(r.sourceIds.every(x=>srcIds.has(x)));assert.ok(r.fields.length>=3);assert.equal(r.caseIds.length,f.cases.filter(x=>x.ruleId===r.id).length);}
for(const c of f.cases)assert.equal(judge(c.input),c.expected,c.id);assert.equal(f.total,f.cases.length);
for(const [k,v] of Object.entries(f.counts))assert.equal(v,f.cases.filter(c=>c.kind===k).length);
console.log("B73同函数规划合成 "+f.total+"/"+f.total+" PASS；独立消费者/NC/机床NOT_RUN");

#!/usr/bin/env node
"use strict";
// 规划合成检查；绝不连接机床、签名服务或任何产品仓。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=read("research/sources/CAP-10-04.json"),t=read("research/traces/CAP-10-04.json"),f=read("docs/capabilities/CAP-10-04/fixtures.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
function gate(g){if(!g.authorized||!g.approvedD16||!g.exactMachine||!g.exactProfile||!g.d10Exact||!g.hashMatched||g.cancelled||g.autoRun||g.controllerCommand!=="STAGE_ONLY")return "REJECT";if(g.lateAck)return "STALE";if(!g.online||!g.semanticsKnown||!g.stagingComplete||!g.readback||!g.independentD15)return "UNKNOWN";return "STAGED_AWAITING_HUMAN";}
assert.equal(t.rules.length,10);assert.equal(src.registeredRecords,10);assert.equal(new Set(src.sources.map(s=>s.id)).size,10);
const ids=new Set(src.sources.map(s=>s.id)),rules=new Map(t.rules.map(r=>[r.id,r]));assert.equal(rules.size,10);
for(const r of t.rules){assert.equal(r.criteria.length,4);for(const s of r.sourceIds)assert(ids.has(s),s);assert(r.workPackages.includes("E3-06")&&r.workPackages.includes("T5-03"));assert.equal(r.fields.length,4);}
assert.equal(f.cases.length,50);assert.equal(f.gateCases.length,18);let count=0;
for(const c of f.cases){const r=rules.get(c.ruleId);assert(r,c.ruleId);const actual=r.criteria.every(x=>x.op==="eq"&&get(c.input,x.path)===x.value)?"PASS":"REJECT";assert.equal(actual,c.expected,c.id);if(c.mutatedField){assert(r.fields.includes(c.mutatedField));assert.deepEqual(r.fields.filter(x=>get(c.input,x)!==true),[c.mutatedField]);}count++;}
for(const c of f.gateCases){assert.equal(gate(c.input),c.expected,c.id);count++;}
assert.equal(count,68);console.log("CAP-10-04: 68/68 规划合成PASS；真实机床/消费者/NC/签名均NOT_RUN");

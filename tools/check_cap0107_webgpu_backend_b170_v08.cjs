#!/usr/bin/env node
"use strict";
// 仅静态规划验证，不触及真实GPU、产品仓与网络。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const src=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-01-07-webgpu-backend-b170.json"),"utf8"));
const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-01-07-webgpu-backend-b170-v08.json"),"utf8"));
const data=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-01-07/webgpu-backend-b170-fixtures-v08.json"),"utf8"));
assert.equal(src.records.length,7);assert.equal(trace.rules.length,8);assert.equal(data.cases.length,40);assert.equal(data.golden.length,8);
const fields=trace.rules.flatMap(r=>r.fields);assert.equal(new Set(fields).size,32);
function truth(k){return k==="boot.engineCount"||k==="boot.leftTaskPanelCount"?1:true;}
function valid(x){return fields.every(k=>{const[a,b]=k.split(".");return x[a]?.[b]===truth(k);});}
for(const r of trace.rules){assert.equal(r.fields.length,4);for(const id of r.sourceIds)assert(src.records.some(s=>s.id===id));for(const id of r.testIds)assert(data.cases.some(c=>c.id===id));}
for(const c of data.cases){assert.equal(valid(c.state),c.expected,c.id);if(c.kind==="single_field_negative"){const diff=fields.filter(k=>{const[a,b]=k.split(".");return c.state[a][b]!==data.baseline[a][b]});assert.deepEqual(diff,[c.changedField],c.id);}}
function step(s,e,v){if(v==="INIT_WEBGPU"&&s==="SELECTING")return{state:"WEBGPU_READY",epoch:e,adopt:false};if(v==="NO_ADAPTER"&&s==="SELECTING")return{state:"WEBGL_READY",epoch:e,adopt:false};if(v==="DEVICE_LOST"&&s==="WEBGPU_READY")return{state:"READ_ONLY_LOST",epoch:e+1,adopt:false};if(v==="FULL_REBUILD"&&s==="READ_ONLY_LOST")return{state:"WEBGL_READY",epoch:e+1,adopt:false};return{state:s,epoch:e,adopt:false};}
for(const g of data.golden)assert.deepEqual(step(g.input.state,g.input.epoch,g.input.event),g.expected,g.id);
console.log("B170合成48/48 PASS；独立真实WebGPU/Owner/NC NOT_RUN");

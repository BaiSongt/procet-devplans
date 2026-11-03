#!/usr/bin/env node
// B151只读规划校验。非NC解释器、非D15工程验证。
"use strict";const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const fx=read("docs/capabilities/CAP-09-08/playback-clock-b151-fixtures-v08.json"),tr=read("research/traces/CAP-09-08-playback-clock-b151-v08.json"),so=read("research/sources/CAP-09-08-playback-clock-b151.json");
function display(g){if(g.missing)return{status:"UNKNOWN",time:null};if(g.paused||g.hidden)return{status:"FROZEN",time:g.anchorVirtual};const t=g.anchorVirtual+(g.now-g.anchorWall)*g.rate;if(!Number.isFinite(t)||t<0||t>g.end)return{status:"OUT_OF_RANGE",time:null};if(g.gapStart!==undefined&&t>=g.gapStart&&t<g.gapEnd)return{status:"UNKNOWN_GAP",time:null};return{status:"DISPLAY_ONLY",time:t}}
assert.equal(tr.rules.length,8);assert.equal(fx.cases.length,40);assert.equal(fx.goldens.length,8);assert.equal(so.records.length,5);
let done=0;const srcIds=new Set(so.records.map(x=>x.id));
for(const rule of tr.rules){assert.equal(rule.fields.length,4);assert.ok(rule.sourceIds.every(id=>srcIds.has(id)));
assert.ok(rule.capabilityIds.includes("CAP-09-08")&&rule.originalWorkPackages.includes("E3-04"));
for(let n=0;n<5;n++){const c=fx.cases.find(x=>x.id===rule.testIds[n]);assert.ok(c);assert.deepEqual(Object.keys(c.values).sort(),[...rule.fields].sort());
const bad=rule.fields.filter(f=>c.values[f]!==true);assert.equal(bad.length,n===0?0:1);if(n)assert.equal(bad[0],rule.fields[n-1]);
assert.equal(c.expected,n===0?"PASS_SYNTHETIC":rule.failure);done++;}}
for(const g of fx.goldens){assert.deepEqual(display(g.input),g.expected);done++}
console.log(JSON.stringify({planning:"SYNTHETIC_ONLY",assertions:done,independentNodeConsumer:"NOT_RUN",D15:"NOT_RUN",product:"NOT_RUN"}));

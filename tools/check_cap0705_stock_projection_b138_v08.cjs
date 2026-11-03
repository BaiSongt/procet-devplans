// B138：仅读本规划仓合成fixture，不触及产品仓或机床；不能代替独立几何Oracle。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=read("research/sources/CAP-07-05-stock-projection-b138.json"),tr=read("research/traces/CAP-07-05-stock-projection-b138-v08.json"),fx=read("docs/capabilities/CAP-07-05/stock-projection-b138-fixtures-v08.json");
const get=(o,k)=>k.split(".").reduce((v,p)=>v?.[p],o);
function judge(x){for(const r of tr.rules)for(let i=0;i<r.fields.length;i++)if(get(x,r.fields[i])!==true)return r.failureStatuses[i];return "PLANNING_CANDIDATE_NOT_PRODUCT_PASS"}
function projected(a){const n=a.n;if(!Array.isArray(n)||n.length!==3||!n.every(Number.isFinite)||Math.abs(Math.hypot(...n)-1)>1e-9)return{status:"UNKNOWN_NORMAL"};if(a.materialSide!=="OUTWARD")return{status:"UNKNOWN_MATERIAL_SIDE"};if(!Number.isFinite(a.radial)||!Number.isFinite(a.axial))return{status:"UNKNOWN_ALLOWANCE"};const v=n[0]*a.radial+n[2]*a.axial;return v< -1e-12?{status:"REJECT_SIGNED_DISPLACEMENT"}:{status:"GEOMETRIC_PROJECTION_ONLY",valueMm:Number(v.toFixed(12))}}
assert.equal(src.records.length,src.registeredRecords);assert.equal(src.records.length,7);assert.equal(tr.rules.length,8);assert.equal(fx.tests.length,40);assert.equal(fx.goldens.length,8);
const sourceIds=new Set(src.records.map(x=>x.id)),testIds=new Set(fx.tests.map(x=>x.id));assert.equal(sourceIds.size,7);assert.equal(testIds.size,40);
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.equal(r.failureStatuses.length,4);assert.equal(r.tests.length,5);for(const id of r.sourceIds)assert.ok(sourceIds.has(id),id);for(const id of r.tests)assert.ok(testIds.has(id),id)}
let pos=0,neg=0;const all=tr.rules.flatMap(r=>r.fields);
for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);const diff=all.filter(k=>get(t.input,k)!==get(fx.baseline,k));if(t.kind==="positive"){assert.deepEqual(diff,[],t.id);pos++}else{assert.deepEqual(diff,[t.changedField],t.id);neg++}}
for(const g of fx.goldens)assert.deepEqual(projected(g.input),g.expected,g.id);
assert.equal(pos,8);assert.equal(neg,32);
console.log(JSON.stringify({classification:"PLANNING_SYNTHETIC_ONLY",positive:pos,negative:neg,mathGoldens:fx.goldens.length,actualOCCT:"NOT_RUN",realConsumer:"0/17",L3:"PENDING_HUMAN"}));

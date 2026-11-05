// B136只读证据与理想平面几何预检；非OCCT/NC/机床/正式Owner认证。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=read("research/sources/CAP-07-02-scallop-boundary-b136.json"),tr=read("research/traces/CAP-07-02-scallop-boundary-b136-v08.json"),fx=read("docs/capabilities/CAP-07-02/scallop-boundary-b136-fixtures-v08.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
const judge=a=>{for(const r of tr.rules)for(let i=0;i<r.fields.length;i++)if(get(a,r.fields[i])!==true)return r.failureStatuses[i];return "PLANNING_CANDIDATE_NOT_PRODUCT_PASS"};
const sag=(R,s)=>{if(!Number.isFinite(R)||!Number.isFinite(s)||R<=0||s<0||s>=2*R)return {status:"UNKNOWN_DOMAIN"};let x=s*s/4;return {status:"FLAT_IDEAL_ESTIMATE_ONLY",hMm:x/(R+Math.sqrt(R*R-x))}};
const inv=(R,h)=>{if(!Number.isFinite(R)||!Number.isFinite(h)||R<=0||h<0||h>=R)return {status:"UNKNOWN_DOMAIN"};return {status:"FLAT_IDEAL_ESTIMATE_ONLY",sMm:2*Math.sqrt(h*(2*R-h))}};
const qualify=a=>!a.ball?{status:"UNKNOWN_TOOL_GEOMETRY"}:(!a.planar||!a.trim||!a.curvature||!a.independent?{status:"UNKNOWN_NONPLANAR_ORACLE"}:{status:"PLANAR_ESTIMATE_ONLY_NOT_ENGINEERING_PASS"});
function near(a,b){if(typeof a==="number"&&typeof b==="number")return Math.abs(a-b)<1e-10;if(a&&b&&typeof a==="object"&&typeof b==="object")return Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>near(a[k],b[k]));return a===b}
assert.equal(src.records.length,7);assert.equal(tr.rules.length,8);assert.equal(fx.tests.length,40);assert.equal(fx.goldens.length,9);
const S=new Set(src.records.map(s=>s.id)),T=new Set(fx.tests.map(t=>t.id));assert.equal(S.size,7);assert.equal(T.size,40);
let positive=0,negative=0;
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.equal(r.tests.length,5);assert.equal(r.failureStatuses.length,4);for(const s of r.sourceIds)assert.ok(S.has(s));for(const t of r.tests)assert.ok(T.has(t))}
for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);const diff=tr.rules.flatMap(r=>r.fields).filter(k=>get(t.input,k)!==get(fx.baseline,k));if(t.kind==="positive"){assert.deepEqual(diff,[],t.id);positive++}else{assert.deepEqual(diff,[t.changedField],t.id);negative++}}
for(const g of fx.goldens){let actual=g.kind==="height"?sag(g.input.R,g.input.s):g.kind==="inverse"?inv(g.input.R,g.input.h):qualify(g.input);assert.ok(near(actual,g.expected),g.id)}
assert.equal(positive,8);assert.equal(negative,32);console.log(JSON.stringify({classification:"PLANNING_SYNTHETIC_ONLY",positive,negative,goldens:9,realOcct:"NOT_RUN",realCnc:"NOT_RUN",ownerSigned:"0/17"}));

// 中文：仅验证规划研究/字段/状态/算术Oracle，不连接实际机床。
"use strict";
const fs=require("node:fs"),p=require("node:path"),a=require("node:assert/strict");
const root=p.resolve(__dirname,".."),read=f=>JSON.parse(fs.readFileSync(p.join(root,f),"utf8"));
const S=read("research/sources/CAP-04-07.json"),T=read("research/traces/CAP-04-07.json"),F=read("docs/capabilities/CAP-04-07/fixtures.json");
const get=(obj,path)=>path.split(".").reduce((x,k)=>x?.[k],obj);
a.equal(S.sources.length,10);a.equal(T.rules.length,10);a.equal(new Set(S.sources.map(x=>x.id)).size,10);
const rules=new Map(T.rules.map(r=>[r.id,r]));let count=0;
for(const c of F.cases){const r=rules.get(c.ruleId);a.ok(r,c.id);a.equal(r.criteria.length,4);for(const s of r.sourceIds)a.ok(S.sources.some(x=>x.id===s),s);for(const field of r.fields)a.ok(r.criteria.some(x=>x.path===field));const value=r.criteria.every(x=>get(c.input,x.path)===x.value)?"PASS":"REJECT";a.equal(value,c.expected,c.id);count++;}
const allowed=new Set(["DRAFT>PREVIEW","PREVIEW>REVIEW","REVIEW>COMMITTED","REVIEW>DRAFT","COMMITTED>STALE","STALE>DRAFT"]);
for(const c of F.transitions){let result=allowed.has(c.from+">"+c.to)&&!(c.to==="COMMITTED"&&(!c.approved||Object.values(c.gates).some(x=>x!==true)))?"PASS":"REJECT";a.equal(result,c.expected,c.id);count++;}
for(const c of F.mathCases){const norm=Math.hypot(...c.axis);const v=c.origin.map((x,i)=>x+c.gaugeMm*c.axis[i]/norm);const result=norm>0&&Number.isFinite(norm)&&v.every((x,i)=>Math.abs(x-c.expectedPoint[i])<1e-9)?"PASS":"REJECT";a.equal(result,c.expected,c.id);count++;}
a.equal(F.cases.length,50);a.equal(F.transitions.length,24);a.equal(F.mathCases.length,6);a.equal(count,80);
console.log("CAP-04-07 规划合成80/80 PASS；实际Owner/机床/NC/独立消费者NOT_RUN");

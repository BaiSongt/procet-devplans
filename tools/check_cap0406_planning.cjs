// 中文：仅规划文档源/规则/字段/合成Oracle，不代表实际产品。
"use strict";
const fs=require("node:fs"),p=require("node:path"),assert=require("node:assert/strict");
const root=p.resolve(__dirname,".."),read=x=>JSON.parse(fs.readFileSync(p.join(root,x),"utf8"));
const s=read("research/sources/CAP-04-06.json"),t=read("research/traces/CAP-04-06.json"),f=read("docs/capabilities/CAP-04-06/fixtures.json");
const get=(o,path)=>path.split(".").reduce((x,k)=>x?.[k],o);
assert.equal(s.sources.length,10);assert.equal(t.rules.length,10);
const sourceIds=new Set(s.sources.map(x=>x.id));
let n=0;for(const c of f.cases){const r=t.rules.find(x=>x.id===c.ruleId);assert.ok(r);assert.equal(r.criteria.length,4);
for(const source of r.sourceIds)assert.ok(sourceIds.has(source));
const result=r.criteria.every(x=>get(c.input,x.path)===x.value)?"PASS":"REJECT";assert.equal(result,c.expected,c.id);n++;}
const neg=new Set(["wroteD04","rendererOnly","cancelled","clOnly"]);
for(const c of f.transitions){const result=Object.entries(c.input).every(([k,v])=>v===(neg.has(k)?false:true))?"PASS":"REJECT";assert.equal(result,c.expected,c.id);n++;}
for(const c of f.mathCases){const a=c.thetaDeg*Math.PI/180,x=c.fixture[0]+c.part[0],y=c.fixture[1]+c.part[1];
const v=[c.m[0]+x*Math.cos(a)-y*Math.sin(a),c.m[1]+x*Math.sin(a)+y*Math.cos(a),c.m[2]+c.fixture[2]+c.part[2]];
const result=v.every((v,i)=>Math.abs(v-c.expect[i])<1e-9)?"PASS":"REJECT";assert.equal(result,c.result,c.id);n++;}
assert.equal(f.cases.length,50);assert.equal(f.transitions.length,20);assert.equal(f.mathCases.length,4);assert.equal(n,74);
console.log("CAP-04-06 规划合成74/74 PASS；真实产品/机床/独立消费者NOT_RUN");

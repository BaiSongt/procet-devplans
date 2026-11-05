// B137 CAP-06-08 只读规划合成；不读真实产品数据库/OCCT/NC，也不取得Owner签署。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=read("research/sources/CAP-06-08-negative-reads-b137.json");
const tr=read("research/traces/CAP-06-08-negative-reads-b137-v08.json");
const fx=read("docs/capabilities/CAP-06-08/negative-reads-b137-fixtures-v08.json");
const get=(o,k)=>k.split(".").reduce((v,a)=>v?.[a],o);
const judge=a=>{for(const r of tr.rules)for(let i=0;i<r.fields.length;i++)if(get(a,r.fields[i])!==true)return r.failureStatuses[i];return "PLANNING_CANDIDATE_NOT_PRODUCT_PASS"};
function graph(g){if(!g.complete||!g.pinned)return{status:"UNKNOWN_SCOPE"};const nodes=new Set(g.nodes);if(g.changed.some(x=>!nodes.has(x)))return{status:"UNKNOWN_SCOPE"};if(g.edges.some(([a,b])=>!nodes.has(a)||!nodes.has(b)))return{status:"UNKNOWN_SCOPE"};const adj=new Map(g.nodes.map(x=>[x,[]]));for(const [a,b] of g.edges)adj.get(a).push(b);const visit=new Map;function cycle(n){let s=visit.get(n)||0;if(s===1)return true;if(s===2)return false;visit.set(n,1);for(const m of adj.get(n))if(cycle(m))return true;visit.set(n,2);return false}if(g.nodes.some(n=>cycle(n)))return{status:"UNKNOWN_GRAPH"};const hit=new Set(g.changed),q=[...g.changed];for(let i=0;i<q.length;i++)for(const v of adj.get(q[i]))if(!hit.has(v)){hit.add(v);q.push(v)}const frozen=g.frozen.filter(x=>hit.has(x)).sort();return frozen.length?{status:"CONFLICT_REQUIRES_HUMAN",frozen}:{status:"AFFECTED",affected:[...hit].sort()}}
assert.equal(src.registeredRecords,src.records.length);assert.equal(src.records.length,7);assert.equal(tr.rules.length,8);assert.equal(fx.tests.length,40);assert.equal(fx.goldens.length,8);
const ids=new Set(src.records.map(s=>s.id));assert.equal(ids.size,7);const tid=new Set(fx.tests.map(t=>t.id));assert.equal(tid.size,40);
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.equal(r.failureStatuses.length,4);assert.equal(r.tests.length,5);for(const sid of r.sourceIds)assert.ok(ids.has(sid));for(const t of r.tests)assert.ok(tid.has(t))}
let pos=0,neg=0;for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);const diff=tr.rules.flatMap(r=>r.fields).filter(x=>get(t.input,x)!==get(fx.baseline,x));if(t.kind==="positive"){assert.deepEqual(diff,[],t.id);pos++}else{assert.deepEqual(diff,[t.changedField],t.id);neg++}}
for(const g of fx.goldens)assert.deepEqual(graph(g.input),g.expected,g.id);
assert.equal(pos,8);assert.equal(neg,32);
console.log(JSON.stringify({classification:"PLANNING_SYNTHETIC_ONLY",positive:pos,negative:neg,graphGoldens:fx.goldens.length,realOCCT:"NOT_RUN",independentConsumer:"0/17",L3:"PENDING_HUMAN"}));

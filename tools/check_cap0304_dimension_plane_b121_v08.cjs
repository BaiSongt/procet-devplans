"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const n=process.argv.indexOf("--root"),root=n>=0?path.resolve(process.argv[n+1]):path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=load("research/sources/CAP-03-04-dimension-plane-b121.json"),t=load("research/traces/CAP-03-04-dimension-plane-b121-v08.json"),f=load("docs/capabilities/CAP-03-04/dimension-plane-b121-fixtures-v08.json");
assert.equal(s.registeredRecords,9);assert.equal(s.sources.length,9);assert.equal(t.rules.length,8);assert.equal(f.cases.length,40);
assert.equal(f.vectorGoldens.length,6);assert.equal(f.baselineGoldens.length,4);
const src=new Set(s.sources.map(x=>x.id)),cases=new Map(f.cases.map(x=>[x.id,x]));assert.equal(src.size,9);assert.equal(cases.size,40);
function judge(r,x){const i=r.fields.findIndex(k=>x[k]!==true);return i<0?"CANDIDATE":r.negativeStatuses[i];}
for(const r of t.rules){
 assert.equal(r.fields.length,4);assert.ok(r.sourceIds.every(x=>src.has(x)));assert.ok(r.assets.length>0&&r.originalWorkPackages.length>0);
 for(const id of [...r.positive,...r.negative]){const c=cases.get(id);assert.ok(c,id);assert.equal(c.rule,r.id);assert.equal(judge(r,c.input),c.expect,id);}
 r.negative.forEach((id,i)=>{const c=cases.get(id);assert.equal(c.mutatedField,r.fields[i]);assert.deepEqual(r.fields.filter(x=>c.input[x]===false),[r.fields[i]]);});
}
function relation(a,b){const n=Math.hypot(...a),m=Math.hypot(...b);if(!Number.isFinite(n*m)||n*m===0)return"INVALID";const v=Math.abs(a.reduce((s,x,i)=>s+x*b[i],0)/(n*m));return v<1e-9?"PERPENDICULAR":1-v<1e-9?"PARALLEL":"OBLIQUE";}
for(const g of f.vectorGoldens)assert.equal(relation(g.target,g.planeNormal),g.expect,g.id);
function graph(nodes){const m=new Map(nodes.map(x=>[x.id,x]));if(m.size!==nodes.length)return"REJECT";for(const x of nodes){let p=x,seen=new Set();while(p&&p.baseline){if(seen.has(p.id))return"REJECT";seen.add(p.id);p=m.get(p.baseline);if(!p)return"UNKNOWN";}}for(const x of nodes){if(!x.baseline)continue;const parent=m.get(x.baseline);if(x.baselineRevision!==parent.rev)return"STALE";if(x.plane!==parent.plane)return"CONFLICT";}return"VALID";}
for(const g of f.baselineGoldens)assert.equal(graph(g.nodes),g.expect,g.id);
console.log(JSON.stringify({level:"PLANNING_SYNTHETIC_ONLY",sources:9,rules:8,positive:8,negative:32,vectorGoldens:6,baselineGoldens:4,realCreo:"NOT_RUN",realConsumers:"NOT_RUN"}));

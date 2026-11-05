'use strict';
// 仅验证规划数据及合成正反案例，不能代替真实NC/OCCT/机床验收。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),load=x=>JSON.parse(fs.readFileSync(path.join(root,x),'utf8'));
const tr=load('research/traces/CAP-07-08.json'),so=load('research/sources/CAP-07-08.json'),fi=load('docs/capabilities/CAP-07-08/fixtures.json'),dto=load('docs/capabilities/CAP-07-08/contract.example.json');
assert.equal(tr.rules.length,10);assert.equal(so.sources.length,8);assert.equal(fi.tests.length,30);
function check(r,v){return r.criteria.every(x=>x.op==='sha256'?typeof v[x.path]==='string'&&/^[a-f0-9]{64}$/.test(v[x.path]):v[x.path]===x.value);}
for(const r of tr.rules){for(const s of r.sourceIds)assert(so.sources.some(x=>x.id===s));for(const field of r.fields)assert(r.criteria.some(c=>c.path===field));
const a=fi.tests.filter(x=>x.ruleId===r.id);assert.equal(a.length,3);assert.equal(a.filter(x=>x.expected==='PASS').length,1);assert.equal(a.filter(x=>x.expected==='REJECT').length,2);
for(const t of a)assert.equal(check(r,t.input),t.expected==='PASS',t.id);}
function reach(seed){let s=new Set(seed),change=true;while(change){change=false;for(const [a,b] of fi.graphEdges)if(s.has(a)&&!s.has(b)){s.add(b);change=true;}}return [...s].sort();}
for(const g of fi.graphTests)assert.deepEqual(reach(g.seed),g.expected,g.id);
assert.deepEqual(reach(dto.dependency.seed),dto.dependency.dirty);assert.equal(dto.newD09.publishEligible,false);
console.log('34/34 synthetic planning cases PASS; PRODUCT/CONSUMER NOT_RUN');

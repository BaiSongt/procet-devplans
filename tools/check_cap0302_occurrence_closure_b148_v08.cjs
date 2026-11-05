#!/usr/bin/env node
// B148只读规划校验，真实STEP/Owner/独立消费者必须另验。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=load('research/sources/CAP-03-02-occurrence-closure-b148.json'),t=load('research/traces/CAP-03-02-occurrence-closure-b148-v08.json'),f=load('docs/capabilities/CAP-03-02/occurrence-closure-b148-fixtures-v08.json');
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const ids=new Set(s.records.map(r=>r.id));assert(ids.size===5&&s.registeredRecords===5,'5 sources');
assert(t.rules.length===8&&f.cases.length===40&&f.goldens.length===5,'cardinality');
let pos=0,neg=0;for(const r of t.rules){assert(r.fields.length===4&&r.sourceIds.every(id=>ids.has(id)),'sources '+r.id);const cs=f.cases.filter(c=>c.ruleId===r.id);assert(cs.length===5,'cases '+r.id);for(const c of cs){const bad=r.fields.filter(k=>c.values[k]!==true);assert((bad.length?r.failure:'PLANNING_CANDIDATE_ONLY')===c.expected,'verdict '+c.id);if(c.changedField){assert(bad.length===1&&bad[0]===c.changedField,'independence '+c.id);neg++;}else{assert(bad.length===0,'positive '+c.id);pos++;}}}
const mul=(A,B)=>A.map(row=>B[0].map((_,j)=>row.reduce((s,x,k)=>s+x*B[k][j],0)));
for(const g of f.goldens){const m=mul(g.parent,g.child);assert(Math.abs(m[0][2]-g.expected[0])+Math.abs(m[1][2]-g.expected[1])<1e-9,'matrix '+g.id);if(g.forbiddenDoubleLocation)assert(g.expected.some((v,i)=>v!==g.forbiddenDoubleLocation[i]),'double location');}
assert(t.formalOwnerSignoff==='0/17'&&t.realIndependentConsumers==='0/17'&&t.planningPassNotProductPass,'status');
console.log('B148规划合成PASS: '+pos+'正/'+neg+'独立负例/5矩阵Golden；实际OCCT、Owner与独立消费者NOT_RUN');

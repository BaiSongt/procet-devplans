#!/usr/bin/env node
'use strict';
// 只读验证规划追踪、单字段反例与算术；不执行OCCT/NC/实机。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/E3-05-d15-interval-b12-v08.json'),'utf8'));
const f=JSON.parse(fs.readFileSync(path.join(root,'docs/work-packages/E3-05/d15-interval-b12-fixtures-v08.json'),'utf8'));
const errors=[],keys=Object.keys(f.baseline),sourceIds=new Set(t.sources.map(s=>s.id));
const testIds=new Set([...f.cases,...f.arithmetic].map(c=>c.id)),used=new Set(),fields=new Set();
for(const r of t.rules){if(!r.fields.length||!r.caps.length||!r.packages.length||!r.acceptance.length)errors.push('RULE:'+r.id);
 for(const x of r.sourceRefs)if(!sourceIds.has(x))errors.push('SOURCE:'+x);
 for(const x of r.fields){fields.add(x);if(!keys.includes(x))errors.push('FIELD:'+x);}
 for(const x of [...r.acceptance,...r.arithmeticIds]){used.add(x);if(!testIds.has(x))errors.push('TEST:'+x);}
}
for(const x of keys)if(!fields.has(x))errors.push('UNTRACKED_FIELD:'+x);
for(const x of testIds)if(!used.has(x))errors.push('UNTRACKED_TEST:'+x);
const status=x=>keys.every(k=>Object.is(x[k],f.baseline[k]))&&x.gapLowerMm-x.movingUpperMm-x.obstacleUpperMm-x.uncertaintyMm>x.clearanceMm+1e-9?'SYNTHETIC_CANDIDATE_ONLY':'BLOCKED_UNKNOWN_OR_STALE';
for(const c of f.cases){if(c.mutation&&Object.keys(c.mutation).length!==1)errors.push('ARITY:'+c.id);
 if(status({...f.baseline,...(c.mutation||{})})!==c.expected)errors.push('CASE:'+c.id);}
for(const e of f.arithmetic){if(e.kind==='bound'){const d=e.gap-e.moving-e.obstacle-e.error;
 if(Math.abs(d-e.lower)>1e-9||((d>e.margin+1e-9)!==(e.expected==='CANDIDATE_ONLY')))errors.push('BOUND:'+e.id);}
 else if(e.kind==='alias'){const d=e.centers.map(v=>Math.abs(v-e.obstacle)-e.ra-e.rb);
 if(d[0]!==e.endpointGap||d[2]!==e.endpointGap||d[1]>=0)errors.push('ALIAS:'+e.id);}
 else errors.push('UNKNOWN_EXAMPLE:'+e.id);}
if(t.rules.length!==6||t.ownerSigned!==0||t.product!=='NOT_RUN'||f.realOCCT!=='NOT_RUN'||f.realB5!=='NOT_RUN'||f.independentConsumers!=='NOT_RUN')errors.push('FALSE_CLAIM');
console.log(JSON.stringify({rules:t.rules.length,syntheticCases:f.cases.length,arithmetic:f.arithmetic.length,total:f.cases.length+f.arithmetic.length,passed:errors.length===0,errors,product:'NOT_RUN'},null,2));
if(errors.length)process.exitCode=1;

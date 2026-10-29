#!/usr/bin/env node
'use strict';
// D13模态闭包规划正反验收：只读、无网络、不生成NC产品安全认证。
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const d=load('research/traces/CAP-09-07-d13-modal-b10-v08.json'),f=load('docs/capabilities/CAP-09-07/d13-modal-b10-fixtures-v08.json');
const err=[],source=new Set(d.sources.map(s=>s.id)),tests=new Set(f.cases.map(x=>x.id));
for(const r of d.rules){if(!r.fields.length||!r.caps.length||!r.packages.length)err.push('INCOMPLETE:'+r.id);for(const s of r.sourceRefs)if(!source.has(s))err.push('SOURCE:'+s);for(const id of r.acceptance)if(!tests.has(id))err.push('TEST:'+id)}
if(d.rules.length!==6)err.push('RULE_COUNT');
const predicate=x=>Object.keys(f.baseline).every(k=>x[k]===f.baseline[k])?'SYNTHETIC_D14_HANDOFF_CANDIDATE_ONLY':'BLOCKED_UNKNOWN_OR_STALE';
for(const c of f.cases){const got=predicate({...f.baseline,...(c.mutation||{})});if(got!==c.expected)err.push('CASE:'+c.id);if(c.mutation&&Object.keys(c.mutation).length!==1)err.push('NOT_SINGLE_FIELD:'+c.id)}
if(d.actualD13Semantic!=='unknown'||d.actualD15!=='NOT_RUN'||d.actualD16!=='BLOCKED'||f.realNc!=='NOT_RUN'||d.ownerSigned!==0)err.push('FALSE_PRODUCT_CLAIM');
console.log(JSON.stringify({topic:d.topic,synthetic:f.cases.length,passed:f.cases.length-err.length,ruleCount:d.rules.length,errors:err,planningOnly:true,product:'NOT_RUN'},null,2));
if(err.length)process.exitCode=1;

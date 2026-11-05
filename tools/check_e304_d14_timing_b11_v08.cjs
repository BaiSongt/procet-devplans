#!/usr/bin/env node
'use strict';
// 仅规划合成字段、算术及来源关系；不解释真实NC、不宣称机床安全。
const fs=require('node:fs'), path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=read('research/traces/E3-04-d14-timing-b11-v08.json');
const f=read('docs/work-packages/E3-04/d14-timing-b11-fixtures-v08.json');
const errors=[], source=new Set(t.sources.map(x=>x.id)), tests=new Set([...f.cases,...f.nominalExamples].map(x=>x.id)), keys=Object.keys(f.baseline);
const required=new Set(keys);
for(const r of t.rules){if(!r.fields.length||!r.caps.length||!r.packages.length||!r.acceptance.length)errors.push('INCOMPLETE:'+r.id);for(const x of r.sourceRefs)if(!source.has(x))errors.push('SOURCE:'+x);for(const x of r.acceptance)if(!tests.has(x))errors.push('ACCEPTANCE:'+x);for(const x of r.fields)if(!required.has(x))errors.push('FIELD:'+x);}
const used=new Set(t.rules.flatMap(r=>r.acceptance));for(const x of tests)if(!used.has(x))errors.push('UNTRACKED_TEST:'+x);
if(t.rules.length!==7)errors.push('RULE_COUNT');
const label=x=>keys.every(k=>x[k]===f.baseline[k])?'SYNTHETIC_D14_TIMELINE_CANDIDATE_ESTIMATE_ONLY':'BLOCKED_UNKNOWN_OR_STALE';
for(const c of f.cases){if(c.mutation&&Object.keys(c.mutation).length!==1)errors.push('MUTATION_ARITY:'+c.id);if(label({...f.baseline,...(c.mutation||{})})!==c.expected)errors.push('CASE:'+c.id);}
function nominal(x){if(!(Number.isFinite(x.f)&&x.f>0))return null;if(x.mode==='G93')return 60/x.f;if(x.mode==='G94'&&Number.isFinite(x.lengthMm)&&x.lengthMm>=0)return 60*x.lengthMm/x.f;if(x.mode==='G95'&&Number.isFinite(x.lengthMm)&&x.lengthMm>=0&&Number.isFinite(x.rpm)&&x.rpm>0)return 60*x.lengthMm/(x.f*x.rpm);return null;}
for(const c of f.nominalExamples){const n=nominal(c),state=n===null?'BLOCKED_UNKNOWN_OR_STALE':'SYNTHETIC_COMMAND_NOMINAL_ONLY';if(state!==c.expected||(n!==null&&Math.abs(n-c.expectedSeconds)>1e-9))errors.push('NOMINAL:'+c.id);}
if(t.product!=='NOT_RUN'||t.actualD15!=='NOT_RUN'||t.actualD16!=='BLOCKED'||t.ownerSigned!==0||f.realNC!=='NOT_RUN'||f.owner17!=='UNSIGNED')errors.push('FALSE_PRODUCT_CLAIM');
console.log(JSON.stringify({topic:t.topic,ruleCount:t.rules.length,mutationCount:f.cases.length-1,nominalCount:f.nominalExamples.length,syntheticAssertions:f.cases.length+f.nominalExamples.length,passed:errors.length===0,errors,product:'NOT_RUN',planningOnly:true},null,2));
if(errors.length)process.exitCode=1;

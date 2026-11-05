#!/usr/bin/env node
'use strict';
// B08：只读规划文件与合成正反校验。不会批准L3、Owner、消费者或产品。
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const audit=load('research/audits/FINAL-HISTORY-LINK-B08-2026-10-29.json');
const trace=load('research/traces/FINAL-HISTORY-LINK-B08-V08.json');
const fixtures=load('docs/architecture/v0.8/final-history-link-b08-fixtures-v08.json');
const errors=[];
const files=new Set();
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(e.name==='.git'||e.name==='node_modules')continue;
  const p=path.join(dir,e.name);
  if(e.isDirectory())walk(p);
  else if(e.isFile())files.add(path.relative(root,p).split(path.sep).join('/'));
 }
}
walk(root);
function classify(source,raw){
 let u=raw.trim().replace(/^<|>$/g,'').split(/[?#]/)[0];
 if(!u||/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(u))return 'SKIP';
 const parts=source.split('/').slice(0,-1);
 for(let s of u.split('/')){
  if(/%(?:2f|5c|00)/i.test(s))return 'REJECT_ESCAPE';
  try{s=decodeURIComponent(s)}catch{return 'REJECT_PERCENT'}
  if(s.includes('/')||s.includes('\\')||s.includes('\0'))return 'REJECT_SEPARATOR';
  if(!s||s==='.')continue;
  if(s==='..'){if(!parts.length)return 'REJECT_ROOT';parts.pop()}else parts.push(s);
 }
 const target=parts.join('/');
 return files.has(target)||files.has(target+'/README.md')?'EXISTS':'MISSING:'+target;
}
const unique=new Set();
let checked=0,links=0,missing=0,refs=0,html=0;
for(const m of audit.fileManifest){
 if(unique.has(m.path))errors.push('DUPLICATE_'+m.path);
 unique.add(m.path);
 const p=path.resolve(root,m.path);
 if(!p.startsWith(root+path.sep)||!fs.existsSync(p)){errors.push('ABSENT_'+m.path);continue}
 const bytes=fs.readFileSync(p);
 const sha=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
 if(sha!==m.gitBlobSha)errors.push('SHA_DRIFT_'+m.path);else checked++;
 const body=bytes.toString('utf8');
 const il=[...body.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)].map(x=>x[1].trim().split(/\s+["']/)[0]);
 const rf=[...body.matchAll(/^\s{0,3}\[([^\]\n]+)\]:\s*(?:<([^>\n]*)>|(\S+))/gm)].map(x=>x[2]||x[3]);
 const ht=[...body.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)].map(x=>x[1]);
 let count=0;
 for(const u of il){const q=classify(m.path,u);if(q==='SKIP')continue;count++;links++;if(q!=='EXISTS'){missing++;errors.push('INLINE_'+m.path+'_'+q)}}
 for(const u of rf){refs++;const q=classify(m.path,u);if(q!=='SKIP'&&q!=='EXISTS')errors.push('REFERENCE_'+m.path+'_'+q)}
 for(const u of ht){html++;const q=classify(m.path,u);if(q!=='SKIP'&&q!=='EXISTS')errors.push('HTML_'+m.path+'_'+q)}
 if(count!==m.inlineRelativeLinks||rf.length!==m.singleLineReferenceDefinitions||ht.length!==m.simpleHtmlHrefs)errors.push('COUNT_DRIFT_'+m.path);
}
const s=audit.markdownSnapshot;
if(audit.fileManifest.length!==56||checked!==s.gitShaMatched||links!==s.singleLineInlineRelativeLinks||missing!==s.identifiedMissingPaths||refs!==s.singleLineReferenceDefinitions||html!==s.simpleHtmlHrefs)errors.push('SUMMARY_MISMATCH');
if(s.priorDistinctShaPaths!==232||s.combinedDistinctShaPaths!==288||s.remainingAtObservedHead!==247)errors.push('COVERAGE_MISMATCH');
const srcs=new Set(audit.externalSources.map(x=>x.id));
const acceptanceIds=new Set(fixtures.cases.map(x=>x.id));
const ids=new Set();
for(const r of trace.rules){
 if(ids.has(r.id))errors.push('DUPLICATE_RULE_'+r.id);
 ids.add(r.id);
 if(!r.sourceRefs.length||!r.fields.length||!r.caps.length||!r.packages.length||!r.acceptance.includes('B08-P01'))errors.push('TRACE_INCOMPLETE_'+r.id);
 for(const id of r.sourceRefs)if(!srcs.has(id))errors.push('SOURCE_MISSING_'+id);
 for(const id of r.acceptance)if(!acceptanceIds.has(id))errors.push('ACCEPTANCE_MISSING_'+id);
}
if(trace.rules.length!==6)errors.push('RULE_COUNT');
const baseline=fixtures.observedActual;
const predicate=s=>Object.entries(baseline).every(([k,v])=>s[k]===v);
for(const c of fixtures.cases){
 const actual=predicate({...baseline,...(c.oneFieldOverride||{})});
 if(actual!==c.expected)errors.push('SYNTHETIC_CASE_'+c.id);
}
if(fixtures.cases.length!==27)errors.push('CASE_COUNT');
console.log(JSON.stringify({batch:'B08',checked,links,missing,syntheticCases:fixtures.cases.length,errors,status:errors.length?'FAIL':'PASS',nodePlanningOnly:true,productAcceptance:'NOT_RUN'},null,2));
if(errors.length)process.exitCode=1;

#!/usr/bin/env node
'use strict';
// B07 仅执行规划文件、Git字节与合成正反验收核验；不授予L3、产品发布或Owner会签。
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const audit=read('research/audits/FINAL-HISTORY-LINK-B07-2026-10-29.json');
const trace=read('research/traces/FINAL-HISTORY-LINK-B07-V08.json');
const fixture=read('docs/architecture/v0.8/final-history-link-b07-fixtures-v08.json');
const tasks=read('docs/work-packages/B0-04/subtasks.json');
const oldTrace=read('research/traces/B0-04.json');
const oldFixture=read('docs/work-packages/B0-04/fixtures.json');
const errors=[];
const check=(condition,label)=>{if(!condition)errors.push(label)};
const files=new Set();
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(e.name==='.git'||e.name==='node_modules')continue;
  const abs=path.join(dir,e.name);
  if(e.isDirectory())walk(abs);
  else if(e.isFile())files.add(path.relative(root,abs).split(path.sep).join('/'));
 }
}
walk(root);
function classify(origin,uri){
 let u=uri.trim().replace(/^<|>$/g,'').split(/[?#]/)[0];
 if(!u||/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(u))return 'SKIP';
 const segments=origin.split('/').slice(0,-1);
 for(let s of u.split('/')){
  if(/%00/i.test(s))return 'REJECT_NUL';
  if(/%(?:2f|5c)/i.test(s))return 'REJECT_SEPARATOR';
  try{s=decodeURIComponent(s)}catch{return 'REJECT_PERCENT'}
  if(s.includes('/')||s.includes('\\'))return 'REJECT_SEPARATOR';
  if(s.includes('\0'))return 'REJECT_NUL';
  if(!s||s==='.')continue;
  if(s==='..'){if(!segments.length)return 'REJECT_ROOT';segments.pop()}
  else segments.push(s);
 }
 const target=segments.join('/');
 return files.has(target)||files.has(target+'/README.md')?'EXISTS':'MISSING';
}
let shaMatch=0,inlineLinks=0,referenceDefinitions=0,htmlHrefs=0,missingLinks=0;
const paths=new Set();
for(const entry of audit.fileManifest){
 if(paths.has(entry.path))errors.push('DUPLICATE_FILE_'+entry.path);
 paths.add(entry.path);
 const full=path.resolve(root,entry.path);
 if(!full.startsWith(root+path.sep)||!fs.existsSync(full)){errors.push('MISSING_FILE_'+entry.path);continue}
 const bytes=fs.readFileSync(full);
 const actual=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
 if(actual===entry.gitBlobSha)shaMatch++;else errors.push('SHA_DRIFT_'+entry.path);
 const body=bytes.toString('utf8');
 const inlines=[...body.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)].map(m=>m[1].trim().split(/\s+["']/)[0]);
 const refs=[...body.matchAll(/^\s{0,3}\[([^\]\n]+)\]:\s*(?:<([^>\n]*)>|(\S+))/gm)].map(m=>m[2]||m[3]);
 const html=[...body.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
 let counted=0;
 for(const target of inlines){
  const state=classify(entry.path,target);
  if(state==='SKIP')continue;
  counted++;inlineLinks++;
  if(state!=='EXISTS'){missingLinks++;errors.push('LINK_'+entry.path+'_'+state+':'+target)}
 }
 for(const target of refs){
  referenceDefinitions++;
  const state=classify(entry.path,target);
  if(state!=='EXISTS'&&state!=='SKIP')errors.push('REFERENCE_'+entry.path+'_'+state);
 }
 for(const target of html){
  htmlHrefs++;
  const state=classify(entry.path,target);
  if(state!=='EXISTS'&&state!=='SKIP')errors.push('HTML_'+entry.path+'_'+state);
 }
 if(counted!==entry.inlineRelativeLinks)errors.push('INLINE_COUNT_'+entry.path);
 if(refs.length!==entry.singleLineReferenceDefinitions)errors.push('REFERENCE_COUNT_'+entry.path);
 if(html.length!==entry.simpleHtmlHrefs)errors.push('HTML_COUNT_'+entry.path);
}
const snap=audit.markdownSnapshot;
check(audit.treeTruncated===false,'TREE_NOT_TRUNCATED');
check(audit.fileManifest.length===36&&paths.size===36,'36_PATHS');
check(audit.fileManifest.every((e,i)=>e.index===289+i),'INDEX_RANGE');
check(shaMatch===36&&inlineLinks===130&&referenceDefinitions===0&&htmlHrefs===0&&missingLinks===0,'SCANNED_B07_COUNTS');
check(snap.totalAtObservedHead===534&&snap.priorDistinctShaPaths===196&&snap.newDistinctShaPaths===36&&snap.combinedShaPaths===232&&snap.remainingAtObservedHead===302,'BASELINE_ACCOUNTING');
check(audit.missingPath.resolved==='docs/work-packages/B0-04/subtasks.json'&&files.has(audit.missingPath.resolved),'SUBTASK_LINK_REMEDIATED');
check(tasks.workPackage==='B0-04'&&tasks.origin.startsWith('NEWLY_AUTHORED'),'SUBTASK_AUTHORED_STATUS');
check(tasks.subtasks.length===10&&new Set(tasks.subtasks.map(t=>t.id)).size===10,'TASKS_TEN_UNIQUE');
const knownTasks=new Set(tasks.subtasks.map(t=>t.id));
const knownRules=new Set(oldTrace.rules.map(r=>r.ruleId));
const visited=new Set(),active=new Set();
function acyclic(id){
 if(active.has(id))return false;
 if(visited.has(id))return true;
 const task=tasks.subtasks.find(x=>x.id===id);
 if(!task)return false;
 active.add(id);
 const valid=task.dependencies.every(acyclic);
 active.delete(id);
 visited.add(id);
 return valid;
}
check(tasks.subtasks.every(t=>t.dependencies.every(d=>knownTasks.has(d)))&&tasks.subtasks.every(t=>acyclic(t.id)),'TASK_DAG');
check(tasks.subtasks.every(t=>t.relatedRuleIds.length&&t.relatedRuleIds.every(id=>knownRules.has(id))),'TASK_RULES');
check(tasks.subtasks.every(t=>t.productTest==='NOT_RUN'&&t.independentConsumer==='NOT_RUN'&&t.actualTestEntry==='TO_BE_CREATED'&&t.deliverableExists===false&&t.rollback&&t.revisionAndHashRequired&&t.frameRef==='not_applicable'&&t.casPermissionRecheck&&t.cancelledLateAckMayCommit===false),'TASK_STATUS_GATES');
check(oldFixture.scenarios.length===20&&oldTrace.rules.length===10,'ORIGINAL_ACCEPTANCE_UNCHANGED');
const sourceIds=new Set(audit.sources.map(s=>s.id));
const testIds=new Set([...fixture.cases,...fixture.domainGates].map(c=>c.id));
check(trace.rules.length===6&&trace.rules.every(r=>r.fields.length&&r.caps.length&&r.packages.length&&r.sourceRefs.every(id=>sourceIds.has(id))&&r.acceptance.every(id=>testIds.has(id))),'SOURCE_TO_ACCEPTANCE_TRACE');
let synth=0;
for(const c of fixture.cases){
 const candidate={...fixture.observedActual,...(c.oneFieldOverride||{})};
 const equivalent=Object.keys(fixture.observedActual).every(k=>Object.is(candidate[k],fixture.observedActual[k]));
 if(equivalent===c.expected)synth++;else errors.push('SYNTHETIC_'+c.id);
}
check(fixture.cases.length===25&&synth===25,'25_SYNTHETIC_ONLY');
check(fixture.observedActual.node==='NOT_RUN'&&fixture.observedActual.product==='NOT_RUN'&&fixture.observedActual.ast==='NOT_RUN'&&fixture.observedActual.owner===0&&fixture.observedActual.consumer===0&&fixture.observedActual.l3==='PENDING_HUMAN'&&fixture.observedActual.history==='NOT_RECOVERED','NO_PRODUCT_PASS_PROMOTION');
console.log(JSON.stringify({result:errors.length?'FAIL':'PASS_PLANNING_ONLY',shaMatch,relativeInlineLinks:inlineLinks,missingLinks,subtasks:tasks.subtasks.length,syntheticCases:synth,domainGatesDesignOnly:fixture.domainGates.length,commonMarkAst:'NOT_RUN',product:'NOT_RUN',owner:'0/17',consumer:'0/17',l3:'PENDING_HUMAN',errors},null,2));
if(errors.length)process.exitCode=1;

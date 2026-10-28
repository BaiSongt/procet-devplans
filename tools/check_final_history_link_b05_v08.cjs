#!/usr/bin/env node
'use strict';
// V0.8 B05：本地只读规划证据校验；不得当作D15或实机验证。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const audit=read('research/audits/FINAL-HISTORY-LINK-B05-2026-10-29.json'),trace=read('research/traces/FINAL-HISTORY-LINK-B05-V08.json'),fixtures=read('docs/architecture/v0.8/final-history-link-b05-fixtures-v08.json'),errors=[];
const assert=(ok,id)=>{if(!ok)errors.push(id)};
const o=fixtures.observedActual;
const gate=x=>x.head===audit.observedExactHead&&x.total===audit.markdownSnapshot.total&&x.readCount===50&&x.shaMatches===50&&x.b04Stable===96&&x.unique===146&&x.links===283&&x.missing===0&&x.escapes===0&&x.parser==='REGEX_INLINE_SINGLE_LINE_ONLY'&&!x.fullScan&&x.owner===0&&x.consumer===0&&!x.productPass&&x.l3==='PENDING_HUMAN'&&x.unknownNc==='UNKNOWN'&&x.history==='NOT_RECOVERED';
assert(audit.fileManifest.length===50,'MANIFEST_50');
assert(new Set(audit.fileManifest.map(x=>x.path)).size===50,'UNIQUE_PATHS');
assert(audit.markdownSnapshot.currentB04ManifestPathShaUnchanged===96,'B04_CURRENT_PRESERVED');
assert(audit.markdownSnapshot.inlineLocalLinksHeuristicallyExamined===283,'LINK_COUNTS');
assert(audit.fileManifest.reduce((n,x)=>n+x.inlineLocalLinksHeuristic,0)===283,'LINK_SUM');
assert(audit.markdownSnapshot.fullRepoMarkdownScan==='NOT_RUN','NO_FULL_PASS');
let count=0;
for(const c of fixtures.cases){const x={...o,...(c.oneFieldOverride||{})};if(gate(x)===c.expected)count++;else errors.push('CASE_'+c.id)}
assert(count===fixtures.cases.length&&count===18,'FIXTURE_18');
assert(trace.rules.length===6&&trace.rules.every(x=>x.sourceRefs.length&&x.fields.length&&x.caps.length&&x.packages.length&&x.acceptance.length),'TRACE_6');
const dirFiles=new Set();
function walk(dir){if(!fs.existsSync(dir))return;for(const f of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())walk(p);else if(f.isFile())dirFiles.add(path.relative(root,p).split(path.sep).join('/'))}}
walk(root);
let blobMatches=0,links=0,missing=0,escape=0;
for(const e of audit.fileManifest){const p=path.resolve(root,e.path);
 if(!p.startsWith(root+path.sep)||!fs.existsSync(p)){errors.push('FILE_'+e.path);continue}
 const b=fs.readFileSync(p),hash=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\\0'.replace('\\0','\\x00'),'utf8'),b])).digest('hex');
 if(hash===e.gitBlobSha)blobMatches++;else errors.push('SHA_'+e.path);
 const c=b.toString('utf8');let localCount=0;
 for(const m of c.matchAll(/!?\\[[^\\]\\n]*\\]\\(([^)\\n]+)\\)/g)){
  let v=m[1].trim().split(/\\s+["']/)[0].replace(/^<|>$/g,'').split(/[?#]/)[0];
  if(!v||/^(?:[a-z][a-z0-9+.-]*:|\\/\\/|\\/)/i.test(v))continue;
  const base=e.path.split('/').slice(0,-1);
  for(const s of v.split('/')){if(!s||s==='.')continue;if(s==='..'){if(!base.length){escape++;break}base.pop()}else base.push(s)}
  const resolved=base.join('/');localCount++;links++;
  if(!dirFiles.has(resolved)&&!dirFiles.has(resolved+'/README.md'))missing++;
 }
 if(localCount!==e.inlineLocalLinksHeuristic)errors.push('LINKCOUNT_'+e.path);
}
assert(blobMatches===50,'GIT_SHA_50');assert(links===283,'LINK_283');assert(missing===0,'LINK_NO_MISSING');assert(escape===0,'LINK_NO_ROOT_ESCAPE');
const report={status:errors.length?'FAIL':'PASS_PLANNING_ONLY',evidenceFiles:blobMatches,heuristicLocalLinks:links,errors,product:'NOT_RUN',consumer:'NOT_RUN',l3:'PENDING_HUMAN'};
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;

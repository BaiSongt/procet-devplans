#!/usr/bin/env node
'use strict';
// V0.8 B05：只读规划校验。只能证明指定Markdown样本与正反设计谓词，不授予D15/D16或实机资格。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('research/audits/FINAL-HISTORY-LINK-B05-2026-10-29.json');
const t=read('research/traces/FINAL-HISTORY-LINK-B05-V08.json');
const f=read('docs/architecture/v0.8/final-history-link-b05-fixtures-v08.json'),errors=[];
const requireCheck=(ok,id)=>{if(!ok)errors.push(id)};
const actual=f.observedActual;
const gate=x=>x.head===a.observedExactHead&&x.total===a.markdownSnapshot.total&&x.readCount===50&&x.shaMatches===50&&x.b04Stable===96&&x.unique===146&&x.links===283&&x.missing===0&&x.escapes===0&&x.parser==='REGEX_INLINE_SINGLE_LINE_ONLY'&&x.fullScan===false&&x.owner===0&&x.consumer===0&&x.productPass===false&&x.l3==='PENDING_HUMAN'&&x.unknownNc==='UNKNOWN'&&x.history==='NOT_RECOVERED';
requireCheck(a.fileManifest.length===50,'MANIFEST_SIZE');
requireCheck(new Set(a.fileManifest.map(x=>x.path)).size===50,'MANIFEST_PATH_UNIQUE');
requireCheck(a.fileManifest.every((x,i)=>x.index===187+i&&/^[0-9a-f]{40}$/.test(x.gitBlobSha)),'INDEX_SHA');
requireCheck(a.fileManifest.reduce((s,x)=>s+x.inlineLocalLinksHeuristic,0)===283,'LINK_COUNT_ACCOUNTING');
requireCheck(a.markdownSnapshot.currentB04ManifestPathShaUnchanged===96,'B04_SNAPSHOT');
requireCheck(a.markdownSnapshot.fullRepoMarkdownScan==='NOT_RUN','NO_FULL_SCAN_CLAIM');
requireCheck(t.rules.length===6&&t.rules.every(x=>x.sourceRefs.length&&x.fields.length&&x.caps.length&&x.packages.length&&x.acceptance.length),'SOURCE_TRACE_RULES');
let caseCount=0;
for(const c of f.cases){const x={...actual,...(c.oneFieldOverride||{})};if(gate(x)===c.expected)caseCount++;else errors.push('CASE_'+c.id)}
requireCheck(caseCount===18,'FIXTURES_18');
const files=new Set();
function traverse(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){if(d.name==='.git'||d.name==='node_modules')continue;const p=path.join(dir,d.name);if(d.isDirectory())traverse(p);else if(d.isFile())files.add(path.relative(root,p).split(path.sep).join('/'))}}
traverse(root);
let shaMatches=0,links=0,missing=0,escapes=0;
for(const e of a.fileManifest){
 const file=path.resolve(root,e.path);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){errors.push('FILE_'+e.path);continue}
 const bytes=fs.readFileSync(file);
 const header=Buffer.from('blob '+bytes.length+'\0','utf8');
 const blobHash=crypto.createHash('sha1').update(Buffer.concat([header,bytes])).digest('hex');
 if(blobHash===e.gitBlobSha)shaMatches++;else errors.push('SHA_'+e.path);
 let ownCount=0;
 for(const m of bytes.toString('utf8').matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)){
  const target=m[1].trim().split(/\s+["']/)[0].replace(/^<|>$/g,'').split(/[?#]/)[0];
  if(!target||/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(target))continue;
  const seg=e.path.split('/').slice(0,-1);let escaped=false;
  for(const piece of target.split('/')){if(!piece||piece==='.')continue;if(piece==='..'){if(!seg.length){escaped=true;break}seg.pop()}else seg.push(piece)}
  if(escaped){escapes++;continue}
  const resolved=seg.join('/');links++;ownCount++;
  if(!files.has(resolved)&&!files.has(resolved+'/README.md'))missing++;
 }
 if(ownCount!==e.inlineLocalLinksHeuristic)errors.push('LINKCOUNT_'+e.path);
}
requireCheck(shaMatches===50,'SHA_MATCH_50');requireCheck(links===283,'LINKS_283');
requireCheck(missing===0,'PATHS_EXIST');requireCheck(escapes===0,'NO_ROOT_ESCAPE');
console.log(JSON.stringify({status:errors.length?'FAIL':'PASS_PLANNING_ONLY',checkedFiles:shaMatches,identifiedInlineLinks:links,fixtures:caseCount,errors,independentConsumer:'NOT_RUN',productNcOcctB5:'NOT_RUN',l3:'PENDING_HUMAN'},null,2));
if(errors.length)process.exitCode=1;

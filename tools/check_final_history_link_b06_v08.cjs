#!/usr/bin/env node
'use strict';
// B06规划只读审计：不授予Owner、D15或D16权限。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'..'),rd=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
const a=rd('research/audits/FINAL-HISTORY-LINK-B06-2026-10-29.json'),t=rd('research/traces/FINAL-HISTORY-LINK-B06-V08.json'),f=rd('docs/architecture/v0.8/final-history-link-b06-fixtures-v08.json');
const error=[],chk=(ok,id)=>{if(!ok)error.push(id)};
const paths=new Set();function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==='.git'||e.name==='node_modules')continue;let p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.isFile())paths.add(path.relative(base,p).split(path.sep).join('/'))}}walk(base);
function resolve(origin,uri,decode=true){
 let v=uri.trim().replace(/^<|>$/g,'').split(/[?#]/)[0];
 if(!v||/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(v))return 'SKIP';
 const seg=origin.split('/').slice(0,-1);
 for(let part of v.split('/')){
  if(decode){if(/%00/i.test(part))return 'REJECT_NUL';if(/%(?:2f|5c)/i.test(part))return 'REJECT_SEPARATOR';
   try{part=decodeURIComponent(part)}catch{return 'REJECT_PERCENT'}
   if(part.includes('/')||part.includes('\\'))return 'REJECT_SEPARATOR';
   if(part.includes('\0'))return 'REJECT_NUL';}
  if(!part||part==='.')continue;
  if(part==='..'){if(!seg.length)return 'REJECT_ROOT';seg.pop()}else seg.push(part);
 }
 const key=seg.join('/');
 return paths.has(key)||paths.has(key+'/README.md')?'EXISTS':'MISSING';
}
let cases=0;for(let c of f.cases){let x={...f.observedActual,...(c.oneFieldOverride||{})};let ok=Object.keys(f.observedActual).every(k=>Object.is(x[k],f.observedActual[k]));if(ok===c.expected)cases++;else error.push(c.id)}chk(cases===20,'SYNTHETIC_20');
let uri=0;for(let c of f.uriCases){let got=resolve(c.base,c.uri);if(got===c.expected)uri++;else error.push('URI_'+c.id+':'+got)}chk(uri===8,'URI_8');
chk(t.rules.length===6&&a.sources.length===4,'RULES_SOURCES');
const sources=new Set(a.sources.map(x=>x.id)),ids=new Set([...f.cases,...f.uriCases,...f.domainGates].map(x=>x.id));
chk(t.rules.every(r=>r.fields.length&&r.caps.length&&r.packages.length&&r.sourceRefs.every(x=>sources.has(x))&&r.acceptance.every(x=>ids.has(x))),'TRACE_LINKS');
let sha=0,links=0,refDefs=0,raw=0,miss=0,fixed=0;
for(let e of a.fileManifest){
 const full=path.resolve(base,e.path);
 if(!full.startsWith(base+path.sep)||!fs.existsSync(full)){error.push('FILE_'+e.path);continue}
 const bytes=fs.readFileSync(full),body=bytes.toString('utf8');
 const hash=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
 if(hash===e.gitBlobSha)sha++;else error.push('SHA_'+e.path);
 let count=0;let defs=[...body.matchAll(/^\s{0,3}\[([^\]\n]+)\]:\s*(?:<([^>\n]*)>|(\S+))/gm)];refDefs+=defs.length;
 for(let m of body.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)){
  const target=m[1].trim().split(/\s+["']/)[0],b=resolve(e.path,target,false),v=resolve(e.path,target);
  if(b==='SKIP'&&v==='SKIP')continue;
  links++;count++;
  if(b==='MISSING')raw++;if(v==='MISSING')miss++;if(b==='MISSING'&&v==='EXISTS')fixed++;
  if(v.startsWith('REJECT'))error.push('REJECTED_IN_SOURCE_'+e.path);
 }
 if(count!==e.inlineRelativeLinksSingleLine)error.push('COUNT_'+e.path);
 if(defs.length!==e.singleLineReferenceDefinitions)error.push('DEFS_'+e.path);
}
chk(a.fileManifest.length===50&&new Set(a.fileManifest.map(x=>x.path)).size===50,'MANIFEST');
chk(a.fileManifest.every((e,i)=>e.index===i+238&&/^[a-f0-9]{40}$/.test(e.gitBlobSha)),'SHA_LIST');
chk(sha===50&&links===403&&refDefs===0&&raw===1&&miss===0&&fixed===1,'OBSERVED_COUNTS');
chk(a.markdownSnapshot.fullRepoScan==='NOT_RUN','NOT_FULL_SCAN');
console.log(JSON.stringify({result:error.length?'FAIL':'PASS_PLANNING_ONLY',sha,links,rawFalseMissing:raw,decodedMissing:miss,repaired:fixed,uriSynthetic:uri,syntheticCases:cases,error,ast:'NOT_RUN',l3:'PENDING_HUMAN',product:'NOT_RUN'},null,2));
if(error.length)process.exitCode=1;

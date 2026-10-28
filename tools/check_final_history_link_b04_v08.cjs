#!/usr/bin/env node
'use strict';
// Procet V0.8 B04：只读已冻结样本/机器可检验收，不调用产品或CI。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=read('research/audits/FINAL-HISTORY-LINK-B04-2026-10-29.json');
const f=read('docs/architecture/v0.8/final-history-link-b04-fixtures-v08.json');
const t=read('research/traces/FINAL-HISTORY-LINK-B04-V08.json');
const issues=[],expect=(v,id)=>{if(!v)issues.push(id)};
const expected=a.observedExactHead;
function batch(s){return s.exactHead===expected&&s.markdownTotal===531&&s.readCount===96&&s.relativeDestinations===290&&s.shaMismatches===0&&s.missingLinks===0&&s.outsideRepo===0&&s.parser==='REGEX_HEURISTIC'&&s.anchorsChecked===false&&s.htmlChecked===false&&s.fullScanClaim===false&&s.historyStatus==='OPEN_MISSING_ORIGINALS'&&s.fakeRecovery===false&&s.ownerCount===0&&s.consumerCount===0&&s.productPass===false}
function full(s){return s.exactHead===expected&&s.markdownTotal===531&&s.readCount===531&&s.shaMismatches===0&&s.missingLinks===0&&s.outsideRepo===0&&s.parser==='COMMONMARK_AST'&&s.anchorsChecked===true&&s.htmlChecked===true&&s.fullScanClaim===true&&s.productPass===false}
expect(a.markdownSnapshot.total===531&&a.markdownSnapshot.newFullBlobReads===96&&a.markdownSnapshot.blobShaMatched===96,'BASELINE_COUNTS');
expect(a.fileManifest.length===96&&new Set(a.fileManifest.map(x=>x.path)).size===96,'UNIQUE_MANIFEST');
expect(a.fileManifest.reduce((s,x)=>s+x.relativeDestinationsHeuristic,0)===290,'LINK_ACCOUNTING');
expect(a.markdownSnapshot.fullRepoMarkdownScan==='NOT_RUN'&&a.gates.productPass===false,'NO_OVERCLAIM');
expect(t.rules.length===5&&t.rules.every(x=>x.sourceRefs?.length&&x.fields?.length&&x.caps?.length&&x.packages?.length&&x.acceptance?.length),'TRACE_RULES');
const allCases=[...f.cases,...f.negativeCases];let passing=0;
for(const c of allCases){const base=f[c.input||c.base],s={...base,...(c.oneFieldOverride||{})};const got=c.gate==='batch'?batch(s):full(s);
 if(got===c.expected)passing++;else issues.push('CASE_'+c.id)}
expect(passing===allCases.length&&allCases.length===25,'CASES_25');
let readCount=0;
for(const e of a.fileManifest){
 const p=path.resolve(root,e.path);
 if(!p.startsWith(root+path.sep)){issues.push('ESCAPE_'+e.path);continue}
 if(!fs.existsSync(p)){issues.push('ABSENT_'+e.path);continue}
 const buf=fs.readFileSync(p),sha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+buf.length+'\0'),buf])).digest('hex');
 if(sha!==e.gitBlobSha)issues.push('STALE_'+e.path);else readCount++;
}
expect(readCount===96,'EXACT_BLOBS');
if(issues.length){console.error(JSON.stringify({status:'FAIL',issues},null,2));process.exitCode=1}
else console.log(JSON.stringify({status:'PARTIAL_BATCH_VERIFIED',files:96,linksHeuristic:290,syntheticCases:25,fullRepoScan:'NOT_RUN',product:'NOT_RUN'}));

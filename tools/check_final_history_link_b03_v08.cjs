#!/usr/bin/env node
'use strict';
// Procet V0.8 历史原字节及 Markdown 终核门禁；只读规划仓，不运行产品、不代替人类签署。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const audit=read('research/audits/FINAL-HISTORY-LINK-B03-2026-10-29.json');
const trace=read('research/traces/FINAL-HISTORY-LINK-B03-V08.json');
const fixtures=read('docs/architecture/v0.8/final-history-link-b03-fixtures-v08.json');
function eligible(s){
 return s.exactHead===audit.observedExactHead&&!s.treeTruncated&&s.markdownTotal===audit.markdown.treeTotal
 &&s.markdownChecked===s.markdownTotal&&s.linkParser==='COMMONMARK_AST'&&s.anchorsChecked===true
 &&s.missingLinks===0&&s.outOfRoot===0
 &&s.historicalDisposition==='HUMAN_ACCEPTED_RISK_OR_VERIFIED_ORIGINAL'
 &&s.fakeRecoveredOriginals===false&&s.sourceReadDepthOverclaim===false
 &&s.ownerSignatureEvidence==='PENDING_HUMAN'&&s.consumerProof==='NOT_RUN'
 &&s.productPassed===false&&s.planningOnly===true;
}
const errors=[],expect=(ok,code)=>{if(!ok)errors.push(code)};
expect(audit.scope==='PLANNING_ONLY_NOT_PRODUCT_ACCEPTANCE','SCOPE');
expect(audit.treeTruncated===false&&audit.gitTreeEntries===1557&&audit.gitTreeBlobs===1411,'FROZEN_TREE');
expect(audit.markdown.treeTotal===530&&audit.markdown.readByGitHubBlob===150
 &&audit.markdown.relativeDestinationsExamined===1273
 &&audit.markdown.remainingDocumentsUnopened===380,'SAMPLE_ACCOUNTING');
expect(audit.markdown.scanRanges.reduce((n,x)=>n+x.markdownRead,0)===150
 &&audit.markdown.scanRanges.reduce((n,x)=>n+x.relativeDestinationsExamined,0)===1273,'RANGE_ACCOUNTING');
expect(audit.markdown.missingInSample===0&&audit.markdown.outsideRepoInSample===0
 &&audit.markdown.failedBlobReads===0,'SAMPLED_LINKS');
expect(audit.markdown.fullRepoMarkdownScan==='NOT_RUN'&&audit.markdown.commonMarkAstChecked===false
 &&audit.markdown.anchorsChecked===false,'NO_FULL_SCAN_OVERCLAIM');
expect(audit.historicOriginalPaths.length===3&&audit.unlocatedHistoricalOriginals.length===2,'HISTORY_FIVE_ITEMS');
expect(audit.historicOriginalPaths.every(x=>x.status==='ABSENT_IN_OBSERVED_GIT_TREE'
 &&x.originalBlobSha===null&&x.originalBytesSha256===null
 &&!fs.existsSync(path.join(root,x.path))),'NO_FAKE_RESTORED_PATHS');
expect(audit.unlocatedHistoricalOriginals.every(x=>x.status==='UNLOCATED_ORIGINAL_BYTES'
 &&x.originalBlobSha===null),'NO_FAKE_UNLOCATED_BYTES');
expect(audit.missingBytesHumanDisposition==='PENDING_HUMAN_REVIEW','HISTORY_HUMAN_ACK');
expect(audit.status.l1l2==='FROZEN'&&audit.status.l3==='PENDING_HUMAN'
 &&audit.status.ownerSigned==='0_OF_17'&&audit.status.independentConsumers==='0_OF_17'
 &&audit.status.occtNcB5==='NOT_RUN'&&audit.status.productPass===false,'NO_PRODUCT_PASS');
const ids=new Set(audit.sourceReads.map(x=>x.id));
expect(ids.size===5&&audit.sourceReads.every(x=>x.url.startsWith('https://')
 &&x.version&&x.accessedOn&&x.readDepth&&x.limitation),'SOURCE_METADATA_DEPTH');
expect(trace.rules.length===6&&trace.rules.every(x=>x.sourceRefs.every(id=>ids.has(id))
 &&x.fields.length&&x.caps.length&&x.packages.length),'TRACE_SOURCE_FIELD_CAP_PACKAGE');
let pass=0;
for(const c of fixtures.cases){const state=fixtures[c.input];
 if(eligible(state)===c.expectedEligible)pass++;else errors.push('POS_CASE_'+c.id)}
for(const c of fixtures.negativeCases){const state={...fixtures.syntheticEligible,...c.overrides};
 if(eligible(state)===c.expectedEligible)pass++;else errors.push('NEG_CASE_'+c.id)}
expect(fixtures.negativeCases.length===15&&pass===17,'POSITIVE_NEGATIVE_GATES');
const result={scope:'PLANNING_ONLY',auditHead:audit.observedExactHead,
 readMarkdown:audit.markdown.readByGitHubBlob,totalMarkdown:audit.markdown.treeTotal,
 sampledRelativeTargets:audit.markdown.relativeDestinationsExamined,
 sampleMissing:audit.markdown.missingInSample,fullScan:'NOT_RUN',
 historicalOriginalBytes:'NOT_RECOVERED',designFixtureAssertions:pass,totalFixtures:17,
 ruleCount:trace.rules.length,errors,product:'NOT_RUN'};
process.stdout.write(JSON.stringify(result,null,2)+'\\n');
if(errors.length)process.exitCode=1;

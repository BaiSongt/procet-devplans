'use strict';
// B160 T5-04 历史原字节缺失审计：仅核对规划证据与合成门禁，不读取私有内容、不修改仓库。
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const trace=read("research/traces/T5-04-historical-original-b160-v08.json"),source=read("research/sources/T5-04-historical-original-b160.json"),fixtures=read("docs/work-packages/T5-04/historical-original-b160-fixtures-v08.json"),observation=read("tracking/historical-original-audit-b160-2026-11-04.json");
const valid={"headSha":"bc8f7a8b39487241e2fdf07dacc071af042e4fbe","treeSha":"403c2ec7a38412c755565ef48b3070debe905629","treeTruncated":false,"repositoryVisibility":"public","exactPathScope":"three_exact_paths","branchHistoryCount":0,"mainHistoryCount":0,"absenceConclusion":"LIMITED_TO_CHECKED_REFS","originalBytesPresent":false,"originalHashKnown":false,"provenanceLabel":"MISSING_ORIGINAL","claimRecovered":false,"canonicalCapabilities":88,"originalWorkPackages":36,"assetTypes":17,"missingJsonAsAuthority":false,"linkedOriginalPresent":false,"navigationStatus":"EXPLICIT_MISSING","fallbackCanonicalMd":true,"implicitAlias":false,"restorationMode":"AUDIT_ONLY","recoveredDigest":"","byteMatchEvidence":"NOT_AVAILABLE","disposition":"MISSING_OPEN","ownerBoundary":"T5-04_CANDIDATE","casBeforeCommit":true,"aclRechecked":true,"lateAckDisposition":"DISCARD_OLD_SCOPE","l3Review":"PENDING_HUMAN","realConsumerPass":0,"productAcceptance":"NOT_RUN","markFullPlanningComplete":false};
function judge(a){for(const k of Object.keys(valid))if(!Object.prototype.hasOwnProperty.call(a,k)||a[k]===null)return 'UNKNOWN';for(const [k,v] of Object.entries(valid))if(a[k]!==v)return 'REJECT';return 'PASS';}
function goldenJudge(x){if(x.generatedFromMd)return 'NEWLY_AUTHORED';if(!x.hasOriginalBytes)return 'MISSING_ORIGINAL';if(!x.knownOriginalDigest)return 'UNVERIFIED_ORIGINAL';if(!x.matchingBytes)return 'HASH_MISMATCH_REJECT';return x.approved?'VERIFIED_ORIGINAL':'ORIGINAL_CANDIDATE_PENDING_REVIEW';}
const errors=[],sourceIds=new Set(source.records.map(x=>x.id)),caseIds=new Set();
if(source.records.length!==6||trace.rules.length!==8||Object.keys(fixtures.fieldSpecs).length!==32)errors.push('数量错误');
if(observation.head!=="bc8f7a8b39487241e2fdf07dacc071af042e4fbe"||!observation.treeComplete||observation.oldFileCandidates.length!==3)errors.push('远端观察快照不完整');
const expectedPaths=["docs/architecture/v0.8/capability-map.json","docs/architecture/v0.8/work-packages.json","docs/architecture/v0.8/code-evidence.json"];
for(const [i,entry] of observation.oldFileCandidates.entries())if(entry.path!==expectedPaths[i]||entry.blobPresent!==false||entry.historyOnPlanningBranchCount!==0||entry.historyOnMainCount!==0||entry.status!=='MISSING_ORIGINAL_BYTES')errors.push('观察对象:'+i);
for(const r of trace.rules){
 if(r.fields.length!==4||r.workPackageId!=='T5-04')errors.push(r.id+':工作包或字段');
 for(const s of r.sourceIds)if(!sourceIds.has(s))errors.push(r.id+':未注册来源');
 for(const t of r.testIds)if(!fixtures.cases.some(c=>c.id===t))errors.push(r.id+':验收缺失');
}
for(const c of fixtures.cases){
 if(caseIds.has(c.id))errors.push('重复:'+c.id);caseIds.add(c.id);
 if(judge(c.record)!==c.expected)errors.push('判定:'+c.id);
 if(c.kind==='single_field_negative'){const changed=Object.keys(valid).filter(k=>valid[k]!==c.record[k]);if(changed.length!==1||changed[0]!==c.mutatedField||!trace.rules.find(r=>r.id===c.ruleId)?.fields.includes(c.mutatedField))errors.push('非单字段:'+c.id);}
}
for(const g of fixtures.goldens)if(goldenJudge(g.input)!==g.expected)errors.push('溯源Gold:'+g.id);
if(fixtures.cases.length!==40||fixtures.goldens.length!==8)errors.push('样例数');
console.log(JSON.stringify({result:errors.length?'FAIL':'PASS_SYNTHETIC_ONLY',positive:8,negative:32,goldens:8,gitHubObservation:'FIXED_HEAD_READ_ONLY_SNAPSHOT',originalBytes:'MISSING_OPEN',independentNodeRuntime:'THIS_PROCESS_ONLY',independentRealConsumer:'NOT_RUN',ownerSigned:'0/17',errors},null,2));
process.exitCode=errors.length?1:0;

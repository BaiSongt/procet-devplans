#!/usr/bin/env node
'use strict';
// B102只读研究登记自检：不修改任何规划、用户数据或Git仓库。
const fs=require('node:fs');
const cp=require('node:child_process');
const path=require('node:path');
const auditRegistry=function auditRegistry(index,progress,tree,expectedTreeSha){
 const errors=[];
 const fail=(code)=>{if(!errors.includes(code))errors.push(code)};
 if(!tree||tree.truncated!==false||!Array.isArray(tree.tree))fail("TREE_TRUNCATED_OR_UNKNOWN");
 if(tree?.sha!==expectedTreeSha)fail("TREE_SHA_MISMATCH");
 const entries=new Map((tree?.tree||[]).map(t=>[t.path,t]));
 if(!Array.isArray(index?.registries)||index.registries.length===0)fail("REGISTRY_EMPTY");
 const seen=new Set();let total=0;
 for(const r of index?.registries||[]){
   if(typeof r.path!=="string"||!/^research\/(?:sources\/[^/]+\.json|references\.json)$/.test(r.path))fail("REGISTRY_PATH_INVALID");
   if(seen.has(r.path))fail("REGISTRY_PATH_DUPLICATED");seen.add(r.path);
   if(!Number.isSafeInteger(r.registeredRecords)||r.registeredRecords<0)fail("REGISTRY_RECORD_COUNT_INVALID");
   else total+=r.registeredRecords;
   const e=entries.get(r.path);
   if(!e)fail("REGISTRY_PATH_NOT_IN_TREE");
   else if(e.mode!=="100644"||e.type!=="blob")fail("REGISTRY_NOT_NORMAL_BLOB");
 }
 if(total!==index.registeredRecords)fail("INDEX_TOTAL_MISMATCH");
 if(progress?.research?.registeredSources!==index.registeredRecords)fail("PROGRESS_RECORD_MISMATCH");
 if(progress?.research?.additionalRegistries!==index.registries.length)fail("PROGRESS_REGISTRY_MISMATCH");
 const meaning=`${index.registries.length}份Registry、${index.registeredRecords}条来源登记（非去重出版物）`;
 if(progress?.research?.registeredSourceCountMeaning!==meaning)fail("PROGRESS_DESCRIPTION_STALE");
 if(progress?.baseline?.domainCount!==11||progress.baseline.capabilityCount!==88||progress.baseline.workPackageCount!==36||progress.baseline.businessAssetCount!==17||progress.capabilities?.detailDraftedCount!==88||progress.workPackages?.detailedDraftedCount!==36)fail("BASELINE_DENOMINATOR_DRIFT");
 if(progress.stopConditionMet!==false&&((progress.businessAssets?.ownerSignatureCount||0)<17||(progress.businessAssets?.independentConsumerRealPassCount||0)<17))fail("UNSUPPORTED_COMPLETION");
 return {ok:errors.length===0,errors,registries:index.registries?.length||0,registeredRecords:index.registeredRecords,treeEntries:tree?.tree?.length||0};
};
const mutateRegistry=function mutateRegistry(kind,ind,pr,tree){
 if(kind==="duplicate_path")ind.registries.push({...ind.registries[0]});
 else if(kind==="negative_count")ind.registries[0].registeredRecords=-1;
 else if(kind==="index_sum")ind.registeredRecords++;
 else if(kind==="missing_path")ind.registries[0].path="research/sources/missing-b102.json";
 else if(kind==="gitlink_mode"){let x=tree.tree.find(e=>e.path===ind.registries[0].path);x.mode="160000";x.type="commit"}
 else if(kind==="tree_truncated")tree.truncated=true;
 else if(kind==="tree_identity")tree.sha="0".repeat(40);
 else if(kind==="stale_description")pr.research.registeredSourceCountMeaning="206份Registry、1584条来源登记（非去重出版物）";
 else if(kind==="record_progress")pr.research.registeredSources++;
 else if(kind==="baseline_88")pr.baseline.capabilityCount=89;
 else if(kind==="fake_complete")pr.stopConditionMet=true;
 else if(kind==="registry_progress")pr.research.additionalRegistries--;
};
function run(){
  const root=path.resolve(__dirname,'..');
  const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const ind=read('research/source-index.json'),pr=read('tracking/progress.json');
  const treeSha=cp.execFileSync('git',['rev-parse','HEAD^{tree}'],{cwd:root,encoding:'utf8'}).trim();
  const raw=cp.execFileSync('git',['ls-tree','-r','-z','HEAD'],{cwd:root,encoding:'utf8'});
  const entries=raw.split('\0').filter(Boolean).map(line=>{
    const tab=line.indexOf('\t'),head=line.slice(0,tab).split(' ');
    return {mode:head[0],type:head[1],sha:head[2],path:line.slice(tab+1)};
  });
  const tree={sha:treeSha,truncated:false,tree:entries};
  const live=auditRegistry(ind,pr,tree,treeSha);
  const fixtures=read('docs/capabilities/CAP-01-08/registry-consistency-b102-fixtures-v08.json');
  let passed=0;const failures=[];
  for(const c of fixtures.cases){
    const i=structuredClone(ind),p=structuredClone(pr),t=structuredClone(tree);
    mutateRegistry(c.mutation,i,p,t);
    const a=auditRegistry(i,p,t,treeSha);
    const ok=c.expected==='PASS'?a.ok:a.errors.includes(c.expected);
    if(ok)passed++;else failures.push({id:c.id,expected:c.expected,got:a.errors});
  }
  const out={checker:'B102',status:live.ok&&failures.length===0?'PASS':'FAIL',live,fixturePassed:passed,fixtureTotal:fixtures.cases.length,fixtureFailures:failures,head:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),treeSha};
  process.stdout.write(JSON.stringify(out,null,2)+'\n');
  if(out.status!=='PASS')process.exitCode=1;
}
if(require.main===module)run();
module.exports={auditRegistry,mutateRegistry};

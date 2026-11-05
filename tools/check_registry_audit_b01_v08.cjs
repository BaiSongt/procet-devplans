#!/usr/bin/env node
// 本工具只对规划证据进行结构、Git Blob身份及合成负例检查；不访问产品仓、不触发网络或CI。
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('research/source-index.json'),audit=read('research/audits/REGISTRY-AUDIT-B01-2026-10-28.json'),trace=read('research/traces/REGISTRY-AUDIT-B01-V08.json'),fixtures=read('docs/architecture/v0.8/registry-audit-b01-fixtures-v08.json'),coverage=read('docs/architecture/v0.8/cross-coverage-v08.json');
const assert=(v,m)=>{if(!v)throw Error('规划证据异常：'+m);};
assert(index.registries.length===127&&index.registries.reduce((n,x)=>n+x.registeredRecords,0)===1075,'source-index登记总数漂移');
const bucket=new Map();let totals={records:0,withInlineRules:0,emptyInlineRules:0,noInlineRulesField:0,catalogAbstract:0,sectionText:0},ids=new Set();
for(const r of audit.registries){
  const bytes=fs.readFileSync(path.join(root,r.path)),blobSha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
  assert(blobSha===r.blobSha,'源文件确切Blob变更: '+r.path);
  const j=JSON.parse(bytes.toString('utf8')),entries=j.sources||j.records;
  assert(Array.isArray(entries)&&entries.length===r.records&&r.arrayField===(j.sources?'sources':'records'),'结构/计数漂移: '+r.path);
  const original=index.registries.find(x=>x.path===r.path);
  assert(original&&original.registeredRecords===entries.length,'来源索引不一致: '+r.path);
  let c={records:entries.length,withInlineRules:0,emptyInlineRules:0,noInlineRulesField:0,catalogAbstract:0,sectionText:0};
  for(const s of entries){
    assert(s.id&&!ids.has(s.id)&&s.title&&/^https:\/\//.test(s.url)&&s.accessedOn,'原登记身份/URL/访问日期: '+r.path);
    ids.add(s.id);bucket.set(r.path+'#'+s.id,s);
    const k=Array.isArray(s.rules)?(s.rules.length?'withInlineRules':'emptyInlineRules'):'noInlineRulesField';c[k]++;
    const depth=s.accessDepth||s.readDepth;
    assert(depth==='catalog_abstract'||depth==='section_text','原登记阅读深度未支持: '+s.id);
    c[depth==='catalog_abstract'?'catalogAbstract':'sectionText']++;
  }
  for(const k of Object.keys(totals)){assert(c[k]===r[k],'本文件审计统计漂移: '+r.path+' '+k);totals[k]+=c[k];}
  assert(JSON.stringify(entries.filter(x=>!Array.isArray(x.rules)||!x.rules.length).map(x=>x.id))===JSON.stringify(r.unlinkedIds),'内联规则缺口漂移');
}
for(const k of Object.keys(totals))assert(totals[k]===audit.totals[k],'总计漂移：'+k);
assert(ids.size===117&&audit.externallyRecheckedOriginalSources.length===6,'第一批范围漂移');
const byId=new Map(audit.externallyRecheckedOriginalSources.map(x=>[x.id,x]));
for(const e of audit.externallyRecheckedOriginalSources){
  const source=bucket.get(e.registryPath+'#'+e.id);
  assert(source&&source.url===e.url&&(source.accessDepth||source.readDepth)===e.accessDepth,'官方样例原来源偏移：'+e.id);
  const cap=coverage.capabilities.find(x=>x.id===e.capabilityId);
  assert(cap&&cap.originalWorkPackages.includes(e.originalWorkPackageId),'原CAP到包映射偏移：'+e.id);
}
function valid(c){
 const r=trace.rules.find(x=>x.id===c.ruleId),e=byId.get(c.claim.sourceId),x=c.claim;
 return !!r&&!!e&&r.sourceIds.includes(x.sourceId)&&e.registryPath===x.registryPath&&audit.registries.find(z=>z.path===x.registryPath)?.blobSha===x.registryBlobSha&&x.sourceUrl===e.url&&x.readDepth===e.accessDepth&&r.capabilityIds.includes(x.capabilityId)&&r.originalWorkPackages.includes(x.originalWorkPackageId)&&r.fieldPaths.includes(x.field)&&x.fullStandardRead===false&&x.humanApproval==='PENDING_HUMAN'&&x.product==='NOT_RUN';
}
let count=0;for(const c of fixtures.cases){assert((valid(c)?'PLANNING_PASS':'REJECT')===c.expected,'独立变异失败：'+c.id);count++;}
assert(count===54&&trace.rules.length===6,'规则及案例数量漂移');
const policy=trace.domainConstraints;
assert(policy.oneBabylonWorld&&policy.oneLeftTaskPanel&&policy.guiCliAgentSameOwnerPort&&policy.ownerExactRevisionHashFrame&&policy.casAclScopeCancelAtCommit&&policy.abFrozenProtected&&policy.materialSweepNotRequired&&policy.lateAckRestoresAuthority===false&&policy.setupD04EqualsExecutedD10===false&&policy.neutralClCountsAsFinalNcAcceptance===false&&policy.unknownSemanticCanRelease===false&&policy.l3==='PENDING_HUMAN'&&policy.product==='NOT_RUN','不变工程边界漂移');
console.log('规划静态'+count+'/54 PASS；10 Registry/117登记结构与Blob核对；6外部来源本地证据映射；真实产品/17消费者NOT_RUN。');

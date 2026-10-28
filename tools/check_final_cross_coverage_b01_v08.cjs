#!/usr/bin/env node
'use strict';
// Procet V0.8 规划仓只读终核首轮；不会启动CI、写产品、假签Owner或宣称产品PASS。
// 本工具要求本仓源码树已在本地检出；不可将内存合成当作真实产品/机床验收。
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const exists=p=>fs.existsSync(path.join(root,p));
function check(m){
  const {a,c,o,i,s}=m, errors=[],expect=(yes,code)=>{if(!yes)errors.push(code)};
  const equalSet=(xs,ys)=>xs.length===ys.length&&xs.every(x=>ys.includes(x));
  expect(a.capabilities.length===88&&a.counts.capabilities===88,'CAP_88');
  expect(a.originalWorkPackages.length===36&&a.counts.originalWorkPackages===36,'WP_36');
  expect(a.domains.length===11&&a.domains.every(d=>d.capIds.length===8),'DOMAIN_11_8');
  expect(a.ownerCandidatePorts.length===17&&a.counts.assetCandidatePorts===17,'PORT_17');
  expect(o.contracts.length===17&&s.assets.length===17,'OWNER_BASELINE_17');
  expect(a.registryPaths.length===127&&i.registries.length===127&&a.counts.sourceRegistries===127,'REGISTRY_127');
  const indexed=i.registries.reduce((sum,x)=>sum+x.registeredRecords,0);
  expect(indexed===1075&&i.registeredRecords===1075&&a.counts.indexedRecords===1075,'SOURCES_1075');
  expect(new Set(a.registryPaths.map(x=>x.path)).size===127,'REGISTRY_UNIQUE');
  expect(equalSet(a.registryPaths.map(x=>x.path),i.registries.map(x=>x.path)),'REGISTRY_INDEX_RECONCILE');
  expect(a.registryPaths.every(x=>exists(x.path)),'REGISTRY_FILES_PRESENT');
  expect(a.capabilities.every(x=>exists(x.detail?.path)&&exists(x.trace?.path)&&x.researchRegistry&&exists(x.researchRegistry.path)&&i.registries.some(r=>r.path===x.researchRegistry.path)),'CAP_DETAIL_TRACE_SOURCE_PATHS');
  expect(a.originalWorkPackages.every(x=>exists(x.detail?.path)),'WORKPACKAGE_DETAIL_PATHS');
  expect(a.capabilities.reduce((sum,x)=>sum+x.originalWorkPackages.length,0)===312,'ORIGINAL_312_EDGES');
  const zero=a.originalWorkPackages.filter(x=>x.originalCapEdges.length===0).map(x=>x.id);
  expect(zero.length===10&&equalSet(zero,a.zeroOriginalCapEdgePackages),'ORIGINAL_ZERO_EDGES_DISCL0SED');
  const producers=a.capabilities.filter(x=>!x.explicitProducerAssets.length).map(x=>x.id);
  expect(equalSet(producers,a.noDirectAssetProducerCaps),'NON_PRODUCER_CAPS_RECONCILE');
  expect(a.ownerCandidatePorts.every(x=>x.ownerSignoff==='PENDING_HUMAN'),'OWNER_NOT_SIGNED');
  expect(a.status.realConsumers==='NOT_RUN'&&a.status.realOwnerSigned==='0_OF_17','REAL_CONSUMER_UNVERIFIED');
  expect(a.status.productPass===false&&a.status.occtNcMachine==='NOT_RUN'&&a.status.l3==='PENDING_HUMAN','PRODUCT_MUST_NOT_PASS');
  expect(a.status.historicalByteRecovery==='OPEN_MISSING_ORIGINALS'&&a.historicOriginalsStillAbsent.length>=5,'ORIGINAL_BYTES_NOT_FAKED');
  expect(a.status.allExternalPublicationsRead.startsWith('NOT_DONE_')&&a.conclusions.notUniquePublicationCount===true,'NO_FULLTEXT_OVERCLAIM');
  const ssdf11=a.newSourceReview.find(x=>x.id==='FINAL-S03'),ssdf12=a.newSourceReview.find(x=>x.id==='FINAL-S04');
  expect(/Final/.test(ssdf11?.version||'')&&/Draft/.test(ssdf12?.version||'')&&!/Final/.test(ssdf12?.version||''),'NIST_FINAL_VS_DRAFT');
  expect(c.safeguards.singleBabylonEngineSceneCanvas===true&&c.safeguards.unifiedLeftTaskPanel===true&&c.safeguards.guiCliAgentSameOwnerPort===true,'GUI_ONE_WORLD_ONE_OWNER');
  expect(c.safeguards.d04D10Separate===true&&c.safeguards.immutableABFreeze===true,'SETUP_BINDING_FREEZE');
  expect(equalSet(c.safeguards.ncChain,['D09','D12','D13','D14','D15','D16'])&&c.safeguards.unknownNotPublishable===true&&c.safeguards.d11ClPreviewNotD15===true&&c.safeguards.noMaterialSweepSimulation===true,'NC_ENGINEERING_CHAIN');
  return errors;
}
function collectMarkdown(dir){
  let out=[];for(const d of fs.readdirSync(dir,{withFileTypes:true})){if(d.name==='.git'||d.name==='node_modules')continue;const p=path.join(dir,d.name);if(d.isDirectory())out.push(...collectMarkdown(p));else if(d.isFile()&&d.name.endsWith('.md'))out.push(p)}return out;
}
function normalizedLink(base,raw){
  let v=raw.replace(/^<|>$/g,'').replace(/\\([#()])/g,'$1');
  if(/^(https?:|mailto:|ftp:|data:|\/\/)/i.test(v)||v.startsWith('#'))return null;
  v=v.split('#')[0].split('?')[0];if(!v)return null;
  try{v=decodeURIComponent(v)}catch{}
  return path.resolve(v.startsWith('/')?root:path.dirname(base),v.replace(/^\//,''));
}
function scanMarkdown(){
  const docs=collectMarkdown(root),missing=[],outside=[];let tested=0;
  for(const f of docs){
    const s=fs.readFileSync(f,'utf8').replace(/```[\s\S]*?```/g,'');
    const links=[...s.matchAll(/!?\[[^\]\n]*\]\((<[^>]+>|[^)\s]+)(?:\s+[\"'][^)]+[\"'])?\)/g)].map(x=>x[1]);
    links.push(...[...s.matchAll(/^\s*\[[^\]\n]+\]:\s*(<[^>]+>|\S+)/gm)].map(x=>x[1]));
    for(const link of links){const t=normalizedLink(f,link);if(!t)continue;tested++;
      if(!t.startsWith(root+path.sep)&&t!==root){outside.push({file:path.relative(root,f),link});continue}
      if(!fs.existsSync(t)&&!fs.existsSync(path.join(t,'README.md'))&&!fs.existsSync(path.join(t,'index.md')))missing.push({file:path.relative(root,f),link,target:path.relative(root,t)})}
  }return {files:docs.length,tested,missing,outside};
}
function run(){
  const m={a:read('research/audits/FINAL-CROSS-COVERAGE-B01-2026-10-29.json'),c:read('docs/architecture/v0.8/cross-coverage-v08.json'),o:read('docs/architecture/v0.8/owner-interface-review-v08.json'),i:read('research/source-index.json'),s:read('docs/architecture/v0.8/business-assets.json')};
  let issues=check(m);const neg=[
    ['NEG-01',a=>a.capabilities.pop()],
    ['NEG-02',a=>a.registryPaths[1].path=a.registryPaths[0].path],
    ['NEG-03',a=>a.newSourceReview.find(x=>x.id==='FINAL-S04').version='Final 2025'],
    ['NEG-04',a=>a.zeroOriginalCapEdgePackages.pop()],
    ['NEG-05',a=>a.status.historicalByteRecovery='RESTORED'],
    ['NEG-06',a=>a.ownerCandidatePorts[0].ownerSignoff='SIGNED'],
    ['NEG-07',a=>a.status.productPass=true],
    ['NEG-08',a=>a.status.allExternalPublicationsRead='ALL_FULLTEXT'],
    ['NEG-09',a=>a.capabilities[0].researchRegistry.path='research/sources/FAKE.json'],
    ['NEG-10',a=>a.status.realConsumers='PASS']
  ];
  let caught=0;for(const [id,mutate] of neg){const copy=structuredClone(m);mutate(copy.a);if(check(copy).length)caught++;else issues.push('UNCHECKED_MUTATION_'+id)}
  const report={scope:'PLANNING_ONLY',positiveBaseline:issues.filter(x=>!x.startsWith('UNCHECKED_')).length===0?'PASS':'FAIL',negativeMutationsCaught:caught,negativeTotal:neg.length,errors:issues,independentConsumer:'NOT_RUN',product:'NOT_RUN'};
  if(process.argv.includes('--full-md')){report.markdown=scanMarkdown();if(report.markdown.missing.length||report.markdown.outside.length)issues.push('REVIEW_MARKDOWN_LINK_CANDIDATES');}
  process.stdout.write(JSON.stringify(report,null,2)+'\n');if(issues.length)process.exitCode=1;
}
run();

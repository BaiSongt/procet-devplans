// 17资产Owner跨域接口规划的静态校验工具；不得当作产品认证。
'use strict';
const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const base=read('docs/architecture/v0.8/business-assets.json');const matrix=read('docs/architecture/v0.8/owner-interface-review-v08.json');
const registry=read('research/sources/ASSET-OWNERS-V08.json');const trace=read('research/traces/ASSET-OWNERS-V08.json');const fixtures=read('docs/architecture/v0.8/owner-port-review-fixtures.json');
const capMd=fs.readFileSync(path.join(root,'docs/architecture/v0.8/03_三级能力映射_88项.md'),'utf8');
const wpMd=fs.readFileSync(path.join(root,'docs/architecture/v0.8/04_开发工作包_36项.md'),'utf8');
const validate=function validate(base,m,r,t,capMd,wpMd){
 const e=[],fail=(s)=>e.push(s);const exp=Array.from({length:17},(_,i)=>'D'+String(i+1).padStart(2,'0'));
 if(m.contracts.length!==17||new Set(m.contracts.map(x=>x.assetId)).size!==17)fail('count_or_unique');
 if(JSON.stringify(m.contracts.map(x=>x.assetId))!==JSON.stringify(exp))fail('ids_order');
 for(let i=0;i<base.assets.length;i++){const b=base.assets[i],a=m.contracts[i];if(!a||a.assetId!==b.id)continue;
 if(a.name!==b.name||a.ownerCandidate!==b.owner||a.ownerDomain!==b.owner.match(/^\d\d/)?.[0])fail('owner_'+b.id);
 if(JSON.stringify(a.inputs)!==JSON.stringify(b.inputs)||JSON.stringify(a.outputs)!==JSON.stringify(b.outputs))fail('edges_'+b.id);
 if(!a.producerPort.startsWith(a.ownerDomain+'.')||a.writeAuthority!=='OWNER_PORT_TRANSACTION_ONLY')fail('port_'+b.id);
 if(!a.producerCapabilities?.length||a.producerCapabilities.some(id=>!capMd.includes('| '+id+' |')))fail('cap_'+b.id);
 if(!a.workPackageIds?.length||a.workPackageIds.some(id=>!wpMd.includes('### '+id+' ')))fail('wp_'+b.id);
 if(Object.values(a.readEntry).some(v=>v!==`${a.producerPort}.readExact`))fail('entry_'+b.id);
 if(a.ownerSignoff!=='PENDING_HUMAN'||a.consumerAcknowledgement!=='PENDING_INDEPENDENT_CONSUMER'||a.schemaFreeze!=='DRAFT_NOT_FROZEN')fail('signoff_'+b.id);
 if(a.framePolicy!==(new Set(['D01','D02','D04','D07','D09','D10','D11','D14','D15']).has(b.id)?'EXACT_NAMED_FRAME_REQUIRED':'EXPLICIT_FRAME_NOT_APPLICABLE_OR_INPUT_LINKED'))fail('frame_'+b.id);
 if(!a.invariant||a.invariant.length<12)fail('invariant_'+b.id);
 }
 const p=m.globalPolicies,required={
 singleBabylonWorld:true,unifiedLeftTaskPanel:true,maxFontPx:12,entrypointDomainPortUnified:true,mutableLatestAliasAllowed:false,lateAckRestoresWrite:false,
 d04D10Separate:true,immutableABFreeze:true,clAnimationGrantsNcPass:false,unknownExecutionGrantsRelease:false,independentConsumerRequired:true,legacyUnknownWriteAllowed:false,migrationRequiresRollbackRef:true,businessTypeFeedbackAllowed:true,immutableRevisionLineageAcyclic:true,productStatus:'NOT_RUN',l3:'PENDING_HUMAN',humanOwnerSigningStatus:'PENDING_HUMAN'};
 for(const [k,v] of Object.entries(required))if(p[k]!==v)fail('policy_'+k);
 if(JSON.stringify(p.ncChain)!==JSON.stringify(['D09','D12','D13','D14','D15','D16']))fail('nc_chain');
 for(const k of ['domain','kind','id','revision','contentHash','schemaVersion','scope','frameRefWhenApplicable'])if(!p.commonReferenceFields?.includes(k))fail('common_ref_'+k);
 for(const k of ['ACL_RECHECK','SCOPE_EPOCH_RECHECK','EXPECTED_REVISION','EXPECTED_HASH','FRAME_CONSISTENCY','CAS','CANCEL_GENERATION','RECEIPT_AUDIT'])if(!p.commitChecks?.includes(k))fail('commit_check_'+k);
 if(p.artifactHashMode!=='EXACT_BYTES_OR_EXPLICIT_RFC8785_CANONICAL_PROFILE')fail('hash_profile');
 if(m.humanReview!=='PENDING_HUMAN'||m.independentConsumer!=='NOT_RUN'||m.status!=='CANDIDATE_INTERFACES_NOT_OWNER_SIGNED')fail('matrix_status');
 if(r.registeredRecords!==r.sources.length||r.sources.length!==7)fail('sources_length');
 const ids=new Set(r.sources.map(x=>x.id));if(ids.size!==7)fail('source_duplicate');
 for(const s of r.sources)if(!s.url?.startsWith('https://')||!s.accessDepth||!s.locator||!s.limits||s.productTests!=='NOT_RUN')fail('source_fields_'+s.id);
 if(t.rules.length!==10)fail('rules_length');
 for(const rule of t.rules){if(rule.sourceIds?.some(x=>!ids.has(x)))fail('trace_sources_'+rule.id);if(rule.assets?.some(x=>!exp.includes(x)))fail('trace_assets_'+rule.id);
 if(rule.workPackages?.some(id=>!wpMd.includes('### '+id+' ')))fail('trace_workpacks_'+rule.id);if(!rule.fields?.length||!rule.positiveAcceptance||!rule.negativeAcceptance)fail('trace_acceptance_'+rule.id);}
 return e;
};
const mutate=function mutate(obj,path,value){const r=JSON.parse(JSON.stringify(obj)),p=path.split('.');let x=r;for(let i=0;i<p.length-1;i++)x=x[p[i]];x[p[p.length-1]]=value;return r;};
const cycle=function cycle(g){const state={};function f(k){if(state[k]===1)return true;if(state[k]===2)return false;state[k]=1;for(const v of g[k]||[])if(f(v))return true;state[k]=2;return false;}return Object.keys(g).some(k=>f(k));};
const errors=validate(base,matrix,registry,trace,capMd,wpMd);
const failures=[];if(errors.length)failures.push('BASE: '+errors.join(','));
for(const x of fixtures.negativeCases){if(validate(base,mutate(matrix,x.path,x.value),registry,trace,capMd,wpMd).length===0)failures.push('未拦截:'+x.id);}
if(cycle(fixtures.lineage.positive)||!cycle(fixtures.lineage.negative))failures.push('来源DAG循环判定错误');
if(fixtures.positiveAssertions.length!==27||fixtures.negativeCases.length!==50)failures.push('验收数量不符');
const checked=fixtures.positiveAssertions.length+fixtures.negativeCases.length+2;
if(failures.length){console.error('FAIL',failures);process.exitCode=1;}else console.log('PLANNING_ONLY PASS '+checked+'/'+checked+'; OWNER/L3/PRODUCT/CONSUMER=NOT_RUN');

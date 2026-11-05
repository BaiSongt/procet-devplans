#!/usr/bin/env node
// Procet V0.8 B17：只读17资产/44业务类型边与候选Owner跨域交接门禁；不代表产品验收。
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));
function validate17(b,o,revisionGraph) {
 const errors=new Set();
 const fail=c=>errors.add(c);
 if(b.asset_count!==17||!Array.isArray(b.assets)||b.assets.length!==17||!Array.isArray(o.contracts)||o.contracts.length!==17||o.frozenBaseline?.assetCount!==17)fail("COUNT_17");
 const by=new Map((b.assets||[]).map(x=>[x.id,x])), cb=new Map((o.contracts||[]).map(x=>[x.assetId,x]));
 if(by.size!==17||cb.size!==17||Array.from(by.keys()).some(id=>!cb.has(id)))fail("ID_SET");
 let edgeCount=0;
 for(const x of b.assets||[]){
  if(!/^D(0[1-9]|1[0-7])$/.test(x.id))fail("ID_SET");
  const c=cb.get(x.id);
  if(!c){fail("ID_SET");continue}
  if(!Array.isArray(x.inputs)||!Array.isArray(x.outputs)||!Array.isArray(c.inputs)||!Array.isArray(c.outputs)){fail("EDGE_RECIPROCITY");continue}
  const eq=(a,b)=>a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(z=>b.includes(z));
  if(!eq(x.inputs,c.inputs)||!eq(x.outputs,c.outputs))fail("CONTRACT_EDGE_DRIFT");
  for(const to of x.outputs){edgeCount++;if(!by.get(to)?.inputs?.includes(x.id))fail("EDGE_RECIPROCITY")}
  for(const from of x.inputs){if(!by.get(from)?.outputs?.includes(x.id))fail("EDGE_RECIPROCITY")}
  if(!/^\d\d\.[A-Za-z][A-Za-z0-9]*Port$/.test(c.producerPort||"")||c.producerPort.slice(0,2)!==c.ownerDomain)fail("OWNER_PORT");
  if(!["gui","cli","agent"].every(k=>c.readEntry?.[k]===c.producerPort+".readExact"))fail("ENTRYPOINT_CONSISTENCY");
  if(c.ownerSignoff!=="PENDING_HUMAN"||c.consumerAcknowledgement!=="PENDING_INDEPENDENT_CONSUMER"||c.schemaFreeze!=="DRAFT_NOT_FROZEN")fail("FALSE_APPROVAL");
  if(!["EXACT_NAMED_FRAME_REQUIRED","EXPLICIT_FRAME_NOT_APPLICABLE_OR_INPUT_LINKED"].includes(c.framePolicy))fail("FRAME_QUALIFICATION");
  if(c.writeAuthority!=="OWNER_PORT_TRANSACTION_ONLY")fail("OWNER_WRITE_AUTHORITY");
 }
 if(edgeCount!==44)fail("EDGE_COUNT");
 if(new Set((o.contracts||[]).map(x=>x.producerPort)).size!==17)fail("OWNER_PORT");
 const p=o.globalPolicies||{}, fields=p.commonReferenceFields||[],check=p.commitChecks||[];
 for(const field of ["domain","kind","id","revision","contentHash","schemaVersion","scope","frameRefWhenApplicable"])if(!fields.includes(field))fail("EXACT_REFERENCE_FIELDS");
 for(const item of ["ACL_RECHECK","SCOPE_EPOCH_RECHECK","EXPECTED_REVISION","EXPECTED_HASH","FRAME_CONSISTENCY","CAS","CANCEL_GENERATION","RECEIPT_AUDIT"])if(!check.includes(item))fail("COMMIT_RECHECK");
 if(p.artifactHashMode!=="EXACT_BYTES_OR_EXPLICIT_RFC8785_CANONICAL_PROFILE"||p.mutableLatestAliasAllowed!==false)fail("HASH_AND_LATEST");
 if(p.singleBabylonWorld!==true||p.unifiedLeftTaskPanel!==true||p.maxFontPx!==12||p.entrypointDomainPortUnified!==true)fail("GUI_3D_BOUNDARY");
 if(p.lateAckRestoresWrite!==false||p.immutableABFreeze!==true||p.migrationRequiresRollbackRef!==true)fail("CANCEL_FREEZE_ROLLBACK");
 if(p.d04D10Separate!==true||cb.get("D04")?.producerPort===cb.get("D10")?.producerPort)fail("SETUP_EXECUTION_SEPARATION");
 if(p.clAnimationGrantsNcPass!==false||p.unknownExecutionGrantsRelease!==false||JSON.stringify(p.ncChain)!==JSON.stringify(["D09","D12","D13","D14","D15","D16"]))fail("NC_RELEASE_CLOSURE");
 if(by.get("D09")?.outputs?.includes("D16")||!by.get("D15")?.outputs?.includes("D16")||!by.get("D16")?.inputs?.includes("D15"))fail("CL_CANNOT_RELEASE");
 if(p.independentConsumerRequired!==true||p.productStatus!=="NOT_RUN"||p.l3!=="PENDING_HUMAN"||p.humanOwnerSigningStatus!=="PENDING_HUMAN")fail("HUMAN_CONSUMER_GATES");
 if(p.businessTypeFeedbackAllowed!==true||p.immutableRevisionLineageAcyclic!==true)fail("TYPE_VS_REVISION_GRAPH");
 if(revisionGraph){
  const nodes=new Map(revisionGraph.map(x=>[x.id,x.deps]));
  const done=new Set(), visiting=new Set();
  function visit(id){if(visiting.has(id)){fail("REVISION_CYCLE");return}if(done.has(id))return;
   if(!nodes.has(id)){fail("REVISION_MISSING_PARENT");return}
   visiting.add(id);for(const d of nodes.get(id)||[])visit(d);visiting.delete(id);done.add(id)}
  for(const id of nodes.keys())visit(id);
 }
 return [...errors].sort();
}
function mutate17(base,caseDef){
 const x=clone(base), parts=caseDef.path.split("."), leaf=parts.pop();
 let cur=x;for(const seg of parts){if(!(seg in cur))throw Error("无效路径 "+caseDef.path);cur=cur[seg]}
 if(caseDef.operation==="remove"){if(Array.isArray(cur))cur.splice(Number(leaf),1);else delete cur[leaf]}
 else if(caseDef.operation==="set")cur[leaf]=clone(caseDef.value);
 else throw Error("不支持的变异操作");
 return x;
}
function selftest(){
 const f=load('docs/architecture/v0.8/final-asset-b17-edge-fixtures-v08.json');
 const b=load(f.baselinePaths[0]),o=load(f.baselinePaths[1]);
 if(validate17(b,o,f.positive.revisionGraph).length)throw Error('远端候选资产基线不能通过结构正例');
 let n=0;
 for(const m of f.mutations){
  const bb=m.target==='baseline'?mutate17(b,m):b;
  const oo=m.target==='review'?mutate17(o,m):o;
  const errs=validate17(bb,oo,f.positive.revisionGraph);
  if(!errs.includes(m.expectedError))throw Error(m.id+': 未拒绝 '+m.expectedError+' 实际 '+errs);
  n++;
 }
 for(const m of f.revisionMutations){
  const errs=validate17(b,o,m.revisionGraph);
  if(!errs.includes(m.expectedError))throw Error(m.id+': 修订DAG负例遗漏');
  n++;
 }
 console.log(JSON.stringify({status:'PASS_SYNTHETIC_CANDIDATE_ONLY',candidateAssets:b.assets.length,
  candidateBusinessTypeEdges:b.assets.reduce((n,x)=>n+x.outputs.length,0),
  independentNegativeCases:n,ownerSignatures:'0/17',realIndependentConsumers:'0/17',
  product:'NOT_RUN',l3:'PENDING_HUMAN'},null,2));
}
if(process.argv.includes('--self-test'))selftest();
else {
 const b=load('docs/architecture/v0.8/business-assets.json');
 const o=load('docs/architecture/v0.8/owner-interface-review-v08.json');
 const errors=validate17(b,o);
 console.log(JSON.stringify({status:errors.length?'FAIL_CANDIDATE_STRUCTURE':'PASS_CANDIDATE_STRUCTURE_ONLY',
  errors,realConsumer:'NOT_RUN',product:'NOT_RUN'},null,2));
 if(errors.length)process.exitCode=1;
}

#!/usr/bin/env node
// B98：只读17资产业务边/候选Owner/独立消费者结构核验；不得充作真实验收。
'use strict';
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const root=path.resolve(__dirname,'..');
function load(p){const s=fs.readFileSync(path.join(root,p),'utf8');return [JSON.parse(s),s];}
function gitBlob(bytes){return crypto.createHash('sha1').update('blob '+Buffer.byteLength(bytes,'utf8')+'\\0','utf8').update(bytes,'utf8').digest('hex');}
function judge(m,b,o){
const err=(reason)=>({state:"REJECT",reason});const ids=b.assets.map(x=>x.id),omap=new Map(o.contracts.map(x=>[x.assetId,x]));
if(m.schemaVersion!=="procet-b98-asset-consumer-independence-v08")return err("SCHEMA");
if(!/^[0-9a-f]{40}$/.test(m.sourceHead)||!["assets","owners","priorB55"].every(k=>/^[0-9a-f]{40}$/.test(m.sourceBlobs?.[k]||"")))return err("SOURCE_SHA");
if(m.scope?.domains!==11||m.scope?.caps!==88||m.scope?.workPackages!==36||m.scope?.assets!==17||m.scope?.edges!==44||b.assets.reduce((n,x)=>n+x.outputs.length,0)!==44)return err("BASELINE_COUNTS");
if(!Array.isArray(m.rows)||m.rows.length!==17||new Set(m.rows.map(x=>x.assetId)).size!==17)return err("ROW_COVERAGE");
if(m.ownerSignedCount!==0||m.realConsumerAcceptedCount!==0||m.l3!=="PENDING_HUMAN")return err("UNSUPPORTED_APPROVAL");
const g=m.guardrails||{},keys=["sameOwnerPortGuiCliAgent","exactRevisionHashScopeFrame","ownerCommitAclScopeEpochCasCancelLateAck","d04D10Separate","abFreezePreserved","singleBabylonEngineSceneCanvas","oneActiveWorld","unifiedLeftTaskPanel","clPreviewIsNotNcValidation","unknownBlocksD16","noMaterialSweepSimulation"];
if(keys.some(k=>g[k]!==true)||g.maxFontPx!==12||JSON.stringify(g.ncChain)!==JSON.stringify(["D09","D12","D13","D14","D15","D16"]))return err("GUARDRAILS");
if(!m.hashPolicy?.startsWith("EXACT_SOURCE_BLOB_SHA1_ONLY"))return err("HASH_PROFILE");
for(const a of b.assets){
const r=m.rows.find(x=>x.assetId===a.id),p=omap.get(a.id);if(!r||!p||r.producerDomain!==p.ownerDomain||r.producerPort!==p.producerPort||r.assetName!==a.name||r.framePolicy!==p.framePolicy)return err("OWNER_PORT");
if(!a.outputs.includes(r.consumerAssetId)||!omap.has(r.consumerAssetId))return err("CONSUMER_EDGE");
const c=omap.get(r.consumerAssetId),hasCross=a.outputs.some(x=>omap.get(x)?.ownerDomain!==p.ownerDomain),same=c.ownerDomain===p.ownerDomain;
if(r.consumerDomain!==c.ownerDomain||r.consumerPort!==c.producerPort)return err("CONSUMER_PORT");
if(r.crossDomainAlternativeExists!==hasCross||r.independenceClass!==(same?"SAME_DOMAIN_SEPARATE_IMPLEMENTATION_REQUIRED":"CROSS_DOMAIN_CANDIDATE")||r.requiredSeparateBinary!==same|| (same&&hasCross))return err("INDEPENDENCE_CLASS");
if(["gui","cli","agent"].some(k=>r.readEntry?.[k]!==p.readEntry?.[k]))return err("ENTRYPOINT");
if(r.ownerSignoff!=="PENDING_HUMAN"||r.independentConsumerAcceptance!=="NOT_RUN"||r.productStatus!=="NOT_RUN"||r.evidenceArtifact!==null||r.independentBinaryEvidence!==null)return err("FALSE_EVIDENCE");
if(!r.negativeBusinessScenario?.code||!r.negativeBusinessScenario.description||r.negativeBusinessScenario.expected!=="REJECT_OR_UNKNOWN_NOT_PUBLISHABLE"||r.receiptRequired?.length!==14)return err("SCENARIO_OR_RECEIPT");
}
if(new Set(m.rows.map(x=>x.negativeBusinessScenario.code)).size!==17)return err("SCENARIO_DUPLICATE");
const exceptions=m.rows.filter(x=>x.requiredSeparateBinary).map(x=>x.assetId).sort();
if(JSON.stringify(exceptions)!==JSON.stringify(["D14","D16"]))return err("ORPHAN_EXCEPTIONS");
return {state:"PASS_CANDIDATE_SHAPE_ONLY",reason:"17_ASSETS_44_EDGES_15_CROSS_2_SAME_DOMAIN_NO_REAL_PROOF"};
}
function mutate(s,t){
const m=JSON.parse(JSON.stringify(s)),r=m.rows.find(x=>x.assetId===t.target);
switch(t.operation){
case"NO_MUTATION":break;
case"BAD_CONSUMER":r.consumerAssetId="D99";break;
case"FORGE_SIGNOFF":r.ownerSignoff="SIGNED";break;
case"BAD_OWNER":r.producerDomain="03";break;
case"BAD_PORT":r.producerPort="09.WrongPort";break;
case"FORGE_CROSS":r.independenceClass="CROSS_DOMAIN_CANDIDATE";break;
case"FORGE_CONSUMER":r.independentConsumerAcceptance="PASS";break;
case"BAD_READ_ENTRY":r.readEntry.agent="wrong.readExact";break;
case"BAD_FRAME":r.framePolicy="CAMERA_FRAME";break;
case"BAD_GUARDRAIL":m.guardrails.d04D10Separate=false;break;
case"BAD_HASH_MODE":m.hashPolicy="JSON.stringify_UNVERSIONED";break;
case"DROP_ROW":m.rows.pop();break;
case"DUP_SCENARIO":r.negativeBusinessScenario.code=m.rows[0].negativeBusinessScenario.code;break;
case"BAD_REALCOUNT":m.realConsumerAcceptedCount=1;break;
default:throw Error(t.operation)
}return m}
function main(){
const [m]=load('docs/architecture/v0.8/asset-consumer-independence-b98-v08.json');
const [b,bt]=load('docs/architecture/v0.8/business-assets.json');
const [o,ot]=load('docs/architecture/v0.8/owner-interface-review-v08.json');
const [f]=load('docs/architecture/v0.8/asset-consumer-independence-b98-fixtures-v08.json');
if(gitBlob(bt)!==m.sourceBlobs.assets||gitBlob(ot)!==m.sourceBlobs.owners)throw Error('SOURCE_GIT_BLOB_MISMATCH');
const r=judge(m,b,o);if(r.state!=='PASS_CANDIDATE_SHAPE_ONLY')throw Error(JSON.stringify(r));
let tested=0;for(const c of f.cases){const x=judge(mutate(m,c),b,o),actual=x.state==='REJECT'?x.reason:x.state;if(actual!==c.expected)throw Error('CASE '+c.id+' '+actual+' != '+c.expected);tested++}
if(tested!==f.caseCount||new Set(f.distinctBusinessNegativeScenarios.map(x=>x.code)).size!==17)throw Error('CASE_OR_SCENARIO_COUNT');
console.log(JSON.stringify({status:'PASS_STATIC_CANDIDATE_ONLY',cases:tested,assets:m.rows.length,edges:44,requiredIndependentSameDomain:m.rows.filter(x=>x.requiredSeparateBinary).map(x=>x.assetId),ownerSignoff:'0/17',realConsumer:'0/17',product:'NOT_RUN'}));}
try{main()}catch(e){console.error('B98_REJECT:',e.message);process.exitCode=1}

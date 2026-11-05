#!/usr/bin/env node
// 中文：W2-05规划合成Oracle；只核对文档证据，不访问用户数据库。
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const trace=read("research/traces/W2-05.json"),fx=read("docs/work-packages/W2-05/fixtures.json");
const source=read("research/sources/W2-05.json"),owner=read("docs/work-packages/W2-05/asset-owner-candidates.json");
const baseline=read("docs/architecture/v0.8/business-assets.json");
const test={"EXACT_SETUP_CONTEXT":(s=>["projectId","documentId","branchId","setupId","revision","contentHash","hashKind","frame","unit","ownerPortVersion"].every(k=>!!s.context[k])),
"DIRECT_OWNER_QUERY":(s=>!s.navigation.requiresRecognition&&s.navigation.authoritative&&!s.navigation.activeGuiStoreOnly),
"MANY_TO_MANY_STABLE_UID":(s=>s.relation.feature1StepCount===2&&s.relation.step1FeatureCount===2&&s.relation.stableUid&&s.relation.exactRevisions&&s.relation.edges.length===3&&new Set(s.relation.edges.map(e=>e.join(":"))).size===3),
"EXACT_SETUP_SCOPE":(s=>s.navigation.requestedSetupId===s.context.setupId&&s.navigation.returnedSetupIds.length>0&&s.navigation.returnedSetupIds.every(v=>v===s.context.setupId)),
"EXACT_FEATURE_PROVENANCE":(s=>s.sources.d02Owner==="D02"&&s.sources.d04Owner==="D04"&&s.sources.d05Owner==="D05"&&s.sources.featureRevision===s.sources.expectedFeatureRevision&&!!s.sources.featureHash&&s.sources.branchMatched),
"TRANSFER_FRAME_EVIDENCE":(s=>s.transfer.fromSetup!==s.transfer.toSetup&&s.transfer.frameChain.length>=2&&s.transfer.resolved&&s.transfer.roundtripPass&&s.transfer.unitVerified&&s.transfer.materialIndependentlyVerified),
"REBUILDABLE_READONLY_PROJECTION":(s=>s.projection.readOnly&&s.projection.ownerWrites===0&&s.projection.rebuildSameHash&&s.projection.staleReported),
"CAS_ACL_CANCEL_GENERATION":(s=>s.guard.readAcl&&s.guard.commitAcl&&s.guard.headExpected===s.guard.headCurrent&&s.guard.epochExpected===s.guard.epochCurrent&&s.guard.generation===s.guard.liveGeneration&&!s.guard.cancelled&&!s.guard.lateReceipt),
"UNKNOWN_NOT_EMPTY":(s=>(s.missing.sourceAvailable||s.missing.missingStatus==="UNKNOWN_MISSING_SOURCE")&&!s.missing.returnedAsEmpty),
"NO_FALSE_QUALIFICATION_OR_CROSS_DIRTY":(s=>s.otherSetup.oldHash===s.otherSetup.newHash&&s.otherSetup.frozenD08Unchanged&&s.qualification.d11==="CL_PREVIEW"&&s.qualification.d13==="UNKNOWN"&&!s.qualification.d15Pass&&!s.qualification.d16Released)};
function merge(a,b){if(!b||typeof b!=="object"||Array.isArray(b))return b;const out={...(a||{})};for(const [k,v] of Object.entries(b))out[k]=merge(out[k],v);return out;}
function requireTrue(ok,msg){if(!ok)throw Error(msg);}
requireTrue(trace.rules.length===10&&fx.cases.length===20&&source.sources.length===8,"数量");
const srcIds=new Set(source.sources.map(x=>x.id)),ownerMap=new Map(baseline.assets.map(x=>[x.id,x.owner]));
requireTrue(owner.assets.length===17&&ownerMap.size===17,"资产");
for(const a of owner.assets)requireTrue(ownerMap.get(a.id)===a.canonicalOwner&&a.crossDomainSignoff==="PENDING_HUMAN","Owner身份");
for(const s of source.sources)requireTrue(s.accessDepth&&s.locator&&s.limits&&s.url.startsWith("https://"),"来源信息");
for(const r of trace.rules){requireTrue(test[r.summary]&&r.sourceIds.length>=2&&r.sourceIds.every(id=>srcIds.has(id)),"规则来源");
requireTrue(r.assets.every(a=>ownerMap.has(a))&&r.fields.length>0,"资产字段");
for(const f of r.fields){let x=fx.baseScenario;for(const seg of f.split("."))x=x?.[seg];requireTrue(x!==undefined,"源字段缺失 "+f);}
for(const [polarity,id] of [["positive",r.positiveTestId],["negative",r.negativeTestId]]){const c=fx.cases.find(c=>c.id===id);requireTrue(c?.polarity===polarity&&c.ruleId===r.id,"正反编号");
requireTrue(Boolean(test[r.summary](merge(fx.baseScenario,c.overrides)))===(polarity==="positive"),"用例断言 "+id);
requireTrue(c.expected===(polarity==="positive"?"PLANNING_ONLY":r.negativeReason),"返回码");}}
console.log("W2-05：8来源、10规则、20正反、17Owner候选 SYNTHETIC PASS；产品/独立消费者 NOT_RUN；L3 PENDING");

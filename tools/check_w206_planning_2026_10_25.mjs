#!/usr/bin/env node
// 中文：W2-06仅检查规划关系和合成测试向量；不得声称真实进程/产品通过。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const judge=function judge(k,s){switch(k){
case "REAL_SERVICE_HEADLESS":return s.service.realOwnerPorts&&!s.service.uiMock&&s.service.childProcess&&s.service.sandboxOnly&&s.service.noUserDbMutation;
case "EXACT_ASSET_CLOSURE":return ["projectId","documentId","branchId","setupId"].every(k=>!!s.context[k])&&["revision","hash"].every(k=>!!s.context.d01[k]&&!!s.context.d04[k])&&!!s.context.d04.frame&&!!s.context.d04.unit;
case "A_TO_B_ORDERED_HANDOFF":return JSON.stringify(s.flow.order)===JSON.stringify(["A_SOLVE","D07_CHECK","D05_ADOPT","D08_FREEZE","B_ENRICH"])&&s.flow.noApprovedD05AtStart&&s.flow.d06Candidates&&s.flow.d07Checked&&s.flow.adoptedViaD05Port&&s.flow.d08Frozen&&s.flow.bCompletes;
case "B_SCOPED_RETURN_PRESERVE_FREEZE":return !!s.freeze.frozenHashBefore&&s.freeze.frozenHashBefore===s.freeze.frozenHashAfter&&!!s.freeze.unrelatedHashBefore&&s.freeze.unrelatedHashBefore===s.freeze.unrelatedHashAfter&&s.freeze.scopedInvalidation&&s.freeze.changeDecisionRecorded;
case "MULTI_SETUP_OWNER_QUERY":return s.queries.setupA!==s.queries.setupB&&!!s.queries.setupARevisionHash&&!!s.queries.setupBRevisionHash&&s.queries.fromOwner&&!s.queries.activeGuiStateOnly;
case "CAS_ACL_CANCEL_LATE_RECEIPT":return s.guards.aclNow&&s.guards.expectedHead===s.guards.currentHead&&s.guards.expectedEpoch===s.guards.currentEpoch&&s.guards.generation===s.guards.currentGeneration&&!s.guards.cancelled&&!s.guards.lateReceipt;
case "CRASH_REPLAY_UNIQUE_TERMINAL":return s.recovery.stagingSealed&&s.recovery.manifestDigestMatches&&s.recovery.uniqueTerminal&&s.recovery.resumeState==="RECOVERED_VERIFIED"&&!s.recovery.crossDbAtomicAssumed;
case "NO_CL_AS_NC_QUALIFICATION":return s.semantic.d09==="NEUTRAL_CL"&&s.semantic.d11==="CL_PREVIEW"&&s.semantic.d12==="NC_BYTES"&&s.semantic.d13==="UNKNOWN"&&s.semantic.d15==="NOT_RUN"&&s.semantic.d16==="BLOCKED"&&!s.semantic.materialSweep;
case "LEGACY_SNAPSHOT_NON_DESTRUCTIVE":return s.migration.legacyReadable&&s.migration.newRevisionIndependent&&s.migration.oldFrozenHashPreserved&&!s.migration.deleteUserDb&&s.migration.rollbackToOldPort;
case "INDEPENDENT_CONSUMER_PROOF_LEVEL":return s.evidence.headlessRunRequired&&s.evidence.exitCodeRequired&&s.evidence.independentConsumerPlanned&&!s.evidence.realProcessRun&&s.evidence.consumerResult==="NOT_RUN"&&s.evidence.productResult==="NOT_RUN";
default:throw Error("未知规则："+k);
}};
const merge=function merge(a,b){if(b===undefined)return a;if(!b||typeof b!=="object"||Array.isArray(b))return b;const o={...(a||{})};for(const [k,v] of Object.entries(b))o[k]=merge(o[k],v);return o;};
const check=(r,fx,src,owner,baseline)=>{let pass=0;function ok(v,msg){if(!v)throw Error(msg);}ok(r.rules.length===10&&fx.cases.length===20&&fx.mutants.length===10&&src.sources.length===10,"数量");const sm=new Set(src.sources.map(x=>x.id));ok(sm.size===10,"来源唯一");for(const s of src.sources)ok(s.url.startsWith("https://")&&s.accessDepth&&s.locator&&s.limits&&s.authors.length,"来源元数据");const om=new Map(baseline.assets.map(x=>[x.id,x.owner]));ok(owner.assets.length===17&&om.size===17,"Owner数量");for(const x of owner.assets)ok(om.get(x.id)===x.canonicalOwner&&x.crossDomainSignoff==="PENDING_HUMAN"&&x.independentConsumer==="NOT_RUN","Owner核对 "+x.id);for(const x of r.rules){ok(x.sourceIds.length>=2&&x.sourceIds.every(id=>sm.has(id)),"source→rule "+x.id);ok(x.assets.length&&x.assets.every(id=>om.has(id)),"rule→asset");for(const field of x.fields){let v=fx.baseScenario;for(const seg of field.split("."))v=v?.[seg];ok(v!==undefined,"rule→field "+field);}for(const [kind,id] of [["positive",x.positiveTestId],["negative",x.negativeTestId]]){const c=fx.cases.find(z=>z.id===id);ok(c?.polarity===kind&&c.ruleId===x.id,"rule→test "+id);const flag=Boolean(judge(x.summary,merge(fx.baseScenario,c.overrides)));ok(flag===(kind==="positive"),"assert "+id);ok(c.expected===(kind==="positive"?"PLANNING_ONLY":x.negativeReason),"expected "+id);pass++;}const m=fx.mutants.find(z=>z.ruleId===x.id);ok(m?.expected===x.negativeReason&&!judge(x.summary,merge(fx.baseScenario,m.overrides)),"mutant "+x.id);pass++;}return pass;};
const pass=check(read('research/traces/W2-06.json'),read('docs/work-packages/W2-06/fixtures.json'),read('research/sources/W2-06.json'),read('docs/work-packages/W2-06/asset-owner-candidates.json'),read('docs/architecture/v0.8/business-assets.json'));
if(read('docs/work-packages/W2-06/real-harness.contract.json').runStatus!=='NOT_RUN')throw Error('真实执行状态不可由规划伪造');
console.log('W2-06: 10来源/10规则/20正反/10变异/17资产映射，合成 '+pass+'/30 PASS。独立产品消费者与真实进程NOT_RUN；L3及Owner会签PENDING');

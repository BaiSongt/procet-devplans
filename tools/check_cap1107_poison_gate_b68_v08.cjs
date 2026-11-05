'use strict';
// B68规划合成只读校验器：不调用LLM、知识库、数据库或机床；测试不是产品签署。
const fs=require('node:fs');const path=require('node:path');
const judge=function judge(x){
 const out=(status,reason)=>({status,reason});
 if(!x||!x.context||!x.source||!x.citation||!x.owner||!x.ui||!x.approval||!x.promotion||!x.evidence)return out("REJECT","SCHEMA");
 const {context:c,source:s,citation:t,owner:o,ui:u,approval:a,promotion:p,evidence:e}=x;
 if(!["GUI","CLI","Agent"].includes(u.entry)||!u.sharedPort||u.engineCount!==1||!u.leftPanel||u.previewWrite)return out("REJECT","GUI_PORT_OR_WORLD");
 if(o.port!=="Domain11.KnowledgeFeedbackPort"||!o.canWrite||!o.canRead)return out("REJECT","OWNER_PORT_OR_AUTH");
 if(!s.dataOnly||s.promotedAsInstruction||s.toolCallFromSource)return out("REJECT","UNTRUSTED_DATA_AS_COMMAND");
 if(s.projectId!==c.projectId||!Array.isArray(s.allowedScopes)||!s.allowedScopes.includes(c.scope))return out("REJECT","CROSS_PROJECT_OR_SCOPE");
 if(p.action!=="KNOWLEDGE_REVISION"||p.targetDomain!=="Domain11"||p.ncRelease||p.rewriteD08||e.promoteD17ToD15)return out("REJECT","CROSS_DOMAIN_AUTHORITY");
 if(p.frozenWrite||!p.appendOnly||!p.historyRetained)return out("REJECT","IMMUTABLE_HISTORY_REQUIRED");
 if(!a.humanReviewed||a.identity!=="HUMAN_REVIEWER"||a.actionDigest!==p.actionDigest||a.sourceHash!==s.hash)return out("REJECT","EXACT_HUMAN_APPROVAL");
 if(e.conflict&&!e.conflictRecorded)return out("REJECT","HIDDEN_CONTRADICTION");
 if(o.cancelled||o.aclEpoch!==o.currentAclEpoch||o.scopeEpoch!==o.currentScopeEpoch||o.generation!==o.ackGeneration||o.expectedHead!==o.currentHead)return out("STALE","OWNER_CAS_OR_CANCEL_FENCE");
 if(s.hash!==t.sourceHash||s.revision!==t.sourceRevision||s.chunkHash!==t.chunkHash||s.anchor!==t.anchor)return out("STALE","SOURCE_CITATION_VERSION");
 if(s.indexGeneration!==s.currentIndexGeneration||s.retired)return out("STALE","INDEX_OR_REVOCATION");
 if(s.sourceType!=="RETRIEVED_DOCUMENT"||!s.indexGeneration||!s.hash||!s.chunkHash||!s.revision)return out("UNKNOWN","SOURCE_NOT_VERIFIABLE");
 if(!t.supplied||!t.anchor)return out("UNKNOWN","CITATION_NOT_VERIFIABLE");
 if(e.conflict&&e.resolution!=="HUMAN_APPROVED")return out("UNKNOWN","CONFLICT_REQUIRES_ARBITRATION");
 if(p.legacyUnmapped)return out("UNKNOWN","LEGACY_UNRESOLVED");
 if(!p.consumerContractPrepared)return out("UNKNOWN","CONSUMER_ACCEPTANCE_NOT_PREPARED");
 if(p.mode==="preview"||p.mode==="display")return out("DISPLAY_ONLY","NO_KNOWLEDGE_COMMIT");
 if(p.mode!=="commitCandidate")return out("REJECT","UNSUPPORTED_MODE");
 return out("CANDIDATE_ONLY","REVIEWABLE_NOT_PRODUCT_PASS");
};
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-11-07/poison-gate-b68-fixtures-v08.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-11-07-poison-gate-b68-v08.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-11-07-poison-gate-b68.json'),'utf8'));
function patch(v,changes){const c=JSON.parse(JSON.stringify(v));for(const [k,val] of Object.entries(changes)){const parts=k.split('.');let t=c;for(const z of parts.slice(0,-1)){if(!t||typeof t!=='object'||!(z in t))throw Error('未知路径 '+k);t=t[z];}t[parts.at(-1)]=val;}return c;}
let passed=0;const failures=[],used=new Set(),refIds=new Set(sources.references.map(s=>s.id));
if(trace.ruleCount!==trace.rules.length||trace.ruleCount!==8||sources.references.length!==7)throw Error('source/trace登记数不一致');
for(const r of trace.rules){if(!r.caseIds.length||!r.fields.length||!r.sourceIds.length||!r.workPackageIds.length)throw Error('规则缺失 '+r.id);for(const s of r.sourceIds)if(!refIds.has(s))throw Error('来源不存在 '+s);}
for(const c of data.cases){if(used.has(c.id))throw Error('重复case '+c.id);used.add(c.id);if(!trace.rules.some(r=>r.id===c.ruleId&&r.caseIds.includes(c.id)))throw Error('case追踪缺失 '+c.id);const actual=judge(patch(data.base,c.changes));if(actual.status===c.expected&&actual.reason===c.expectedReason)passed++;else failures.push({id:c.id,expected:c.expected+'/'+c.expectedReason,actual});}
for(const r of trace.rules)for(const id of r.caseIds)if(!used.has(id))throw Error('trace指向缺失case '+id);
console.log(JSON.stringify({scope:'B68_PLANNING_SYNTHETIC',passed,total:data.cases.length,status:failures.length?'FAIL':'PASS',counts:data.cases.reduce((o,c)=>(o[c.expected]=(o[c.expected]||0)+1,o),{}),failures},null,2));if(failures.length)process.exitCode=1;

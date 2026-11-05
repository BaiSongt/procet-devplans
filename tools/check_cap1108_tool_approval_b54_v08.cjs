"use strict";
// B54：纯合成规划准入，禁止用于实际业务授权。
const fs=require("node:fs"),path=require("node:path");
const fx=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../docs/capabilities/CAP-11-08/tool-approval-b54-fixtures-v08.json"),"utf8"));
const judge=function judge(x){
const out=(status,rule,why)=>({status,rule,why,product:"NOT_RUN"}),has=s=>typeof s==="string"&&s.length>0&&s!=="UNKNOWN",unk=(obj,keys)=>!obj||keys.some(k=>obj[k]===null||obj[k]===undefined||obj[k]==="UNKNOWN");
const p=x?.protocol;if(unk(p,["version","catalogScope","catalogKnown"]))return out("UNKNOWN","B54-R01","protocol_missing");
if(x.syntheticOnly!==true||p.version!=="2026-07-28"||p.catalogScope!=="principal"||p.catalogKnown!==true)return out("REJECT","B54-R01","protocol_scope_not_qualified");
const t=x.tool;if(unk(t,["server","approvedServer","name","approvedName","schemaHash","approvedSchemaHash","catalogEpoch","approvedCatalogEpoch"]))return out("UNKNOWN","B54-R02","tool_identity_missing");
if(t.server!==t.approvedServer||t.name!==t.approvedName||t.schemaHash!==t.approvedSchemaHash||t.catalogEpoch!==t.approvedCatalogEpoch)return out("REJECT","B54-R02","tool_server_or_schema_rebound");
const a=x.approval;if(unk(t,["argsHash","approvedArgsHash"])||unk(a,["intentHash","approvedIntentHash","nonce","approvedNonce"]))return out("UNKNOWN","B54-R03","argument_approval_missing");
if(t.argsHash!==t.approvedArgsHash||a.intentHash!==a.approvedIntentHash||a.nonce!==a.approvedNonce||t.untrustedTextIsCommand!==false)return out("REJECT","B54-R03","intent_args_or_untrusted_data_changed");
if(unk(a,["principal","approvedPrincipal","signer","evidence","issued","expiry","now"]))return out("UNKNOWN","B54-R04","human_evidence_unknown");
const d=[a.issued,a.expiry,a.now].map(Date.parse);if(d.some(v=>!Number.isFinite(v)))return out("UNKNOWN","B54-R04","clock_unknown");
if(a.signer!=="HUMAN"||a.principal!==a.approvedPrincipal||d[2]<d[0]||d[2]>=d[1])return out("REJECT","B54-R04","not_human_or_expired");
if(a.evidence!=="SYNTHETIC_ONLY")return out("UNKNOWN","B54-R04","real_signature_not_tested");
const auth=x.oauth;if(unk(auth,["resource","audience","issuer","approvedIssuer"]))return out("UNKNOWN","B54-R05","oauth_resource_unknown");
if(auth.resource!==auth.audience||auth.issuer!==auth.approvedIssuer||auth.tokenPassThrough!==false)return out("REJECT","B54-R05","oauth_audience_or_issuer_invalid");
const o=x.owner;if(unk(o,["port","asset","revision","approvedRevision","hash","approvedHash","frame","approvedFrame","scope","approvedScope","aclEpoch","approvedAclEpoch"]))return out("UNKNOWN","B54-R06","owner_exact_precondition_missing");
if(o.port!=="05.PlanOwnerPort"||o.asset!=="D05"||o.revision!==o.approvedRevision||o.hash!==o.approvedHash||o.frame!==o.approvedFrame||o.scope!==o.approvedScope||o.aclEpoch!==o.approvedAclEpoch||o.aclAllowed!==true||o.casAtomic!==true||o.recheckAtCommit!==true)return out("REJECT","B54-R06","owner_acl_cas_scope_mismatch");
const k=x.ack;if(unk(k,["generation","expectedGeneration","cancelled","late"]))return out("UNKNOWN","B54-R07","ack_generation_unknown");
if(k.generation!==k.expectedGeneration||k.cancelled||k.late||k.nonceConflict!==false||k.ownerReceipt!=="NOT_ISSUED"||k.modelReportedCommit!==false)return out("REJECT","B54-R07","late_cancel_or_fake_receipt");
const c=x.context,u=x.ui;if(!c||!u||!Array.isArray(u.entries)||unk(u,["sharedPort","babylonWorlds","taskPanel","fontMaxPx"]))return out("UNKNOWN","B54-R08","ui_state_unknown");
if(c.d04!=="NOMINAL_SETUP"||c.d10!=="SEPARATE_ACTUAL_BINDING"||c.freezePreserved!==true||c.abImmutable!==true||c.readerCompatible!==true||u.entries.length!==3||["GUI","CLI","Agent"].some(z=>!u.entries.includes(z))||u.sharedPort!=="11.ActionAuthorizationPort"||u.babylonWorlds!==1||u.taskPanel!=="LEFT_SINGLE"||u.fontMaxPx>12||u.fontMaxPx<=0)return out("REJECT","B54-R08","freeze_ui_or_binding_bypass");
const n=x.nc;if(!n||["finalNc","d13","d14","d15","d16","clIsProof"].some(k=>n[k]===null||n[k]===undefined))return out("UNKNOWN","B54-R09","nc_missing");
if(n.finalNc!==false||n.d13!=="UNKNOWN"||n.d14!=="NOT_RUN"||n.d15!=="NOT_RUN"||n.d16!=="BLOCKED"||n.clIsProof!==false)return out("REJECT","B54-R09","cl_or_ai_pretends_nc_validation");
return out("PLANNING_VALID",null,"synthetic_no_real_authorization");
};
const apply=(b,changes)=>{let x=JSON.parse(JSON.stringify(b));for(const [p,v] of changes){let a=p.split("."),q=x;for(const k of a.slice(0,-1))q=q[k];q[a.at(-1)]=v;}return x};
let pass=0;let failed=[];for(const c of fx.cases){let r=judge(apply(fx.base,c.changes));if(r.status===c.expected&&r.rule===c.rule)pass++;else failed.push({id:c.id,expected:c.expected,actual:r});}
console.log(JSON.stringify({kind:"PLANNING_SYNTHETIC_ONLY",pass,total:fx.cases.length,failed,product:"NOT_RUN"},null,2));if(failed.length)process.exitCode=1;

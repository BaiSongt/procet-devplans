// CAP-11-04 B29；自编合成、只读校验，非真实MCP/Owner实施。
'use strict';
const fs=require('node:fs'),path=require('node:path');
const validate=function validate(x){
 const H=z=>typeof z==="string"&&/^[a-f0-9]{64}$/.test(z),p=x.protocol||{},m=p.requestMeta||{};
 if(x.schema!=="procet-b29-mcp-adapter-synthetic-v1"||p.version!=="2026-07-28"||m.version!==p.version||m.clientInfo!==true||m.clientCapabilities!==true||p.headerVersion!==p.version||p.methodHeader!=="tools/call"||p.methodBody!==p.methodHeader||p.nameHeader!=="orchestrate.plan"||p.nameBody!==p.nameHeader||p.usedInitialize!==false||p.sessionId!==null||p.serverDiscoverSupported!==true||p.clientDiscoverMandatory!==false)return"B29-R1";
 const c=x.catalog||{};
 if(!c.authorizedProviders?.includes(c.providerId)||c.providerId!=="procet.owner.11"||c.qualifiedName!==c.providerId+"::"+c.toolName||c.toolName!=="orchestrate.plan"||!H(c.inputSchemaDigest)||!H(c.outputSchemaDigest)||c.selectedSchemaDigest!==c.inputSchemaDigest)return"B29-R2";
 const k=x.cache||{};
 if(k.scope!=="private"||!H(k.authorizationHash)||k.authorizationHash!==k.observedAuthorizationHash||!Number.isInteger(k.ttlMs)||k.ttlMs<0||!Number.isInteger(k.remainingMs)||k.remainingMs<0||k.remainingMs>k.ttlMs||k.allPages!==true||k.revision!==k.selectedRevision)return"B29-R3";
 const t=x.trust||{};
 if(t.trustedServer!==true||t.annotationsAreAuthority!==false||t.descriptionGrantsWrite!==false||t.toolHasWriteCapability!==false||t.allowedOperations?.join("|")!=="READ|PROPOSE")return"B29-R4";
 const q=x.mrtr||{};
 if(!["NONE","RETRIED"].includes(q.state)||q.requestStateBound!==true||q.responseTreatedAsData!==true||q.approvalRevalidated!==true||!Number.isInteger(q.initialRpcId)||q.initialRpcId<1||(q.state==="NONE"&&q.retryRpcId!==null)||(q.state==="RETRIED"&&(!Number.isInteger(q.retryRpcId)||q.retryRpcId===q.initialRpcId||q.retryRpcId<1)))return"B29-R5";
 const r=x.result||{};
 if(r.resultType!=="complete"||r.isError!==false||r.outputSchemaValidated!==true||r.structuredContentRole!=="UNTRUSTED_DATA"||r.ownerReceiptFromResultText!==false)return"B29-R6";
 const o=x.owner||{};
 if(!o.projectId||!Number.isInteger(o.expectedRevision)||o.expectedRevision!==o.currentRevision||!H(o.contentHash)||o.contentHash!==o.currentHash||!o.frameId||o.frameId!==o.currentFrame||!Number.isInteger(o.scopeEpoch)||o.scopeEpoch!==o.currentScopeEpoch||o.aclAllowed!==true||o.cancelled!==false||o.lateAckAdopted!==false||!Number.isInteger(o.generation)||o.generation!==o.currentGeneration||!H(o.actionDigest)||o.actionDigest!==o.approvedActionDigest||o.approvalValid!==true||!H(o.d04)||!H(o.d10)||o.d04===o.d10||o.frozenOverwrite!==false)return"B29-R7";
 const u=x.ux||{};
 if(u.port!=="11.AgentOrchestrationPort.plan"||u.channels?.join("|")!=="GUI|CLI|Agent"||u.worlds!==1||u.panel!=="UnifiedTaskPanel.left"||u.fontMaxPx!==12||u.themes?.join("|")!=="light|dark"||u.d13!=="UNKNOWN"||u.d14!=="NOT_RUN"||u.d15!=="NOT_RUN"||u.d16!=="BLOCKED")return"B29-R8";
 return"PASS";
};
function patch(x,p){const keys=p.path.split('.');let v=x;for(const k of keys.slice(0,-1))v=v[k];v[keys.at(-1)]=p.value}
function main(root=path.resolve(__dirname,'..')){
 const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-11-04/mcp-version-cache-b29-fixtures-v08.json'),'utf8'));
 const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-11-04-mcp-version-cache-b29.json'),'utf8'));
 const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-11-04-mcp-version-cache-b29-v08.json'),'utf8'));
 if(!f.syntheticOnly||f.cases.length!==48||s.sources.length!==6||t.rules.length!==8)throw Error('数量断链');
 const sid=new Set(s.sources.map(z=>z.id)),cid=new Set(f.cases.map(z=>z.id));
 for(const rule of t.rules){if(rule.sourceIds.some(v=>!sid.has(v))||rule.negativeIds.length<1||rule.negativeIds.some(v=>!cid.has(v))||rule.positiveIds.some(v=>!cid.has(v))||!rule.workPackageIds.includes('T5-01'))throw Error('规则/来源/案例断链:'+rule.id);
  for(const field of rule.fields){let v=f.base;for(const k of field.split('.')){if(v===null||!Object.hasOwn(v,k))throw Error('字段断链:'+field);v=v[k]}}
 }
 for(const c of f.cases){const x=structuredClone(f.base);if(c.baseCase&&c.baseCase!=='P01'){const p=f.cases.find(z=>z.id===c.baseCase);if(!p||p.expected!=='PASS')throw Error('基础样例不存在');for(const q of p.patches)patch(x,q)}for(const q of c.patches)patch(x,q);let v=validate(x);if(v!==c.expected)throw Error(c.id+' failed '+v+' expected '+c.expected)}
 console.log('PASS_SYNTHETIC_ONLY 3正45反 48/48；未连接真实MCP或业务Owner');
}
if(require.main===module)main();
module.exports={validate,main};

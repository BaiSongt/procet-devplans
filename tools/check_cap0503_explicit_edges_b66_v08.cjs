'use strict';
// 只读的合成规划判定：禁止把本工具当D05产品准入或NC安全认证。
const fs=require('node:fs');const path=require('node:path');
const judge=function judge(x){
const ret=(status,reason)=>({status,reason});
if(!x?.owner||!x?.source||!x?.graph||!x?.command||!x?.ui||!x?.impact)return ret("REJECT","SCHEMA");
const a=x.owner,s=x.source,g=x.graph,m=x.command,u=x.ui,k=x.impact;
if(a.port!=="D05.RouteEditDomainPort"||a.actor!=="planner"||!a.aclRead||!a.aclWrite)return ret("REJECT","AUTH");
if(u.entry!=="GUI"&&u.entry!=="CLI"&&u.entry!=="Agent")return ret("REJECT","ENTRY");
if(!u.singleBabylon||!u.leftTaskPanel||!u.sharedPort)return ret("REJECT","UI_BOUNDARY");
if(s.d10AsSetup||m.rewriteFrozen||m.rewritePublished||m.clAsD15)return ret("REJECT","DOMAIN_BOUNDARY");
if(a.cancelled||a.ackGeneration!==a.generation||a.scopeEpoch!==a.currentScopeEpoch||a.aclEpoch!==a.currentAclEpoch)return ret("STALE","FENCE");
if(s.expectedRevision!==s.currentRevision||s.expectedHash!==s.currentHash||s.expectedFrame!==s.currentFrame||s.d04Expected!==s.d04Current||s.freezeExpected!==s.freezeCurrent)return ret("STALE","SOURCE_CAS");
if(!Array.isArray(g.nodes)||new Set(g.nodes).size!==g.nodes.length||g.nodes.length<2||g.nodes.some(v=>!v))return ret("REJECT","NODES");
const nodeSet=new Set(g.nodes),ids=new Set(),edges=[];
if(!Array.isArray(g.edges)||!Array.isArray(g.displayOrder)||g.displayOrder.length!==g.nodes.length||new Set(g.displayOrder).size!==g.nodes.length||g.displayOrder.some(v=>!nodeSet.has(v)))return ret("REJECT","GRAPH_OR_DISPLAY");
for(const e of g.edges){
 if(!e.id||ids.has(e.id)||!nodeSet.has(e.from)||!nodeSet.has(e.to)||e.from===e.to||e.kind!=="EXPLICIT")return ret("REJECT","EDGE_ID_OR_ENDPOINT");
 if(!e.reason||!e.sourceRef||!e.actor)return ret("REJECT","DIRECT_EDGE_PROVENANCE");
 ids.add(e.id);edges.push([e.from,e.to]);
}
if(m.type==="add"){if(!m.edge||!nodeSet.has(m.edge.from)||!nodeSet.has(m.edge.to)||!m.edge.reason||!m.edge.sourceRef)return ret("REJECT","PATCH_EDGE");edges.push([m.edge.from,m.edge.to])}
const adj=Object.fromEntries(g.nodes.map(n=>[n,[]]));for(const [u,v]of edges)adj[u].push(v);
const seen=new Set(),active=new Set(),stack=[];
function dfs(n){active.add(n);stack.push(n);for(const v of adj[n]){if(active.has(v))return stack.slice(stack.indexOf(v)).concat(v);if(!seen.has(v)){const z=dfs(v);if(z)return z}}stack.pop();active.delete(n);seen.add(n);return null}
for(const n of g.nodes){if(!seen.has(n)){const p=dfs(n);if(p)return ret("REJECT","CYCLE:"+p.join(">"))}}
if(m.type==="display"||m.type==="reduction_view"){if(m.write||k.invalidate)return ret("REJECT","VIEW_WRITE");return ret("DISPLAY_ONLY","VIEW_NOT_OWNER")}
if(m.type==="reduction_commit"||m.writeReducedGraph)return ret("REJECT","REDUCTION_LOSES_DIRECT_EDGES");
if(!["inspect","add","remove"].includes(m.type))return ret("REJECT","UNSUPPORTED_COMMAND");
if(m.type==="remove"){const e=g.edges.find(z=>z.id===m.removeId);if(!e||!m.reason||!m.approved)return ret("REJECT","DELETE_REVIEW");if(e.protected&&!m.fork)return ret("REJECT","PROTECTED_DIRECT_EDGE")}
if(m.legacyUnmapped)return ret("UNKNOWN","LEGACY_ID");
if(m.crossSetup&&(!m.transfer||m.transfer.d04!==s.d04Current||m.transfer.frame!=="F-setup2"||m.transfer.unit!=="mm"||!m.transfer.qualified))return ret("UNKNOWN","SETUP_FRAME");
if(!k.exactClosure||!k.sourceHashes||!k.rollbackHistory)return ret("UNKNOWN","IMPACT_PROOF");
return ret("CANDIDATE_ONLY","D05_PREVIEW_NOT_PRODUCT_PASS")
};
const d=JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','docs/capabilities/CAP-05-03/explicit-edges-b66-fixtures-v08.json'),'utf8'));
let passed=0,errors=[];for(const c of d.cases){const r=judge(c.input);if(r.status===c.expected&&r.reason===c.expectedReason)passed++;else errors.push({id:c.id,actual:r,expected:c.expected})}
console.log(JSON.stringify({passed,total:d.cases.length,failed:errors.length,syntheticOnly:true,product:'NOT_RUN',errors},null,2));if(errors.length)process.exitCode=1;
module.exports={judge};

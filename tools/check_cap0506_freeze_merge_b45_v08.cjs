#!/usr/bin/env node
"use strict";
/* B45：规则Oracle固化，禁止由fixture预期反推PASS；本工具不触及产品仓。 */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function copy(x){return JSON.parse(JSON.stringify(x));}
function apply(input,edits){const n=copy(input);for(const e of edits){const a=e.path.split(".");let t=n;for(let i=0;i<a.length-1;i++)t=t[a[i]];t[a.at(-1)]=e.value;}return n;}
function judge(x){
const U=code=>({status:"UNKNOWN",code}),N=code=>({status:"REJECT",code}),P=code=>({status:"PASS",code});
const e=x.exact;
if(!e||["scope","sourceHash","frameHash","d05Revision","d08Hash","canonicalProfile"].some(k=>typeof e[k]!=="string"||!e[k]))return U("EXACT_REF_UNKNOWN");
if(!x.revisions||!x.baseRef||!x.currentRef||!x.proposedRef||[x.baseRef,x.currentRef,x.proposedRef].some(k=>!Array.isArray(x.revisions[k])))return U("REVISION_GRAPH_UNKNOWN");
function ancestor(b,h){const visited=new Set(),stack=[h];while(stack.length){const q=stack.pop();if(q===b)return true;if(visited.has(q))continue;visited.add(q);if(!Array.isArray(x.revisions[q]))return null;stack.push(...x.revisions[q]);}return false;}
const a=ancestor(x.baseRef,x.currentRef),b=ancestor(x.baseRef,x.proposedRef);if(a===null||b===null)return U("ANCESTRY_UNRESOLVED");if(!a||!b)return N("BASE_NOT_ANCESTOR");
if(![x.baseNodes,x.currentNodes,x.proposedNodes].every(v=>v&&typeof v==="object"&&!Array.isArray(v))||![x.baseEdges,x.currentEdges,x.proposedEdges].every(Array.isArray))return U("GRAPH_UNRESOLVED");
if(e.scope!==x.commit?.scope)return N("SCOPE_MISMATCH");
const B=x.baseNodes,C=x.currentNodes,T=x.proposedNodes,ks=new Set([...Object.keys(B),...Object.keys(C),...Object.keys(T)]);
const diff=(v,k)=>v[k]!==B[k];for(const k of ks)if(diff(C,k)&&diff(T,k)&&C[k]!==T[k])return N("NODE_THREE_WAY_CONFLICT");
const ns={...B};for(const side of [C,T])for(const k of ks)if(diff(side,k)){if(side[k]===undefined)delete ns[k];else ns[k]=side[k];}
const ek=a=>JSON.stringify(a),bs=new Set(x.baseEdges.map(ek)),es=new Set(bs);
for(const side of [x.currentEdges,x.proposedEdges]){const s=new Set(side.map(ek));for(const e of bs)if(!s.has(e))es.delete(e);for(const e of s)if(!bs.has(e))es.add(e);}
const pairs=[...es].map(JSON.parse);
if(pairs.some(a=>!Array.isArray(a)||a.length!==2||a.some(k=>typeof k!=="string"||!Object.hasOwn(ns,k))))return N("DANGLING_EDGE");
const adj=new Map(Object.keys(ns).map(k=>[k,[]]));for(const [u,v] of pairs)adj.get(u).push(v);
const vis=new Set(),done=new Set();function dfs(k){if(vis.has(k))return false;if(done.has(k))return true;vis.add(k);for(const v of adj.get(k))if(!dfs(v))return false;vis.delete(k);done.add(k);return true;}for(const k of adj.keys())if(!dfs(k))return N("COMBINED_DAG_CYCLE");
const f=x.freeze;if(!f||!Array.isArray(f.targets)||!f.targets.length)return U("FREEZE_SCOPE_UNKNOWN");
const closure=new Set(f.targets);let prev=-1;while(prev!==closure.size){prev=closure.size;for(const [u,v] of pairs)if(closure.has(v))closure.add(u);}
if([...closure].some(k=>!Object.hasOwn(ns,k)))return N("FROZEN_NODE_DELETED");
if([...closure].some(k=>diff(T,k)))return N("FROZEN_DEPENDENCY_EDIT");
const propSet=new Set(x.proposedEdges.map(ek));const propDiff=[...new Set([...bs,...propSet])].filter(e=>bs.has(e)!==propSet.has(e));
if(propDiff.some(e=>JSON.parse(e).some(k=>closure.has(k))))return N("FROZEN_DEPENDENCY_EDIT");
if(f.owner!=="D05"||f.d08Before!==e.d08Hash||f.d08After!==f.d08Before||f.historyRetained!==true)return N("D08_IMMUTABLE");
const q=x.commit;if(!q||q.acl===null||q.acl===undefined)return U("ACL_UNKNOWN");
if(q.expected!==q.actual||q.expected!==x.currentRef||q.acl!==true||q.cancelled!==false||q.generation!==q.currentGeneration||q.scopeEpoch!==q.currentScopeEpoch||q.observedSourceHash!==q.actualSourceHash||q.actualSourceHash!==e.sourceHash)return N("CAS_ACL_CANCEL_FENCE");
const d=x.downstream;if(!d||d.d13==null||d.d16==null)return U("DOWNSTREAM_UNKNOWN");
if(d.invalidationsComplete!==true||d.writesFrozen!==false||d.clPreviewQualified!==false||(d.d13==="UNKNOWN"&&d.d16!=="BLOCKED")||d.d16==="PASS")return N("DOWNSTREAM_EVIDENCE_LEAK");
const ui=x.entry;if(!ui||ui.port!=="05.ProcessPlanFreezeDomainPort"||ui.singleBabylon!==true||ui.taskPanel!=="LEFT"||ui.previewWrites!==false||ui.agentDirectWrites!==false)return N("ENTRY_BYPASS");
const m=x.migration;if(!m||m.adapterKnown==null)return U("MIGRATION_UNKNOWN");
if(m.adapterKnown!==true||m.missingPolicy!=="UNKNOWN"||m.rollbackAppendOnly!==true)return N("MIGRATION_INVALID");
if(!["COMMIT","PREVIEW"].includes(x.mode))return N("INVALID_MODE");
return P(x.mode==="PREVIEW"?"PREVIEW_ONLY":"OWNER_CAS_ELIGIBLE");
}
function main(){
 const root=process.cwd();
 const fx=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-05-06/freeze-merge-b45-fixtures-v08.json"),"utf8"));
 const tr=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-05-06-freeze-merge-b45-v08.json"),"utf8"));
 const sr=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-05-06-freeze-merge-b45.json"),"utf8"));
 assert.equal(fx.syntheticOnly,true);
 const ids=new Set(fx.cases.map(c=>c.id)),sourceIds=new Set(sr.sources.map(s=>s.id));
 assert.equal(ids.size,fx.cases.length);assert.equal(sourceIds.size,sr.sources.length);
 const counts={PASS:0,REJECT:0,UNKNOWN:0},failures=[];
 for(const c of fx.cases){const got=judge(apply(fx.baseline,c.edits));counts[got.status]++;if(got.status!==c.expected)failures.push({id:c.id,expected:c.expected,got});}
 for(const r of tr.rules){assert.ok(r.positiveIds.length&&r.negativeIds.length&&r.fields.length&&r.workPackageIds.length,r.id+" 缺映射");
 for(const id of [...r.positiveIds,...r.negativeIds,...r.unknownIds])assert.ok(ids.has(id),r.id+" 用例缺失 "+id);
 for(const id of r.sourceIds)assert.ok(sourceIds.has(id),r.id+" 来源缺失 "+id);}
 for(const c of fx.cases)assert.ok(tr.rules.some(r=>[...r.positiveIds,...r.negativeIds,...r.unknownIds].includes(c.id)),c.id+" 未关联规则");
 if(failures.length){process.stderr.write(JSON.stringify({result:"FAIL",counts,failures})+"\n");process.exitCode=1;return;}
 process.stdout.write(JSON.stringify({result:"SYNTHETIC_PLANNING_PASS",counts,total:fx.cases.length,sources:sr.sources.length,rules:tr.rules.length,product:"NOT_RUN",consumers:"NOT_RUN"})+"\n");
}
if(require.main===module)main();
module.exports={judge};

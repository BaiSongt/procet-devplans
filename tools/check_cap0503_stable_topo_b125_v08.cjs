"use strict";
// 本文件只验证规划正反合成，不修改产品或用户资料。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function sha(x){return typeof x==="string"&&/^[0-9a-f]{64}$/.test(x)}
function exact(x){return !!x&&!!x.id&&!!x.revision&&sha(x.hash)&&!!x.frame}
function perm(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x))}
function stable(nodes,edges,pref){
 if(!perm(nodes,pref)||!nodes.length||!Array.isArray(edges))return null;
 const deg=Object.fromEntries(nodes.map(n=>[n,0])), next=Object.fromEntries(nodes.map(n=>[n,[]])),seen=new Set();
 for(const e of edges){if(!Array.isArray(e)||e.length!==2||!Object.hasOwn(deg,e[0])||!Object.hasOwn(deg,e[1])||e[0]===e[1]||seen.has(JSON.stringify(e)))return null;seen.add(JSON.stringify(e));deg[e[1]]++;next[e[0]].push(e[1]);}
 const order=[];
 while(order.length<nodes.length){const ready=pref.filter(n=>deg[n]===0);if(!ready.length)return null;const n=ready[0];order.push(n);deg[n]=-1;for(const v of next[n])deg[v]--;}
 return order;
}
function eqEdges(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every(e=>b.some(z=>JSON.stringify(z)===JSON.stringify(e)))}
function decide(rule,x){
 const s=x.scope,g=x.graph,d=x.display,p=x.priority,m=x.move,c=x.commit,t=x.transfer,f=x.freeze,z=x.invalidation,v=x.verify;
 switch(rule){
 case "B125-R01":return s?.project&&exact(s.d05Exact)&&exact(s.d08FrozenExact)&&sha(s.sourceDigest)?"PASS":"UNKNOWN";
 case "B125-R02":return g&&stable(g.nodes,g.edges,g.nodes)!==null&&g.edgeCountExact===g.edges.length&&g.acyclicWitness===true?"PASS":"REJECT";
 case "B125-R03":return d&&perm(d.previous,g.nodes)&&perm(d.proposed,g.nodes)&&eqEdges(d.beforeEdges,g.edges)&&eqEdges(d.afterEdges,g.edges)?"PASS":"REJECT";
 case "B125-R04":return p?.tieKeyVersion==="B125-1"&&p.stableIdTieBreak===true&&stable(g.nodes,g.edges,p.preference)!==null&&JSON.stringify(stable(g.nodes,g.edges,p.preference))===JSON.stringify(p.expectedOrder)?"PASS":"REJECT";
 case "B125-R05":return m&&g.nodes.includes(m.operationId)&&g.nodes.includes(m.anchorId)&&m.operationId!==m.anchorId&&m.baseRevision===s.d05Exact.revision&&m.anchorIdentityExact===true?"PASS":"STALE";
 case "B125-R06":if(c.cancelled)return "CANCELLED";if(!c.aclLive)return "REJECT";return sha(c.expectedHead)&&c.expectedHead===c.currentHead&&c.scopeEpoch===c.currentScopeEpoch&&c.taskGeneration===c.receiptGeneration?"PASS":"STALE";
 case "B125-R07":return t?.required===true&&exact(t.d04TransferExact)&&t.frameChecked===true&&t.d10BoundInD04===false?"PASS":"UNKNOWN";
 case "B125-R08":return f?.editedFrozen===false&&z?.displayOnlyNoManufacturingWrite===true&&z.semanticChangeStalesDownstream===true&&v?.clPreviewNeverD15===true?"PASS":"REJECT";
 default:return "REJECT";
 }
}
function set(o,p,v){const a=p.split(".");let x=o;for(const k of a.slice(0,-1))x=x[k];x[a.at(-1)]=v}
function get(o,p){return p.split(".").reduce((a,k)=>a?.[k],o)}
if(require.main===module){const root=path.join(__dirname,"..");const rd=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));const x=rd("docs/capabilities/CAP-05-03/stable-topo-b125-fixtures-v08.json"),t=rd("research/traces/CAP-05-03-stable-topo-b125-v08.json"),s=rd("research/sources/CAP-05-03-stable-topo-b125.json");assert.equal(x.cases.length,40);assert.equal(x.goldens.length,6);assert.equal(t.rules.length,8);assert.equal(s.sources.length,8);for(const c of x.cases){assert.equal(decide(c.ruleId,c.input),c.expected,c.id);const r=t.rules.find(z=>z.id===c.ruleId);assert.ok(r);assert.ok(r.positive.includes(c.id)||r.negative.includes(c.id));if(c.mutatedField){assert.ok(r.fields.includes(c.mutatedField));const p=x.cases.find(y=>y.ruleId===c.ruleId&&y.expected==="PASS");const cl=JSON.parse(JSON.stringify(p.input));set(cl,c.mutatedField,get(c.input,c.mutatedField));assert.deepEqual(cl,c.input)}}for(const r of t.rules){assert.equal(r.fields.length,4);assert.equal(r.negative.length,4);for(const id of r.sourceIds)assert.ok(s.sources.some(a=>a.id===id),id)}for(const g of x.goldens)assert.deepEqual(stable(g.nodes,g.edges,g.preference),g.expected,g.id);console.log("B125 PLANNING ONLY 40/40 +6/6; PRODUCT NOT_RUN")}

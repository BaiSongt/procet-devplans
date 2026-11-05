#!/usr/bin/env node
"use strict";
// B93独立Node进程入口；工具仅检查规划合成，不会认证产品或NC。
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-07-08/edit-dag-b93-fixtures-v08.json"),"utf8"));
const t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-07-08-edit-dag-b93-v08.json"),"utf8"));
const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-07-08-edit-dag-b93.json"),"utf8"));
function closure(g,seeds){if(!g||!Array.isArray(g.nodes)||!Array.isArray(g.edges))return null;const n=new Set(g.nodes);if(n.size!==g.nodes.length)return"BAD";const adj=Object.fromEntries(g.nodes.map(k=>[k,[]])),degrees=Object.fromEntries(g.nodes.map(k=>[k,0]));for(const e of g.edges){if(!Array.isArray(e)||e.length!==2||!n.has(e[0])||!n.has(e[1]))return"BAD";adj[e[0]].push(e[1]);degrees[e[1]]++}const queue=g.nodes.filter(x=>degrees[x]===0);let done=0;while(queue.length){let x=queue.shift();done++;for(const y of adj[x])if(--degrees[y]===0)queue.push(y)}if(done!==g.nodes.length)return"BAD";if(!Array.isArray(seeds)||!seeds.length||seeds.some(x=>!n.has(x)))return null;const seen=new Set(seeds),todo=[...seeds];while(todo.length){const x=todo.shift();for(const v of adj[x])if(!seen.has(v)){seen.add(v);todo.push(v)}}return[...seen].sort()}
function judge(id,v){const r=v.refs,g=v.graph,l=v.lineage,u=v.unaffected,n=v.nc,o=v.owner,p=v.policy;switch(id){
case"B93-R1":if(!r.revision||!r.actualHash||!r.expectedHash||!r.actualFrame||!r.expectedFrame)return"UNKNOWN";return r.actualHash===r.expectedHash&&r.actualFrame===r.expectedFrame&&r.scopeEpoch===r.expectedScopeEpoch&&r.d08Frozen?"PASS_PLANNING_ONLY":"STALE";
case"B93-R2":if(g.complete!==true)return"UNKNOWN";return closure(g,["B"])==="BAD"?"REJECT":"PASS_PLANNING_ONLY";
case"B93-R3":{if(!g.seeds?.length||!g.affected||!g.complete)return"UNKNOWN";const got=closure(g,g.seeds);if(got===null)return"UNKNOWN";if(got==="BAD")return"REJECT";const actual=[...new Set(g.affected)].sort();return actual.length===g.affected.length&&JSON.stringify(got)===JSON.stringify(actual)?"PASS_PLANNING_ONLY":"REJECT"}
case"B93-R4":{if(!l)return"UNKNOWN";const got=closure(g,g.seeds);if(!Array.isArray(got))return"UNKNOWN";if(JSON.stringify(Object.keys(l).sort())!==JSON.stringify(got))return"REJECT";const unique=new Set();for(const old of got){const a=l[old];if(!Array.isArray(a)||a.length!==(old==="B"?2:1))return"REJECT";for(const id of a){if(!id||unique.has(id)||g.nodes.includes(id))return"REJECT";unique.add(id)}}return"PASS_PLANNING_ONLY"}
case"B93-R5":if(!u||!u.oldHash||!u.newHash)return"UNKNOWN";if(u.otherSourceChanged)return"STALE";return u.id==="A"&&u.oldHash===u.newHash?"PASS_PLANNING_ONLY":"REJECT";
case"B93-R6":if(n.d13==null||n.d14==null||n.d15==null)return"UNKNOWN";return JSON.stringify(n.invalidate)===JSON.stringify(["D11","D12","D13","D14","D15","D16"])&&n.d13==="UNKNOWN"&&n.d14==="NOT_RUN"&&n.d15==="NOT_RUN"&&n.publish===false&&n.clAsNc===false&&n.materialSweep===false?"PASS_PLANNING_ONLY":"REJECT";
case"B93-R7":if(o.acl==null||o.expectedHead==null||o.actualHead==null)return"UNKNOWN";if(o.cancelled||o.expectedHead!==o.actualHead||o.generation!==o.receiptGeneration||o.scopeEpoch!==o.expectedScopeEpoch)return"STALE";return o.asset==="D09"&&o.domain==="07"&&o.acl===true&&o.lateDiscarded&&o.guiCliAgentSamePort&&o.singleBabylon&&o.leftPanel?"PASS_PLANNING_ONLY":"REJECT";
case"B93-R8":if(!p.migration)return"UNKNOWN";return p.sameFactAB&&p.d04D10Separate&&p.c0Minimal&&p.migration==="EXPAND_MIGRATE_CONTRACT_PENDING"&&p.oldReader&&p.rollback&&p.l3==="PENDING_HUMAN"&&p.independentConsumer==="NOT_RUN"?"PASS_PLANNING_ONLY":"REJECT";default:return"UNKNOWN"}}
function patched(b,patch){const d=JSON.parse(JSON.stringify(b));for(const[k,v]of Object.entries(patch)){const parts=k.split(".");let x=d;for(const s of parts.slice(0,-1))x=x[s];x[parts.at(-1)]=v}return d}
const errors=[],src=new Set(s.sources.map(x=>x.id)),tests=new Set(f.cases.map(x=>x.id));
if(tests.size!==f.cases.length||s.registeredRecords!==s.sources.length)errors.push("DUPLICATE_ID_OR_COUNT");
for(const r of t.rules){for(const sid of r.sourceIds)if(!src.has(sid))errors.push("BAD_SOURCE_"+sid);for(const id of [...r.positiveIds,...r.negativeIds,...r.unknownIds])if(!tests.has(id))errors.push("BAD_TEST_"+id)}
for(const c of f.cases){let got=judge(c.ruleId,patched(f.baseline,c.patch));if(got!==c.expect)errors.push(c.id+":"+got)}
for(const g of f.graphGoldens){let got=closure(f.baseline.graph,[g.seed]);if(JSON.stringify(got)!==JSON.stringify(g.expected))errors.push("BAD_GOLDEN_"+g.seed)}
if(errors.length){console.error(JSON.stringify({status:"FAIL",errors}));process.exitCode=1}
else console.log(JSON.stringify({status:"PASS_PLANNING_SYNTHETIC_ONLY",cases:f.cases.length,graphGoldens:f.graphGoldens.length,realProduct:"NOT_RUN"}));

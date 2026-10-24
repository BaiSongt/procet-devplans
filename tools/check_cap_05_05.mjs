// CAP-05-05规划规则校验；仅使用合成数据，不涉及产品或机床。
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const source=read("research/sources/CAP-05-05.json"),trace=read("research/traces/CAP-05-05.json"),fixtures=read("docs/capabilities/CAP-05-05/fixtures.json");

const exact=(x,scope)=>!!x&&typeof x.id==="string"&&!!x.id&&typeof x.revision==="string"&&!!x.revision&&typeof x.hash==="string"&&/^[0-9a-f]{64}$/.test(x.hash)&&typeof x.frame==="string"&&!!x.frame&&typeof x.schemaVersion==="string"&&!!x.schemaVersion&&x.scope===scope;
const DAG=(nodes,edges)=>{if(!Array.isArray(nodes)||!Array.isArray(edges)||!nodes.length||new Set(nodes).size!==nodes.length)return false;const degree=new Map(nodes.map(n=>[n,0])),links=new Map(nodes.map(n=>[n,[]])),seen=new Set;for(const [a,b] of edges){if(!degree.has(a)||!degree.has(b)||a===b||seen.has(a+"|"+b))return false;seen.add(a+"|"+b);degree.set(b,degree.get(b)+1);links.get(a).push(b);}const q=nodes.filter(n=>degree.get(n)===0);let n=0;while(q.length){const u=q.shift();n++;for(const v of links.get(u)){degree.set(v,degree.get(v)-1);if(!degree.get(v))q.push(v);}}return n===nodes.length;};
function evaluate(r,i){switch(r){
case "SOLV505-R01":return i.projectScope==="project-A"&&exact(i.candidateRef,i.projectScope)&&Array.isArray(i.sourceRefs)&&i.sourceRefs.length>=3&&i.sourceRefs.every(x=>exact(x,i.projectScope));
case "SOLV505-R02":return ["FEASIBLE","OPTIMAL"].includes(i.solverStatus)&&!!i.statusEvidence&&Array.isArray(i.candidateIds)&&i.candidateIds.length>0&&new Set(i.candidateIds).size===i.candidateIds.length&&i.candidateIds.includes(i.selectedCandidateId);
case "SOLV505-R03":return i.hiddenGlobalRank===false&&i.autoCertified===false&&i.reviewedWeights===true&&Array.isArray(i.alternatives)&&i.alternatives.length>=2&&new Set(i.alternatives.map(a=>a.id)).size===i.alternatives.length&&i.alternatives.every(a=>Number.isFinite(a.score?.value)&&a.score.unit==="dimensionless"&&typeof a.score.provenance==="string"&&!!a.score.provenance);
case "SOLV505-R04":return i.brepValidation==="VALID"&&i.orderedBooleanEvidence==="INDEPENDENT_CHECKED"&&i.protectedRegionStatus==="CLEAR"&&i.sweptMaterialClaim===false;
case "SOLV505-R05":return exact(i.setupRef,"project-A")&&i.setupRef.frame==="SETUP"&&i.frameProofStatus==="VERIFIED"&&i.executionBindingReusedAsSetup===false;
case "SOLV505-R06":return DAG(i.nodes,i.edges)&&i.dependencyClosed===true&&Array.isArray(i.selectedNodeIds)&&i.selectedNodeIds.length>0&&i.selectedNodeIds.every(n=>i.nodes.includes(n))&&Array.isArray(i.writeNodeIds)&&new Set(i.writeNodeIds).size===i.writeNodeIds.length&&i.writeNodeIds.length===i.selectedNodeIds.length&&i.writeNodeIds.every(n=>i.selectedNodeIds.includes(n));
case "SOLV505-R07":return i.branchA?.frozen===true&&!!i.branchA.id&&!!i.branchB?.id&&i.branchB.immutable===true&&i.branchA.id!==i.branchB.id&&i.adoptionMode==="FORK_NEW_D05_REVISION"&&i.overwriteFrozen===false&&i.overwriteHistory===false;
case "SOLV505-R08":return i.mode==="PREVIEW"&&i.persistentWrites===0&&i.taskGeneration===i.replyGeneration&&i.cancelled===false&&i.lateReceipt===false&&i.worldCount===1&&i.panel==="LEFT_TASK_PANEL";
case "SOLV505-R09":return i.actorAuthorized===true&&i.permissionRechecked===true&&typeof i.expectedRevision==="string"&&i.currentRevision===i.expectedRevision&&i.sourceHashesMatch===true&&i.auditAppendOnly===true&&i.frozenTargetMutation===false;
case "SOLV505-R10":return i.affected.length>0&&i.affected.every(x=>i.stale.includes(x))&&i.stale.every(x=>i.affected.includes(x))&&i.unaffected.every(x=>!i.stale.includes(x))&&i.d09Status==="STALE"&&i.d12Status==="REPOST_REQUIRED"&&i.d13Status==="UNKNOWN"&&i.d14Status==="NOT_RUN"&&i.d15Status==="NOT_RUN"&&i.d16Status==="BLOCKED"&&i.clAnimationCertified===false&&i.sweptMaterialSimulation===false;
default:throw Error("未知规则"+r);
}}

const fail=m=>{throw Error("CAP-05-05规划校验FAIL: "+m)};
if(source.sources.length!==7||new Set(source.sources.map(x=>x.id)).size!==7)fail("7来源/来源ID");
if(trace.rules.length!==10||new Set(trace.rules.map(x=>x.id)).size!==10)fail("10规则/规则ID");
if(fixtures.cases.length!==20||new Set(fixtures.cases.map(x=>x.id)).size!==20)fail("20用例/用例ID");
const sids=new Set(source.sources.map(s=>s.id)),rids=new Set(trace.rules.map(r=>r.id)),cids=new Set(fixtures.cases.map(c=>c.id));
for(const r of trace.rules){if(r.capabilityId!=="CAP-05-05"||!r.sourceIds?.length||!r.fields?.length||!r.workPackages?.length||r.sourceIds.some(s=>!sids.has(s))||r.acceptanceIds?.length!==2||r.acceptanceIds.some(c=>!cids.has(c)))fail("追踪映射:"+r.id);}
for(const c of fixtures.cases){if(!rids.has(c.ruleId)||!["PASS","REJECT"].includes(c.expected)||c.synthetic!==true||evaluate(c.ruleId,c.input)!==(c.expected==="PASS"))fail("用例判定:"+c.id)}
for(const r of trace.rules){let c=fixtures.cases.filter(x=>x.ruleId===r.id);if(c.length!==2||c.filter(x=>x.expected==="PASS").length!==1||c.filter(x=>x.expected==="REJECT").length!==1)fail("每规则应有正反例:"+r.id);}
console.log("PASS CAP-05-05 7来源/10规则/20正反合成验收；产品NOT_RUN");

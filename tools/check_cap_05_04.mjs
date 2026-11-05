// CAP-05-04规划规则校验；仅检查合成数据，绝不声称产品验收。
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-05-04.json"),"utf8"));
const data=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-05-04/fixtures.json"),"utf8"));
const src=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-05-04.json"),"utf8"));
const evaluate=function evaluate(rule,i){
  const validRef=(x)=>!!x&&typeof x.id==="string"&&x.id.length>0&&typeof x.revision==="string"&&x.revision.length>0&&typeof x.hash==="string"&&/^[a-f0-9]{64}$/.test(x.hash)&&typeof x.frame==="string"&&x.frame.length>0&&typeof x.schemaVersion==="string"&&x.schemaVersion.length>0;
  switch(rule){
    case "TMPL504-R01": return i.scope==="project-A"&&validRef(i.templateRef)&&i.templateRef.scope===i.scope&&Array.isArray(i.dependencyRefs)&&i.dependencyRefs.length>=3&&i.dependencyRefs.every(x=>validRef(x)&&x.scope===i.scope);
    case "TMPL504-R02": return !!i.applicability&&!!i.context&&i.applicability.featureClasses.includes(i.context.featureClass)&&i.applicability.materialFamilies.includes(i.context.materialFamily)&&i.applicability.processKinds.includes(i.context.processKind)&&i.applicability.machineCapabilities.every(c=>i.context.machineCapabilities.includes(c));
    case "TMPL504-R03": return i.toolBinding?.status==="RESOLVED_EXACT"&&validRef(i.toolBinding.exactRef)&&i.toolBinding.match?.diameterMm>=i.toolBinding.require?.minDiameterMm&&i.toolBinding.match?.diameterMm<=i.toolBinding.require?.maxDiameterMm&&i.toolBinding.require?.interfaceCode===i.toolBinding.match?.interfaceCode&&i.toolBinding.match?.approval==="CONFIRMED"&&i.toolBinding.implicitReplacement===false;
    case "TMPL504-R04": return i.frameGraphStatus==="VERIFIED"&&Array.isArray(i.slots)&&i.slots.length>0&&new Set(i.slots).size===i.slots.length&&Array.isArray(i.bindings)&&i.bindings.length===i.slots.length&&new Set(i.bindings.map(b=>b.slot)).size===i.bindings.length&&i.bindings.every(b=>i.slots.includes(b.slot)&&validRef(b.exactRef)&&typeof b.occurrencePath==="string"&&b.occurrencePath.length>0&&b.frameStatus==="VERIFIED");
    case "TMPL504-R05": return Array.isArray(i.params)&&i.params.length>0&&i.params.every(p=>typeof p.name==="string"&&Number.isFinite(p.value)&&Number.isFinite(p.min)&&Number.isFinite(p.max)&&p.min<=p.value&&p.value<=p.max&&p.min<=p.max&&p.unit===p.expectedUnit&&(p.origin==="TEMPLATE"||(p.origin==="OVERRIDE"&&p.overrideApproved===true)));
    case "TMPL504-R06": { const nodes=i.nodes,edges=i.edges;if(!Array.isArray(nodes)||!Array.isArray(edges)||new Set(nodes).size!==nodes.length)return false;const indeg=Object.fromEntries(nodes.map(n=>[n,0]));const next=Object.fromEntries(nodes.map(n=>[n,[]]));const eSet=new Set();for(const e of edges){if(!Array.isArray(e)||e.length!==2||!nodes.includes(e[0])||!nodes.includes(e[1])||e[0]===e[1])return false;let k=e[0]+"|"+e[1];if(eSet.has(k))return false;eSet.add(k);indeg[e[1]]++;next[e[0]].push(e[1]);}const q=nodes.filter(n=>indeg[n]===0);let done=0;while(q.length){let n=q.shift();done++;for(let to of next[n])if(--indeg[to]===0)q.push(to);}return done===nodes.length&&i.resourceScheduleClaim===false;}
    case "TMPL504-R07": return i.templatePinned===true&&i.templateRevision===i.appliedTemplateRevision&&(i.schemaCompatible===true||(i.explicitMigrationApproved===true&&typeof i.adapterRevision==="string"&&i.adapterRevision.length>0))&&i.historyOverwrite===false;
    case "TMPL504-R08": return i.mode==="PREVIEW"&&i.persistentWrites===0&&i.scopeEpoch===i.replyEpoch&&i.cancelled===false&&i.lateReceipt===false&&i.stalePreviewAccepted===false;
    case "TMPL504-R09": return i.actorAuthorized===true&&i.commitPermissionRechecked===true&&i.scope==="project-A"&&i.currentPlanRevision===i.expectedPlanRevision&&i.approvedTemplateRevision===i.templateRevision&&i.templateState==="APPROVED"&&i.frozenTargetMutation===false&&i.auditAppendOnly===true;
    case "TMPL504-R10": return Array.isArray(i.changed)&&i.changed.length>0&&Array.isArray(i.affected)&&Array.isArray(i.stale)&&i.changed.every(x=>i.affected.includes(x))&&i.affected.every(x=>i.stale.includes(x))&&i.stale.every(x=>i.affected.includes(x))&&Array.isArray(i.unaffected)&&i.unaffected.every(x=>!i.stale.includes(x))&&i.d09Invalidated===true&&i.d15State!=="PASS"&&i.d16Released===false&&i.historicalReleaseModified===false&&i.unknownControllerSemantic==="UNKNOWN"&&i.materialSweptSimulation===false&&i.clAnimationCertified===false;
    default: throw new Error("unknown rule: "+rule);
  }
};
const fail=(m)=>{console.error("FAIL CAP-05-04:",m);process.exitCode=1;};
const sourceIds=new Set(src.sources.map(x=>x.id)),ruleIds=new Set(trace.rules.map(x=>x.id)),caseIds=new Set(data.cases.map(x=>x.id));
if(src.sources.length!==8||trace.rules.length!==10||data.cases.length!==20||sourceIds.size!==8||ruleIds.size!==10||caseIds.size!==20)fail("数量/ID唯一性");
for(const r of trace.rules){if(r.capabilityId!=="CAP-05-04"||!r.sourceIds.length||!r.fields.length||r.sourceIds.some(x=>!sourceIds.has(x))||r.acceptanceIds.length!==2)fail("规则缺失来源、字段或验收:"+r.id);for(const a of r.acceptanceIds)if(!caseIds.has(a))fail("缺验收ID:"+a);}
for(const t of data.cases){if(!ruleIds.has(t.ruleId))fail("用例引用未知规则:"+t.id);else if(evaluate(t.ruleId,t.input)!==(t.expected==="PASS"))fail("用例期望不一致:"+t.id);if(t.synthetic!==true)fail("合成用例误标真实:"+t.id);}
for(const r of trace.rules){const own=data.cases.filter(x=>x.ruleId===r.id);if(own.filter(x=>x.expected==="PASS").length!==1||own.filter(x=>x.expected==="REJECT").length!==1)fail("规则缺正反:"+r.id);}
if(process.exitCode!==1)console.log("PASS CAP-05-04 8来源 / 10规则 / 20正反合成用例（规划；产品NOT_RUN）");

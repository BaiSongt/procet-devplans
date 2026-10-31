"use strict";
// 规划合成检查，不连接机床、不写入业务数据。
const fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..");
const fixtures=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-02-04/workholding-b36-fixtures-v08.json"),"utf8"));
const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-02-04-workholding-b36-v08.json"),"utf8"));
const sources=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-02-04-workholding-b36.json"),"utf8"));
function evaluate(x){
 const hash=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 if(!(x["resource.id"]==="FIX-A"&&x["resource.revision"]==="D03-r2"&&hash(x["resource.hash"])&&x["resource.status"]==="RELEASED"&&x["resource.childrenClosed"]===true))return "REJECTED";
 if(!(x["frame.parentPort"]==="TABLE-P1"&&x["frame.childPort"]===x["frame.parentPort"]&&x["frame.evidence"]==="CATALOG-SYNTH"&&x["frame.scale"]===1&&x["frame.det"]===1&&x["frame.policy"]==="PARENT_LOCAL"&&x["frame.from"]==="MACHINE_TABLE"&&x["frame.to"]==="FIXTURE_BASE"))return "REJECTED";
 if(!(x["capacity.unit"]==="mm"&&x["capacity.source"]==="CATALOG-SYNTH"&&Number.isFinite(x["capacity.minMm"])&&Number.isFinite(x["capacity.maxMm"])&&Number.isFinite(x["capacity.plannedMm"])&&x["capacity.minMm"]>=0&&x["capacity.minMm"]<=x["capacity.plannedMm"]&&x["capacity.plannedMm"]<=x["capacity.maxMm"]))return "REJECTED";
 if(!(x["setup.revision"]==="D04-r5"&&x["setup.fixtureRevision"]===x["resource.revision"]&&x["setup.partRevision"]==="D01-r3"&&x["setup.frame"]==="SETUP-R2"&&x["execution.d10Binding"]==="UNKNOWN"))return "REJECTED";
 if(!(x["execution.sensorEvidence"]===null&&x["execution.d13"]==="NOT_RUN"&&x["execution.d14"]==="NOT_RUN"&&x["execution.d15"]==="NOT_RUN"&&x["execution.d16"]==="BLOCKED"))return "REJECTED";
 if(!(x["assessment.loadCase"]==="UNKNOWN"&&x["assessment.friction"]==="UNKNOWN"&&x["assessment.force"]==="UNKNOWN"&&x["assessment.safetyClaim"]===false))return "REJECTED";
 if(!(x["write.expectedResource"]===x["resource.revision"]&&x["write.currentResource"]===x["write.expectedResource"]&&x["write.expectedSetup"]===x["setup.revision"]&&x["write.currentSetup"]===x["write.expectedSetup"]&&x["write.hash"]===x["resource.hash"]&&x["write.authorized"]===true&&x["write.aclEpoch"]===x["write.aclActual"]&&x["write.scopeEpoch"]===x["write.scopeActual"]&&x["write.cancelGen"]===x["write.ackGen"]&&x["write.lateAck"]===false&&x["write.cancelled"]===false&&x["write.cas"]===true))return "REJECTED";
 if(!(x["ui.channels"]==="GUI|CLI|Agent"&&x["ui.owner"]==="02.WorkholdingOwner"&&x["ui.babylonWorldCount"]===1&&x["ui.taskPanel"]==="LEFT_UNIFIED"&&x["ui.fontMaxPx"]<=12&&x["ui.previewPersists"]===false&&hash(x["handoff.frozenBefore"])&&x["handoff.frozenBefore"]===x["handoff.frozenAfter"]&&x["handoff.rollback"]==="READ_ONLY_OLD_REV"&&x["handoff.consumer"]==="NOT_RUN"&&x["handoff.invalidatesChildren"]===true))return "REJECTED";
 if(x["execution.actualState"]!=="UNKNOWN")return "UNKNOWN";
 return "PLANNING_CANDIDATE";
}
const failures=[];const caseIds=new Set(fixtures.cases.map(c=>c.id)),sourceIds=new Set(sources.sources.map(s=>s.id));
if(caseIds.size!==fixtures.cases.length)failures.push("重复case ID");
for(const r of trace.rules){if(!r.sourceIds.length||!r.positiveIds.length||!r.negativeIds.length||!r.fields.length)failures.push(r.id+"链路缺失");for(const id of r.sourceIds)if(!sourceIds.has(id))failures.push(r.id+"未知来源"+id);for(const id of [...r.positiveIds,...r.negativeIds,...r.unknownIds])if(!caseIds.has(id))failures.push(r.id+"未知验收"+id);}
for(const c of fixtures.cases)if(evaluate(c.input)!==c.expected)failures.push(c.id+"结果不符");
for(const [type,key] of [["positive","positiveCount"],["negative","negativeCount"],["unknown","unknownCount"]])if(fixtures.cases.filter(c=>c.kind===type).length!==fixtures[key])failures.push(key+"计数不符");
if(failures.length){console.error(JSON.stringify({status:"FAIL",failures}));process.exit(1)}console.log(JSON.stringify({status:"PASS",level:"PLANNING_SYNTHETIC_ONLY",cases:fixtures.cases.length,realNodeIntegration:"NOT_RUN",realFixture:"NOT_RUN"}));

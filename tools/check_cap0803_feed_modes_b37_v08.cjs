"use strict";
// 仅规划合成门禁，不连接CNC、数据库或控制器；不进行材料扫掠仿真。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const source=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-08-03-feed-modes-b37.json"),"utf8"));
const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-08-03-feed-modes-b37-v08.json"),"utf8"));
const fixtures=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-08-03/feed-modes-b37-fixtures-v08.json"),"utf8"));
function evaluate(x){
 const sha=v=>typeof v==="string"&&/^[0-9a-f]{64}$/.test(v);
 const finite=v=>typeof v==="number"&&Number.isFinite(v);
 if(!(sha(x["identity.d12Hash"])&&x["identity.d12Revision"]==="D12-r37"&&x["identity.d10Revision"]==="D10-r3"&&x["identity.d04Revision"]==="D04-r8"&&x["identity.d10Revision"]!==x["identity.d04Revision"]&&x["identity.d10FrameFrom"]==="MACHINE_BASE"&&x["identity.d10FrameTo"]==="WORKPIECE"&&sha(x["identity.controllerProfileHash"])))return "REJECTED";
 if(!["G93","G94","G95"].includes(x["feed.mode"])||!["G0","G1","G2","G3"].includes(x["feed.motion"])||x["feed.units"]!=="mm"||!finite(x["feed.lengthMm"])||x["feed.lengthMm"]<=0||x["feed.newAfterSwitch"]!==true)return "REJECTED";
 if(x["feed.mode"]==="G93"){
   if(x["feed.motion"]==="G0"){
     if(x["feed.blockHasF"]!==false||x["feed.nominalSeconds"]!==null)return "REJECTED";
   }else{
     if(x["feed.blockHasF"]!==true||!finite(x["feed.value"])||x["feed.value"]<=0||!finite(x["feed.nominalSeconds"])||Math.abs(x["feed.nominalSeconds"]-60/x["feed.value"])>1e-9)return "REJECTED";
   }
 }else{
   if(x["feed.motion"]==="G0"||x["feed.blockHasF"]!==true||!finite(x["feed.value"])||x["feed.value"]<=0||!finite(x["feed.nominalSeconds"]))return "REJECTED";
   if(x["feed.mode"]==="G94" && Math.abs(x["feed.nominalSeconds"]-60*x["feed.lengthMm"]/x["feed.value"])>1e-9)return "REJECTED";
   if(x["feed.mode"]==="G95"){
     if(x["spindle.selected"]!=="S1"||x["spindle.speedInWired"]!==true||!finite(x["spindle.observedRpm"])||x["spindle.observedRpm"]<=0||Math.abs(x["feed.nominalSeconds"]-60*x["feed.lengthMm"]/(x["feed.value"]*x["spindle.observedRpm"]))>1e-9)return "REJECTED";
   }
 }
 if(!["G93","G94","G95"].includes(x["modal.before"])||x["modal.after"]!==x["feed.mode"]||x["modal.snapshotLogged"]!==true||x["modal.byteSpan"]!=="0:28")return "REJECTED";
 if(!(x["gate.d13"]==="SYNTHETIC_KNOWN"&&x["gate.d14"]==="NOT_RUN"&&x["gate.d15"]==="NOT_RUN"&&x["gate.d16"]==="BLOCKED"&&x["gate.clOnlyEligible"]===false))return "REJECTED";
 if(!(x["owner.expectedRevision"]==="D13-r7"&&x["owner.actualRevision"]===x["owner.expectedRevision"]&&sha(x["owner.expectedHash"])&&x["owner.actualHash"]===x["owner.expectedHash"]&&x["owner.aclEpoch"]===x["owner.aclActual"]&&x["owner.scopeEpoch"]===x["owner.scopeActual"]&&x["owner.cancelGen"]===x["owner.ackGen"]&&x["owner.cancelled"]===false&&x["owner.lateAck"]===false&&x["owner.cas"]===true))return "REJECTED";
 if(!(x["ui.channels"]==="GUI|CLI|Agent"&&x["ui.ownerPort"]==="08.NcSemanticOwner"&&x["ui.babylonWorlds"]===1&&x["ui.leftPanel"]===true&&x["ui.fontMaxPx"]<=12&&x["ui.previewWrites"]===false&&sha(x["handoff.freezeBefore"])&&x["handoff.freezeAfter"]===x["handoff.freezeBefore"]&&x["handoff.readerRollback"]==="READ_ONLY_OLD"&&x["handoff.consumer"]==="NOT_RUN"))return "REJECTED";
 if(x["feed.mode"]==="G95"&&x["spindle.measurement"]==="UNAVAILABLE")return "UNKNOWN";
 if(x["feed.mode"]==="G95"&&x["spindle.measurement"]!=="SYNTHETIC_ONLY")return "REJECTED";
 return "PLANNING_CANDIDATE";
}
const failures=[];
const cases=new Map(fixtures.cases.map(c=>[c.id,c]));
const ids=new Set(source.sources.map(s=>s.id));
if(cases.size!==fixtures.cases.length)failures.push("验收ID重复");
for(const r of trace.rules){
 if(!r.sourceIds.length||!r.fields.length||!r.positiveIds.length||!r.negativeIds.length||!r.workPackageIds.length)failures.push(r.id+"不完整");
 for(const s of r.sourceIds)if(!ids.has(s))failures.push(r.id+"来源失联:"+s);
 for(const [set,kind] of [[r.positiveIds,"positive"],[r.negativeIds,"negative"],[r.unknownIds,"unknown"]])for(const id of set){const c=cases.get(id);if(!c||c.kind!==kind)failures.push(r.id+"验收错误:"+id)}
}
for(const c of fixtures.cases)if(evaluate(c.input)!==c.expected)failures.push(c.id+"判定错误");
for(const kind of ["positive","negative","unknown"])if(fixtures.cases.filter(c=>c.kind===kind).length!==fixtures[kind+"Count"])failures.push(kind+"数量不符");
if(failures.length){console.error(JSON.stringify({status:"FAIL",failures}));process.exitCode=1}else console.log(JSON.stringify({status:"PASS",level:"PLANNING_SYNTHETIC_ONLY",cases:fixtures.cases.length,actualD13:"NOT_RUN",actualD14D15:"NOT_RUN",owners:"PENDING_HUMAN"}));

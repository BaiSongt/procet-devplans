"use strict";
// 仅检验本仓规划规则/手写正反案例；不验证产品与NC解释器。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const load=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const src=load("research/sources/CAP-08-05-return-role-b113.json"),trace=load("research/traces/CAP-08-05-return-role-b113-v08.json"),data=load("docs/capabilities/CAP-08-05/return-role-b113-fixtures-v08.json");
const judge=function judge(rule,x){
const yes=(status,detail,value)=>({status,detail,...(value===undefined?{}:{value})});
switch(rule){
case "B113-R01":if(!x.firmwarePinned)return yes("UNKNOWN","PROFILE_UNPINNED");if(!["HAAS_MILL:MILL:RETRACT","HAAS_LATHE:LATHE:FEED","LINUXCNC_2_9:MILL:RETRACT"].includes([x.family,x.machineClass,x.declaredRole].join(":")))return yes("REJECT","ROLE_COLLISION");return yes("CANDIDATE","ROLE_EXPLICIT");
case "B113-R02":if(x.family!=="LINUXCNC_2_9"||!["G98","G99"].includes(x.command)||!Number.isFinite(x.initialZ)||!Number.isFinite(x.rPlane))return yes("UNKNOWN","MISSING_LINUXCNC_EVIDENCE");return yes("CANDIDATE","NOMINAL_RETURN_ONLY",x.command==="G98"?Math.max(x.initialZ,x.rPlane):x.rPlane);
case "B113-R03":if(x.afterG80&&!x.recaptured)return yes("UNKNOWN","RECAPTURE_REQUIRED");if(x.cycleSwitched&&!x.initialRetained)return yes("STALE","LOST_CONTIGUOUS_INITIAL");return yes("CANDIDATE","INITIAL_PLANE_TRACKED");
case "B113-R04":if(!["G90","G91"].includes(x.distanceMode)||!Number.isFinite(x.rWord))return yes("UNKNOWN","R_MODE_UNKNOWN");if(x.distanceMode==="G91"&&!Number.isFinite(x.entryZ))return yes("UNKNOWN","ENTRY_Z_UNKNOWN");return yes("CANDIDATE","LINUXCNC_R_NOMINAL",x.distanceMode==="G90"?x.rWord:x.entryZ+x.rWord);
case "B113-R05":if(x.machineClass!=="MILL")return yes("REJECT","HAAS_MILL_REQUIRED");if(x.command==="G98"&&Number.isFinite(x.initialZ)&&Number.isFinite(x.rPlane)&&x.initialZ>=x.rPlane)return yes("CANDIDATE","MILL_INITIAL_POINT",x.initialZ);if(x.command==="G99"&&Number.isFinite(x.rPlane))return yes("CANDIDATE","MILL_R_PLANE",x.rPlane);return yes("UNKNOWN","HAAS_UNREAD_EDGE_CASE");
case "B113-R06":if(x.machineClass!=="LATHE")return yes("REJECT","LATHE_FEED_NOT_MILL_RETRACT");if(!Number.isFinite(x.fValue)||x.fValue<=0)return yes("UNKNOWN","F_UNCERTAIN");if(x.command==="G98")return yes("CANDIDATE","FEED_MM_PER_MIN",x.fValue);if(x.command==="G99"&&Number.isFinite(x.rpm)&&x.rpm>0)return yes("CANDIDATE","FEED_MM_PER_REV_SNAPSHOT",x.fValue*x.rpm);return yes("UNKNOWN","RPM_OR_MODE_UNKNOWN");
case "B113-R07":if(!Number.isFinite(x.requiredClearanceZ)||!Number.isFinite(x.retractZ))return yes("UNKNOWN","CLEARANCE_UNKNOWN");if(x.retractZ<x.requiredClearanceZ)return yes("REJECT","RETRACT_TOO_LOW");if(!x.envelopeCertified)return yes("UNKNOWN","FULL_TOOL_HOLDER_PATH_UNKNOWN");return yes("CANDIDATE","GEOMETRIC_EVIDENCE_ONLY");
case "B113-R08":if(!x.d04Exact||!x.d10Exact||!x.frameExact||x.cancelled)return yes("STALE","EXACT_OR_CANCEL_FENCE");if(!x.acl||!x.cas)return yes("REJECT","ACL_CAS_FAILED");if(x.releaseRequested&&!x.d15Independent)return yes("REJECT","D15_NOT_RUN_BLOCK_D16");return yes("CANDIDATE","OWNER_PRECONDITIONS_ONLY");
default:throw Error("UNKNOWN_RULE");
}};
const sourceIds=new Set(src.sources.map(x=>x.id)),caseMap=new Map(data.cases.map(x=>[x.id,x]));
assert.equal(src.registeredRecords,src.sources.length);assert.equal(caseMap.size,data.cases.length);
for(const r of trace.rules){assert.ok(r.fields.length&&r.caps.length&&r.originalWorkPackages.length);assert.ok(r.sourceIds.every(x=>sourceIds.has(x)));assert.ok(r.positive.length===1&&r.negative.length>=2);assert.ok([...r.positive,...r.negative].every(id=>caseMap.has(id)&&caseMap.get(id).rule===r.id))}
for(const t of data.cases){const v=judge(t.rule,t.input);assert.equal(v.status,t.expect,t.id+":"+v.detail);if(t.value!==undefined)assert.ok(Math.abs(v.value-t.value)<1e-9,t.id+":Golden");assert.notEqual(v.status,"NC_VALIDATED")}
console.log("B113 规划同judge合成:",data.cases.length+"/"+data.cases.length,"；真实D13-D16、独立消费者NOT_RUN");

"use strict";
// B107：仅本仓JSON规划合成校验；不启动产品、真实设备或付费CI。
const fs=require("node:fs");const path=require("node:path");
const judge=function judge(x){
 if(!x||typeof x!=="object")return "REJECT";
 const r=x.resource||{},q=x.request||{},e=x.evidence||{},c=x.calibration||{},t=x.tx||{},u=x.ui||{},d=x.chain||{};
 if(t.cancelled===true||t.lateAck===true||t.scopeEpoch!==t.receiptEpoch||t.expectedRevision!==t.currentRevision||c.revision!==c.appliedRevision||c.status==="EXPIRED"||c.stylusConfigExact!==q.stylusConfigExact)return "STALE";
 if(t.aclAllowed!==true||t.casAllowed!==true||t.ownerPort!=="02:MeasurementResourcePort"||u.guiPort!==t.ownerPort||u.cliPort!==t.ownerPort||u.agentPort!==t.ownerPort||u.babylonWorldCount!==1||u.taskPanel!=="LEFT_UNIFIED")return "REJECT";
 const modes={SPINDLE_TOUCH_PROBE:["NC","DISCRETE_TOUCH"],CMM_TOUCH_PROBE:["CMM","DISCRETE_TOUCH"],CONTACT_TOOL_SETTER:["NC","CONTACT_TOOL_SETTING"],LASER_TOOL_SETTER:["NC","LASER_TOOL_SETTING"]};
 if(!Object.prototype.hasOwnProperty.call(modes,r.kind)||q.machineRole!==modes[r.kind][0]||q.mode!==modes[r.kind][1])return "REJECT";
 if(q.isoScopeClaim==="FULL_2022_CONFORMITY"&&e.actualIndependentSystemTest!==true)return "REJECT";
 if(e.vendorRigMetricIsSystemUncertainty===true||e.vendorRepeatabilityUsedAsPieceBudget===true||d.d03WritesD17===true||d.clPreviewAsD15===true||d.unknownD13PermitsD16===true||d.rewriteFrozenAB===true)return "REJECT";
 if(!/^[a-f0-9]{64}$/.test(String(r.sha256||""))||!r.exactRevision||!q.machineExact||!q.frameRef||!q.stylusConfigExact||!e.sourceRef||!e.metricConditions||!e.actualMethodBasis||c.status!=="VALID"||!/^[a-f0-9]{64}$/.test(String(c.certificateHash||"")))return "UNKNOWN";
 return "CATALOG_CANDIDATE_ONLY";
};
function main(root=process.cwd()){
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
 const s=read("research/sources/CAP-02-06-probe-qualification-b107.json"),t=read("research/traces/CAP-02-06-probe-qualification-b107-v08.json"),f=read("docs/capabilities/CAP-02-06/probe-qualification-b107-fixtures-v08.json");
 const sourceIds=new Set(s.sources.map(x=>x.id)),ids=new Set(f.cases.map(x=>x.id));
 if(s.registeredRecords!==s.sources.length||sourceIds.size!==s.sources.length||t.rules.length!==8||f.cases.length!==34||ids.size!==f.cases.length)throw Error("登记、规则或案例数错误");
 for(const r of t.rules){
  if(!r.fields?.length||!r.sourceIds?.length||!r.caps?.includes("CAP-02-06")||!r.originalWorkPackages?.length||!r.positive?.length||!r.negative?.length)throw Error("规则链缺失 "+r.id);
  for(const id of r.sourceIds)if(!sourceIds.has(id))throw Error("未知来源 "+id);
  for(const id of [...r.positive,...r.negative])if(!ids.has(id))throw Error("未知验收 "+id);
 }
 const counts={};
 for(const v of f.cases){const actual=judge(v.input);counts[actual]=(counts[actual]||0)+1;if(actual!==v.expected)throw Error("验收偏差 "+v.id+" "+actual+" !== "+v.expected)}
 return {passed:f.cases.length,counts,level:"SYNTHETIC_ONLY",independentConsumers:"NOT_RUN",product:"NOT_RUN"};
}
if(require.main===module){try{console.log(JSON.stringify(main(),null,2))}catch(e){console.error(e.stack||String(e));process.exitCode=1}}
module.exports={judge,main};

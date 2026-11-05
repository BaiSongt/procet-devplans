"use strict";
// 只读运行合成案例，不访问产品仓或真实机床。判定函数与提交前V8同源。
const fs=require("node:fs"),path=require("node:path");
const verdict=function verdict(x){
 const isHash=v=>typeof v==="string"&&/^[0-9a-f]{64}$/.test(v);
 const a=x?.assembly,h=x?.holder,t=x?.cutter,f=x?.fit,l=x?.length,s=x?.setup,e=x?.execution,u=x?.ui,w=x?.write,d=x?.handoff;
 if(!a||!h||!t||!f||!l||!s||!e||!u||!w||!d)return "REJECT";
 if(!a.id||!a.revision||!isHash(a.hash)||a.resourceKind!=="TOOL_ASSEMBLY"||a.exactChildren!==true||a.noLatestFallback!==true||a.changeIsNewRevision!==true||!h.ref||!t.ref||!isHash(h.hash)||!isHash(t.hash))return "REJECT";
 if(!h.mountInterface||!h.datum||!f.parentPort||!f.childPort)return "UNKNOWN";
 if(h.mountInterface!==f.parentPort||f.parentPort!==f.childPort||f.compatible!==true)return "REJECT";
 if(!f.evidenceRef||!f.engagementSource||!Number.isFinite(f.engagementMm))return "UNKNOWN";
 if(!Number.isFinite(t.clampedShankMinMm)||f.engagementMm<t.clampedShankMinMm)return "REJECT";
 if(l.unit!=="mm"||l.frameFrom!==h.datum||l.frameTo!==t.tcpKind||l.rightHanded!==true||t.tcpKind!=="TIP"||l.calibrationDistinct!==true||l.displayGeometryIsOracle!==false)return "REJECT";
 if(l.coaxial!==true)return "UNKNOWN";
 if(!Number.isFinite(h.bodyAxialMm)||!Number.isFinite(l.holderDatumMm)||!Number.isFinite(l.stickoutMm)||!Number.isFinite(l.nominalGaugeMm)||h.bodyAxialMm!==l.holderDatumMm||l.holderDatumMm<0||l.stickoutMm<0||Math.abs(l.nominalGaugeMm-(l.holderDatumMm+l.stickoutMm))>1e-9)return "REJECT";
 if(s.d04AssemblyRevision!==a.revision||!s.d04Frame||!s.d10BindingRef||!s.d10MachineRevision||!s.d10MountFrame||s.d04Frame===s.d10MountFrame)return "REJECT";
 if(!isHash(e.offsetTableHash)||!isHash(e.d13NcHash)||!e.d13InterpreterRevision||!e.offsetEvidence||!Number.isFinite(e.activeTloMm)||!Number.isInteger(e.hNumber)||e.hNumber<=0)return "UNKNOWN";
 if(e.offsetSource!=="D10_CALIBRATION"||e.clAlreadyCompensated!==false||e.compensatedExactlyOnce!==true||e.verifiedByD15!==false)return "REJECT";
 const linux=e.controller==="LINUXCNC"&&e.software==="2.9"&&e.semanticSource==="LINUXCNC_2_9_G43"&&e.mode==="G43_H";
 const haas=e.controller==="HAAS_NGC"&&e.software==="100.21.000.1100"&&e.semanticSource==="HAAS_NGC_100_21_000_1100"&&e.mode==="AUTO_ON_M6";
 if(!linux&&!haas)return "UNKNOWN";
 if(JSON.stringify(u.channels)!==JSON.stringify(["GUI","CLI","Agent"])||u.ownerPort!=="02.ToolAssemblyOwner"||u.worlds!==1||u.sceneKind!=="SINGLE_ACTIVE_BABYLON"||u.panel!=="left/UnifiedTaskPanel"||!(u.maxFontPx<=12&&u.maxFontPx>0)||u.previewPersists!==false)return "REJECT";
 if(w.expectedRevision!==a.revision||w.actualRevision!==w.expectedRevision||w.observedHash!==a.hash||w.aclEpoch!==w.aclObserved||w.scopeEpoch!==w.scopeObserved||w.cancelGeneration!==w.ackGeneration||w.cancelled!==false||w.lateAck!==false||w.authorized!==true||w.cas!==true)return "REJECT";
 if(!isHash(d.beforeFrozenHash)||d.afterFrozenHash!==d.beforeFrozenHash||d.d04NotD10!==true||d.d14!=="NOT_RUN"||d.d15!=="NOT_RUN"||d.d16!=="BLOCKED"||d.consumer!=="NOT_RUN"||d.rollback!=="READ_ONLY_EXACT_REVISION"||d.dependencyInvalidation!=="EXPLICIT")return "REJECT";
 return "PLANNING_CANDIDATE";
};
const f=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../docs/capabilities/CAP-02-03/gauge-offset-b32-fixtures-v08.json"),"utf8"));
const issues=[]; for(const c of f.cases){const got=verdict(c.input); if(got!==c.expected)issues.push(c.id+":"+got+"!="+c.expected)}
if(f.cases.length!==f.positiveCount+f.negativeCount)issues.push("count");
const p=f.cases.find(c=>c.id==="P01")?.input,q=f.cases.find(c=>c.id==="P02")?.input;
if(!p||!q||p.execution.activeTloMm===p.length.nominalGaugeMm||q.execution.controller!=="HAAS_NGC")issues.push("no_distinct_TLO_or_cross_OEM");
console.log(JSON.stringify({total:f.cases.length,positive:f.positiveCount,negative:f.negativeCount,unknown:f.unknownCount,issues,level:"SYNTHETIC_ONLY",nodeProcess:"EXECUTED_ONLY_WHEN_ACTUALLY_RUN",product:"NOT_RUN"}));if(issues.length)process.exitCode=1;

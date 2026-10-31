"use strict";
// 规划合成校验；不会连接真实机床或修改产品/数据库，不能授予D15工程PASS。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const source=read("research/sources/CAP-08-03-wcs-offsets-b46.json"),trace=read("research/traces/CAP-08-03-wcs-offsets-b46-v08.json"),fixtures=read("docs/capabilities/CAP-08-03/wcs-offsets-b46-fixtures-v08.json");
const judge=function judge(x){
 const sha=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 const num=v=>typeof v==="number"&&Number.isFinite(v);
 if(!x||!x.identity||!x.src||!x.profile||!x.event||!x.owner||!x.ui||!x.handoff||!x.gate)return "REJECTED";
 const i=x.identity,s=x.src,pr=x.profile,e=x.event,o=x.owner,u=x.ui,h=x.handoff,g=x.gate;
 if(!sha(i.d12Hash)||!sha(i.controllerProfileHash)||!sha(s.frameHash)||!i.d12Revision||!i.d04Revision||!i.d10Revision||i.d04Revision===i.d10Revision||i.frameFrom!=="MACHINE_BASE"||i.frameTo!=="WORKPIECE"||i.frameFrom===i.frameTo)return "REJECTED";
 if(s.ncHash!==i.d12Hash||s.controllerProfileHash!==i.controllerProfileHash||!Number.isInteger(s.byteStart)||s.byteStart<0||!Number.isInteger(s.byteEnd)||s.byteEnd<=s.byteStart||s.reparsed!==true||s.modalSnapshot!==true)return "REJECTED";
 if(!(o.actualRevision===o.expectedRevision&&o.actualRevision==="D13-r7"&&sha(o.expectedHash)&&o.actualHash===o.expectedHash&&o.aclEpoch===o.aclActual&&o.scopeEpoch===o.scopeActual&&o.cancelGen===o.ackGen&&o.cancelled===false&&o.lateAck===false&&o.cas===true))return "REJECTED";
 if(!(u.channels==="GUI|CLI|Agent"&&u.ownerPort==="08.NcSemanticOwner"&&u.babylonWorlds===1&&u.leftPanel===true&&num(u.fontMaxPx)&&u.fontMaxPx<=12&&u.fontMaxPx>0&&u.previewWrites===false))return "REJECTED";
 if(!(sha(h.freezeBefore)&&h.freezeAfter===h.freezeBefore&&h.readerRollback==="READ_ONLY_OLD"&&h.consumer==="NOT_RUN"&&g.d13==="SYNTHETIC_KNOWN"&&g.d14==="NOT_RUN"&&g.d15==="NOT_RUN"&&g.d16==="BLOCKED"&&g.clOnlyEligible===false))return "REJECTED";
 if(pr.verified!==true||pr.dialect!=="LinuxCNC-2.9")return "UNKNOWN";
 const modes=["G54","G55","G56","G57","G58","G59","G59.1","G59.2","G59.3"];
 if(!modes.includes(e.beforeWcs)||!modes.includes(e.afterWcs)||!modes.includes(e.nextBlockWcs))return "REJECTED";
 const same=e.beforeWcs===e.afterWcs&&e.afterWcs===e.nextBlockWcs;
 if(e.op==="SELECT_WCS")return e.g53ThisBlock===false&&e.motionFrame==="WCS"&&modes.includes(e.targetWcs)&&e.afterWcs===e.targetWcs&&e.nextBlockWcs===e.targetWcs?"PLANNING_CANDIDATE":"REJECTED";
 if(e.op==="G53_MOVE")return same&&e.g53ThisBlock===true&&e.motionFrame==="MACHINE"&&["G0","G1"].includes(e.motion)&&e.cutterComp===false?"PLANNING_CANDIDATE":"REJECTED";
 if(e.op==="G10_L2"||e.op==="G10_L20"){
   if(!same||!Number.isInteger(e.p)||e.p<1||e.p>9||e.targetWcs!==modes[e.p-1]||e.g91Ignored!==true||e.oldY!==e.newY||!num(e.requestX)||!num(e.offsetX))return "REJECTED";
   if(e.op==="G10_L2")return e.offsetX===e.requestX?"PLANNING_CANDIDATE":"REJECTED";
   if(e.pureTranslation!==true||!num(e.machineX)||!num(e.desiredX)||e.offsetX!==e.machineX-e.desiredX)return "REJECTED";
   return "PLANNING_CANDIDATE";
 }
 if(e.op==="G52_SET"){
   if(!same||e.sharedRegisters!==true||!num(e.oldX)||!num(e.newX)||e.newX!==e.requestLocalX||e.oldY!==e.newY)return "REJECTED";
   if(!["DISABLED","ENABLED","UNKNOWN"].includes(e.g92Persistence))return "REJECTED";
   if(e.g92Persistence==="UNKNOWN")return "UNKNOWN";
   return e.resetWouldRetain===(e.g92Persistence==="ENABLED")?"PLANNING_CANDIDATE":"REJECTED";
 }
 if(e.op==="G92_SUSPEND")return same&&e.activeBefore===true&&e.activeAfter===false&&num(e.storedBefore)&&e.storedBefore!==0&&e.storedAfter===e.storedBefore?"PLANNING_CANDIDATE":"REJECTED";
 if(e.op==="G92_RESTORE")return same&&e.activeBefore===false&&e.activeAfter===true&&num(e.storedBefore)&&e.storedBefore!==0&&e.storedAfter===e.storedBefore&&e.effectiveAfter===e.storedBefore?"PLANNING_CANDIDATE":"REJECTED";
 if(e.op==="G92_CLEAR")return same&&e.activeAfter===false&&e.storedAfter===0&&e.effectiveAfter===0?"PLANNING_CANDIDATE":"REJECTED";
 return "UNKNOWN";
};
const errors=[],cmap=new Map(fixtures.cases.map(c=>[c.id,c])),sourceIds=new Set(source.sources.map(s=>s.id)),ruleIds=new Set(trace.rules.map(r=>r.id));
if(cmap.size!==fixtures.cases.length)errors.push("验收ID重复");
for(const rule of trace.rules){
 if(!rule.sourceIds.length||!rule.fields.length||!rule.positiveIds.length||!rule.negativeIds.length||!rule.workPackageIds.length)errors.push(rule.id+"字段不全");
 for(const id of rule.sourceIds)if(!sourceIds.has(id))errors.push(rule.id+"来源失联:"+id);
 for(const [ids,kind] of [[rule.positiveIds,"positive"],[rule.negativeIds,"negative"],[rule.unknownIds,"unknown"]])for(const id of ids){const c=cmap.get(id);if(!c||c.kind!==kind)errors.push(rule.id+"映射失败:"+id)}
}
for(const c of fixtures.cases){if(judge(c.input)!==c.expected)errors.push(c.id+"独立预期判定失败");if(c.kind!=="positive"&&!ruleIds.has(c.ruleId))errors.push(c.id+"规则未登记");}
for(const kind of ["positive","negative","unknown"])if(fixtures.cases.filter(c=>c.kind===kind).length!==fixtures[kind+"Count"])errors.push(kind+"计数错误");
if(errors.length){console.error(JSON.stringify({status:"FAIL",errors}));process.exitCode=1}
else console.log(JSON.stringify({status:"PASS",grade:"SYNTHETIC_PLANNING_ONLY",cases:fixtures.cases.length,positive:fixtures.positiveCount,negative:fixtures.negativeCount,unknown:fixtures.unknownCount,owner:"PENDING_HUMAN",realD13D14D15:"NOT_RUN"}));

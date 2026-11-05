"use strict";
// B47仅校验规划合成案例，不读取机床，不修改产品；所有D15/发布保持NOT_RUN。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const judge=function judge(x){
 const num=v=>typeof v==="number"&&Number.isFinite(v),sha=v=>typeof v==="string"&&/^[0-9a-f]{64}$/.test(v);
 const eq=(a,b)=>Math.abs(a-b)<1e-7,arrEq=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((z,i)=>num(z)&&eq(z,b[i]));
 if(!x||!x.identity||!x.profile||!x.cycle||!x.observed||!x.trace||!x.owner||!x.ui||!x.gate)return "REJECTED";
 const i=x.identity,p=x.profile,c=x.cycle,o=x.observed,t=x.trace,a=x.owner,u=x.ui,g=x.gate;
 if(!sha(i.d12Hash)||!sha(i.controllerProfileHash)||!i.d12Revision||!i.d04Revision||!i.d10Revision||i.d04Revision===i.d10Revision||i.frame!=="WCS:G54"||!Number.isInteger(i.scopeEpoch)||i.scopeEpoch<0)return "REJECTED";
 if(t.ncHash!==i.d12Hash||t.profileHash!==i.controllerProfileHash||!sha(t.modalBeforeHash)||!sha(t.modalAfterHash)||!Number.isInteger(t.byteStart)||t.byteStart<0||!Number.isInteger(t.byteEnd)||t.byteEnd<=t.byteStart||!t.physicalLine||!t.callPath||!t.cycleEpoch||t.fromFinalNc!==true||!Array.isArray(t.iterationIds))return "REJECTED";
 if(!sha(a.expectedHash)||a.actualHash!==a.expectedHash||a.expectedRevision!==a.actualRevision||a.aclGranted!==true||a.scopeExpected!==i.scopeEpoch||a.scopeActual!==i.scopeEpoch||a.cancelGeneration!==a.ackGeneration||a.cancelled!==false||a.lateAck!==false||a.casSucceeded!==true||!sha(a.freezeBefore)||a.freezeAfter!==a.freezeBefore||a.oldReaderReadOnlyRollback!==true)return "REJECTED";
 if(!(u.entries==="GUI|CLI|Agent"&&u.ownerPort==="08.NcExecutionPort"&&u.babylonWorlds===1&&u.leftTaskPanel===true&&num(u.maxFontPx)&&u.maxFontPx<=12&&u.maxFontPx>0&&u.previewWrites===false))return "REJECTED";
 if(!(g.d13==="SYNTHETIC_ONLY"&&g.d14==="NOT_RUN"&&g.d15==="NOT_RUN"&&g.d16==="BLOCKED"&&g.clPromotedToD15===false))return "REJECTED";
 if(p.verified!==true||p.dialect!=="LinuxCNC-2.9"||p.unit!=="mm")return "UNKNOWN";
 if(c.kind!=="G83"||c.plane!=="G17")return "UNKNOWN";
 if(c.distance!=="G90"||!["G98","G99"].includes(c.returnMode)||c.feedMode!=="G94"||c.cutterComp!=="G40"||c.rotaryWords!==false)return "REJECTED";
 if(![c.initialZ,c.r,c.z,c.q,c.wordX,c.initialX].every(num)||c.r<=c.z||c.q<=0||!Number.isInteger(c.l)||c.l<1||c.l>8||!Number.isInteger(c.sourceLineIteration)||c.sourceLineIteration!==c.l)return "REJECTED";
 if(c.hasG80!==true||o.cycleActiveAfter!==false||o.nextBlockAxisWithoutMotion!==false)return "REJECTED";
 const count=Math.ceil((c.r-c.z)/c.q);
 if(count>64||count<1)return "REJECTED";
 const depths=Array.from({length:count},(_,k)=>Math.max(c.z,c.r-(k+1)*c.q));
 const mid=Array(Math.max(0,count-1)).fill(c.r);
 const restart=depths.slice(0,-1).map(d=>d+0.254);
 const clear=c.returnMode==="G98"?Math.max(c.initialZ,c.r):c.r;
 const xs=Array(c.l).fill(c.wordX);
 if(!arrEq(o.feedTargetZ,depths)||!arrEq(o.intermediateRetractZ,mid)||!arrEq(o.restartRapidTargetZ,restart)||!num(o.finalRetractZ)||!eq(o.finalRetractZ,clear)||!arrEq(o.holeXs,xs)||o.pecksPerHole!==count||o.preliminaryRMove!==(c.initialZ<c.r))return "REJECTED";
 if(t.iterationIds.length!==c.l||new Set(t.iterationIds).size!==c.l||t.iterationIds.some((v,j)=>v!==`cycle:${t.cycleEpoch}:repeat:${j+1}`))return "REJECTED";
 return "PLANNING_CANDIDATE";
};
const s=read("research/sources/CAP-08-05-peck-motion-b47.json"),t=read("research/traces/CAP-08-05-peck-motion-b47-v08.json"),f=read("docs/capabilities/CAP-08-05/peck-motion-b47-fixtures-v08.json");
const errors=[],si=new Set(s.sources.map(x=>x.id)),ri=new Set(t.rules.map(x=>x.id)),ci=new Map(f.cases.map(x=>[x.id,x]));
if(si.size!==s.sources.length||ri.size!==t.rules.length||ci.size!==f.cases.length)errors.push("来源/规则/用例ID不唯一");
for(const r of t.rules){if(!r.fields.length||!r.sourceIds.length||!r.workPackageIds.length||!r.positiveIds.length||!r.negativeIds.length)errors.push(r.id+":缺闭环");for(const id of r.sourceIds)if(!si.has(id))errors.push(r.id+":来源缺失 "+id);for(const [ids,kind] of [[r.positiveIds,"positive"],[r.negativeIds,"negative"],[r.unknownIds,"unknown"]])for(const id of ids){if(ci.get(id)?.kind!==kind)errors.push(r.id+":用例未映射 "+id)}}
function diff(a,b,p="",out=[]){if(a===b)return out;if(a&&b&&typeof a==="object"&&typeof b==="object"&&!Array.isArray(a)&&!Array.isArray(b)){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p?p+"."+k:k,out)}else if(JSON.stringify(a)!==JSON.stringify(b))out.push(p);return out}
for(const c of f.cases){if(judge(c.input)!==c.expected)errors.push(c.id+":预期判定不一致");if(c.kind!=="positive"){if(!ri.has("B47-"+c.ruleId))errors.push(c.id+":规则未映射");const base=ci.get(c.parentPositiveId);if(!base||JSON.stringify(diff(base.input,c.input))!==JSON.stringify([c.mutatedField]))errors.push(c.id+":非独立单字段变异")}}
for(const kind of ["positive","negative","unknown"])if(f.cases.filter(x=>x.kind===kind).length!==f[kind+"Count"])errors.push(kind+":数目不符");
if(errors.length){console.error(JSON.stringify({status:"FAIL",errors}));process.exitCode=1}else console.log(JSON.stringify({status:"PASS",grade:"SYNTHETIC_PLANNING_ONLY",count:f.cases.length,positive:f.positiveCount,negative:f.negativeCount,unknown:f.unknownCount,realNc:"NOT_RUN",independentConsumer:"NOT_RUN"}));

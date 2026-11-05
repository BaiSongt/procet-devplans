"use strict";
// 规划合同只读验收，不解释真实NC，不准许机床执行。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sources=read("research/sources/CAP-08-03-arc-modal-b95.json"),trace=read("research/traces/CAP-08-03-arc-modal-b95-v08.json"),fixtures=read("docs/capabilities/CAP-08-03/arc-modal-b95-fixtures-v08.json");
function judge(x){
 const req=(o,k)=>o&&Object.prototype.hasOwnProperty.call(o,k);
 for(const [obj,keys] of [["source",["d04Exact","d10Exact","framePinned","frozenUnchanged"]],["modal",["endpointMode","centerMode","initialSnapshotExact"]],["plane",["selected","ijkLetters"]],["geometry",["start","end","ijk","radiusErrorMm"]],["radius",["rSigned","sweepDegrees","nearSemicircle"]],["turns",["fullCircle","format","pInteger"]],["helix",["axisVerified","pitchEvaluated","profilePinned"]],["chain",["finalNcByteHash","d13UnknownBlocks","d14Independent","d15Independent","clPreviewNotPass"]],["owner",["aclRechecked","casRechecked","cancelFence","samePort","singleWorldLeftPanel","rollbackNonDestructive"]]]){
  for(const key of keys)if(!req(x[obj],key)||x[obj][key]===null)return "UNKNOWN";
 }
 if(Object.values(x.source).some(v=>v!==true))return "REJECT";
 if(!["G90","G91"].includes(x.modal.endpointMode)||!["G90.1","G91.1"].includes(x.modal.centerMode)||x.modal.initialSnapshotExact!==true)return "REJECT";
 const expect={G17:"IJ",G18:"IK",G19:"JK"};
 if(!expect[x.plane.selected])return "REJECT";
 if(x.plane.selected==="G18"&&x.modal.centerMode==="G90.1"&&x.plane.docConflictResolved!==true)return "UNKNOWN";
 if(x.plane.ijkLetters!==expect[x.plane.selected])return "REJECT";
 if(![x.geometry.start,x.geometry.end,x.geometry.ijk].every(a=>Array.isArray(a)&&a.length===2&&a.every(Number.isFinite))||!Number.isFinite(x.geometry.radiusErrorMm)||x.geometry.radiusErrorMm>0.001||x.geometry.radiusErrorMm<0)return "REJECT";
 if(!Number.isFinite(x.radius.rSigned)||x.radius.rSigned===0||!Number.isFinite(x.radius.sweepDegrees)||x.radius.sweepDegrees<=0||x.radius.sweepDegrees>=360)return "REJECT";
 if(x.radius.nearSemicircle===true)return "UNKNOWN";
 if((x.radius.rSigned>0&&x.radius.sweepDegrees>=180)||(x.radius.rSigned<0&&x.radius.sweepDegrees<=180))return "REJECT";
 if(!Number.isInteger(x.turns.pInteger)||x.turns.pInteger<1||!["CENTER","R"].includes(x.turns.format))return "REJECT";
 if(x.turns.fullCircle&&x.turns.format!=="CENTER")return "REJECT";
 if(x.helix.axisVerified!==({G17:"Z",G18:"Y",G19:"X"})[x.plane.selected]||x.helix.pitchEvaluated!==true||x.helix.profilePinned!==true)return "REJECT";
 if(Object.values(x.chain).some(v=>v!==true))return "REJECT";
 if(Object.values(x.owner).some(v=>v!==true))return "REJECT";
 return "PASS";
}
function apply(base,changes){const x=JSON.parse(JSON.stringify(base));for(const [key,value] of changes){const p=key.split(".");let t=x;for(let i=0;i<p.length-1;i++)t=t[p[i]];t[p.at(-1)]=value;}return x}
const problems=[];
if(fixtures.syntheticOnly!==true||fixtures.productPass!==false)problems.push("非法产品PASS");
if(sources.sources.length!==sources.registeredRecords)problems.push("来源计数");
const sids=new Set(sources.sources.map(x=>x.id)),ids=new Set();
for(const c of fixtures.cases){if(ids.has(c.id))problems.push("重复用例"+c.id);ids.add(c.id);const got=judge(apply(fixtures.base,c.changes));if(got!==c.expected)problems.push(c.id+" "+got+"≠"+c.expected)}
for(const r of trace.rules){if(!r.sourceIds.every(id=>sids.has(id)))problems.push("来源断链"+r.id);if(![...r.positiveIds,...r.negativeIds,...r.unknownIds].every(id=>ids.has(id)))problems.push("测试断链"+r.id);const q=new Set(fixtures.cases.filter(c=>c.ruleId===r.id).map(c=>c.expected));if(!["PASS","REJECT","UNKNOWN"].every(s=>q.has(s)))problems.push("状态缺失"+r.id)}
const g=fixtures.mathGoldens[0],h=fixtures.mathGoldens[1];
if(Math.abs(Math.hypot(g.offset[0],g.offset[1])-g.incrementalRadius)>1e-12||Math.abs(Math.hypot(g.start[0]-g.offset[0],g.start[1]-g.offset[1])-g.absoluteRadius)>1e-12)problems.push("弧心Golden");
if(Math.abs(h.sweepRadians-h.turns*2*Math.PI)>1e-12||h.pitchPerTurnMm!==(h.zEnd-h.zStart)/h.turns)problems.push("多圈Golden");
if(problems.length){console.error(problems.join("\n"));process.exitCode=1;}else console.log("B95_PLANNING_SYNTHETIC_PASS cases="+fixtures.cases.length+" golden=2 PRODUCT_NOT_RUN");

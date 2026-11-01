"use strict";
// 只读规划合成门禁：不能驱动机床、不能替代D13独立NC解释。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sources=read("research/sources/CAP-08-03-cutter-comp-b96.json"),trace=read("research/traces/CAP-08-03-cutter-comp-b96-v08.json"),fixtures=read("docs/capabilities/CAP-08-03/cutter-comp-b96-fixtures-v08.json");
function judge(x){
 const hasNull=v=>v===null||(typeof v==="object"&&v!==null&&Object.values(v).some(hasNull));
 if(hasNull(x))return "UNKNOWN";
 const all=(obj,keys)=>keys.every(k=>obj&&obj[k]===true);
 if(!all(x.source,["d03Exact","d04Exact","d10Exact","ncHashPinned","framePinned"]))return "REJECT";
 const p=x.dialect.name, haas=p==="HAAS_MILL", linux=p==="LINUXCNC_2_9";
 if((!haas&&!linux)||x.dialect.versionPinned!==true||x.dialect.tableHashPinned!==true)return "REJECT";
 if(haas&&(!Number.isInteger(x.dialect.dNumber)||x.dialect.dNumber<=0))return "REJECT";
 if(linux&&x.dialect.dNumber!=="OMITTED"&&(!Number.isInteger(x.dialect.dNumber)||x.dialect.dNumber<0))return "REJECT";
 const o=x.offset;
 if(o.interpretationPinned!==true||![o.geometry,o.wear,o.effectiveRadiusMm].every(Number.isFinite)||o.effectiveRadiusMm<=0)return "REJECT";
 let signed;
 if(haas){
  if(!["DIAMETER","RADIUS"].includes(o.measure))return "REJECT";
  signed=(o.geometry+o.wear)/(o.measure==="DIAMETER"?2:1);
 }else{
  if(o.measure!=="TABLE_DIAMETER"||o.geometry<0||o.wear!==0)return "REJECT";
  signed=o.geometry/2;
 }
 if(Math.abs(Math.abs(signed)-o.effectiveRadiusMm)>1e-9||Math.abs(signed)<1e-12)return "REJECT";
 if(!["G41","G42"].includes(x.side.mode)||x.side.signApplied!==true||!Number.isFinite(x.side.signedRadius)||Math.abs(x.side.signedRadius-signed)>1e-9)return "REJECT";
 const left=(x.side.mode==="G41") === (signed>0);
 if(x.side.actual!==(left?"LEFT":"RIGHT"))return "REJECT";
 if(x.plane.modelKnown!==true||x.plane.allowed!==true)return "REJECT";
 if(!((haas&&x.plane.selected==="G17")||(linux&&["G17","G18"].includes(x.plane.selected))))return "REJECT";
 const e=x.lead,r=o.effectiveRadiusMm;
 if(e.profileKnown!==true||![e.entryLenMm,e.exitLenMm].every(Number.isFinite)||e.entryLenMm<r||!["G00","G01"].includes(e.entryMove)||!["G00","G01"].includes(e.exitMove))return "REJECT";
 if(haas&&(e.entryMove!=="G01"||e.exitMove!=="G01"||e.exitLenMm<r))return "REJECT";
 if(linux&&e.exitLenMm<=2*r)return "REJECT";
 const c=x.corner;
 if(c.checked!==true||c.setting58Pinned!==true||c.noContinuousSafetyClaim!==true||!Number.isFinite(c.insideArcRadiusMm))return "REJECT";
 if(c.insideArcRadiusMm<r-1e-9)return "REJECT";
 if(Math.abs(c.insideArcRadiusMm-r)<=1e-9)return "UNKNOWN";
 if(!all(x.chain,["finalNcReparsed","d13UnknownBlocked","d14MotionIndependent","d15EngineeringIndependent","d16NotFromCL"]))return "REJECT";
 if(!all(x.owner,["singleOwnerPort","aclAtCommit","casAtCommit","cancelGeneration","singleBabylonLeftPanel","nonDestructiveRollback"]))return "REJECT";
 return "PASS";
}
function apply(x,changes){const t=JSON.parse(JSON.stringify(x));for(const [p,v] of changes){const seg=p.split(".");let z=t;for(const s of seg.slice(0,-1))z=z[s];z[seg.at(-1)]=v;}return t;}
const problems=[],ids=new Set(),sid=new Set(sources.sources.map(s=>s.id));
if(fixtures.syntheticOnly!==true||fixtures.productPass!==false)problems.push("PLANNING_ONLY标记失效");
if(sources.sources.length!==sources.registeredRecords||sid.size!==sources.sources.length)problems.push("来源数量/唯一性");
if(trace.rules.length!==9)problems.push("9项规则数");
for(const c of fixtures.cases){if(ids.has(c.id))problems.push("重复CASE "+c.id);ids.add(c.id);const got=judge(apply(fixtures.base,c.changes));if(got!==c.expected)problems.push(c.id+": "+got+" != "+c.expected);}
const exists=p=>p.split(".").reduce((v,k)=>v&&Object.prototype.hasOwnProperty.call(v,k)?v[k]:undefined,fixtures.base)!==undefined;
for(const r of trace.rules){if(!r.sourceIds.length||!r.sourceIds.every(id=>sid.has(id)))problems.push("来源断链 "+r.id);if(!r.fields.every(exists))problems.push("字段断链 "+r.id);for(const [kind,arr] of [["PASS",r.positiveIds],["REJECT",r.negativeIds],["UNKNOWN",r.unknownIds]]){if(!arr.length||!arr.every(id=>ids.has(id)&&fixtures.cases.find(c=>c.id===id).expected===kind))problems.push(r.id+" "+kind+"验收断链");}if(r.capabilityId!=="CAP-08-03"||!r.originalWorkPackages.every(x=>trace.originalWorkPackages.includes(x)))problems.push("CAP/原包断链 "+r.id);}
const [g1,g2,g3]=fixtures.mathGoldens;
if(Math.abs((g1.diameterGeometry+g1.diameterWear)/2-g1.effectiveRadiusMm)>1e-12||Math.abs(g1.radiusGeometry+g1.radiusWear-g1.effectiveRadiusMm)>1e-12)problems.push("Setting40 Golden");
if((g2.code==="G41"&&g2.signedRadiusMm<0?"RIGHT":"LEFT")!==g2.expectedSide)problems.push("负偏移 Golden");
if((g3.linuxExitMm>2*g3.radiusMm)!==g3.linuxAccept||(g3.haasExitMm>=g3.radiusMm)!==g3.haasAccept)problems.push("G40差异 Golden");
if(problems.length){console.error(problems.join("\n"));process.exitCode=1;}else console.log("B96_PLANNING_SYNTHETIC_PASS cases="+fixtures.cases.length+" goldens=3 OWNER_NOT_SIGNED PRODUCT_NOT_RUN");

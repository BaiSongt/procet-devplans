"use strict";
// B91 仅规划合成验收。不得作为真实OCCT、D09算法、D15或机床产品PASS。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const f=load("docs/capabilities/CAP-07-01/multiring-offset-b91-fixtures-v08.json"),t=load("research/traces/CAP-07-01-multiring-offset-b91-v08.json"),s=load("research/sources/CAP-07-01-multiring-offset-b91.json");
const judge=function judge(i){
 if(!i||!i.refs||!i.topology||!i.corridor||!i.arc||!i.protection||!i.workflow)return"REJECT";
 const {refs:r,topology:t,corridor:c,arc:a,protection:p,workflow:w}=i;
 if(w.cancelled)return"CANCELLED";
 if(!w.cas||r.scopeEpoch!==r.expectedScopeEpoch||r.frameHash!==r.expectedFrameHash||["D02","D03","D04","D07","D08"].some(k=>r.refHashes?.[k]!==r.expectedRefHashes?.[k]))return"STALE";
 if(!w.aclAllowed||w.lateAck||!w.sameDomainPort||w.babylonWorlds!==1||!w.leftTaskPanel||!w.freezePreserved)return"REJECT";
 const hashOk=x=>typeof x==="string"&&/^sha256:[a-f0-9]{64}$/.test(x);
 if(!hashOk(r.frameHash)||["D02","D03","D04","D07","D08"].some(k=>!hashOk(r.refHashes[k])||!Number.isInteger(r.revisions?.[k])||r.revisions[k]<1))return"UNKNOWN";
 if(!t.planeVerified||!t.wireClosed||t.outerOrientation!=="CCW"||!Array.isArray(t.holesOrientation)||t.holesOrientation.some(v=>v!=="CW")||t.holesNested||t.ringIntersections!==0)return"REJECT";
 if(t.offsetStatus==="UNKNOWN")return"UNKNOWN";
 if(!["OCCT-8.0.1","CGAL-6.1.1"].includes(t.kernel)||t.kernel==="CGAL-6.1.1"&&t.legalReview!=="LEGAL_APPROVED")return"UNKNOWN";
 if(t.offsetStatus!=="VALIDATED"||!t.offsetBuildDone||!t.holesMapped||!t.topologyChangeRecorded||!Number.isInteger(t.componentCount)||t.componentCount<1||t.zeroAreaFaces!==0||!["GeomAbs_Arc","GeomAbs_Intersection"].includes(t.joinType))return"REJECT";
 if(![c.widthMm,c.toolRadiusMm,c.allowanceMm,c.minMarginMm].every(Number.isFinite)||c.toolRadiusMm<=0||c.allowanceMm<0||c.minMarginMm<0)return"UNKNOWN";
 if(c.geometryClass!=="PARALLEL_STRAIGHT"||!c.analyticWidthEvidence)return"UNKNOWN";
 if(c.widthMm<=2*(c.toolRadiusMm+c.allowanceMm)+c.minMarginMm)return"REJECT";
 if(!hashOk(a.sourceArcHash)||!Number.isFinite(a.radiusMm)||a.radiusMm<=0)return"UNKNOWN";
 if(a.mode==="DISCRETIZED"){
   if(!Number.isFinite(a.maxSegmentDeg)||a.maxSegmentDeg<=0||a.maxSegmentDeg>180||!Number.isFinite(a.errorBudgetMm)||a.errorBudgetMm<=0)return"UNKNOWN";
   if(a.radiusMm*(1-Math.cos(a.maxSegmentDeg*Math.PI/360))>a.errorBudgetMm+1e-12)return"REJECT";
 }else if(a.mode==="NATIVE_BREP"){if(!a.curveVerified)return"UNKNOWN";}else return"UNKNOWN";
 if(p.islandIntersections!==0||!p.sweptDisk2DCertified||!p.linkEnvelopeCertified||p.componentsDisconnected&&!p.safeRetractForSeparated)return"REJECT";
 if(w.previewEngineeringPass||w.d15Passed||w.d16Eligible||w.materialSweepSimulated)return"REJECT";
 return"CANDIDATE_ONLY";
};
const applyPatch=(original,patch)=>{const v=JSON.parse(JSON.stringify(original));if(patch){const a=patch.path.split(".");let k=v;for(const key of a.slice(0,-1))k=k[key];k[a.at(-1)]=patch.value;}return v;};
if(f.cases.length!==26||t.rules.length!==8||s.sources.length!==7)throw Error("记录数不符");
const sid=new Set(s.sources.map(v=>v.id)),rid=new Set(t.rules.map(v=>v.id)),seen=new Set();
for(const r of t.rules){
 if(!r.sourceIds.length||r.sourceIds.some(id=>!sid.has(id))||!r.fields.length||!r.originalWorkPackages.length||!r.positiveIds.length||r.negativeIds.length<2)throw Error("追踪缺失 "+r.id);
}
for(const c of f.cases){
 if(seen.has(c.id)||!rid.has(c.ruleId))throw Error("重复/孤儿案例 "+c.id);
 seen.add(c.id);
 const got=judge(applyPatch(f.baseline,c.patch));
 if(got!==c.expected)throw Error(c.id+": "+got+" != "+c.expected);
}
for(const r of t.rules)for(const id of [...r.positiveIds,...r.negativeIds])if(!seen.has(id))throw Error("验收缺口 "+id);
for(const g of f.goldens){
 const x=g.id==="B91-G3"?g.input.radius*(1-Math.cos(g.input.segmentDeg*Math.PI/360)):g.input.w-2*(g.input.r+g.input.a);
 if(!Number.isFinite(x)||Math.abs(x-g.expected)>1e-11)throw Error("解析Golden错误 "+g.id);
}
console.log("B91规划合成 8正+18反=26/26、3解析Golden；真实独立OCCT/D12–D15/17资产消费者 NOT_RUN。");

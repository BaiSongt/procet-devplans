#!/usr/bin/env node
"use strict";
// B92规划只读检查：全为人工合成，不能代替OCCT或D15产品验收。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const fixture=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-07-02/trim-projection-b92-fixtures-v08.json"),"utf8"));
function classify(point,outer,holes){
const x=point[0],y=point[1],epsilon=1e-10;
function rect(b){if(x<b[0]-epsilon||x>b[2]+epsilon||y<b[1]-epsilon||y>b[3]+epsilon)return "OUT";if(Math.abs(x-b[0])<epsilon||Math.abs(x-b[2])<epsilon||Math.abs(y-b[1])<epsilon||Math.abs(y-b[3])<epsilon)return "ON";return "IN"}
const first=rect(outer);if(first!=="IN")return first;
for(const h of holes){const c=rect(h);if(c==="IN")return "OUT";if(c==="ON")return "ON"}return "IN";
}
function faceDistance(point,outer,holes){
const x=point[0],y=point[1],z=Math.abs(point[2]),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let d=Math.hypot(x-cl(x,outer[0],outer[2]),y-cl(y,outer[1],outer[3]));
if(d===0)for(const h of holes)if(x>h[0]&&x<h[2]&&y>h[1]&&y<h[3])d=Math.min(x-h[0],h[2]-x,y-h[1],h[3]-y);
return Math.hypot(z,d);
}
function judge(d){
const r=d.refs,p=d.projection,f=d.face,b=d.boundary,s=d.seam,o=d.owner,c=d.commit,n=d.nc;
if(!r.actualHash||!r.expectedHash||!r.actualFrameHash||!r.expectedFrameHash||r.scopeEpoch==null||r.expectedScopeEpoch==null)return "UNKNOWN";
if(r.actualHash!==r.expectedHash||r.actualFrameHash!==r.expectedFrameHash||r.scopeEpoch!==r.expectedScopeEpoch||r.frozenD08Untouched!==true)return "STALE";
if(p.done!==true||p.solutions==null)return "UNKNOWN";
if(!Number.isInteger(p.solutions)||p.solutions<0)return "REJECT";
if(p.solutions===0)return "UNKNOWN";
if(!Number.isInteger(p.solutionIndex)||p.solutionIndex<1||p.solutionIndex>p.solutions)return "REJECT";
if(!Number.isFinite(p.distanceMm)||!Number.isFinite(p.toleranceMm)||p.distanceMm<0||p.toleranceMm<=0||p.distanceMm>p.toleranceMm)return "REJECT";
if(f.topologyValid===false)return "REJECT";
if(f.topologyValid!=="YES"||f.trimChecker!=="RUN")return "UNKNOWN";
if(f.uvBoundsAsProof===true||f.supportingSurfaceOnlyAsProof===true)return "REJECT";
if(!Array.isArray(f.point)||!Array.isArray(f.projected)||f.point.length!==3||f.projected.length!==3||!f.point.every(Number.isFinite)||!f.projected.every(Number.isFinite))return "UNKNOWN";
if(f.model!=="PLANAR_RECT_HOLE")return "UNKNOWN";
if(!Array.isArray(f.outer)||!Array.isArray(f.holes))return "UNKNOWN";
if(Math.abs(f.point[0]-f.projected[0])>1e-9||Math.abs(f.point[1]-f.projected[1])>1e-9||Math.abs(f.projected[2])>1e-9)return "REJECT";
const actual=classify(f.projected,f.outer,f.holes);
if(!["IN","ON","OUT"].includes(f.trimClass))return "UNKNOWN";
if(actual!==f.trimClass||actual==="OUT")return "REJECT";
if(actual==="ON"){if(b.policy==="AUTO_ACCEPT")return "REJECT";if(b.ownerVerified!==true||b.reconciled!==true)return "UNKNOWN";}
if(s.enabled===true){
 if(s.sameExactFaceHash!==true)return "STALE";
 if(s.periodicVerified!==true||s.bothTrimQualified!==true||s.xyzVerified!==true)return "UNKNOWN";
 if(!Number.isFinite(s.periodU)||s.periodU<=0||!Number.isFinite(s.uStart)||!Number.isFinite(s.uEnd)||!Number.isFinite(s.xyzGapMm)||!Number.isFinite(s.xyzGapBudgetMm)||s.xyzGapBudgetMm<0)return "REJECT";
 if(s.rawUvDifferenceUsedAsMetric===true||s.xyzGapMm>s.xyzGapBudgetMm)return "REJECT";
 const delta=Math.abs(s.uEnd-s.uStart)%s.periodU,wrapped=Math.min(delta,s.periodU-delta);
 if(wrapped>1e-8)return "UNKNOWN";
}
if(!Number.isFinite(p.supportDistanceClaimMm)||!Number.isFinite(p.faceDistanceClaimMm))return "UNKNOWN";
if(Math.abs(p.supportDistanceClaimMm-Math.abs(f.point[2]-f.projected[2]))>1e-8||Math.abs(p.faceDistanceClaimMm-faceDistance(f.point,f.outer,f.holes))>1e-8)return "REJECT";
if(o.ownerDomain!=="07"||o.asset!=="D09"||o.samePortGuiCliAgent!==true||o.oneBabylonWorld!==true||o.leftTaskPanel!==true||o.d04D10Separate!==true)return "REJECT";
if(c.aclAllowed==="UNKNOWN")return "UNKNOWN";
if(c.aclAllowed!==true||c.cancelled===true||c.rollbackNonDestructive!==true||c.lateReceiptDiscarded!==true)return "REJECT";
if(!c.expectedHead||!c.actualHead||c.expectedHead!==c.actualHead||c.taskGeneration!==c.receiptGeneration)return "STALE";
if(n.controllerProfileResolved!==true)return "UNKNOWN";
if(n.clControllerNeutral!==true||n.clPreviewCountsAsD15===true||n.materialSweepSimulated===true||n.d09OverridesD08===true)return "REJECT";
if(n.releaseEligible===true&&(n.d13Status!=="PASS"||n.d14Status!=="PASS"||n.d15Status!=="PASS"||n.d16HumanApproved!==true))return "REJECT";
return "PASS_PLANNING_LOCAL_ONLY";
}
function patched(base,patch){const obj=JSON.parse(JSON.stringify(base));for(const [path,value] of Object.entries(patch)){const keys=path.split(".");let d=obj;for(let i=0;i<keys.length-1;i++)d=d[keys[i]];d[keys[keys.length-1]]=value;}return obj;}
if(fixture.syntheticOnly!==true)throw Error("非规划合成资料不得运行");
const seen=new Set();
for(const c of fixture.cases){
if(seen.has(c.id))throw Error("duplicate case "+c.id);seen.add(c.id);
const actual=judge(patched(fixture.baseline,c.patch));
if(actual!==c.expect)throw Error(c.id+" expected "+c.expect+" got "+actual);
}
for(const g of fixture.arithmeticGoldens){
if(g.point){
if(classify(g.point,fixture.baseline.face.outer,fixture.baseline.face.holes)!==g.class)throw Error(g.id+" class mismatch");
if(Math.abs(Math.abs(g.point[2])-g.supportDistanceMm)>1e-12||Math.abs(faceDistance(g.point,fixture.baseline.face.outer,fixture.baseline.face.holes)-g.trimDistanceMm)>1e-12)throw Error(g.id+" distance mismatch");
}else if(Math.abs((g.uEnd-g.uStart)%g.periodU-g.wrappedGap)>1e-12)throw Error(g.id+" wrapped gap mismatch");
}
console.log("B92规划合成 "+fixture.cases.length+"/"+fixture.cases.length+"，解析Golden "+fixture.arithmeticGoldens.length+"/"+fixture.arithmeticGoldens.length+"；规划PASS≠产品PASS");

// B132 圆弧标注范围与引用门禁：合成规划验收，不代表Creo/CATIA/NC/产品验收。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),get=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sources=get("research/sources/CAP-03-04-arc-span-b132.json"),trace=get("research/traces/CAP-03-04-arc-span-b132-v08.json"),fx=get("docs/capabilities/CAP-03-04/arc-span-b132-fixtures-v08.json");
function judge(a){
 const {identity:i,geometry:g,selection:s,dimension:d,projection:p,ui:u,owner:o,transaction:t}=a;
 if(!i.d01Hash||!i.occurrence||!i.frame)return "UNKNOWN";
 if(g.type!=="CIRCLE_ARC"||g.circleEvidence!=="ANALYTIC_CIRCLE")return "UNKNOWN";
 if(!Number.isFinite(g.radius)||g.radius<=0)return "REJECT";
 if(!Number.isFinite(g.sweepDeg)||g.sweepDeg<=0||g.sweepDeg>360)return "UNKNOWN";
 if(g.sweepDeg===360&&["ARC_LENGTH","ARC_ANGLE"].includes(d.kind))return "UNKNOWN";
 if(!["MAJOR","MINOR"].includes(s.span))return "UNKNOWN";
 if((g.sweepDeg>180?"MAJOR":"MINOR")!==s.span)return "REJECT";
 if(s.pickFirst!==g.endpoints[0]||s.pickSecond!==g.endpoints[1])return "REJECT";
 if(s.command!=="ARC_LENGTH"||d.kind!=="ARC_LENGTH")return "REJECT";
 if(d.unit!=="mm"||!Number.isFinite(d.nominal)||Math.abs(d.nominal-g.radius*g.sweepDeg*Math.PI/180)>1e-9)return "REJECT";
 if(!p.trueCircle||!p.planeRevision)return "UNKNOWN";
 if(!p.planeOrigin.startsWith("D01:"))return "REJECT";
 if(u.worlds!==1||u.panel!=="UnifiedTaskPanel:left"||u.entry!=="GUI|CLI|Agent"||u.ownerPort!=="PmiDimensionPort")return "REJECT";
 if(o.port!=="PmiDimensionPort"||!o.d10Separate)return "REJECT";
 if(!o.frozen||!o.sourcePmiRevision)return "UNKNOWN";
 if(t.cancelled||t.epoch!==t.ackEpoch||t.expectedRevision!==t.actualRevision)return "STALE";
 if(!t.acl||!t.frozenBaseline)return "REJECT";
 if(!t.rollback)return "UNKNOWN";
 return "PLANNING_CANDIDATE_NOT_PRODUCT_PASS";
}
assert.equal(sources.records.length,7);assert.equal(trace.rules.length,8);assert.equal(fx.tests.length,32);assert.equal(fx.mathGoldens.length,6);
const ss=new Set(sources.records.map(x=>x.id)),ts=new Set(fx.tests.map(x=>x.id));
for(const r of trace.rules){assert.equal(r.tests.length,4);for(const s of r.sourceIds)assert.ok(ss.has(s));for(const t of r.tests)assert.ok(ts.has(t));}
let positive=0,negative=0;
for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);if(t.kind==="positive")positive++;else{negative++;assert.notEqual(t.expect,"PLANNING_CANDIDATE_NOT_PRODUCT_PASS");const dif=[];for(const k in fx.baseline)for(const q in fx.baseline[k])if(JSON.stringify(fx.baseline[k][q])!==JSON.stringify(t.input[k][q]))dif.push(k+"."+q);assert.deepEqual(dif,[t.changedField],t.id);}}
assert.equal(positive,8);assert.equal(negative,24);
for(const m of fx.mathGoldens)assert.ok(Math.abs(m.radius*m.degree*Math.PI/180-m.length)<1e-9,m.name);
console.log(JSON.stringify({status:"SYNTHETIC_PLANNING_PASS",positive,negative,mathGoldens:6,realCAD:"NOT_RUN",product:"NOT_RUN"}));

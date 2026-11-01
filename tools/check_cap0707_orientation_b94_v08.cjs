#!/usr/bin/env node
"use strict";
// 规划仓本地只读校验；不连接产品、网络或用户库。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=load("research/sources/CAP-07-07-orientation-b94.json"),trace=load("research/traces/CAP-07-07-orientation-b94-v08.json"),f=load("docs/capabilities/CAP-07-07/orientation-b94-fixtures-v08.json");
const judge=(id,s)=>{
 const nil=(...v)=>v.some(x=>x==null),vec=(v,n)=>Array.isArray(v)&&v.length===n&&v.every(Number.isFinite),norm=v=>Math.hypot(...v),hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
 if(id==="B94-R1"){const a=s.source;if(nil(a?.exact,a?.hash,a?.frozen,a?.frame,a?.scopeEpoch))return "UNKNOWN";return a.exact===true&&a.hash===true&&a.frozen===true&&a.frame==="RIGHT_RIGID_MM"&&Number.isSafeInteger(a.scopeEpoch)&&a.scopeEpoch>=0?"PASS":"REJECT";}
 if(id==="B94-R2"){const a=s.axis;if(nil(a?.from,a?.to,a?.convention))return "UNKNOWN";return vec(a.from,3)&&vec(a.to,3)&&Math.abs(norm(a.from)-1)<1e-9&&Math.abs(norm(a.to)-1)<1e-9&&a.convention==="TIP_TO_HOLDER"?"PASS":"REJECT";}
 if(id==="B94-R3"){const a=s.axis;if(nil(a?.from,a?.to))return "UNKNOWN";if(!vec(a.from,3)||!vec(a.to,3))return "REJECT";if(Math.abs(norm(a.from)-1)>1e-9||Math.abs(norm(a.to)-1)>1e-9)return "REJECT";const dot=a.from.reduce((z,v,i)=>z+v*a.to[i],0);if(dot>=-1+1e-9)return "PASS";if(nil(a.reference))return "UNKNOWN";if(!vec(a.reference,3)||Math.abs(norm(a.reference)-1)>1e-9)return "REJECT";return Math.abs(a.from.reduce((z,v,i)=>z+v*a.reference[i],0))<1e-8?"PASS":"REJECT";}
 if(id==="B94-R4"){const a=s.pose;if(nil(a?.start,a?.end,a?.order,a?.hemisphere))return "UNKNOWN";if(!vec(a.start,4)||!vec(a.end,4)||Math.abs(norm(a.start)-1)>1e-9||Math.abs(norm(a.end)-1)>1e-9)return "REJECT";return a.order==="XYZW"&&a.hemisphere===true?"PASS":"REJECT";}
 if(id==="B94-R5"){const a=s.roll;if(nil(a?.symmetry))return "UNKNOWN";if(a.symmetry==="AXISYMMETRIC")return "PASS";if(a.symmetry!=="NON_AXISYMMETRIC")return "REJECT";if(nil(a.source))return "UNKNOWN";return a.source.owner==="D03"&&hash(a.source.poseHash)&&hash(a.source.frameHash)?"PASS":"REJECT";}
 if(id==="B94-R6"){const a=s.mode;if(nil(a?.strategy,a?.interpolation,a?.toleranceRad,a?.kind))return "UNKNOWN";if(!Number.isFinite(a.toleranceRad)||a.toleranceRad<=0||a.toleranceRad>0.1)return "REJECT";if(!["SPHERE_TOOL_AXIS","QUATERNION_FULL_POSE"].includes(a.interpolation))return "REJECT";if(a.strategy==="INDEXED_3_PLUS_2"&&a.kind==="CUT"&&a.fixedOnCut!==true)return "REJECT";return ["INDEXED_3_PLUS_2","CONTINUOUS_5AXIS","THREE_AXIS"].includes(a.strategy)?"PASS":"REJECT";}
 if(id==="B94-R7"){const a=s.nc;if(nil(a?.clOnly,a?.machineAxes,a?.d04D10Separate,a?.d13,a?.d15,a?.publish))return "UNKNOWN";if(a.clOnly!==true||a.machineAxes!==false||a.d04D10Separate!==true)return "REJECT";return a.publish===true&&(a.d13!=="PASS"||a.d15!=="PASS")?"REJECT":a.d15==="PASS"&&a.d13!=="PASS"?"REJECT":"PASS";}
 if(id==="B94-R8"){const a=s.owner;if(nil(a?.acl,a?.expectedHead,a?.generation,a?.receiptGeneration,a?.cancelled,a?.port,a?.singleBabylon,a?.leftPanel,a?.oldReader))return "UNKNOWN";return a.acl===true&&a.expectedHead===true&&a.generation===a.receiptGeneration&&a.cancelled===false&&a.port==="CAMDomainPort"&&a.singleBabylon===true&&a.leftPanel===true&&a.oldReader===true?"PASS":"REJECT";}
 throw Error("未知规则"+id);
};
const patch=function patch(obj,p,val){const a=p.split(".");let v=obj;for(const q of a.slice(0,-1))v=v[q];v[a.at(-1)]=val};
assert.equal(src.registeredRecords,src.sources.length);
assert.equal(trace.rules.length,8);
const sid=new Set(src.sources.map(x=>x.id)),cid=new Set(f.cases.map(x=>x.id));
assert.equal(sid.size,src.sources.length);assert.equal(cid.size,f.cases.length);
for(const r of trace.rules){
  assert.equal(r.capabilityId,"CAP-07-07");
  assert.ok(r.fields.length>0);
  for(const x of r.sourceIds)assert.ok(sid.has(x),"缺少来源："+x);
  for(const group of ["positiveIds","negativeIds","unknownIds"]){assert.ok(r[group].length>0);for(const x of r[group])assert.ok(cid.has(x),"缺少fixture："+x);}
}
for(const c of f.cases){
  const x=JSON.parse(JSON.stringify(f.base));for(const [p,v] of c.changes)patch(x,p,v);
  assert.equal(judge(c.ruleId,x),c.expected,c.id);
  const rule=trace.rules.find(r=>r.id===c.ruleId);
  assert.ok(rule);
  const group=c.expected==="PASS"?"positiveIds":c.expected==="REJECT"?"negativeIds":"unknownIds";
  assert.ok(rule[group].includes(c.id),"追踪未引用："+c.id);
}
const numbers=[Math.hypot(0,0,(1-1)/2),Math.hypot(0,0,0,(1-1)/2),22.5-Math.atan2(.25,.75)*180/Math.PI];
f.mathGoldens.forEach((g,i)=>assert.ok(Math.abs(numbers[i]-g.expected)<=g.tolerance,g.id));
const stale=JSON.parse(JSON.stringify(f.base));stale.owner.acl=false;
assert.equal(judge("B94-R8",stale),"REJECT");
console.log(JSON.stringify({status:"PLANNING_SYNTHETIC_PASS",cases:f.cases.length,analyticGoldens:numbers.length,rules:trace.rules.length,sources:src.sources.length,product:"NOT_RUN",actualConsumers:"NOT_RUN",l3:"PENDING_HUMAN"}));

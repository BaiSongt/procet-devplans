// CAP-03-05 B109 规划证据守卫：只读合成验证，绝不写产品、数据库或自动批准
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const file = path.resolve(__dirname, "../docs/capabilities/CAP-03-05/hole-material-b109-fixtures-v08.json");
const data = JSON.parse(fs.readFileSync(file,"utf8"));
function deepClone(x){return JSON.parse(JSON.stringify(x))}
function judge(t){
  const r=t.refs,g=t.geometry,w=t.flow;
  if(r.d01Revision!==r.expectedRevision||r.sourceHash!==r.expectedHash||w.scopeEpoch!==w.ackEpoch||w.cancelled||w.lateAck)return "STALE";
  if(!w.acl||!w.cas||!w.sameOwnerPort||w.sceneCount!==1||!w.leftTaskPanel||w.owner!=="D02-03"||w.autoApprove)return "REJECT";
  if(g.native!=="BREP_SOLID"||g.shapeValid===false||g.surfaceType!=="CYLINDER"||!(g.radiusMm>0)||g.materialSide==="SOLID")return "REJECT";
  if(g.axisProbe==="IN"||g.materialProbe==="OUT")return "REJECT";
  if(g.claim!=="THROUGH"&&g.claim!=="BLIND")return "UNKNOWN";
  if(!r.d01Revision||!r.sourceHash||!r.occurrence||!r.selectedSolidRef||!r.frame||!r.unit||!r.algorithmHash||g.checkProfile==="UNKNOWN"||g.shapeValid!==true||g.adjacencyComplete!==true||g.wallConnected!==true||g.solidCount!==1||g.axisProbe!=="OUT"||g.materialProbe!=="IN"||g.materialSide!=="VOID"||!(g.classifierToleranceMm>0)||g.axialEndEvidence==="UNKNOWN"||g.entranceCount==null||g.capPresent==null)return "UNKNOWN";
  if(g.claim==="THROUGH"){
    if(g.entranceCount!==2||g.capPresent!==false||g.axialEndEvidence!=="BOTH_OPEN")return "REJECT";
  }else if(g.entranceCount!==1||g.capPresent!==true||g.axialEndEvidence!=="ONE_OPEN")return "REJECT";
  return "CANDIDATE_ONLY";
}
const ids = new Set();
let ok=0;
for(const c of data.cases){
  if(ids.has(c.id))throw Error("重复Case ID "+c.id);ids.add(c.id);
  const test=deepClone(data.baseline);
  for(const [key,val] of Object.entries(c.patch)){
    const keys=key.split(".");let obj=test;
    for(const k of keys.slice(0,-1)){if(obj[k]===undefined)throw Error("无效字段 "+key);obj=obj[k]}
    if(!(keys.at(-1) in obj))throw Error("未知字段 "+key);
    obj[keys.at(-1)]=val;
  }
  const got=judge(test);
  if(got!==c.expected)throw Error(c.id+" expected="+c.expected+" got="+got);
  ok++;
}
console.log("规划合成: "+ok+"/"+data.cases.length+" PASS；独立OCCT/产品/真实消费者 NOT_RUN");

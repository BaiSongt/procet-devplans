// CAP-05-06 B110 只读规划合成门禁；不访问产品数据库，不自动批准
"use strict";
const fs=require("node:fs"),path=require("node:path");
const data=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../docs/capabilities/CAP-05-06/aba-cas-b110-fixtures-v08.json"),"utf8"));
function clone(x){return JSON.parse(JSON.stringify(x))}
function patch(x,p){for(const [q,v] of Object.entries(p)){const ks=q.split(".");let z=x;for(const k of ks.slice(0,-1)){if(!(k in z))throw Error("未知路径 "+q);z=z[k]}if(!(ks.at(-1) in z))throw Error("未知字段 "+q);z[ks.at(-1)]=v}return x}
function judge(x){
 const h=x.head,r=x.request,t=x.transaction,i=x.idempotency,w=x.workflow;
 if(i.keyStatus==="EXISTING"){if(!i.payloadHashMatches)return "REJECT";return i.receiptVerified?"RECONCILE_ONLY":"UNKNOWN"}
 if(i.keyStatus!=="NEW")return "UNKNOWN";
 if(h.revision!==r.expectedRevision||h.contentHash!==r.expectedHash||h.lineageEpoch!==r.expectedLineageEpoch||
   w.scopeEpoch!==w.ackScopeEpoch||w.taskGeneration!==w.ackGeneration||w.cancelled||w.lateAck)return "STALE";
 if(t.affectedRows===0)return "STALE";
 if(t.affectedRows!==1)return "REJECT";
 if(!w.aclAtCommit||!w.approvalAtCommit||w.freezeConflict||w.agentDirectWrite||
   !w.sameDomainPort||w.sceneCount!==1||!w.leftTaskPanel||w.previewWrites||
   !w.appendOnly||w.d04EqualsD10||w.d15PassClaim||w.d16PublishClaim)return "REJECT";
 if(!r.sourceExact||!r.frameProofExact||!r.canonicalProfileKnown||!r.schemaCompatible||
   !t.atomicConditionalWrite||t.transactionMode!=="IMMEDIATE")return "UNKNOWN";
 return "COMMIT_ELIGIBLE_ONLY";
}
const seen=new Set();for(const item of data.cases){if(seen.has(item.id))throw Error("重复case "+item.id);seen.add(item.id);const got=judge(patch(clone(data.baseline),item.patch));if(got!==item.expected)throw Error(item.id+" expected "+item.expected+" got "+got)}
console.log("B110 同判定函数规划合成 "+seen.size+"/"+data.cases.length+" PASS；正式Owner/产品/独立消费者 NOT_RUN");

#!/usr/bin/env node
// B55：只读证据收件形状校验器，规划PASS不等于产品PASS。
'use strict';const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const C=["readExact","revokedAcl","cancelLateAck","oldSchema","invalidation","rollback","ncUnknown"];
function gate(s,ledger){
 const row=ledger.slots.find(x=>x.assetId===s.assetId);
 if(!row)return "REJECT_ASSET";
 if(s.ownerPort!==row.ownerPort)return "REJECT_OWNER_PORT";
 const edge=row.consumerEdges.find(x=>x.assetId===s.consumerAsset);
 if(!edge)return "REJECT_CONSUMER_EDGE";
 if(s.consumerPort!==edge.port)return "REJECT_CONSUMER_PORT";
 if(!s.ownerTeam||!s.consumerTeam||s.ownerTeam===s.consumerTeam)return "REJECT_INDEPENDENCE";
 const x=s.exact||{};
 if(!x.id||!x.revision||!/^sha256:[a-f0-9]{64}$/.test(x.hash||"")||!x.schema||!x.scope||!x.frame)return "REJECT_EXACT";
 if(s.claim!=="NOT_PROMOTED"||s.product!=="NOT_RUN")return "REJECT_FALSE_PASS";
 const r=s.run||{};
 if(!r.consumerCode||!r.providerCode||!r.environment||!r.evidence)return "REJECT_RUN_ID";
 const e=s.event||{};
 if(e.specversion!=="1.0"||!e.id||!e.source||!e.type||e.collision===true)return "REJECT_EVENT_ID";
 if(r.cancelled===true&&r.lateAckAccepted===true)return "REJECT_LATE_ACK";
 const statuses=Object.values(r.cases||{});
 if(C.some(k=>!["PASS","UNKNOWN"].includes(r.cases?.[k])))return "REJECT_COVERAGE";
 if(C.some(k=>r.cases[k]==="UNKNOWN"))return "UNKNOWN_CASE";
 if(r.mode==="REAL"&&r.isSynthetic===true)return "REJECT_FAKE_REAL";
 if(r.mode==="REAL")return "UNKNOWN_EXTERNAL_PROOF";
 if(r.mode!=="SYNTHETIC"||r.isSynthetic!==true)return "UNKNOWN_PROVENANCE";
 return "PASS_SYNTHETIC_SHAPE_ONLY";
}
function change(obj,p,v){const x=JSON.parse(JSON.stringify(obj)),q=p.split("."),k=q.pop();let t=x;for(const z of q)t=t[z];t[k]=v;return x;}
function main(){
 const b=load('docs/architecture/v0.8/business-assets.json'),o=load('docs/architecture/v0.8/owner-interface-review-v08.json'),l=load('docs/architecture/v0.8/consumer-proof-b55-schema-v08.json');
 if(b.assets.length!==17||o.contracts.length!==17||l.slots.length!==17||b.assets.reduce((n,x)=>n+x.outputs.length,0)!==44)throw Error('17/44基线失败');
 const ports=new Map(o.contracts.map(x=>[x.assetId,x]));
 for(const row of l.slots){const c=ports.get(row.assetId);if(!c||c.producerPort!==row.ownerPort||row.ownerSignoff!=='PENDING_HUMAN'||row.consumerSignoff!=='PENDING_INDEPENDENT_CONSUMER'||!['gui','cli','agent'].every(k=>row[k]===c.producerPort+'.readExact')||row.consumerEdges.some(x=>ports.get(x.assetId)?.producerPort!==x.port))throw Error('Owner结构/签署候选失配 '+row.assetId);}
 if(process.argv.includes('--self-test')){
  const f=load('docs/architecture/v0.8/consumer-proof-b55-fixtures-v08.json'),s=l.syntheticExample;
  if(gate(s,l)!==f.positive.expected)throw Error('P01');
  for(const m of f.negatives)if(gate(change(s,m.path,m.value),l)!==m.expected)throw Error(m.id);
  for(const u of f.unknowns){let q=s;for(const [k,v]of u.patches)q=change(q,k,v);if(gate(q,l)!==u.expected)throw Error(u.id);}
  console.log(JSON.stringify({grade:'PASS_SYNTHETIC_SHAPE_ONLY',positive:1,negative:f.negatives.length,unknown:f.unknowns.length,owner:'0/17',realConsumer:'0/17',product:'NOT_RUN'}));
 }else console.log(JSON.stringify({grade:'PLANNING_CANDIDATE_ONLY',assets:17,edges:44,owner:'0/17',realConsumer:'0/17',product:'NOT_RUN'}));
}try{main()}catch(e){console.error(e.stack||e);process.exitCode=1;}

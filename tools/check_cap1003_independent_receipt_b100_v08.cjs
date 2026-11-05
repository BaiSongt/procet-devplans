'use strict';
// B100只读规划合成验收；不能作为真实签名、CNC或D17消费者认证。
const fs=require('fs'),path=require('path');
function setPath(obj,path,value){const keys=path.split(".");let t=obj;for(let i=0;i<keys.length-1;i++)t=t[keys[i]];t[keys.at(-1)]=value}
function judge(x){
const literal=[
["release.approval","HUMAN_APPROVED_SYNTHETIC"],["release.d15","PASS_INDEPENDENT_SYNTHETIC"],
["receiver.localBytesRead",true],["receiver.signatureVerified",true],["receiver.trustRootPreinstalled",true],
["receiver.revocationState","CURRENT"],["receiver.trustedTime",true],["receipt.kind","D17_RECEIVER_RECEIPT"],
["receipt.signedByReceiver",true],["receipt.appendOnly",true],["receipt.canceled",false],
["receipt.intent","RECEIPT_ONLY"],["ui.sharedPort",true],["ui.singleBabylon",true],
["ui.leftTaskPanel",true],["ui.casRechecked",true],["ui.rollbackReader",true]
];
const matching=[
["release.ncSha","receiver.rehashSha"],["release.manifestSha","receiver.manifestSha"],
["release.machineId","receiver.machineId"],["release.d10Revision","receiver.d10Revision"],
["release.frameId","receiver.frameId"],["release.policyId","receiver.policyId"],
["release.aclEpoch","receiver.aclEpoch"],["receiver.scopeEpoch","receipt.scopeEpoch"],
["receipt.ackEpoch","receipt.activeEpoch"],["receipt.releaseId","release.id"],
["receipt.payloadSha","receiver.rehashSha"]
];
const value=(p)=>p.split(".").reduce((o,k)=>o==null?null:o[k],x);
let missing=false;
for(const [p,v] of literal){const got=value(p);if(got===null||got===undefined){missing=true;continue}if(got!==v)return "REJECT"}
for(const [a,b] of matching){const aa=value(a),bb=value(b);if(aa===null||aa===undefined||bb===null||bb===undefined){missing=true;continue}if(aa!==bb)return "REJECT"}
for(const [a,b] of [["receiver.appSha","release.publisherAppSha"],["receiver.runId","release.publisherRunId"]]){const aa=value(a),bb=value(b);if(aa==null||bb==null){missing=true;continue}if(aa===bb)return "REJECT"}
if(value("receipt.eventId")==null){missing=true}
const hist=value("receipt.history");
if(hist!==null&&hist!==undefined){
if(typeof hist!=="object"||hist.eventId==null||hist.payloadSha==null||hist.releaseId==null)missing=true;
else if(hist.eventId===value("receipt.eventId")){
if(hist.payloadSha!==value("receipt.payloadSha")||hist.releaseId!==value("receipt.releaseId"))return "REJECT";
if(missing)return "UNKNOWN";
return "IDEMPOTENT_NO_WRITE";
}
}
return missing?"UNKNOWN":"DESIGN_OK";
}
function run(root){
const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-10-03/independent-receipt-b100-fixtures-v08.json'),'utf8'));
const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-10-03-independent-receipt-b100-v08.json'),'utf8'));
const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-10-03-independent-receipt-b100.json'),'utf8'));
const byId=new Map(f.cases.map(c=>[c.id,c]));const bySource=new Set(s.sources.map(x=>x.id));
if(s.sources.length!==s.registeredRecords||bySource.size!==s.sources.length)throw Error('来源计数或ID重复');
const statuses={};for(const c of f.cases){const o=JSON.parse(JSON.stringify(f.baseline));for(const [k,v]of Object.entries(c.changes))setPath(o,k,v);const actual=judge(o);if(actual!==c.expected)throw Error(c.id+':'+actual+' != '+c.expected);statuses[actual]=(statuses[actual]||0)+1;}
for(const r of t.rules){if(!r.sourceIds.length||!r.fields.length||!r.negative.length||!r.positive.length)throw Error('追踪空字段 '+r.id);for(const id of r.sourceIds)if(!bySource.has(id))throw Error('未登记来源 '+id);for(const id of [...r.positive,...r.negative,...r.unknown,...r.idempotent])if(!byId.has(id))throw Error('无验收案例 '+id);if(!r.originalWorkPackages.includes('E3-06')||!r.caps.includes('CAP-10-03'))throw Error('原包/能力缺失');}
console.log(JSON.stringify({status:'SYNTHETIC_ONLY',cases:f.cases.length,outcomes:statuses,rules:t.rules.length,sources:s.sources.length,product:'NOT_RUN'}));return true;
}
if(require.main===module)run(path.resolve(__dirname,'..'));
module.exports={judge,run};

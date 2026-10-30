'use strict';
// 离线CRL/TSA规划合成，只读，不构成真实签名、机床许可或D15认证。
const fs=require('node:fs'),path=require('node:path');
function judge(x){
 const hash=s=>typeof s==="string"&&/^[a-f0-9]{64}$/.test(s);
 const iso=s=>typeof s==="string"&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(s)&&Number.isFinite(Date.parse(s));
 if(!hash(x["nc.rawHash"])||x["nc.rawHash"]!==x["nc.d15RawHash"]||!hash(x["nc.manifestHash"])||x["nc.manifestHash"]!==x["nc.approvedManifestHash"]||x["nc.closure"]!==true)return "REJECT";
 if(x["binding.d04"]!=="D04-r8"||x["binding.d10"]!=="D10-r12"||x["binding.from"]!=="MACHINE_BASE"||x["binding.to"]!=="WORKPIECE"||x["binding.d15Independent"]!==true||x["binding.coverage"]!=="FULL_NC"||x["binding.d13Known"]!==true)return "UNKNOWN";
 if(x["approval.requester"]!=="engineer-A"||x["approval.reviewer"]!=="reviewer-B"||x["approval.human"]!==true||x["approval.noAgent"]!==true)return "REJECT";
 if(x["crl.revoked"]===true)return "REJECT";
 if(x["crl.issuer"]!==x["offline.root"]||x["crl.syntheticSignatureChecked"]!==true||x["crl.coverage"]!=="ALL_SYNTHETIC"||x["crl.revoked"]!==false||![x["crl.thisUpdate"],x["crl.nextUpdate"],x["crl.validationTime"]].every(iso)||Date.parse(x["crl.validationTime"])<Date.parse(x["crl.thisUpdate"])||Date.parse(x["crl.validationTime"])>=Date.parse(x["crl.nextUpdate"]))return "UNKNOWN";
 if(x["tsa.imprintMatches"]!==true)return "REJECT";
 if(x["tsa.syntheticTrustChecked"]!==true||x["tsa.policy"]!=="TSA-SYNTHETIC-B38"||!iso(x["tsa.time"])||Date.parse(x["tsa.time"])>Date.parse(x["crl.validationTime"]))return "UNKNOWN";
 if(x["offline.root"]!=="CA-TEST"||x["offline.clockTrusted"]!==true||x["offline.snapshotPinned"]!==true||x["offline.noCycleStartInference"]!==true)return "UNKNOWN";
 if(x["owner.expectedRevision"]!=="D16-r7"||x["owner.actualRevision"]!==x["owner.expectedRevision"]||!hash(x["owner.expectedHash"])||x["owner.expectedHash"]!==x["owner.actualHash"]||x["owner.aclEpoch"]!==x["owner.aclNow"]||x["owner.scopeEpoch"]!==x["owner.scopeNow"]||x["owner.cancelEpoch"]!==x["owner.ackEpoch"]||x["owner.cancelled"]!==false||x["owner.lateAck"]!==false)return "STALE";
 if(x["ui.channels"]!=="GUI|CLI|Agent"||x["ui.port"]!=="10.ApproveReleasePort"||x["ui.worlds"]!==1||x["ui.leftPanel"]!==true||!Number.isInteger(x["ui.fontMaxPx"])||x["ui.fontMaxPx"]<1||x["ui.fontMaxPx"]>12||x["ui.previewWrites"]!==false||x["handoff.freezeBefore"]!==x["handoff.freezeAfter"]||x["handoff.oldReader"]!=="SHADOW_READ_ONLY"||x["handoff.consumer"]!=="NOT_RUN")return "REJECT";
 return "REVIEW_ELIGIBLE_SYNTHETIC_ONLY";
}
function run(root=path.join(__dirname,'..')){
 const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const fixture=get('docs/capabilities/CAP-10-02/offline-revocation-b38-fixtures-v08.json'),trace=get('research/traces/CAP-10-02-offline-revocation-b38-v08.json'),registry=get('research/sources/CAP-10-02-offline-revocation-b38.json');
 const cases=new Map(fixture.cases.map(c=>[c.id,c])),sources=new Set(registry.sources.map(s=>s.id));
 if(cases.size!==fixture.cases.length||sources.size!==registry.sources.length)throw Error('重复证据ID');
 for(const r of trace.rules){if(!r.sourceIds.every(id=>sources.has(id)))throw Error('缺少来源: '+r.id);
  if(!r.positiveIds.length||!r.negativeIds.length)throw Error('缺少正反: '+r.id);
  if(![...r.positiveIds,...r.negativeIds,...r.unknownIds].every(id=>cases.has(id)))throw Error('缺少用例: '+r.id);
  if(!r.fields.every(f=>Object.hasOwn(fixture.baseline,f)))throw Error('缺少字段: '+r.id);
 }
 const counts={positive:0,negative:0,unknown:0};
 for(const c of fixture.cases){const actual=judge({...fixture.baseline,...c.patch});if(actual!==c.expected)throw Error(c.id+': '+actual+' != '+c.expected);counts[c.kind]++;}
 for(const k of Object.keys(counts))if(counts[k]!==fixture[k+'Count'])throw Error('错误统计 '+k);
 return {planning:'PASS',count:fixture.cases.length,counts,crypto:'NOT_RUN',product:'NOT_RUN'};
}
if(require.main===module){try{console.log(JSON.stringify(run()));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={judge,run};

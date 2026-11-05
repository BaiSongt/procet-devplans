'use strict';
/* B178：仅规划合成数据只读门禁，不是USB/杀毒/NC安全验证 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const t=read('research/traces/CAP-10-03-usb-quarantine-b178-v08.json'),s=read(t.sourceRegistry),f=read(t.fixtures);
const get=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
function valid(p,v,x){
 switch(p){
 case 'identity.d16Revision':return /^D16:r[0-9]+$/.test(v);
 case 'identity.ncSha':return /^sha256:[a-f0-9]{64}$/.test(v);
 case 'identity.d04Separate':return v===true;
 case 'identity.d10Binding':return /^D10:machine-rev[0-9]+$/.test(v);
 case 'media.ownerRef':return /^user:[a-z0-9-]+$/.test(v);
 case 'media.approvedId':return /^VID:[0-9A-F]{4};PID:[0-9A-F]{4};SER:[0-9A-Z]+$/.test(v);
 case 'media.deviceClass':return v==='MASS_STORAGE_ONLY';
 case 'media.allowlistVersion':return /^policy:v[0-9]+$/.test(v);
 case 'endpoint.station':return /^station:[a-z-]+$/.test(v);
 case 'endpoint.usbPolicy':return v==='DENY_HID_AND_COMPOSITE';
 case 'endpoint.autoRunDisabled':case 'endpoint.quarantineMounted':return v===true;
 case 'scan.engineVersion':return /^engine:[0-9]+\.[0-9]+$/.test(v);
 case 'scan.definitionsRevision':return /^defs:[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(v);
 case 'scan.scannedPayloadSha':return v===x.identity.ncSha;
 case 'scan.result':return v==='CLEAN';
 case 'integrity.manifestSignature':return v==='VALID_TRUSTED_ROOT';
 case 'integrity.rawNcShaEqual':case 'integrity.manifestCanonicalized':return v===true;
 case 'integrity.revocationState':return v==='FRESH_OFFLINE_SNAPSHOT';
 case 'execution.d13':return v==='SUPPORTED_FINAL_NC';
 case 'execution.d14':return v==='AXIS_TIMELINE_BOUND';
 case 'execution.d15':return v==='INDEPENDENT_PASS';
 case 'execution.authority':return v==='HUMAN_RELEASED';
 case 'transaction.ownerPort':return v==='D16OfflineDeliveryPort';
 case 'transaction.aclRechecked':return v===true;
 case 'transaction.casExpected':return v===x.identity.d16Revision;
 case 'transaction.cancelFence':return v==='OPEN';
 case 'receipt.consumer':return v==='D17:independent-receiver';
 case 'receipt.encounterEpoch':return v==='epoch:17'; // 合成固定代次，产品须用真实当前设备/工位Epoch
 case 'receipt.state':return v==='QUARANTINE_PASSED';
 case 'receipt.historyAppendOnly':return v===true;
 default:throw new Error('未知字段：'+p);
 }
}
function gate(x){
 if(x.receipt==='LATE')return'IGNORE_STALE_ACK';
 if(x.device!=='APPROVED_STORAGE_ONLY'||x.host!=='ISOLATED')return'BLOCKED_SECURITY_DEVICE';
 if(x.signature!=='TRUSTED'||x.root==='REVOKED')return'BLOCKED_SECURITY_TRUST';
 if(x.root!=='FRESH'||x.scan!=='CLEAN_FRESH')return'BLOCKED_UNKNOWN';
 if(x.rawNc!=='EXACT')return'BLOCKED_INTEGRITY';
 if(x.d15!=='PASS_FINAL_NC')return'BLOCKED_ENGINEERING';
 return'ELIGIBLE_FOR_HUMAN_HANDOFF_NOT_MACHINE_PASS';
}
assert.equal(s.records.length,6);assert.equal(t.rules.length,8);assert.equal(f.cases.length,40);assert.equal(f.goldens.length,8);
const ids=new Set(s.records.map(z=>z.id));assert.equal(ids.size,6);
const allFields=t.rules.flatMap(r=>r.fields);assert.equal(new Set(allFields).size,32);
let passed=0;const seen=new Set();
for(const r of t.rules){assert.equal(r.fields.length,4);assert.equal(r.testIds.length,5);assert.deepEqual(r.originalWorkPackages,['E3-06','T5-03']);for(const id of r.sourceIds)assert.ok(ids.has(id));}
for(const c of f.cases){
 assert.ok(!seen.has(c.id));seen.add(c.id);
 const rule=t.rules.find(r=>r.id===c.ruleId);assert.ok(rule&&rule.testIds.includes(c.id));
 const x=JSON.parse(JSON.stringify(f.baseline));
 if(c.changedField){
  assert.equal(c.kind,'single_field_negative');assert.ok(rule.fields.includes(c.changedField));
  const [g,k]=c.changedField.split('.');assert.notDeepEqual(x[g][k],c.patchValue);x[g][k]=c.patchValue;
  assert.deepEqual(allFields.filter(p=>!Object.is(get(x,p),get(f.baseline,p))),[c.changedField]);
 }
 assert.equal(rule.fields.every(p=>valid(p,get(x,p),x)),c.expected,c.id);passed++;
}
for(const g of f.goldens){assert.equal(gate({...f.goldenBaseline,...g.patch}),g.expected,g.id);passed++;}
assert.equal(passed,48);console.log('B178 48/48 SYNTHETIC_ONLY; USB, owner, D17 and NC NOT_RUN');

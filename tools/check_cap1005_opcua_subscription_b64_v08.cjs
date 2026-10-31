#!/usr/bin/env node
'use strict';
// B64只读规划合成检查器：不可连接机床、不得写D17或启动付费CI。
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function read(p){return JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));}
function judge(c){
 const v=c.input||{}, MAX=4294967295;
 switch(c.ruleId){
 case "B64-R01": {const x=v.identity;if(!x)return "UNKNOWN";
 if(x.capabilityDiscovered===null)return "UNKNOWN";
 if(!x.machineExact||!x.profileRevisionExact||!x.namespaceMapExact||!x.readOnlyScope)return "REJECT";
 if(!x.sessionEpochExact||!x.scopeEpochExact)return "STALE";
 return x.capabilityDiscovered?"CANDIDATE_ONLY":"UNKNOWN";}
 case "B64-R02": {const x=v.message;if(!x||x.kind===null||x.sequence===null)return "UNKNOWN";
 if(x.kind!=="KEEPALIVE"||!Number.isInteger(x.sequence)||x.sequence<1||x.sequence>MAX)return "REJECT";
 if(x.notificationCount!==0||x.ackSent||x.d17AppendAttempted)return "REJECT";
 if(!Number.isInteger(x.expectedNext)||x.expectedNext<1||x.expectedNext>MAX)return "UNKNOWN";
 return x.sequence===x.expectedNext?"CONTROL_ONLY":"GAP";}
 case "B64-R03": {const x=v.notification;if(!x||x.previousSequence===null||x.sequence===null)return "UNKNOWN";
 if(x.kind!=="NOTIFICATION"||!Number.isInteger(x.previousSequence)||x.previousSequence<1||x.previousSequence>MAX||!Number.isInteger(x.sequence)||x.sequence<1||x.sequence>MAX||!Number.isInteger(x.count)||x.count<1||!x.payloadHashPinned)return "REJECT";
 const next=x.previousSequence===MAX?1:x.previousSequence+1;
 if(x.sequence===x.previousSequence)return "STALE";
 return x.sequence===next?"CANDIDATE_ONLY":"GAP";}
 case "B64-R04": {const x=v.ack;if(!x||x.queueSupport===null)return "UNKNOWN";
 if(!x.notificationIdentityPinned||!x.d17Committed||!x.rawDigestPinned||!x.dedupKeyPinned||!x.ackAfterCommit)return "REJECT";
 if(x.ackSent&&!x.queueSupport)return "REJECT";
 return x.ackSent?"CANDIDATE_ONLY":"CONTROL_ONLY";}
 case "B64-R05": {const x=v.recovery;if(!x||x.republishResult===null)return "UNKNOWN";
 if(!x.gapDetected)return "REJECT";
 if(x.republishResult==="NOT_ATTEMPTED")return "UNKNOWN";
 if(x.republishResult==="BAD_MESSAGE_NOT_AVAILABLE")return "GAP";
 if(x.republishResult!=="RECOVERED")return "UNKNOWN";
 if(!x.nextExpectedPinned)return "STALE";
 if(!x.recoveredDigestPinned||!x.noOlderOverwrite||!x.currentSnapshotNotHistory)return "REJECT";
 return "CANDIDATE_ONLY";}
 case "B64-R06": {const x=v.queue;if(!x||!Array.isArray(x.availableSequenceNumbers))return "UNKNOWN";
 if(x.losslessClaim)return "REJECT";
 if(x.availableSequenceNumbers.length===0){
   if(x.ackSent)return "REJECT";
   return x.fallbackRecorded?"CONTROL_ONLY":"UNKNOWN";
 }
 if(x.ackSent&&!x.d17Committed)return "REJECT";
 return "CANDIDATE_ONLY";}
 case "B64-R07": {const x=v.transfer;if(!x||x.result===null)return "UNKNOWN";
 if(x.result==="FAILED")return "GAP";
 if(x.result!=="SUCCESS")return "UNKNOWN";
 if(!x.userAuthorized||!x.serverConfirmed||!x.aclCASRechecked)return "REJECT";
 if(!x.newSessionEpochPinned||x.oldEpochWriteAccepted)return "STALE";
 return "CANDIDATE_ONLY";}
 case "B64-R08": {const x=v.boundary;if(!x||x.protocolKnown===null)return "UNKNOWN";
 if(!x.sameDomainPort||!x.singleBabylonWorld||!x.leftUnifiedTaskPanel||!x.noCycleStart||!x.noD15PassClaim||!x.noConsumerPassClaim||!x.rollbackPreserved||!x.aclRechecked)return "REJECT";
 if(!x.ownerRevisionExact||!x.ownerHashExact||!x.ownerFrameExact||!x.scopeEpochExact||!x.cancelFenceCurrent)return "STALE";
 return x.protocolKnown?"CANDIDATE_ONLY":"UNKNOWN";}
 default:return "UNKNOWN";
 }
}
function get(obj,p){return p.split('.').reduce((v,k)=>v==null?undefined:v[k],obj);}
function fail(m){throw Error(m);}
function run(){
 const fixture=read('docs/capabilities/CAP-10-05/opcua-subscription-b64-fixtures-v08.json'), trace=read('research/traces/CAP-10-05-opcua-subscription-b64-v08.json'), registry=read('research/sources/CAP-10-05-opcua-subscription-b64.json');
 const sourceIds=new Set(registry.sources.map(s=>s.id));
 if(sourceIds.size!==registry.sources.length||registry.registeredRecords!==sourceIds.size)fail('来源登记重复或计数错误');
 const caseIds=new Set(fixture.cases.map(x=>x.id));if(caseIds.size!==fixture.cases.length||fixture.caseCount!==fixture.cases.length)fail('用例ID重复/计数错误');
 const expectedLinks=new Set(); const rules=new Set(); const dist={};
 for(const r of trace.rules){if(rules.has(r.id))fail('规则重复');rules.add(r.id);
  if(r.capabilityId!=='CAP-10-05'||!r.workPackages.includes('E3-06')||!r.workPackages.includes('T5-03'))fail('CAP/原编号包链接丢失');
  if(!r.sourceIds.length||!r.sourceIds.every(id=>sourceIds.has(id)))fail('无法找到已登记来源');
  if(!r.fields.length||!r.fields.every(f=>typeof f==='string'&&f.includes('.')))fail('字段缺失');
  for(const id of [...r.positiveTestIds,...r.negativeTestIds,...r.unknownTestIds]){if(!caseIds.has(id)||expectedLinks.has(id))fail('验收映射缺失或重复 '+id);expectedLinks.add(id);}
 }
 for(const c of fixture.cases){if(!rules.has(c.ruleId))fail('案例未映射到规则 '+c.id);
  const actual=judge(c);if(actual!==c.expected)fail(c.id+' actual='+actual+' expected='+c.expected);dist[actual]=(dist[actual]||0)+1;
  if(c.scenario==='INDEPENDENT_SINGLE_FIELD_MUTATION'){const b=fixture.cases.find(q=>q.id===c.baselineCaseId);if(!b)fail('基线缺失');
   const ks=new Set([...Object.keys(b.input),...Object.keys(c.input)]);let changed=0;
   for(const k of ks){const a=b.input[k],z=c.input[k];const leafs=new Set([...Object.keys(a||{}),...Object.keys(z||{})]);for(const f of leafs)if(JSON.stringify(a?.[f])!==JSON.stringify(z?.[f])){changed++;if(k+'.'+f!==c.mutatedField)fail('非独立单字段变异 '+c.id);}}
   if(changed!==1||JSON.stringify(get(c.input,c.mutatedField))===JSON.stringify(get(b.input,c.mutatedField)))fail('无有效字段变异 '+c.id);
  }
 }
 if(expectedLinks.size!==caseIds.size)fail('并非每个案例均被Trace覆盖');
 if(JSON.stringify(Object.fromEntries(Object.entries(dist).sort()))!==JSON.stringify(Object.fromEntries(Object.entries(fixture.distribution).sort())))fail('分类计数不一致');
 console.log('B64 规划合成 PASS '+fixture.caseCount+'/'+fixture.caseCount+' '+JSON.stringify(dist));
 console.log('真实OPC/Node外部消费者/NC/机床/Owner签署均未由本工具验证；规划PASS≠产品PASS。');
}
run();

#!/usr/bin/env node
'use strict';
// B65只读规划检查器。该程序不得访问实机、产品数据库或付费CI。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
function read(p){return JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));}
function uint64(x){if(typeof x!=="string"||!/^(0|[1-9][0-9]*)$/.test(x)||x.length>20)return null;const n=BigInt(x);return n<=18446744073709551615n?n:null}
function judge(c){
 const v=c.input||{},MAX=18446744073709551615n;
 switch(c.ruleId){
 case "B65-R01":{const x=v.cursor;if(!x||x.sequence===null)return "UNKNOWN";const s=uint64(x.sequence),f=uint64(x.first),l=uint64(x.last),n=uint64(x.next);if([s,f,l,n].some(z=>z===null)||x.jsNumberUsed||!x.rawDecimalPinned)return "REJECT";if(f>l||s<f||s>l)return "GAP";if(s===MAX)return "UNKNOWN";if(n<=s)return "REJECT";return "CANDIDATE_ONLY";}
 case "B65-R02":{const x=v.identity;if(!x||x.instanceId===null||x.checkpointInstanceId===null)return "UNKNOWN";const a=uint64(x.instanceId),b=uint64(x.checkpointInstanceId);if(a===null||b===null||a<1n||a>4294967295n||b<1n||b>4294967295n||!x.machineExact||!x.agentExact)return "REJECT";if(a!==b||!x.profileExact||!x.deviceModelExact)return "STALE";return "CANDIDATE_ONLY";}
 case "B65-R03":{const x=v.window;if(!x||x.errorCode===null)return "UNKNOWN";if(x.errorCode==="OUT_OF_RANGE")return x.httpStatus===404?"GAP":"UNKNOWN";if(x.errorCode!=="NONE"||x.httpStatus!==200)return "UNKNOWN";if(x.responseKind!=="SAMPLE")return "REJECT";const f=uint64(x.from),a=uint64(x.first),b=uint64(x.last);if([f,a,b].some(z=>z===null))return "UNKNOWN";if(f===0n)return "REJECT";if(a>b||f<a||f>b)return "GAP";return "CANDIDATE_ONLY";}
 case "B65-R04":{const x=v.page;if(!x||x.lastIncluded===null)return "UNKNOWN";if(!x.lastIncluded)return "UNKNOWN";const l=uint64(x.last),n=uint64(x.next);if(l===null||n===null)return "REJECT";if(l===MAX)return "UNKNOWN";if(n!==l+1n||!x.cursorPersistedAfterCommit||!x.headerPinned||!x.filteredPathPinned)return "REJECT";return "CANDIDATE_ONLY";}
 case "B65-R05":{const x=v.filter;if(!x||!Array.isArray(x.selectedSequences))return "UNKNOWN";if(!x.globalSequence||!x.responseHeaderPinned)return "UNKNOWN";const obs=x.selectedSequences.map(uint64),f=uint64(x.headerFrom),n=uint64(x.headerNext);if(!obs.length||obs.some(z=>z===null)||f===null||n===null)return "UNKNOWN";if(obs.some((z,i)=>i>0&&z<=obs[i-1])||f>obs[0]||n<=obs[obs.length-1]||!x.noPerItemGapInference)return "REJECT";if(!x.probeModelPinned)return "STALE";return "CANDIDATE_ONLY";}
 case "B65-R06":{const x=v.heartbeat;if(!x||x.responseEmpty===null)return "UNKNOWN";if(!x.responseEmpty||!x.intervalSet||!x.heartbeatValid||x.d17AppendAttempted||x.deviceExecutionInferred)return "REJECT";return "CONTROL_ONLY";}
 case "B65-R07":{const x=v.commit;if(!x||x.ownerCasPassed===null)return "UNKNOWN";if(!x.scopeEpochRechecked||!x.cancelLateResponseRejected)return "STALE";if(!x.ownerCasPassed||!x.aclRechecked||!x.rawHashPinned||!x.cursorAdvanceAfterCommit||!x.d17AppendOnly||!x.idempotencyPinned)return "REJECT";return "CANDIDATE_ONLY";}
 case "B65-R08":{const x=v.ux;if(!x||x.sameOwnerPort===null)return "UNKNOWN";return x.sameOwnerPort&&x.singleBabylonWorld&&x.leftTaskPanel&&x.frozenABPreserved&&x.noD15Inference&&x.noCycleStart&&x.shadowReadRollback&&x.independentConsumerRequired?"CANDIDATE_ONLY":"REJECT";}
 default:return "UNKNOWN";
 }}
const source=read('research/sources/CAP-10-05-mtconnect-u64-b65.json'),trace=read('research/traces/CAP-10-05-mtconnect-u64-b65-v08.json'),fixture=read('docs/capabilities/CAP-10-05/mtconnect-u64-b65-fixtures-v08.json');
function ensure(ok,m){if(!ok)throw Error(m);}
ensure(source.registeredRecords===source.sources.length,'来源数不一致');
ensure(trace.rules.length===8&&fixture.caseCount===fixture.cases.length,'规则/用例数不一致');
const sources=new Set(source.sources.map(s=>s.id)),ids=new Set(),byId=new Map(fixture.cases.map(c=>[c.id,c]));
for(const c of fixture.cases){
 ensure(!ids.has(c.id),'重复用例 '+c.id);ids.add(c.id);ensure(c.synthetic===true,'禁止冒充实机');
 ensure(judge(c)===c.expected,'判断不符 '+c.id+': '+judge(c)+' != '+c.expected);
 if(c.scenario==='INDEPENDENT_SINGLE_FIELD_MUTATION'){
  const b=byId.get(c.baselineCaseId);ensure(b,'缺原基准 '+c.id);
  const original=JSON.parse(JSON.stringify(b.input)),keys=c.mutatedField.split('.');
  let a=original,z=c.input;
  for(let i=0;i<keys.length-1;i++){a=a[keys[i]];z=z[keys[i]];}
  a[keys[keys.length-1]]=z[keys[keys.length-1]];
  ensure(JSON.stringify(original)===JSON.stringify(c.input),'非单字段突变 '+c.id);
 }
}
for(const r of trace.rules){
 ensure(r.sourceIds.length>0&&r.sourceIds.every(id=>sources.has(id)),'未登记来源 '+r.id);
 ensure(r.fields.length>=5&&r.assets.includes('D17')&&r.workPackages.includes('E3-06')&&r.workPackages.includes('T5-03'),'规则/字段/原包不全 '+r.id);
 const testIds=[...r.positiveTestIds,...r.negativeTestIds,...r.unknownTestIds,...r.boundaryTestIds];
 ensure(r.positiveTestIds.length&&r.negativeTestIds.length&&r.unknownTestIds.length,'正反/未知测试不全');
 for(const id of testIds)ensure(byId.get(id)?.ruleId===r.id,'测试不匹配 '+id);
 for(const id of r.negativeTestIds)ensure(r.fields.some(f=>byId.get(id)?.mutatedField===f||byId.get(id)?.mutatedField?.startsWith(f+'.')),'字段缺追踪 '+id);
}
const tally={};for(const c of fixture.cases)tally[c.expected]=(tally[c.expected]||0)+1;
ensure(JSON.stringify(tally)===JSON.stringify(fixture.distribution),'计数不匹配');
console.log(JSON.stringify({status:'PASS_PLANNING_SYNTHETIC_ONLY',cases:fixture.caseCount,distribution:tally,rules:trace.rules.length,sources:source.sources.length,product:'NOT_RUN',independentConsumer:'NOT_RUN'}));

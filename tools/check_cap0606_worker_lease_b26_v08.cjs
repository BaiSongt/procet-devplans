// B26 CAP-06-06 仅合成规划事件账本的只读验证工具；不执行产品、OCCT或NC。
'use strict';
const fs=require('node:fs');const path=require('node:path');
function validate(x){
 const sha=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 const pos=v=>Number.isSafeInteger(v)&&v>0;
 const o=x?.owner||{},r=x?.refs||{},b=x?.budget||{},q=x?.downstream||{},z=x?.summary||{};
 if(x?.schemaVersion!=="procet-b26-worker-ledger-v1"||o.port!=="06.SolverCandidatePort"||
   o.taskPanel!=="UnifiedTaskPanel.left"||o.renderWorlds!==1||
   !Array.isArray(o.channels)||o.channels.join("|")!=="GUI|CLI|Agent"||
   !sha(o.expectedHead)||o.expectedHead!==o.observedHead||
   !pos(o.aclEpoch)||o.aclEpoch!==o.observedAclEpoch||
   !pos(o.scopeEpoch)||o.scopeEpoch!==o.observedScopeEpoch||
   !pos(o.taskGeneration)||o.taskGeneration!==o.observedTaskGeneration||
   !sha(r.D01?.hash)||!sha(r.D04?.hash)||!sha(r.D07?.hash)||
   !sha(r.frameHash)||r.scope!=="SYN/P/A/S1"||r.unit!=="mm"||
   r.D04?.owner!=="04"||r.D07?.owner!=="06")return "B26-R1";
 if(!pos(b.limit)||b.limit>1000000000||!pos(b.maxWorkers)||b.maxWorkers>64||
   b.unit!=="boolean_credit"||b.atomicReservation!==true||!Array.isArray(x.events))return "B26-R2";
 const tokens=new Map(), workers=new Set();let used=0, held=0, seq=0;
 for(const e of x.events){
   if(!e||e.seq!==seq+1)return "B26-R3";seq=e.seq;
   if((e.kind==="DISPATCH"||e.kind==="SETTLE")&&o.cancelled===true&&
       pos(o.cancelIssuedAfterSeq)&&e.seq>o.cancelIssuedAfterSeq)return "B26-R6";
   const t=tokens.get(e.token);
   if(e.kind==="RESERVE"){
     if(typeof e.token!=="string"||!/^t[0-9]+$/.test(e.token)||tokens.has(e.token)||
       !pos(e.credit)||used+held+e.credit>b.limit)return "B26-R3";
     tokens.set(e.token,{credit:e.credit,state:"RESERVED"});held+=e.credit;
   }else if(e.kind==="DISPATCH"){
     if(!t||t.state!=="RESERVED"||!/^w[0-9]+$/.test(e.worker||"")||
       workers.has(e.worker)||workers.size>=b.maxWorkers||e.generation!==o.taskGeneration)return "B26-R3";
     t.state="RUNNING";t.worker=e.worker;workers.add(e.worker);
   }else if(e.kind==="SETTLE"){
     if(!t||t.state!=="RUNNING"||t.worker!==e.worker||
       !pos(e.creditUsed)||e.creditUsed>t.credit||!sha(e.receiptHash)||
       e.generation!==o.taskGeneration)return "B26-R4";
     workers.delete(e.worker);held-=t.credit;used+=e.creditUsed;
     t.state="SETTLED";t.receiptHash=e.receiptHash;
   }else if(e.kind==="DUP_ACK"){
     if(!t||t.state!=="SETTLED"||t.receiptHash!==e.receiptHash||
       e.generation!==o.taskGeneration)return "B26-R4";
   }else if(e.kind==="LOSS"){
     if(!t||t.state!=="RUNNING"||t.worker!==e.worker||
       e.lossReason!=="WORKER_EXIT_UNCONFIRMED")return "B26-R5";
     workers.delete(e.worker);t.state="UNKNOWN_SETTLEMENT";
   }else if(e.kind==="LATE_ACK"){
     if(!t||t.state!=="UNKNOWN_SETTLEMENT"||
       e.disposition!=="IGNORED_NO_COMMIT"||e.generation!==o.receiptGeneration)return "B26-R6";
   }else return "B26-R3";
   if(used+held>b.limit||used<0||held<0)return "B26-R3";
 }
 if(o.cancelled===true){
   if(!pos(o.cancelIssuedAfterSeq)||!pos(o.cancelGeneration)||
     o.cancelGeneration<=o.receiptGeneration||
     o.receiptGeneration!==o.taskGeneration||o.cancelIssuedAfterSeq>seq)return "B26-R6";
 }else if(o.cancelled!==false||o.cancelGeneration!==0||
     o.cancelIssuedAfterSeq!==null||o.receiptGeneration!==o.taskGeneration||
     x.events.some(e=>e.kind==="LATE_ACK"))return "B26-R6";
 const uncertain=[...tokens.values()].filter(t=>t.state==="UNKNOWN_SETTLEMENT").reduce((s,t)=>s+t.credit,0);
 if([...tokens.values()].some(t=>t.state==="RESERVED"||t.state==="RUNNING")||
   z.used!==used||z.held!==held||z.uncertain!==uncertain||
   z.free!==b.limit-used-held||z.status!==(uncertain>0?"UNKNOWN_SETTLEMENT":"LEDGER_SETTLED")||
   z.newOwnerRevision!==null||z.persistedReceipt!==false)return "B26-R7";
 if(o.ownerCommit!==false||q.d07Consumer!=="NOT_RUN"||q.d05!=="NOT_APPROVED"||
   q.d08FrozenUnchanged!==true||q.d10ExecutionBound!==false||
   q.d13!=="UNKNOWN"||q.d15!=="NOT_RUN"||q.d16!=="BLOCKED"||
   q.clAnimationIsNcProof!==false||q.materialSweepSimulated!==false)return "B26-R8";
 return "PASS";
}
function patch(obj,path,value){const parts=path.replace(/\[(\d+)\]/g,".$1").split(".");let t=obj;for(const p of parts.slice(0,-1)){if(!(p in t))throw Error("bad patch path "+path);t=t[p];}if(!(parts.at(-1) in t))throw Error("bad patch leaf "+path);t[parts.at(-1)]=value;}
function check(root=path.resolve(__dirname,'..')){
 const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-06-06/worker-lease-b26-fixtures-v08.json'),'utf8'));
 const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-06-06-worker-lease-b26-v08.json'),'utf8'));
 const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-06-06-worker-lease-b26.json'),'utf8'));
 if(t.rules.length!==8||s.sources.length!==5||f.cases.length!==33)throw Error('数量不符');
 const si=new Set(s.sources.map(x=>x.id)),ri=new Set(t.rules.map(x=>x.id)),ci=new Set();
 for(const r of t.rules)if(!r.fields.length||!r.sourceIds.length||r.sourceIds.some(id=>!si.has(id))||!r.negativeIds.length)throw Error('追踪失联 '+r.id);
 for(const test of f.cases){
  if(ci.has(test.id)||!ri.has(test.ruleId)||!f.scenarioInputs[test.base])throw Error('用例身份失联 '+test.id);
  ci.add(test.id);const input=JSON.parse(JSON.stringify(f.scenarioInputs[test.base]));
  for(const mutation of test.changes)patch(input,mutation.path,mutation.value);
  const got=validate(input);if(got!==test.expected)throw Error(test.id+' expected '+test.expected+' got '+got);
 }
 for(const r of t.rules)if([...r.positiveIds,...r.negativeIds].some(id=>!ci.has(id)))throw Error('追踪用例丢失 '+r.id);
 console.log('CAP-06-06 B26 合成规划 '+f.cases.length+'/'+f.cases.length+' PASS（2正31反）；独立D07/真实OCCT/NC/产品NOT_RUN');return true;
}
if(require.main===module)check();module.exports={validate,check};

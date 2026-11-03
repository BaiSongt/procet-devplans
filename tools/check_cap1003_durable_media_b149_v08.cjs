#!/usr/bin/env node
// B149只读规划校验；真实U盘、Windows/Linux文件系统、数字签名、D17和NC均未运行。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=load('research/sources/CAP-10-03-durable-media-b149.json'),t=load('research/traces/CAP-10-03-durable-media-b149-v08.json'),f=load('docs/capabilities/CAP-10-03/durable-media-b149-fixtures-v08.json');
const must=(b,msg)=>{if(!b)throw Error(msg)};
const ids=new Set(s.records.map(x=>x.id));must(ids.size===5&&s.registeredRecords===5,'five sources');
must(t.rules.length===8&&f.cases.length===40&&f.goldens.length===8,'cardinality');
let pos=0,neg=0;
for(const r of t.rules){
 must(r.fields.length===4&&r.sourceIds.every(id=>ids.has(id)),'source '+r.id);
 must(r.originalWorkPackages.includes('E3-06')&&r.originalWorkPackages.includes('T5-03'),'package');
 const cs=f.cases.filter(c=>c.ruleId===r.id);must(cs.length===5,'five cases');
 for(const c of cs){const bad=r.fields.filter(k=>c.values[k]!==true);
 must((bad.length?r.failure:'PLANNING_CANDIDATE_ONLY')===c.expected,'verdict '+c.id);
 if(c.changedField){must(bad.length===1&&bad[0]===c.changedField,'single mutant '+c.id);neg++;}
 else{must(bad.length===0,'positive '+c.id);pos++;}}
}
const state=g=>g.cancelled?'REJECT_LATE_ACK':!g.writeClosed||!g.flushOk?'UNKNOWN_FLUSH':!g.renamed?'STAGED_NOT_PROMOTED':!g.reinsertRead?'IN_TRANSIT_UNVERIFIED':!g.hashMatch?'REJECT_HASH_MISMATCH':!g.trustedFinal||!g.bindingExact||!g.independentD15?'UNKNOWN_TRUST_OR_NC':'RECEIVED_VERIFIED_NOT_EXECUTED';
for(const g of f.goldens)must(state(g)===g.expected,'golden '+g.id);
must(t.formalOwnerSignoff==='0/17'&&t.realIndependentConsumers==='0/17'&&t.planningPassNotProductPass,'status');
console.log('B149规划合成: '+pos+'正 '+neg+'单字段反 '+f.goldens.length+'状态Golden；真实产品NOT_RUN');

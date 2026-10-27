#!/usr/bin/env node
// 中文：仅核对CAP-10-03规划来源、字段、独立负例及离线门禁，绝不进行真实签名、U盘或机床验证。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const source=read("research/sources/CAP-10-03.json");
const trace=read("research/traces/CAP-10-03.json");
const f=read("docs/capabilities/CAP-10-03/fixtures.json");
const contract=read("docs/capabilities/CAP-10-03/offline-transfer-contract.json");
const receipt=read("docs/capabilities/CAP-10-03/receipt.example.json");
const at=(v,p)=>p.split(".").reduce((x,k)=>x?.[k],v);
const ruleResult=(r,v)=>r.criteria.every(c=>c.op==="eq"&&at(v,c.path)===c.value)?"PASS":"REJECT";
function gate(x){
 if(!x.acl||!x.cas||!x.scopeEpoch||x.cancelled||x.lateAck||x.receiptReplay)return"REJECT_TRANSACTION";
 if(!x.mediaOwner||!x.receiverAuthenticated||x.requestedAutoMachineImport)return"REJECT_POLICY";
 if(!x.copyCompleted)return"AWAIT_MEDIA_COPY";
 if(!x.pathsSafe||!x.fileHashesMatch||!x.manifestDigestExact||!x.subprogramClosure)return"REJECT_CONTENT";
 if(!x.signatureValid)return"REJECT_SIGNATURE";
 if(!x.rootVersionMonotonic)return"REJECT_TRUST";
 if(!x.trustedRoot||!x.revocationFresh||!x.clockTrusted||!x.exactMachine||!x.exactController||!x.exactD10||!x.finalNcD15Independent||x.clOnly||x.unknown)return"BLOCKED_UNKNOWN";
 return"READY_FOR_MANUAL_MACHINE_REVIEW_SYNTHETIC_ONLY";
}
assert.equal(source.registeredRecords,9);assert.equal(source.sources.length,9);
assert.equal(new Set(source.sources.map(x=>x.id)).size,9);
assert.equal(trace.rules.length,10);assert.equal(f.cases.length,50);assert.equal(f.offlineGateCases.length,25);
assert(contract.unknownFailClosed&&contract.neverImplicitMachineImport);
assert(receipt.syntheticOnly&&receipt.doNotDeploy&&!receipt.machineImportAuthorized);
const ids=new Set(source.sources.map(x=>x.id));
for(const s of source.sources){for(const k of ["authors","edition","published","url","accessedOn","accessDepth","locator","limits"])assert(s[k],"source "+s.id+" missing "+k);}
let count=0;
for(const r of trace.rules){
 assert.equal(r.fields.length,4);assert.equal(r.criteria.length,4);
 assert(r.sourceIds.length>=2&&r.sourceIds.every(id=>ids.has(id)));
 assert.deepEqual(r.workPackages,["E3-06","T5-03"]);
 const local=f.cases.filter(c=>c.ruleId===r.id);
 assert.equal(local.length,5);
 assert.equal(local.filter(c=>c.expected==="PASS").length,1);
 assert.equal(local.filter(c=>c.expected==="REJECT").length,4);
 assert.deepEqual(new Set(local.filter(c=>c.expected==="REJECT").map(c=>c.mutatedField)),new Set(r.fields));
 for(const c of local){assert.equal(ruleResult(r,c.input),c.expected,c.id);count++;}
}
for(const c of f.offlineGateCases){assert.equal(gate(c.input),c.expected,c.id);count++;}
assert.equal(count,75);
console.log("CAP-10-03 规划合成 "+count+"/75 PASS；真实U盘/签名/独立NC消费者/机床 NOT_RUN");

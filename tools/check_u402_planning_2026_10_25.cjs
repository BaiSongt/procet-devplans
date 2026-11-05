// 中文说明：纯规划合成判定器，不能冒充真实产品通过。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const fixture=JSON.parse(fs.readFileSync(path.join(root,"docs/work-packages/U4-02/fixtures.json"),"utf8"));
const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/U4-02.json"),"utf8"));
const source=JSON.parse(fs.readFileSync(path.join(root,"research/sources/U4-02.json"),"utf8"));
const predicates=[
x=>["Ribbon","Rail","TaskPanel"].includes(x.entry?.surface)&&x.entry.commandId===x.entry.resolvedCommandId&&x.entry.ownerPort==="D04",
x=>x.contribution?.registered===true&&x.contribution.backendReady===true&&x.contribution.portCapabilities?.includes(x.contribution.requiredCapability)===true,
x=>["projectId","documentId","documentRevision","documentHash","setupId","setupRevision","setupHash","frameHash"].every(k=>typeof x.session?.[k]==="string"&&x.session[k].length>0),
x=>x.edit?.dirty===true&&(["SAVE_DRAFT","CANCEL_NAVIGATION"].includes(x.edit.resolution)||(x.edit.resolution==="DISCARD_CONFIRMED"&&x.edit.userConfirmed===true))&&(x.edit.resolution!=="DISCARD_CONFIRMED"||x.edit.preservedDraft===false),
x=>x.edit?.action==="SAVE_DRAFT"&&x.edit.approvalCreated===false&&x.edit.draftRevisionCreated===true,
x=>x.approval?.action==="APPROVE"&&x.approval.humanApproval===true&&x.approval.ownerAuthorized===true&&Boolean(x.approval.d08SourceHash),
x=>x.commit?.expectedHead===x.commit.currentHead&&x.commit.aclEpoch===x.commit.currentAclEpoch&&x.commit.generation===x.commit.currentGeneration&&x.commit.cancelled===false,
x=>x.expected?.scopeEpoch===x.receipt?.scopeEpoch&&x.expected?.generation===x.receipt?.generation&&x.expected?.documentHash===x.receipt?.documentHash&&x.receipt.cancelled===false,
x=>Boolean(x.retry?.key)&&x.retry.payloadHash===x.retry.priorPayloadHash&&x.retry.receiptId===x.retry.priorReceiptId,
x=>x.integration?.sceneCount===1&&x.integration.controllerCount===1&&x.integration.writeOwnerPortCount===1&&x.integration.oldReaderCompatible===true&&["EXPAND","MIGRATE","CONTRACT"].includes(x.integration.migrationStage)
];
const sources=new Set(source.sources.map(x=>x.id));const seen=new Set();let pass=0;
if(trace.rules.length!==10||fixture.cases.length!==20||fixture.mutations.length!==10)throw Error("用例数量有缺口");
for(let i=0;i<10;i++){const r=trace.rules[i];if(r.sourceIds.some(x=>!sources.has(x))||r.fields.length<1||r.assets.length<1)throw Error("来源映射缺失");for(const t of [fixture.cases[i*2],fixture.cases[i*2+1],fixture.mutations[i]]){if(seen.has(t.id)||t.ruleId!==r.id)throw Error("ID重复/错配");seen.add(t.id);const actual=predicates[i](t.input)?"PASS":"REJECT";if(actual!==t.expected)throw Error(t.id+" 应为"+t.expected+" 得到"+actual);pass++;}}
console.log("U4-02 规划合成 "+pass+"/30 PASS；真实产品/Owner/消费者仍NOT_RUN");

#!/usr/bin/env node
"use strict";
// 中文只读规划校验；真实MCP及产品测试另行运行。
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const f=read("docs/capabilities/CAP-11-04/tool-hint-b104-fixtures-v08.json"),trace=read("research/traces/CAP-11-04-tool-hint-b104-v08.json"),src=read("research/sources/CAP-11-04-tool-hint-b104.json");
const judge=function judge(x){
if(!x.tool.name||!x.tool.schema||!x.intent.name||!x.intent.schema)return "UNKNOWN";
if(x.tool.name!==x.intent.name||x.tool.schema!==x.intent.schema)return "STALE";
if(!x.tool.ownerEffect||!x.intent.effect)return "UNKNOWN";
if(x.tool.ownerEffect!==x.intent.effect)return "REJECT";
if(x.auth.kind==="HTTP"){if(!x.auth.expectedAudience||!x.auth.audience)return "UNKNOWN";if(!x.auth.validated||x.auth.audience!==x.auth.expectedAudience||x.auth.passthrough)return "REJECT";}
else if(x.auth.kind==="STDIO"){if(!x.auth.localIdentity)return "UNKNOWN";}else return "UNKNOWN";
if(!x.owner.principal||!x.owner.project||!x.owner.revision||!x.owner.hash||!x.owner.frame)return "UNKNOWN";
if(!x.owner.acl)return "REJECT";
if(x.owner.scopeEpoch!==x.owner.currentScopeEpoch||x.owner.revision!==x.owner.currentRevision||x.owner.hash!==x.owner.currentHash||x.owner.frame!==x.owner.currentFrame)return "STALE";
if(!x.result.dataOnly)return "REJECT";
if(!x.result.receiptValid)return "UNKNOWN";
if(x.result.generation!==x.result.currentGeneration)return "STALE";
if(x.intent.effect==="WRITE"){if(!x.approval.human)return "REJECT";if(x.approval.digest!==x.intent.digest)return "STALE";}
if(x.intent.replayDigest!==x.intent.digest)return "REJECT";
if(x.commit.cancelled)return x.commit.committedBeforeCancel&&x.commit.realReceipt?"RECONCILE":"CANCELLED";
if(x.commit.cancelEpoch!==x.commit.currentCancelEpoch)return "CANCELLED";
if(!x.owner.cas)return "REJECT";
if(!x.ux.commonPort||x.ux.babylonWorlds!==1||!x.ux.leftPanel||!x.nc.d04D10Separated||x.nc.clAnimationGrantsD15||!x.migration.legacyReadOnly||!x.migration.rollbackRef||!x.migration.frozenD08Untouched)return "REJECT";
if(x.intent.release&&(!x.nc.d13Known||!x.nc.d15Real))return "UNKNOWN";
return "PASS";
};
const sourceIds=new Set(src.sources.map(s=>s.id)),caseIds=new Set();
if(src.registeredRecords!==src.sources.length||trace.rules.length!==8)throw Error("来源分母/规则数不一致");
for(const r of trace.rules)if(!r.sourceIds.every(x=>sourceIds.has(x))||!r.fields.length||!r.positiveIds.length||!r.negativeIds.length)throw Error("规则断链 "+r.id);
for(const c of f.cases){if(caseIds.has(c.id))throw Error("重复案例 "+c.id);caseIds.add(c.id);if(!trace.rules.some(r=>r.id===c.ruleId)||judge(c.input)!==c.expected)throw Error("案例不符 "+c.id);}
for(const r of trace.rules)for(const id of [...r.positiveIds,...r.negativeIds])if(!caseIds.has(id))throw Error("引用无对应案例 "+id);
if(f.syntheticOnly!==true)throw Error("合成不得冒充真实");
console.log("B104同judge设计合成 "+f.cases.length+"/"+f.cases.length+" PASS；真实Owner/NC/独立消费者 NOT_RUN");

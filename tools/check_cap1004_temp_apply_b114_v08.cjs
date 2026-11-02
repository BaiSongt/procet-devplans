"use strict";
// 中文注释：本工具只读规划合成用例，不能代替独立业务Owner、真实OPC UA或机床验收。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const load=p=>JSON.parse(fs.readFileSync(path.join(__dirname,"..",p),"utf8"));
const registry=load("research/sources/CAP-10-04-temp-apply-b114.json"),tr=load("research/traces/CAP-10-04-temp-apply-b114-v08.json"),fx=load("docs/capabilities/CAP-10-04/temp-apply-b114-fixtures-v08.json");
const judge=function judge(rule,x){
  const ok=(status,reason)=>({status,reason});
  switch(rule){
    case "B114-R01": if(!x.profilePinned||!x.methodDiscovered||!x.tempTypeSupported)return ok("UNKNOWN","ADAPTER_CAPABILITY_NOT_PINNED");if(x.autoActivation)return ok("REJECT","ACTIVATE_NOT_TRANSFER");return ok("CANDIDATE","TEMP_PORT_DISCOVERED");
    case "B114-R02": if(x.lateAck||x.activeSession!==x.handleSession||x.currentEpoch!==x.handleEpoch)return ok("STALE","SESSION_EPOCH_OR_LATE_ACK");if(!x.handleValid)return ok("UNKNOWN","HANDLE_UNVERIFIED");return ok("CANDIDATE","CURRENT_SESSION_ONLY");
    case "B114-R03": if(!x.transactionExact)return ok("STALE","COMPLETION_NOT_SAME_TRANSACTION");if(x.observedState==="Error")return ok("REJECT","APPLY_FAILED");if(x.observedState!=="Idle"||!x.serverApplied)return ok("UNKNOWN","APPLY_NOT_FINISHED");return ok("CANDIDATE",x.completionToken===null?"SYNCHRONOUS_SERVER_APPLY":"ASYNCHRONOUS_SERVER_APPLY");
    case "B114-R04": if(!x.pathScoped||x.activeOverwrite)return ok("REJECT","ACTIVE_OR_PATH_FORBIDDEN");if(!x.newNodeIdResolved)return ok("STALE","NODEID_CHANGED");if(x.claimsAtomic)return ok("UNKNOWN","ATOMICITY_NOT_STANDARD_GUARANTEED");return ok("CANDIDATE","STAGE_NODE_RESOLVED");
    case "B114-R05": if(!x.receiverReadback||!x.applicationShaVerified)return ok("UNKNOWN","RECEIVER_APPLICATION_READBACK_UNKNOWN");if(!x.sourceHash||!x.receiverHash)return ok("UNKNOWN","MISSING_DIGEST");if(x.sourceHash!==x.receiverHash)return ok("REJECT","RAW_BYTES_MISMATCH");return ok("CANDIDATE","SYNTHETIC_DIGEST_COMPARISON_ONLY");
    case "B114-R06": if(x.activated)return ok("REJECT","NO_AUTOMATIC_ACTIVATION");if(!x.allFilesPresent||!x.manifestSignedExact)return ok("UNKNOWN","CLOSURE_OR_SIGNER_UNKNOWN");if(!x.closureHashMatches)return ok("REJECT","SUBPROGRAM_CLOSURE_MISMATCH");return ok("CANDIDATE","STAGED_ONLY");
    case "B114-R07": if(!x.d16Exact||!x.d10Exact||!x.frameExact||!x.scopeEpochMatches||!x.casMatches||x.cancelled)return ok("STALE","EXACT_CAS_SCOPE_OR_CANCEL_FENCE");if(!x.aclCurrent)return ok("REJECT","OWNER_ACL_REVOKED");return ok("CANDIDATE","OWNER_PRECONDITIONS_ONLY");
    case "B114-R08": if(!x.samePort||!x.singleBabylon||!x.leftPanel||x.autoSelect||x.cycleStart||x.claimD15)return ok("REJECT","GUI_OR_EXECUTION_POLICY_VIOLATION");if(!x.receiverIndependent)return ok("UNKNOWN","INDEPENDENT_RECEIPT_NOT_OBSERVED");return ok("CANDIDATE","UI_AND_CONSUMER_PLANNING_ONLY");
    default:throw Error("UNKNOWN_RULE "+rule);
  }
};
assert.equal(registry.registeredRecords,registry.sources.length);
assert.equal(new Set(registry.sources.map(x=>x.id)).size,registry.sources.length);
assert.equal(new Set(fx.cases.map(x=>x.id)).size,fx.cases.length);
const sourceIds=new Set(registry.sources.map(x=>x.id)),byId=new Map(fx.cases.map(x=>[x.id,x]));
assert.equal(tr.rules.length,8);
for(const r of tr.rules){assert.ok(r.fields.length>0&&r.caps.length>0&&r.originalWorkPackages.length>0);assert.ok(r.sourceIds.length>0&&r.sourceIds.every(id=>sourceIds.has(id)));assert.ok(r.positive.length>0&&r.negative.length>=3);for(const id of [...r.positive,...r.negative]){assert.ok(byId.has(id),id);assert.equal(byId.get(id).rule,r.id);assert.ok(r.fields.every(f=>Object.prototype.hasOwnProperty.call(byId.get(id).input,f)),id);}}
for(const c of fx.cases){assert.equal(judge(c.rule,c.input).status,c.expect,c.id);assert.notEqual(c.expect,"D15_PASS");}
console.log("B114规划合成预检："+fx.cases.length+"/"+fx.cases.length+" 同一判定函数通过；独立Node实际运行、Owner/设备/消费者均NOT_RUN（如未在真实环境执行）。");

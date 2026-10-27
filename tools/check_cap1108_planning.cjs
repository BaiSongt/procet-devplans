#!/usr/bin/env node
// 只读规划仓的授权正反/状态/NC跨域合成校验；不代表产品已通过。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const load=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,"..",p),"utf8"));
const f=load("docs/capabilities/CAP-11-08/fixtures.json"),t=load("research/traces/CAP-11-08.json"),s=load("research/sources/CAP-11-08.json"),p=load("tracking/progress.json"),a=load("docs/architecture/v0.8/business-assets.json");
const get=(x,p)=>p.split(".").reduce((v,k)=>v&&v[k],x);
function assert(x,what){if(!x)throw Error(what)}
function state(c){let x=c.ctx||{};if(c.event==="CANCEL")return x.ownerCommitProven?"RECONCILE_COMMITTED":"CANCELLED";if(c.event==="LATE_ACK")return x.ownerCommitProven?"RECONCILE_COMMITTED":"QUARANTINED";if(c.event==="RETRY")return x.ownerCommitProven?"EXISTING_RECEIPT":"RECONCILE_REQUIRED";if(c.state==="REQUESTED"&&c.event==="PREFLIGHT")return ["policyFresh","scopeValid","evidencePinned"].every(k=>x[k]===true)?"REVIEW_READY":"REJECT";if(c.state==="REVIEW_READY"&&c.event==="REQUEST_APPROVAL")return x.riskDisclosure&&x.approverSeparated?"PENDING_REVIEW":"REJECT";if(c.state==="PENDING_REVIEW"&&c.event==="DECLINE")return "DENIED";if(c.state==="PENDING_REVIEW"&&c.event==="APPROVE")return x.authenticated&&x.digestMatched&&x.targetPinned&&!x.expired&&!x.agentSelfApproved?"APPROVED":"REJECT";if(c.state==="APPROVED"&&c.event==="COMMIT")return !x.semanticKnown?"UNKNOWN":["ownerPort","aclCurrent","casExact","cancelCurrent","frameExact","scopeCurrent","frozenProtected","nonceUnused","approvalCurrent"].every(k=>x[k]===true)?"COMMIT_READY":"REJECT";return "UNKNOWN"}
function cross(c){return !c.flags.d13Known?"UNKNOWN":Object.values(c.flags).every(Boolean)?"RELEASE_REVIEW_ONLY":"REJECT"}
assert(f.cases.length===50&&f.transitions.length===31&&f.crossCases.length===6&&t.rules.length===10&&s.sources.length===10,"案例/规则计数");
assert(p.capabilities.drafted.some(x=>x.id==="CAP-11-08"),"未计入CAP");assert(a.assets.length===17&&new Set(a.assets.map(x=>x.id)).size===17,"17资产不一致");
const rmap=new Map(t.rules.map(r=>[r.id,r])),sids=new Set(s.sources.map(x=>x.id));assert(rmap.size===10&&sids.size===10,"ID重复");
for(const r of t.rules){assert(r.criteria.length===4&&r.fields.length===4&&r.workPackages.includes("T5-01")&&r.workPackages.includes("T5-02"),"规则字段/原包"+r.id);for(const id of r.sourceIds)assert(sids.has(id),"缺少来源"+id);for(const v of r.criteria)assert(r.fields.includes(v.path),"丢字段"+v.path)}
for(const c of f.cases){const r=rmap.get(c.ruleId);assert(r,"规则缺失"+c.id);assert((r.criteria.every(v=>get(c.input,v.path)===true)?"PASS":"REJECT")===c.expected,"案例"+c.id);if(c.scenario==="INDEPENDENT_FIELD_MUTATION")assert(r.fields.includes(c.mutatedField)&&get(c.input,c.mutatedField)===false,"反例无变异"+c.id)}
for(const c of f.transitions)assert(state(c)===c.expected,"状态"+c.id);
for(const c of f.crossCases)assert(cross(c)===c.expected,"NC链"+c.id);
console.log("CAP-11-08 PLANNING_ONLY 87/87 PASS; PRODUCT/CONSUMERS NOT_RUN");

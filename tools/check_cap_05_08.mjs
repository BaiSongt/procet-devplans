#!/usr/bin/env node
// 中文注释：只检测CAP-05-08规划来源/追踪/正反合成验收；不能替代真实产品及机床验收。
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=load('research/sources/CAP-05-08.json'), t=load('research/traces/CAP-05-08.json'), f=load('docs/capabilities/CAP-05-08/fixtures.json');
const owners=load('docs/capabilities/CAP-05-08/asset-owner-candidates.json');
const evaluate=function evaluate(n,x){
const validRef=r=>r&&typeof r.id==="string"&&typeof r.revision==="string"&&/^[a-f0-9]{64}$/.test(r.hash||"")&&!!r.frame&&!!r.schemaVersion&&!!r.scope;
switch(n){
case 1:return x.scope==="synthetic-project"&&Array.isArray(x.refs)&&["D01","D02","D03","D04","D05","D08"].every(id=>x.refs.some(r=>r.id===id&&validRef(r)&&r.scope===x.scope));
case 2:{const ids=(x.operations||[]).map(o=>o.id);if(!ids.length||new Set(ids).size!==ids.length)return false;const indegree=new Map(ids.map(id=>[id,0]));const outs=new Map(ids.map(id=>[id,[]]));for(const edge of x.dependencies||[]){if(!Array.isArray(edge)||edge.length!==2||!outs.has(edge[0])||!outs.has(edge[1]))return false;outs.get(edge[0]).push(edge[1]);indegree.set(edge[1],indegree.get(edge[1])+1);}const q=ids.filter(id=>indegree.get(id)===0);let seen=0;while(q.length){const id=q.shift();seen++;for(const to of outs.get(id)){indegree.set(to,indegree.get(to)-1);if(indegree.get(to)===0)q.push(to);}}return seen===ids.length;}
case 3:return x.unit==="mm"&&Number.isFinite(x.allowanceMm)&&x.allowanceMm>=0&&x.requiredFeatureIds?.length>0&&x.requiredFeatureIds.every(id=>x.boundFeatureIds?.includes(id)&&x.occurrenceRefs?.some(r=>r.featureId===id&&!!r.occurrenceId&&/^[a-f0-9]{64}$/.test(r.sourceHash||"")));
case 4:return validRef(x.resourceRef)&&x.resourceCapabilityState==="SUPPORTED"&&x.toolAssemblyComplete===true&&x.unresolvedCapabilityIds?.length===0;
case 5:return validRef(x.setupRef)&&x.setupRef.id==="D04"&&validRef(x.executionRef)&&x.executionRef.id==="D10"&&/^[a-f0-9]{64}$/.test(x.frameProofHash||"")&&x.fixtureConstraintChecked===true&&x.executionUsedAsNominalSetup===false;
case 6:return ["A","B"].includes(x.mode)&&/^[a-f0-9]{64}$/.test(x.sharedSourceHash||"")&&x.heads?.A!==x.heads?.B&&x.decisionStatus==="HUMAN_CONFIRMED"&&x.overwriteFrozen===false&&!x.changedIds?.some(id=>x.frozenIds?.includes(id));
case 7:return x.affectedIds?.length>0&&x.preservedIds?.length>0&&["D06","D07","D09","D12","D13","D14","D15","D16"].every(a=>x.staleAssets?.includes(a))&&x.d13==="UNKNOWN"&&x.d15==="BLOCKED"&&x.d16==="BLOCKED"&&x.clAnimationAsNcVerification===false;
case 8:return x.authorized===true&&x.permissionRechecked===true&&x.expectedRevision===x.currentRevision&&x.taskGeneration===x.replyGeneration&&x.scopeEpoch===x.replyScopeEpoch&&x.cancelled===false;
case 9:return x.consumer==="D06"&&x.ownerAcceptedHandoff===true&&x.refsExact===true&&x.planGate==="READY_FOR_HANDOFF"&&x.consumerStatus==="ACCEPTED_FOR_SOLVER_INPUT"&&x.d09Gate==="BLOCKED_UNTIL_D07_D08"&&x.d15Verified===false&&x.d16Released===false;
case 10:return ["GUI","CLI","Agent"].every(e=>x.entries?.includes(e))&&x.singleDomainPort===true&&x.babylonWorldCount===1&&x.taskPanel==="LEFT_UNIFIED"&&x.previewWrites===false&&x.rollback==="FORK_NEW_REVISION"&&x.migrationMissingEvidence==="UNKNOWN"&&x.lateReplyDropped===true;
default:return false;
}};
function assert(value,msg){if(!value)throw new Error(msg);}
assert(s.sources.length===8&&s.registeredRecords===8,'来源不是8条');
assert(t.rules.length===10&&f.cases.length===20,'规则10/合成用例20不完整');
assert(owners.assets.length===17&&new Set(owners.assets.map(x=>x.assetId)).size===17,'17资产候选缺失/重复');
const sourceIds=new Set(s.sources.map(x=>x.id));assert(sourceIds.size===8,'来源ID重复');
for(const item of s.sources)assert(item.url?.startsWith('https://')&&item.authors?.length&&item.edition&&item.published&&item.accessedOn&&item.accessDepth&&item.locator&&item.limits,'来源缺必备证据字段 '+item.id);
const seen=new Set();
for(let n=1;n<=10;n++){const rule=t.rules[n-1];assert(rule.id===`PG508-R${String(n).padStart(2,'0')}`,'规则ID/排序错');assert(rule.fields.length&&rule.sourceIds.length&&rule.sourceIds.every(id=>sourceIds.has(id)),'规则-字段-来源链断裂 '+rule.id);assert(rule.workPackages.join(',')==='W2-02,W2-03,W2-05','非原编号映射');
const group=f.cases.filter(c=>c.ruleId===rule.id);assert(group.length===2&&new Set(group.map(c=>c.expected)).size===2,'正反未闭合 '+rule.id);
for(const c of group){assert(!seen.has(c.id),'验收ID重复');seen.add(c.id);assert(c.synthetic===true&&c.consumerGate==='INDEPENDENT_PRODUCT_TEST_NOT_RUN','案例冒称产品通过');assert(evaluate(n,c.input)===(c.expected==='PASS'),'合成规则实际判定失败 '+c.id);}}
assert(s.sources.every(x=>x.productAcceptance==='NOT_RUN')&&f.productAcceptance==='NOT_RUN','产品状态污染');
console.log('PASS CAP-05-08: 8来源/10规则/20正反/17资产候选；规划数据测试而非产品PASS');

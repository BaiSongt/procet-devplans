#!/usr/bin/env node
// 中文注释：仅对CAP-05-07规划来源、规则、20条合成正反验收做机器检查，绝不写产品仓/数据库。
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), load=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=load('research/sources/CAP-05-07.json'), tr=load('research/traces/CAP-05-07.json'),fx=load('docs/capabilities/CAP-05-07/fixtures.json');
function evaluateRule(n,x){const valid=(v)=>v&&typeof v.id==="string"&&!!v.revision&&/^[a-f0-9]{64}$/.test(v.hash||"")&&!!v.frame&&!!v.schemaVersion&&!!v.scope;
switch(n){
case 1:return x.scope==="demo"&&Array.isArray(x.refs)&&["D01","D02","D04","D05","D08"].every(id=>x.refs.some(v=>v.id===id&&valid(v)&&v.scope===x.scope));
case 2:return x.baseNodes?.length===2&&!x.crossEdges&&!x.currentChanges.some(id=>x.proposedChanges.includes(id));
case 3:return !x.overwritesD08&&!x.changed.some(id=>x.frozen.includes(id));
case 4:return !!x.branchA&&!!x.branchB&&/^[a-f0-9]{64}$/.test(x.sharedFactHash||"")&&!x.overwriteA&&!x.overwriteB;
case 5:return !!x.setupRef&&!!x.frame&&/^[a-f0-9]{64}$/.test(x.proofHash||"")&&!!x.executionRef&&!x.treatD10AsSetup;
case 6:return x.authorized===true&&x.rechecked===true&&x.expected===x.current&&x.taskGeneration===x.replyGeneration&&!x.cancelled;
case 7:return x.stableIdsKnown===true&&x.renameAutoAccept===false&&x.ordered===true&&["NODE_ADD","EDGE_REMOVE","STRATEGY_CHANGE"].every(y=>x.diffTypes.includes(y));
case 8:return x.affected.length>0&&["D09","D12","D13","D14","D15","D16"].every(y=>x.stale.includes(y))&&x.unaffectedKept&&x.d13==="UNKNOWN"&&x.d15==="BLOCKED"&&!x.clAsNcVerified;
case 9:return x.rollbackMode==="FORK_NEW_REVISION"&&x.auditAppendOnly&&x.historyKept&&!x.deleteUserData;
case 10:return ["GUI","CLI","Agent"].every(v=>x.entries.includes(v))&&x.singleDomainPort&&x.worldCount===1&&x.taskPanel==="LEFT_UNIFIED"&&!x.previewWrites&&x.productStatus==="NOT_RUN";
default:return false;}}
function assert(v,msg){if(!v)throw new Error(msg);}
assert(src.registeredRecords===8&&src.sources.length===8,'来源登记必须8条');
assert(tr.rules.length===10&&fx.cases.length===20,'规则10、正反20');
const ids=new Set(src.sources.map(s=>s.id));assert(ids.size===8,'来源ID不得重复');
for(const s of src.sources)assert(s.url?.startsWith('https://')&&s.authors?.length&&s.edition&&s.accessedOn&&s.accessDepth&&s.locator&&s.limits,'来源证据字段缺失 '+s.id);
const seen=new Set();
for(let i=0;i<tr.rules.length;i++){const rule=tr.rules[i];assert(rule.id===`REV507-R${String(i+1).padStart(2,'0')}`,'规则编号或排序错误');
assert(rule.sourceIds.length>0&&rule.sourceIds.every(x=>ids.has(x))&&rule.fields.length>0&&rule.workPackages.every(x=>['W2-02','W2-03','W2-05'].includes(x)),'追踪链断裂 '+rule.id);
const a=fx.cases.filter(x=>x.ruleId===rule.id);assert(a.length===2&&a.some(x=>x.expected==='PASS')&&a.some(x=>x.expected==='REJECT'),'正反不闭合 '+rule.id);
for(const c of a){assert(!seen.has(c.id),'验收ID重复 '+c.id);seen.add(c.id);assert(c.synthetic===true&&evaluateRule(i+1,c.input)===(c.expected==='PASS'),'正反合成判定不符 '+c.id);}
}
console.log('PASS: CAP-05-07 8来源/10规则/20正反及追踪一致；仅规划合成检查。');

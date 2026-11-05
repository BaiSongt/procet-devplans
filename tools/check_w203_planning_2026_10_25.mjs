// 中文注释：仅验证规划用合成数据；不触碰任何产品仓或用户数据。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = JSON.parse(fs.readFileSync(path.join(root, 'docs/work-packages/W2-03/fixtures.json'), 'utf8'));
const trace = JSON.parse(fs.readFileSync(path.join(root, 'research/traces/W2-03.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(root, 'research/sources/W2-03.json'), 'utf8'));
const impactRules=fixtures.impactPolicy;
function childMap(edges){const m=new Map();for(const e of edges){if(!m.has(e.from))m.set(e.from,new Set());m.get(e.from).add(e.to);}return m;}
function cyclic(es){const adj=childMap(es),mark=new Map();function visit(x){if(mark.get(x)===1)return true;if(mark.get(x)===2)return false;mark.set(x,1);for(const t of (adj.get(x)||[])){if(visit(t))return true;}mark.set(x,2);return false;}for(const v of new Set(es.flatMap(e=>[e.from,e.to]))){if(visit(v))return true;}return false;}
function reach(es,start,scope){const adj=childMap(es.filter(e=>e.scopeId===scope)),seen=new Set(),queue=[start];while(queue.length){const x=queue.shift();if(seen.has(x))continue;seen.add(x);for(const t of (adj.get(x)||[]))queue.push(t);}return [...new Set([...seen].map(x=>x.split(":")[0]))].sort();}
function sameSet(a,b){return JSON.stringify([...new Set(a)].sort())===JSON.stringify([...new Set(b)].sort())}
function assess(x){
const c=x.context,g=x.graph,ch=x.change,guard=x.guard,cons=x.consumer,r=c.sourceRef;
const bad=(reason)=>({status:"REJECTED",reason,impactedAssets:[],mayPublish:false});
if(!c.projectId||!c.branchId||!r.id||!r.hash||!r.frame||!r.unit||r.revision!==r.expectedRevision||r.hash!==r.expectedHash||r.frame!==r.expectedFrame)return bad("REJECT_EXACT_REF");
if(c.graphVersion!==c.expectedGraphVersion)return bad("REJECT_GRAPH_VERSION");
if(cyclic(g.edges))return bad("REJECT_GRAPH_CYCLE");
if(c.scopeId!==c.inputScopeId ||g.edges.some(e=>e.from.split(":")[1]!==e.to.split(":")[1]||e.scopeId!==e.from.split(":")[1]))return bad("REJECT_SCOPE_LEAK");
if(ch.freezeMutation)return bad("REJECT_FROZEN_WRITE");
if(guard.expectedHead!==guard.currentHead||guard.permission!=="ALLOW"||guard.idempotencyCollision)return bad("REJECT_CAS_ACL");
if(guard.cancelled||guard.receipt!=="ON_TIME"||guard.taskGeneration!==guard.currentGeneration)return bad("REJECT_CANCEL_OR_LATE");
if(!cons.independentRecheck||!cons.sourceClosed)return bad("REJECT_CONSUMER_RECHECK");
if(ch.claimPublished&&ch.d13Status!=="PASS")return bad("REJECT_UNVERIFIED_PUBLICATION");
if(ch.contentIntegrity!=="MATCH")return {status:"UNKNOWN",reason:"QUARANTINE_CONTENT_INTEGRITY",impactedAssets:[],mayPublish:false};
let impact=[];
if(ch.kind==="UI_THEME"||ch.kind==="D17_FEEDBACK")impact=[];
else if(ch.kind==="RESOURCE_STATUS")impact=["D03"];
else if(impactRules[ch.kind]) impact=reach(g.edges,impactRules[ch.kind].changedNode,c.scopeId);
else return {status:"UNKNOWN",reason:"UNKNOWN_CHANGE_KIND",impactedAssets:[],mayPublish:false};
if(ch.requestedImpacts!==null&&!sameSet(impact,ch.requestedImpacts))return bad("REJECT_OVERBROAD_OR_MISSING_IMPACT");
const reason=ch.kind==="UI_THEME"?"NO_MANUFACTURING_IMPACT":ch.kind==="RESOURCE_STATUS"?"ELIGIBILITY_REVIEW":ch.kind==="D17_FEEDBACK"?"REVIEW_ONLY":"REVALIDATION_REQUIRED";
return {status:"PLANNING_ONLY",reason,impactedAssets:impact,mayPublish:false};
}
function merge(o,p){if(Array.isArray(p))return p;if(p&&typeof p==="object"){const x={...(o||{})};for(const k of Object.keys(p))x[k]=merge(x[k],p[k]);return x;}return p;}
function eq(a,b){return JSON.stringify(a)===JSON.stringify(b);}
if(trace.rules.length!==10||fixtures.cases.length!==20||sources.sources.length!==9)throw Error('规划条目数量失配');
const ids = new Set(sources.sources.map(x=>x.id));
for(const rule of trace.rules){if(!rule.sourceIds.length||!rule.sourceIds.every(x=>ids.has(x)))throw Error('来源不存在: '+rule.id);for(const k of ['positiveTestId','negativeTestId'])if(!fixtures.cases.find(x=>x.id===rule[k]&&x.ruleId===rule.id))throw Error('正反验收不存在 '+rule.id);}
let pass=0;
for(const test of [...fixtures.cases,...fixtures.extraCases]){const actual=assess(merge(fixtures.baseScenario,test.overrides));if(!eq(actual,test.expected))throw Error('规则失败 '+test.id+' '+JSON.stringify({actual,expected:test.expected}));pass++;}
const nc=assess(fixtures.baseScenario);if(!sameSet(nc.impactedAssets,['D12','D13','D14','D15','D16']))throw Error('NC局部失效集合不符合原目标');
const ui=assess(merge(fixtures.baseScenario,{change:{kind:'UI_THEME'}}));if(ui.impactedAssets.length)throw Error('主题不应使制造资产失效');
const availability=assess(merge(fixtures.baseScenario,{change:{kind:'RESOURCE_STATUS',resourceAvailability:'OFFLINE',contentIntegrity:'MATCH'}}));if(!sameSet(availability.impactedAssets,['D03']))throw Error('资源状态不等于内容被篡改');
console.log('W2-03 规划合成PASS '+pass+'/'+pass+'（含20正反与10变异；非产品PASS）');

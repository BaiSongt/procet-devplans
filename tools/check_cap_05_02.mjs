// 规划合成验收，仅验证规则/追踪结构；非产品测试。
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=p=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
const fx=load('docs/capabilities/CAP-05-02/fixtures.json');
const tr=load('research/traces/CAP-05-02.json'),sources=load('research/sources/CAP-05-02.json');
function valid(id,v){
 const p=v.policy;
 const e=x=>!!x&&!!x.id&&!!x.revision&&/^[0-9a-f]{64}$/.test(x.hash)&&!!x.frame;
 switch(id){
 case "STRAT5-R01":return !!v.projectScope&&[v.d01,v.d02,v.d04].every(e)&&/^[0-9a-f]{64}$/.test(p.hash);
 case "STRAT5-R02":return p.stages.length===3&&["ROUGH","SEMI_FINISH","FINISH"].every((phase,i)=>p.stages[i].phase===phase);
 case "STRAT5-R03":return Object.entries({ap:"mm",ae:"mm",vc:"m/min",fz:"mm/tooth"}).every(([k,unit])=>p.params[k]?.unit===unit&&Number.isFinite(p.params[k]?.value)&&p.params[k].value>0);
 case "STRAT5-R04":return !!e(p.toolRef)&&!!e(p.materialRef)&&Number.isInteger(p.effectiveTeeth)&&p.effectiveTeeth>0;
 case "STRAT5-R05":return p.stages.every(s=>s.frame==="PART")&&["pocket","web"].every(k=>p.stages.every(s=>Number.isFinite(s.allowance[k])&&s.allowance[k]>=0)&&p.stages[0].allowance[k]>=p.stages[1].allowance[k]&&p.stages[1].allowance[k]>=p.stages[2].allowance[k]);
 case "STRAT5-R06":return p.quality.verified===false&&p.quality.tolerance.unit==="mm"&&p.quality.roughness.unit==="um"&&v.verification.independentConsumer==="NOT_RUN";
 case "STRAT5-R07":return !!e(p.protection.cadRef)&&(!p.protection.releaseAllowed||!!p.protection.approvalRef);
 case "STRAT5-R08":return p.writeAsset==="D05"&&p.override.writeAsset==="D05"&&p.override.humanAdopted===true&&!!p.override.provenance;
 case "STRAT5-R09":return v.actor.canCommit===true&&v.cas.expected===v.cas.current&&!v.task.cancelled&&v.task.generation===v.task.replyGeneration;
 case "STRAT5-R10":return p.executionBinding===null&&v.verification.D13==="NOT_RUN"&&v.verification.D15==="NOT_RUN"&&v.verification.D16==="NOT_RUN";
 default:throw Error("未知规则 "+id);
 }
}
function mutate(o,path,value){const t=path.replace(/\[(\d+)\]/g,'.$1').split(".");let x=o;for(const k of t.slice(0,-1))x=x[k];x[t.at(-1)]=value;}
const assert=(x,msg)=>{if(!x)throw new Error(msg)};
const sourceIds=new Set(sources.sources.map(s=>s.id));
assert(sourceIds.size===9&&sources.registeredRecords===9&&tr.rules.length===10&&fx.cases.length===20,'数量或来源ID冲突');
for(const r of tr.rules)assert(r.fields.length>0&&r.sourceIds.length>0&&r.sourceIds.every(x=>sourceIds.has(x))&&r.acceptanceIds.length===2&&r.acceptanceIds.every(x=>fx.cases.some(c=>c.id===x)),'追踪断裂 '+r.id);
let passed=0;for(const c of fx.cases){const v=structuredClone(fx.base);for(const m of c.mutations)mutate(v,m.path,m.value);assert((valid(c.ruleId,v)?'ACCEPT':'REJECT')===c.expected,'不符合预期 '+c.id);passed++}
const extras=[['actor.canCommit',false,'STRAT5-R09'],['task.cancelled',true,'STRAT5-R09'],['task.replyGeneration',7,'STRAT5-R09'],['policy.stages[2].allowance.pocket',1,'STRAT5-R05']];
for(const [p,value,id] of extras){const v=structuredClone(fx.base);mutate(v,p,value);assert(!valid(id,v),'附加错误未拒绝 '+p)}
assert(fx.cases.filter(x=>x.kind==='positive').length===10&&fx.cases.filter(x=>x.kind==='negative').length===10,'正反不对称');
console.log(JSON.stringify({scope:'CAP-05-02 synthetic planning',sources:9,rules:10,cases:passed,extras:4,status:'PASS',productAcceptance:'NOT_RUN'}));

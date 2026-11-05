#!/usr/bin/env node
// 中文说明：仅验证规划追踪与合成正反样例；不得据此声明产品或机床通过。
import {readFileSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,"..");
const read=p=>JSON.parse(readFileSync(resolve(root,p),"utf8"));
const f=read("docs/capabilities/CAP-05-01/fixtures.json");
const trace=read("research/traces/CAP-05-01.json");
const sources=read("research/sources/CAP-05-01.json");
const hex=/^[a-f0-9]{64}$/i;
function inspect(x){
 const errors=[];
 const e=(id,why)=>errors.push(id+":"+why);
 const validRef=z=>!!z&&typeof z.id==="string"&&z.id.length>0&&typeof z.revision==="string"&&z.revision.length>0&&typeof z.frame==="string"&&z.frame.length>0&&hex.test(z.hash??"");
 if(!x.projectScope||!validRef(x.cadExactRef)||!validRef(x.d02ExactRef)||!hex.test(x.route?.contentHash??""))e("ROUTE-R01","identity_revision_hash_frame");
 const rt=x.route??{},stages=rt.stages??[],ops=rt.operations??[],steps=rt.steps??[];
 if(stages.length===0||ops.length===0||steps.length===0||stages.some(s=>!validRef(s.setupExactRef)||!ops.some(o=>o.stageId===s.id))||ops.some(o=>!stages.some(s=>s.id===o.stageId&&s.operationIds.includes(o.id))||!(o.stepIds??[]).length)||steps.some(s=>!ops.some(o=>o.id===s.operationId&&o.stepIds.includes(s.id))))e("ROUTE-R02","hierarchy_stage_operation_step");
 const allIds=[...stages.map(z=>z.id),...ops.map(z=>z.id),...steps.map(z=>z.id)];
 if(new Set(allIds).size!==allIds.length||allIds.some(x=>!x||typeof x!=="string"))e("ROUTE-R03","stable_distinct_ids");
 const opids=new Set(ops.map(o=>o.id)),adj=new Map(ops.map(o=>[o.id,[]]));
 for(const edge of rt.edges??[]){if(!opids.has(edge.from)||!opids.has(edge.to)){e("ROUTE-R04","dangling_dependency");continue;} adj.get(edge.from).push(edge.to);}
 const visiting=new Set(),visited=new Set();
 function visit(id){if(visiting.has(id))return false;if(visited.has(id))return true;visiting.add(id);for(const next of adj.get(id)??[]){if(!visit(next))return false;}visiting.delete(id);visited.add(id);return true;}
 if([...opids].some(id=>!visit(id)))e("ROUTE-R04","dependency_cycle");
 for(const edge of rt.edges??[]){let f=ops.find(x=>x.id===edge.from),t=ops.find(x=>x.id===edge.to);
  if(!f||!t)continue;
  const shouldCross=f.stageId!==t.stageId;
  if(!!edge.crossSetup!==shouldCross||(shouldCross&&!validRef(edge.transferExactRef)))e("ROUTE-R05","cross_setup_transfer_evidence");
 }
 if(ops.some(o=>!validRef(o.featureExactRef))||ops.some(o=>o.featureExactRef?.frame!=="PART"))e("ROUTE-R06","feature_exact_link");
 if(!validRef(rt.freeze?.readOnlyD08Ref)||rt.freeze?.attemptOverwrite!==false||rt.freeze?.appendOnly!==true)e("ROUTE-R07","freeze_cannot_overwrite");
 if(rt.machineId!==null||rt.executionBindingId!==null)e("ROUTE-R08","machine_binding_forbidden_in_D05");
 if(!x.actor?.canCommit||x.cas?.expected!==x.cas?.current||x.task?.cancelled||x.task?.generation!==x.task?.returnGeneration)e("ROUTE-R09","cas_authorization_cancel_generation");
 if(rt.outcome?.stage!=="D05"||rt.outcome?.certified!==false||["d09State","d13State","d15State","d16State"].some(k=>!["NOT_RUN","UNKNOWN"].includes(rt.outcome?.[k])))e("ROUTE-R10","no_downstream_certification");
 return [...new Set(errors)];
}
(root,path,op,value)=>{
 const keys=path.replace(/\[(\d+)\]/g,".$1").split("."),key=keys.pop();let target=root;
 for(const p of keys){target=target[p];if(target===undefined)throw Error("路径不存在："+path)}
 if(op==="delete")delete target[key];else if(op==="append")target[key].push(clone(value));else target[key]=clone(value);
}
const clone=v=>JSON.parse(JSON.stringify(v));
function fail(message){throw Error(message)}
if(f.capabilityId!=="CAP-05-01"||trace.capabilityId!=="CAP-05-01"||trace.rules.length!==10||f.cases.length!==20||sources.sources.length!==8)fail("数量或CAP不匹配");
const ids=new Set(sources.sources.map(s=>s.id));
if(ids.size!==8||sources.sources.some(s=>!s.authors?.length||!s.edition||!s.published||!s.url||!s.accessDepth||!s.limits||!s.locator))fail("来源元数据缺失");
for(const rule of trace.rules){if(rule.fields.length===0||rule.workPackages.length===0||rule.acceptanceIds.length!==2||rule.sourceIds.some(x=>!ids.has(x))||rule.acceptanceIds.some(x=>!f.cases.some(c=>c.id===x&&c.ruleId===rule.id)))fail("规则断链: "+rule.id)}
const seen=new Set();
for(const c of f.cases){if(seen.has(c.id))fail("重复用例"+c.id);seen.add(c.id);const input=clone(f.base);for(const m of c.mutations)setter(input,m.path,m.op,m.value);const errs=inspect(input);
if(c.expected==="ACCEPT"&&errs.length)fail(c.id+" 正例FAIL "+errs);
if(c.expected==="REJECT"&&!errs.some(e=>e.startsWith(c.ruleId+":")))fail(c.id+"负例未触发针对规则 "+errs);
}
for(const p of ["docs/capabilities/CAP-05-01/README.md","docs/capabilities/CAP-05-01/UI.md","docs/capabilities/CAP-05-01/prototype.html","research/topics/R-ROUTE-001.md"])if(!existsSync(resolve(root,p)))fail("缺文件 "+p);
console.log("PASS: 8项来源、10规则、20正反合成样例、10个目标负例；产品/独立消费者 NOT_RUN");

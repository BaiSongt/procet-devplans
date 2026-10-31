// CAP-05-06规划合成校验；只用Node标准库，不读取或修改用户数据库。
import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const validRef=x=>!!x&&["id","revision","hash","frame","schemaVersion"].every(k=>typeof x[k]==="string"&&!!x[k])&&/^[a-f0-9]{64}$/.test(x.hash)&&x.scope==="demo";
const DAG=x=>{if(!x?.nodes?.length||!Array.isArray(x.edges)||new Set(x.nodes).size!==x.nodes.length)return false;const d=Object.fromEntries(x.nodes.map(n=>[n,0]));for(const [a,b] of x.edges){if(!(a in d)||!(b in d)||a===b)return false;d[b]++;}let q=x.nodes.filter(n=>d[n]===0),count=0;while(q.length){const v=q.pop();count++;for(const [a,b] of x.edges)if(a===v&&--d[b]===0)q.push(b)}return count===x.nodes.length};
const check=function check(r,x){switch(r){
case "FRZ506-R01":return x.scope==="demo"&&x.refs?.length===5&&x.refs.every(validRef);
case "FRZ506-R02":return DAG(x)&&x.nodes.includes(x.target);
case "FRZ506-R03":return x.decisionOwner==="D05"&&x.snapshotOwner==="D08"&&x.d08Overwritten===false&&x.auditAppendOnly===true;
case "FRZ506-R04":return !!x.base&&!!x.current&&!!x.proposed&&((x.overlap===false&&x.dependencyCross===false&&x.mergeMode==="REVIEW_NONOVERLAP")||(x.overlap===true&&x.approvedResolution===true&&x.mergeMode==="MANUAL_APPROVED"));
case "FRZ506-R05":return x.thaw===true&&!!x.approval&&x.mode==="FORK_NEW_D05"&&!!x.reason&&x.historicKept===true;
case "FRZ506-R06":return x.a==="A"&&x.b==="B"&&x.sharedHash===true&&x.overwriteA===false&&x.overwriteB===false&&x.frozenA===true;
case "FRZ506-R07":return x.entries?.length===3&&["GUI","CLI","Agent"].every(e=>x.entries.includes(e))&&x.sharedPort===true&&x.worldCount===1&&x.panel==="LEFT_TASK_PANEL"&&x.previewWrites===0&&x.agentBypass===false;
case "FRZ506-R08":return x.authorized===true&&x.rechecked===true&&x.expected===x.current&&x.epoch===x.currentEpoch&&x.generation===x.replyGeneration&&x.cancelled===false&&x.lateReceipt===false&&x.sourceHashesMatch===true;
case "FRZ506-R09":return x.affected?.length>0&&x.affected.length===x.stale?.length&&x.affected.every(v=>x.stale.includes(v))&&x.unaffected.every(v=>!x.stale.includes(v))&&x.statusD13==="UNKNOWN"&&x.statusD15==="NOT_RUN"&&x.statusD16==="BLOCKED"&&x.clCertified===false&&x.sweptMaterial===false;
case "FRZ506-R10":return !!x.adapter&&x.rollback==="NEW_REVISION"&&x.deleteUserData===false&&x.auditAppendOnly===true&&x.productStatus==="NOT_RUN";
default:throw Error("未知规则"+r);
}};
const s=read("research/sources/CAP-05-06.json"),t=read("research/traces/CAP-05-06.json"),f=read("docs/capabilities/CAP-05-06/fixtures.json");
const assert=(v,m)=>{if(!v)throw Error(m)};
assert(s.sources.length===8&&s.registeredRecords===8&&t.rules.length===10&&f.cases.length===20,"基数错误");
const sid=s.sources.map(x=>x.id),rid=t.rules.map(x=>x.id),aid=f.cases.map(x=>x.id);
assert(new Set(sid).size===8&&new Set(rid).size===10&&new Set(aid).size===20,"ID重复");
for(const rule of t.rules){const matches=f.cases.filter(x=>x.ruleId===rule.id);assert(rule.sourceIds.every(x=>sid.includes(x))&&rule.fields.length>0&&rule.workPackages.length>0&&matches.length===2&&matches.some(x=>x.expected==="PASS")&&matches.some(x=>x.expected==="REJECT")&&rule.acceptanceIds.every(x=>aid.includes(x)),"追踪断链 "+rule.id)}
for(const c of f.cases)assert((check(c.ruleId,c.input)?"PASS":"REJECT")===c.expected,"校验未通过 "+c.id);
const scenario=JSON.parse(JSON.stringify(f.cases.find(x=>x.ruleId==="FRZ506-R04"&&x.expected==="REJECT").input));
scenario.approvedResolution=true;scenario.mergeMode="MANUAL_APPROVED";assert(check("FRZ506-R04",scenario),"有批准的冲突分支无法识别");
scenario.approvedResolution=false;assert(!check("FRZ506-R04",scenario),"未批准冲突不应通过");
console.log("PLANNING_SYNTHETIC_PASS 8 sources / 10 rules / 20 cases / 2 conflicts; PRODUCT_NOT_RUN");

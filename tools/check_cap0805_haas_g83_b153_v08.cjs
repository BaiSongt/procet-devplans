#!/usr/bin/env node
"use strict";
// B153规划静态校验，不读取机床、不写产品数据；合成PASS不等于产品PASS。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function valid(id,x){const hash=v=>typeof v==="string"&&/^[0-9a-f]{64}$/.test(v);const finite=v=>typeof v==="number"&&Number.isFinite(v);switch(id){
case "R01":return hash(x.ncHash)&&hash(x.d10Hash)&&hash(x.profileHash)&&x.sourceKind==="FINAL_NC";
case "R02":return [x.firstPeck,x.decrement,x.minPeck,x.holeDepth].every(finite)&&x.firstPeck>0&&x.decrement>=0&&x.minPeck>0&&x.minPeck<=x.firstPeck&&x.holeDepth>0;
case "R03":return x.dialect==="HAAS_MILL_G83"&&x.peckMode==="IJK"&&x.hasQ===false&&x.profileAllowsMode===true;
case "R04":return x.currentP===null&&finite(x.priorP)&&x.priorP>=0&&finite(x.effectiveP)&&x.effectiveP===x.priorP&&x.inherited===true;
case "R05":return finite(x.setting52)&&x.setting52>=0&&x.unit==="mm"&&x.settingSource==="D10_PINNED_SETTING"&&x.retractQualification==="OEM_PATH_PENDING";
case "R06":return x.setting22Role==="G73_CHIP_BREAK"&&x.g83UsesS22===false&&x.setting22Evidence==="OFFICIAL_HAAS_SETTING"&&x.dialectScope==="HAAS_MILL";
case "R07":return x.setting57==="ON"&&x.xyStartSemantics==="CONFIG_DEPENDENT"&&x.startEventRecorded===true&&x.safetyClaim==="NOT_CERTIFIED";
case "R08":return x.commitAuth==="CAS_ACL_RECHECK"&&x.cancelFence==="DENY_LATE_ACK"&&x.verificationChain==="D13_D14_D15_INDEPENDENT"&&x.releaseGate==="OEM_AND_HUMAN_PENDING";
default:return false;}}
function pecks(first,decrement,min,total){if(!(first>0&&decrement>=0&&min>0&&min<=first&&total>0&&[first,decrement,min,total].every(Number.isFinite)))return null;let out=[],remain=total;for(let i=0;i<200&&remain>1e-9;i++){let next=Math.min(remain,Math.max(min,first-i*decrement));out.push(Number(next.toFixed(8)));remain-=next;}return remain>1e-9?null:out;}
function golden(g){if(g.kind==="PECK_SEQUENCE")return pecks(g.firstPeck,g.decrement,g.minPeck,g.holeDepth);if(g.kind==="S52_QUALIFICATION")return g.settingPinned&&g.oemRealRun!==true?"OEM_PATH_PENDING":"UNKNOWN";if(g.kind==="SETTING_ROLE")return g.number===22?"G73_CHIP_BREAK":g.number===52?"G83_RETRACT_ABOVE_R":g.number===57?"CYCLE_XY_STOP":"UNKNOWN";return null;}
function equal(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function main(){
 const i=process.argv.indexOf("--root"),root=path.resolve(i>=0?process.argv[i+1]:".");
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
 const t=read("research/traces/CAP-08-05-haas-g83-b153-v08.json"),s=read("research/sources/CAP-08-05-haas-g83-b153.json"),f=read("docs/capabilities/CAP-08-05/haas-g83-b153-fixtures-v08.json");
 assert.equal(t.rules.length,8);assert.equal(s.records.length,6);
 const ids=new Set(s.records.map(x=>x.id)),seen=new Set();
 for(const r of t.rules){assert.equal(r.fields.length,4);r.sourceIds.forEach(x=>assert(ids.has(x),"missing source "+x));
 const cases=f.tests.filter(x=>x.ruleId===r.id);assert.equal(cases.length,5);assert(equal(r.testIds,cases.map(x=>x.id)));
 const pos=cases.find(x=>x.expected==="PASS");assert(pos&&valid(r.id.slice(-3),pos.input),"positive "+r.id);
 for(const neg of cases.filter(x=>x.expected==="FAIL")){
 const changed=r.fields.filter(k=>!equal(pos.input[k],neg.input[k]));
 assert(equal(changed,[neg.mutationField]),"not one-field "+neg.id);assert.equal(valid(r.id.slice(-3),neg.input),false,neg.id);}
 cases.forEach(x=>{assert(!seen.has(x.id));seen.add(x.id)})}
 assert.equal(seen.size,40);assert.equal(f.goldens.length,8);
 for(const g of f.goldens)assert(equal(golden(g),g.expected),g.id);
 process.stdout.write("B153 8正+32独立单字段反+8黄金模型：48/48规划PASS；真实Haas/NC/独立消费者 NOT_RUN\\n");
}
if(require.main===module)main();

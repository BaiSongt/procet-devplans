#!/usr/bin/env node
// B172 只读规划校验；不访问机床或产品仓。
"use strict";
const fs=require("node:fs"),path=require("node:path"),p=process.argv.indexOf("--root"),root=p>=0?process.argv[p+1]:process.cwd();
const load=x=>JSON.parse(fs.readFileSync(path.join(root,x),"utf8"));
const t=load("research/traces/CAP-09-07-servo-envelope-b172-v08.json"),f=load("docs/capabilities/CAP-09-07/servo-envelope-b172-fixtures-v08.json"),s=load("research/sources/CAP-09-07-servo-envelope-b172.json");
const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y),check=(v,msg)=>{if(!v)throw Error("B172 "+msg)};
const calc=g=>{const m=Math.abs(g.bulge),v=4*m/g.duration,a=8*m/g.duration**2;return {midpoint:g.bulge,maxSpeed:v,maxAcceleration:a,status:m>g.positionMax?"REJECT_POSITION":v>g.velocityMax?"REJECT_VELOCITY":a>g.accelerationMax?"REJECT_ACCELERATION":"ANALYTIC_ENVELOPE_ONLY"}};
// 在结构变异检查外，按每条规则独立重新执行适用性判据。
function judge(a,id){
 switch(id){
 case "B172-R01":return ["ncSha","d13Sha","d14Sha","d10FrameHash"].every(k=>a.input?.[k]===f.baseline.input[k]);
 case "B172-R02":return a.machine?.jointId==="J4"&&a.machine?.jointEnvelopeSha===f.baseline.machine.jointEnvelopeSha&&a.machine?.homingKnown===true&&a.machine?.kinematicsRevision==="D03@r9";
 case "B172-R03":return a.motion?.t0===0&&a.motion?.t1===2&&a.motion?.interpolantKind==="QUADRATIC_SYNTHETIC"&&a.motion?.fullSegmentCoverage===true;
 case "B172-R04":return a.limits?.positionMax===1&&a.limits?.velocityMax===2&&a.limits?.accelerationMax===3&&a.limits?.unit==="rad";
 case "B172-R05":return a.feedback?.ferrorSettingKnown===true&&a.feedback?.actualSampleCoverage==="NONE_SYNTHETIC"&&a.feedback?.thresholdIsNotObservedError===true&&a.feedback?.notPromoted===true;
 case "B172-R06":return Object.values(a.decision||{}).length===4&&Object.values(a.decision).every(x=>x===true);
 case "B172-R07":return a.ui?.sameDomainPort===true&&a.ui?.sceneCount===1&&a.ui?.leftTaskPanelCount===1&&a.ui?.showUncertainty===true;
 case "B172-R08":return Object.values(a.tx||{}).length===4&&Object.values(a.tx).every(x=>x===true);
 default:return false;
 }
}
check(t.rules.length===8&&s.records.length===8&&f.cases.length===40&&f.goldens.length===8,"totals");
const src=new Set(s.records.map(x=>x.id)),ids=new Set(f.cases.map(x=>x.id));check(src.size===8&&ids.size===40,"IDs");
let pos=0,neg=0;
for(const rule of t.rules){check(rule.fields.length===4&&rule.sourceIds.every(x=>src.has(x))&&rule.testIds.every(x=>ids.has(x)),"links "+rule.id);
const states=f.cases.filter(x=>x.ruleId===rule.id);check(states.length===5,"cases "+rule.id);
for(const q of states){const diff=rule.fields.filter(x=>{let [head,tail]=x.split(".");return !same(q.state[head][tail],f.baseline[head][tail])});const changed=diff.length;
check(judge(q.state,rule.id)===q.expected,"domain predicate "+q.id);
if(q.kind==="positive"){check(q.expected===true&&changed===0&&q.changedField===null,"pos "+q.id);pos++;}
else{check(q.expected===false&&q.kind==="single_field_negative"&&changed===1&&diff[0]===q.changedField,"neg "+q.id);const fixed=JSON.parse(JSON.stringify(q.state)),[head,tail]=q.changedField.split(".");fixed[head][tail]=f.baseline[head][tail];check(same(fixed,f.baseline),"hidden mutation "+q.id);neg++;}}}
for(const g of f.goldens)check(g.duration>0&&g.realFeedback==="NOT_MEASURED"&&g.release==="FORBIDDEN"&&same(calc(g),g.expected),"golden "+g.id);
check(pos===8&&neg===32,"case count");
console.log(JSON.stringify({status:"PLANNING_PASS_NOT_PRODUCT",positive:pos,negative:neg,golden:f.goldens.length,total:pos+neg+f.goldens.length,realFeedback:"NOT_RUN",realD15:"NOT_RUN"}));

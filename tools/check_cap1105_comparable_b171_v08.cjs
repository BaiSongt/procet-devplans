#!/usr/bin/env node
// B171只读规划门禁；不读取产品仓、用户数据、收费CI。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const idx=process.argv.indexOf("--root"),root=idx>=0?process.argv[idx+1]:process.cwd();
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const t=load("research/traces/CAP-11-05-comparable-b171-v08.json");
const f=load("docs/capabilities/CAP-11-05/comparable-b171-fixtures-v08.json");
const src=load("research/sources/CAP-11-05-comparable-b171.json"),b=f.baseline;
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),hash=c=>"sha256:"+c.repeat(64);
const rank=a=>Array.isArray(a)&&a.length>0&&new Set(a.map(x=>x.id)).size===a.length&&a.every(x=>typeof x.id==="string"&&x.id&&typeof x.minutes==="number"&&Number.isFinite(x.minutes)&&x.minutes>0)?[...a].sort((a,b)=>a.minutes-b.minutes||a.id.localeCompare(b.id,"en"))[0].id:null;
function judge(s,n){switch(n){
case 1:return Object.keys(b.context).every(k=>s.context?.[k]===b.context[k]);
case 2:return !!s.evidence?.locator&&s.evidence.sourceRevision===hash("c")&&s.evidence.scopeAllowed===true&&s.evidence.classification==="ADVISORY_ONLY";
case 3:return Object.keys(b.fit).every(k=>s.fit?.[k]===true);
case 4:return s.compare?.objective==="MIN_ESTIMATED_MINUTES"&&s.compare?.tiePolicy==="LEXICOGRAPHIC_ID"&&rank(s.compare?.candidates)!==null&&rank(s.compare.candidates)===s.compare.selectedId;
case 5:return [s.limits?.rpm,s.limits?.rpmMax,s.limits?.feed,s.limits?.feedMax].every(x=>typeof x==="number"&&Number.isFinite(x)&&x>0)&&s.limits.rpm<=s.limits.rpmMax&&s.limits.feed<=s.limits.feedMax;
case 6:return s.alternative?.alternativeId==="A"&&s.alternative?.sameDenominator===true&&s.alternative?.riskDisclosure==="POWER_UNKNOWN"&&s.alternative?.silentAutoApply===false;
case 7:return s.owner?.expectedRevision==="D05@r7"&&s.owner?.observedRevision===s.owner.expectedRevision&&s.owner.aclCurrent===true&&s.owner.cancelFenceCurrent===true;
case 8:return s.workflow?.sharedDomainPort===true&&s.workflow.sceneCount===1&&s.workflow.leftTaskPanelCount===1&&s.workflow.ncUnknownBlocks===true;
default:return false;}}
const requireCheck=(v,m)=>{if(!v)throw Error("B171 "+m)};
requireCheck(t.rules.length===8&&src.records.length===8&&new Set(src.records.map(s=>s.id)).size===8,"sources");
const ids=new Set(f.cases.map(c=>c.id)),sources=new Set(src.records.map(x=>x.id));
requireCheck(ids.size===40&&f.cases.length===40&&t.rules.reduce((a,r)=>a+r.fields.length,0)===32,"rule/field/case counts");
let pos=0,neg=0,g=0;
for(let i=0;i<8;i++){
 let r=t.rules[i],name="B171-R"+String(i+1).padStart(2,"0");
 requireCheck(r.id===name&&r.fields.length===4&&r.sourceIds.every(id=>sources.has(id))&&r.testIds.length===5&&r.testIds.every(id=>ids.has(id)),"trace "+name);
 const cc=f.cases.filter(c=>c.ruleId===name);requireCheck(cc.length===5,"case links "+name);
 for(const c of cc){
  requireCheck(judge(c.state,i+1)===c.expected,"expected "+c.id);
  const diff=r.fields.filter(k=>!eq(get(b,k),get(c.state,k)));
  if(c.kind==="positive"){requireCheck(c.expected===true&&diff.length===0&&c.changedField===null,"pos "+c.id);pos++;}
  else{
   requireCheck(c.kind==="single_field_negative"&&c.expected===false&&diff.length===1&&diff[0]===c.changedField,"negative "+c.id);
   const restored=JSON.parse(JSON.stringify(c.state)),parts=c.changedField.split(".");let dest=restored;
   for(let k=0;k<parts.length-1;k++)dest=dest[parts[k]];
   dest[parts[parts.length-1]]=get(b,c.changedField);
   requireCheck(eq(restored,b),"hidden mutation "+c.id);neg++;
  }
 }
}
for(const item of f.golden){requireCheck(rank(item.candidates)===item.expectedWinner,"golden "+item.id);requireCheck(item.expectedStatus===(item.expectedWinner===null?"UNKNOWN":"ADVISORY_CANDIDATE_ONLY"),"golden status");g++;}
requireCheck(pos===8&&neg===32&&g===8,"totals");
console.log(JSON.stringify({status:"PLANNING_PASS_NOT_PRODUCT",positive:pos,negative:neg,golden:g,total:48,realProduct:"NOT_RUN"}));


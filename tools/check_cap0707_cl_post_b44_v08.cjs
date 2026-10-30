'use strict';
// B44只读规划校验，严禁用于声称NC/产品/机床通过。
const fs=require('node:fs'),path=require('node:path');
function length3(v){return Math.sqrt(v.reduce((s,x)=>s+x*x,0))}
function determinant(m){return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0])}
function judge(x,rules){
 for(const r of rules){
  for(const field of r.f)if(JSON.stringify(x[field[0]])!==JSON.stringify(field[1]))return {code:field[2],rule:"B44-"+r.r};
  if(r.r==="R2"){
   const m=x["frame.R"];
   if(!Array.isArray(m)||m.length!==3||!m.every(v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite)))return {code:"REJECT",rule:"B44-R2"};
   const nonunit=m.some(row=>Math.abs(length3(row)-1)>1e-9);
   const nonorth=m.some((row,i)=>m.some((other,j)=>i!==j&&Math.abs(row.reduce((s,z,k)=>s+z*other[k],0))>1e-9));
   if(Math.abs(determinant(m)-1)>1e-9||nonunit||nonorth)return {code:"REJECT",rule:"B44-R2"};
  }
  if(r.r==="R3"){const a=x["axis.vector"];if(!Array.isArray(a)||a.length!==3||!a.every(Number.isFinite)||Math.abs(length3(a)-1)>1e-9)return {code:"REJECT",rule:"B44-R3"}}
  if(r.r==="R5"){const axes=x["segment.axes"];if(!Array.isArray(axes)||axes.length!==2||!axes.every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite)&&Math.abs(length3(a)-1)<1e-9)||axes[0].some((v,i)=>Math.abs(v-axes[1][i])>1e-9))return {code:"REJECT",rule:"B44-R5"}}
  if(r.r==="R6"){const secs=x["feed.nominalSeconds"];if(!Number.isFinite(secs)||Math.abs(secs-60*x["feed.distance"]/x["feed.rate"])>1e-8)return {code:"REJECT",rule:"B44-R6"}}
 }
 return {code:"PLANNING_ONLY",rule:"ALL"};
}
function run(root=path.join(__dirname,'..')){
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=load("research/sources/CAP-07-07-cl-post-b44.json"),tr=load("research/traces/CAP-07-07-cl-post-b44-v08.json"),fx=load("docs/capabilities/CAP-07-07/cl-post-b44-fixtures-v08.json");
const srcIds=new Set(src.sources.map(s=>s.id)),ids=new Map(fx.cases.map(c=>[c.id,c]));
if(!fx.syntheticOnly||src.sources.length!==6||srcIds.size!==6||tr.rules.length!==8||ids.size!==fx.cases.length)throw Error('计数或ID重复');
const rules=tr.rules.map(r=>({r:r.id.slice(4),f:r.fields.filter(k=>!['frame.R','axis.vector','segment.axes','feed.nominalSeconds'].includes(k)).map(k=>[k,fx.baseline[k],fx.cases.find(c=>c.ruleId===r.id&&c.changedField===k)?.expected||'REJECT'])}));
for(const r of tr.rules){if(!r.sourceIds.length||!r.sourceIds.every(s=>srcIds.has(s))||!r.fields.every(k=>Object.hasOwn(fx.baseline,k))||!r.capabilityIds.includes('CAP-07-07')||!r.workPackageIds.includes('E3-01')||!r.positiveIds.length||!r.negativeIds.length)throw Error('追踪链缺失 '+r.id);for(const [k,kind] of [['positiveIds','positive'],['negativeIds','negative'],['unknownIds','unknown']])if(!r[k].every(id=>ids.has(id)&&ids.get(id).kind===kind))throw Error('验收映射无效 '+r.id)}
const n={positive:0,negative:0,unknown:0};for(const c of fx.cases){if(c.kind!=='positive'&&(Object.keys(c.patch).length!==1||Object.keys(c.patch)[0]!==c.changedField))throw Error('多字段变异 '+c.id);const y=judge({...fx.baseline,...c.patch},rules);if(y.code!==c.expected||(c.ruleId!=='ALL'&&y.rule!==c.ruleId))throw Error('资格判断失败 '+c.id+':'+JSON.stringify(y));n[c.kind]++}
for(const k of Object.keys(n))if(n[k]!==fx[k+'Count'])throw Error('计数不同 '+k);return {status:'PLANNING_SYNTHETIC_PASS',counts:n,total:fx.cases.length,realNC:'NOT_RUN',independentConsumers:'NOT_RUN'};}
if(require.main===module){try{console.log(JSON.stringify(run()))}catch(e){console.error(e.stack||e.message);process.exitCode=1}}
module.exports={run,judge};

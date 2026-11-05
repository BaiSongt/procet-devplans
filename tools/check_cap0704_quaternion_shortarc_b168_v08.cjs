// B168 只读规划合成测试。结果绝不等价于OCCT/真实NC/五轴机床验收。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const fx=read('docs/capabilities/CAP-07-04/quaternion-shortarc-b168-fixtures-v08.json');
const tr=read('research/traces/CAP-07-04-quaternion-shortarc-b168-v08.json');
const sources=read('research/sources/CAP-07-04-quaternion-shortarc-b168.json');
const B=fx.baseline,eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function validQ(q){return Array.isArray(q)&&q.length===4&&q.every(Number.isFinite)&&Math.abs(Math.hypot(...q)-1)<1e-10;}
function dot(a,b){return a.reduce((s,x,i)=>s+x*b[i],0);}
function angle(a,b){if(!validQ(a)||!validQ(b))return NaN;return 360/Math.PI*Math.acos(Math.min(1,Math.abs(dot(a,b))));}
function slerp(a,b,t){if(!validQ(a)||!validQ(b)||!Number.isFinite(t)||t<0||t>1)return null;
const d=dot(a,b),bb=d<0?b.map(x=>-x):b,c=Math.min(1,Math.abs(d));let out;
if(c>.999999999){out=a.map((x,i)=>x*(1-t)+bb[i]*t);}else{const th=Math.acos(c),sn=Math.sin(th);out=a.map((x,i)=>x*Math.sin((1-t)*th)/sn+bb[i]*Math.sin(t*th)/sn);}
const n=Math.hypot(...out);return n>1e-10?out.map(x=>x/n):null;}
function compareQ(a,b){return validQ(a)&&validQ(b)&&Math.min(Math.hypot(...a.map((x,i)=>x-b[i])),Math.hypot(...a.map((x,i)=>x+b[i])))<1e-8;}
function near(a,b){return Number.isFinite(a)&&Math.abs(a-b)<1e-7;}
function judge(r,rec){if(!r.fields.every(f=>eq(B[f],rec[f])))return false;
switch(r.id){
case 'B168-R01':return validQ(rec['q.start'])&&validQ(rec['q.end'])&&rec['q.layout']==='XYZW'&&rec['q.unitNormChecked']===true;
case 'B168-R02':return rec['hemisphere.aligned']===true&&near(rec['hemisphere.dot'],-1)&&rec['hemisphere.equalSO3']===true&&near(rec['hemisphere.shortArcDeg'],angle(B['q.start'],[0,0,0,-1]));
case 'B168-R03':{const mid=slerp(B['q.start'],B['q.end'],rec['slerp.t']);return !!mid&&compareQ(mid,rec['slerp.midQuat'])&&near(rec['slerp.midAngleDeg'],angle(B['q.start'],mid))&&rec['slerp.shortArc']===true;}
case 'B168-R04':return rec['sampling.maxDeg']>0&&near(rec['sampling.angleDeg'],angle(B['q.start'],B['q.end']))&&rec['sampling.steps']===Math.ceil(rec['sampling.angleDeg']/rec['sampling.maxDeg'])&&rec['sampling.notCertified']===true;
default:return true;
}}
function calculate(g){if(g.kind==='angle')return angle(g.start,g.end);if(g.kind==='slerpAngle'){const mid=slerp(g.start,g.end,g.t);return mid?angle(g.start,mid):NaN;}if(g.kind==='samplingCount')return Math.ceil(g.angleDeg/g.budgetDeg);throw Error('未知Golden');}
if(sources.records.length!==7||tr.rules.length!==8||fx.cases.length!==40||fx.goldens.length!==8)throw Error('数量不符');
const ids=new Set(sources.records.map(x=>x.id)),caseIds=new Set(fx.cases.map(x=>x.id)),seen=new Set();
for(const rule of tr.rules)if(rule.fields.length!==4||rule.sourceIds.some(x=>!ids.has(x))||rule.testIds.some(x=>!caseIds.has(x)))throw Error('追踪关系断链');
let passed=0;for(const c of fx.cases){const rule=tr.rules.find(x=>x.id===c.ruleId);if(!rule)throw Error('缺失规则');
const rec={...B,...c.patch},actual=judge(rule,rec)?'REVIEW_ONLY':'REJECT';if(actual!==c.expected)throw Error(c.id+': '+actual);
const delta=Object.keys(B).filter(k=>!eq(B[k],rec[k]));
if(c.kind==='POSITIVE'&&delta.length||c.kind==='ONE_FIELD_NEGATIVE'&&(delta.length!==1||delta[0]!==c.changedField))throw Error('非单字段反例 '+c.id);
if(seen.has(c.id))throw Error('重复 '+c.id);seen.add(c.id);passed++;
}
for(const g of fx.goldens){if(!near(calculate(g),g.expected))throw Error('Golden: '+g.id+' '+calculate(g));passed++;}
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_ONLY',passed,product:'NOT_RUN',consumer:'NOT_RUN'}));

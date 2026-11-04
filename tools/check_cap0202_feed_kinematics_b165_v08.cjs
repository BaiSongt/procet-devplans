#!/usr/bin/env node
'use strict';
/** B165 周刃铣削单位公式与字段级独立反例只读验证；不写产品数据。 */
const fs=require('node:fs');const path=require('node:path');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/capabilities/CAP-02-02/feed-kinematics-b165-fixtures-v08.json'),'utf8'));
function near(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b));}
function check(id,x){
switch(id){
case 'B165-R01':return !!x['tool.ref']&&/^r\d+$/.test(x['tool.revision']||'')&&/^[a-f0-9]{40,64}$/i.test(x['tool.sha']||'')&&x['tool.diameterMeaning']==='D_EFFECTIVE_AT_AP';
case 'B165-R02':return x['formula.vcMpm']>0&&x['formula.diameterMm']>0&&x['formula.units']==='VC_M_PER_MIN_D_MM'&&near(x['formula.rpm'],1000*x['formula.vcMpm']/(Math.PI*x['formula.diameterMm']));
case 'B165-R03':return x['feed.fzMmPerTooth']>0&&Number.isSafeInteger(x['feed.effectiveTeeth'])&&x['feed.effectiveTeeth']>0&&x['feed.spindleRpm']>0&&near(x['feed.vfMmPerMin'],x['feed.fzMmPerTooth']*x['feed.effectiveTeeth']*x['feed.spindleRpm']);
case 'B165-R04':return x['limit.maxRpm']>0&&x['limit.requestedRpm']>0&&x['limit.userConfirmed']===true&&near(x['limit.approvedRpm'],Math.min(x['limit.maxRpm'],x['limit.requestedRpm']))&&near(x['feed.spindleRpm'],x['limit.approvedRpm']);
case 'B165-R05':return x['mode.feedUnit']==='MM_PER_MIN'&&x['mode.dialectPinned']===true&&x['mode.d10Exact']===true&&x['mode.noImplicitG95']===true;
case 'B165-R06':return !!x['provenance.source']&&!!x['provenance.materialCondition']&&x['provenance.evidenceGrade']==='CATALOG_FORMULA_ONLY'&&x['provenance.noAutoApproval']===true;
case 'B165-R07':return x['owner.port']==='Resources.CuttingParameterPort'&&x['owner.expectedRevision']===x['tool.revision']&&x['owner.scopeFrameFresh']===true&&x['owner.cancelFencePassed']===true;
case 'B165-R08':return x['handoff.sameOwnerPort']===true&&x['handoff.singleBabylonLeftPanel']===true&&x['handoff.ncChainIndependent']===true&&x['handoff.frozenRevisionsUnchanged']===true;
default:throw Error('未知规则：'+id);
}}
const expectedKinds={RPM:1,TABLE_FEED:1,ACHIEVED_VC:1,DRILL_FEED:1};
function calc(g){switch(g.kind){case 'RPM':return 1000*g.input.vc/(Math.PI*g.input.diameter);case 'TABLE_FEED':return g.input.fz*g.input.teeth*g.input.rpm;case 'ACHIEVED_VC':return Math.PI*g.input.diameter*g.input.rpm/1000;case 'DRILL_FEED':return g.input.fn*g.input.rpm;default:throw Error('未知Golden类别')}}
let ok=0;const ids=new Set();
for(const c of data.cases){if(ids.has(c.id))throw Error('重复case');ids.add(c.id);const actual=check(c.ruleId,c.record)?'REVIEW_CANDIDATE_ONLY':'REJECT';if(actual!==c.expected)throw Error('验收失败 '+c.id);const delta=Object.keys(data.baseline).filter(k=>data.baseline[k]!==c.record[k]);if(c.kind==='ONE_FIELD_NEGATIVE'&&(delta.length!==1||delta[0]!==c.changedField))throw Error('非单字段变异 '+c.id);if(c.kind==='POSITIVE'&&delta.length!==0)throw Error('正例被修改 '+c.id);ok++}
for(const g of data.goldens){if(!expectedKinds[g.kind]||!near(calc(g),g.expected))throw Error('Golden错误 '+g.id);ok++}
if(data.cases.length!==40||data.goldens.length!==8)throw Error('不完整Fixture');
console.log('B165规划合成: '+ok+'/48 PASS；NC/机床/真实Owner和消费者 NOT_RUN；规划PASS≠产品PASS');

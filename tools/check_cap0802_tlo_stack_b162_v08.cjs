'use strict';
// B162：独立Node只读规划门禁；只检查合成DTO/金样状态，不执行真实NC或机床运动。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=read("research/sources/CAP-08-02-tlo-stack-b162.json"),trace=read("research/traces/CAP-08-02-tlo-stack-b162-v08.json"),fx=read("docs/capabilities/CAP-08-02/tlo-stack-b162-fixtures-v08.json");
function test(rec){return Object.entries(fx.fieldSpecs).every(([key,values])=>Object.hasOwn(rec,key)&&rec[key]===values[0])?'PASS':'REJECT';}
function model(action,p){
 switch(action){
 case 'G43_M6':return p.H===p.loadedTool&&p.changerMode==='NONRANDOM'&&Number.isFinite(p.hValue)?'TLO_'+p.hValue+'_NO_MOTION':'UNKNOWN_TOOL_SELECTION';
 case 'G431_REPLACE':return p.motionSameBlock?'REJECT_SAME_BLOCK_MOTION':'TLO_'+p.replacement+'_NO_MOTION';
 case 'G432_ADD':return p.hasH===p.hasAxes?'REJECT_EXCLUSIVE_ARGS':'TLO_'+Number((p.before+p.addition).toFixed(5))+'_NO_MOTION';
 case 'G49_CANCEL':return 'TLO_ZERO_NO_MOTION';
 case 'G53_MOVE':return !['G0','G1'].includes(p.gMode)?'REJECT_INVALID_MOTION':p.cutterComp?'REJECT_CUTTER_COMP':'MACHINE_COORD_THIS_BLOCK_ONLY';
 case 'G43_H0':return p.changerMode==='UNKNOWN'?'UNKNOWN_TOOL_SELECTION':'REQUIRES_TABLE_LOOKUP';
 case 'HAAS_NGC_AUTOTLO':return p.firmware==='UNKNOWN'?'UNKNOWN_FIRMWARE_SEMANTICS':'REQUIRES_VERIFIED_OPTION_PROFILE';
 default:return 'UNKNOWN_ACTION';
 }
}
const errs=[],ids=new Set(),sourceIds=new Set(src.records.map(x=>x.id));
if(src.records.length!==7||trace.rules.length!==8||Object.keys(fx.fieldSpecs).length!==32||fx.cases.length!==40||fx.goldens.length!==8)errs.push('数量门禁');
for(const r of trace.rules){
 if(r.fields.length!==4||r.originalWorkPackages.join(',')!=='E3-02,E3-03,U4-04')errs.push(r.id+':字段或原编号工作包');
 for(const s of r.sourceIds)if(!sourceIds.has(s))errs.push(r.id+':来源缺失'+s);
 const c=fx.cases.filter(x=>x.ruleId===r.id);
 if(c.length!==5||c.filter(x=>x.kind==='positive').length!==1||c.filter(x=>x.kind==='single_field_negative').length!==4)errs.push(r.id+':对照数');
 for(const x of c){
  if(ids.has(x.id))errs.push('重复ID'+x.id);ids.add(x.id);
  const changed=Object.keys(x.mutations),rec={...fx.baseline,...x.mutations};
  if(!r.testIds.includes(x.id)||test(rec)!==x.expected)errs.push(x.id+':结果');
  if(x.kind==='positive'&&changed.length)errs.push(x.id+':正样本非基线');
  if(x.kind==='single_field_negative'&&(changed.length!==1||changed[0]!==x.mutatedField||!r.fields.includes(x.mutatedField)||x.mutations[x.mutatedField]!==fx.fieldSpecs[x.mutatedField][1]))errs.push(x.id+':变异不唯一');
 }
}
for(const g of fx.goldens)if(model(g.action,g.input)!==g.expected)errs.push('Golden '+g.id);
if(model('G431_REPLACE',{before:120,replacement:12.5,motionSameBlock:true})!=='REJECT_SAME_BLOCK_MOTION')errs.push('变异未拦截');
if(model('G432_ADD',{before:120,addition:1,hasH:true,hasAxes:true})!=='REJECT_EXCLUSIVE_ARGS')errs.push('参数冲突未拦截');
if(errs.length){console.error(errs);process.exit(1);}
console.log('B162 PLANNING_SYNTHETIC PASS: 8正+32独立单字段反+8状态Golden；真实D13/Haas/LinuxCNC/Owner/D15 NOT_RUN');

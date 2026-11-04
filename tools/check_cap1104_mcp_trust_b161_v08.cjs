'use strict';
// B161：Agent/MCP工具可信元数据专项。只读规划Fixture，不发起网络请求、不修改工程资产。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const trace=read("research/traces/CAP-11-04-mcp-trust-b161-v08.json"),sources=read("research/sources/CAP-11-04-mcp-trust-b161.json"),fx=read("docs/capabilities/CAP-11-04/mcp-trust-b161-fixtures-v08.json");
const errors=[],known=new Set(sources.records.map(x=>x.id)),unique=new Set();
function verdict(rec){
 for(const [field,options] of Object.entries(fx.fieldSpecs)){
   if(!Object.prototype.hasOwnProperty.call(rec,field)||rec[field]===null)return'UNKNOWN';
   if(rec[field]!==options[0])return'REJECT';
 }
 return'PASS';
}
function golden(v){
 if(!v.authAudienceValid)return'TOKEN_REJECT';
 if(v.cancelled)return'LATE_RECEIPT_DISCARD';
 if(!v.ownerApproved)return'BLOCK_OWNER_APPROVAL';
 if(!v.annotationTrusted)return'HINT_UNTRUSTED';
 if(!v.ncProof)return'ENGINEERING_UNKNOWN';
 return'PLANNING_ONLY';
}
if(sources.records.length!==6||trace.rules.length!==8||Object.keys(fx.fieldSpecs).length!==32||fx.cases.length!==40||fx.goldens.length!==8)errors.push('数量门禁失败');
for(const rule of trace.rules){
 if(rule.fields.length!==4||!rule.originalWorkPackages.includes('T5-01'))errors.push(rule.id+':原编号包/字段');
 for(const source of rule.sourceIds)if(!known.has(source))errors.push(rule.id+':来源未登记 '+source);
 const per=fx.cases.filter(x=>x.ruleId===rule.id);
 if(per.length!==5||per.filter(x=>x.kind==='positive').length!==1||per.filter(x=>x.kind==='single_field_negative').length!==4)errors.push(rule.id+':正反对数');
 for(const row of per){
  if(unique.has(row.id))errors.push('重复用例 '+row.id);unique.add(row.id);
  if(!rule.testIds.includes(row.id)||verdict(row.record)!==row.expected)errors.push('不符合预期 '+row.id);
  const diff=Object.keys(fx.baseline).filter(k=>row.record[k]!==fx.baseline[k]);
  if(row.kind==='single_field_negative'&&(diff.length!==1||diff[0]!==row.mutatedField||!rule.fields.includes(row.mutatedField)))errors.push('非单字段负例 '+row.id);
  if(row.kind==='positive'&&diff.length)errors.push('正例变更 '+row.id);
 }
}
for(const x of fx.goldens)if(golden(x.input)!==x.expected)errors.push('Golden不符合 '+x.id);
if(verdict({...fx.baseline,'token.resourceAudience':'bad'})!=='REJECT')errors.push('token突变未拒绝');
if(verdict({...fx.baseline,'result.embeddedInstructionDisposition':'EXECUTE_AS_TOOL_COMMAND'})!=='REJECT')errors.push('注入突变未拒绝');
if(errors.length){console.error(JSON.stringify(errors));process.exit(1);}
console.log('B161 PLANNING_SYNTHETIC PASS: 8正+32独立单字段反+8状态Golden=48；实际MCP/Owner/NC/消费者NOT_RUN');

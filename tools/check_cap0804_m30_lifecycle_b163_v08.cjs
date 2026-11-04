'use strict';
// B163：规划合成门禁，不执行真实控制器、机床或生产数据库。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=read('research/sources/CAP-08-04-m30-lifecycle-b163.json'),tr=read('research/traces/CAP-08-04-m30-lifecycle-b163-v08.json'),f=read('docs/capabilities/CAP-08-04/m30-lifecycle-b163-fixtures-v08.json');
const ids=new Set(src.records.map(x=>x.id)),cases=new Set(),errs=[];let pos=0,neg=0;
assert.equal(src.records.length,6);assert.equal(tr.rules.length,8);assert.equal(Object.keys(f.fieldSpecs).length,32);
const judge=d=>Object.entries(f.fieldSpecs).every(([k,v])=>Object.hasOwn(d,k)&&Object.is(d[k],v[0]))?'PASS':'REJECT';
for(const c of f.cases){
 if(cases.has(c.id))errs.push('duplicate:'+c.id);cases.add(c.id);
 if(c.kind==='positive'){pos++;if(c.changedField!==null)errs.push(c.id+':unexpected-change');}
 else if(c.kind==='single_field_negative'){
 neg++;const diff=Object.keys(f.baseline).filter(k=>!Object.is(f.baseline[k],c.record[k]));
 if(diff.length!==1||diff[0]!==c.changedField)errs.push(c.id+':not-single-field');
 }else errs.push(c.id+':unknown-kind');
 if(judge(c.record)!==c.expected)errs.push(c.id+':mismatched-expected');
}
for(const r of tr.rules){
 if(r.fields.length!==4||r.fields.some(x=>!Object.hasOwn(f.fieldSpecs,x)))errs.push(r.id+':field');
 if(r.sourceIds.some(x=>!ids.has(x)))errs.push(r.id+':missing-source');
 if(r.testIds.length!==5||r.testIds.some(x=>!cases.has(x)))errs.push(r.id+':missing-test');
}
function st(a,v){if(a==='M0')return'PAUSED_REQUIRED_AUTO';if(a==='M1')return v.optionalStopEnabled?'PAUSED_OPTIONAL_AUTO':'CONTINUE_NEXT_BLOCK';if(a==='M2')return'TERMINATED_RESTART_BEGIN';if(a==='M30')return v.controller==='LINUXCNC_2_9'?'TERMINATED_RESET_DOCUMENTED_MODAL':v.controller==='HAAS_VERIFIED_NEWER'?'TERMINATED_TLO_RETAINED_VERSIONED':'UNKNOWN_CONTROLLER_END_MODAL';if(a==='AFTER_END')return'UNREACHABLE_BLOCK';return'UNKNOWN'}
for(const g of f.golden)if(st(g.action,g.input)!==g.expected)errs.push(g.id+':golden');
assert.equal(pos,8);assert.equal(neg,32);assert.equal(f.golden.length,8);assert.deepEqual(errs,[]);
console.log('B163 规划合成：8正/32独立单字段反例/8简化状态Golden全部符合预期；真实NC/机床/Owner/消费者未验');

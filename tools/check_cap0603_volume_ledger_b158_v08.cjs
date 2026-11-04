'use strict';
// D07规划判据：纯只读Node工具，未调用OCCT/机床，勿当产品PASS。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-06-03/volume-ledger-b158-fixtures-v08.json'),'utf8'));
const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-06-03-volume-ledger-b158-v08.json'),'utf8'));
const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-06-03-volume-ledger-b158.json'),'utf8'));
function check(a){for(const k in f.fieldSpecs)if(a[k]===undefined||a[k]===null)return'UNKNOWN';if(!(a.adaptiveEps>0&&a.adaptiveEps<=.001&&a.relativeEstimate>=0&&a.absoluteBudgetMm3>0&&a.ledgerToleranceMm3>=0))return'REJECT';if(a.volumeRemovedMm3>a.volumeBeforeMm3||Math.abs(a.volumeBeforeMm3-a.volumeRemovedMm3-a.volumeAfterMm3)>Math.min(a.ledgerToleranceMm3,a.absoluteBudgetMm3)+1e-9)return'REJECT';for(const [k,[v]]of Object.entries(f.fieldSpecs))if(!['adaptiveEps','relativeEstimate','absoluteBudgetMm3','ledgerToleranceMm3','volumeBeforeMm3','volumeRemovedMm3','volumeAfterMm3'].includes(k)&&a[k]!==v)return'REJECT';return'PASS';}
function golden(r){if(r.oracle!=='INDEPENDENT_SOLID_INTERSECTION'||r.tolerance==null)return'UNKNOWN';if(r.before<0||r.removed<0||r.after<0||r.removed>r.before||r.tolerance<0||r.protected>0)return'REJECT';return Math.abs(r.before-r.removed-r.after)<=r.tolerance+1e-10?'PASS':'REJECT';}
const err=[],ids=new Set(),sources=new Set(s.records.map(x=>x.id));
if(t.rules.length!==10||s.records.length!==5||Object.keys(f.fieldSpecs).length!==40)err.push('计数');
for(const r of t.rules){if(r.fields.length!==4||r.originalWorkPackages.join()!=='F1-05,W2-02,W2-03,W2-06')err.push(r.id+':字段/原包');for(const id of r.sourceIds)if(!sources.has(id))err.push(r.id+':来源');for(const id of r.testIds)if(!f.cases.some(c=>c.id===id))err.push(r.id+':验收');}
for(const c of f.cases){if(ids.has(c.id))err.push(c.id+':重复');ids.add(c.id);if(check(c.record)!==c.expected)err.push(c.id+':判据');if(c.kind==='single_field_negative'){const changed=Object.keys(f.fieldSpecs).filter(k=>c.record[k]!==f.fieldSpecs[k][0]);if(changed.length!==1||changed[0]!==c.mutatedField||!t.rules.find(r=>r.id===c.ruleId)?.fields.includes(c.mutatedField))err.push(c.id+':不是单字段变异');}}
for(const g of f.goldens)if(golden(g.record)!==g.expected)err.push(g.id+':算式');
if(f.cases.length!==50||f.goldens.length!==8)err.push('验收数量');
console.log(JSON.stringify({status:err.length?'FAIL':'PASS_SYNTHETIC_ONLY',positive:10,independentNegatives:40,goldens:8,errors:err,realOCCT:'NOT_RUN'},null,2));process.exitCode=err.length?1:0;

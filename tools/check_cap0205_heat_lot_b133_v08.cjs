// B133 新增炉批+材料硬度证据门禁：合成规划验证，不是材料检验或NC产品许可。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=read("research/sources/CAP-02-05-heat-lot-b133.json"),tr=read("research/traces/CAP-02-05-heat-lot-b133-v08.json"),fx=read("docs/capabilities/CAP-02-05/heat-lot-b133-fixtures-v08.json");
function judge(a){
 const s=x=>typeof x==="string"&&x.length>0;
 if(!s(a.lot.heatId)||!s(a.lot.receiptId)||!s(a.lot.documentSha))return "UNKNOWN";
 if(!a.lot.matchedStock)return "REJECT";
 if(!s(a.document.standard))return "UNKNOWN";
 if(a.document.productKind!=="STEEL")return "UNKNOWN";
 if(!a.document.orderScopeMatched)return "REJECT";
 if(!a.document.issuerAccountable)return "UNKNOWN";
 if(!s(a.identity.materialRevision)||!s(a.identity.materialHash)||!s(a.identity.setupRevision)||!s(a.identity.frame))return "UNKNOWN";
 if(!s(a.test.method)||!s(a.test.condition))return "UNKNOWN";
 if(a.test.method!=="ISO6508-1:2023"||a.test.scale!=="HRC")return "REJECT";
 if(!Number.isFinite(a.test.value)||a.test.value<0)return "REJECT";
 if(a.conversion.automaticCrossScale||a.conversion.replacesMeasuredValue||a.conversion.tensileCertifiedFromConversion||a.conversion.cuttingApprovedByConversion)return "REJECT";
 if(!s(a.provenance.issuer)||!s(a.provenance.documentDigest)||!s(a.provenance.locator)||!s(a.provenance.lineageRef))return "UNKNOWN";
 if(a.owner.materialPort!=="MaterialCatalogPort"||!a.owner.d17Separate||!a.owner.d10Separate)return "REJECT";
 if(!a.owner.d04Pinned)return "UNKNOWN";
 if(!a.transaction.cas||a.transaction.cancelled||a.transaction.lateAckMutation)return "STALE";
 if(!a.transaction.acl)return "REJECT";
 if(a.ui.worlds!==1||a.ui.panel!=="UnifiedTaskPanel:left"||a.ui.entry!=="GUI|CLI|Agent"||a.ui.previewWrites)return "REJECT";
 return "PLANNING_CANDIDATE_NOT_PRODUCT_PASS";
}
assert.equal(src.records.length,8);assert.equal(tr.rules.length,9);assert.equal(fx.tests.length,45);assert.equal(fx.goldens.length,4);
const ss=new Set(src.records.map(x=>x.id)),ts=new Set(fx.tests.map(x=>x.id));
for(const rule of tr.rules){assert.equal(rule.fields.length,4);assert.equal(rule.tests.length,5);for(const id of rule.sourceIds)assert.ok(ss.has(id),id);for(const id of rule.tests)assert.ok(ts.has(id),id);}
let pass=0,fail=0;
for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);if(t.kind==="positive"){assert.equal(t.changedField,null);pass++;}else{assert.notEqual(t.expect,"PLANNING_CANDIDATE_NOT_PRODUCT_PASS",t.id);const diff=[];for(const group in fx.baseline){for(const key in fx.baseline[group]){if(JSON.stringify(fx.baseline[group][key])!==JSON.stringify(t.input[group][key]))diff.push(group+"."+key);}}assert.deepEqual(diff,[t.changedField],t.id);fail++;}}
assert.equal(pass,9);assert.equal(fail,36);
for(const g of fx.goldens)assert.equal(g.input[0]!==g.input[1],g.expectedDifferent,g.name);
console.log(JSON.stringify({status:"PLANNING_SYNTHETIC_ONLY",positive:pass,negative:fail,goldens:4,independentMaterialLotValidation:"NOT_RUN",actualD17Consumer:"NOT_RUN",product:"NOT_RUN"}));

#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function validate(x){
const errors=new Set(); const flag=(bad,code)=>{if(bad)errors.add(code)};
const refs=[x.refs.stock,x.refs.candidate,x.refs.result],identity=x.refs.stock;
flag(refs.some(r=>!r.id||!r.revision||!/^sha256:[a-f0-9]{64}$/.test(r.sha)||!r.frame||!r.unit||!r.scope),"SOURCE_IDENTITY");
flag(refs.some(r=>r.frame!==identity.frame||r.unit!==identity.unit||r.scope!==identity.scope),"FRAME_SCOPE_MISMATCH");
flag(x.refs.result.sha===x.refs.stock.sha||x.refs.result.revision===x.refs.stock.revision,"RESULT_REVISION_REUSE");
const op=x.operator;
flag(op.version!=="OCCT-8.0.1"||op.kind!=="CUT"||!op.nonDestructive,"BOOLEAN_OPERATOR");
flag(!op.fillHistory||!op.hasHistory,"HISTORY_DISABLED");
flag(op.hasErrors||!op.warningsReviewed||(op.hasWarnings&&!op.warningsReviewed),"BOOLEAN_REPORT");
flag(!Number.isFinite(op.fuzzy)||op.fuzzy<0||!Number.isFinite(op.approvedMaxFuzzy)||op.approvedMaxFuzzy<=0||op.fuzzy>op.approvedMaxFuzzy,"FUZZY_BUDGET");
flag(op.simplificationUsed&&!op.simplificationHistoryMerged,"SIMPLIFICATION_HISTORY");
const h=x.history, req=h.requestedInputUids,rows=h.origins,seen=rows.map(r=>r.uid);
flag(new Set(req).size!==req.length||new Set(seen).size!==seen.length||req.length!==seen.length||req.some(id=>!seen.includes(id)),"HISTORY_INPUT_COVERAGE");
flag(new Set(h.outputUids).size!==h.outputUids.length,"HISTORY_OUTPUT_DUPLICATE");
for(const r of rows){
 flag(r.deleted&&r.modified.length>0,"DELETED_MODIFIED_CONFLICT");
 flag(r.modified.some(y=>!h.outputUids.includes(y))||r.generated.some(y=>!h.outputUids.includes(y.uid)),"HISTORY_OUTPUT_UNRESOLVED");
 flag(r.generated.some(y=>!(r.kind==="FACE"&&["EDGE","VERTEX"].includes(y.kind))&&!(r.kind==="EDGE"&&y.kind==="VERTEX")),"GENERATED_KIND_INVALID");
}
const a=x.audit,vol=a.volume;
flag(!a.beforeValid||!a.afterValid||!a.geomControls||!a.exactMethod||!a.solidClosed,"BREP_CHECK_INCOMPLETE");
flag([vol.before,vol.removed,vol.after,vol.absTolerance].some(n=>!Number.isFinite(n))||vol.before<0||vol.removed<0||vol.after<0||vol.absTolerance<=0||Math.abs(vol.before-vol.removed-vol.after)>vol.absTolerance,"VOLUME_LEDGER");
flag(a.protectedIntersection!==0,"PROTECTION_INTERSECTION");
const c=x.command;
flag(c.owner!=="LocalBRepRemovalDomainPort"||[...c.routes].sort().join("|")!=="Agent|CLI|GUI","OWNER_ENTRYPOINT");
flag(!c.casRechecked||!c.aclRechecked||!(c.scopeEpoch>0)||!(c.jobGeneration>0)||c.headStale,"COMMIT_LEASE");
flag(c.cancelled||c.lateReceipt,"CANCEL_LATE_RECEIPT");
const d=x.handoff;
flag(d.status!=="CANDIDATE_ONLY"||d.independentD07!=="NOT_RUN"||!d.d08FrozenUnchanged,"D07_CONSUMER_UNVERIFIED");
flag(!d.d04SeparateFromD10||d.chain!=="D09>D12>D13>D14>D15>D16"||d.d13!=="UNKNOWN"||d.d15!=="BLOCKED"||d.d16!=="BLOCKED"||!d.noMaterialSweep,"NC_VERIFICATION_BOUNDARY");
flag(!d.singleBabylon||!d.leftTaskPanel,"GUI_WORLD_BOUNDARY");
return [...errors];
}
const clone=x=>JSON.parse(JSON.stringify(x));
const set=(x,p,v)=>{const a=p.split('.');let t=x;for(let i=0;i<a.length-1;i++)t=t[a[i]];t[a[a.length-1]]=v};
const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-06-03/brep-history-b23-fixtures-v08.json'),'utf8'));
const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-06-03-brep-history-b23-v08.json'),'utf8'));
const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-06-03-brep-history-b23.json'),'utf8'));
const fail=[];
if(validate(f.positive.input).length)fail.push('positive:'+validate(f.positive.input));
for(const n of f.negative){let x=clone(f.positive.input);set(x,n.path,n.value);if(!validate(x).includes(n.code))fail.push(n.id)}
const ids=new Set(s.sources.map(x=>x.id)),caseIds=new Set([f.positive.id,...f.negative.map(x=>x.id)]);
for(const r of t.rules){if(r.sourceIds.some(i=>!ids.has(i))||r.positiveIds.some(i=>!caseIds.has(i))||!r.negativeIds.length||r.negativeIds.some(i=>!caseIds.has(i)||!f.negative.some(n=>n.id===i&&n.rule===r.id))||!r.fields.length||!r.primaryPackage)fail.push('trace:'+r.id)}
if(t.rules.length!==7||f.negative.length!==40||s.sources.length!==7)fail.push('counts');
console.log(JSON.stringify({status:fail.length?'FAIL':'PASS',positive:1,negative:f.negative.length,rules:t.rules.length,fail,realOcct:'NOT_RUN',independentConsumer:'NOT_RUN',product:'NOT_RUN'},null,2));
if(fail.length)process.exitCode=1;

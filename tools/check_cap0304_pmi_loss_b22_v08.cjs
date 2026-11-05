#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const clone=x=>JSON.parse(JSON.stringify(x));
const set=function set(x,p,v){let t=x,a=p.split('.');for(let i=0;i<a.length-1;i++)t=t[a[i]];t[a[a.length-1]]=v};
const validate=function validate(x){
const e=new Set(),s=x.source,r=x.reader,a=x.approval,c=x.command,b=x.boundary;
const ids=x.inventory.map(z=>z.id),o=x.outcomes,oi=o.map(z=>z.id),oiUnique=new Set(oi);
if(!s.sha||!s.revision||!s.occurrence||!s.frame)e.add('SOURCE_EXACT');
if(s.declaredCount!==x.inventory.length||new Set(ids).size!==ids.length)e.add('SOURCE_INVENTORY');
if(oiUnique.size!==oi.length||oi.length!==ids.length||oi.some(id=>!ids.includes(id)))e.add('OUTCOME_SET');
const allowed=['semantic','graphic_only','unsupported','rejected','unread'],n={semantic:0,graphic_only:0,unsupported:0,rejected:0,unread:0},expected=[];
for(const row of o){
 if(!allowed.includes(row.state)){e.add('UNCLASSIFIED');continue}
 n[row.state]++;
 const src=x.inventory.find(v=>v.id===row.id);
 if(src?.expectSemantic&&row.state!=='semantic')e.add('SEMANTIC_LOSS');
 if(row.state==='semantic'){
  if(row.kind!==src?.kind||!r.supported.includes(row.kind)||row.modifier!=='supported')e.add('SEMANTIC_UNSUPPORTED');
  if(row.anchor!==[s.revision,s.occurrence,s.frame].join('|'))e.add('ANCHOR_STALE');
  if(src?.expectSemantic)expected.push(row.id);
 }else if(!row.reason)e.add('LOSS_REASON');
}
if(Object.keys(n).some(k=>n[k]!==x.summary[k]))e.add('COUNTS_UNRECONCILED');
if(expected.sort().join('|')!==[...x.approvedIds].sort().join('|'))e.add('FALSE_APPROVAL_SET');
if(!r.version||!r.profile||!r.standard)e.add('READER_UNPINNED');
if(a.state!=='frozen'||!a.targetSha||!a.policy||a.sourceSha!==s.sha||a.readerProfile!==r.profile)e.add('FREEZE_BINDING');
if(c.owner!=='CAD-PMI-Owner'||c.routes.slice().sort().join('|')!=='Agent|CLI|GUI')e.add('OWNER_ROUTE');
if(!c.cas||!c.acl||!(c.scopeEpoch>0)||!(c.generation>0))e.add('COMMIT_RECHECK');
if(c.cancelled||c.lateReceipt)e.add('CANCELLED_ACK');
if(!b.d04VsD10Separate||!b.clNotD15||b.chain!=='D09>D12>D13>D14>D15>D16'||!b.unknownBlocks||!b.noMaterialSweep)e.add('DOMAIN_CLOSURE');
return [...e]
};
const fx=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-03-04/pmi-loss-b22-fixtures-v08.json')));
const tr=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-03-04-pmi-loss-b22-v08.json')));
const reg=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-03-04-pmi-loss-b22.json')));
let failures=[];if(validate(fx.positive.input).length)failures.push('positive');
for(const t of fx.negative){let x=clone(fx.positive.input);set(x,t.path,t.value);if(!validate(x).includes(t.code))failures.push(t.id)}
const refs=new Set(reg.sources.map(s=>s.id)),cases=new Set([fx.positive.id,...fx.negative.map(t=>t.id)]);
for(const r of tr.rules){if(r.sourceIds.some(i=>!refs.has(i))||!r.positiveIds.every(i=>cases.has(i))||r.negativeIds.length===0||!r.negativeIds.every(i=>cases.has(i)&&fx.negative.find(x=>x.id===i&&x.rule===r.id))||!r.fields.length||!r.workPackages.length)failures.push(r.id)}
if(tr.rules.length!==8||fx.negative.length!==29)failures.push('counts');
console.log(JSON.stringify({status:failures.length?'FAIL':'PASS',syntheticPositive:1,syntheticNegative:fx.negative.length,traceRules:tr.rules.length,failures,realSTEP:'NOT_RUN',product:'NOT_RUN'},null,2));
if(failures.length)process.exitCode=1;

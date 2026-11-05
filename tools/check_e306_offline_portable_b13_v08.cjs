#!/usr/bin/env node
'use strict';
// E3-06 B13：仅校验合成规划门禁；不解包、不验签、不读取真实NC字节。
const fs=require('node:fs'), path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const fixture=JSON.parse(fs.readFileSync(path.join(root,'docs/work-packages/E3-06/offline-portable-b13-fixtures-v08.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/E3-06-offline-portable-b13-trace-v08.json'),'utf8'));
const IDs=Array.from({length:7},(_,i)=>'E306-B13-R'+String(i+1).padStart(2,'0'));
const sha=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
const reserved=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
function safePath(p){if(typeof p!=='string'||p.length<1||p.length>180||!/^[A-Za-z0-9._/-]+$/.test(p))return false;return p.split('/').every(s=>s.length>0&&s!=='.'&&s!=='..'&&!s.endsWith('.')&&!reserved.test(s.split('.')[0]));}
function failures(x){
  const bad=[],p=x?.policy||{},a=x?.archive||{},m=x?.manifest||{},c=x?.closure||{},r=x?.receiver||{};
  const entries=Array.isArray(a.entries)?a.entries:[],names=entries.map(e=>e?.path),declared=Array.isArray(m.paths)?m.paths:[];
  if(p.profile!=='PROPOSED_ASCII_SAFE_V1_PENDING_L3'||![...names,...declared].every(safePath))bad.push(IDs[0]);
  const lower=names.map(n=>typeof n==='string'?n.toLowerCase():'');
  const loweredDeclared=declared.map(n=>typeof n==='string'?n.toLowerCase():'');
  const filePrefixCollision=lower.some((n,i)=>lower.some((q,j)=>i!==j&&q.startsWith(n+'/')));
  if(!entries.length||!Number.isSafeInteger(a.declaredEntryCount)||a.declaredEntryCount!==entries.length||
     declared.length!==entries.length||new Set(lower).size!==lower.length||
     new Set(loweredDeclared).size!==loweredDeclared.length||filePrefixCollision||
     names.some((n,i)=>n!==declared[i]))bad.push(IDs[1]);
  if(a.format!=='ZIP'||r.archiveIndexReopened!==true||entries.some(e=>e?.kind!=='regular'||e?.isLink!==false))bad.push(IDs[2]);
  const sizeOk=Number.isSafeInteger(p.maxEntryBytes)&&p.maxEntryBytes>0&&
    Number.isSafeInteger(p.maxTotalBytes)&&p.maxTotalBytes>0&&
    Number.isFinite(p.maxExpansionRatio)&&p.maxExpansionRatio>=1&&
    entries.every(e=>Number.isSafeInteger(e?.uncompressedBytes)&&e.uncompressedBytes>=0&&
      e.uncompressedBytes<=p.maxEntryBytes&&Number.isSafeInteger(e?.compressedBytes)&&
      e.compressedBytes>0&&e.uncompressedBytes/e.compressedBytes<=p.maxExpansionRatio)&&
    entries.reduce((s,e)=>s+(Number.isSafeInteger(e?.uncompressedBytes)?e.uncompressedBytes:0),0)<=p.maxTotalBytes;
  if(!sizeOk)bad.push(IDs[3]);
  const digestsOk=m.canonicalizationProfile==='RFC8785_DESIGN_ONLY'&&
    entries.every(e=>sha(e?.expectedSha256)&&sha(e?.observedSha256)&&e.expectedSha256===e.observedSha256)&&
    sha(m.d12FinalNcSha256)&&sha(m.d15IndependentEvidenceSha256)&&
    m.d12FinalNcSha256===c.d12CurrentNcSha256&&m.d15IndependentEvidenceSha256===c.d15CurrentEvidenceSha256&&
    entries[0]?.observedSha256===m.d12FinalNcSha256&&
    entries[1]?.observedSha256===m.d15IndependentEvidenceSha256&&
    c.d13Known===true&&c.d14Known===true&&c.d15ExactQualified===true&&c.d04IsNotD10===true;
  if(!digestsOk)bad.push(IDs[4]);
  if(p.expectedRevision!==p.currentRevision||!p.expectedRevision||p.roleAllowed!==true||
    !Number.isSafeInteger(p.requestPermissionEpoch)||p.requestPermissionEpoch!==p.livePermissionEpoch||
    p.cancelled!==false||p.lateReceipt!==false)bad.push(IDs[5]);
  if(r.pinnedTrustRootConfigured!==true||r.revocationFreshness!=='KNOWN_CURRENT'||
    !['PREFLIGHT_ONLY','PENDING_HUMAN'].includes(r.reportKind)||
    !['NOT_RUN','PENDING'].includes(r.independentConsumer)||r.machineExecution!=='NOT_RUN')bad.push(IDs[6]);
  return bad;
}
function mutate(x,k,value){
  const y=JSON.parse(JSON.stringify(x)),keys=k.replace(/\[(\d+)\]/g,'.$1').split('.');
  let z=y;for(const key of keys.slice(0,-1)){assert(z&&Object.hasOwn(z,key),'未知路径：'+k);z=z[key];}
  assert(z&&Object.hasOwn(z,keys.at(-1)),'未知字段：'+k);
  z[keys.at(-1)]=value;return y;
}
const sourceIds=new Set(trace.sources.map(x=>x.id)),caseIds=new Set(fixture.cases.map(x=>x.id));
assert.deepEqual(trace.rules.map(x=>x.id),IDs);
for(const rule of trace.rules){
  assert(rule.sourceIds?.length>0&&rule.fields?.length>0&&rule.capabilities?.length>0&&rule.workPackages?.includes('E3-06'));
  for(const id of rule.sourceIds)assert(sourceIds.has(id),'缺来源 '+id);
  for(const id of rule.acceptanceIds)assert(caseIds.has(id),'缺用例 '+id);
}
assert.deepEqual(failures(fixture.baseline),[],'合成基线不应阻断');
for(const t of fixture.cases){
  const got=failures(mutate(fixture.baseline,t.mutate.path,t.mutate.value));
  if(t.expected==='PASS')assert.deepEqual(got,[],'正例 '+t.id+' 意外失败：'+got);
  else assert(got.includes(t.expectedRule),'反例 '+t.id+' 未命中规则：'+got);
}
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_PASS',caseCount:fixture.cases.length+1,positive:fixture.cases.filter(x=>x.expected==='PASS').length+1,negative:fixture.cases.filter(x=>x.expected==='REJECT').length,ruleCount:trace.rules.length,warning:'不是实际文件Hash、ZIP解包、签名验收、Owner批准或产品测试'}));

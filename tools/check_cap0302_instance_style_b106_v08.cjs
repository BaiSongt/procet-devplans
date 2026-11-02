'use strict';
// B106只读规划校验器，绝不调用NC、OCCT或生产Owner。
const fs=require('node:fs'),path=require('node:path'),guards=["sourceFileHashPinned","readerVersionPinned","readerOptionsHashPinned","definitionAndOccurrenceDistinct","instancePathVerified","transformFrameDeclared","shuoProbeRecorded","noVisibilityDefaultFromFalse","colorTypeRecorded","noSyntheticSourceColor","viewerOverlayIsolated","displayNotManufacturingEvidence","sharedOwnerPort","ownerCasAclRechecked","cancelLateAckFenced","d04D10NcBoundary"];
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const get=(o,p)=>p.split('.').reduce((v,k)=>v==null?undefined:v[k],o);
function set(o,p,v){const a=p.split('.');let x=o;for(let i=0;i<a.length-1;i++)x=x[a[i]];x[a[a.length-1]]=v}
function judge(x){
const reject=why=>({status:'REJECT',visibility:'NOT_CERTIFIED',colorOrigin:'NOT_CERTIFIED',reason:why});
const unknown=why=>({status:'UNKNOWN',visibility:'UNKNOWN',colorOrigin:'UNKNOWN',reason:why});
for(const g of guards)if(get(x,'guards.'+g)!==true)return reject('GUARD_'+g);
if(!/^[a-f0-9]{64}$/.test(x.source?.sha256||'')||!/^[a-f0-9]{64}$/.test(x.source?.readerOptionsHash||'')||!x.source?.readerVersion)return reject('SOURCE_FINGERPRINT');
if(!x.occurrence?.id||!x.occurrence?.definitionRef||!x.occurrence?.instancePath||!x.occurrence?.frameRef||!x.occurrence?.exactRevision)return reject('OCCURRENCE_REF');
if(x.occurrence.exactRevision!==x.owner?.expectedRevision||x.owner?.currentRevision!==x.owner?.expectedRevision||!x.owner?.aclAllowed||!x.owner?.casAllowed)return reject('OWNER_CAS_ACL');
if(x.owner?.lateAck&&x.owner?.receiptEpoch!==x.owner?.scopeEpoch)return reject('LATE_ACK_SCOPE');
if(x.owner?.cancelFence&&x.owner?.lateAck)return reject('CANCEL_FENCE');
const a=x.appearance||{};
if(a.viewWritesD01||a.sourceIdFromColor||a.sourceColorAsMaterial||a.hiddenDeletesOccurrence||a.claimManufacturingVerified||a.claimClAsNcProof||a.d04D10Conflated)return reject('SCOPE_OR_AUTHORITY');
if(a.scope==='VIEWER')return {status:'DISPLAY_ONLY',visibility:a.viewHidden?'VIEW_HIDDEN':'VIEW_VISIBLE',colorOrigin:'VIEWER_ONLY',reason:'VIEW_PROJECTION'};
if(a.scope!=='SOURCE')return unknown('SCOPE_UNKNOWN');
if(x.source.readerColorMode!==true)return unknown('READER_COLOR_MODE_NOT_READ');
if(!['XCAFDoc_ColorSurf','XCAFDoc_ColorGen','XCAFDoc_ColorCurv'].includes(a.colorType))return unknown('COLOR_TYPE_UNSUPPORTED');
if(a.shuoPresence==='UNKNOWN'||a.shuoPresence==null)return unknown('SHUO_PROBE_UNKNOWN');
if(a.shuoPresence==='NOT_FOUND'){if(a.instanceVisibleRaw!==false)return reject('NO_SHUO_INCONSISTENT_API');return {status:'DESIGN_OK_LIMITED',visibility:'UNKNOWN_NO_SHUO',colorOrigin:a.definitionColorHit?'DEFINITION_FALLBACK':'UNKNOWN_COLOR',reason:'NO_SHUO_NOT_EXPLICIT_HIDE'}}
if(a.shuoPresence!=='FOUND')return unknown('SHUO_STATE_UNKNOWN');
if(a.instanceVisibleRaw!==true&&a.instanceVisibleRaw!==false)return unknown('VISIBILITY_API_UNKNOWN');
if(a.visibilityEvidence!==true)return unknown('VISIBILITY_EVIDENCE_MISSING');
const colorOrigin=a.instanceColorHit?'INSTANCE_SHUO':a.definitionColorHit?'DEFINITION_FALLBACK':'UNKNOWN_COLOR';
return {status:colorOrigin==='UNKNOWN_COLOR'?'DESIGN_OK_LIMITED':'DESIGN_OK',visibility:a.instanceVisibleRaw?'SOURCE_VISIBLE':'SOURCE_HIDDEN',colorOrigin,reason:'SOURCE_STYLED'};
}
const s=read("research/sources/CAP-03-02-instance-style-b106.json"),t=read("research/traces/CAP-03-02-instance-style-b106-v08.json"),f=read("docs/capabilities/CAP-03-02/instance-style-b106-fixtures-v08.json");
const sid=new Set(s.sources.map(x=>x.id)),cid=new Set(f.cases.map(x=>x.id)),rid=new Set(t.rules.map(x=>x.id));
if(s.registeredRecords!==7||sid.size!==7||t.rules.length!==8||cid.size!==50||t.sourceRegistry!=="research/sources/CAP-03-02-instance-style-b106.json"||t.fixtures!=="docs/capabilities/CAP-03-02/instance-style-b106-fixtures-v08.json"||t.checker!=="tools/check_cap0302_instance_style_b106_v08.cjs")throw Error('源/规则/夹具入口异常');
for(const r of t.rules)if(!r.positive.length||!r.negative.length||!r.fields.length||!r.originalWorkPackages.includes('B0-02')||r.sourceIds.some(x=>!sid.has(x))||[...r.positive,...r.negative,...r.unknown].some(x=>!cid.has(x)))throw Error('追踪断裂 '+r.id);
const counts={};let gold=0;
for(const c of f.cases){if(!rid.has(c.ruleId)||!f.baselines[c.base])throw Error('样例映射失败 '+c.id);const x=JSON.parse(JSON.stringify(f.baselines[c.base]));for(const [k,v]of Object.entries(c.patch))set(x,k,v);const o=judge(x);counts[o.status]=(counts[o.status]||0)+1;if(o.status!==c.expected)throw Error('状态错误 '+c.id);for(const [k,v]of Object.entries(c.expectedAppearance||{})){gold++;if(o[k]!==v)throw Error('外观来源Golden错误 '+c.id)}}
if(counts.DESIGN_OK!==8||counts.DESIGN_OK_LIMITED!==2||counts.DISPLAY_ONLY!==2||counts.REJECT!==30||counts.UNKNOWN!==8||gold!==18)throw Error('覆盖不足 '+JSON.stringify({counts,gold}));
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_PASS',cases:50,counts,appearanceGolden:18,independentOracle:'NOT_RUN',realSTEP_OCCT:'NOT_RUN',consumer:'NOT_RUN',product:'NOT_RUN'}));

'use strict';
// B79只读合成验证；不调用真实Host、SSE浏览器或NC。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const fixtures=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-01-06/sse-replay-b79-fixtures-v08.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-01-06-sse-replay-b79-v08.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-01-06-sse-replay-b79.json'),'utf8'));
const judge=function judge(v){
 const o=(status,code)=>({status,code});if(!v||!v.host||!v.transport||!v.journal||!v.event||!v.auth||!v.ui)return o("UNKNOWN","MISSING");
 const h=v.host,t=v.transport,j=v.journal,e=v.event,a=v.auth,u=v.ui;
 if(!h.streamId||!h.journalStreamId||!h.revision||!h.hash||!h.frameHash||!e.eventId||!e.contentHash)return o("UNKNOWN","SOURCE_MISSING");
 if(h.streamId!==h.journalStreamId)return o("REJECT","STREAM_MISMATCH");
 if(t.protocol!=="SSE")return o("UNKNOWN","TRANSPORT_UNPROVEN");
 if(t.encoding!=="UTF-8")return o("UNKNOWN","ENCODING_UNPROVEN");
 if(typeof t.sseId!=="string"||!t.sseId||/[\u0000\r\n]/.test(t.sseId))return o("UNKNOWN","SSE_ID_RESET");
 if(!t.terminated||!t.hasData)return o("UNKNOWN","NO_DISPATCHABLE_EVENT");
 if(!t.lastEventId||t.lastEventId!==j.cursor)return o("UNKNOWN","CURSOR_UNMAPPED");
 if(!j.hasDurableIndex)return o("UNKNOWN","JOURNAL_NOT_PROVEN");
 const dec=x=>typeof x==="string"&&/^(0|[1-9]\d*)$/.test(x);
 if(!dec(j.oldestRetained)||!dec(j.lastApplied)||!dec(e.sequence))return o("REJECT","SEQUENCE_NOT_EXACT");
 const oldest=BigInt(j.oldestRetained),last=BigInt(j.lastApplied),seq=BigInt(e.sequence);
 if(oldest>last+1n)return o("GAP","RETENTION_GAP");
 if(seq>last+1n)return o("GAP","SEQUENCE_GAP");
 if(seq===last)return e.eventId===j.oldEventId&&e.contentHash===j.oldHash?o("DUPLICATE","ALREADY_APPLIED"):o("REJECT","SAME_SEQ_CONFLICT");
 if(seq<last)return o("STALE","HISTORICAL_EVENT");
 if(h.scopeEpoch!==h.currentScopeEpoch||h.lateReceipt)return o("STALE","LATE_SCOPE_RECEIPT");
 if(h.revision!==h.currentRevision||h.hash!==h.currentHash)return o("STALE","SOURCE_REVISION_CHANGED");
 if(h.frameHash!==h.currentFrameHash)return o("STALE","FRAME_CHANGED");
 if(!a.ownerPort||!a.acl||!a.cas||!Array.isArray(a.channels)||!["GUI","CLI","Agent"].every(x=>a.channels.includes(x)))return o("REJECT","OWNER_PORT_OR_AUTH");
 if(u.engineCount!==1||u.sceneCount!==1||u.canvasCount!==1||u.panelCount!==1)return o("REJECT","DUPLICATE_3D_OR_PANEL");
 if(u.previewDomainWrite)return o("REJECT","PREVIEW_IS_WRITE");
 if(u.claimCancelled)return o("REJECT","CANCEL_ACK_MISSING");
 if(u.claimD15Pass||u.claimD16Release||!u.d04D10Separated||u.unknownPromotedToPass)return o("REJECT","FALSE_ENGINEERING_PASS");
 return o("CANDIDATE_ONLY","OBSERVATION_ONLY");
};
const apply=function apply(base,changes){const v=JSON.parse(JSON.stringify(base));for(const [k,val] of Object.entries(changes)){const xs=k.split(".");let o=v;for(let i=0;i<xs.length-1;i++)o=o[xs[i]];o[xs[xs.length-1]]=val;}return v;};
function run(){const errors=[];for(const r of trace.rules){if(!r.sourceIds.every(s=>sources.sources.some(x=>x.id===s))||!r.caseIds.every(c=>fixtures.cases.some(x=>x.id===c))||!r.caseIds.some(x=>x.startsWith('P'))||!r.caseIds.some(x=>x.startsWith('N')))errors.push('TRACE:'+r.id);}
for(const c of fixtures.cases){const got=judge(apply(fixtures.base,c.changes));if(got.status!==c.expectedStatus||got.code!==c.expectedCode)errors.push(c.id+':'+got.status+'/'+got.code);}
const counts=fixtures.cases.reduce((o,c)=>(o[c.expectedStatus]=(o[c.expectedStatus]||0)+1,o),{});if(JSON.stringify(counts)!==JSON.stringify(fixtures.counts))errors.push('COUNTS');const result={status:errors.length?'FAIL':'PASS_SAME_JUDGE_SYNTHETIC_ONLY',cases:fixtures.cases.length,rules:trace.rules.length,sources:sources.sources.length,counts,errors};console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;return result;}
if(require.main===module)run();module.exports={judge,apply,run};

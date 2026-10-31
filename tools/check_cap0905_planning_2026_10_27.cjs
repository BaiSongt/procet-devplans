// CAP-09-05 规划合成校验：不运行真实机床、几何、NC或业务Owner。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=read('research/sources/CAP-09-05.json'),tr=read('research/traces/CAP-09-05.json'),fx=read('docs/capabilities/CAP-09-05/fixtures.json'),own=read('docs/capabilities/CAP-09-05/asset-owner-candidates.json');
const val=(o,p)=>p.split('.').reduce((z,k)=>z?.[k],o);
function runVector(v){
 if(v.lateAck)return 'REJECT_LATE_ACK';
 if(v.hashMatches===false)return 'STALE';
 if(v.requestD15FromCL)return 'BLOCKED_NO_NC';
 if(v.missingBinding||v.ikAmbiguous||v.clearanceUnknown||v.boundEvidence!==true||!v.points?.length||!v.limits?.length)return 'UNKNOWN';
 for(const p of v.points){if(p.length!==v.limits.length)return 'UNKNOWN';for(let i=0;i<p.length;i++){if(!Number.isFinite(p[i])||p[i]<v.limits[i][0]||p[i]>v.limits[i][1])return 'REJECT_PRECHECK';}}
 return 'CL_ONLY';
}
function assert(c,msg){if(!c)throw Error(msg);}
assert(src.sources.length===8&&new Set(src.sources.map(s=>s.id)).size===8,'SOURCES');
assert(tr.rules.length===10&&fx.cases.length===30&&fx.motionVectors.length===10&&own.entries.length===17,'COUNTS');
const sourceIDs=new Set(src.sources.map(s=>s.id));let passed=0;
for(const s of src.sources)assert(s.url.startsWith('https://')&&s.authors?.length&&s.accessDepth&&s.locator&&s.limits,'SOURCE_META:'+s.id);
for(const r of tr.rules){
 assert(r.fields.length===4&&r.criteria.length===4&&r.sourceIds.length>0&&r.sourceIds.every(id=>sourceIDs.has(id)),'TRACE:'+r.id);
 assert(r.workPackages.join(',')==='F1-02,E3-04,E3-05,U4-04','PACKAGE:'+r.id);
 const cases=fx.cases.filter(c=>c.ruleId===r.id);assert(cases.length===3&&new Set(cases.map(c=>c.scenario)).size===3,'CASECOVER:'+r.id);
 for(const c of cases){
   if(c.scenario!=='POSITIVE')assert(r.fields.includes(c.mutatedField),'MUTATION:'+c.id);
   const actual=r.criteria.every(q=>val(c.input,q.path)===q.value)?'PASS':'REJECT';
   assert(actual===c.expected,'EXPECT:'+c.id);passed++;
 }
}
for(const v of fx.motionVectors){assert(runVector(v)===v.expected,'VECTOR:'+v.id);passed++;}
assert(passed===40,'TOTAL');
console.log(JSON.stringify({status:'PASS',passed,scope:'PLANNING_SYNTHETIC_ONLY',product:'NOT_RUN',NC:'NOT_RUN',B5:'NOT_RUN',independentConsumer:'NOT_RUN'}));

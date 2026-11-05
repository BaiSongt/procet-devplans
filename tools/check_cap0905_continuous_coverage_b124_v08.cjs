"use strict";
// B124 只读规划检查器：不可直接用于生产机床验收。
const fs=require("node:fs"),path=require("node:path");const root=path.resolve(__dirname,"..");const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
function judge(id,x){switch(id){
case "B124-R01":return (!x.input.clSha||!x.input.d10Sha||!x.input.frameHash||!x.input.policyHash)?"UNKNOWN":"CL_ONLY_PRECHECK";
case "B124-R02":return (!x.models.toolHolder||!x.models.fixture||!x.models.machine)?"UNKNOWN":(!x.models.sameFrame?"REJECT_PRECHECK":"CL_ONLY_PRECHECK");
case "B124-R03":return (!Number.isFinite(x.motion.start)||!Number.isFinite(x.motion.end)||x.motion.start>=x.motion.end)?"REJECT_PRECHECK":(!x.motion.interpPinned||!x.motion.dynamicFramePinned?"UNKNOWN":"CL_ONLY_PRECHECK");
case "B124-R04":return x.sampling.endpointsOnly?"UNKNOWN":(!Number.isFinite(x.sampling.marginMm)||x.sampling.marginMm<=0||!Number.isFinite(x.sampling.errorBoundMm)||x.sampling.errorBoundMm>=x.sampling.marginMm?"UNKNOWN":(x.sampling.claimCertified?"REJECT_PRECHECK":"CL_ONLY_PRECHECK"));
case "B124-R05":return (!x.ccd.version||!x.ccd.motionSupported||!x.ccd.requestComplete||!x.ccd.allObjects)?"UNKNOWN":"CL_ONLY_PRECHECK";
case "B124-R06":return !x.result.methodSuccess?"UNKNOWN":(x.result.collision||x.result.toi!==null||x.result.falseClearOnFail?"REJECT_PRECHECK":"CL_ONLY_PRECHECK");
case "B124-R07":return (x.gate.tag!=="CL_ONLY"||!x.gate.acknowledgeNoNcAxes||!x.gate.noD15Promotion||!x.gate.noD16Release)?"REJECT_PRECHECK":"CL_ONLY_PRECHECK";
case "B124-R08":return (!x.guard.aclCasCurrent||x.guard.cancelled)?"STALE":(!x.guard.samePort||x.guard.uiTopology!=="ONE_BABYLON_LEFT_TASK_PANEL"?"REJECT_PRECHECK":"CL_ONLY_PRECHECK");
default:throw Error("unrecognized rule "+id)
}}
function setAt(x,p,val){const a=p.split(".");let obj=x;for(let i=0;i<a.length-1;i++)obj=obj[a[i]];obj[a[a.length-1]]=val;}
function dAt(t){return Math.abs(-2+4*t)-.25}
function golden(id){switch(id){case "B124-G01":return [dAt(0),dAt(1)];case "B124-G02":return dAt(.5);case "B124-G03":return [1.75/4,2.25/4];case "B124-G04":return 1.75<=4*.5;default:throw Error("unknown golden")}}
const src=read("research/sources/CAP-09-05-continuous-coverage-b124.json"),trace=read("research/traces/CAP-09-05-continuous-coverage-b124-v08.json"),fixture=read("docs/capabilities/CAP-09-05/continuous-coverage-b124-fixtures-v08.json");const assert=(x,m)=>{if(!x)throw Error(m)};
assert(src.registeredRecords===7&&src.sources.length===7&&trace.rules.length===8&&fixture.cases.length===40&&fixture.goldens.length===4,"counts");const sourceIds=new Set(src.sources.map(x=>x.id));assert(sourceIds.size===7,"duplicate sources");for(const x of src.sources)assert(x.authors&&x.edition&&x.url&&x.accessDepth&&x.limits,"source metadata");const seen=new Set();let pass=0;for(const r of trace.rules){assert(r.sourceIds.every(id=>sourceIds.has(id))&&r.fields.length===4&&r.positive.length===1&&r.negative.length===4,"rule mapping "+r.id);assert(["F1-02","E3-04","E3-05","U4-04"].every(id=>r.originalWorkPackages.includes(id)),"work package");}
for(const k of fixture.cases){assert(!seen.has(k.id),"duplicate case");seen.add(k.id);const rule=trace.rules.find(r=>r.id===k.ruleId);assert(rule&&[...rule.positive,...rule.negative].includes(k.id),"missing case mapping");if(k.mutation)assert(rule.fields.includes(k.mutation.path),"unmapped field");const x=JSON.parse(JSON.stringify(fixture.base));if(k.mutation)setAt(x,k.mutation.path,k.mutation.value);const got=judge(k.ruleId,x);assert(got===k.expected,k.id+" got "+got+" expected "+k.expected);pass++;}for(const k of fixture.goldens){assert(JSON.stringify(golden(k.id))===JSON.stringify(k.expected),k.id+" analytic mismatch");pass++;}for(const r of trace.rules)assert([...r.positive,...r.negative].every(id=>seen.has(id)),"missing mapped case");process.stdout.write("B124 PLANNING_SYNTHETIC_ONLY "+pass+"/44 PASS; actual FCL/OCCT/OEM/independent consumers NOT_RUN\n");

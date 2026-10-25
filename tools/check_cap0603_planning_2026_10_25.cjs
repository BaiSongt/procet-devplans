/* 仅合成字段与有限集合逻辑，不触发真实OCCT/NC/机床。中文注释。 */
const fs=require('node:fs'),path=require('node:path');
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
function setEq(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===new Set(a).size&&b.length===new Set(b).size&&a.length===b.length&&a.every(x=>b.includes(x))}
function decide(rule,x){
switch(rule){
case 1:return !!x.sameScope&&!!x.frameTransformApproved&&x.sourceRefs?.length>=2&&x.sourceRefs.every(v=>v.id&&v.revision&&/^[a-f0-9]{64}$/.test(v.hash||"")&&v.frame&&v.unit&&v.scope)&&new Set(x.sourceRefs.map(v=>v.scope)).size===1;
case 2:{const A=x.cellsA||[],B=x.cellsB||[],p=x.disjointParts||{};const a=p.onlyA||[],both=p.both||[],b=p.onlyB||[];if([A,B,a,both,b].some(t=>new Set(t).size!==t.length))return false;if([...a,...both,...b].length!==new Set([...a,...both,...b]).size)return false;return setEq(a,A.filter(t=>!B.includes(t)))&&setEq(b,B.filter(t=>!A.includes(t)))&&setEq(both,A.filter(t=>B.includes(t)))&&setEq(x.resultUnion,[...new Set([...A,...B])]);}
case 3:return x.booleanReport?.hasErrors===false&&x.booleanReport.warningsReviewed===true&&x.booleanReport.nonDestructive===true&&x.booleanReport.historyAvailable===true;
case 4:return x.preCheck?.valid===true&&x.postCheck?.valid===true&&x.preCheck.checkMode==="GEOMETRY_AND_TOPOLOGY"&&x.postCheck.checkMode==="GEOMETRY_AND_TOPOLOGY"&&x.independentD07==="PENDING";
case 5:return Number.isFinite(x.tolerance?.fuzzy)&&x.tolerance.fuzzy>=0&&x.tolerance.fuzzy<=x.tolerance.approvedMax&&x.tolerance.approvedMax>0&&x.tolerance.unit==="mm"&&!!x.tolerance.approvalRef&&x.tolerance.noAutoGrowth===true;
case 6:return x.topology?.closedLoops===true&&x.topology.nestedWiresVerified===true&&setEq(x.topology.islandIdsBefore,x.topology.islandIdsAfter);
case 7:return x.guard?.protectedIntersection===false&&x.guard.allowanceCertified===true&&x.guard.resultInsideStock===true&&!!x.guard.protectionFrame;
case 8:return x.multisolid?.implicitFuse===false&&x.multisolid.historyPerSolid===true&&x.multisolid.before.length>=2&&setEq(x.multisolid.before,x.multisolid.after);
case 9:return x.repair?.oldHash!==x.repair?.newHash&&/^[a-f0-9]{64}$/.test(x.repair?.oldHash||"")&&/^[a-f0-9]{64}$/.test(x.repair?.newHash||"")&&x.repair.newRevision===true&&x.repair.historyLogged===true&&x.repair.rechecked===true&&x.repair.frozenUntouched===true;
case 10:{const a=x.commit||{},d=x.downstream||{};return a.expectedHead===a.currentHead&&a.scopeEpoch===a.authorizedEpoch&&a.generation===a.currentGeneration&&a.cancelled===false&&a.lateAck===false&&d.d07Independent==="PASS"&&d.d08Frozen===true&&d.d09Eligible===true&&d.d13Semantic==="UNKNOWN"&&d.d15==="BLOCKED"&&d.d16==="BLOCKED";}
default:return false;
}}
const src=read('research/sources/CAP-06-03.json'),t=read('research/traces/CAP-06-03.json'),f=read('docs/capabilities/CAP-06-03/fixtures.json'),o=read('docs/capabilities/CAP-06-03/asset-owner-candidates.json'),base=read('docs/architecture/v0.8/business-assets.json');
if(src.sources.length!==10||t.rules.length!==10||f.cases.length!==20||o.assets.length!==17||!f.syntheticOnly)throw Error('COUNT_OR_ORIGIN');
const ids=new Set(src.sources.map(x=>x.id));if(ids.size!==10||src.sources.some(x=>!x.url||!x.edition||!x.accessDepth||!x.limits||!x.locator))throw Error('SOURCE');
for(const a of base.assets){const p=o.assets.find(x=>x.id===a.id);if(!p||p.canonicalOwner!==a.owner||p.signoff!=='PENDING_HUMAN')throw Error('OWNER_'+a.id)}
let count=0;const seen=new Set();for(let i=0;i<10;i++){const rule=t.rules[i],p=f.cases.find(x=>x.id===rule.positiveTestId),n=f.cases.find(x=>x.id===rule.negativeTestId);if(!rule||seen.has(rule.id)||!p||!n||!rule.fields.length||!rule.assets.length||rule.sourceIds.some(s=>!ids.has(s)))throw Error('TRACE_'+i);seen.add(rule.id);if(!decide(i+1,p.input)||decide(i+1,n.input)||p.expected!=='PASS'||n.expected!==rule.negativeReason)throw Error('CASE_'+i);count+=2;const mutate=JSON.parse(JSON.stringify(p.input));switch(i){
case 0:mutate.sourceRefs[0].scope='synthetic-other';break;
case 1:mutate.resultUnion=['u1','u2'];break;
case 2:mutate.booleanReport.warningsReviewed=false;break;
case 3:mutate.preCheck.checkMode='TOPOLOGY_ONLY';break;
case 4:mutate.tolerance.noAutoGrowth=false;break;
case 5:mutate.topology.nestedWiresVerified=false;break;
case 6:mutate.guard.allowanceCertified=false;break;
case 7:mutate.multisolid.after=['SOLID-1'];break;
case 8:mutate.repair.historyLogged=false;break;
case 9:mutate.commit.currentHead='r13';break;
default:throw Error('UNKNOWN_MUTATION');
}if(decide(i+1,mutate))throw Error('MUTANT_'+i);count++}console.log('SYNTHETIC_PLANNING_PASS '+count+'/30; REAL_OCCT_AND_PRODUCT_NOT_RUN');

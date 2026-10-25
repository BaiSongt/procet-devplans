/* 此脚本仅运行规划合成数据，不执行OCCT/NC。 */
const fs=require('node:fs'),path=require('node:path');
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
function dag(steps,edges){if(new Set(steps).size!==steps.length)return false;let indegree=Object.fromEntries(steps.map(s=>[s,0])),outs=Object.fromEntries(steps.map(s=>[s,[]]));for(let [a,b] of edges){if(!(a in indegree)||!(b in indegree))return false;indegree[b]++;outs[a].push(b)}let queue=steps.filter(s=>!indegree[s]),seen=0;for(let i=0;i<queue.length;i++){seen++;for(let y of outs[queue[i]])if(!--indegree[y])queue.push(y)}return seen===steps.length}
function decide(i,x){
switch(i){
case 0:return x.sourceMatchesHead===true&&x.refs?.length>=2&&x.refs.every(v=>v.id&&v.revision&&/^[a-f0-9]{64}$/.test(v.hash||"")&&v.frame&&v.unit&&v.scope&&v.branch&&v.schemaVersion);
case 1:return x.priorStock?.kind==="OCCT_BREP"&&!!x.priorStock.frame&&x.materialFingerprint===x.recomputedFingerprint&&x.toleranceBudgetKnown===true;
case 2:return dag(x.steps||[],x.edges||[])&&x.freezePrecedenceRespected===true;
case 3:return x.branches?.length>=2&&new Set(x.branches).size===x.branches.length&&x.overwriteFrozen===false&&x.independentRevisions===true;
case 4:return x.prune&&x.sameStock&&x.sameConstraints&&x.sameFrameAndTolerance&&x.certifiedBound;
case 5:return x.exhausted===true&&x.status==="UNKNOWN"&&x.provenInfeasible===false&&x.budget?.beam>0&&x.budget?.maxBoolean>0&&x.budget?.maxMs>0;
case 6:return x.booleanStatus==="OK"&&x.brepCheck==="VALID"&&x.protectedZoneChecked&&x.fuzzyInBudget&&x.d07Independent==="PENDING";
case 7:return x.writer==="PLAN_ADOPTION_PORT"&&x.newRevision&&x.frozenUntouched&&x.noSolverApproval;
case 8:return x.expectedRevision===x.currentRevision&&x.acl&&x.generation===x.currentGeneration&&!x.cancelled&&!x.lateAck;
case 9:return x.d07Independent==="PASS"&&x.d08ExactFrozen&&x.d09Gate==="D07_AND_D08"&&x.d15==="NOT_RUN"&&x.d16==="BLOCKED";
default:return false;}}
const src=read('research/sources/CAP-06-02.json'),tr=read('research/traces/CAP-06-02.json'),fix=read('docs/capabilities/CAP-06-02/fixtures.json'),owners=read('docs/capabilities/CAP-06-02/asset-owner-candidates.json'),base=read('docs/architecture/v0.8/business-assets.json');
if(src.sources.length!==10||tr.rules.length!==10||fix.cases.length!==20||owners.assets.length!==17)throw Error('COUNTS');
const sid=new Set(src.sources.map(x=>x.id));if(sid.size!==10||src.sources.some(x=>!x.accessDepth||!x.edition||!x.limits||!x.url))throw Error('SOURCE');
for(const a of base.assets){const m=owners.assets.find(x=>x.id===a.id);if(!m||m.canonicalOwner!==a.owner||m.signoff!=='PENDING_HUMAN')throw Error('OWNER_'+a.id)}
let n=0;for(let i=0;i<10;i++){const rule=tr.rules[i],pos=fix.cases.find(x=>x.id===rule.positiveTestId),neg=fix.cases.find(x=>x.id===rule.negativeTestId);if(!pos||!neg||!rule.fields.length||!rule.assets.length||rule.sourceIds.some(x=>!sid.has(x)))throw Error('TRACE_'+i);if(!decide(i,pos.input)||decide(i,neg.input)||pos.expected!=='PASS'||neg.expected!==rule.negativeReason)throw Error('CASE_'+i);n+=2;const bad=JSON.parse(JSON.stringify(pos.input));switch(i){case 0:bad.refs[0].hash='bad';break;case 1:bad.recomputedFingerprint='bad';break;case 2:bad.edges.push(['FINISH','ROUGH']);break;case 3:bad.overwriteFrozen=true;break;case 4:bad.sameConstraints=false;break;case 5:bad.status='INFEASIBLE';break;case 6:bad.brepCheck='INVALID';break;case 7:bad.writer='SOLVER_DIRECT_WRITE';break;case 8:bad.currentGeneration=999;break;case 9:bad.d08ExactFrozen=false;break;}if(decide(i,bad))throw Error('MUTATION_'+i);n++;}
console.log('SYNTHETIC_PLANNING_PASS '+n+'/30; PRODUCT_NOT_RUN');

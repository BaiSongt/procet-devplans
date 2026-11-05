/* 只验证合成规划规则，不执行OCCT或NC，中文注释。 */
const fs=require('node:fs'),path=require('node:path');
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
function same(a,b){return Array.isArray(a)&&Array.isArray(b)&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.length===b.length&&a.every(y=>b.includes(y))}
function minus(a,b){return a.filter(t=>!b.includes(t))}
function accept(i,x){
 switch(i){
 case 1:{const a=x.refs||[];return x.scopeAligned===true&&["D01","D04","D07"].every(id=>a.some(z=>z.assetId===id))&&new Set(a.map(y=>y.scope)).size===1&&a.every(y=>y.revision&&/^[a-f0-9]{64}$/.test(y.hash||"")&&y.hashKind&&y.frame&&y.unit==="mm"&&y.project&&y.branch&&y.setup);}
 case 2:{const t=x.transform||{};return t.from==="PART"&&t.to==="S1"&&/^[a-f0-9]{64}$/.test(t.hash||"")&&t.invertible&&t.unitsCompatible&&t.rightHanded&&t.approved&&t.displayOnlyConversionExcluded;}
 case 3:{const g=x.geometry||{},s=g.stock||[],e=g.retain||[],p=g.protected||[],r=g.removable||[];return [s,e,p,r].every(q=>new Set(q).size===q.length)&&e.every(t=>s.includes(t))&&same(r,minus(minus(s,e),p))&&same(g.preserved,minus(s,r))&&r.every(t=>!p.includes(t));}
 case 4:return x.target?.subtractiveOnly===true&&x.target.fullyKnown===true&&x.target.target?.length>0&&x.target.target.every(t=>x.target.stock.includes(t));
 case 5:{const a=x.allowance||{};return a.faces?.length>0&&new Set(a.faces.map(y=>y.uid)).size===a.faces.length&&a.faces.every(y=>y.uid&&Number.isFinite(y.mm)&&y.mm>=0&&y.approved===true)&&!!a.approvalRef&&a.envelopeKind==="OCCT_BREP_CERTIFICATION_REQUIRED"&&a.noGlobalBBox===true;}
 case 6:{const g=x.guard||{};return same(minus(g.removable||[],g.protected||[]),g.removable||[])&&g.crossCheck==="INDEPENDENT_COMMON_REQUIRED"&&/^[a-f0-9]{64}$/.test(g.protectedRefHash||"")&&g.sameFrame===true;}
 case 7:{const y=x.history||{};return /^[a-f0-9]{64}$/.test(y.previousHash||"")&&y.consumedHash===y.previousHash&&y.initialHash!==y.consumedHash&&!!y.previousStepUid&&!!y.currentStepUid&&y.immutable===true;}
 case 8:{const a=x.engine||{};return a.version==="OCCT_8.0.1_REQUIRED"&&a.pre==="REAL_BREP_CHECK_REQUIRED"&&a.post==="REAL_BREP_CHECK_REQUIRED"&&a.warningsReviewed===true&&a.hasHistory===true&&a.fuzzyApproved===true&&a.result==="NOT_RUN_REAL_OCCT";}
 case 9:{const a=x.commit||{};return a.expectedHead===a.currentHead&&a.aclEpoch===a.authorizedEpoch&&a.generation===a.currentGeneration&&a.cancelled===false&&a.lateAck===false&&a.frozenD08Untouched===true&&a.otherSetupUntouched===true&&!a.invalidates?.includes("D08")&&["D07","D09","D12","D13","D14","D15","D16"].every(t=>a.invalidates?.includes(t));}
 case 10:{const d=x.downstream||{};return d.d07Independent==="REQUIRES_REAL_CONSUMER"&&d.d08Frozen===true&&d.d09==="CONDITIONAL_ONLY"&&d.clPreview==="NON_CERTIFYING"&&d.d13==="UNKNOWN"&&d.d15==="BLOCKED"&&d.d16==="BLOCKED"&&d.materialSweep===false;}
 default:return false;
 }}
const trace=read('research/traces/CAP-06-04.json'),fix=read('docs/capabilities/CAP-06-04/fixtures.json'),src=read('research/sources/CAP-06-04.json'),owners=read('docs/capabilities/CAP-06-04/asset-owner-candidates.json'),base=read('docs/architecture/v0.8/business-assets.json');
if(trace.rules.length!==10||fix.cases.length!==20||src.sources.length!==10||owners.assets.length!==17||fix.syntheticOnly!==true)throw Error('COUNT');
const ids=new Set(src.sources.map(v=>v.id));if(ids.size!==10||src.sources.some(v=>!v.url||!v.edition||!v.locator||!v.accessDepth||!v.limits))throw Error('SOURCE');
for(const a of base.assets){const o=owners.assets.find(v=>v.id===a.id);if(!o||o.canonicalOwner!==a.owner||o.signoff!=='PENDING_HUMAN')throw Error('OWNER_'+a.id)}
const mutations=[x=>x.refs[0].scope='OTHER',x=>x.transform.invertible=false,x=>x.geometry.preserved=['a','b'],x=>x.target.fullyKnown=false,x=>x.allowance.faces[0].mm=-0.1,x=>x.guard.protectedRefHash='bad',x=>x.history.previousStepUid='',x=>x.engine.warningsReviewed=false,x=>x.commit.currentHead='r6',x=>x.downstream.d16='PASS'];
let n=0;for(let i=0;i<10;i++){const r=trace.rules[i],p=fix.cases.find(v=>v.id===r.positiveTestId),b=fix.cases.find(v=>v.id===r.negativeTestId);if(!r||!p||!b||r.sourceIds.some(s=>!ids.has(s))||!r.fields.length||!r.assets.length)throw Error('TRACE_'+i);if(!accept(i+1,p.input)||accept(i+1,b.input)||p.expected!=='PASS'||b.expected!==r.negativeReason)throw Error('ORACLE_'+i);n+=2;const m=JSON.parse(JSON.stringify(p.input));mutations[i](m);if(accept(i+1,m))throw Error('MUTANT_'+i);n++}console.log('SYNTHETIC_PLANNING_PASS '+n+'/30 REAL_OCCT_PRODUCT_NOT_RUN');

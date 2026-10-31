"use strict";
const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const load=p=>JSON.parse(read(p));
const m=load("docs/architecture/v0.8/cross-coverage-v08.json"),fx=load("docs/architecture/v0.8/cross-coverage-fixtures-v08.json");
const c=[...read(m.sourceFiles.cap).matchAll(/^\|\s*(CAP-\d\d-\d\d)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/gm)].map(z=>({id:z[1],p:[...new Set(z[4].match(/[A-Z]\d-\d\d/g)||[])]}));
const w=[...read(m.sourceFiles.wp).matchAll(/^###\s+([A-Z]\d-\d\d)\s+·\s+(.+)$/gm)].map(z=>z[1]);
const o=load(m.sourceFiles.owners).contracts,index=new Set(load(m.sourceFiles.index).registries.map(z=>z.path));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function check(x){let e=[];if(x.capabilities.length!==88||new Set(x.capabilities.map(y=>y.id)).size!==88)e.push("CAP");
if(x.workPackages.length!==36||new Set(x.workPackages.map(y=>y.id)).size!==36)e.push("WP");
if(x.assets.length!==17||new Set(x.assets.map(y=>y.id)).size!==17)e.push("ASSET");
if(x.domains.length!==11)e.push("DOM");
if(x.counts.capPackageOriginalEdges!==c.reduce((s,y)=>s+y.p.length,0))e.push("EDGES");
for(const z of c){let a=x.capabilities.find(y=>y.id===z.id),r="research/sources/"+z.id+".json";
let expected=index.has(r)&&fs.existsSync(path.join(root,r))?r:null;
if(!a||!same(a.originalWorkPackages,z.p)||!same(a.explicitlyProducedAssets,o.filter(y=>y.producerCapabilities.includes(z.id)).map(y=>y.assetId))||a.sameNameIndexedRegistry!==expected||a.productState!=="NOT_RUN")e.push("CAP:"+z.id);}
for(const id of w){let a=x.workPackages.find(y=>y.id===id),l=c.filter(y=>y.p.includes(id)).map(y=>y.id);
if(!a||!same(a.directOriginalCapabilities,l)||a.originalMapping!==(l.length?"HAS_DIRECT_CAP":"NO_DIRECT_CAP"))e.push("WP:"+id);}
for(const z of o){let a=x.assets.find(y=>y.id===z.assetId);if(!a||!same(a.explicitProducerCapabilities,z.producerCapabilities)||a.producerPort!==z.producerPort||a.humanSignoff!=="PENDING_HUMAN"||a.realConsumer!=="NOT_RUN")e.push("OWN:"+z.assetId);}
let zero=w.filter(id=>!c.some(y=>y.p.includes(id))),miss=c.filter(y=>!fs.existsSync(path.join(root,"research/traces/"+y.id+".json"))).map(y=>y.id);
let regi=c.filter(y=>!index.has("research/sources/"+y.id+".json")||!fs.existsSync(path.join(root,"research/sources/"+y.id+".json"))).map(y=>y.id);
if(!same(x.gaps.packagesWithoutOriginalCapEdge,zero)||!same(x.gaps.capsWithoutSameNameTrace,miss)||!same(x.gaps.capsWithoutSameNameIndexedRegistry,regi))e.push("GAP");
if(!x.safeguards.d04D10Separate||!same(x.safeguards.ncChain,["D09","D12","D13","D14","D15","D16"])||!x.safeguards.unknownNotPublishable||x.counts.realConsumerPasses!==0||x.counts.humanSignedOwners!==0)e.push("SAFE");
return e}
function change(x,k){switch(k){
case"DROP_CAP":x.capabilities.shift();break;
case"FAKE_CAP_PACKAGE":x.capabilities[0].originalWorkPackages.push("T5-06");break;
case"DUPLICATE_PACKAGE":x.workPackages[1].id=x.workPackages[0].id;break;
case"FAKE_OWNER_SIGN":x.assets[0].humanSignoff="APPROVED";break;
case"INJECT_FAKE_SOURCE_GAP":x.capabilities.find(y=>y.id==="CAP-02-03").sameNameIndexedRegistry=null;break;
case"MERGE_D04_D10":x.safeguards.d04D10Separate=false;break;
case"SPOOF_NC_CHAIN":x.safeguards.ncChain[1]="D11";break;
case"FAKE_CONSUMER_PASS":x.assets[0].realConsumer="PASS";break;
case"CONCEAL_ZERO_LINK_PACKAGE":x.workPackages.find(y=>y.id==="B0-05").originalMapping="HAS_DIRECT_CAP";break;
case"FAKE_OWNER_PRODUCER":x.assets[0].explicitProducerCapabilities.push("CAP-11-08");break;
case"FAKE_PRODUCT_PASS":x.capabilities[0].productState="PASS";break;
case"INJECT_FAKE_TRACE_GAP":x.gaps.capsWithoutSameNameTrace=["CAP-02-03"];break;
default:throw Error(k)}return x}
if(check(m).length){console.error(check(m));process.exit(1)}
if(process.argv.includes("--self-test")){for(const f of fx.negatives){let x=change(JSON.parse(JSON.stringify(m)),f.mutation);if(!check(x).length){console.error("NOT_REJECTED",f.id);process.exit(1)}}console.log("PLANNING_STATIC_PASS",fx.negatives.length,"negative rejected; product NOT_RUN");}
else console.log("PLANNING_STATIC_PASS; product NOT_RUN");


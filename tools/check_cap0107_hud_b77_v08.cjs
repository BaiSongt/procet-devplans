'use strict';
// B77规划合成校验：不会执行真实Babylon、OCCT或领域写入。
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const fixtures=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-01-07/hud-b77-fixtures-v08.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-01-07-hud-b77-v08.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-01-07-hud-b77.json'),'utf8'));
const judge=function judge(v){
  const a=v.asset,r=v.render,c=v.command,b=v.boundary;
  const out=(status,code)=>({status,code});
  if(!a||!r||!c||!b)return out("UNKNOWN","MISSING_RECORD");
  if(!a.projectId||!a.assetId||!a.revision||!a.contentHash||!a.geometryHash||!a.frameRef||!a.frameHash||!a.occurrencePath)return out("UNKNOWN","SOURCE_INCOMPLETE");
  if(!["D01","D03","D04"].includes(a.ownerDomain))return out("REJECT","OWNER_DOMAIN");
  if(a.revision!==a.currentRevision||a.contentHash!==a.currentContentHash||a.geometryHash!==a.anchorGeometryHash)return out("STALE","SOURCE_CHANGED");
  if(a.frameRef!==a.anchorFrameRef||a.frameHash!==a.anchorFrameHash)return out("STALE","FRAME_CHANGED");
  if(a.anchorState!=="EXACT")return out("UNKNOWN","ANCHOR_UNRESOLVED");
  if(a.unit!=="mm"||!Number.isFinite(a.authoritativeValueMm)||!Number.isFinite(a.labelCanonicalValueMm))return out("UNKNOWN","MEASURE_UNKNOWN");
  if(a.authoritativeValueMm!==a.labelCanonicalValueMm)return out("REJECT","DISPLAY_VALUE_NOT_SOURCE");
  if(r.engineCount!==1||r.sceneCount!==1||r.canvasCount!==1||r.panelCount!==1||!r.activeRoot)return out("REJECT","WORLD_HOST");
  if(r.sceneEpoch!==r.receiptSceneEpoch||r.scopeEpoch!==c.scopeEpoch)return out("STALE","RENDER_OR_SCOPE_EPOCH");
  const rect=r.rect,draw=r.draw,p=r.projected;
  if(!rect||!draw||!p||![rect.left,rect.top,rect.width,rect.height,draw.width,draw.height,p.x,p.y,p.z].every(Number.isFinite)||rect.width<=0||rect.height<=0||draw.width<=0||draw.height<=0)return out("UNKNOWN","VIEWPORT_UNKNOWN");
  if(r.projectionOrigin!=="TOP_LEFT"||p.z<0||p.z>1)return out("UNKNOWN","PROJECTION_UNKNOWN");
  const x=rect.left+p.x/draw.width*rect.width,y=rect.top+p.y/draw.height*rect.height;
  if(!Number.isFinite(r.cssX)||!Number.isFinite(r.cssY)||Math.abs(x-r.cssX)>1e-7||Math.abs(y-r.cssY)>1e-7)return out("REJECT","CSS_MAPPING");
  if(r.cssX<rect.left||r.cssX>rect.left+rect.width||r.cssY<rect.top||r.cssY>rect.top+rect.height)return out("DISPLAY_ONLY","OFFSCREEN");
  if(r.fontCssPx<10||r.fontCssPx>12||r.hitWidthCssPx<24||r.hitHeightCssPx<24||!r.keyboardReachable)return out("REJECT","HUD_ACCESS");
  if(!r.safeAreaClear)return out("DISPLAY_ONLY","SAFE_AREA");
  if(r.occlusion==="UNKNOWN"||!r.occlusionChecked)return out("UNKNOWN","OCCLUSION_UNVERIFIED");
  if(r.occlusion==="OCCLUDED")return out("DISPLAY_ONLY","OCCLUDED");
  if(r.occlusion!=="VISIBLE")return out("UNKNOWN","OCCLUSION_BAD_ENUM");
  if(r.overlap&&!r.panelFallback)return out("REJECT","COLLISION_LOSS");
  if(r.overlap)return out("DISPLAY_ONLY","COLLISION_TO_PANEL");
  if(!c.sameOwnerPort||!c.channels.includes("GUI")||!c.channels.includes("CLI")||!c.channels.includes("Agent")||!c.hostActorFromSession)return out("REJECT","PORT_BYPASS");
  if(c.scopeEpoch!==c.currentScopeEpoch||c.expectedRevision!==a.currentRevision||c.lateReceipt||c.cancelled)return out("STALE","COMMAND_STALE");
  if(!c.acl||!c.cas||c.previewWroteDomain||c.claimedCommittedWithoutReceipt)return out("REJECT","ILLEGAL_COMMIT");
  if(!b.d04D10Separate||!b.frozenPreserved||b.clPreviewPromotedToNcPass||b.unknownPromotedToPass)return out("REJECT","DOWNSTREAM_FABRICATION");
  if(!c.editRequested)return out("DISPLAY_ONLY","INSPECT");
  if(a.dimensionKind!=="DRIVING")return out("REJECT","READ_ONLY_DIMENSION");
  if(!a.parameterRef)return out("UNKNOWN","NO_DRIVING_PARAMETER");
  return out("CANDIDATE_ONLY","EXPLICIT_PROPOSAL");
};
function run(){
 const fsIds=new Set(fixtures.cases.map(x=>x.id));
 const sIds=new Set(sources.sources.map(x=>x.id));
 let failures=[];
 for(const rule of trace.rules){
  if(rule.caseIds.length<3||!rule.caseIds.every(id=>fsIds.has(id))||!rule.sourceIds.every(id=>sIds.has(id)))failures.push('LINK:'+rule.id);
 }
 for(const t of fixtures.cases){
  const actual=judge(t.input);
  if(actual.status!==t.expectedStatus||actual.code!==t.expectedCode)failures.push(t.id+':'+actual.status+'/'+actual.code);
 }
 const count=fixtures.cases.reduce((o,c)=>(o[c.expectedStatus]=(o[c.expectedStatus]||0)+1,o),{});
 if(JSON.stringify(count)!==JSON.stringify(fixtures.counts))failures.push('COUNT_MISMATCH');
 const report={status:failures.length?'FAIL':'PASS_SAME_JUDGE_SYNTHETIC',cases:fixtures.cases.length,rules:trace.rules.length,sources:sources.sources.length,failures};
 process.stdout.write(JSON.stringify(report,null,2)+'\\n');
 if(failures.length)process.exitCode=1;
 return report;
}
if(require.main===module)run();
module.exports={judge,run};

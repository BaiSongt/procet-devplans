'use strict';
// CAP-02-07 B59：资源网格拾取证据规划校验；不接触真实机床、OCCT或用户数据库。
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ROOT = path.resolve(__dirname, '..');
const DEFAULT = 'docs/capabilities/CAP-02-07/render-pick-b59-fixtures-v08.json';
const near = (a,b,t=1e-9) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b)<=t;
function rigid(m) {
  if (!Array.isArray(m) || m.length!==16 || !m.every(Number.isFinite)) return false;
  if (![12,13,14,15].every((i,j)=>near(m[i],[0,0,0,1][j]))) return false;
  const r=[[m[0],m[1],m[2]],[m[4],m[5],m[6]],[m[8],m[9],m[10]]];
  for(let i=0;i<3;i++) for(let j=0;j<3;j++) {
    const dot=r[i].reduce((s,v,k)=>s+v*r[j][k],0);
    if(!near(dot,i===j?1:0,1e-8)) return false;
  }
  const det=r[0][0]*(r[1][1]*r[2][2]-r[1][2]*r[2][1])-r[0][1]*(r[1][0]*r[2][2]-r[1][2]*r[2][0])+r[0][2]*(r[1][0]*r[2][1]-r[1][1]*r[2][0]);
  return near(det,1,1e-8);
}
function classify(x) {
  if(!x || !x.owner || !x.render || !x.hit || !x.ui || !x.downstream) return 'UNKNOWN';
  const {owner:o,render:r,hit:h,ui:u,downstream:d}=x;
  if(o.acl!=='allow') return o.acl==='deny'?'REJECT':'UNKNOWN';
  if(!o.frameHash || !o.scope || !o.assetHash || !o.revision) return 'UNKNOWN';
  if(o.revision!==o.readRevision || o.assetHash!==o.readAssetHash || o.scopeEpoch!==o.readScopeEpoch) return 'STALE';
  if(u.cancelled || u.taskGeneration!==u.expectedTaskGeneration) return 'STALE';
  if(r.sceneEpoch!==r.activeSceneEpoch || h.sceneEpoch!==r.sceneEpoch || r.instanceRegistryEpoch!==h.instanceRegistryEpoch) return 'STALE';
  if(!r.cadAssetHash || !r.geometryHash || !h.meshHash) return 'UNKNOWN';
  if(r.cadAssetHash!==o.assetHash || h.meshHash!==r.geometryHash || h.mapCadHash!==o.assetHash || h.mapGeometryHash!==r.geometryHash || h.mapMeshEpoch!==r.meshEpoch) return 'STALE';
  if(!r.cadUnit || !r.exportUnit || !Number.isFinite(r.metersPerCadMm)) return 'UNKNOWN';
  if(r.cadUnit!=='mm' || r.exportUnit!=='m' || !near(r.metersPerCadMm,0.001,1e-15)) return 'REJECT';
  if(!Number.isFinite(r.linearDeflectionMm)||r.linearDeflectionMm<=0||!Number.isFinite(r.angularDeflectionRad)||r.angularDeflectionRad<=0||r.angularDeflectionRad>Math.PI) return 'REJECT';
  if(!u.rendererCount || u.rendererCount!==1 || u.canvasCount!==1 || u.panel!=='LEFT' || u.domainPort!=='D03.resolvePickCandidate' || u.fontMaxPx>12 || u.mode!=='RESOURCE') return 'REJECT';
  if(d.d04Owner!=='D04' || d.d10Owner!=='D10' || d.d08FrozenUntouched!==true || d.ncEngineeringPassInferred!==false) return 'REJECT';
  if(h.meshId!==r.meshId) return 'REJECT';
  const key=String(h.thinInstanceIndex);
  if(!Number.isInteger(h.thinInstanceIndex) || !h.instanceRegistry || !Object.prototype.hasOwnProperty.call(h.instanceRegistry,key)) return 'UNKNOWN';
  if(h.instanceRegistry[key]!==h.instanceKey) return 'REJECT';
  if(!rigid(h.transformMm)) return 'REJECT';
  if(!Array.isArray(h.localPointMm)||h.localPointMm.length!==3||!Array.isArray(h.worldPointM)||h.worldPointM.length!==3) return 'UNKNOWN';
  const m=h.transformMm,p=h.localPointMm;
  for(let i=0;i<3;i++) {
    const value=(m[4*i]*p[0]+m[4*i+1]*p[1]+m[4*i+2]*p[2]+m[4*i+3])*r.metersPerCadMm;
    if(!near(value,h.worldPointM[i])) return 'REJECT';
  }
  if(h.mapStatus!=='EXACT' || !h.faceProof || !h.triangleToFace || !Object.prototype.hasOwnProperty.call(h.triangleToFace,String(h.triangleId))) return 'DISPLAY_ONLY';
  if(h.triangleToFace[String(h.triangleId)]!==h.faceRef || h.faceProof.sourceFaceRef!==h.faceRef || h.faceProof.assetHash!==o.assetHash || h.faceProof.instanceKey!==h.instanceKey) return 'REJECT';
  return 'PICK_CANDIDATE'; // 仅拾取候选，不是D15工程认证、资源发布或真实消费者验收。
}
function applyEdits(x,edits){const y=structuredClone(x);for(const [p,v] of Object.entries(edits||{})){const parts=p.split('.');let a=y;for(const q of parts.slice(0,-1))a=a[q];a[parts.at(-1)]=v;}return y;}
function selfTest(file=DEFAULT) {
  const f=JSON.parse(fs.readFileSync(path.resolve(ROOT,file),'utf8'));
  assert.equal(f.schemaVersion,'procet-b59-pick-fixtures-v1');
  assert.ok(Array.isArray(f.cases)&&f.cases.length>=20);
  const ids=new Set();const counts={};
  for(const c of f.cases){assert.ok(!ids.has(c.id),'重复编号 '+c.id);ids.add(c.id);const actual=classify(applyEdits(f.base,c.edits));assert.equal(actual,c.expected,c.id);counts[actual]=(counts[actual]||0)+1;}
  console.log(JSON.stringify({status:'PASS',tested:f.cases.length,counts,validator:'规划合成，不是OCCT/Babylon/独立消费者/产品验证'}));
}
if(require.main===module){if(process.argv[2]==='--self-test')selfTest(process.argv[3]||DEFAULT);else {console.error('用法：node tools/check_cap0207_render_pick_b59_v08.cjs --self-test');process.exitCode=2;}}
module.exports={classify,applyEdits,rigid};

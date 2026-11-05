'use strict';
/** B86规划合成检验，不能替代D13/机床/独立消费者工程验收。 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const tr=read('research/traces/CAP-02-03-lathe-turret-b86-v08.json'),src=read('research/sources/CAP-02-03-lathe-turret-b86.json'),fx=read('docs/capabilities/CAP-02-03/lathe-turret-b86-fixtures-v08.json');
const clone=x=>JSON.parse(JSON.stringify(x));
function set(x,path,value){let t=x;const keys=path.split('.');for(const k of keys.slice(0,-1)){assert.ok(Object.hasOwn(t,k));t=t[k]}assert.ok(Object.hasOwn(t,keys.at(-1)));t[keys.at(-1)]=value;}
function dec(x){
 if(x.tx.cancelled)return'STALE_CANCELLED';if(x.tx.lateAck)return'STALE_LATE_ACK';if(!x.tx.acl)return'REJECT_ACL';
 if(x.tx.expectedRevision!==x.tx.actualRevision||x.tx.expectedHash!==x.tx.actualHash||x.tx.epoch!==x.tx.currentEpoch||x.tx.generation!==x.tx.currentGeneration)return'STALE_INPUT';
 if(!x.machine.controllerProfile||x.machine.controllerProfile==='UNKNOWN'||!x.machine.profileExact)return'UNKNOWN_DIALECT';
 if(x.offset.parser!==x.machine.controllerProfile)return'REJECT_DIALECT';
 if(!x.machine.id||!x.machine.revision||!/^[a-f0-9]{64}$/.test(x.machine.hash)||!x.turret.assemblyRef||!/^[a-f0-9]{64}$/.test(x.turret.assemblyHash))return'UNKNOWN_RESOURCE';
 if(!Number.isInteger(x.turret.station)||x.turret.station<1||x.turret.station>x.turret.capacity)return'REJECT_STATION';
 if(!/^T\d{4}$/.test(x.offset.word)||Number(x.offset.word.slice(1,3))===0)return'REJECT_TWORD';
 if(Number(x.offset.word.slice(1,3))!==x.turret.station)return'STALE_STATION';
 if(Number(x.offset.word.slice(3,5))===0&&!x.offset.zeroOffsetExplicit)return'UNKNOWN_OFFSET_DISABLED';
 if(x.offset.index!==Number(x.offset.word.slice(3,5))||x.offset.index!==x.offset.d10Index)return'STALE_OFFSET';
 if(x.offset.claimSameNumber)return'REJECT_ALIAS';
 if(x.offset.tableHash!==x.offset.expectedTableHash)return'STALE_TABLE';
 if(x.calibration.geometryHash!==x.calibration.expectedGeometryHash||x.calibration.wearHash!==x.calibration.expectedWearHash)return'STALE_CALIBRATION';
 if(x.calibration.quality!=='OBSERVED'||!x.calibration.source||!x.calibration.geometryRef||!x.calibration.wearRef)return'UNKNOWN_CALIBRATION';
 if(x.orientation.policy!=='HAAS_TIP_DIRECTION'||!Number.isInteger(x.orientation.tip)||x.orientation.mappingSource!=='HAAS_MANUAL')return'UNKNOWN_ORIENTATION';
 if(x.turret.activeStation!==x.turret.station)return'STALE_STATION';
 if(x.turret.mountingFace!==x.turret.mappedFace)return'UNKNOWN_MOUNT';
 if(x.turret.assemblyHash!==x.turret.installedAssemblyHash)return'STALE_RESOURCE';
 if(x.ui.gui!=='02.ToolAssemblyPort'||x.ui.cli!==x.ui.gui||x.ui.agent!==x.ui.gui||x.ui.worldCount!==1||x.ui.panel!=='LEFT_UNIFIED')return'REJECT_ENTRY';
 if(x.execution.d16Claim||x.execution.d15RealPassed||x.migration.claimConsumerPass)return'REJECT_PROMOTION';
 if(!x.migration.oldReader||!x.migration.rollbackRef)return'UNKNOWN_MIGRATION';
 if(x.tx.mode==='PREVIEW')return'DISPLAY_ONLY';
 return'CANDIDATE_ONLY';
}
assert.equal(src.sources.length,9);assert.equal(tr.rules.length,8);assert.equal(fx.cases.length,32);
const ids=new Set(fx.cases.map(c=>c.id)),sids=new Set(src.sources.map(s=>s.id));assert.equal(ids.size,32);assert.equal(sids.size,9);
for(const r of tr.rules){assert.equal(r.capabilityId,'CAP-02-03');assert.equal(r.positiveIds.length,1);assert.equal(r.negativeIds.length,3);assert.ok(r.fields.length);for(const s of r.sourceIds)assert.ok(sids.has(s),'source '+s);for(const id of [...r.positiveIds,...r.negativeIds])assert.ok(ids.has(id),'case '+id);}
let count=0;for(const c of fx.cases){assert.ok(tr.rules.some(r=>r.id===c.ruleId));const x=clone(fx.base);for(const z of c.changes)set(x,z.path,z.value);assert.equal(dec(x),c.expected,c.id);count++;}
for(const z of [{p:'tx.lateAck',v:true,e:'STALE_LATE_ACK'},{p:'offset.parser',v:'LINUXCNC_TN_M6',e:'REJECT_DIALECT'},{p:'turret.station',v:0,e:'REJECT_STATION'},{p:'ui.worldCount',v:2,e:'REJECT_ENTRY'},{p:'execution.d16Claim',v:true,e:'REJECT_PROMOTION'}]){const x=clone(fx.base);set(x,z.p,z.v);assert.equal(dec(x),z.e);}
console.log('B86合成 '+count+'/32 符合预期；5类变异拒绝；产品 NOT_RUN');

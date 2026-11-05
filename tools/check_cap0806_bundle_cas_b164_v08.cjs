'use strict';
// B164：合成规划静态门禁，不运行真实NC/机床或修改产品仓。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=read('research/sources/CAP-08-06-bundle-cas-b164.json'),t=read('research/traces/CAP-08-06-bundle-cas-b164-v08.json'),f=read('docs/capabilities/CAP-08-06/bundle-cas-b164-fixtures-v08.json');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const errs=[],sids=new Set(s.records.map(x=>x.id)),ids=new Set();let pos=0,neg=0;
assert.equal(s.records.length,7);assert.equal(t.rules.length,8);assert.equal(Object.keys(f.fieldSpecs).length,32);
const judge=r=>Object.keys(f.fieldSpecs).every(k=>Object.hasOwn(r,k)&&Object.is(r[k],f.fieldSpecs[k][0]))?'PASS':'REJECT';
for(const c of f.cases){if(ids.has(c.id))errs.push(c.id+':duplicate');ids.add(c.id);const changed=Object.keys(f.baseline).filter(k=>!Object.is(c.record[k],f.baseline[k]));if(c.kind==='positive'){pos++;if(changed.length||c.changedField!==null)errs.push(c.id+':positive');}else if(c.kind==='single_field_negative'){neg++;if(changed.length!==1||changed[0]!==c.changedField)errs.push(c.id+':not-single-field');}else errs.push(c.id+':kind');if(judge(c.record)!==c.expected)errs.push(c.id+':expected');}
for(const r of t.rules){if(r.fields.length!==4||r.fields.some(k=>!Object.hasOwn(f.fieldSpecs,k)))errs.push(r.id+':fields');if(r.sourceIds.some(id=>!sids.has(id)))errs.push(r.id+':source');if(r.testIds.length!==5||r.testIds.some(id=>!ids.has(id)))errs.push(r.id+':test');}
function evalBundle(g){const b=f.bundle,z={...b,...g.overrides},files={...b.files,...(g.overrides.fileOverrides||{})};
 if(z.expectedRevision!==z.actualRevision)return {status:'STALE_MANIFEST'};
 if(!z.aclAllowed)return {status:'DENIED'};if(z.cancelled)return {status:'CANCELLED'};
 if(z.expectedFrame!==z.actualFrame)return {status:'STALE_FRAME'};
 if(z.expectedScope!==z.actualScope)return {status:'STALE_SCOPE'};
 for(const [k,h] of Object.entries(b.pinnedHashes)){if(typeof files[k]!=='string')return {status:'MISSING_MEMBER'};if(sha(Buffer.from(files[k],'utf8'))!==h)return {status:'STALE_MEMBER'};}
 const decoder=new TextDecoder('utf-8',{fatal:true}),out={...files};
 for(const p of z.patches){if(typeof out[p.file]!=='string')return {status:'MISSING_MEMBER'};const a=Buffer.from(out[p.file],'utf8');if(!Number.isInteger(p.start)||!Number.isInteger(p.end)||p.start<0||p.end<p.start||p.end>a.length)return {status:'INVALID_SPAN'};
 try{decoder.decode(a.subarray(0,p.start));decoder.decode(a.subarray(0,p.end));}catch{return {status:'INVALID_UTF8_BOUNDARY'};}
 const bnew=Buffer.concat([a.subarray(0,p.start),Buffer.from(p.replacement,'utf8'),a.subarray(p.end)]);
 try{decoder.decode(bnew);}catch{return {status:'INVALID_UTF8_BOUNDARY'};}
 if(a.includes(Buffer.from([13,10]))&&!bnew.includes(Buffer.from([13,10])))return {status:'EOL_CHANGED'};
 if(a.subarray(0,3).equals(Buffer.from([239,187,191]))&&!bnew.subarray(0,3).equals(Buffer.from([239,187,191])))return {status:'BOM_CHANGED'};
 out[p.file]=bnew.toString('utf8');}
 return {status:'READY_NOT_COMMITTED',newHashes:Object.fromEntries(Object.entries(out).map(([k,v])=>[k,sha(Buffer.from(v,'utf8'))]))};}
for(const g of f.golden){const r=evalBundle(g);if(r.status!==g.expected)errs.push(g.id+':got-'+r.status);if(g.expectedNewHashes&&JSON.stringify(r.newHashes)!==JSON.stringify(g.expectedNewHashes))errs.push(g.id+':sha');}
assert.equal(pos,8);assert.equal(neg,32);assert.equal(f.golden.length,8);assert.deepEqual(errs,[]);
console.log('B164规划合成：8正/32单字段反例/8原字节SHA256及状态Golden通过；未发生真实D12提交或D13–D16验收');

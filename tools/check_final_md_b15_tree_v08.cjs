#!/usr/bin/env node
'use strict';
/** B15 只读：Git commit/tree身份勘误与路径SHA机器回归，不是产品验收。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const auditPath = path.join(root, 'research/audits/FINAL-MARKDOWN-B14-2026-10-29.json');
const fixturePath = path.join(root, 'docs/architecture/v0.8/final-markdown-b15-tree-fixtures-v08.json');
function verify(a, o) {
  const sha = /^[0-9a-f]{40}$/;
  assert(sha.test(a.sourceExactHead), '非法commit SHA');
  assert(sha.test(a.gitTreeSha), '非法Tree SHA');
  assert(sha.test(o.resolvedCommitSha), '非法实际commit SHA');
  assert(sha.test(o.resolvedTreeSha), '非法实际Tree SHA');
  assert.equal(a.sourceExactHead, o.resolvedCommitSha, '固定提交身份不一致');
  assert.notEqual(a.gitTreeSha, a.sourceExactHead, 'Tree字段误用了commit SHA');
  assert.equal(a.gitTreeSha, o.resolvedTreeSha, '固定提交指向的Tree SHA不一致');
  assert.equal(a.treeTruncated, false, '原审计记录树已截断');
  assert.equal(o.treeTruncated, false, '实际读取树已截断');
  assert(Array.isArray(a.markdownManifest), '缺少Markdown清单');
  assert.equal(a.markdownManifest.length, a.summary.markdownTotal, '清单分母不匹配');
  assert.equal(a.markdownManifest.length, o.mdEntries.size, '不覆盖全部Markdown');
  const seen = new Set();
  let old = 0, fresh = 0;
  for (const item of a.markdownManifest) {
    assert(item.path.endsWith('.md'), '非Markdown混入');
    assert(!seen.has(item.path), '路径重复');
    seen.add(item.path);
    assert(sha.test(item.gitBlobSha), 'Blob SHA非法');
    assert.equal(o.mdEntries.get(item.path), item.gitBlobSha, '内容Blob SHA不一致');
    if (item.proof === 'PRIOR_CONNECTOR_READ_SHA_STABLE') old++;
    else if (item.proof === 'FRESH_EXACT_CONNECTOR_READ_MATCHED') fresh++;
    else assert.fail('证明类型无来源');
  }
  assert.equal(old, a.summary.priorStableReadPaths);
  assert.equal(fresh, a.summary.newExactReadPaths);
  assert.equal(old + fresh, a.summary.markdownTotal);
  for (const legacy of a.historicalOriginalMissing) {
    assert.equal(legacy.recovered, false, '历史原字节不可冒充恢复');
    assert(!o.allPaths.has(legacy.path), '旧附件现已存在，须重审历史来源');
  }
  assert.equal(a.gates.ownerFormalSigned, 0, '无Owner签署不得升格');
  assert.equal(a.gates.consumerRealPass, 0, '无独立消费者实际运行');
  assert.equal(a.gates.l3, 'PENDING_HUMAN', 'L3须等待审批');
  assert.equal(a.parserGates.gfmAst, 'NOT_RUN', 'GFM AST未运行');
  return {status:'PLANNING_GIT_IDENTITY_ONLY',commit:a.sourceExactHead,tree:a.gitTreeSha,markdown:seen.size,prior:old,fresh:fresh,gfmAst:'NOT_RUN',product:'NOT_RUN'};
}
function git(args) {
  return cp.execFileSync('git', args, {cwd:root,maxBuffer:50*1024*1024}).toString('utf8').trim();
}
function actual() {
  const a = JSON.parse(fs.readFileSync(auditPath,'utf8'));
  const resolvedCommitSha=git(['rev-parse','--verify',a.sourceExactHead+'^{commit}']);
  const resolvedTreeSha=git(['rev-parse','--verify',a.sourceExactHead+'^{tree}']);
  const buffer=cp.execFileSync('git',['ls-tree','-r','-z',a.sourceExactHead],{cwd:root,maxBuffer:50*1024*1024});
  const mdEntries=new Map(), allPaths=new Set();
  for (const row of buffer.toString('utf8').split('\0')) {
    if (!row) continue;
    const match=row.match(/^[0-7]{6} (blob|commit) ([0-9a-f]{40})\t(.+)$/s);
    if (!match) throw Error('异常Git树记录格式');
    allPaths.add(match[3]);
    if (match[1]==='blob' && match[3].endsWith('.md')) mdEntries.set(match[3],match[2]);
  }
  const result=verify(a,{resolvedCommitSha,resolvedTreeSha,mdEntries,allPaths,treeTruncated:false});
  console.log(JSON.stringify({...result,actualLocalGit:true}));
}
function setField(obj,p,value) {
  const parts=p.replace(/\[(\d+)\]/g,'.$1').split('.');
  let v=obj;
  for(let i=0;i<parts.length-1;i++) v=v[parts[i]];
  v[parts[parts.length-1]]=value;
}
function selfTest() {
  const aa='a'.repeat(40),bb='b'.repeat(40),cc='c'.repeat(40);
  const a={sourceExactHead:aa,gitTreeSha:bb,treeTruncated:false,
    summary:{markdownTotal:2,priorStableReadPaths:1,newExactReadPaths:1},
    markdownManifest:[{path:'a.md',gitBlobSha:cc,proof:'PRIOR_CONNECTOR_READ_SHA_STABLE'},
      {path:'b.md',gitBlobSha:cc,proof:'FRESH_EXACT_CONNECTOR_READ_MATCHED'}],
    historicalOriginalMissing:[{path:'old.json',recovered:false}],
    gates:{ownerFormalSigned:0,consumerRealPass:0,l3:'PENDING_HUMAN'},
    parserGates:{gfmAst:'NOT_RUN'}};
  const o={resolvedCommitSha:aa,resolvedTreeSha:bb,mdEntries:new Map([['a.md',cc],['b.md',cc]]),
    allPaths:new Set(['a.md','b.md']),treeTruncated:false};
  const f=JSON.parse(fs.readFileSync(fixturePath,'utf8'));
  assert.equal(f.cases[0].id,'P01');
  assert.equal(verify(a,o).markdown,2);
  let negatives=0;
  for(const c of f.cases.slice(1)) {
    const copy=structuredClone(a), obs=structuredClone(o);
    const obj={audit:copy,observation:obs};
    if(c.op==='set') setField(obj,c.path,c.value);
    else if(c.op==='popManifest') copy.markdownManifest.pop();
    else if(c.op==='duplicatePath') copy.markdownManifest[1].path=copy.markdownManifest[0].path;
    else if(c.op==='deleteTreeEntry') obs.mdEntries.delete(c.path);
    else assert.fail('未知变异操作 '+c.op);
    assert.throws(()=>verify(copy,obs),'反例未被拒绝 '+c.id);
    negatives++;
  }
  assert.equal(negatives,16);
  console.log(JSON.stringify({status:'PASS_SYNTHETIC_ONLY',positive:1,negative:negatives,actualLocalGit:'NOT_RUN',product:'NOT_RUN'}));
}
if(require.main===module) {
  try {if(process.argv.includes('--self-test'))selfTest(); else actual();}
  catch(error){console.error(String(error.stack||error));process.exitCode=1;}
}
module.exports={verify};

#!/usr/bin/env node
'use strict';
/** 规划仓 B14：只读核对固定提交的Markdown Git Blob身份；不做产品验收。 */
const fs = require('node:fs');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const path = require('node:path');
const AUDIT = path.resolve(__dirname, '../research/audits/FINAL-MARKDOWN-B14-2026-10-29.json');
function check(audit, tree) {
  const m = audit.markdownManifest;
  assert(Array.isArray(m), '无Markdown清单');
  assert.equal(m.length, audit.summary.markdownTotal, '总数与清单不一致');
  assert.equal(m.length, tree.size, '清单不等于固定HEAD的全部Markdown');
  assert.equal(new Set(m.map(x => x.path)).size, m.length, '路径重复');
  let oldCount = 0, freshCount = 0;
  for (const x of m) {
    assert(x.path.endsWith('.md'), '不是Markdown');
    assert(/^[0-9a-f]{40}$/.test(x.gitBlobSha), 'SHA格式错误');
    assert.equal(tree.get(x.path), x.gitBlobSha, `Git Blob失效: ${x.path}`);
    if (x.proof === 'PRIOR_CONNECTOR_READ_SHA_STABLE') oldCount++;
    else if (x.proof === 'FRESH_EXACT_CONNECTOR_READ_MATCHED') freshCount++;
    else throw Error(`不可信证明等级: ${x.path}`);
  }
  assert.equal(oldCount, audit.summary.priorStableReadPaths, '历史可复用凭证数错误');
  assert.equal(freshCount, audit.summary.newExactReadPaths, '本轮读取数错误');
  assert.equal(oldCount + freshCount, audit.summary.markdownTotal, '证据缺口');
  for (const h of audit.historicalOriginalMissing) {
    assert.equal(h.recovered, false, '不得假称历史原字节恢复');
    assert(!tree.has(h.path), '缺失路径变化需重新审计');
  }
  assert.equal(audit.gates.ownerFormalSigned, 0, '未经授权不得宣称Owner已签');
  assert.equal(audit.gates.consumerRealPass, 0, '不得用文档验收冒充消费者验收');
  assert.equal(audit.gates.l3, 'PENDING_HUMAN', '人审状态不应自动升级');
  assert.equal(audit.parserGates.gfmAst, 'NOT_RUN', '不应假称已完成AST');
  return { status: 'PLANNING_GIT_BLOB_ONLY', markdown: m.length, priorUnchanged: oldCount, newlyRead: freshCount, product: 'NOT_RUN' };
}
function readGitTree(sha) {
  const output = cp.execFileSync('git', ['ls-tree', '-r', '-z', sha], { maxBuffer: 50 * 1024 * 1024 });
  const map = new Map();
  for (const record of output.toString('utf8').split('\0')) {
    if (!record) continue;
    const match = record.match(/^[0-7]{6} blob ([0-9a-f]{40})\t(.+)$/s);
    if (match && match[2].endsWith('.md')) map.set(match[2], match[1]);
  }
  return map;
}
function selfTest() {
  const aa = 'a'.repeat(40), bb = 'b'.repeat(40);
  const base = {
    summary: { markdownTotal: 2, priorStableReadPaths: 1, newExactReadPaths: 1 },
    markdownManifest: [
      { path: 'old.md', gitBlobSha: aa, proof: 'PRIOR_CONNECTOR_READ_SHA_STABLE' },
      { path: 'new.md', gitBlobSha: bb, proof: 'FRESH_EXACT_CONNECTOR_READ_MATCHED' }
    ],
    historicalOriginalMissing: [{ path: 'missing.json', recovered: false }],
    gates: { ownerFormalSigned: 0, consumerRealPass: 0, l3: 'PENDING_HUMAN' },
    parserGates: { gfmAst: 'NOT_RUN' }
  };
  const tree = new Map([['old.md', aa], ['new.md', bb]]);
  const clone = x => structuredClone(x);
  assert.equal(check(base, tree).markdown, 2);
  const negatives = [
    a => { a.markdownManifest[0].gitBlobSha = bb; },
    a => { a.markdownManifest.pop(); },
    a => { a.markdownManifest[1].path = 'old.md'; },
    a => { a.summary.markdownTotal = 3; },
    a => { a.summary.priorStableReadPaths = 2; },
    a => { a.markdownManifest[1].proof = 'SYNTHETIC_ONLY'; },
    a => { a.historicalOriginalMissing[0].recovered = true; },
    a => { a.gates.ownerFormalSigned = 17; },
    a => { a.gates.consumerRealPass = 1; },
    a => { a.gates.l3 = 'APPROVED'; },
    a => { a.parserGates.gfmAst = 'PASS'; }
  ];
  for (const f of negatives) {
    const a = clone(base); f(a);
    assert.throws(() => check(a, tree), '错误反例没有被拒绝');
  }
  assert.throws(() => check(base, new Map([['old.md', aa]])));
  console.log(JSON.stringify({ status: 'PASS_SYNTHETIC_ONLY', positive: 1, negative: negatives.length + 1, actualRepository: 'NOT_RUN' }));
}
if (require.main === module) {
  if (process.argv.includes('--self-test')) selfTest();
  else {
    const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf8'));
    const tree = readGitTree(audit.sourceExactHead);
    const treeSha = cp.execFileSync('git', ['rev-parse', `${audit.sourceExactHead}^{tree}`], { encoding: 'utf8' }).trim();
    assert.equal(treeSha, audit.gitTreeSha, '固定来源Git Tree不匹配');
    console.log(JSON.stringify(check(audit, tree)));
  }
}
module.exports = { check };

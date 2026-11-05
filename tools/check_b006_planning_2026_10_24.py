#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""B0-06规划契约结构与正反样例检查；不执行产品测试。"""
import argparse, copy, json, re
from pathlib import Path

def accepted(rule, x, owners, asset_sha):
    if rule == 'GOV6-R01': return x.get('ownerMap') == owners and x.get('assetBlobSha') == asset_sha and x.get('githubCodeOwner') is None
    if rule == 'GOV6-R02': return x.get('assigneeStatus') == 'UNASSIGNED_PENDING_HUMAN' and x.get('account') is None and x.get('signatures') == [] and x.get('claimedApproved') is False
    if rule == 'GOV6-R03': return x.get('productAcceptance') == 'NOT_RUN' and x.get('reviewEvidence') == 'SYNTHETIC_ONLY' and len({x.get('author'),x.get('consumerReviewer'),x.get('qaReviewer')}) == 3 and all(x.get(k) for k in ('author','consumerReviewer','qaReviewer'))
    if rule == 'GOV6-R04': return x.get('status') in ('proposed','accepted','superseded','rejected') and all(x.get(k) for k in ('adrId','context','decision','consequences')) and bool(x.get('alternatives')) and x.get('previousImmutable') is True
    if rule == 'GOV6-R05': return x.get('workPackageId') == 'B0-06' and bool(re.fullmatch(r'r\d+',str(x.get('inputRevision','')))) and bool(re.fullmatch('[a-f0-9]{64}',str(x.get('inputHash','')))) and bool(x.get('frameId') and x.get('negativeCaseIds') and x.get('rollbackPlan'))
    if rule == 'GOV6-R06': return x.get('isDraft') is True and x.get('reviewApproved') is False and x.get('businessSigned') is False and x.get('protectionObserved') == 'UNKNOWN'
    if rule == 'GOV6-R07': return bool(re.fullmatch('[a-f0-9]{40}',str(x.get('commitSha','')))) and all(re.fullmatch('[a-f0-9]{64}',str(x.get(k,''))) for k in ('sourceHash','binaryHash','outputHash')) and bool(x.get('frameId') and x.get('testCommand')) and x.get('productAcceptance') == 'NOT_RUN' and x.get('synthetic') is True
    if rule == 'GOV6-R08': return x.get('expectedRevision') == x.get('actualRevision') and x.get('authorizedAtCommit') is True and x.get('scopeEpoch') == x.get('receiptScopeEpoch') and x.get('frozenUnchanged') is True and x.get('cancelled') is False
    if rule == 'GOV6-R09': return set(x.get('entrypoints',[])) == {'GUI','CLI','Agent'} and len(x.get('entrypoints',[])) == 3 and x.get('domainPort') == 'GovernanceReviewPort@v1' and x.get('babylonWorldCount') == 1 and x.get('leftTaskPanelCount') == 1 and x.get('previewWrites') is False
    if rule == 'GOV6-R10': return all(x.get(k) == v for k,v in {'clStatus':'PREVIEW_ONLY','d13Status':'UNKNOWN','d14Status':'NOT_RUN','d15Status':'NOT_RUN','d16Status':'BLOCKED','materialSweepClaim':False}.items())
    raise ValueError('Unknown rule '+rule)

def check(root, mutations=False):
    load=lambda p:json.loads((root/p).read_text(encoding='utf-8'))
    src=load('research/sources/B0-06.json')
    tr=load('research/traces/B0-06.json')
    fx=load('docs/work-packages/B0-06/fixtures.json')
    rr=load('docs/work-packages/B0-06/owner-candidates.json')
    base=load('docs/architecture/v0.8/business-assets.json')
    owns={a['id']:a['owner'] for a in base['assets']}
    assert len(owns)==17 and len(rr['assetResponsibilities'])==17
    assert {a['assetId']:a['businessOwnerCandidateExact'] for a in rr['assetResponsibilities']}==owns
    assert rr['assetRegistryBlobSha']==tr['referenceAssetRegistry']['blobSha']
    assert len(src['sources'])==9==src['registeredRecords'] and len(tr['rules'])==10 and len(fx['cases'])==20 and len(tr['subtasks'])==10
    ss={v['id'] for v in src['sources']};assert len(ss)==9
    ids=set();ru=set(); positives={}
    for r in tr['rules']:
        assert r['id'] not in ru;ru.add(r['id'])
        assert r['workPackageId']=='B0-06' and r['fields'] and r['assets'] and set(r['sourceIds'])<=ss
        for key,expected in [('positiveTestId',True),('negativeTestId',False)]:
            v=next(c for c in fx['cases'] if c['caseId']==r[key])
            assert v['caseId'] not in ids;ids.add(v['caseId'])
            assert v['ruleId']==r['id'] and v['expectedEligible'] is expected and v['productAcceptance']=='NOT_RUN'
            assert accepted(r['id'],v['input'],owns,rr['assetRegistryBlobSha']) is expected
            assert v['expectedFailureCode'] == (None if expected else r['failureCode'])
            if expected: positives[r['id']]=v['input']
    assert len(ids)==20 and set(s['id'] for s in src['sources'] for _ in s['rules'])==ss
    n=0
    if mutations:
        cases=fx['cases']
        for r in tr['rules']:
            neg=next(c for c in cases if c['caseId']==r['negativeTestId'])
            assert not accepted(r['id'],neg['input'],owns,rr['assetRegistryBlobSha']);n+=1
    return {'sources':len(ss),'rules':len(ru),'cases':len(ids),'assets':len(owns),'negativeMutations':n,'result':'PASS','product':'NOT_RUN'}

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);ap.add_argument('--mutations',action='store_true');a=ap.parse_args();print(json.dumps(check(a.root,a.mutations),ensure_ascii=False,indent=2))

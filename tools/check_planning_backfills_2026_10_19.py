#!/usr/bin/env python3
"""Procet规划补证静态校验（2026-10-19新编），不会执行产品测试。"""
from __future__ import annotations
import argparse, json
from pathlib import Path
from collections import Counter

TARGETS = ('CAP-01-01','CAP-01-02','CAP-01-03','CAP-03-06','CAP-03-08',
           'CAP-04-01','B0-01','B0-02','B0-04','F1-05')
def require(ok, msg):
    if not ok: raise ValueError(msg)
def rows(obj, *keys):
    for key in keys:
        if isinstance(obj.get(key), list): return obj[key]
    return []
def read(root, path): return json.loads((root/path).read_text(encoding='utf-8'))
def pair(rule):
    for name in ('acceptanceIds','testIds','tests'):
        if isinstance(rule.get(name), list): return rule[name]
    for names in (('positiveAcceptanceId','negativeAcceptanceId'),
                  ('positiveTestId','negativeTestId'),
                  ('positiveAcceptance','negativeAcceptance')):
        if all(isinstance(rule.get(k), str) for k in names):
            return [rule[names[0]],rule[names[1]]]
    return []
def verify_document(source, trace, fixture, known_ids):
    source_rows=rows(source,'sources','records')
    rules=rows(trace,'rules'); tests=rows(fixture,'cases','scenarios')
    require(source_rows and len(source_rows)==len({x.get('id') for x in source_rows}),
            '来源为空或重复')
    require(len(rules)==10 and len(tests)==20,'规则/验收数量必须10/20')
    test_ids={x.get('id') for x in tests};require(len(test_ids)==20,'验收ID重复')
    require(all(x.get('productStatus')!='PASS' and x.get('execution')!='PASS' for x in tests),
            '不得冒充产品测试通过')
    covered=set()
    for r in rules:
        name=r.get('id') or r.get('ruleId');require(name,'规则缺少ID')
        refs=r.get('sourceIds') or []
        require(refs and all(s in known_ids for s in refs),'来源未登记：'+str(name))
        links=pair(r)
        require(len(links)>=2 and all(x in test_ids for x in links),
                '规则的正反验收不闭合：'+str(name))
        covered.update(links)
    require(covered==test_ids,'存在游离验收')
    return {'sources':len(source_rows),'rules':len(rules),'cases':len(tests),
            'productTests':'NOT_RUN'}
def verify_repo(root):
    ix=read(root,Path('research/source-index.json')); sources=[]
    for registry in ix['registries']:
        s=rows(read(root,Path(registry['path'])),'sources','records')
        require(len(s)==registry['registeredRecords'],'来源登记数不符：'+registry['path'])
        sources.extend(s)
    names=[s.get('id') for s in sources]
    duplicates=[n for n,c in Counter(names).items() if c>1]
    require(not duplicates,'跨注册表来源ID冲突：'+str(duplicates))
    require(len(names)==ix['registeredRecords'],'总登记数不符')
    outcome={}
    for target in TARGETS:
        prefix='docs/work-packages' if target.startswith(('B0-','F1-')) else 'docs/capabilities'
        outcome[target]=verify_document(
            read(root,Path('research/sources')/(target+'.json')),
            read(root,Path('research/traces')/(target+'.json')),
            read(root,Path(prefix)/target/'fixtures.json'), set(names))
    return {'scope':'PLANNING_STATIC_ONLY','registeredSources':len(sources),
            'items':outcome,'productTests':'NOT_RUN'}
def self_test():
    src={'sources':[{'id':'SRC-A'}]}
    trace={'rules':[{'id':f'R{i}','sourceIds':['SRC-A'],
                     'tests':[f'T{i}P',f'T{i}N']} for i in range(10)]}
    fixture={'cases':[{'id':f'T{i}{p}','productStatus':'NOT_RUN'}
                      for i in range(10) for p in 'PN']}
    require(verify_document(src,trace,fixture,{'SRC-A'})['cases']==20,'自测基础失败')
    import copy
    changes=[
        lambda a,b,c: a['sources'].append({'id':'SRC-A'}),
        lambda a,b,c: b['rules'].pop(),
        lambda a,b,c: c['cases'].pop(),
        lambda a,b,c: b['rules'][0].update(sourceIds=['MISSING']),
        lambda a,b,c: b['rules'][0].update(tests=['T0P','MISSING']),
        lambda a,b,c: c['cases'][0].update(id='T0N'),
        lambda a,b,c: c['cases'][0].update(productStatus='PASS')]
    for edit in changes:
        cloned=copy.deepcopy((src,trace,fixture));edit(*cloned)
        try: verify_document(*cloned,{'SRC-A'})
        except ValueError: continue
        raise AssertionError('未拒绝故意错误变异')
    return {'status':'PASS_SELF_TEST','negativeMutationsRejected':len(changes),
            'productTests':'NOT_RUN'}
if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--repo-root',type=Path)
    p.add_argument('--self-test',action='store_true')
    a=p.parse_args()
    if a.self_test: print(json.dumps(self_test(),ensure_ascii=False))
    elif a.repo_root: print(json.dumps(verify_repo(a.repo_root),ensure_ascii=False,indent=2))
    else: p.error('请指定 --self-test 或 --repo-root')

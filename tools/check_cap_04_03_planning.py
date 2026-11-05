#!/usr/bin/env python3
"""CAP-04-03独立规划校验；不执行任何OCCT、NC或实机测试。"""
from pathlib import Path
import json,copy,sys
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text(encoding='utf-8'))
def rank(matrix):
 a=[list(map(float,row)) for row in matrix];n=len(a);m=len(a[0]) if a else 0;k=0
 for j in range(m):
  if k>=n:break
  i=max(range(k,n),key=lambda z:abs(a[z][j]))
  if abs(a[i][j])<1e-9:continue
  a[k],a[i]=a[i],a[k];pivot=a[k][j]
  for q in range(j,m):a[k][q]/=pivot
  for t in range(n):
   if t!=k:
    factor=a[t][j]
    for q in range(j,m):a[t][q]-=factor*a[k][q]
  k+=1
 return k
def validate(trace,fixtures,register,math):
 errors=[]
 rules=trace.get('rules',[]);tests=fixtures.get('scenarios',[]);sources=register.get('sources',[])
 R={r['id']:r for r in rules};T={t['id']:t for t in tests};S={s['id']:s for s in sources}
 if not(len(R)==len(rules)==10):errors.append('10条唯一规则')
 if not(len(T)==len(tests)==20):errors.append('20项唯一测试')
 if not(len(S)==len(sources)==register.get('registeredRecords')==7):errors.append('7条唯一来源')
 if set(trace.get('registeredSources',[]))!=set(S):errors.append('来源索引不匹配')
 if trace.get('productAcceptance')!='NOT_RUN' or fixtures.get('productAcceptance')!='NOT_RUN':errors.append('误报产品验收')
 for s in sources:
  if s['accessDepth'] not in ('catalog_abstract','section_text','full_text','not_obtained'):errors.append('深度未知')
  if not all(s.get(x) for x in ('authors','edition','published','publisher','url','accessedOn','locator','limits')):errors.append('来源元数据缺失')
  if s['id'] in ('SRC-FIX-001','SRC-FIX-007') and s['accessDepth']=='full_text':errors.append('假冒ISO付费全文')
  for rid in s.get('rules',[]):
   if rid not in R or s['id'] not in R[rid].get('sourceIds',[]):errors.append('来源反向映射')
 for r in rules:
  ids=r.get('tests',[]);pair=[T.get(i) for i in ids]
  if len(pair)!=2 or any(p is None for p in pair):errors.append('规则双向验收缺失');continue
  if [p['polarity'] for p in pair]!=['positive','negative']:errors.append('缺正反例')
  if not r.get('fields') or not r.get('assets') or not r.get('workPackages'):errors.append('字段资产包不全')
  for sid in r.get('sourceIds',[]):
   if sid not in S or r['id'] not in S[sid].get('rules',[]):errors.append('规则来源断链')
  for p in pair:
   if r['id'] not in p['ruleIds'] or set(p['sourceIds'])!=set(r['sourceIds']) or not set(r['fields']).issubset(p['fields']) or p['workPackages']!=r['workPackages']:errors.append('验收反向映射')
   if p['productStatus']!='NOT_RUN' or not p['testEntry'].startswith('TODO_TEST_ENTRY:'):errors.append('虚构实际测试入口')
   if p['expectedOutcome'] not in ('ACCEPT','REJECT'):errors.append('验收期望缺失')
 for path in trace['paths'].values():
  if not (ROOT/path).is_file():errors.append('目标文件缺失 '+path)
 for c in math['contacts321']:
  x,y,z=c['point_mm'];nx,ny,nz=c['normal']
  if c['row']!=[nx,ny,nz,y*nz-z*ny,z*nx-x*nz,x*ny-y*nx]:errors.append('接触叉乘错误')
 for case in math['expectations']:
  if rank(case['rows'])!=case['rank']:errors.append('合成约束秩错误')
  if case['physicalStability']!='unknown':errors.append('rank冒充稳定性')
 return errors
def main():
 values=[read('research/traces/CAP-04-03.json'),read('docs/capabilities/CAP-04-03/fixtures.json'),read('research/sources/CAP-04-03.json'),read('docs/capabilities/CAP-04-03/constraint-examples.json')]
 errors=validate(*values)
 if errors:
  print('FAIL',errors);return 1
 mutations=[
  lambda v:v[1]['scenarios'][0].update(productStatus='PASS'),
  lambda v:v[0]['rules'][0]['tests'].pop(),
  lambda v:v[2]['sources'][0].update(accessDepth='full_text'),
  lambda v:v[3]['expectations'][0].update(rank=5),
  lambda v:v[0]['rules'][0].update(sourceIds=['UNKNOWN_SOURCE']),
  lambda v:v[1]['scenarios'][1].update(polarity='positive'),
 ]
 for i,m in enumerate(mutations,1):
  v=copy.deepcopy(values);m(v)
  if not validate(*v):print('FAIL: 漏检故意错误',i);return 2
 print('PASS: 7来源、10规则、20正反场景、接触rank；6项错误变异PASS；产品NOT_RUN')
 return 0
if __name__=='__main__':sys.exit(main())

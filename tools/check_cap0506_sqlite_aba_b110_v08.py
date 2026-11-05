#!/usr/bin/env python3
# CAP-05-06 B110 独立SQLite内存语义演示：只读规划校验，不连接用户数据
import hashlib
import sqlite3

A = hashlib.sha256(b"A").hexdigest()
B = hashlib.sha256(b"B").hexdigest()

def new_db():
    conn = sqlite3.connect(":memory:", isolation_level=None)
    conn.executescript("""
      CREATE TABLE head(id TEXT PRIMARY KEY, rev INTEGER NOT NULL, hash TEXT NOT NULL, epoch INTEGER NOT NULL);
      CREATE TABLE request_receipt(scope TEXT, request_id TEXT, payload_hash TEXT, receipt TEXT,
        PRIMARY KEY(scope,request_id));
    """)
    conn.execute("INSERT INTO head VALUES ('p',14,?,9)", (A,))
    return conn

def cas(conn, expected_rev=14, expected_hash=A, expected_epoch=9):
    conn.execute("BEGIN IMMEDIATE")
    rows = conn.execute("""
       UPDATE head SET rev=rev+1, hash=?, epoch=epoch+1
       WHERE id='p' AND rev=? AND hash=? AND epoch=?
       RETURNING rev,hash,epoch
    """, (B,expected_rev,expected_hash,expected_epoch)).fetchall()
    if len(rows) == 1:
        conn.execute("COMMIT")
    else:
        conn.execute("ROLLBACK")
    return rows

checks={}
db=new_db(); checks["normal"]=(cas(db)==[(15,B,10)])
db=new_db(); db.execute("UPDATE head SET rev=16,epoch=11 WHERE id='p'"); checks["aba_same_hash_stale"]=(cas(db)==[])
db=new_db(); db.execute("UPDATE head SET epoch=10 WHERE id='p'"); checks["same_hash_epoch_stale"]=(cas(db)==[])
db=new_db(); checks["replay_old_rev_stale"]=(len(cas(db))==1 and cas(db)==[])
db=new_db(); db.execute("INSERT INTO request_receipt VALUES ('s','k','payload-A','r-A')")
original=db.execute("SELECT payload_hash,receipt FROM request_receipt WHERE scope='s' AND request_id='k'").fetchone()
checks["idempotent_reconcile_only"]=(original==("payload-A","r-A"))
checks["conflicting_payload_rejected"]=(original[0]!="payload-B")
db=new_db(); db.execute("BEGIN IMMEDIATE"); db.execute("UPDATE head SET rev=17 WHERE id='p'"); db.execute("ROLLBACK")
checks["rollback_preserves_head"]=(db.execute("SELECT rev,hash,epoch FROM head").fetchone()==(14,A,9))
for name,passed in checks.items():
    print(name, "PASS" if passed else "FAIL")
assert all(checks.values())
print("SQLite合成隔离验证: 7/7 PASS (SQLite",sqlite3.sqlite_version,"); 不代表真实产品/跨库事务")

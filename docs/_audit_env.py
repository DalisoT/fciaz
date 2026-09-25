"""List every process.env.* variable the code reads."""
import os, re

root = r"C:\Users\RICHARD_TEMBO\Desktop\Projects\fciaz\src"
envs = set()
for dp, _, fns in os.walk(root):
    for fn in fns:
        if fn.endswith((".ts", ".tsx", ".js", ".mjs")):
            p = os.path.join(dp, fn)
            try:
                src = open(p, encoding="utf-8").read()
            except Exception:
                continue
            for m in re.finditer(r"process\.env\.([A-Z0-9_]+)", src):
                envs.add(m.group(1))

for env in sorted(envs):
    print(env)

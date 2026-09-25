"""Check locked react-is versions."""
import json

lock = json.load(open(r'C:\Users\RICHARD_TEMBO\Desktop\Projects\fciaz\package-lock.json'))
pkgs = lock.get('packages', {})
for k in sorted(pkgs.keys()):
    if 'react-is' in k:
        v = pkgs[k].get('version', '?')
        print(' ', k, '->', v)

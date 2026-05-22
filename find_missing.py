import glob
import re

all_pngs = glob.glob('c:/Antigravity_Projects/bahce_savasi/assets/**/*.png', recursive=True)
all_pngs = [p.replace('\\\\', '/').replace('\\', '/').replace('c:/Antigravity_Projects/bahce_savasi/', '') for p in all_pngs]

with open('c:/Antigravity_Projects/bahce_savasi/js/gorsel_yukleyici.js', 'r', encoding='utf-8') as f:
    content = f.read()

list_in_js = re.findall(r'"(assets/[^"]+)"', content)

missing = set(all_pngs) - set(list_in_js)
print(f'Total PNGs on disk: {len(all_pngs)}')
print(f'Total PNGs in JS: {len(list_in_js)}')
print('Missing from JS:')
for m in sorted(missing):
    print(m)

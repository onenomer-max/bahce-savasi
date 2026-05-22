import re

with open('c:/Antigravity_Projects/bahce_savasi/data/bitkiler.js', 'r', encoding='utf-8') as f:
    content = f.read()

# bezelye_atici
if '"mermi_gorsel":' not in content and '"mermi_görsel":' not in content.split('"bezelye_atici"')[1].split('}')[0]:
    content = re.sub(r'("bezelye_atici":.*?)"mermi_emoji":', r'\1"mermi_gorsel": "assets/mermiler/bezelye_mermi.png",\n    "mermi_emoji":', content, flags=re.DOTALL)

# kar_bezelye
content = re.sub(r'("kar_bezelye":.*?)("mermi_görsel"|"mermi_gorsel"): "[^"]*"', r'\1"mermi_gorsel": "assets/mermiler/kar_bezelye_mermi.png"', content, flags=re.DOTALL)

# patlayan_kavun
content = re.sub(r'("patlayan_kavun":.*?)("mermi_görsel"|"mermi_gorsel"): "[^"]*"', r'\1"mermi_gorsel": "assets/mermiler/patlayan_kavun_mermi.png"', content, flags=re.DOTALL)

# kaktus
content = re.sub(r'("kaktus":.*?)("mermi_görsel"|"mermi_gorsel"): "[^"]*"', r'\1"mermi_gorsel": "assets/mermiler/kaktus_dikeni.png"', content, flags=re.DOTALL)

with open('c:/Antigravity_Projects/bahce_savasi/data/bitkiler.js', 'w', encoding='utf-8') as f:
    f.write(content)

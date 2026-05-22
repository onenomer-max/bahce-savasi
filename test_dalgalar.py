import re
import json

path = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We can count the number of objects inside dalgalar: [ ... ]
dalgalar_block = re.search(r'"dalgalar":\s*\[(.*?)\]\s*\n\s*}', content, re.DOTALL)
if dalgalar_block:
    dalgalar_text = dalgalar_block.group(1)
    # count "no":
    count = len(re.findall(r'"no":', dalgalar_text))
    print("Dalga sayısı:", count)
    
    # Let's extract wave 30 and 50 using regex
    dalga30 = re.search(r'{\s*"no":\s*30,\s*"zombiler":\s*\[\s*(.*?)\s*\]\s*}', dalgalar_text, re.DOTALL)
    if dalga30:
        print("Dalga 30 (index 29): {\n  zombiler: [\n    " + dalga30.group(1).replace('\n', '\n  ') + "\n  ]\n}")
        
    dalga50 = re.search(r'{\s*"no":\s*50,\s*"zombiler":\s*\[\s*(.*?)\s*\]\s*}', dalgalar_text, re.DOTALL)
    if dalga50:
        print("Dalga 50 (index 49): {\n  zombiler: [\n    " + dalga50.group(1).replace('\n', '\n  ') + "\n  ]\n}")

import re

path = 'c:/Antigravity_Projects/bahce_savasi/data/bitkiler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I only want to remove "tip": "..." from the hybrids. The hybrids start after "gunes_atici": {
parts = content.split('"gunes_atici": {')
if len(parts) == 2:
    hybrids_part = parts[1]
    # Remove lines matching "tip": "...",
    hybrids_part = re.sub(r'\s*"tip"\s*:\s*"[^"]+",\n', '\n', hybrids_part)
    
    new_content = parts[0] + '"gunes_atici": {' + hybrids_part
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Could not find gunes_atici")

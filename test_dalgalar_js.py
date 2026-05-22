import json
import re

path = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make it valid JSON for python to parse
json_str = content.replace('const SEVIYELER_DATA = ', '').strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

# Javascript objects have unquoted keys often, but our file has quoted keys mostly.
# Except for "zombiler: [" inside the array and "tip: " and "gecikme: ".
# Let's fix up the unquoted keys to make it valid JSON
json_str = re.sub(r'(?<!")\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'"\1":', json_str)
# Remove comments
json_str = re.sub(r'//.*?\n', '\n', json_str)

try:
    data = json.loads(json_str)
    dalgalar = data["seviye_1"]["dalgalar"]
    print(f"Dalga sayısı: {len(dalgalar)}")
    
    # Print Dalga 30 (index 29)
    print("Dalga 30 (index 29):", json.dumps(dalgalar[29], indent=2, ensure_ascii=False))
    
    # Print Dalga 50 (index 49)
    print("Dalga 50 (index 49):", json.dumps(dalgalar[49], indent=2, ensure_ascii=False))
    
except Exception as e:
    print("Error parsing JSON:", e)

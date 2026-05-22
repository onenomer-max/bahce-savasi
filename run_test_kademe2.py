import re

# Test Seviyeler
path = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

no_count = len(re.findall(r'"no":', content))
print("Dalga sayısı:", no_count)

def get_dalga(index):
    no = index + 1
    pattern = r'\{\s*"no":\s*' + str(no) + r',\s*"dalga_gecikme_ms":.*?"zombiler":\s*\[(.*?)\]\s*\}'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        zombiler = match.group(1).strip()
        z_list = []
        for line in zombiler.split('\n'):
            line = line.strip()
            if line:
                if line.endswith(','):
                    line = line[:-1]
                z_list.append("    " + line)
        print(f"Dalga {no}: {{\n  zombiler: [\n" + ",\n".join(z_list) + "\n  ]\n}")
    else:
        print(f"Dalga {no} not found")

get_dalga(29)

# Test Zombiler
path_z = 'c:/Antigravity_Projects/bahce_savasi/data/zombiler.js'
with open(path_z, 'r', encoding='utf-8') as f:
    z_content = f.read()

match = re.search(r'"mekanik_zombi":\s*\{(.*?)\}', z_content, re.DOTALL)
if match:
    # Just show that it found the object
    print("Mekanik tipi: {", match.group(1).strip()[:50], "... }")
else:
    print("Mekanik tipi not found")

import re

path = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# count dalgas
no_count = len(re.findall(r'"no":', content))
print("Dalga sayısı:", no_count)

def get_dalga(index):
    no = index + 1
    pattern = r'\{\s*"no":\s*' + str(no) + r',\s*"zombiler":\s*\[(.*?)\]\s*\}'
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
        print(f"Dalga {no} (index {index}): {{\n  zombiler: [\n" + ",\n".join(z_list) + "\n  ]\n}")
    else:
        print(f"Dalga {no} not found")

get_dalga(29)
get_dalga(49)

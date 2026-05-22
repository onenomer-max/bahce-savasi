import re

path_seviyeler = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path_seviyeler, 'r', encoding='utf-8') as f:
    content = f.read()

new_waves = """      // Dalga 41
      {
        "no": 41,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1000},
          {"tip": "balonlu", "gecikme_ms": 2000},
          {"tip": "hizli", "gecikme_ms": 3000},
          {"tip": "balonlu", "gecikme_ms": 4500},
          {"tip": "kaskli", "gecikme_ms": 6000},
          {"tip": "hizli", "gecikme_ms": 7500},
          {"tip": "kaskli", "gecikme_ms": 9000}
        ]
      },
      // Dalga 42
      {
        "no": 42,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "balonlu", "gecikme_ms": 0},
          {"tip": "balonlu", "gecikme_ms": 1000},
          {"tip": "kaskli", "gecikme_ms": 2000},
          {"tip": "hizli", "gecikme_ms": 3000},
          {"tip": "kaskli", "gecikme_ms": 4500},
          {"tip": "balonlu", "gecikme_ms": 6000},
          {"tip": "hizli", "gecikme_ms": 7500},
          {"tip": "kaskli", "gecikme_ms": 9000},
          {"tip": "balonlu", "gecikme_ms": 10500}
        ]
      },
      // Dalga 43
      {
        "no": 43,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "hizli", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 800},
          {"tip": "kaskli", "gecikme_ms": 1800},
          {"tip": "balonlu", "gecikme_ms": 3000},
          {"tip": "hizli", "gecikme_ms": 4200},
          {"tip": "kaskli", "gecikme_ms": 5500},
          {"tip": "balonlu", "gecikme_ms": 7000},
          {"tip": "hizli", "gecikme_ms": 8500},
          {"tip": "kaskli", "gecikme_ms": 10000}
        ]
      },
      // Dalga 44
      {
        "no": 44,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 800},
          {"tip": "balonlu", "gecikme_ms": 1800},
          {"tip": "hizli", "gecikme_ms": 2800},
          {"tip": "kaskli", "gecikme_ms": 4000},
          {"tip": "balonlu", "gecikme_ms": 5200},
          {"tip": "hizli", "gecikme_ms": 6500},
          {"tip": "kaskli", "gecikme_ms": 7800},
          {"tip": "balonlu", "gecikme_ms": 9000},
          {"tip": "hizli", "gecikme_ms": 10500}
        ]
      },
      // Dalga 45
      {
        "no": 45,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "balonlu", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1000},
          {"tip": "hizli", "gecikme_ms": 2000},
          {"tip": "kaskli", "gecikme_ms": 3200},
          {"tip": "balonlu", "gecikme_ms": 4500},
          {"tip": "hizli", "gecikme_ms": 5800},
          {"tip": "kaskli", "gecikme_ms": 7000},
          {"tip": "balonlu", "gecikme_ms": 8200},
          {"tip": "hizli", "gecikme_ms": 9500},
          {"tip": "kaskli", "gecikme_ms": 11000}
        ]
      }"""

# Find the insertion point: right before the closing of dalgalar array
idx = content.rfind('        ]\n      }\n    ]\n  }\n};')
if idx != -1:
    content = content[:idx] + '        ]\n      },\n' + new_waves + '\n    ]\n  }\n};'
    with open(path_seviyeler, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added waves 41-45!")
else:
    print("Could not find insertion point!")

# Testing the result immediately in Python to provide the console output
no_count = len(re.findall(r'"no":', content))
print("Dalga sayısı:", no_count)

def get_dalga(index):
    no = index + 1
    pattern = r'\{\s*"no":\s*' + str(no) + r',\s*(?:"boss":\s*true,\s*)?"dalga_gecikme_ms":.*?"zombiler":\s*\[(.*?)\]\s*\}'
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

get_dalga(44)

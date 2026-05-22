import re

path_seviyeler = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path_seviyeler, 'r', encoding='utf-8') as f:
    content = f.read()

new_waves = """      // Dalga 31
      {
        "no": 31,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1000},
          {"tip": "kaskli", "gecikme_ms": 2500},
          {"tip": "balonlu", "gecikme_ms": 4000},
          {"tip": "hizli", "gecikme_ms": 5500},
          {"tip": "kaskli", "gecikme_ms": 7000}
        ]
      },
      // Dalga 32
      {
        "no": 32,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "hizli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1200},
          {"tip": "kaskli", "gecikme_ms": 2500},
          {"tip": "balonlu", "gecikme_ms": 4000},
          {"tip": "kaskli", "gecikme_ms": 5500},
          {"tip": "hizli", "gecikme_ms": 7000},
          {"tip": "kaskli", "gecikme_ms": 8500}
        ]
      },
      // Dalga 33
      {
        "no": 33,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "balonlu", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1500},
          {"tip": "balonlu", "gecikme_ms": 3000},
          {"tip": "hizli", "gecikme_ms": 4500},
          {"tip": "kaskli", "gecikme_ms": 6000},
          {"tip": "balonlu", "gecikme_ms": 7500},
          {"tip": "hizli", "gecikme_ms": 9000}
        ]
      },
      // Dalga 34
      {
        "no": 34,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1000},
          {"tip": "hizli", "gecikme_ms": 2000},
          {"tip": "hizli", "gecikme_ms": 3000},
          {"tip": "balonlu", "gecikme_ms": 4500},
          {"tip": "kaskli", "gecikme_ms": 6000},
          {"tip": "balonlu", "gecikme_ms": 7500},
          {"tip": "hizli", "gecikme_ms": 9000}
        ]
      },
      // Dalga 35
      {
        "no": 35,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "hizli", "gecikme_ms": 0},
          {"tip": "balonlu", "gecikme_ms": 1000},
          {"tip": "kaskli", "gecikme_ms": 2500},
          {"tip": "balonlu", "gecikme_ms": 4000},
          {"tip": "hizli", "gecikme_ms": 5500},
          {"tip": "kaskli", "gecikme_ms": 7000},
          {"tip": "balonlu", "gecikme_ms": 8500},
          {"tip": "kaskli", "gecikme_ms": 10000}
        ]
      }"""

# Find the insertion point: right before the closing of dalgalar array
idx = content.rfind('        ]\n      }\n    ]\n  }\n};')
if idx != -1:
    content = content[:idx] + '        ]\n      },\n' + new_waves + '\n    ]\n  }\n};'
    with open(path_seviyeler, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added waves 31-35!")
else:
    print("Could not find insertion point!")

# Testing the result immediately in Python to provide the console output
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

get_dalga(34)

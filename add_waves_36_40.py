import re

path_seviyeler = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path_seviyeler, 'r', encoding='utf-8') as f:
    content = f.read()

new_waves = """      // Dalga 36
      {
        "no": 36,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "balonlu", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1500},
          {"tip": "balonlu", "gecikme_ms": 3000},
          {"tip": "hizli", "gecikme_ms": 4500},
          {"tip": "kaskli", "gecikme_ms": 6000},
          {"tip": "balonlu", "gecikme_ms": 7500},
          {"tip": "kaskli", "gecikme_ms": 9000}
        ]
      },
      // Dalga 37
      {
        "no": 37,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1000},
          {"tip": "kaskli", "gecikme_ms": 2000},
          {"tip": "balonlu", "gecikme_ms": 3500},
          {"tip": "hizli", "gecikme_ms": 5000},
          {"tip": "kaskli", "gecikme_ms": 6500},
          {"tip": "balonlu", "gecikme_ms": 8000},
          {"tip": "kaskli", "gecikme_ms": 9500}
        ]
      },
      // Dalga 38
      {
        "no": 38,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "hizli", "gecikme_ms": 0},
          {"tip": "balonlu", "gecikme_ms": 1000},
          {"tip": "kaskli", "gecikme_ms": 2200},
          {"tip": "balonlu", "gecikme_ms": 3500},
          {"tip": "hizli", "gecikme_ms": 4800},
          {"tip": "kaskli", "gecikme_ms": 6000},
          {"tip": "balonlu", "gecikme_ms": 7500},
          {"tip": "hizli", "gecikme_ms": 9000}
        ]
      },
      // Dalga 39
      {
        "no": 39,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1000},
          {"tip": "balonlu", "gecikme_ms": 2000},
          {"tip": "hizli", "gecikme_ms": 3000},
          {"tip": "kaskli", "gecikme_ms": 4500},
          {"tip": "balonlu", "gecikme_ms": 6000},
          {"tip": "hizli", "gecikme_ms": 7500},
          {"tip": "kaskli", "gecikme_ms": 9000}
        ]
      },
      // Dalga 40 (Vampir Boss)
      {
        "no": 40,
        "dalga_gecikme_ms": 30000,
        "boss": true,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1500},
          {"tip": "vampir_zombi", "gecikme_ms": 3000},
          {"tip": "kaskli", "gecikme_ms": 5000},
          {"tip": "balonlu", "gecikme_ms": 7000},
          {"tip": "hizli", "gecikme_ms": 9000}
        ]
      }"""

# Find the insertion point: right before the closing of dalgalar array
idx = content.rfind('        ]\n      }\n    ]\n  }\n};')
if idx != -1:
    content = content[:idx] + '        ]\n      },\n' + new_waves + '\n    ]\n  }\n};'
    with open(path_seviyeler, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added waves 36-40!")
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

get_dalga(39)

path_oyun = 'c:/Antigravity_Projects/bahce_savasi/js/oyun.js'
with open(path_oyun, 'r', encoding='utf-8') as f:
    oyun_content = f.read()

old_vampir = """                        // Vampir Zombi HP Emer
                        if (zombi.tip === "vampir_zombi") {
                            const emilen = zombi.data.hasar * zombi.data.emme_orani;
                            zombi.hp = Math.min(zombi.hp + emilen, zombi.maxHp);
                        }"""
new_vampir = """                        // Vampir Zombi HP Emer
                        if (zombi.tip === "vampir_zombi") {
                            const emilen = zombi.data.hasar * zombi.data.emme_orani;
                            zombi.hp = Math.min(zombi.hp + emilen, zombi.maxHp);
                            console.log("🩸 Vampir HP emer:", emilen, "Yeni HP:", zombi.hp);
                        }"""
if old_vampir in oyun_content:
    with open(path_oyun, 'w', encoding='utf-8') as f:
        f.write(oyun_content.replace(old_vampir, new_vampir))
    print("Updated oyun.js vampir log")

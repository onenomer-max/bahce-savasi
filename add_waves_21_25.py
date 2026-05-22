import re

path = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_waves = """      // Dalga 21
      {
        "no": 21,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "normal", "gecikme_ms": 0},
          {"tip": "normal", "gecikme_ms": 2000},
          {"tip": "koni", "gecikme_ms": 4000},
          {"tip": "hizli", "gecikme_ms": 6000},
          {"tip": "normal", "gecikme_ms": 8000}
        ]
      },
      // Dalga 22
      {
        "no": 22,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "koni", "gecikme_ms": 0},
          {"tip": "normal", "gecikme_ms": 1500},
          {"tip": "hizli", "gecikme_ms": 3000},
          {"tip": "kaskli", "gecikme_ms": 5000},
          {"tip": "normal", "gecikme_ms": 7000}
        ]
      },
      // Dalga 23
      {
        "no": 23,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "hizli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1000},
          {"tip": "kaskli", "gecikme_ms": 3000},
          {"tip": "koni", "gecikme_ms": 5000},
          {"tip": "normal", "gecikme_ms": 6500},
          {"tip": "kaskli", "gecikme_ms": 8500}
        ]
      },
      // Dalga 24
      {
        "no": 24,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1500},
          {"tip": "balonlu", "gecikme_ms": 3000},
          {"tip": "koni", "gecikme_ms": 4500},
          {"tip": "kaskli", "gecikme_ms": 6000},
          {"tip": "hizli", "gecikme_ms": 8000}
        ]
      },
      // Dalga 25
      {
        "no": 25,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "hizli", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1000},
          {"tip": "balonlu", "gecikme_ms": 2500},
          {"tip": "kaskli", "gecikme_ms": 4000},
          {"tip": "hizli", "gecikme_ms": 5500},
          {"tip": "balonlu", "gecikme_ms": 7000},
          {"tip": "kaskli", "gecikme_ms": 9000}
        ]
      }"""

# Find the end of Dalga 20 block.
idx = content.rfind('        ]\n      }\n    ]\n  }\n};')
if idx != -1:
    content = content[:idx] + '        ]\n      },\n' + new_waves + '\n    ]\n  }\n};'
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added waves 21-25!")
else:
    print("Could not find insertion point!")

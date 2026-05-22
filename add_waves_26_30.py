import re
import json

# 1. Add Waves 26-30 to seviyeler.js
path_seviyeler = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path_seviyeler, 'r', encoding='utf-8') as f:
    content = f.read()

new_waves = """      // Dalga 26
      {
        "no": 26,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "hizli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1500},
          {"tip": "kaskli", "gecikme_ms": 3000},
          {"tip": "koni", "gecikme_ms": 4500},
          {"tip": "balonlu", "gecikme_ms": 6000},
          {"tip": "kaskli", "gecikme_ms": 8000}
        ]
      },
      // Dalga 27
      {
        "no": 27,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "hizli", "gecikme_ms": 1000},
          {"tip": "balonlu", "gecikme_ms": 2500},
          {"tip": "kaskli", "gecikme_ms": 4000},
          {"tip": "hizli", "gecikme_ms": 5500},
          {"tip": "balonlu", "gecikme_ms": 7000},
          {"tip": "kaskli", "gecikme_ms": 9000}
        ]
      },
      // Dalga 28
      {
        "no": 28,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "balonlu", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1500},
          {"tip": "hizli", "gecikme_ms": 3000},
          {"tip": "balonlu", "gecikme_ms": 4500},
          {"tip": "kaskli", "gecikme_ms": 6000},
          {"tip": "hizli", "gecikme_ms": 8000}
        ]
      },
      // Dalga 29
      {
        "no": 29,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          {"tip": "kaskli", "gecikme_ms": 0},
          {"tip": "kaskli", "gecikme_ms": 1000},
          {"tip": "hizli", "gecikme_ms": 2500},
          {"tip": "balonlu", "gecikme_ms": 4000},
          {"tip": "hizli", "gecikme_ms": 5000},
          {"tip": "kaskli", "gecikme_ms": 7000},
          {"tip": "balonlu", "gecikme_ms": 9000}
        ]
      },
      // Dalga 30 (Mekanik Boss)
      {
        "no": 30,
        "dalga_gecikme_ms": 30000,
        "boss": true,
        "zombiler": [
          {"tip": "normal", "gecikme_ms": 0},
          {"tip": "normal", "gecikme_ms": 1500},
          {"tip": "mekanik_zombi", "gecikme_ms": 3000},
          {"tip": "kaskli", "gecikme_ms": 5000},
          {"tip": "koni", "gecikme_ms": 7000}
        ]
      }"""

# Insert right after the last wave (Dalga 25)
idx = content.rfind('        ]\n      }\n    ]\n  }\n};')
if idx != -1:
    content = content[:idx] + '        ]\n      },\n' + new_waves + '\n    ]\n  }\n};'
    with open(path_seviyeler, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added waves 26-30!")
else:
    print("Could not find insertion point!")

# 2. Add Bosses back to zombiler.js
path_z = 'c:/Antigravity_Projects/bahce_savasi/data/zombiler.js'
with open(path_z, 'r', encoding='utf-8') as f:
    z_content = f.read()

if "mekanik_zombi" not in z_content:
    new_bosses = """  "mekanik_zombi": {
    "ad": "Mekanik Zombi",
    "emoji": "🤖",
    "görsel": "assets/zombiler/boss_mekanik.png",
    "boyut": 130,
    "hp": 3000,
    "hız": 0.4,
    "hasar": 50,
    "boss": true,
    "ozel_yetenek": "elektrik_soku",
    "sok_periyot_ms": 8000,
    "sok_sure_ms": 5000
  },
  "vampir_zombi": {
    "ad": "Vampir Zombi",
    "emoji": "🧛",
    "görsel": "assets/zombiler/boss_vampir.png",
    "boyut": 130,
    "hp": 4000,
    "hız": 0.45,
    "hasar": 60,
    "boss": true,
    "ozel_yetenek": "hp_emer",
    "emme_orani": 0.5
  },
  "zombi_kral": {
    "ad": "Zombi Kral",
    "emoji": "👑",
    "görsel": "assets/zombiler/boss_kral.png",
    "boyut": 160,
    "hp": 5000,
    "hız": 0.3,
    "hasar": 100,
    "boss": true,
    "ozel_yetenek": "spawn_kral",
    "spawn_periyot_ms": 4000,
    "immunite_periyot_ms": 10000
  }
};"""
    start_idx = z_content.rfind('}')
    z_content = z_content[:start_idx-1] + ",\n" + new_bosses
    with open(path_z, 'w', encoding='utf-8') as f:
        f.write(z_content)
    print("Added bosses to zombiler.js")
else:
    print("Bosses already exist in zombiler.js")

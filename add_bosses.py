import json

path = 'c:/Antigravity_Projects/bahce_savasi/data/zombiler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will append the 3 new bosses before the final closing brace.
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

start_idx = content.rfind('}')
content = content[:start_idx-1] + ",\n" + new_bosses

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated zombiler.js")

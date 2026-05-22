import re

path = 'c:/Antigravity_Projects/bahce_savasi/data/bitkiler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the end part starting from "gunes_atici"
start_idx = content.find('"gunes_atici": {')
if start_idx != -1:
    content = content[:start_idx]

hybrids_json = """  "gunes_atici": {
    "ad": "Güneş Atıcı",
    "emoji": "☀️🌱",
    "görsel": "assets/bitkiler/hibrit/gunes_atici.png",
    "maliyet": 175,
    "hp": 200,
    "atis_periyot_ms": 1200,
    "hasar": 35,
    "mermi_gorsel": "assets/mermiler/bezelye_mermi.png",
    "hedef_alabilir": ["yer"],
    "ozel_yetenek": "gunes_uretir",
    "gunes_periyot_ms": 6500,
    "gunes_miktar": 30,
    "hibrit": true,
    "acilma_seviye": 20
  },
  "dondurucu_mitralyoz": {
    "ad": "Dondurucu Mitralyöz",
    "emoji": "❄️💨",
    "görsel": "assets/bitkiler/hibrit/dondurucu_mitralyoz.png",
    "maliyet": 325,
    "hp": 200,
    "atis_periyot_ms": 500,
    "hasar": 25,
    "mermi_gorsel": "assets/mermiler/kar_bezelye_mermi.png",
    "hedef_alabilir": ["yer"],
    "yavaslatma": true,
    "yavaslatma_oran": 0.5,
    "yavaslatma_sure_ms": 3000,
    "hibrit": true,
    "acilma_seviye": 25
  },
  "buz_kalesi": {
    "ad": "Buz Kalesi",
    "emoji": "🥜🧊",
    "görsel": "assets/bitkiler/hibrit/buz_kalesi.png",
    "maliyet": 250,
    "hp": 800,
    "ozel_yetenek": "temas_dondurur",
    "temas_dondur_sure_ms": 2000,
    "savunma_bitki": true,
    "hibrit": true,
    "acilma_seviye": 30
  },
  "patlayan_hava_topu": {
    "ad": "Patlayan Hava Topu",
    "emoji": "🌵💥",
    "görsel": "assets/bitkiler/hibrit/patlayan_hava_topu.png",
    "maliyet": 325,
    "hp": 100,
    "patlayici": true,
    "patlama_alani": 3,
    "patlama_hasar": 300,
    "patlama_gecikme_ms": 1500,
    "hedef_alabilir": ["yer", "hava"],
    "hibrit": true,
    "acilma_seviye": 35
  },
  "buz_kavunu": {
    "ad": "Buz Kavunu",
    "emoji": "🍉🧊",
    "görsel": "assets/bitkiler/hibrit/buz_kavunu.png",
    "maliyet": 550,
    "hp": 250,
    "atis_periyot_ms": 2500,
    "hasar": 120,
    "mermi_gorsel": "assets/mermiler/patlayan_kavun_mermi.png",
    "hedef_alabilir": ["yer"],
    "alan_hasar": true,
    "alan_hasar_radius": 2,
    "donduran": true,
    "dondur_sure_ms": 2000,
    "hibrit": true,
    "acilma_seviye": 40
  },
  "zirhli_aycicegi": {
    "ad": "Zırhlı Ayçiçeği",
    "emoji": "🌻🛡️",
    "görsel": "assets/bitkiler/hibrit/zirhli_aycicegi.png",
    "maliyet": 125,
    "hp": 600,
    "ozel_yetenek": "gunes_uretir",
    "gunes_periyot_ms": 7000,
    "gunes_miktar": 30,
    "vurulurken_uretir": true,
    "hibrit": true,
    "acilma_seviye": 45
  }
};
"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(content + hybrids_json)
print("Updated data/bitkiler.js")

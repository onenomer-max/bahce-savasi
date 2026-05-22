// data/zombiler.js
// Bu dosya oyundaki zombilerin özelliklerini belirler. Çocuklar buradaki değerleri değiştirebilir.
const ZOMBILER_DATA = {
  "normal": {
    "ad": "Normal Zombi",
    "emoji": "🧟",
    "görsel": "assets/zombiler/zombi_normal.png",
    "hp": 100,
    "hiz": 0.3,
    "isirma_hasar": 25,
    "isirma_periyot_ms": 1000
  },
  "koni": {
    "ad": "Koni Başlıklı Zombi",
    "emoji": "🧟‍♂️",
    "görsel": "assets/zombiler/zombi_koni.png",
    "hp": 200,
    "hiz": 0.3,
    "isirma_hasar": 25,
    "isirma_periyot_ms": 1000
  },
  "hizli": {
    "ad": "Hızlı Zombi",
    "emoji": "🏃",
    "görsel": "assets/zombiler/zombi_hizli.png",
    "hp": 100,
    "hiz": 0.6,
    "isirma_hasar": 25,
    "isirma_periyot_ms": 1000
  },
  "kaskli": {
    "ad": "Kasklı Zombi",
    "emoji": "⛑️",
    "görsel": "assets/zombiler/zombi_kaskli.png",
    "hp": 350,
    "hiz": 0.3,
    "isirma_hasar": 25,
    "isirma_periyot_ms": 1000
  },
  "balonlu": {
    "ad": "Balonlu Zombi",
    "emoji": "🎈",
    "görsel": "assets/zombiler/zombi_balonlu.png",
    "hp": 80,
    "hiz": 0.4,
    "isirma_hasar": 25,
    "isirma_periyot_ms": 1000,
    "havasal": true
  },
  "gulyabani": {
    "ad": "Gulyabani",
    "emoji": "👹",
    "görsel": "assets/zombiler/boss_gulyabani.png",
    "hp": 2500,
    "hiz": 0.15,
    "isirma_hasar": 200,
    "isirma_periyot_ms": 1500,
    "boyut": 144,
    "boss": true,
    "ozel_mekanik": "hiddet",
    "boss_baslik": "👹 GULYABANI YAKLAŞIYOR! 👹"
  },
  "nekromant": {
    "ad": "Nekromant",
    "emoji": "🧙",
    "görsel": "assets/zombiler/boss_nekromant.png",
    "hp": 1500,
    "hiz": 0.25,
    "isirma_hasar": 50,
    "isirma_periyot_ms": 1500,
    "boyut": 128,
    "boss": true,
    "ozel_mekanik": "diriltme",
    "ozel_periyot_ms": 6000,
    "boss_baslik": "🧙 NEKROMANT GELİYOR! 🧙"
  },
  "mekanik_zombi": {
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
};

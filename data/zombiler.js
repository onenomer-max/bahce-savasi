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
  }
};

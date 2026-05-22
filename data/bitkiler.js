// data/bitkiler.js
// Bu dosya oyundaki bitkilerin özelliklerini belirler. Çocuklar buradaki değerleri değiştirebilir.
const BITKILER_DATA = {
  "aycicegi": {
    "ad": "Ayçiçeği",
    "emoji": "🌻",
    "görsel": "assets/bitkiler/aycicegi.png",
    "maliyet": 50,
    "hp": 50,
    "tip": "uretici",
    "uretim_periyot_ms": 8000,
    "uretim_miktari": 25,
    "yetenek": {
      "ad": "Güneş Patlaması",
      "etki": "anlik_gunes",
      "miktar": 50,
      "cooldown_ms": 60000
    }
  },
  "bezelye_atici": {
    "ad": "Bezelye Atıcısı",
    "emoji": "🌱",
    "görsel": "assets/bitkiler/bezelye_atici.png",
    "maliyet": 100,
    "hp": 100,
    "tip": "saldirgan",
    "atis_periyot_ms": 1500,
    "hasar": 20,
    "mermi_gorsel": "assets/mermiler/bezelye_mermi.png",
    "mermi_emoji": "🟢",
    "mermi_hizi": 5,
    "yetenek": {
      "ad": "Bezelye Yağmuru",
      "etki": "hizli_atis",
      "sure_ms": 5000,
      "carpan": 3,
      "cooldown_ms": 45000
    }
  },
  "ceviz": {
    "ad": "Ceviz",
    "emoji": "🥜",
    "görsel": "assets/bitkiler/ceviz.png",
    "maliyet": 50,
    "hp": 400,
    "tip": "savunma",
    "yetenek": {
      "ad": "Sertleşme",
      "etki": "sertlesme",
      "sure_ms": 10000,
      "cooldown_ms": 30000
    }
  },
  "kar_bezelye": {
    "ad": "Kar Bezelye",
    "emoji": "❄️",
    "görsel": "assets/bitkiler/kar_bezelye.png",
    "maliyet": 175,
    "hp": 100,
    "tip": "saldirgan",
    "atis_periyot_ms": 1500,
    "hasar": 20,
    "mermi_emoji": "🟦",
    "mermi_gorsel": "assets/mermiler/kar_bezelye_mermi.png",
    "mermi_hizi": 5,
    "yavaslatma_sure_ms": 3000,
    "yavaslatma_oran": 0.5,
    "yetenek": {
      "ad": "Buz Patlaması",
      "etki": "buz_patlamasi",
      "sure_ms": 3000,
      "cooldown_ms": 60000
    }
  },
  "patlayan_kavun": {
    "ad": "Patlayan Kavun",
    "emoji": "🍉",
    "görsel": "assets/bitkiler/patlayan_kavun.png",
    "maliyet": 325,
    "hp": 100,
    "tip": "alan_saldirgan",
    "atis_periyot_ms": 3000,
    "hasar": 80,
    "alan_yaricap": 1,
    "mermi_emoji": "🍈",
    "mermi_gorsel": "assets/mermiler/patlayan_kavun_mermi.png",
    "mermi_hizi": 4,
    "yetenek": {
      "ad": "Kavun Yağmuru",
      "etki": "kavun_yagmuru",
      "atis_sayisi": 3,
      "cooldown_ms": 30000
    }
  },
  "patlayan_kiraz": {
    "ad": "Patlayan Kiraz",
    "emoji": "🍒",
    "görsel": "assets/bitkiler/patlayan_kiraz.png",
    "maliyet": 150,
    "hp": 1,
    "tip": "tek_seferlik_patlama",
    "patlama_gecikme_ms": 1500,
    "hasar": 200,
    "alan_yaricap": 1
  },
  "kaktus": {
    "ad": "Kaktüs",
    "emoji": "🌵",
    "görsel": "assets/bitkiler/kaktus.png",
    "maliyet": 125,
    "hp": 100,
    "tip": "havasal_saldirgan",
    "atis_periyot_ms": 1500,
    "hasar": 20,
    "mermi_emoji": "🟢",
    "mermi_gorsel": "assets/mermiler/kaktus_dikeni.png",
    "mermi_hizi": 5,
    "hedef_alabilir": ["yer", "hava"],
    "yetenek": {
      "ad": "Sivri Yağmuru",
      "etki": "sivri_yagmuru",
      "cooldown_ms": 45000
    }
  }
};

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
  },
    "gunes_atici": {
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

const FUSION_TARIFLERI = {
  "aycicegi+bezelye_atici": { sonuc: "gunes_atici", acilma_seviye: 20 },
  "bezelye_atici+aycicegi": { sonuc: "gunes_atici", acilma_seviye: 20 },
  
  "bezelye_atici+kar_bezelye": { sonuc: "dondurucu_mitralyoz", acilma_seviye: 25 },
  "kar_bezelye+bezelye_atici": { sonuc: "dondurucu_mitralyoz", acilma_seviye: 25 },
  
  "ceviz+kar_bezelye": { sonuc: "buz_kalesi", acilma_seviye: 30 },
  "kar_bezelye+ceviz": { sonuc: "buz_kalesi", acilma_seviye: 30 },
  
  "kaktus+patlayan_kiraz": { sonuc: "patlayan_hava_topu", acilma_seviye: 35 },
  "patlayan_kiraz+kaktus": { sonuc: "patlayan_hava_topu", acilma_seviye: 35 },
  
  "patlayan_kavun+kar_bezelye": { sonuc: "buz_kavunu", acilma_seviye: 40 },
  "kar_bezelye+patlayan_kavun": { sonuc: "buz_kavunu", acilma_seviye: 40 },
  
  "aycicegi+ceviz": { sonuc: "zirhli_aycicegi", acilma_seviye: 45 },
  "ceviz+aycicegi": { sonuc: "zirhli_aycicegi", acilma_seviye: 45 },
  "ceviz+ceviz": { sonuc: "squash", acilma_seviye: 30 }
};

const MAKSIMUM_ACILMIS_SEVIYE_KEY = "bahce_savasi_max_seviye";

// İlk yüklemede - eğer hiç ilerleme yoksa Doruk için 20'yi başlangıç olarak ayarla
if (localStorage.getItem(MAKSIMUM_ACILMIS_SEVIYE_KEY) === null) {
  maksimumAcilanSeviyeKaydet(20);
}

function maksimumAcilanSeviyeAl() {
  return parseInt(localStorage.getItem(MAKSIMUM_ACILMIS_SEVIYE_KEY) || "0");
}

function maksimumAcilanSeviyeKaydet(seviye) {
  const mevcut = maksimumAcilanSeviyeAl();
  if (seviye > mevcut) {
    localStorage.setItem(MAKSIMUM_ACILMIS_SEVIYE_KEY, seviye.toString());
  }
}

function fusionAcikMi(tarif) {
  return maksimumAcilanSeviyeAl() >= tarif.acilma_seviye;
}

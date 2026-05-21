// data/seviyeler.js
// Bu dosya oyundaki dalgaları ve bölümleri belirler.
const SEVIYELER_DATA = {
  "seviye_1": {
    "ad": "Bahçeye Hoş Geldin",
    "baslangic_gunes": 50,
    "dalgalar": [
      // Dalga 1: Tutorial
      {
        "no": 1,
        "zombiler": [
          { "tip": "normal", "satir": 2, "gecikme_ms": 5000 },
          { "tip": "normal", "satir": 0, "gecikme_ms": 8000 },
          { "tip": "normal", "satir": 4, "gecikme_ms": 11000 },
          { "tip": "normal", "satir": 1, "gecikme_ms": 14000 },
          { "tip": "normal", "satir": 3, "gecikme_ms": 17000 }
        ]
      },
      // Dalga 2: Normal + Koni
      {
        "no": 2,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "normal", "satir": 0, "gecikme_ms": 0 },
          { "tip": "normal", "satir": 1, "gecikme_ms": 2000 },
          { "tip": "normal", "satir": 2, "gecikme_ms": 4000 },
          { "tip": "normal", "satir": 3, "gecikme_ms": 6000 },
          { "tip": "normal", "satir": 4, "gecikme_ms": 8000 },
          { "tip": "koni", "satir": 2, "gecikme_ms": 10000 },
          { "tip": "koni", "satir": 3, "gecikme_ms": 12000 },
          { "tip": "normal", "satir": 0, "gecikme_ms": 14000 }
        ]
      },
      // Dalga 3: Koni ağırlıklı
      {
        "no": 3,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "koni", "satir": 0, "gecikme_ms": 0 },
          { "tip": "koni", "satir": 2, "gecikme_ms": 1000 },
          { "tip": "koni", "satir": 4, "gecikme_ms": 2000 },
          { "tip": "normal", "satir": 1, "gecikme_ms": 3000 },
          { "tip": "normal", "satir": 3, "gecikme_ms": 4000 },
          { "tip": "koni", "satir": 1, "gecikme_ms": 5000 },
          { "tip": "koni", "satir": 3, "gecikme_ms": 6000 }
        ]
      },
      // Dalga 4: İlk Hızlı zombi tanıtımı
      {
        "no": 4,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "hizli", "satir": 2, "gecikme_ms": 0 },
          { "tip": "hizli", "satir": 4, "gecikme_ms": 4000 },
          { "tip": "normal", "satir": 1, "gecikme_ms": 6000 },
          { "tip": "koni", "satir": 3, "gecikme_ms": 8000 }
        ]
      },
      // Dalga 5: Mini boss konsepti (sadece çok kalabalık, normal+koni+hızlı karışık)
      {
        "no": 5,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "hizli", "satir": 0, "gecikme_ms": 0 },
          { "tip": "hizli", "satir": 4, "gecikme_ms": 1000 },
          { "tip": "koni", "satir": 1, "gecikme_ms": 2000 },
          { "tip": "koni", "satir": 2, "gecikme_ms": 3000 },
          { "tip": "koni", "satir": 3, "gecikme_ms": 4000 },
          { "tip": "normal", "satir": 0, "gecikme_ms": 5000 },
          { "tip": "normal", "satir": 2, "gecikme_ms": 6000 },
          { "tip": "normal", "satir": 4, "gecikme_ms": 7000 }
        ]
      },
      // Dalga 6: Kasklı tanıtımı
      {
        "no": 6,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "kaskli", "satir": 2, "gecikme_ms": 0 },
          { "tip": "normal", "satir": 1, "gecikme_ms": 4000 },
          { "tip": "normal", "satir": 3, "gecikme_ms": 6000 }
        ]
      },
      // Dalga 7: Kasklı devam
      {
        "no": 7,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "kaskli", "satir": 0, "gecikme_ms": 0 },
          { "tip": "kaskli", "satir": 4, "gecikme_ms": 2000 },
          { "tip": "koni", "satir": 2, "gecikme_ms": 4000 },
          { "tip": "hizli", "satir": 1, "gecikme_ms": 6000 }
        ]
      },
      // Dalga 8: Balonlu tanıtımı
      {
        "no": 8,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "balonlu", "satir": 2, "gecikme_ms": 0 },
          { "tip": "balonlu", "satir": 4, "gecikme_ms": 3000 },
          { "tip": "normal", "satir": 1, "gecikme_ms": 5000 },
          { "tip": "normal", "satir": 3, "gecikme_ms": 7000 }
        ]
      },
      // Dalga 9: Boss öncesi son hazırlık (karışık ama az)
      {
        "no": 9,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "hizli", "satir": 0, "gecikme_ms": 0 },
          { "tip": "koni", "satir": 2, "gecikme_ms": 2000 },
          { "tip": "kaskli", "satir": 4, "gecikme_ms": 4000 }
        ]
      },
      // Dalga 10: 🔥 GULYABANI BOSS + 5 normal zombi destek
      {
        "no": 10,
        "dalga_gecikme_ms": 30000,
        "zombiler": [
          { "tip": "gulyabani", "satir": 2, "gecikme_ms": 0 },
          { "tip": "normal", "satir": 0, "gecikme_ms": 2000 },
          { "tip": "normal", "satir": 4, "gecikme_ms": 4000 },
          { "tip": "normal", "satir": 1, "gecikme_ms": 6000 },
          { "tip": "normal", "satir": 3, "gecikme_ms": 8000 },
          { "tip": "normal", "satir": 2, "gecikme_ms": 10000 }
        ]
      },
      // Dalga 11: Boss sonrası, zorluk artıyor
      {
        "no": 11,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "balonlu", "satir": 0, "gecikme_ms": 0 },
          { "tip": "balonlu", "satir": 4, "gecikme_ms": 1000 },
          { "tip": "hizli", "satir": 2, "gecikme_ms": 3000 },
          { "tip": "kaskli", "satir": 1, "gecikme_ms": 5000 }
        ]
      },
      // Dalga 12
      {
        "no": 12,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "hizli", "satir": 0, "gecikme_ms": 0 },
          { "tip": "hizli", "satir": 1, "gecikme_ms": 1000 },
          { "tip": "hizli", "satir": 3, "gecikme_ms": 2000 },
          { "tip": "hizli", "satir": 4, "gecikme_ms": 3000 },
          { "tip": "koni", "satir": 2, "gecikme_ms": 5000 }
        ]
      },
      // Dalga 13
      {
        "no": 13,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "kaskli", "satir": 0, "gecikme_ms": 0 },
          { "tip": "kaskli", "satir": 4, "gecikme_ms": 2000 },
          { "tip": "balonlu", "satir": 2, "gecikme_ms": 4000 },
          { "tip": "balonlu", "satir": 1, "gecikme_ms": 6000 }
        ]
      },
      // Dalga 14
      {
        "no": 14,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "koni", "satir": 0, "gecikme_ms": 0 },
          { "tip": "hizli", "satir": 1, "gecikme_ms": 1000 },
          { "tip": "kaskli", "satir": 2, "gecikme_ms": 2000 },
          { "tip": "hizli", "satir": 3, "gecikme_ms": 3000 },
          { "tip": "koni", "satir": 4, "gecikme_ms": 4000 }
        ]
      },
      // Dalga 15: Çok kalabalık karışık dalga
      {
        "no": 15,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "hizli", "satir": 0, "gecikme_ms": 0 },
          { "tip": "kaskli", "satir": 1, "gecikme_ms": 1000 },
          { "tip": "balonlu", "satir": 2, "gecikme_ms": 2000 },
          { "tip": "koni", "satir": 3, "gecikme_ms": 3000 },
          { "tip": "hizli", "satir": 4, "gecikme_ms": 4000 },
          { "tip": "kaskli", "satir": 0, "gecikme_ms": 5000 },
          { "tip": "balonlu", "satir": 4, "gecikme_ms": 6000 },
          { "tip": "normal", "satir": 2, "gecikme_ms": 7000 }
        ]
      },
      // Dalga 16: En zor 4 dalga
      {
        "no": 16,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "kaskli", "satir": 1, "gecikme_ms": 0 },
          { "tip": "kaskli", "satir": 3, "gecikme_ms": 1000 },
          { "tip": "hizli", "satir": 0, "gecikme_ms": 2000 },
          { "tip": "hizli", "satir": 4, "gecikme_ms": 3000 },
          { "tip": "balonlu", "satir": 2, "gecikme_ms": 4000 }
        ]
      },
      // Dalga 17
      {
        "no": 17,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "balonlu", "satir": 0, "gecikme_ms": 0 },
          { "tip": "balonlu", "satir": 1, "gecikme_ms": 1000 },
          { "tip": "balonlu", "satir": 3, "gecikme_ms": 2000 },
          { "tip": "balonlu", "satir": 4, "gecikme_ms": 3000 },
          { "tip": "kaskli", "satir": 2, "gecikme_ms": 4000 }
        ]
      },
      // Dalga 18
      {
        "no": 18,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "kaskli", "satir": 0, "gecikme_ms": 0 },
          { "tip": "kaskli", "satir": 2, "gecikme_ms": 1000 },
          { "tip": "kaskli", "satir": 4, "gecikme_ms": 2000 },
          { "tip": "hizli", "satir": 1, "gecikme_ms": 3000 },
          { "tip": "hizli", "satir": 3, "gecikme_ms": 4000 }
        ]
      },
      // Dalga 19
      {
        "no": 19,
        "dalga_gecikme_ms": 20000,
        "zombiler": [
          { "tip": "kaskli", "satir": 1, "gecikme_ms": 0 },
          { "tip": "balonlu", "satir": 2, "gecikme_ms": 1000 },
          { "tip": "kaskli", "satir": 3, "gecikme_ms": 2000 },
          { "tip": "hizli", "satir": 0, "gecikme_ms": 3000 },
          { "tip": "hizli", "satir": 4, "gecikme_ms": 4000 },
          { "tip": "koni", "satir": 2, "gecikme_ms": 5000 }
        ]
      },
      // Dalga 20: 🔥 NEKROMANT BOSS + 3 Kasklı + 3 Balonlu + 5 Normal
      {
        "no": 20,
        "final": true,
        "dalga_gecikme_ms": 30000,
        "zombiler": [
          { "tip": "nekromant", "satir": 2, "gecikme_ms": 0 },
          
          { "tip": "kaskli", "satir": 0, "gecikme_ms": 2000 },
          { "tip": "kaskli", "satir": 4, "gecikme_ms": 4000 },
          { "tip": "kaskli", "satir": 1, "gecikme_ms": 6000 },
          
          { "tip": "balonlu", "satir": 3, "gecikme_ms": 8000 },
          { "tip": "balonlu", "satir": 0, "gecikme_ms": 10000 },
          { "tip": "balonlu", "satir": 4, "gecikme_ms": 12000 },
          
          { "tip": "normal", "satir": 1, "gecikme_ms": 14000 },
          { "tip": "normal", "satir": 2, "gecikme_ms": 15000 },
          { "tip": "normal", "satir": 3, "gecikme_ms": 16000 },
          { "tip": "normal", "satir": 0, "gecikme_ms": 17000 },
          { "tip": "normal", "satir": 4, "gecikme_ms": 18000 }
        ]
      }
    ]
  }
};

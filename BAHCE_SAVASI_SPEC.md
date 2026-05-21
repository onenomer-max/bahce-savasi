# Bahçe Savaşı — Plants vs Zombies Tarzı Web Oyunu

**Versiyon:** v0.1 (İlk Prototip)
**Hedef Kitle:** Doruk (11 yaş) ve Sarp (6 yaş, okuma-yazma bilmiyor)
**Geliştirme Yaklaşımı:** Önce baba (Ömer) ile çalışır prototip, sonra çocukların özelleştirmesi.

---

## 🎯 PROJE FELSEFESİ (ÖNEMLİ — AGENT BUNU ANLAMALI)

Bu sıradan bir oyun projesi DEĞİL. Bu, iki çocuğa kodlama dünyasının kapısını aralayacak bir öğretim aracı. Bu yüzden aşağıdaki **mimari ilkeler kesinlikle uyulmalı**:

### İlke 1: "Data-Driven Design"
Oyun mekaniğinin TÜM parametreleri (HP, hasar, maliyet, cooldown, hız) **kod içinde sabitlenmiş değil**, ayrı JSON dosyalarında olacak. Çocuk JSON'u açıp sayıyı değiştirince oyun anında değişmeli.

**ÖRNEK:**
```json
// data/plants.json
{
  "bezelye_atici": {
    "ad": "Bezelye Atıcısı",
    "emoji": "🌱",
    "maliyet": 100,
    "hp": 100,
    "hasar": 20,
    "atis_hizi_ms": 1500
  }
}
```

Doruk `"hasar": 20` yazısını `"hasar": 100` yapınca bezelye anında öldürücü olmalı. Bu, çocuğun kodla ilk teması.

### İlke 2: Aşırı Yorumlanmış Kod
Kod İngilizce DEĞİL, **Türkçe yorumlu** olmalı. Her fonksiyonun üstünde "BU FONKSİYON NE YAPAR" açıklaması olmalı. Doruk kodu okuyabilmeli.

**ÖRNEK:**
```javascript
// Bu fonksiyon her saniye çalışır ve zombileri sola doğru hareket ettirir.
// Eğer zombi en sola ulaşırsa oyun biter (zombiler eve girdi!).
function zombileriHareketEttir() {
  // ...
}
```

### İlke 3: Değişken İsimleri Türkçe
- ✅ `let guneşSayisi = 50;`
- ❌ `let sunCount = 50;`

İstisna: HTML/CSS standart terimleri (canvas, div, class) İngilizce kalabilir.

### İlke 4: Emoji + Renkli Kareler (V0.1'de Sanat Yok)
Bitkiler, zombiler, mermiler → emoji ile temsil edilecek (🌻 🌱 🥜 🧟). Bu **kasıtlı**. İleride Sarp kendi çizimlerini PNG olarak ekleyecek.

### İlke 5: Console.log ile Anlatıcı
Her önemli olayda Türkçe console mesajı: "🌻 Ayçiçeği güneş üretti! (+25 güneş)", "🧟 Zombi öldü!", "💀 OYUN BİTTİ!". Doruk F12 ile console açıp oyunu okuyabilmeli.

---

## 🎮 OYNANIŞ (V0.1)

### Sahne
- **Izgara:** 5 satır × 9 sütun (klasik PvZ)
- **Yön:** Zombiler sağdan gelir, sola doğru ilerler, en sola ulaşırlarsa oyun biter
- **Canvas boyutu:** 1280×720 (16:9, browserda rahat görünür)

### Kaynak: Güneş
- Başlangıçta **50 güneş** ile başla
- Gökten **rastgele her 10 saniyede 1 güneş** düşer (değeri: +25)
- Ayçiçeği bitkisi her **8 saniyede 1 güneş** üretir (değeri: +25)
- Güneşler ekranda görünür, **tıklayınca toplanır**, eğer 10 saniye toplanmazsa kaybolur

### Bitkiler (3 tip)

| Bitki | Emoji | Maliyet | HP | Görev |
|-------|-------|---------|----|----|
| Ayçiçeği | 🌻 | 50 | 50 | Her 8 sn'de +25 güneş üretir |
| Bezelye Atıcısı | 🌱 | 100 | 100 | Her 1.5 sn'de aynı satırdaki en yakın zombiye 20 hasar bezelye atar |
| Ceviz | 🥜 | 50 | 400 | Hiçbir şey yapmaz, sadece engel olur (kalkan) |

### Zombiler (2 tip)

| Zombi | Emoji | HP | Hız | Hasar |
|-------|-------|----|----|-------|
| Normal Zombi | 🧟 | 100 | yavaş | Bitkiyi her 1 sn'de 25 hasar ısırır |
| Koni Zombi | 🧟‍♂️ | 200 | yavaş | Aynı şekilde ısırır |

### Dalgalar (V0.1: Tek Level)
- **Dalga 1:** 5 normal zombi (her 3 saniyede 1 tane gelir)
- **Dalga 2:** 8 normal zombi + 2 koni zombi
- **Dalga 3 (FINAL):** 10 zombi karışık (5 normal + 5 koni), hızlı gelir

Tüm zombiler ölürse → **KAZANDIN!** ekranı
Bir zombi en sola ulaşırsa → **KAYBETTIN!** ekranı

### Kontroller
1. Alt menüde 3 bitki kartı (🌻 🌱 🥜)
2. Karta tıkla → bitki seçili
3. Izgaraya tıkla → bitki yerleşir (yeterli güneş varsa)
4. Sağ tık → seçimi iptal
5. Gökten düşen güneşe tıkla → topla
6. "Başla" düğmesi ile dalgalar başlar

---

## 🗂️ DOSYA YAPISI

```
bahce-savasi/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js              # Oyun döngüsü, başlangıç
│   ├── oyun.js              # Oyun durumu (state)
│   ├── izgara.js            # 5x9 ızgara mantığı
│   ├── bitki.js             # Bitki sınıfı (Plant class)
│   ├── zombi.js             # Zombi sınıfı (Zombie class)
│   ├── mermi.js             # Bezelye mermisi sınıfı
│   ├── gunes.js             # Güneş objesi (toplama, düşme)
│   ├── arayuz.js            # UI: kart menüsü, güneş sayacı, dalga göstergesi
│   └── ses.js               # Ses efektleri (V0.1'de boş bırakılabilir)
├── data/
│   ├── bitkiler.json        # ⭐ Çocuklar buraya dokunacak
│   ├── zombiler.json        # ⭐ Çocuklar buraya dokunacak
│   └── seviyeler.json       # ⭐ Çocuklar buraya dokunacak
├── README.md
└── BAHCE_SAVASI_SPEC.md     # Bu doküman
```

---

## 📄 JSON ŞABLONLARI

### data/bitkiler.json
```json
{
  "ayçiçeği": {
    "ad": "Ayçiçeği",
    "emoji": "🌻",
    "maliyet": 50,
    "hp": 50,
    "tip": "üretici",
    "üretim_periyot_ms": 8000,
    "üretim_miktarı": 25
  },
  "bezelye_atıcı": {
    "ad": "Bezelye Atıcısı",
    "emoji": "🌱",
    "maliyet": 100,
    "hp": 100,
    "tip": "saldırgan",
    "atış_periyot_ms": 1500,
    "hasar": 20,
    "mermi_emoji": "🟢",
    "mermi_hızı": 5
  },
  "ceviz": {
    "ad": "Ceviz",
    "emoji": "🥜",
    "maliyet": 50,
    "hp": 400,
    "tip": "savunma"
  }
}
```

### data/zombiler.json
```json
{
  "normal": {
    "ad": "Normal Zombi",
    "emoji": "🧟",
    "hp": 100,
    "hız": 0.3,
    "ısırma_hasar": 25,
    "ısırma_periyot_ms": 1000
  },
  "koni": {
    "ad": "Koni Başlıklı Zombi",
    "emoji": "🧟‍♂️",
    "hp": 200,
    "hız": 0.3,
    "ısırma_hasar": 25,
    "ısırma_periyot_ms": 1000
  }
}
```

### data/seviyeler.json
```json
{
  "seviye_1": {
    "ad": "Bahçeye Hoş Geldin",
    "başlangıç_güneş": 50,
    "dalgalar": [
      {
        "no": 1,
        "zombiler": [
          { "tip": "normal", "satır": 2, "gecikme_ms": 5000 },
          { "tip": "normal", "satır": 0, "gecikme_ms": 8000 },
          { "tip": "normal", "satır": 4, "gecikme_ms": 11000 },
          { "tip": "normal", "satır": 1, "gecikme_ms": 14000 },
          { "tip": "normal", "satır": 3, "gecikme_ms": 17000 }
        ]
      },
      {
        "no": 2,
        "dalga_gecikme_ms": 25000,
        "zombiler": [
          { "tip": "normal", "satır": 0 },
          { "tip": "normal", "satır": 1 },
          { "tip": "normal", "satır": 2 },
          { "tip": "normal", "satır": 3 },
          { "tip": "normal", "satır": 4 },
          { "tip": "koni", "satır": 2 },
          { "tip": "koni", "satır": 3 },
          { "tip": "normal", "satır": 0 },
          { "tip": "normal", "satır": 4 },
          { "tip": "normal", "satır": 2 }
        ]
      },
      {
        "no": 3,
        "final": true,
        "dalga_gecikme_ms": 30000,
        "zombiler": [
          { "tip": "koni", "satır": 0 },
          { "tip": "koni", "satır": 2 },
          { "tip": "koni", "satır": 4 },
          { "tip": "normal", "satır": 1 },
          { "tip": "normal", "satır": 3 },
          { "tip": "koni", "satır": 1 },
          { "tip": "koni", "satır": 3 },
          { "tip": "normal", "satır": 2 },
          { "tip": "normal", "satır": 0 },
          { "tip": "normal", "satır": 4 }
        ]
      }
    ]
  }
}
```

---

## 🎨 GÖRSEL DETAYLAR

### Renk Paleti (CSS)
- **Çim (arka plan):** `#7CB342` (canlı yeşil)
- **Izgara çizgileri:** `#558B2F` (koyu yeşil, yarı saydam)
- **Kart menüsü arka plan:** `#3E2723` (koyu kahverengi, ahşap hissi)
- **Güneş:** `#FFD54F` (sıcak sarı)
- **HP barı yeşil:** `#4CAF50`
- **HP barı kırmızı:** `#F44336`
- **Yazı (UI):** `#FFFFFF` (beyaz, koyu zemin üzerinde)

### Font
- Google Fonts: **"Press Start 2P"** (8-bit retro hissi, çocuklar için heyecanlı)
- Fallback: `monospace`

### Emoji Boyutları
- Bitki/Zombi: 48px
- Mermi: 24px
- Güneş: 36px

### HUD (Heads-Up Display)
- **Sol üst:** Güneş ikonu + sayı (örn: "☀️ 125")
- **Üst orta:** "Dalga 2/3" göstergesi
- **Üst sağ:** "Yeniden Başla" butonu
- **Alt:** Bitki kartları (yatay sıra)

---

## 🔧 TEKNİK GEREKSİNİMLER

### Tarayıcı Uyumluluğu
- Chrome, Edge, Safari (son 2 sürüm)
- **iPad Safari'de çalışmalı** (Sarp ileride tablette oynayabilsin)
- Mouse + touch event'leri ikisi de desteklenmeli

### Performans
- 60 FPS hedef (requestAnimationFrame kullan)
- Canvas tek katman, gerekirse offscreen canvas optimize edilebilir

### Bağımlılık
- **HİÇBİR EXTERNAL LIBRARY YOK** (Phaser, PixiJS vs YOK)
- Vanilla JS, ES6 modules
- Sadece Google Fonts CDN'den font

### Local Storage YASAK
- localStorage, sessionStorage **kullanma**
- Skor/state sadece bellekte tutulur
- Sayfayı yenileyince oyun sıfırlanır (V0.1 için sorun değil)

### Modüler ES6 Yapısı
```html
<script type="module" src="js/main.js"></script>
```

Her .js dosyası kendi sınıfını export etsin:
```javascript
// bitki.js
export class Bitki { ... }

// main.js
import { Bitki } from './bitki.js';
```

---

## 🧪 KABUL KRİTERLERİ (Agent Bunları Sağlamalı)

Prototip "tamam" sayılması için:

- [ ] `index.html` browser'da açılınca oyun yükleniyor
- [ ] 5×9 ızgara görünüyor, çim yeşili
- [ ] Alt menüde 3 bitki kartı var, tıklayınca seçili oluyor
- [ ] Sol üstte güneş sayacı çalışıyor (başlangıç: 50)
- [ ] "Başla" butonuna basınca dalga 1 başlıyor
- [ ] Zombiler sağdan geliyor, sola doğru ilerliyor
- [ ] Izgaraya tıklayınca bitki yerleşiyor (yeterli güneş varsa)
- [ ] Yeterli güneş yoksa kart sönük görünüyor, tıklama çalışmıyor
- [ ] Ayçiçeği güneş üretiyor
- [ ] Bezelye Atıcısı bezelye atıyor, zombi vurulunca HP'si düşüyor
- [ ] Zombi HP=0 olunca yok oluyor
- [ ] Zombi bitkiye değince ısırıyor, bitki HP'si düşüyor
- [ ] Bitki HP=0 olunca yok oluyor
- [ ] Gökten güneş düşüyor, tıklayınca toplanıyor
- [ ] Tüm zombiler ölürse "KAZANDIN!" ekranı
- [ ] Bir zombi en sola ulaşırsa "KAYBETTIN!" ekranı
- [ ] "Yeniden Başla" butonu çalışıyor
- [ ] `data/bitkiler.json` değiştirilince oyun yenilenince yeni değerlerle çalışıyor
- [ ] Console'da Türkçe log mesajları akıyor
- [ ] Kod Türkçe yorumlu, değişken isimleri Türkçe

---

## 🚀 GELECEK FAZLAR (V0.2+, ÇOCUKLAR DAHIL)

Bunlar V0.1'de YAPILMAYACAK ama mimari bunlara hazır olmalı:

**V0.2 (Doruk):** Yeni bitki ekleme (Kar Bezelye, Patlayan Mantar, Domates), yeni zombi (Zıplayan, Hızlı), 3 yeni level

**V0.3 (Sarp):** Emoji yerine kendi çizimi PNG'ler, ses efektleri seçimi

**V0.4:** Mağaza, para sistemi, bitki yükseltme

**V0.5:** Multiplayer (Doruk vs Sarp), Vercel'e deploy

---

## 📋 AGENT İÇİN TALİMATLAR

1. **Tüm dosyaları yukarıdaki yapıya göre oluştur.**
2. **JSON dosyalarını şablona göre doldur.**
3. **JS dosyalarını ES6 module olarak yaz.**
4. **HER fonksiyona Türkçe yorum ekle.**
5. **Değişken isimleri Türkçe olsun (İlke 3).**
6. **`README.md`** dosyası ekle, içinde:
   - Oyunu nasıl açacağım (sadece `index.html`'i browser'da aç)
   - Hangi JSON'da hangi değer var
   - Doruk için "İlk Görevin" bölümü (örn: "Bezelye Atıcısı'nın hasarını 50 yap, ne oluyor?")
7. **Konsol mesajlarını cömert kullan**, çocuk F12 açıp izleyebilsin.
8. **Localhost server gerektirmesin** — `index.html` doğrudan double-click ile açılabilmeli. (ES6 module'lerinde CORS sorunu olabilir; gerekirse tüm JS'i tek dosyada veya inline `<script>` ile birleştir, ama modüler mimariyi koru.)

**ÖNEMLİ NOT:** Eğer ES6 modules dosya:// protokolünde CORS hatası verirse, alternatif olarak tüm JS'i `index.html` içinde inline `<script>` bloklarına koy, ama yapıyı yukarıdaki gibi koru (sınıflar ayrı, mantık ayrı). README.md'de bunu çocuğa açıkla: "Bu oyunu açmak için sadece index.html'e çift tıkla."

---

## ✅ SON KONTROL

Agent oyunu tamamladığında bana şu özet teslim etsin:
1. Hangi dosyalar oluşturuldu?
2. Hangi JSON parametreleri değiştirilebilir?
3. Kabul kriterlerinden hangileri sağlandı, hangileri eksik?
4. "Doruk için ilk görev" önerisi (basit bir JSON değişiklik egzersizi)

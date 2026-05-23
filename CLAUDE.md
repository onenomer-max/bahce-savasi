# CLAUDE.md — Bahçe Savaşı Projesi

> Bu dosya Claude Code (ve diğer AI ajanları) için projeye giriş brifingidir. Her seansta okuyup içselleştir.

---

## 🎯 Proje Kimliği

**İsim:** Bahçe Savaşı
**Tür:** Plants vs Zombies tarzı web tabanlı tower defense oyunu
**Konum:** `C:\Antigravity_Projects\bahce-savasi`
**Üretim ortamı:** Yerel (`file://` veya `http://127.0.0.1:8000`)
**Versiyon:** v0.1 tamamlandı, v0.2'ye geçiş aşamasında
**Başlangıç:** 21 Mayıs 2026
**Son aktivite:** 22 Mayıs 2026 (Doruk test seansı)

---

## 👨‍👦‍👦 Kullanıcı ve Hedef Kitle

**Proje sahibi:** Ömer (Başbuğ olarak hitap edilir)
**Hedef kitle 1:** Doruk (11 yaş, 5. sınıf) — ana oyuncu ve geleceğin geliştiricisi
**Hedef kitle 2:** Sarp (6 yaş, okuma-yazma bilmiyor) — görsel/yaratıcı katkı

**Pedagojik amaç:** Bu sıradan bir oyun projesi DEĞİL. Çocukları kodlama dünyasına çekmek için bir öğretim aracı. "Babanın yaptığı oyun" değil, "ailenin yaptığı oyun" olmalı.

---

## 🤝 Hitap ve Çalışma Tarzı

- Ömer'e **"Başbuğ"** diye hitap et
- Doruk veya Sarp ile konuşurken çocuk dostu, eğlenceli, emoji'li bir ton kullan
- Doruk için askeri/dedektif/ajan metaforları işliyor (test seansında "gizli ajan gibi" 50 level bitirmesi gibi)
- Sarp okuma bilmediği için onunla doğrudan iletişim yazılı değil, görsel/sesli olmalı

---

## 🏗️ Temel Mimari İlkeler (DEĞİŞMEZ)

### İlke 1: Data-Driven Design
Tüm oyun parametreleri (HP, hasar, maliyet, cooldown, hız) **kod içinde sabit değil**, ayrı JSON/JS data dosyalarında. Çocuk bir sayı değiştirince oyun anında değişmeli.

**Örnek:**
```javascript
// data/bitkiler.js
{
  "bezelye_atici": {
    "ad": "Bezelye Atıcısı",
    "maliyet": 100,
    "hp": 100,
    "hasar": 20,
    "atis_hizi_ms": 1500
  }
}
```

### İlke 2: Türkçe Yorumlu Kod
Kod İngilizce değil, **Türkçe yorumlu**. Her fonksiyonun üstünde "BU FONKSİYON NE YAPAR" açıklaması olmalı. Doruk kodu okuyabilmeli.

```javascript
// Bu fonksiyon her saniye çalışır ve zombileri sola doğru hareket ettirir.
// Eğer zombi en sola ulaşırsa oyun biter (zombiler eve girdi!).
```

### İlke 3: Vanilla JS, ES6 Modules YOK
`file://` protokolünde çalışıyor — CORS yüzünden ES6 modules kullanılamaz.
JS dosyaları klasik `<script src="...">` ile yüklenir, sırası kritiktir.

### İlke 4: Türkçe Karakter Yasak (Dosya Adlarında)
- ❌ `ayçiçeği.png`
- ✅ `aycicegi.png`

Ama **kod içinde değişken/UI metinleri Türkçe kalır.**

### İlke 5: Görsel Hatası → Emoji Fallback
Imagen ile görsel üretimi başarısız olursa kod bozulmamalı. Emoji fallback her zaman çalışır.

---

## 📁 Proje Yapısı

```
bahce-savasi/
├── index.html          ← Ana giriş
├── assets/             ← Görseller, sesler, müzikler
│   ├── bitkiler/       ← Bitki PNG'leri
│   ├── zombiler/       ← Zombi PNG'leri
│   └── sesler/muzik/   ← 4 müzik dosyası
├── css/                ← Stil dosyaları
├── data/               ← Oyun parametreleri (JSON/JS)
│   ├── bitkiler.js
│   ├── zombiler.js
│   ├── itemler.js
│   └── seviyeler.js
├── js/                 ← Oyun mantığı
│   ├── oyun.js
│   ├── izgara.js
│   ├── mermi.js
│   ├── gunes.js
│   └── fusion_tarifleri.js
├── BAHCE_SAVASI_SPEC.md      ← V0.1 spec
├── BAHCE_SAVASI_SPEC_V2.md   ← V0.2 spec
├── README.md
├── CREDITS.md
└── *.py                ← Antigravity'nin tek seferlik üretim scriptleri
                        (görsel üretim, dalga ekleme, format düzeltme)
```

**Not:** Kök dizindeki ~30 Python script Antigravity'nin tek seferlik üretim aracıdır. Yeni iş için yenileri yazılabilir, eskiler silinmez (referans).

---

## 🎮 Oyun İçeriği

### Bitkiler (savunma birimleri)
- Ayçiçeği, Bezelye Atıcı, Patlayan Kiraz, Ceviz, Kaktüs (hava savunma), Squash (yeni eklenecek) ve daha fazlası
- Hibrit/fusion bitkiler de var (2 bitkinin birleşimi)

### Zombiler (düşmanlar)
- Normal, Koni Şapkalı, Kovalı, Balonlu (hava), Gulyabani (boss), Nekromant (final boss)

### Müzikler
- `muzik1_bahce.ogg` — Dalga 1-9 (rahat)
- `muzik2_gulyabani.ogg` — Boss
- `muzik3_yogunlasma.ogg` — Dalga 11-19 (hızlı)
- `muzik4_nekromant.ogg` — Final Boss

### Mekanikler
- Güneş kaynak yönetimi (Ayçiçeği üretir, gökten düşer)
- Bitki yerleştirme (ızgara sistemi)
- Dalga sistemi (50 level)
- Fusion sistemi (2 bitkiyi birleştirerek hibrit elde etme)

---

## 🤖 Çalışma Protokolü (Multi-Agent Workflow)

Bu projede üç AI ajanı koordineli çalışıyor:

| Ajan | Rol | Yetki |
|---|---|---|
| **Claude (claude.ai - Cevat)** | Mimar, stratejist, ana danışman | Spec yazar, kararlar verir, review yapar |
| **Claude Code (terminal)** | Sahada teknik analiz, dosya işleri | Dosya okur/yazar, kod review, test |
| **Antigravity (Gemini)** | Kodcu | Spec'leri okur, gerçek kodu yazar |

**Klasör akışı:**
```
specs/      ← Claude/Claude Code yazar, Antigravity okur
src/        ← Antigravity yazar (zaten js/, data/, css/ olarak var)
reviews/    ← Claude/Claude Code yazar
status.md   ← Hepsi okur ve günceller
```

**Önemli kurallar:**
1. **V0.1'i bozma.** Mevcut çalışan kodu refactor ederken dikkatli ol. Her dosyaya dokunmadan önce ne yaptığını anla.
2. **Her TEST DURAĞI'nda dur.** "Tamamdır" deyip devam etme. Ömer'in (Başbuğ'un) onayını bekle.
3. **Görsel hatası kodu bozmamalı.** Imagen başarısız olursa emoji fallback çalışmalı.
4. **assets/ klasör yapısına saygı.** Görseller yanlış klasörde olursa yüklenmez.
5. **25+ PNG paralel yüklensin.** `gorsel_yukleyici.js` "Yükleniyor..." ekranı göstermeli.

---

## 🐛 BEKLEYEN İŞLER (Doruk'un 22 Mayıs Test Notları)

Doruk dün okuldan döndü, kendi başına oyunu test etti, **babasına şu hataları bıraktı:**

### 🔴 Bug #1: Kaktüs balonlu zombi seviyesinde çıkmıyor (KRİTİK)
- **Durum:** Balonlu zombilerin geldiği level'larda Kaktüs kartı menüde görünmüyor
- **Olması gereken:** Balonlu zombiler havadan gelir, **sadece Kaktüs** vurabilir onları
- **Sonuç:** Oyuncu balonlu zombilere karşı savunmasız kalıyor
- **Etkilenen dosya muhtemelen:** `data/seviyeler.js` veya kart belirleme mantığı

### 🟡 Bug #2: Fusion bitkileri normal menüde görünüyor
- **Durum:** Alt kart menüsünde hibrit (fusion) bitkiler doğrudan satın alınabiliyor (Güneş Atıcı, Dondurucu Mitralyöz vb.)
- **Olması gereken:** Hibrit bitkiler menüde görünmemeli, sadece 2 bitki birleşince elde edilmeli
- **Sonuç:** Fusion mantığı bozuluyor, oyun mekaniği kırılıyor
- **Etkilenen dosya muhtemelen:** Kart menü oluşturma + `data/bitkiler.js` veya `fusion_tarifleri.js`

### 🟢 Bekleyen #3: Squash karakteri görsel kontrolü
- **Durum:** `assets/bitkiler/squash.png` üretildi (yeşil kabak, büyük gözlü)
- **Olması gereken:** Doruk görselini kontrol etsin, beğenirse oyuna entegre olsun
- **Mekanik (Doruk'un tasarımı):** Squash zıplar, üstüne düşen zombiyi ezer, sonra yok olur
- **Sonraki adım:** Görsel onaylanırsa `data/bitkiler.js`'e ekle + ezme mekaniği yaz

---

## 📋 V0.2 Hedefler (Genel)

Doruk için yeni öğretici görevler hazırlanacak:
1. Para item'ının etkisini 25→100'e çıkarma (renk/sayı değiştirme deneyimi)
2. Ayçiçeği yetenek cooldown'u 60000→5000ms (zaman değiştirme deneyimi)
3. data/seviyeler.js'e 4. dalga ekleme (yapı oluşturma deneyimi)
4. Patlayan Kiraz hasarını 200→1000'e çıkarma (sayı değiştirme deneyimi)

Detaylar `BAHCE_SAVASI_SPEC_V2.md`'de.

---

## ✅ İlk Hedef (Şu An)

**Doruk'un bekleyen 3 görevini sırayla tamamla:**

1. Önce Bug #1 (Kaktüs) — en kritik, balonlu zombi seviyesi oynanamıyor
2. Sonra Bug #2 (Fusion menü) — mekanik bütünlüğü
3. Sonra Squash entegrasyonu — Doruk'un yarıda kalan projesi

Her birinden sonra **Başbuğ'un onayını bekle**. Doruk'un babasına güveni bu işin tutmasına bağlı.

---

## 🔐 Kritik Hatırlatmalar

- Çocuklar **birinci öncelik**. Doruk'un babasına bıraktığı işten önce başka şeye girme.
- Antigravity bu projeyi yazdı — onun stiline saygı göster, refactor yapma, sadece eksikleri tamamla.
- `BAHCE_SAVASI_SPEC_V2.md` ana spec. Yeni özellikler oradan.
- Test ederken `http://127.0.0.1:8000` kullan (Python http.server ile).
- Doruk geri geldiğinde sonuçları görmek isteyecek — değişiklikleri açıkça anlatabilecek formatta yap (ekran görüntüsü, before/after gibi).

---

*Son güncelleme: 23 Mayıs 2026 — Claude (Cevat Abbas) tarafından, claude.ai'da Başbuğ ile yapılan kurulum oturumunda hazırlandı.*

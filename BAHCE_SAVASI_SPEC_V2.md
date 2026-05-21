# Bahçe Savaşı V0.2 — Görseller, Droplar ve Özel Yetenekler

**Versiyon:** v0.2
**Önceki:** v0.1 başarıyla tamamlandı (tüm 7 test geçti)
**Bu sürümün hedefi:** Doruk ve Sarp'ı "vay be, bu gerçek bir oyun!" dedirtmek

---

## 🎯 V0.2 FELSEFESİ (AGENT BUNU ANLAMALI)

V0.1 emoji ile yapıldı, mekanikler test edildi, çalıştı. Şimdi **görsel olarak profesyonel** ve **mekanik olarak zengin** versiyona geçiyoruz. AMA:

### V0.1'in mimari ilkeleri AYNEN KORUNACAK
- ✅ Türkçe değişken isimleri
- ✅ Türkçe yorumlar
- ✅ Data-driven (parametreler `data/` klasöründe)
- ✅ Vanilla JS, external library YOK
- ✅ Çift tıkla çalışma (file:// protokolü)
- ✅ Klasik `<script src>` ile yükleme

### V0.2'nin GETİRECEĞİ değişiklikler
1. **Emoji → PNG görseller** (AI üretimi, retro pixel art stilinde)
2. **Tam ekran modu** (F11 desteği + responsive canvas)
3. **Yeni bitki ve zombi tipleri** (5 yeni bitki, 3 yeni zombi)
4. **Drop sistemi** (zombi ölünce item düşürebilir)
5. **Özel yetenekler** (cooldown'lu skill'ler, klasik PvZ tarzı)

---

## 🎨 BÖLÜM 1: GÖRSELLER

### Stil Rehberi
- **Stil:** Retro pixel art (32x32 veya 64x64 PNG, hangisi uygunsa)
- **Palet:** Canlı renkler, çocuk dostu, PvZ'nin sevimli stiline yakın
- **Arka plan:** Transparent PNG (canvas üzerinde temiz görünsün)
- **Yön:** Bitkiler ön cepheden, zombiler yandan (sağdan sola yürüyor)
- **Tutarlılık:** Tüm karakterler aynı sanatçı tarafından çizilmiş gibi (aynı stil, aynı çizgi kalınlığı)

### Üretilecek Görsel Listesi

#### Bitkiler (8 adet)
1. `ayçiçeği.png` — Sevimli sarı ayçiçeği, yüzü var, gülümsüyor
2. `bezelye_atıcı.png` — Yeşil sap üstünde bezelye topu, ağzı var
3. `ceviz.png` — Sert kabuklu ceviz, kararlı surat
4. `kar_bezelye.png` — Mavi/buz renginde bezelye atıcı varyantı
5. `patlayan_kavun.png` — Yeşil kavun, kırmızı gözler (öfkeli)
6. `patlayan_kiraz.png` — İkiz kiraz, korkutucu surat (yakında patlayacak)
7. `güneşli_mantar.png` — Mor mantar, geceleri çalışır (V0.3 için ama görsel şimdi hazır olsun)
8. `kaktüs.png` — Yeşil kaktüs, dikenli (havadaki zombiler için)

#### Zombiler (5 adet)
1. `zombi_normal.png` — Klasik mavi tenli zombi, kollar öne uzanmış
2. `zombi_koni.png` — Normal zombi + trafik konisi şapka
3. `zombi_kasklı.png` — Normal zombi + metal kask (daha sağlam)
4. `zombi_hızlı.png` — Sıska, atletik zombi (koşacak)
5. `zombi_balonlu.png` — Renkli balona tutunan zombi (havadan gelir)

#### Mermiler ve Efektler (4 adet)
1. `bezelye_mermi.png` — Yeşil bezelye topu
2. `kar_bezelye_mermi.png` — Mavi/buz bezelye
3. `patlama.png` — Sarı/kırmızı patlama efekti (3 frame: small/medium/big)
4. `güneş.png` — Parlak sarı güneş (zaten emoji'de var ama PNG daha iyi)

#### Item Drop'ları (5 adet)
1. `para.png` — Altın para
2. `elmas.png` — Mavi elmas
3. `kalp.png` — Kırmızı kalp
4. `şimşek.png` — Sarı şimşek ikonu
5. `ateş_topu.png` — Turuncu/kırmızı ateş topu

#### Arkaplan/UI (3 adet)
1. `çim_doku.png` — Tekrarlanabilir çim dokusu (CSS background-repeat için)
2. `kart_zemini.png` — Bitki kartı arka planı (ahşap doku)
3. `başla_butonu.png` — Stylized başla butonu (opsiyonel)

### Üretim Stratejisi

**Gemini'nin Imagen yeteneği var** — Antigravity içinden direkt görsel üretebilir. Eğer üretemiyorsa **Google AI Studio'da** (Ömer'in zaten Ultra aboneliği var) Imagen kullanılabilir.

**Üretim prompt şablonu (her görsel için):**
```
A cute pixel art [character], retro game style, 64x64 pixels, transparent background, vibrant colors, similar to Plants vs Zombies art style, friendly and child-appropriate
```

**ÖRNEK PROMPT (Ayçiçeği için):**
```
A cute pixel art sunflower with a smiling face, retro game style, 64x64 pixels, transparent background, vibrant yellow petals and green stem, similar to Plants vs Zombies art style, friendly and child-appropriate
```

### Dosya Yapısı
```
bahce_savasi/
└── assets/
    ├── bitkiler/
    │   ├── ayçiçeği.png
    │   ├── bezelye_atıcı.png
    │   └── ...
    ├── zombiler/
    │   ├── zombi_normal.png
    │   └── ...
    ├── efektler/
    │   ├── bezelye_mermi.png
    │   ├── patlama.png
    │   └── ...
    ├── itemler/
    │   ├── para.png
    │   └── ...
    └── arkaplan/
        ├── çim_doku.png
        └── ...
```

### Görselleri Koda Bağlama

`data/bitkiler.js`'e yeni alan eklenecek:
```javascript
const BITKILER_DATA = {
  "aycicegi": {
    "ad": "Ayçiçeği",
    "emoji": "🌻",        // Fallback olarak kalsın
    "görsel": "assets/bitkiler/ayçiçeği.png",  // YENİ
    "maliyet": 50,
    ...
  }
}
```

Kod önce `görsel` alanını yüklemeyi denesin, eğer yoksa veya yüklenemezse `emoji`'ye düşsün. **Bu önemli**, çünkü görsel üretimi başarısız olursa oyun bozulmasın.

---

## 🖥️ BÖLÜM 2: TAM EKRAN MODU

### Hedef Davranış
- **F11 tuşu:** Browser tam ekrana geçer (zaten browser fonksiyonu)
- **Oyun ekranı:** Browser ne kadar büyükse oyun da o kadar büyük (responsive)
- **Korunan oran:** 16:9 (mevcut canvas oranı), ekran küçükse letterbox (siyah çerçeve)
- **Mobil uyum:** Tablet/iPad'de de oranlar bozulmadan açılsın

### Teknik Yaklaşım
- Canvas boyutu sabit (1280×720) → CSS `transform: scale()` ile büyüt/küçült
- `window.innerWidth` / `window.innerHeight` ile ekran boyutunu izle
- Resize event'inde yeniden ölçekle

### Ek Buton
Sağ üstte küçük bir "⛶" (tam ekran) ikonu, tıklayınca `requestFullscreen()` API'sini çağırır. F11'i bilmeyen çocuklar için.

---

## 🌱 BÖLÜM 3: YENİ BİTKİLER

### Kar Bezelye
- **Maliyet:** 175 güneş
- **HP:** 100
- **Hasar:** 20 (Bezelye Atıcı ile aynı)
- **Özellik:** Vurduğu zombiyi **3 saniye yavaşlatır** (hızını %50'ye düşürür)
- **Görsel:** Mavi/buz tonlu bezelye atıcısı

### Patlayan Kavun
- **Maliyet:** 325 güneş
- **HP:** 100
- **Hasar:** 80 (alan hasarı)
- **Özellik:** Kavun atar, **3 hücre alan patlaması** yapar (vurulan + komşu 2 hücredeki zombilere)
- **Atış periyodu:** 3000ms (yavaş ama güçlü)
- **Görsel:** Yeşil kavun

### Patlayan Kiraz
- **Maliyet:** 150 güneş
- **HP:** 1 (tek seferlik)
- **Hasar:** 200 (alan)
- **Özellik:** Yerleştirildikten **1.5 saniye sonra otomatik patlar**, etrafındaki 3×3 alandaki tüm zombilere 200 hasar verir, sonra kaybolur
- **Görsel:** Kızgın suratlı ikiz kiraz

### Kaktüs (V0.3'te kullanılacak ama hazır olsun)
- **Maliyet:** 125 güneş
- **HP:** 100
- **Hasar:** 20
- **Özellik:** Hem yerdeki hem **havadaki zombilere** vurabilir
- **Görsel:** Dikenli yeşil kaktüs

---

## 🧟 BÖLÜM 4: YENİ ZOMBİLER

### Hızlı Zombi
- **HP:** 100
- **Hız:** 0.6 (normal zombinin 2 katı)
- **Görsel:** Sıska, atletik
- **Tehdit:** Bezelye Atıcı yetişemez, Kar Bezelye gerekli (yavaşlatma)

### Kasklı Zombi
- **HP:** 350 (koni zombiden daha sağlam)
- **Hız:** 0.3
- **Görsel:** Metal kask
- **Tehdit:** Patlayan Kavun veya Patlayan Kiraz olmadan zor öldürülür

### Balonlu Zombi
- **HP:** 80
- **Hız:** 0.4
- **Özellik:** Havadan gelir, **Bezelye Atıcı ve Kar Bezelye onu vuramaz**, sadece Kaktüs vurabilir
- **Görsel:** Renkli balona tutunmuş zombi

---

## 💎 BÖLÜM 5: DROP SİSTEMİ

### Mekanik
- Her zombi öldüğünde **%15 ihtimalle** rastgele bir drop bırakır
- Boss/Kasklı zombi gibi güçlü zombiler **%40 ihtimalle** drop bırakır
- Drop yere düşer, **5 saniye** içinde toplanmazsa kaybolur
- Tıklayınca toplanır

### Drop Tipleri ve Etkileri

| Drop | Görsel | Etki | Olasılık (15% içinden) |
|------|--------|------|----------------------|
| Para | 🪙 | +25 ekstra güneş (oyun içi para) | %40 (yaygın) |
| Kalp | ❤️ | Sahadaki tüm bitkilerin HP'sine +25 | %25 |
| Elmas | 💎 | +100 güneş bonus | %15 |
| Şimşek | ⚡ | Sahadaki tüm zombiler 2 saniye paralize olur | %15 |
| Ateş Topu | 🔥 | Bir satıra tıkla, o satırdaki tüm zombiler 100 hasar alır | %5 (nadir) |

**Drop'lar `data/itemler.js` dosyasında tanımlanır** (yeni dosya):
```javascript
const ITEMLER_DATA = {
  "para": { "görsel": "...", "etki": "guneş_artir", "miktar": 25, "olasilik": 40 },
  "kalp": { "görsel": "...", "etki": "bitki_hp_artir", "miktar": 25, "olasilik": 25 },
  ...
};
```

---

## ⚡ BÖLÜM 6: ÖZEL YETENEKLER (BİTKİ SKILL'LERİ)

### Mekanik
- Her bitki bir özel yeteneğe sahip
- Yetenek **cooldown'lu** (örn: 60 saniyede 1)
- Bitki tıklanınca yetenek tetiklenir (sağ tık veya çift tık ile)
- Cooldown sırasında bitki etrafında **gri/koyu efekt** var, geçince yeşil parıltı

### Yetenek Listesi

| Bitki | Yetenek | Etki | Cooldown |
|-------|---------|------|----------|
| Ayçiçeği | Güneş Patlaması | Anında +50 güneş üretir | 60 sn |
| Bezelye Atıcı | Bezelye Yağmuru | 5 sn boyunca 3x hızlı atış | 45 sn |
| Ceviz | Sertleşme | 10 sn boyunca hasarsız | 30 sn |
| Kar Bezelye | Buz Patlaması | Aynı satırdaki TÜM zombileri 3 sn dondurur | 60 sn |
| Patlayan Kavun | Kavun Yağmuru | 3 kavun aynı anda fırlatır | 30 sn |

**Yetenekler `data/bitkiler.js` içinde tanımlanır:**
```javascript
"aycicegi": {
  ...
  "yetenek": {
    "ad": "Güneş Patlaması",
    "etki": "anlik_gunes",
    "miktar": 50,
    "cooldown_ms": 60000
  }
}
```

### UI Göstergesi
- Bitki sağ üst köşesinde küçük bir **yetenek ikonu** (cooldown bitince parlar)
- Hover yapılınca yeteneğin ne yaptığı tooltip olarak çıkar

---

## 🗂️ DOSYA YAPISI (V0.2)

```
bahce_savasi/
├── index.html
├── README.md
├── BAHCE_SAVASI_SPEC.md         (V0.1 spec)
├── BAHCE_SAVASI_SPEC_V2.md      (Bu doküman)
├── css/
│   └── style.css
├── data/
│   ├── bitkiler.js              (Güncellendi: yetenek alanı, görsel alanı)
│   ├── zombiler.js              (Güncellendi: 3 yeni zombi)
│   ├── seviyeler.js             (Güncellendi: yeni zombileri içeren dalgalar)
│   └── itemler.js               (YENİ: drop sistemi)
├── js/
│   ├── main.js
│   ├── oyun.js                  (Güncellendi: drop ve yetenek mantığı)
│   ├── izgara.js
│   ├── bitki.js                 (Güncellendi: yetenek sistemi)
│   ├── zombi.js                 (Güncellendi: yeni özellikler, drop bırakma)
│   ├── mermi.js                 (Güncellendi: alan hasarı, yavaşlatma)
│   ├── gunes.js
│   ├── arayuz.js                (Güncellendi: tam ekran butonu, yetenek tooltip)
│   ├── ses.js
│   ├── item.js                  (YENİ: drop item sınıfı)
│   ├── yetenek.js               (YENİ: özel yetenek sistemi)
│   └── gorsel_yukleyici.js      (YENİ: PNG'leri yüklemekten sorumlu)
└── assets/                      (YENİ: tüm görseller)
    ├── bitkiler/
    ├── zombiler/
    ├── efektler/
    ├── itemler/
    └── arkaplan/
```

---

## 🔄 GERÇEKLEŞTİRME SIRASI (AGENT BU SIRAYI TAKİP EDECEK)

Bu sıra ÇOK ÖNEMLİ. Her adımdan sonra Ömer test edecek, onay verecek.

### Faz 1: Görsel Altyapı (1-2 saat)
1. `assets/` klasörünü oluştur
2. **Tüm 25 görseli üret** (Imagen ile) ve doğru yerlere kaydet
3. `js/gorsel_yukleyici.js` oluştur — tüm görselleri preload eden bir sınıf
4. `data/bitkiler.js` ve `data/zombiler.js`'e `görsel` alanı ekle
5. `bitki.js` ve `zombi.js`'i güncelle: emoji yerine PNG çiz (yüklenmemişse fallback emoji)
6. **🛑 TEST DURAĞI 1:** Mevcut oyun PNG'lerle çalışıyor mu?

### Faz 2: Tam Ekran (30 dk)
1. CSS'i güncelle: canvas responsive olsun, oran korunsun
2. `arayuz.js`'e tam ekran butonu ekle
3. Resize event handler ekle
4. **🛑 TEST DURAĞI 2:** F11 ve tam ekran butonu çalışıyor mu? Oran bozulmuyor mu?

### Faz 3: Yeni Bitkiler ve Zombiler (1 saat)
1. `data/bitkiler.js`'e 4 yeni bitki ekle (Kar Bezelye, Patlayan Kavun, Patlayan Kiraz, Kaktüs)
2. `data/zombiler.js`'e 3 yeni zombi ekle
3. `bitki.js`'i güncelle: alan hasarı, yavaşlatma, otomatik patlama mantıkları
4. `zombi.js`'i güncelle: hızlı zombi, kasklı zombi, balonlu zombi (uçabilir bayrağı)
5. `arayuz.js`'i güncelle: alt menüye yeni bitki kartları
6. `data/seviyeler.js`'e yeni zombi içeren dalgalar
7. **🛑 TEST DURAĞI 3:** Yeni bitki/zombiler çalışıyor mu? Alan hasarı doğru mu?

### Faz 4: Drop Sistemi (45 dk)
1. `data/itemler.js` oluştur
2. `js/item.js` oluştur — Item sınıfı (yere düşme, tıklama, etki uygulama)
3. `zombi.js`'i güncelle: ölünce %15 ihtimalle drop bırakma
4. `oyun.js`'i güncelle: item efektlerini uygulama (güneş artırma, paralizi, vb.)
5. **🛑 TEST DURAĞI 4:** Drop'lar düşüyor mu? Etkileri doğru mu?

### Faz 5: Özel Yetenekler (1 saat)
1. `js/yetenek.js` oluştur — Yetenek sınıfı
2. `data/bitkiler.js`'e her bitkinin yetenek bilgisini ekle
3. `bitki.js`'i güncelle: yetenek tetikleme (çift tık veya sağ tık)
4. `arayuz.js`'i güncelle: bitki üzerinde cooldown göstergesi
5. **🛑 TEST DURAĞI 5:** Yetenekler çalışıyor mu? Cooldown doğru mu?

### Faz 6: Cilalama ve Doruk için README (30 dk)
1. Animasyonlar ekle (CSS keyframes: zıplama, sallanma)
2. Hover efektleri
3. Sound effects placeholder (V0.3'te eklenecek)
4. README'ye Doruk için yeni görevler ekle:
   - "Patlayan Kiraz'ın hasarını 500 yap, ekran patlamalarla dolsun"
   - "Para drop olasılığını 100'e çıkar, zombi her ölünce para versin"
   - "Yeni bir bitki ekle: 'Süper Ayçiçeği', daha fazla güneş üretsin"

---

## ✅ KABUL KRİTERLERİ (V0.2)

- [ ] Tüm 25 görsel üretildi ve doğru klasörlerde
- [ ] Bitki ve zombiler PNG ile görünüyor (emoji değil)
- [ ] Görsel yüklenmezse emoji fallback çalışıyor
- [ ] Tam ekran butonu ve F11 sorunsuz
- [ ] Ekran yeniden boyutlandırılınca oran bozulmuyor
- [ ] 4 yeni bitki + 3 yeni zombi sahaya çıkıyor
- [ ] Patlayan Kavun gerçekten alan hasarı yapıyor
- [ ] Kar Bezelye zombiyi yavaşlatıyor
- [ ] Hızlı zombi gerçekten daha hızlı
- [ ] Balonlu zombi sadece Kaktüs ile öldürülebiliyor
- [ ] Drop sistemi çalışıyor (15% olasılık doğru)
- [ ] Tüm 5 item tipi doğru etki yapıyor
- [ ] Yetenekler cooldown'lu çalışıyor
- [ ] Cooldown UI'da görünüyor
- [ ] `data/` dosyaları hala düzenlenebilir (mimari korundu)
- [ ] Console'da Türkçe log'lar çıkıyor
- [ ] V0.1'deki tüm özellikler hala çalışıyor (regresyon yok)

---

## 🎓 ÇOCUKLAR İÇİN ÖĞRETİM NOTU

V0.2 tamamlandığında **README.md'ye yeni bölüm eklenmeli**:

```markdown
## Doruk İçin Yeni Görevler (V0.2)

1. **Renk değiştir:** `data/itemler.js`'i aç, "para" item'ının etkisini 25'ten 100'e çıkar. Şimdi para her düştüğünde 100 güneş veriyor!

2. **Yetenek süresini değiştir:** Ayçiçeği'nin yetenek cooldown'unu 60000'den 5000'e düşür. Şimdi her 5 saniyede güneş patlaması yapabilirsin!

3. **Yeni dalga ekle:** `data/seviyeler.js`'e 4. dalga ekle, 20 hızlı zombi gönder!

4. **Patlama gücünü artır:** Patlayan Kiraz'ın hasarını 200'den 1000'e çıkar. Patlama küçük bir nükleer bomba gibi olsun!
```

---

## 🚨 AGENT İÇİN KRİTİK UYARILAR

1. **V0.1'i bozma:** Mevcut çalışan kodu refactor ederken dikkatli ol. Her dosyaya dokunmadan önce ne yaptığını anla.

2. **Her TEST DURAĞI'nda dur:** "Tamamdır" deyip devam etme. Ömer'in onayını bekle.

3. **Görseller başarısız olursa emoji'ye düş:** Imagen ile görsel üretmek başarısız olabilir. Bu durumda kod bozulmamalı, emoji fallback çalışmalı.

4. **Türkçe karakter dikkat:** Dosya adlarında Türkçe karakter (ç, ğ, ş, ı) sorun çıkarabilir. ASCII karşılığı kullan: `aycicegi.png` (ayçiçeği değil), `kar_bezelye.png` vb. **AMA** kod içinde değişken/UI metinleri Türkçe kalsın.

5. **CORS sorununu unutma:** Hala file:// protokolünde çalışıyoruz. Yeni JS dosyaları da klasik `<script src>` ile yüklenecek, ES6 modules YOK.

6. **assets/ klasör yapısı:** Görseller doğru klasörde olmazsa yüklenmez. Yapıyı titizlikle takip et.

7. **Performans:** 25 PNG yüklenmesi başlangıçta yavaş olabilir. `gorsel_yukleyici.js` bunları paralel yüklemeli ve yüklenirken bir "Yükleniyor..." ekranı göstermeli.

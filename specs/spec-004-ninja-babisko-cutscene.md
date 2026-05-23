# SPEC-004 — "Ninja Babisko" Cutscene Sürprizi

**Yazan:** Claude Code (saha analiz)
**Tarih:** 2026-05-23
**Hedef:** Antigravity (kodcu)
**Onaylayan:** Başbuğ
**Öncelik:** 🟣 ÖZEL — Doruk için duygusal sürpriz, mekanik özellik değil
**Bağımlılık:** SPEC-001, SPEC-002, SPEC-003 tamamlanmış olmalı

---

## 🎯 Amaç — Sürpriz Felsefesi

Bu spec **sıradan bir özellik değil.** Doruk için baba-oğul bağının dijital bir karşılığı.

**Anlatı:** Dalga 46'da ekran 200 zombi ile dolar. Doruk panikler — "Bu kadarı yenilemez!" Tam o anda hareket donar, ekranda **"⚔️ NINJA BABISKO! ⚔️"** belirir. Ninja düşer, tek hamlede 200 zombiyi keser. Sonra mesaj çıkar:

> *"Ne zaman yardım lazım olursa, Ninja Babisko hep yanında!"*

**Sürpriz koşulları (KESİN):**
- ❌ Önceden hiçbir ipucu YOK — kart açıklaması, dalga 45 sonu anonsu, menü, hiçbir yerde "ninja" geçmemeli
- ❌ Konsola debug log ekleme ("Ninja cutscene tetiklendi" gibi) — Doruk F12 açarsa görmesin
- ❌ Ses YOK — sessiz cutscene, dramatik etki için
- ✅ Her oyunda dalga 46 başlangıcında tetiklenir (tekrar edilebilir — bir kez değil)
- ✅ Tüm 200 zombi silinir (sahada ve bekleyenler), dalga otomatik biter, dalga 47'ye geçilir

**Bu spec'in başarı kriteri:** Doruk ilk dalga 46'sında cutscene'i görüp donduğunda. Başbuğ'un Doruk'a *"O babası, sen istemeden bile yanında"* mesajını oyun üzerinden iletmesi.

---

## 🛠️ Önişlem — 4 Ninja Babisko PNG'sinin Üretimi

**Hedef klasör:** `assets/cutscene/`  *(yeni klasör — şu an mevcut değil, oluşturulacak)*
**Dosya isimleri:** `ninja_babisko_1.png`, `ninja_babisko_2.png`, `ninja_babisko_3.png`, `ninja_babisko_4.png`
**Boyut:** **128×128 piksel**, PNG, transparan arka plan (RGBA)
**Stil:** Diğer karakter PNG'leriyle aynı görsel dil (pixelart benzeri, parlak renkler, kalın kontur)

### Antigravity'nin Imagen ile üreteceği görseller

Mevcut karakterler nasıl Imagen ile üretildiyse (Squash, bitkiler, zombiler), Ninja Babisko da öyle üretilecek. **4 frame, bir saldırı sekansı:**

| Frame | İçerik (Imagen prompt taslağı — Antigravity uyarlasın) |
|---|---|
| **`ninja_babisko_1.png`** | Ninja **havada düşüyor**, kollar yukarıda, kılıç sırtında. Yandan profil. Hareket çizgileri yukarı. |
| **`ninja_babisko_2.png`** | Ninja **yere indi**, dizleri bükük, kılıcı kınından çekiyor (sağ elde, yarı çekilmiş). Yandan profil. |
| **`ninja_babisko_3.png`** | Ninja **kılıçla geniş yatay saldırı**, kılıç sağdan sola sallanıyor, hız çizgileri. |
| **`ninja_babisko_4.png`** | Ninja **toparlanma duruşu**, kılıç havada parıltı veriyor, ayakta dik, zafer pozu. |

**Karakter tasarımı notları (Antigravity'ye):**
- Babisko = baba + çocuksu son ek. Karakter **bir baba figürünü çağrıştırmalı** — ama klasik ninja kostümlü (siyah veya koyu lacivert).
- Yüzde maske, sadece gözler görünür. Gözler **şefkatli** olmalı (öfkeli değil — çünkü mesaj "yardımcı baba").
- Renk paleti: Siyah/koyu lacivert gi (üniforma), kırmızı kuşak, gümüş katana, ten rengi gözler.
- Boyut diğer bitkilerle aynı (128×128) — sahada büyük görünmesi için canvas'ta `boyut = 200` ile büyütülerek çizilecek (kod tarafı zaten yazılacak).

**Üretim sonrası kontrol:**
- 4 PNG'nin hepsi 128×128 olmalı, ~10-30 KB arası.
- Transparan arka plan (Format32bppArgb / RGBA).
- Frame'ler arası **silüet sürekliliği** olmalı — animasyon akıcı görünsün diye yüz, vücut oranı, kostüm aynı kalsın.

> Eğer Imagen çıktısı 1024×1024 gelirse: `downscale_squash.py` pattern'iyle yeni bir `downscale_ninja.py` script yazılabilir (4 dosyayı sırayla işler). Bunu Antigravity karar versin — gerekirse spec'in dışına ek bir adım.

---

## ✂️ Değişiklikler (Dosya Bazlı)

### 4.a — `data/seviyeler.js` — Dalga 46'yı yeniden tanımla

**Mevcut hali (silinecek 10 zombi):**
```javascript
{
  "no": 46,
  "dalga_gecikme_ms": 20000,
  "zombiler": [
    {"tip": "kaskli", "gecikme_ms": 0},
    {"tip": "balonlu", "gecikme_ms": 800},
    // ... 10 satır toplam
  ]
}
```

**Yeni hali:**
```javascript
{
  "no": 46,
  "dalga_gecikme_ms": 20000,
  "cutscene_ninja": true,
  "zombi_sayisi": 200,
  "dagit_ms": 8000,
  "zombiler": []
}
```

**Anlamı:**
- `cutscene_ninja: true` → bu dalga özel davranışa girer
- `zombi_sayisi: 200` → 200 normal zombi spawn olur
- `dagit_ms: 8000` → 8 saniye boyunca dağılır (her 40ms'de bir zombi = ortalama)
- `zombiler: []` → manuel liste boş, kod otomatik üretir
- Mevcut 10 zombilik liste **tamamen silinir**

> Dalga 45 ve 47'ye **dokunma** — sadece dalga 46.

### 4.b — `js/oyun.js` — Cutscene altyapısı

Bu en büyük değişiklik. **Mevcut hiçbir kodu silme/değiştirme**, sadece ekle. Sıra:

#### 4.b.1 — Constructor'a state ekle (yaklaşık satır 32 civarı)

Mevcut `this.durum = "hazirlik"` satırının yanına ekle:

```javascript
        // Cutscene state (Ninja Babisko ve gelecek cutscene'ler için)
        this.cutsceneAktif = false;
        this.cutsceneFaz = null;        // "yazi" | "saldiri" | "bitis"
        this.cutsceneZaman = 0;          // Toplam cutscene zamanı (ms)
        this.cutsceneFrameIndex = 0;     // Ninja animasyon frame (0-3)
        this.cutsceneFrameZaman = 0;     // Frame değişim sayacı
```

> `this.durum` enum'una `"cutscene"` ekleme — cutscene'i ayrı flag (`this.cutsceneAktif`) ile yönetiyoruz çünkü durum geçişleri (hazirlik → oynaniyor → bitti) karmaşıklaşmasın.

#### 4.b.2 — `dalgaBaslat()` içinde özel spawn (yaklaşık satır 54 civarı)

Mevcut `this.bekleyenZombiler = dalga.zombiler.map(...)` satırını koru, **öncesine** kontrol ekle:

```javascript
        // Cutscene dalgası mı? 200 zombiyi otomatik üret
        if (dalga.cutscene_ninja) {
            this.bekleyenZombiler = [];
            const aralik = dalga.dagit_ms / dalga.zombi_sayisi; // 40ms aralık
            for (let i = 0; i < dalga.zombi_sayisi; i++) {
                this.bekleyenZombiler.push({
                    tip: "normal",
                    gecikme_ms: Math.floor(i * aralik),
                    satir: i % this.izgara.satirSayisi // 5 satıra eşit dağıt
                });
            }
        } else {
            this.bekleyenZombiler = dalga.zombiler.map(z => ({ ...z }));
        }
```

#### 4.b.3 — `guncelle()` başına cutscene kontrolü (yaklaşık satır 481-482)

Mevcut `if (this.durum !== "oynaniyor") return;` satırından **önce** ekle:

```javascript
        // Cutscene aktifse normal mantık atlanır, sadece cutscene ilerletilir
        if (this.cutsceneAktif) {
            this.cutsceneGuncelle(gecenZaman);
            return;
        }
```

#### 4.b.4 — Cutscene tetikleme kontrolü `guncelle()` içinde (zombi spawn döngüsünden sonra)

Zombi spawn döngüsü bittikten sonra, "Dalga bitti mi" kontrolünden **önce** ekle:

```javascript
        // Cutscene tetikleme: dalga 46'da 10 zombi canvas yarısına ulaşırsa
        if (!this.cutsceneAktif) {
            const aktifDalga = this.seviye.dalgalar[this.guncelDalgaIndex];
            if (aktifDalga && aktifDalga.cutscene_ninja) {
                const yari = this.canvas.width / 2;
                let yariGecenler = 0;
                for (let z of this.zombiler) {
                    if (z.x <= yari) yariGecenler++;
                    if (yariGecenler >= 10) break;
                }
                if (yariGecenler >= 10) {
                    this.cutsceneBaslat();
                }
            }
        }
```

#### 4.b.5 — Yeni metodlar (sınıfın sonuna ekle, mevcut metodların yanına)

```javascript
    // Cutscene'i başlatır (Ninja Babisko ekran ortasına düşer)
    cutsceneBaslat() {
        this.cutsceneAktif = true;
        this.cutsceneFaz = "yazi";
        this.cutsceneZaman = 0;
        this.cutsceneFrameIndex = 0;
        this.cutsceneFrameZaman = 0;
        
        // Başlık banner'ı (yeni .ninja-banner CSS class'ı ile)
        this.arayuz.ninjaBaslikGoster("⚔️ NINJA BABISKO! ⚔️");
    }
    
    // Her karede cutscene state'ini ilerletir
    // Faz 1 (0-1000ms): Başlık, zombiler donuk durur
    // Faz 2 (1000-3000ms): Ninja animasyonu, 3000ms'de tüm zombiler silinir
    // Faz 3 (3000-4000ms): Bitiş mesajı
    // 4000ms sonra cutsceneAktif=false, dalga otomatik biter (zombiler boş)
    cutsceneGuncelle(gecenZaman) {
        this.cutsceneZaman += gecenZaman;
        
        // Frame animasyonu (her 500ms frame değişir, 4 frame loop)
        this.cutsceneFrameZaman += gecenZaman;
        if (this.cutsceneFrameZaman >= 500) {
            this.cutsceneFrameZaman = 0;
            this.cutsceneFrameIndex = (this.cutsceneFrameIndex + 1) % 4;
        }
        
        // Faz geçişleri
        if (this.cutsceneFaz === "yazi" && this.cutsceneZaman >= 1000) {
            this.cutsceneFaz = "saldiri";
        } else if (this.cutsceneFaz === "saldiri" && this.cutsceneZaman >= 3000) {
            // Tüm zombileri sil (saha + bekleyenler)
            this.zombiler = [];
            this.bekleyenZombiler = [];
            this.cutsceneFaz = "bitis";
            this.arayuz.ninjaBaslikGoster("Ne zaman yardım lazım olursa, Ninja Babisko hep yanında!");
        } else if (this.cutsceneFaz === "bitis" && this.cutsceneZaman >= 4000) {
            // Cutscene bitti, normal akışa dön (dalga otomatik biter)
            this.cutsceneAktif = false;
            this.cutsceneFaz = null;
        }
    }
    
    // Cutscene faz 2/3 sırasında ninja PNG'sini ekran ortasına çizer
    cutsceneCiz() {
        if (!this.cutsceneAktif) return;
        if (this.cutsceneFaz !== "saldiri" && this.cutsceneFaz !== "bitis") return;
        
        const frameNo = this.cutsceneFrameIndex + 1; // 1-4
        const gorselYolu = `assets/cutscene/ninja_babisko_${frameNo}.png`;
        const gorsel = window.gorselYukleyici && window.gorselYukleyici.getir(gorselYolu);
        
        if (gorsel) {
            const boyut = 200; // Sahada büyük görünsün (kaynak 128, scale up)
            const merkezX = this.canvas.width / 2;
            const merkezY = this.canvas.height / 2;
            this.ctx.drawImage(gorsel, merkezX - boyut / 2, merkezY - boyut / 2, boyut, boyut);
        }
    }
```

#### 4.b.6 — Render döngüsüne cutscene çizimini ekle (yaklaşık satır 765-770 civarı, render fonksiyonunun sonuna)

Tüm bitki/zombi/mermi çiziminden **sonra**, en üstte görünmesi için ekle:

```javascript
        // Cutscene karakterini en üst katmana çiz (zombi/bitki üstünde)
        this.cutsceneCiz();
```

### 4.c — `js/arayuz.js` — Ninja başlık metodunu ekle

Mevcut `bossGeliyor()` metodunun **yanına** (silmeden) yeni metod ekle:

```javascript
    // Ninja Babisko cutscene için özel banner (kırmızı, sessiz)
    // bossGeliyor()'dan farkı: ses çalmaz, farklı CSS class kullanır
    ninjaBaslikGoster(baslik) {
        let banner = document.getElementById("ninja-banner");
        if (!banner) {
            banner = document.createElement("div");
            banner.id = "ninja-banner";
            document.getElementById("oyun-alani").appendChild(banner);
        }
        banner.innerText = baslik;
        banner.classList.add("aktif");
        
        // 1.5 saniye sonra kaybolsun (cutscene faz süreleriyle uyumlu)
        setTimeout(() => {
            banner.classList.remove("aktif");
        }, 1500);
    }
```

> `bossGeliyor`'u REUSE ETME — o ses çalıyor (`boss_giris`), bizim cutscene sessiz olmalı. Ayrı metod, ayrı DOM element, ayrı CSS class.

### 4.d — `css/style.css` — Ninja banner stili

Mevcut `#boss-banner` blokunun (yaklaşık satır 191-214) **sonrasına** ekle:

```css
/* Ninja Babisko cutscene banner — kırmızı/dramatik */
#ninja-banner {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    background: rgba(0, 0, 0, 0.92);
    color: #FF1744;                  /* Saf kırmızı (boss banner'dan farklı) */
    padding: 24px 48px;
    font-size: 28px;
    font-family: 'Press Start 2P', sans-serif;
    border: 4px solid #FF1744;
    border-radius: 12px;
    box-shadow: 0 0 40px #FF1744;
    z-index: 200;                    /* Boss banner'ın üstünde (z=100) */
    opacity: 0;
    pointer-events: none;
    text-align: center;
    max-width: 80%;
    line-height: 1.4;
    transition: opacity 0.3s, transform 0.3s;
}

#ninja-banner.aktif {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}
```

### 4.e — `js/gorsel_yukleyici.js` — 4 ninja PNG'sini yükleme listesine ekle

`yuklenecekListesi` array'inin sonuna (hibrit bitkilerin altına, son `]` öncesi virgül ekleyip):

```javascript
            "assets/cutscene/ninja_babisko_1.png",
            "assets/cutscene/ninja_babisko_2.png",
            "assets/cutscene/ninja_babisko_3.png",
            "assets/cutscene/ninja_babisko_4.png"
```

> `assets/bitkiler/` veya `assets/zombiler/` altına KOYMA — bu cutscene karakteri, ayrı klasörde durmalı.

---

## ✅ Test Senaryoları

### Hızlı Dalga 46'ya gitme yöntemi (test için)

Antigravity test sırasında 45 dalga oynamak zorunda kalmasın diye, `js/oyun.js`'in `dalgaBaslat()` üstünde geçici olarak şu satırı **YORUM SATIRI** olarak ekleyebilir (test bitince silinmek üzere):

```javascript
// TEST: Direkt dalga 46'ya atla (production'da SİLİNECEK)
// this.guncelDalgaIndex = 45;
```

Test sırasında yorumu açar, geçince geri kapatır. **Üretime KESİNLİKLE bu satır gitmemeli.** Tamamlanma kriterinde `git diff` ile bu satırın yorumlu olduğu doğrulanacak.

Alternatif (daha temiz): Tarayıcı konsolundan manuel:
```javascript
window.OyunYonetici.guncelDalgaIndex = 45;
window.OyunYonetici.dalgaBaslat();
```

### Test 1 — Dalga 46 başlangıcı + cutscene tetikleme
1. Oyunu aç, dalga 46'ya atla (yukarıdaki yöntem).
2. 200 zombi sağdan dökülmeli (8 saniye boyunca dağıtık).
3. Yaklaşık 4-6 saniye sonra (zombiler ekranın yarısına ulaşınca) cutscene tetiklenmeli.
4. **Beklenen:** Tüm zombiler donar (hareket etmez), ekran ortasında "⚔️ NINJA BABISKO! ⚔️" kırmızı banner belirir.
5. **Hata:** Banner çıkmıyorsa CSS yüklü değil veya `ninjaBaslikGoster` çağrılmamış. Zombiler hareket etmeye devam ediyorsa `cutsceneAktif` flag'i `guncelle()` başında kontrol edilmemiş.

### Test 2 — Ninja animasyonu (Faz 2)
1. Banner çıktıktan 1 saniye sonra ekran ortasında **Ninja Babisko PNG'si** belirmeli.
2. PNG her 500ms'de bir frame değiştirmeli (1→2→3→4→1→...).
3. **Beklenen:** 4 frame'lik akıcı saldırı animasyonu.
4. **Hata:** PNG yok → emoji fallback yok (cutscene için fallback yazılmadı) → `gorsel_yukleyici.js`'e ekleme atlanmış. Frame değişmiyorsa `cutsceneFrameZaman` mantığı bozuk.

### Test 3 — Zombilerin silinmesi
1. Banner çıkışından 3 saniye sonra (cutscene faz "saldiri" bitince) **tüm zombiler ekrandan silinmeli**.
2. **Beklenen:** Hem sahada görünenler hem `bekleyenZombiler` (henüz spawn olmamış 100+ zombi) silinir.
3. **Hata:** Sahada zombi kalırsa `this.zombiler = []` çalışmamış. Daha sonra zombi spawn olmaya devam ediyorsa `this.bekleyenZombiler = []` eksik.

### Test 4 — Bitiş mesajı
1. Zombiler silindikten hemen sonra "**Ne zaman yardım lazım olursa, Ninja Babisko hep yanında!**" mesajı belirmeli.
2. **Beklenen:** Aynı kırmızı banner stilinde, 1 saniye boyunca görünür.
3. **Hata:** Mesaj çıkmıyorsa `cutsceneGuncelle` faz geçişi yanlış. Banner çok hızlı kayboluyorsa CSS transition süreleriyle JS setTimeout çatışıyor.

### Test 5 — Dalga otomatik bitişi
1. Bitiş mesajı kaybolduktan sonra (cutscene 4. saniye) **dalga 47'ye geçilmeli**.
2. **Beklenen:** "Dalga bitti, kart seçimi başlıyor" log + 3 saniye ara + Dalga 47 başlar.
3. **Hata:** Dalga 47'ye geçmiyorsa `cutsceneAktif = false` yapılmamış veya `bekleyenZombiler` temizlenmemiş.

### Test 6 — Sessizlik kontrolü
1. Cutscene boyunca hoparlörü dinle.
2. **Beklenen:** Hiçbir efekt sesi çalmamalı (boss girişi, patlama, ses yok). Arka plan müziği devam edebilir.
3. **Hata:** `bossGeliyor` REUSE edilmiş olabilir (o ses çalar).

### Test 7 — Sürpriz kontrolü (en kritik!)
1. Yeni oyun başlat, **F12 konsolunu aç**.
2. Dalga 1'den 45'e kadar tüm konsol loglarına bak.
3. **Beklenen:** Hiçbir yerde "ninja", "babisko", "cutscene" kelimesi geçmemeli (oyun başlamadan ipucu sızmamalı).
4. **Hata:** Debug log eklenmişse Doruk için sürpriz bozulur.

### Test 8 — Tekrarlanabilirlik
1. Dalga 46 cutscene'i izle.
2. Oyunu yenile (F5), tekrar dalga 46'ya atla.
3. **Beklenen:** Cutscene tekrar tetiklenir, aynı şekilde çalışır.
4. **Hata:** Tek seferlik flag (localStorage vb.) varsa tekrar çalışmaz — bu spec'te öyle bir flag YOK.

### Test 9 — Regresyon: SPEC-001/002/003 bozulmadı
1. Dalga 1-45 normal oynanışı çalışıyor mu?
2. Squash fusion (ceviz+ceviz) dalga 30+'da çalışıyor mu?
3. Diğer 6 fusion (Güneş Atıcı, Buz Kalesi vb.) hâlâ açılıyor mu?
4. Kaktüs balonlu dalgalarda kartta geliyor mu?
5. **Beklenen:** Hepsi önceki gibi çalışmalı.

### Test 10 — Test atlama satırı temizliği
1. `git diff js/oyun.js` çıktısında `this.guncelDalgaIndex = 45` satırı **yorumlu** veya **silinmiş** olmalı.
2. **Beklenen:** Üretime test kodu sızmamalı.

---

## 🚫 Anti-Pattern (Antigravity'ye Sınırlamalar)

Aşağıdakileri **YAPMA**:

### Önceki spec'leri bozma

- ❌ `js/oyun.js` satır 866 SPEC-001 fix'ini değiştirme (`filter(b => !BITKILER_DATA[b].hibrit)`).
- ❌ `js/bitki.js` SPEC-002 `tetikleyici_ezme` mantığını değiştirme.
- ❌ `data/bitkiler.js`'teki `squash` entry'sine veya diğer bitkilere dokunma.
- ❌ `data/fusion_tarifleri.js`'teki `"ceviz+ceviz"` tarifine veya diğerlerine dokunma (SPEC-003 değeri 30 korunmalı).
- ❌ `assets/bitkiler/squash.png`'i değiştirme (128×128 hali korunmalı).
- ❌ `downscale_squash.py`'yi silme veya değiştirme.

### Sürpriz felsefesini bozma

- ❌ Konsol logu ekleme (`console.log("Ninja cutscene başladı")` vb.) — Doruk F12 açarsa sürpriz bozulur.
- ❌ Karakter ismini herhangi bir veri dosyasında öne çıkarma (yorum satırı hariç).
- ❌ Dalga 45 sonunda "Dalga 46 yaklaşıyor: ???" gibi anons ekleme.
- ❌ Ses ekleme — cutscene SESSİZ olmalı. `window.sesYonetici.efektCal(...)` ÇAĞIRMA.
- ❌ Müziği değiştirme — mevcut müzik (varsa) devam etsin.

### Mimari kurallar

- ❌ `bossGeliyor()` metodunu REUSE etme — o ses çalıyor. Yeni `ninjaBaslikGoster()` metodu ekle.
- ❌ Mevcut `#boss-banner` CSS class'ını değiştirme — yeni `#ninja-banner` ekle.
- ❌ `this.durum`'a yeni enum değeri ekleme. Cutscene için ayrı `this.cutsceneAktif` flag kullan (mevcut "hazirlik/oynaniyor/bitti" akışını bozma).
- ❌ Mevcut zombi sınıfını değiştirme (`Zombi`'ye yeni method ekleme). Cutscene karakteri kendi PNG'lerine sahip, `Zombi` instance DEĞİL.
- ❌ Yeni JS sınıfı oluşturma (`class NinjaBabisko` gibi). Tüm mantık `oyun.js`'te 3 metoda sığar (`cutsceneBaslat`, `cutsceneGuncelle`, `cutsceneCiz`).
- ❌ `alanHasariVer()`'i kullanma. Zombi silmek için doğrudan `this.zombiler = []` yeterli (efekt yok, tek vuruş).
- ❌ ES6 `import/export` ekleme. Vanilla JS, `file://` uyumlu.
- ❌ Test atlama kodunu (`this.guncelDalgaIndex = 45`) **yorumlu olmadan** bırakma. Test sonrası ya sil ya yorumla.
- ❌ Cutscene bitince dalga 47'ye geçişi MANUEL tetikleme. Mevcut "dalga bitti mi" mantığı (zombiler ve bekleyenler boş ise) zaten otomatik geçirir.

### Klasör ve dosya kuralları

- ❌ `assets/bitkiler/` veya `assets/zombiler/` altına ninja PNG'lerini koyma. **Yeni klasör: `assets/cutscene/`.**
- ❌ Ninja için sprite sheet (tek dosya) kullanma. **4 ayrı PNG**, zombi pattern'iyle tutarlı.
- ❌ Ninja PNG'lerini 256×256 veya başka boyutta yapma. **128×128** zorunlu (üretim sonrası downscale gerekirse `downscale_ninja.py` ile).
- ❌ Yeni Python script GEREKLİ DEĞİLSE oluşturma. Imagen 128×128 üretirse script yok, üretmezse `downscale_ninja.py` ekle.

**Dokunulacak dosyalar (kesin):**
1. `data/seviyeler.js` — dalga 46 (10 zombi → cutscene formatı)
2. `js/oyun.js` — constructor state + 3 yeni metod + 2 hook (`guncelle`, render)
3. `js/arayuz.js` — `ninjaBaslikGoster()` metodu (yeni)
4. `css/style.css` — `#ninja-banner` ve `.aktif` (yeni blok)
5. `js/gorsel_yukleyici.js` — 4 satır ekleme
6. `assets/cutscene/ninja_babisko_1.png` ... `_4.png` — 4 yeni PNG (Imagen ile)
7. **Opsiyonel:** `downscale_ninja.py` (Imagen 1024 üretirse)

**Toplam:** 5 mevcut dosyada değişiklik + 4 yeni PNG + 1 yeni klasör + opsiyonel 1 script.

---

## 📌 Tamamlanma Kriteri

### Görsel üretim
- [ ] `assets/cutscene/` klasörü oluşturuldu.
- [ ] 4 PNG üretildi (ninja_babisko_1 ... _4), 128×128, transparan arka plan, ~10-30 KB.
- [ ] Frame'ler arası silüet tutarlı, animasyon akıcı.

### Kod değişiklikleri
- [ ] `data/seviyeler.js` dalga 46 yeni formatta (`cutscene_ninja: true`, `zombi_sayisi: 200`, `dagit_ms: 8000`, `zombiler: []`).
- [ ] `js/oyun.js` constructor'a 5 cutscene state field eklendi.
- [ ] `js/oyun.js` `dalgaBaslat()` özel spawn mantığı eklendi (cutscene_ninja kontrolü).
- [ ] `js/oyun.js` `guncelle()` başına cutscene aktif kontrolü eklendi.
- [ ] `js/oyun.js` `guncelle()` içine 10 zombi yarı kontrolü eklendi.
- [ ] `js/oyun.js` 3 yeni metod: `cutsceneBaslat`, `cutsceneGuncelle`, `cutsceneCiz`.
- [ ] `js/oyun.js` render fonksiyonunda `cutsceneCiz()` çağrısı eklendi.
- [ ] `js/arayuz.js` `ninjaBaslikGoster()` metodu eklendi (bossGeliyor REUSE değil).
- [ ] `css/style.css` `#ninja-banner` ve `.aktif` blokları eklendi.
- [ ] `js/gorsel_yukleyici.js` 4 ninja PNG satırı eklendi.

### Önceki spec'lerin korunması
- [ ] `git diff js/oyun.js` SPEC-001 satır 866 fix'ini içeriyor (değişmedi).
- [ ] `git diff js/bitki.js` SPEC-002 tetikleyici_ezme bloklarını içeriyor (değişmedi).
- [ ] `git diff data/bitkiler.js` boş veya sadece SPEC öncesi durum (squash entry değişmedi).
- [ ] `git diff data/fusion_tarifleri.js` boş (ceviz+ceviz acilma_seviye 30 korundu).
- [ ] `assets/bitkiler/squash.png` hâlâ 128×128.

### Sürpriz disiplini
- [ ] Hiçbir dosyada `console.log("ninja...")` veya benzeri sürpriz bozucu log YOK.
- [ ] Hiçbir UI metninde dalga 45 öncesi "ninja" geçmiyor.
- [ ] Cutscene'de ses çalmıyor (Test 6 manuel doğrulandı).

### Test
- [ ] Test 1-10 manuel olarak çalıştırıldı, hepsi geçti.
- [ ] Test atlama kodu (`this.guncelDalgaIndex = 45`) yorumlu veya silinmiş.
- [ ] Doruk veya Başbuğ cutscene'i ilk kez izleyip duygusal etkiyi yaşadı.

---

*Bu spec, kodun ötesinde bir baba-oğul mesajıdır. Doruk panikleyeceği anda ekranda baba figürü belirip "Hep yanındayım" diyecek. Antigravity bu detayı önemseyerek uygulayacak — özellikle sürpriz disiplini ve sessizlik kuralı oyunun ruhunu taşıyor.*

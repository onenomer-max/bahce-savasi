# SPEC-002 — Squash Bitkisi Entegrasyonu

**Yazan:** Claude Code (saha analiz)
**Tarih:** 2026-05-23
**Hedef:** Antigravity (kodcu)
**Onaylayan:** Başbuğ
**Öncelik:** 🟢 ORTA — Doruk'un 22 Mayıs test seansında yarıda kalan tasarımı tamamlama
**Bağımlılık:** SPEC-001 tamamlanmış olmalı (`js/oyun.js:866` hibrit filtre fix'i mevcut olmalı)

---

## 🎯 Amaç

Doruk'un orijinal Squash tasarımını oyuna entegre etmek. Squash:

- **Davranışı:** Yerleştirildikten 500ms sonra "uyanır". Aynı satırda 1 hücre ileride zombi belirirse zıplar, üstüne düşer, ezerek tek vuruşta öldürür, sonra kendi yok olur.
- **Erişim:** Normal kart menüsünde **görünmez**. Sadece fusion ile elde edilir: `ceviz + ceviz → squash` (Level 50'de açılır).
- **Hedef kitle:** Doruk'un kendi mekanik tasarımı — özen göstererek uygulanmalı, "babanın yaptığı oyun" değil "ailenin yaptığı oyun" hedefinin parçası.

---

## ⚙️ Parametreler (Başbuğ tarafından netleştirilmiş)

| Parametre | Değer |
|---|---|
| **Adı** | Squash |
| **Tip (yeni)** | `tetikleyici_ezme` |
| **Maliyet** | 150 güneş |
| **HP** | 1 (tek seferlik) |
| **Hasar** | 1800 (zombi_kral hariç her şeyi tek vuruşta öldürür) |
| **Tetikleme mesafesi** | 1 hücre (aynı satırda, 1 hücre ileri) |
| **Uyanma süresi** | 500ms (yerleşim sonrası) |
| **Animasyon** | Zıpla yukarı → hedefin üstüne düş → ez |
| **Görsel** | `assets/bitkiler/squash.png` (1024×1024 → **128×128'e downscale edilecek**) |
| **hibrit** | `true` (kart menüsünde görünmez — SPEC-001 fix'i ile uyumlu) |
| **acilma_seviye** | 50 |
| **Fusion tarifi** | `"ceviz+ceviz" → squash` (tek satır, simetrik) |

---

## 🛠️ Önişlem — `squash.png` Downscale

**Sorun:** Mevcut `assets/bitkiler/squash.png` **1024×1024, 471 KB**. Diğer tüm bitki PNG'leri 128×128, ~7-16 KB. Bu fark `gorsel_yukleyici.js`'in paralel yükleme süresini, GPU bellek kullanımını ve mobil cihaz performansını olumsuz etkiler. `bitki.js:157`'de zaten 80×80'e render ediliyor, kaynak çözünürlük israf.

### Yapılacak

Proje köküne **yeni Python scripti** oluştur: `downscale_squash.py`

İçerik (Antigravity yazacak):
```python
# downscale_squash.py
# Squash.png'yi 1024x1024 -> 128x128'e indirir (diğer bitkilerle uyumlu boyut)
# Tek seferlik üretim aracıdır (CLAUDE.md'deki "kök dizindeki Python scriptler" kuralına uyar)

from PIL import Image

KAYNAK = "assets/bitkiler/squash.png"
HEDEF = "assets/bitkiler/squash.png"  # Yerine yaz (üzerine yaz)

img = Image.open(KAYNAK)
img_resized = img.resize((128, 128), Image.LANCZOS)
img_resized.save(HEDEF, "PNG", optimize=True)

print(f"OK: {KAYNAK} -> 128x128 ({Image.open(HEDEF).size})")
```

**Çalıştırma:** `python downscale_squash.py` (Pillow gerekli — `pip install Pillow`).

**Beklenen sonuç:** `squash.png` 128×128, ~10-20 KB civarına iner, transparan arka plan korunur.

> Not: Bu script tek seferliktir, sonradan silinmesi gerekmez (CLAUDE.md: "eski scriptler referans için tutulur").

---

## ✂️ Değişiklikler (Dosya Bazlı)

### 3.a — `data/bitkiler.js` (yeni entry)

Mevcut `zirhli_aycicegi` entry'sinin **sonuna** (`}` kapanış brace'inden önce, virgülle ayırarak) yeni `squash` entry'si eklenecek:

```javascript
  "squash": {
    "ad": "Squash",
    "emoji": "🎃",
    "görsel": "assets/bitkiler/squash.png",
    "maliyet": 150,
    "hp": 1,
    "tip": "tetikleyici_ezme",
    "hasar": 1800,
    "tetikleme_mesafesi_hucre": 1,
    "uyanma_sure_ms": 500,
    "ziplama_yukseklik_px": 80,
    "ziplama_sure_ms": 600,
    "hibrit": true,
    "acilma_seviye": 50
  }
```

**Notlar:**
- `hibrit: true` → SPEC-001 fix'i sayesinde otomatik olarak kart menüsünden gizlenir.
- `acilma_seviye: 50` → Fusion sistemi bu alanı kullanır.
- `tip: "tetikleyici_ezme"` → **YENİ tip**, mevcut `"tek_seferlik_patlama"` ile karıştırma.
- Emoji 🎃 fallback için (squash = bal kabağı). PNG yüklenemezse emoji çizilir.

### 3.b — `data/fusion_tarifleri.js` (tek satır ekle)

**Mevcut tariflerin sonuna**, son tarifin `}` kapanış brace'inden önce virgülle ekle:

```javascript
  "ceviz+ceviz": { sonuc: "squash", acilma_seviye: 50 }
```

⚠️ **ÖNEMLİ — ÇİFT KAYIT YAZMA!**

Mevcut tariflerin hepsi çift kayıtlı (`"A+B"` ve `"B+A"` ayrı satır) çünkü string lookup'ta sıra önemli. Ama `"ceviz+ceviz"` **simetrik** — `bitki1.tip + "+" + bitki2.tip` her iki sırada da aynı stringi üretir. **Tek satır yeterli.** İkinci `"ceviz+ceviz"` satırı yazmak tekrar olur, dosyayı kirletir.

### 3.c — `js/bitki.js` (yeni davranış mantığı)

Üç fonksiyona dokunulacak: `constructor`, `guncelle`, `ciz`. Mevcut mantığa **paralel** bir blok eklenecek — `"tek_seferlik_patlama"` bloğunu DEĞİŞTİRME, yanına yeni blok ekle.

#### Constructor (satır 4-52 arası)

Mevcut `if (veri.tip === "tek_seferlik_patlama" || veri.patlayici)` bloğunun **yanına**, yeni bir blok ekle:

```javascript
        // Squash gibi tetikleyici ezme bitkileri için state
        if (veri.tip === "tetikleyici_ezme") {
            this.uyandiMi = false;           // 500ms uyanma sonrası true olur
            this.uyanmaZamanlayici = 0;      // 0'dan uyanma_sure_ms'e sayar
            this.ziplamaAktif = false;       // Tetiklenince true
            this.ziplamaZamani = 0;          // 0'dan ziplama_sure_ms'e sayar
            this.hedefZombi = null;          // Hangi zombi ezilecek
            this.ezildiMi = false;           // Düşüş sırasında hasar verildi mi (tek vuruş garantisi)
        }
```

#### `guncelle(gecenZaman)` (satır 56-111 arası)

Mevcut "Tek seferlik patlama mantığı" bloğunun **sonrasına** (satır 110 civarı, `}` kapanışından önce DEĞİL, sonra ekle), yeni bir blok:

```javascript
        // Squash: tetikleyici ezme mantığı
        if (this.data.tip === "tetikleyici_ezme") {
            // 1) Uyanma fazı (500ms)
            if (!this.uyandiMi) {
                this.uyanmaZamanlayici += gecenZaman;
                if (this.uyanmaZamanlayici >= this.data.uyanma_sure_ms) {
                    this.uyandiMi = true;
                }
                return; // Uyanmadan hiçbir şey yapma
            }
            
            // 2) Zıplama aktif değilse: aynı satırda 1 hücre ileride zombi tara
            if (!this.ziplamaAktif && window.OyunYonetici) {
                const hucreGen = window.OyunYonetici.izgara.hucreGenislik;
                const tetiklemeXMin = this.x;
                const tetiklemeXMax = this.x + (this.data.tetikleme_mesafesi_hucre * hucreGen);
                
                for (let z of window.OyunYonetici.zombiler) {
                    if (z.satir === this.satir && z.x >= tetiklemeXMin && z.x <= tetiklemeXMax && z.hp > 0) {
                        this.hedefZombi = z;
                        this.ziplamaAktif = true;
                        this.ziplamaZamani = 0;
                        break;
                    }
                }
            }
            
            // 3) Zıplama aktifse: animasyon zamanlayıcısını ilerlet, düşüş tamamlanınca ez
            if (this.ziplamaAktif) {
                this.ziplamaZamani += gecenZaman;
                
                // Animasyonun yarısında (tepe noktası) henüz hasar yok
                // Animasyon tamamlanınca düşüş bitti = ez
                if (this.ziplamaZamani >= this.data.ziplama_sure_ms && !this.ezildiMi) {
                    this.ezildiMi = true;
                    if (this.hedefZombi && this.hedefZombi.hp > 0) {
                        this.hedefZombi.hasarAl(this.data.hasar, "ezme");
                    }
                    this.hp = 0; // Kendi yok ol
                    if (window.sesYonetici) window.sesYonetici.efektCal("patlama");
                }
            }
        }
```

**Mantık açıklaması (Antigravity için):**
- Adım 1: Yerleştirilince 500ms hareket etmez, sadece uyanma sayacı.
- Adım 2: Uyandıktan sonra her frame'de aynı satırdaki 1 hücrelik şeritte canlı zombi arar. Bulursa hedef belirler, animasyonu başlatır.
- Adım 3: Zıplama animasyonu 600ms sürer. Süre dolunca tek vuruşta hedefe 1800 hasar verir (kasklı=380, kovalı=600, normal=200 → hepsi ölür; zombi_kral=2500 → sağ kalır), sonra `hp = 0` ile kendini öldürür.
- `ezildiMi` flag'i ÇİFT tetiklenmesini engeller (frame içinde tam eşik aşılırsa bir kez vurmalı).

#### `ciz(ctx)` (satır 142-176 arası)

Mevcut `cizimX` hesabının (satır 146-150) **yanına** zıplama y-offset ekle. `cizimX +=` titreme bloğunu DEĞİŞTİRME, **paralel** bir `cizimY` değişkeni tanımla:

```javascript
        let cizimX = this.x;
        let cizimY = this.y;
        
        // Patlayan kiraz titreme animasyonu (mevcut blok, dokunma)
        if (this.patlamaGecikmesi && (this.patlamaGecikmesi - this.sonEylemZamani) < 500) {
            cizimX += (Math.random() * 4) - 2;
        }
        
        // Squash zıplama animasyonu — parabolik y offset
        // 0 -> yukarı, ortada tepe noktası, sonra hızla aşağı düşer
        if (this.data.tip === "tetikleyici_ezme" && this.ziplamaAktif) {
            const oran = this.ziplamaZamani / this.data.ziplama_sure_ms; // 0.0 -> 1.0
            // Sinüs ile yumuşak yukarı-aşağı (item.js:38 pattern'inden esin)
            const yOffset = Math.sin(oran * Math.PI) * this.data.ziplama_yukseklik_px;
            cizimY -= yOffset; // Yukarı = negatif y
            
            // Hedef zombinin üstüne doğru hafifçe kaydır (görsel ezme hissi)
            if (this.hedefZombi) {
                const dx = this.hedefZombi.x - this.x;
                cizimX += dx * oran;
            }
        }
```

**Sonra, mevcut `drawImage` ve emoji fallback bloğunda** `this.y` yerine `cizimY` kullanılmalı. Spesifik değişiklik:

```javascript
// Eski:
ctx.drawImage(gorsel, cizimX - boyut / 2, this.y - boyut / 2, boyut, boyut);
// Yeni:
ctx.drawImage(gorsel, cizimX - boyut / 2, cizimY - boyut / 2, boyut, boyut);

// Eski:
ctx.fillText(this.emoji, cizimX, this.y);
// Yeni:
ctx.fillText(this.emoji, cizimX, cizimY);
```

> Bu değişiklik **sadece çizim koordinatını** etkiler — `this.y` (mantıksal pozisyon) korunur, can barı / yetenek halo'su gibi diğer elemanlar `this.y` üzerinden çalışmaya devam eder. Squash zaten can barı çizmeyecek (HP=1, hasar almıyor).

### 3.d — `js/gorsel_yukleyici.js` (manuel liste güncellemesi) — ZORUNLU

**Kritik:** `gorsel_yukleyici.js` otomatik tarama yapmıyor, **hardcoded `yuklenecekListesi`** kullanıyor (satır 9-105). Squash'ı eklemezsen görsel yüklenmez, oyun emoji 🎃 fallback'ine düşer.

**Yapılacak:** Satır 17 (`"assets/bitkiler/gunesli_mantar.png",`) sonrasına yeni satır:

```javascript
            "assets/bitkiler/squash.png",
```

Kontekst (yeni hali):
```javascript
            "assets/bitkiler/kaktus.png",
            "assets/bitkiler/gunesli_mantar.png",
            "assets/bitkiler/squash.png",      // ← YENİ SATIR
            
            "assets/zombiler/zombi_normal.png",
```

> Squash hibrit listesinin (`assets/bitkiler/hibrit/` altı, satır 99-104) içine **KOYMA**. squash.png `assets/bitkiler/` kök altında, hibrit klasöründe değil.

---

## ✅ Test Senaryoları

Antigravity bitirince Başbuğ veya Doruk şu adımları manuel test edecek (`http://127.0.0.1:8000`):

### Test 1 — Fusion ile elde etme
1. Yeni oyun başlat (veya Level 50'ye kadar ilerlemiş bir kayıt aç).
2. Sahaya bir Ceviz dik.
3. Karttan ikinci bir Ceviz seçip aynı hücreye tıkla.
4. **Beklenen:** Squash 🎃 görseli hücrede belirir. Ekranda "✨ Squash! ✨" fusion efekti çıkar.
5. **Hata:** "Bu ikisi birleşemez!" mesajı çıkıyorsa fusion tarifi eklenmemiş ya da yanlış formatta.

### Test 2 — Uyanma süresi
1. Squash'ı sahaya dik (fusion ile).
2. **Beklenen:** İlk 500ms hareketsiz. Sonra "uyanır" — görselde değişiklik olmasa da artık tetiklenmeye hazır. (Görsel ipucu opsiyonel: console log "Squash uyandı" yeterli.)
3. **Hata:** Squash anında tetikleniyorsa veya hiç uyanmıyorsa uyanma mantığı bozuk.

### Test 3 — Tetikleme + ezme + yok olma
1. Squash'ı dik, 500ms bekle.
2. Aynı satıra normal zombi gelmesini bekle.
3. Zombi 1 hücre uzaklıktayken Squash zıplamalı (sinüs eğrisi ile yukarı çıkmalı).
4. Animasyon 600ms sürer, sonra zombinin üstüne düşer.
5. **Beklenen:** Zombi anında ölür (200 HP < 1800 hasar). Squash hücreden kaybolur. Patlama sesi çalar.
6. **Hata:** Zombi sağ kalıyor, Squash yerinde duruyor veya tekrar tekrar tetikleniyorsa mantık bozuk.

### Test 4 — Kasklı zombi de tek vuruşta
1. Squash'ı dik, kasklı zombi (kaskli, HP=380) gelmesini bekle.
2. **Beklenen:** Tek vuruşta ölür (1800 >> 380).
3. **Hata:** Kasklı sağ kalırsa hasar uygulanmıyor olabilir.

### Test 5 — Zombi Kral sağ kalmalı (sınır kontrolü)
1. Zombi Kral içeren bir dalgada (Level 50) Squash dik.
2. Zombi Kral 1 hücre yaklaşınca Squash tetiklensin.
3. **Beklenen:** Zombi Kral'a 1800 hasar girer ama ölmez (HP=2500). Squash yine de yok olur (ezildikten sonra HP=0 garantisi).
4. **Hata:** Squash ezdiği halde sağ kalıyorsa `this.hp = 0` satırı eksik.

### Test 6 — Normal kart menüsünde GÖRÜNMEMELİ
1. Yeni oyun başlat, dalga 1'den 20'ye kadar oyna.
2. Her dalga sonunda kart menüsüne bak.
3. **Beklenen:** Squash menüde HİÇ açılmamalı. (`hibrit: true` + SPEC-001 fix'i bunu garantiler.)
4. **Hata:** Squash kartı menüde belirirse `hibrit: true` eksik ya da SPEC-001 fix'i bozulmuş.

### Test 7 — Regresyon: Mevcut 6 fusion hâlâ çalışmalı
1. Level 20'ye gel, Ayçiçeği + Bezelye Atıcı → Güneş Atıcı oluşmalı.
2. Level 25, Bezelye + Kar Bezelye → Dondurucu Mitralyöz.
3. Level 30, Ceviz + Kar Bezelye → Buz Kalesi.
4. Level 35, Kaktüs + Patlayan Kiraz → Patlayan Hava Topu.
5. Level 40, Patlayan Kavun + Kar Bezelye → Buz Kavunu.
6. Level 45, Ayçiçeği + Ceviz → Zırhlı Ayçiçeği.
7. **Beklenen:** Hepsi çalışıyor. SPEC-001 ve SPEC-002 değişiklikleri mevcut tarifleri bozmamalı.

### Test 8 — Görsel boyutu doğrulama
1. Downscale scripti çalıştırıldıktan sonra `assets/bitkiler/squash.png` dosya bilgisi:
2. **Beklenen:** 128×128, ~10-20 KB, transparan arka plan korunmuş.
3. **Hata:** Hâlâ 1024×1024 veya boyut anormalse downscale çalışmamış.

---

## 🚫 Anti-Pattern (Antigravity'ye Sınırlamalar)

Aşağıdakileri **YAPMA**:

- ❌ `data/bitkiler.js`'teki diğer 13 bitkiye dokunma. Sadece sona yeni `squash` entry ekle.
- ❌ Mevcut 6 fusion tarifine dokunma. Sadece sona `"ceviz+ceviz"` ekle.
- ❌ `"ceviz+ceviz"` için ÇİFT kayıt yazma (simetrik, tek satır yeterli). Diğer tarifler asimetrik olduğu için çift kayıtlı, ama bu tarif değil.
- ❌ `js/oyun.js`'in **satır 866 SPEC-001 fix'ini** bozma. (`Object.keys(BITKILER_DATA).filter(b => !BITKILER_DATA[b].hibrit)` satırı korunmalı.) `oyun.js`'e bu spec için **hiç dokunma**.
- ❌ `alanHasariVer()` fonksiyonunu değiştirme. Squash zaten doğrudan `hedefZombi.hasarAl()` çağırıyor, alan hasarı kullanmıyor.
- ❌ `patlayan_kiraz` davranışını "kopyala-yapıştır" yapıp ufak değiştirme. Bu BAŞKA bir tip (`tetikleyici_ezme`), ayrı bir `if (this.data.tip === "tetikleyici_ezme")` bloğu olacak. `"tek_seferlik_patlama"` bloğunu OLDUĞU GİBİ BIRAK.
- ❌ ES6 `import/export` ekleme. Vanilla JS, `file://` uyumlu (CLAUDE.md İlke 3).
- ❌ Squash için yeni JS dosyası (`js/squash.js` vb.) oluşturma. Mantık `js/bitki.js` içinde mevcut Bitki sınıfının parçası olarak kalmalı.
- ❌ Yeni dosya oluşturma — **tek istisna:** `downscale_squash.py` (proje köküne, tek seferlik üretim aracı, CLAUDE.md'deki Python scriptleri kuralına uygun).
- ❌ Squash'ı `kilitAcikBitkiler` listesine eklemeye çalışma. Fusion ile elde edildiği için kart sisteminden bağımsız.
- ❌ Squash için ayrı bir `ses_yukleyici.js` entry'si ekleme. Mevcut `"patlama"` efekti yeterli (zaten `bitki.js`'te o çağırılıyor).
- ❌ Can barı çizimini özelleştirme. Squash HP=1 ve hasar almaz, mevcut `if (this.hp < this.maxHp)` zaten doğru davranır (her zaman false → bar çizilmez).

**Dokunulacak dosya listesi (kesin):**
1. `data/bitkiler.js` — 1 entry ekle
2. `data/fusion_tarifleri.js` — 1 satır ekle
3. `js/bitki.js` — 3 yere paralel blok ekle (constructor, guncelle, ciz)
4. `js/gorsel_yukleyici.js` — 1 satır ekle
5. `downscale_squash.py` — yeni dosya (proje kökü)

**Toplam:** 4 mevcut dosyada minimal müdahale + 1 yeni Python scripti.

---

## 📌 Tamamlanma Kriteri

- [ ] `downscale_squash.py` oluşturuldu ve çalıştırıldı → `squash.png` 128×128 oldu.
- [ ] `data/bitkiler.js`'e `"squash"` entry'si eklendi (parametreler tabloya uygun).
- [ ] `data/fusion_tarifleri.js`'e `"ceviz+ceviz"` tarifi eklendi (tek satır, çift kayıt YOK).
- [ ] `js/bitki.js` constructor'a `tetikleyici_ezme` state init bloğu eklendi.
- [ ] `js/bitki.js` `guncelle()`'ye uyanma + tetikleme + ezme mantığı eklendi (yeni `if` bloğu).
- [ ] `js/bitki.js` `ciz()`'e zıplama y-offset eklendi (`cizimY` değişkeni, `this.y` yerine kullanılıyor).
- [ ] `js/gorsel_yukleyici.js` `yuklenecekListesi`'ne `"assets/bitkiler/squash.png"` satırı eklendi.
- [ ] `js/oyun.js`'e DOKUNULMADI (`git diff js/oyun.js` boş, SPEC-001 fix'i korunmuş).
- [ ] Test 1-8 manuel olarak çalıştırıldı ve hepsi beklenen sonucu verdi.
- [ ] Doruk Squash'ı sahada gördü ve onayladı.
- [ ] Başbuğ son onay verdi.

---

*Bu spec, Doruk'un orijinal "zıpla → ez → yok ol" tasarımını koruyarak yazıldı. Antigravity uygulayacak, Doruk ve Başbuğ birlikte test edecek. Squash, çocuk-tasarım → AI-uygulama → aile-test üçgeninin somut göstergesi olacak.*

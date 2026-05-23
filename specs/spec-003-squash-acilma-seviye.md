# SPEC-003 — Squash Açılma Seviyesi Düzeltmesi

**Yazan:** Claude Code (saha analiz)
**Tarih:** 2026-05-23
**Hedef:** Antigravity (kodcu)
**Onaylayan:** Başbuğ
**Öncelik:** 🔴 KRİTİK — Doruk Squash'ı hiç deneyemeden oyun bitiyor
**Bağımlılık:** SPEC-001 ve SPEC-002 tamamlanmış olmalı

---

## 🎯 Amaç

SPEC-002'de Squash'ın `acilma_seviye` değeri **50** olarak ayarlanmıştı. Ancak:

- **Oyun toplam 50 dalgadan oluşuyor** (`data/seviyeler.js`).
- Fusion `acilma_seviye: 50` demek = oyuncu **son dalgayı tamamlayana kadar** Squash fusion'ını yapamaz.
- Doruk son dalgada zaten kazanmış ya da kaybetmiş olur → **Squash'ı hiç deneme şansı yok**.

Bu spec iki aşamalı düzeltme tanımlar:

| Aşama | acilma_seviye | Amaç |
|---|---|---|
| **SPEC-003a** | `1` | Dalga 1'den itibaren test imkanı — Doruk ve Başbuğ mekaniği hızlıca doğrulayacak |
| **SPEC-003b** | `30` | Final değer — kasklı/balonlu zombi döneminde devreye girer, orta zorlukta açılır |

**Uygulama akışı:**
1. Antigravity önce **SPEC-003a** kısmını uygular (test değeri = 1).
2. Doruk ve Başbuğ tüm Squash test senaryolarını (SPEC-002 Test 1-8) çalıştırır.
3. Test geçince Başbuğ Antigravity'e **SPEC-003b** uygulama talimatı verir (final değer = 30).
4. Spec dosyası tektir — iki bölüm aynı dosyada, sırayla uygulanır.

---

## 🔑 Kritik İlke: İki Dosya SENKRON Olmalı

`acilma_seviye` iki dosyada birden geçer ve **mutlaka aynı değere sahip olmalı:**

| Dosya | Alan | Kullanım |
|---|---|---|
| `data/bitkiler.js` | `BITKILER_DATA.squash.acilma_seviye` | UI/açılma bildirimi (`fusionAcildiBildir`) |
| `data/fusion_tarifleri.js` | `FUSION_TARIFLERI["ceviz+ceviz"].acilma_seviye` | Fusion kilidi (`fusionAcikMi()`) |

Bu iki değer farklı olursa: Fusion teknik olarak açılır ama bildirim yanlış seviyede tetiklenir (ya da tam tersi). **Her iki değer aynı anda değişmeli.**

---

## 📍 SPEC-003a — Test İçin Geçici Değer (acilma_seviye = 1)

**Uygulama zamanı:** Şimdi (Antigravity bu komutu alınca).

### 3a.1 — `data/bitkiler.js`

**Mevcut satır (SPEC-002 ile eklenmişti):**
```javascript
    "acilma_seviye": 50
```

**Yeni hali:**
```javascript
    "acilma_seviye": 1
```

> Bu satır `"squash"` entry'sinin **içinde**. Diğer hibrit bitkilerin (`gunes_atici`, `dondurucu_mitralyoz` vb.) `acilma_seviye` değerlerine **dokunma**.

### 3a.2 — `data/fusion_tarifleri.js`

**Mevcut satır (SPEC-002 ile eklenmişti):**
```javascript
  "ceviz+ceviz": { sonuc: "squash", acilma_seviye: 50 }
```

**Yeni hali:**
```javascript
  "ceviz+ceviz": { sonuc: "squash", acilma_seviye: 1 }
```

> Tek satır değişiklik. `"ceviz+ceviz"` simetrik tarif, çift kayıt YOK (SPEC-002'deki kural geçerli).

---

## 📍 SPEC-003b — Final Değer (acilma_seviye = 30)

**Uygulama zamanı:** Başbuğ test geçtiğini onayladıktan SONRA. Antigravity bu komutu **ayrı bir talimat** olarak alacak — SPEC-003a uygulamasıyla aynı anda DEĞİL.

### 3b.1 — `data/bitkiler.js`

**Mevcut satır (SPEC-003a sonrası):**
```javascript
    "acilma_seviye": 1
```

**Yeni hali:**
```javascript
    "acilma_seviye": 30
```

### 3b.2 — `data/fusion_tarifleri.js`

**Mevcut satır (SPEC-003a sonrası):**
```javascript
  "ceviz+ceviz": { sonuc: "squash", acilma_seviye: 1 }
```

**Yeni hali:**
```javascript
  "ceviz+ceviz": { sonuc: "squash", acilma_seviye: 30 }
```

---

## ✅ Test Senaryoları (SPEC-003a için)

SPEC-003a uygulandıktan sonra Başbuğ ve Doruk şunları doğrulayacak:

### Test 1 — Squash kart menüsünde GÖRÜNMEMELİ
1. Yeni oyun başlat.
2. Dalga 1'den 5'e kadar oyna.
3. Her dalga sonunda kart menüsüne bak.
4. **Beklenen:** Squash 🎃 menüde HİÇ açılmamalı. (`hibrit: true` flag'i SPEC-001 fix'i ile bunu garantiler — `acilma_seviye` değişimi bu davranışı etkilememeli.)
5. **Hata:** Squash kartı menüde belirirse SPEC-001 fix'i bozulmuş veya `hibrit: true` kaybolmuş.

### Test 2 — Dalga 1'den itibaren Ceviz+Ceviz fusion mümkün olmalı
1. Yeni oyun başlat. Başlangıç güneşi 100 — bir Ceviz dikmek için yeterli (maliyet 50).
2. **İlk Ceviz'i** dik.
3. Yeterli güneş biriksin diye bekle (Ayçiçeği yoksa gökten düşen güneşle topla).
4. İkinci Ceviz kartını seçip aynı hücreye tıkla.
5. **Beklenen:** Squash 🎃 oluşur. "✨ Squash! ✨" fusion efekti çıkar. "🔒 Level 1'de açılır!" mesajı **çıkmamalı** (zaten level 1'de açık).
6. **Hata:** "🔒 Level 1'de açılır!" mesajı çıkarsa `fusionAcikMi()` mantığında bir sorun var (`maksimumAcilanSeviye` localStorage başlangıç değeri 20'ydi — bu zaten 1'i kapsar, sorun olmamalı). "Bu ikisi birleşemez!" çıkarsa tarif dosyada yok.

### Test 3 — Regresyon: Mevcut 6 fusion'ın `acilma_seviye`'leri değişmemiş olmalı
1. `data/fusion_tarifleri.js`'i aç, gözle doğrula:
2. **Beklenen değerler (değişmemeli):**
   - `aycicegi+bezelye_atici` → 20
   - `bezelye_atici+kar_bezelye` → 25
   - `ceviz+kar_bezelye` → 30
   - `kaktus+patlayan_kiraz` → 35
   - `patlayan_kavun+kar_bezelye` → 40
   - `aycicegi+ceviz` → 45
3. `data/bitkiler.js`'te diğer 6 hibrit bitkinin `acilma_seviye` değerleri de aynı sırayla (20/25/30/35/40/45) korunmalı.

---

## ✅ Test Senaryoları (SPEC-003b için)

SPEC-003b uygulandıktan sonra Başbuğ doğrulayacak:

### Test 4 — Squash erken dalgalarda fusion edilmemeli
1. Yeni oyun başlat.
2. Dalga 1-29 arasında Ceviz+Ceviz birleştirmeyi dene.
3. **Beklenen:** "🔒 Level 30'de açılır!" mesajı çıkar, fusion gerçekleşmez.

### Test 5 — Dalga 30'da Squash açılma bildirimi
1. Dalga 30'a kadar oyna.
2. Dalga 30 başında **"🎉 YENİ FUSION AÇILDI: Squash!"** banner'ı ekranda belirmeli (oyun.js:392 `fusionAcildiBildir` fonksiyonu).
3. Bu dalgadan itibaren Ceviz+Ceviz fusion çalışmalı.

---

## 🚫 Anti-Pattern (Antigravity'ye Sınırlamalar)

Aşağıdakileri **YAPMA**:

- ❌ `data/bitkiler.js`'teki **diğer 13 bitkiye** (squash hariç) dokunma. Sadece `"squash"` entry'sinin **tek alanı** olan `acilma_seviye`'yi değiştir.
- ❌ Squash entry'sinin **diğer alanlarına** (maliyet, hp, hasar, hibrit, emoji, tip vb.) dokunma. Sadece `acilma_seviye` değişecek.
- ❌ Mevcut 6 fusion tarifinin **`acilma_seviye`** değerlerine dokunma (20/25/30/35/40/45 sabit kalmalı).
- ❌ `"ceviz+ceviz"` tarifinin **diğer alanlarına** (`sonuc: "squash"`) dokunma.
- ❌ `"ceviz+ceviz"` için ÇİFT kayıt yazma (simetrik tarif, tek satır yeterli — SPEC-002 kuralı geçerli).
- ❌ `js/*` altındaki **hiçbir** dosyaya dokunma. (Özellikle `js/oyun.js`'in SPEC-001 fix'i ve `js/bitki.js`'in SPEC-002 tetikleyici_ezme mantığı bozulmamalı.)
- ❌ `assets/` altına dokunma. `squash.png` zaten 128×128, downscale tekrar gerekmez.
- ❌ Yeni dosya oluşturma. Bu spec sadece **iki mevcut dosyada birer satır** değiştirir.
- ❌ SPEC-003a ve SPEC-003b'yi **aynı anda** uygulama. SPEC-003a uygulanır → Başbuğ test eder → onay verir → SPEC-003b uygulanır.
- ❌ İki dosyadaki `acilma_seviye` değerlerini **farklı** bırakma. İkisi aynı anda 1 olacak (003a) veya aynı anda 30 olacak (003b). Senkron zorunlu.

**Dokunulacak dosyalar (her iki aşama için aynı):**
1. `data/bitkiler.js` — 1 satır (`squash` entry'sinin `acilma_seviye` alanı)
2. `data/fusion_tarifleri.js` — 1 satır (`"ceviz+ceviz"` tarifinin `acilma_seviye` alanı)

**Toplam değişiklik:** 2 satır, her aşamada.

---

## 📌 Tamamlanma Kriteri

### SPEC-003a (test değeri = 1)

- [ ] `data/bitkiler.js`'te `"squash"` entry'sinin `acilma_seviye` değeri **1** oldu.
- [ ] `data/fusion_tarifleri.js`'te `"ceviz+ceviz"` tarifinin `acilma_seviye` değeri **1** oldu.
- [ ] İki dosyadaki değer **senkron** (ikisi de 1).
- [ ] Hiçbir başka alan/satır değişmedi (`git diff data/bitkiler.js data/fusion_tarifleri.js` sadece bu iki satırı göstermeli).
- [ ] `git diff js/` ÇIKTISI BOŞ (js dosyalarına dokunulmadı).
- [ ] Test 1 ve Test 2 geçti.
- [ ] Test 3 (regresyon) geçti — mevcut 6 fusion'ın seviyeleri bozulmadı.
- [ ] Başbuğ onayladı → SPEC-003b uygulamaya hazır.

### SPEC-003b (final değer = 30)

- [ ] SPEC-003a tamamlanmış ve test geçmiş olmalı.
- [ ] Başbuğ "003b uygula" talimatı verdi.
- [ ] `data/bitkiler.js`'te `"squash"` entry'sinin `acilma_seviye` değeri **30** oldu.
- [ ] `data/fusion_tarifleri.js`'te `"ceviz+ceviz"` tarifinin `acilma_seviye` değeri **30** oldu.
- [ ] İki dosyadaki değer **senkron** (ikisi de 30).
- [ ] Test 4 ve Test 5 geçti.
- [ ] Başbuğ son onay verdi → commit aşamasına geçilebilir.

---

*Bu spec test-ve-deploy ayrımı için yazıldı. Doruk önce Squash'ı her dalgada görüp test etsin, sonra "doğru zamanda devreye giren özel bir ödül" deneyimini yaşasın. SPEC-003a test güvenliği, SPEC-003b oyun tasarımı.*

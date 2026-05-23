# SPEC-001 — Kaktüs ve Fusion Menü Bug Düzeltmesi

**Yazan:** Claude Code (saha analiz)
**Tarih:** 2026-05-23
**Hedef:** Antigravity (kodcu)
**Onaylayan:** Başbuğ
**Öncelik:** 🔴 KRİTİK — Doruk'un 22 Mayıs test seansından kalan bug'lar

---

## 🎯 Amaç

Doruk'un test seansında raporladığı iki kritik bug'ı **tek satırlık bir değişiklikle** çözmek:

- **Bug #1:** Kaktüs kartı balonlu zombi level'larında menüde görünmüyor → balonlu zombilere karşı savunma yok.
- **Bug #2:** Hibrit (fusion) bitkiler normal kart menüsünde doğrudan satın alınabilir olarak çıkıyor → fusion mekaniği bozuluyor.

Analiz sonucu: **iki bug aynı kök sebepten kaynaklanıyor** — `yeniKartlariBelirle()` fonksiyonundaki rastgele kart havuzu hibrit bitkileri filtrelemiyor.

---

## 🔬 Kök Sebep Analizi

**Dosya:** `js/oyun.js`
**Fonksiyon:** `yeniKartlariBelirle()` (satır 836)

Mevcut akış:
1. Satır 838: `if (this.kilitAcikBitkiler.length >= 7) return;` → açık kart sayısı 7'ye ulaşırsa erken çıkar.
2. Satır 845-862: Öncelik mantığı (balonlu → kaktüs, hızlı → kar_bezelye, kasklı → kavun/kiraz).
3. Satır 866: **`const tumBitkiler = Object.keys(BITKILER_DATA);`** → tüm BITKILER_DATA anahtarlarını alıyor (hibritler dahil!).
4. Satır 867-869: Filtrelenmemiş havuzdan rastgele bir bitkiyi `kilitAcikBitkiler`'e ekliyor.

### Neden Bug #2 oluşuyor

`data/bitkiler.js` içinde 7 normal + 6 hibrit = 13 bitki var. Hibritler `hibrit: true` ve `acilma_seviye: 20/25/30/35/40/45` ile işaretli — yalnızca fusion ile elde edilmeli. Fakat satır 866 onları rastgele havuza koyduğu için doğrudan kart olarak açılıyor ve menüye düşüyor.

### Neden Bug #1 oluşuyor (Bug #2'nin domino etkisi)

Hibritler rastgele havuzda olduğu için:
- **(a)** Erken dalgalarda Kaktüs yerine bir hibrit (örn. `gunes_atici`, `dondurucu_mitralyoz`) seçilebiliyor → Kaktüs'ün rastgele seçilme şansı düşüyor.
- **(b)** Hibrit kart açıldıkça `kilitAcikBitkiler.length` şişiyor → satır 838'deki `>= 7` koşulu erken tetikleniyor → balonlu zombili dalgaya gelmeden fonksiyon return ediyor → Kaktüs **hiç açılmıyor**.

Sonuç: Balonlu zombi dalgalarında (ilk olarak dalga 7) öncelik 1 mantığı (`siradakiZombiler.includes("balonlu") → kaktus`) çalışsa bile, ya zaten Kaktüs şansını kaybetmiş ya da erken return yüzünden hiç çağrılmamış olur.

---

## ✂️ Değişiklik

**Dosya:** `js/oyun.js`
**Satır:** 866 (sadece bir satır)

### ESKİ HALİ

```javascript
            const tumBitkiler = Object.keys(BITKILER_DATA);
```

### YENİ HALİ

```javascript
            // BU SATIR: Sadece normal (hibrit olmayan) bitkileri rastgele havuza al.
            // Hibrit bitkiler fusion ile elde edilir, kart menüsünde görünmemeli.
            const tumBitkiler = Object.keys(BITKILER_DATA).filter(b => !BITKILER_DATA[b].hibrit);
```

> Yorum satırı zorunludur (Türkçe yorum kuralı — Doruk kodu okuyabilmeli).

---

## ✅ Test Senaryosu

Antigravity değişikliği uyguladıktan sonra, **Başbuğ** veya Doruk şu adımları manuel test edecek:

### Test 1 — Bug #2 doğrulama (Fusion menüde olmamalı)
1. Oyunu `http://127.0.0.1:8000` üzerinden aç.
2. Dalga 1'den başlayarak dalga 10'a kadar oyna.
3. **Her dalga sonunda** alt karttaki kart menüsüne bak.
4. **Beklenen:** Menüde yalnızca şu 7 bitkiden seçilenler olmalı: `aycicegi, bezelye_atici, ceviz, kar_bezelye, patlayan_kavun, patlayan_kiraz, kaktus`.
5. **Hata olursa:** Menüde `gunes_atici`, `dondurucu_mitralyoz`, `buz_kalesi`, `patlayan_hava_topu`, `buz_kavunu`, `zirhli_aycicegi` görünüyorsa düzeltme başarısız.

### Test 2 — Bug #1 doğrulama (Kaktüs balonlu dalgada gelmeli)
1. Yeni oyun başlat.
2. Balonlu zombi içeren ilk dalgaya kadar oyna (yaklaşık dalga 7 civarı — `data/seviyeler.js`'te `balonlu` ilk olarak satır 100 civarında geçiyor).
3. Balonlu zombi gelmeden ÖNCEKİ dalga bittiğinde yeni kart açılırken **Kaktüs** seçilmeli.
4. **Beklenen:** Kart menüsünde Kaktüs 🌵 görünür ve balonlu zombiler havadan gelince oyuncu Kaktüs dikebilir.
5. **Hata olursa:** Balonlu dalga başladığı halde Kaktüs menüde yoksa düzeltme yetersiz, ek analiz gerekir.

### Test 3 — Regresyon kontrolü
1. Hızlı zombi dalgasında Kar Bezelye'nin hâlâ açıldığını doğrula.
2. Kasklı zombi dalgasında Patlayan Kavun veya Patlayan Kiraz'ın hâlâ açıldığını doğrula.
3. Fusion sisteminin (2 bitkiyi birleştirme) hâlâ hibrit bitkileri açabildiğini doğrula — örn. dalga 20'de `gunes_atici` fusion ile elde edilmeli.

---

## 🚫 Anti-Pattern (Antigravity'ye Sınırlamalar)

Aşağıdakileri **YAPMA**:

- ❌ `data/bitkiler.js`'e dokunma. Hibrit bitkilerin `hibrit: true` bayrağı zaten doğru, değiştirme.
- ❌ `data/fusion_tarifleri.js`'e dokunma. Fusion mantığı bu bug'ı tetiklemiyor.
- ❌ `js/arayuz.js`'e dokunma. Kart UI mantığı doğru çalışıyor — sorun kart **seçim** mantığında.
- ❌ Satır 838'deki `>= 7` eşiğini değiştirme. O eşik doğru — bug, eşiğin hibritlerce şişirilmesinden kaynaklanıyor.
- ❌ Refactor yapma, fonksiyonu yeniden yazma, başka satırları "düzeltme". Sadece bir satır değişecek.
- ❌ ES6 `import/export` ekleme. Vanilla JS, `file://` uyumlu olmalı (CLAUDE.md İlke 3).
- ❌ Yeni dosya oluşturma.

**Tek dokunulacak yer:** `js/oyun.js` satır 866 — Türkçe yorum + filter eklenecek (yukarıdaki "Yeni Hali" bloğu).

---

## 📌 Tamamlanma Kriteri

- [ ] `js/oyun.js` satır 866'da sadece belirtilen değişiklik yapıldı.
- [ ] Türkçe yorum satırları eklendi.
- [ ] Hiçbir başka dosya değişmedi (`git diff` ile doğrula).
- [ ] Test 1, 2, 3 manuel olarak çalıştırıldı ve hepsi beklenen sonucu verdi.
- [ ] Başbuğ onayladı.

---

*Bu spec Claude Code (saha) tarafından Bug #1 ve #2'nin kod izini sürerek hazırlandı. Antigravity uygulayacak, Başbuğ onaylayacak.*

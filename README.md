# Bahçe Savaşı (v0.1)

Bu proje, Doruk ve Sarp için özel olarak hazırlanmış, "Plants vs Zombies" tarzında eğitici bir kule savunma oyunudur. Amacı, oyunu oynarken kod dünyası ile tanışmanızı sağlamaktır!

## 🚀 Oyunu Nasıl Oynarım?

Oyunu başlatmak için hiçbir programa veya sunucuya ihtiyacın yok!
Sadece klasördeki **`index.html`** dosyasına çift tıkla ve tarayıcında (Chrome, Safari, vb.) aç.
Oyun hemen başlayacaktır! Eğlence başlasın!

---

## 🛠️ Doruk'un İlk Görevleri (Oyunun Kurallarını Değiştir!)

Bu oyun tamamen **senin kontrolünde**! Oyunun zorluğunu veya bitkilerin gücünü değiştirebilirsin. Bunu yapmak için sadece bilgisayardaki değerleri değiştirmen yeterli.

**Nasıl Yapılır?**
1. Projedeki `data` klasörüne gir.
2. `bitkiler.js` dosyasını Not Defteri (Notepad) veya VS Code ile aç.
3. İçindeki sayıları değiştir, dosyayı kaydet.
4. Oyunu tarayıcıda yenile (F5'e bas) ve farkı gör!

### Görev 1: Süper Bezelye Atıcı! 🌱
Bezelye atıcısının verdiği hasarı değiştirebilir misin?
- `bitkiler.js` dosyasını aç.
- `"bezelye_atici"` altındaki `"hasar": 20` yazan yeri bul.
- O sayıyı **100** yap.
- Oyunu yenile. Artık bezelyelerin zombileri tek vuruşta indirmesi lazım!

### Görev 2: Zombiler Çok Mu Zor? 🧟
- `zombiler.js` dosyasını aç.
- Normal Zombi'nin `"hp": 100` yazan can değerini **50** yap.
- Artık çok daha çabuk ölecekler!

### Görev 3: Fakir Ayçiçeği 🌻
- `bitkiler.js` dosyasını aç.
- `"aycicegi"` altındaki `"maliyet": 50` sayısını **10** yap.
- Artık bahçeyi ayçiçeği ile çok ucuza doldurabilirsin!

---

## 📂 Dosyalar Nerede Ne İşe Yarıyor?
- `index.html`: Oyunun ana sahnesi, ekrana çizildiği yer.
- `css/style.css`: Renkler ve oyunun dış görünüşü.
- `data/*.js`: Oyundaki **hasar, can, bedel** gibi sayıları içeren ayar dosyaları. (En çok burayla oynayacaksın!)
- `js/*.js`: Oyunun motoru. Zombilerin nasıl yürüdüğünü, güneşlerin nasıl düştüğünü belirleyen **JavaScript** kodları.

**Not:** Oynarken tarayıcında **F12** tuşuna basarak "Console" (Konsol) sekmesini açmayı unutma! Oyunda olan biten her şey (kim ne kadar hasar aldı, kaç güneş üretildi) orada Türkçe olarak yazıyor. Geliştiriciler (yani senin gibi kod yazanlar) oyunlarını oradan takip eder!

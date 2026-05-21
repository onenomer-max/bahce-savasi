// js/item.js
// Bu sınıf düşen eşyaları (item) temsil eder. (Para, Kalp, Elmas, Şimşek, Ateş Topu)

class Item {
    constructor(tip, x, y) {
        this.tip = tip;
        this.x = x;
        this.y = y;
        this.baslangicY = y;
        
        const veri = ITEMLER_DATA[tip];
        this.ad = veri.ad;
        this.emoji = veri.emoji;
        this.gorselYolu = veri.görsel;
        this.etki = veri.etki;
        this.miktar = veri.miktar;
        this.sureMs = veri.süre_ms;
        
        this.olusturulmaZamani = 0;
        this.omurSuresi = 5000; // 5 saniye yaşar
        this.silinecek = false;
        
        // Animasyon için
        this.ziplamaZamani = 0;
        this.toplandi = false;
    }

    guncelle(gecenZaman) {
        if (this.toplandi) return;
        
        this.olusturulmaZamani += gecenZaman;
        if (this.olusturulmaZamani >= this.omurSuresi) {
            this.silinecek = true;
        }
        
        // Zıplama animasyonu (Math.sin ile y ekseninde salınım)
        this.ziplamaZamani += gecenZaman;
        this.y = this.baslangicY + Math.sin(this.ziplamaZamani * 0.01) * 10;
    }

    ciz(ctx) {
        if (this.toplandi || this.silinecek) return;
        
        // Yok olmaya yakın flash efekti (son 1.5 saniye kala yanıp sönme)
        if (this.omurSuresi - this.olusturulmaZamani < 1500) {
            // Her 200ms'de bir görünmez ol
            if (Math.floor(this.olusturulmaZamani / 150) % 2 === 0) {
                return; // Çizme
            }
        }
        
        const boyut = 50;
        let cizildi = false;
        
        if (this.gorselYolu && window.gorselYukleyici) {
            const gorsel = window.gorselYukleyici.getir(this.gorselYolu);
            if (gorsel) {
                ctx.drawImage(gorsel, this.x - boyut / 2, this.y - boyut / 2, boyut, boyut);
                cizildi = true;
            }
        }
        
        if (!cizildi) {
            ctx.font = "32px 'Press Start 2P', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.emoji, this.x, this.y);
        }
    }

    tiklandiMi(x, y) {
        if (this.toplandi || this.silinecek) return false;
        // Hitbox genişliği 50x50
        return Math.abs(this.x - x) < 35 && Math.abs(this.y - y) < 35;
    }

    topla(oyun) {
        if (this.toplandi) return;
        this.toplandi = true;
        this.silinecek = true;
        
        console.log(`Item toplandı: ${this.ad}`);
        
        let metin = "";
        let metinRenk = "#4CAF50"; // Yeşil
        
        switch (this.etki) {
            case "guneş_artir":
                oyun.gunesEkle(this.miktar);
                metin = `+${this.miktar} Güneş`;
                metinRenk = "#FFEB3B"; // Sarı
                break;
            case "bitki_hp_artir":
                for (let bitki of oyun.bitkiler) {
                    bitki.hasarAl(-this.miktar); // Negatif hasar = İyileştirme
                    if (bitki.hp > bitki.maxHp) bitki.hp = bitki.maxHp;
                }
                metin = `+${this.miktar} HP`;
                break;
            case "zombi_paralize":
                for (let zombi of oyun.zombiler) {
                    zombi.yavaslat(0, this.sureMs); // Hız 0 olur
                }
                metin = "ŞİMŞEK!";
                metinRenk = "#2196F3"; // Mavi
                break;
            case "satir_hasar":
                // Ateş Topu için tıklama sonrası satır seçme moduna geçilmesi lazım
                oyun.arayuz.atesTopuModu = true;
                oyun.arayuz.atesTopuHasar = this.miktar;
                metin = "Ateş Topu!";
                metinRenk = "#F44336"; // Kırmızı
                break;
            case "yetenek_aktive":
                oyun.arayuz.yetenekSecimModu = true;
                metin = "Yetenek Tozu!";
                metinRenk = "#9C27B0"; // Mor
                if (window.sesYonetici) window.sesYonetici.efektCal("toz_topla");
                break;
        }
        
        // UI Efekt ekle
        if (metin !== "") {
            oyun.efektler.push({
                x: this.x,
                y: this.y - 20, // Biraz yukarıda çıksın
                tip: "yazi",
                metin: metin,
                renk: metinRenk,
                gecenZaman: 0,
                suresi: 1000 // 1 saniye ekranda kalsın
            });
        }
    }
}

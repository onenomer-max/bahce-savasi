// js/mermi.js
// Bu sınıf bezelye atıcısından çıkan mermileri temsil eder.

class Mermi {
    constructor(x, y, bitkiVeri) {
        this.x = x;
        this.y = y;
        this.hasar = bitkiVeri.hasar || 0;
        this.hiz = bitkiVeri.mermi_hizi || 5; // Hız (Piksel / Kare)
        this.emoji = bitkiVeri.mermi_emoji || "🟢";
        this.gorselYolu = bitkiVeri.mermi_gorsel || null;
        
        // Yeni Mekanikler (Faz 3A)
        this.yavaslatmaOrani = bitkiVeri.yavaslatma_oran || null;
        this.yavaslatmaSuresi = bitkiVeri.yavaslatma_sure_ms || null;
        this.alanYaricap = bitkiVeri.alan_yaricap || 0;
        this.hedefAlabilir = bitkiVeri.hedef_alabilir || ["yer"];
        
        this.aktif = true; // Mermi hedefe çarptığında false olur
    }

    guncelle(gecenZaman) {
        if (!this.aktif) return;
        
        // Sağa doğru hareket et
        this.x += this.hiz * (gecenZaman / 16);
        
        // Ekrandan çıktıysa deaktif et
        if (this.x > 1280) {
            this.aktif = false;
        }
    }

    ciz(ctx) {
        if (!this.aktif) return;
        
        let gorselYolu = this.gorselYolu;
        if (!gorselYolu) {
            // Geriye dönük uyumluluk
            if (this.emoji === "🟢") gorselYolu = "assets/mermiler/bezelye_mermi.png";
            else if (this.emoji === "🟦" || this.emoji === "❄️" || this.emoji === "🧊") gorselYolu = "assets/mermiler/kar_bezelye_mermi.png";
        }

        let gorselCizildi = false;
        if (gorselYolu && window.gorselYukleyici) {
            const gorsel = window.gorselYukleyici.getir(gorselYolu);
            if (gorsel && gorsel.complete) {
                let boyut = 48; // Standart görünürlük
                if (gorselYolu.includes('patlayan_kavun')) {
                    boyut = 56; // Daha tehditkar
                } else if (gorselYolu.includes('kaktus_dikeni')) {
                    boyut = 40; // İnce ve hızlı
                }
                ctx.drawImage(gorsel, this.x - boyut / 2, this.y - boyut / 2, boyut, boyut);
                gorselCizildi = true;
            }
        }
        
        if (!gorselCizildi) {
            ctx.font = "24px 'Press Start 2P', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.emoji, this.x, this.y);
        }
    }
}

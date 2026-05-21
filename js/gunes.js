// js/gunes.js
// Bu sınıf oyundaki toplanabilir güneşleri temsil eder.

class Gunes {
    constructor(x, y, deger, hareketli = true) {
        this.x = x;
        this.y = y; // Düşen güneşler için başlangıç y koordinatı genellikle ekranın üstü olur
        this.hedefY = y; // Düşeceği son y koordinatı
        this.deger = deger;
        this.hareketli = hareketli;
        this.toplandi = false;
        
        // Ekranda kalma süresi (10 saniye sonra kaybolur)
        this.yasamSuresi = 10000;
        this.gecenSure = 0;
        
        // Yere düşme hızı
        this.dusmeHizi = 2; // Piksel / Kare
        
        // Düşen güneşler yukarıdan başlar
        if (this.hareketli) {
            this.y = -50;
        }
    }

    guncelle(gecenZaman) {
        if (this.toplandi) return;
        
        // Eğer hareketli ise hedefY'ye kadar düş
        if (this.hareketli && this.y < this.hedefY) {
            this.y += this.dusmeHizi * (gecenZaman / 16);
        } else {
            // Yere ulaştıysa veya zaten bitki tarafından üretildiyse ömrünü say
            this.gecenSure += gecenZaman;
            if (this.gecenSure >= this.yasamSuresi) {
                this.toplandi = true; // Süresi doldu, yok ol
            }
        }
    }

    // Tıklama ile güneş toplanırken çağrılır
    topla() {
        if (this.toplandi) return 0;
        this.toplandi = true;
        return this.deger;
    }

    // Fare kordinatlarının güneşin üzerinde olup olmadığını kontrol eder
    tiklandiMi(mouseX, mouseY) {
        // Güneşin yarıçapı yaklaşık 25 piksel
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        return (dx * dx + dy * dy) < 25 * 25;
    }

    ciz(ctx) {
        if (this.toplandi) return;
        
        // Ömrünün sonlarına doğru yanıp sönme efekti
        if (this.gecenSure > this.yasamSuresi - 2000 && Math.floor(Date.now() / 200) % 2 === 0) {
            return;
        }
        
        const gorselYolu = "assets/efektler/gunes.png";
        let gorselCizildi = false;
        
        if (window.gorselYukleyici) {
            const gorsel = window.gorselYukleyici.getir(gorselYolu);
            if (gorsel) {
                const boyut = 64; // Emojiden biraz daha büyük
                ctx.drawImage(gorsel, this.x - boyut / 2, this.y - boyut / 2, boyut, boyut);
                gorselCizildi = true;
            }
        }
        
        if (!gorselCizildi) {
            ctx.font = "36px 'Press Start 2P', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("☀️", this.x, this.y);
        }
    }
}

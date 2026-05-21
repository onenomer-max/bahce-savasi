// js/izgara.js
// Bu dosya 5 satır 9 sütunluk oyun ızgarasının (grid) çizimini ve koordinatlarını yönetir.

class Izgara {
    constructor(tuvalGenislik, tuvalYukseklik) {
        this.satirSayisi = 5;
        this.sutunSayisi = 9;
        
        // Üstte HUD olduğu için ızgarayı biraz aşağıdan başlatıyoruz
        this.ustBosluk = 90; 
        this.altMenuBosluk = 120; // Alt menünün yüksekliği
        
        // Izgara genişliği ve yüksekliği
        this.genislik = tuvalGenislik;
        this.yukseklik = tuvalYukseklik - this.ustBosluk - this.altMenuBosluk;
        
        // Her bir hücrenin boyutu
        this.hucreGenislik = this.genislik / this.sutunSayisi;
        this.hucreYukseklik = this.yukseklik / this.satirSayisi;

        console.log("Izgara render: " + this.satirSayisi + " satır, hücre yüksekliği: " + this.hucreYukseklik + "px");
    }

    // Tıklanan farenin x ve y pozisyonlarına göre hangi satır ve sütunda olduğunu bulur
    hucreBul(x, y) {
        if (y < this.ustBosluk) return null; // HUD alanına tıklandıysa
        
        const sutun = Math.floor(x / this.hucreGenislik);
        const satir = Math.floor((y - this.ustBosluk) / this.hucreYukseklik);
        
        if (satir >= 0 && satir < this.satirSayisi && sutun >= 0 && sutun < this.sutunSayisi) {
            return { satir, sutun };
        }
        return null;
    }

    // Belirli bir satır ve sütunun merkez x, y koordinatlarını döndürür
    merkezKoordinat(satir, sutun) {
        return {
            x: sutun * this.hucreGenislik + (this.hucreGenislik / 2),
            y: this.ustBosluk + satir * this.hucreYukseklik + (this.hucreYukseklik / 2)
        };
    }

    // Izgarayı tuvale (canvas) çizer
    ciz(ctx) {
        ctx.strokeStyle = "rgba(85, 139, 47, 0.5)"; // Yarı saydam koyu yeşil
        ctx.lineWidth = 2;

        // Dikey çizgileri çiz
        for (let i = 1; i < this.sutunSayisi; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.hucreGenislik, this.ustBosluk);
            ctx.lineTo(i * this.hucreGenislik, this.ustBosluk + this.yukseklik);
            ctx.stroke();
        }

        // Yatay çizgileri çiz
        for (let i = 0; i < this.satirSayisi; i++) {
            ctx.beginPath();
            ctx.moveTo(0, this.ustBosluk + i * this.hucreYukseklik);
            ctx.lineTo(this.genislik, this.ustBosluk + i * this.hucreYukseklik);
            ctx.stroke();
        }
    }
}

// js/zombi.js
// Bu sınıf düşman zombileri temsil eder.

class Zombi {
    constructor(tip, satir, x, y) {
        this.tip = tip; // "normal", "koni"
        this.satir = satir;
        
        // Ekranda çizileceği merkez koordinatlar
        this.x = x;
        this.y = y;
        
        // Veri dosyasından zombinin özelliklerini al (data/zombiler.js)
        const veri = ZOMBILER_DATA[tip];
        this.data = veri;
        this.ad = veri.ad;
        this.emoji = veri.emoji;
        this.gorselYolu = veri.görsel;
        this.hp = veri.hp;
        this.maxHp = veri.hp;
        this.hiz = veri.hiz;
        this.isirmaHasari = veri.isirma_hasar;
        this.isirmaPeriyot = veri.isirma_periyot_ms;
        this.havasal = veri.havasal || false;
        
        this.orijinalHiz = this.hiz;
        this.yavaslamaKalanSure = 0;
        
        this.sonIsirmaZamani = 0;
        this.hareketEdiyor = true;
    }

    yavaslat(oran, sureMs) {
        // Sadece daha önce yavaşlatılmamışsa hızı değiştir (birikmeyi engelle)
        if (this.yavaslamaKalanSure <= 0) {
            this.hiz = this.orijinalHiz * oran;
        }
        // Süreyi yenile (eğer zaten yavaşsa bile süre uzar)
        this.yavaslamaKalanSure = sureMs;
    }

    guncelle(gecenZaman) {
        // Yavaşlama kontrolü
        if (this.yavaslamaKalanSure > 0) {
            this.yavaslamaKalanSure -= gecenZaman;
            if (this.yavaslamaKalanSure <= 0) {
                this.hiz = this.orijinalHiz; // Hızı eski haline getir
                this.yavaslamaKalanSure = 0;
            }
        }
        
        // Gulyabani Hiddet Mekaniği
        if (this.data.ozel_mekanik === "hiddet" && this.hp < this.maxHp * 0.5 && !this.hiddetAktif) {
            this.orijinalHiz = this.data.hiz * 2;
            this.hiz = this.orijinalHiz;
            this.hiddetAktif = true;
            console.warn("👹 GULYABANI HİDDETLENDİ! Hız 2x");
        }
        
        // Nekromant Diriltme Mekaniği
        if (this.data.ozel_mekanik === "diriltme") {
            this.dirilmeZamani = (this.dirilmeZamani || 0) + gecenZaman;
            if (this.dirilmeZamani >= this.data.ozel_periyot_ms) {
                this.dirilmeZamani = 0;
                if (window.OyunYonetici) {
                    window.OyunYonetici.zombiler.push(new Zombi("normal", this.satir, this.x + 50, this.y));
                    console.warn("🧙 NEKROMANT bir zombi çağırdı!");
                }
            }
        }

        if (this.hareketEdiyor) {
            // Sola doğru hareket et
            // Hiz değeri piksel/milisaniye cinsinden
            this.x -= this.hiz * (gecenZaman / 16); // 60 FPS bazlı
        } else {
            // Isırma mantığı
            this.sonIsirmaZamani += gecenZaman;
            if (this.sonIsirmaZamani >= this.isirmaPeriyot) {
                // Önündeki bitkiye hasar ver
                // Bu kısım OyunYonetici tarafından kontrol edilecek
            }
        }
    }

    hasarAl(miktar) {
        this.hp -= miktar;
        if (this.hp <= 0) {
            console.log(`💀 ${this.ad} öldü!`);
            if (window.sesYonetici) window.sesYonetici.efektCal("zombi_olum");
            
            // Faz 4 ve Faz 5: Item / Yetenek Tozu düşürme sistemi
            if (this.data.boss) {
                // Boss'lar %80 ihtimalle yetenek tozu düşürür
                if (Math.random() < 0.80) {
                    if (window.OyunYonetici && window.OyunYonetici.itemDusur) {
                        window.OyunYonetici.itemDusur(this.x, this.y, "yetenek_tozu");
                    }
                }
            } else {
                // Normal zombiler %20 ihtimalle rastgele item düşürür
                if (Math.random() < 0.20) {
                    if (window.OyunYonetici && window.OyunYonetici.itemDusur) {
                        window.OyunYonetici.itemDusur(this.x, this.y); // Rastgele
                    }
                }
            }
        }
    }

    ciz(ctx) {
        let gorselCizildi = false;
        
        let cizimY = this.y;
        if (this.havasal) {
            cizimY -= 20; // Havadaki zombiler biraz yukarıda görünsün
        }
        
        if (this.gorselYolu && window.gorselYukleyici) {
            const gorsel = window.gorselYukleyici.getir(this.gorselYolu);
            if (gorsel) {
                const boyut = this.data.boyut || 80; // Boss boyutu veya normal boyut
                ctx.save();
                
                // Hiddetlenmiş Gulyabani veya yavaşlamış zombi için filtre
                if (this.hiddetAktif) {
                    ctx.filter = "sepia(1) hue-rotate(-50deg) saturate(3)"; // Kırmızımtırak hiddet tonu
                } else if (this.yavaslamaKalanSure > 0) {
                    ctx.filter = "sepia(1) hue-rotate(180deg) saturate(3)";
                }
                
                // Orijin noktasını zombinin merkezine taşı
                ctx.translate(this.x, cizimY);
                // Merkeze hizalayarak çiz
                ctx.drawImage(gorsel, -boyut / 2, -boyut / 2, boyut, boyut);
                ctx.restore();
                
                gorselCizildi = true;
            }
        }
        
        if (!gorselCizildi) {
            // Emojiyi çiz (FALLBACK)
            if (this.gorselYolu && window.gorselYukleyici) {
                console.warn(`⚠️ Görsel bulunamadı: ${this.gorselYolu}, emoji'ye düşülüyor`);
            }
            ctx.save();
            if (this.yavaslamaKalanSure > 0) {
                ctx.fillStyle = "#AEEEEE"; // Açık mavi metin rengi
            }
            ctx.font = "48px 'Press Start 2P', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.emoji, this.x, cizimY);
            ctx.restore();
        }
        
        // Can barını çiz (Sadece hasar aldıysa veya boss ise)
        if (this.hp < this.maxHp || this.data.boss) {
            let barGenislik = 40;
            let barYukseklik = 6;
            let barYOffset = 35;
            
            if (this.data.boss) {
                barGenislik = 100;
                barYukseklik = 12;
                barYOffset = (this.data.boyut / 2) + 15;
            }
            
            const barX = this.x - barGenislik / 2;
            const barY = this.y - barYOffset;
            
            // Arka plan (Kırmızı)
            ctx.fillStyle = "#F44336";
            ctx.fillRect(barX, barY, barGenislik, barYukseklik);
            
            // Ön plan (HP düştükçe yeşilden kırmızıya dönen renk, boss bar için)
            const canOrani = Math.max(0, this.hp / this.maxHp);
            if (this.data.boss) {
                // Yeşilden sarıya, sarıdan kırmızıya
                const r = canOrani > 0.5 ? Math.floor(255 * (1 - canOrani) * 2) : 255;
                const g = canOrani > 0.5 ? 255 : Math.floor(255 * canOrani * 2);
                ctx.fillStyle = `rgb(${r},${g},0)`;
            } else {
                ctx.fillStyle = "#4CAF50";
            }
            
            ctx.fillRect(barX, barY, barGenislik * canOrani, barYukseklik);
            
            // Boss bar için çerçeve
            if (this.data.boss) {
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.strokeRect(barX, barY, barGenislik, barYukseklik);
            }
        }
    }
}

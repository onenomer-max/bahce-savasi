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
        
        // Animasyon Ayarları
        const FRAME_SURELERI = {
            "normal": 200,
            "koni": 200,
            "hizli": 100,
            "kaskli": 220,
            "balonlu": 250,
            "gulyabani": 300,
            "nekromant": 280,
            "boss_gulyabani": 300,
            "boss_nekromant": 280,
            "mekanik_zombi": 320,
            "vampir_zombi": 290,
            "zombi_kral": 350
        };
        
        this.frameIndex = 0;
        this.frameZaman = 0;
        this.frameSuresi = FRAME_SURELERI[this.tip] || 200;
        this.animasyonFrameSayisi = 4;
        
        const prefixHaritasi = {
            "normal": "zombi_normal_walk",
            "koni": "zombi_koni_walk",
            "hizli": "zombi_hizli_walk",
            "kaskli": "zombi_kaskli_walk",
            "balonlu": "zombi_balonlu_walk",
            "gulyabani": "zombi_gulyabani_walk",
            "nekromant": "zombi_nekromant_walk",
            "boss_gulyabani": "zombi_gulyabani_walk",
            "boss_nekromant": "zombi_nekromant_walk",
            "mekanik_zombi": "zombi_mekanik_walk",
            "vampir_zombi": "zombi_vampir_walk",
            "zombi_kral": "zombi_kral_walk"
        };
        
        if (prefixHaritasi[this.tip]) {
            this.animasyonAdiPrefix = prefixHaritasi[this.tip];
            this.animasyonVar = true;
        } else {
            this.animasyonVar = false;
        }
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

                // Mekanik Zombi - Elektrik Şoku
        if (this.tip === "mekanik_zombi" && window.OyunYonetici) {
            this.sonSokZamani = (this.sonSokZamani || 0) + gecenZaman;
            if (this.sonSokZamani >= this.data.sok_periyot_ms) {
                this.sonSokZamani = 0;
                // Aynı satırda en yakın bitkiyi bul
                const hedefBitki = window.OyunYonetici.bitkiler
                    .filter(b => b.satir === this.satir && b.x < this.x)
                    .sort((a,b) => b.x - a.x)[0];
                if (hedefBitki) {
                    hedefBitki.sokAltinda = true;
                    hedefBitki.sokBitisZamani = this.data.sok_sure_ms;
                    console.warn(`⚡ Mekanik Zombi, ${hedefBitki.ad}'e şok verdi!`);
                }
            }
        }
        
        // Zombi Kral - Spawn ve İmmünite
        if (this.tip === "zombi_kral" && window.OyunYonetici) {
            this.sonSpawnZamani = (this.sonSpawnZamani || 0) + gecenZaman;
            if (this.sonSpawnZamani >= this.data.spawn_periyot_ms) {
                this.sonSpawnZamani = 0;
                window.OyunYonetici.zombiler.push(new Zombi("normal", this.satir, this.x - 50, this.y));
                console.warn("👑 Zombi Kral yeni zombi çağırdı!");
            }
            
            this.sonImmuniteDegisim = (this.sonImmuniteDegisim || 0) + gecenZaman;
            if (this.sonImmuniteDegisim >= this.data.immunite_periyot_ms) {
                this.sonImmuniteDegisim = 0;
                const tipler = ["yer", "alan", "yavaslatma", "dondurma"];
                this.immuniteTipi = tipler[Math.floor(Math.random() * tipler.length)];
                console.warn(`👑 Zombi Kral İmmünite Değiştirdi: ${this.immuniteTipi}`);
            }
        }

        if (this.hareketEdiyor) {
            // Sola doğru hareket et
            this.x -= this.hiz * (gecenZaman / 16); // 60 FPS bazlı
            
            // Animasyon güncelleme
            if (this.animasyonVar) {
                this.frameZaman += gecenZaman;
                if (this.frameZaman >= this.frameSuresi) {
                    this.frameZaman = 0;
                    this.frameIndex = (this.frameIndex + 1) % this.animasyonFrameSayisi;
                }
            }
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
        
        let gorselYolu = this.gorselYolu;
        if (this.animasyonVar) {
            const frameNo = this.frameIndex + 1; // 1-4
            gorselYolu = `assets/zombiler/animasyon/${this.animasyonAdiPrefix}_${frameNo}.png`;
        }
        
        if (gorselYolu && window.gorselYukleyici) {
            const gorsel = window.gorselYukleyici.getir(gorselYolu);
            if (gorsel && gorsel.complete) {
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

// js/bitki.js
// Bu sınıf oyundaki bitkileri (Ayçiçeği, Bezelye Atıcısı, Ceviz) temsil eder.

class Bitki {
    constructor(tip, satir, sutun, x, y) {
        this.tip = tip; // "aycicegi", "bezelye_atici", "ceviz"
        this.satir = satir;
        this.sutun = sutun;
        
        // Ekranda çizileceği merkez koordinatlar
        this.x = x;
        this.y = y;
        
        // Veri dosyasından bitkinin özelliklerini al (data/bitkiler.js)
        const veri = BITKILER_DATA[tip];
        this.ad = veri.ad;
        this.emoji = veri.emoji;
        this.gorselYolu = veri.görsel;
        this.hp = veri.hp;
        this.maxHp = veri.hp;
        this.bitkiTipi = veri.tip; // "uretici", "saldirgan", "savunma" vb (opsiyonel)
        
        // Eylem zamanlayıcıları
        this.sonEylemZamani = 0; // Tek seferlik patlamalar vs için genel
        this.atisZamanlayici = 0;
        this.uretimZamanlayici = 0;
        
        // Yetenek (Skill) Değişkenleri
        this.data = veri;
        this.tozHazir = false; // Yetenek Tozu alındı mı?
        this.yetenekAktif = false;
        this.yetenekKalanSure = 0;
        this.orijinalAtisPeriyodu = veri.atis_periyot_ms || 0;
        this.hasarsiz = false;
        
        // Atış özellikleri (Eğer atis_periyot_ms varsa)
        if (veri.atis_periyot_ms) {
            this.atisPeriyot = veri.atis_periyot_ms;
            this.hasar = veri.hasar;
        }
        
        // Üretim özellikleri (Eğer gunes_uretir özel yeteneği varsa)
        if (veri.ozel_yetenek === "gunes_uretir" || veri.tip === "uretici") {
            this.uretimPeriyot = veri.gunes_periyot_ms || veri.uretim_periyot_ms;
            this.uretimMiktari = veri.uretim_miktari || 25; // Default 25
        }
        
        // Tek seferlik patlama özellikleri
        if (veri.tip === "tek_seferlik_patlama" || veri.patlayici) {
            this.patlamaGecikmesi = veri.patlama_gecikme_ms || 1500;
        }
    }

    // Her karede çağrılır. Bitkinin saldırı veya üretim yapıp yapmayacağını kontrol eder.
    // Her karede çağrılır. Bitkinin saldırı veya üretim yapıp yapmayacağını kontrol eder.
    guncelle(gecenZaman) {
        if (this.sokAltinda) {
            this.sokBitisZamani -= gecenZaman;
            if (this.sokBitisZamani <= 0) {
                this.sokAltinda = false;
            } else {
                return; // Şok altındayken hiçbir şey yapma
            }
        }
        
        this.sonEylemZamani += gecenZaman;
        if (this.atisPeriyot) this.atisZamanlayici += gecenZaman;
        if (this.uretimPeriyot) this.uretimZamanlayici += gecenZaman;
        
        // Yetenek etki süresi kontrolü (Aktif yetenekler için)
        if (this.yetenekAktif && this.yetenekKalanSure > 0) {
            this.yetenekKalanSure -= gecenZaman;
            if (this.yetenekKalanSure <= 0) {
                this.yetenekAktif = false;
                this.yetenekKalanSure = 0;
                
                // Etkileri geri al
                if (this.data.yetenek && this.data.yetenek.etki === "hizli_atis") {
                    this.atisPeriyot = this.orijinalAtisPeriyodu;
                } else if (this.data.yetenek && this.data.yetenek.etki === "sertlesme") {
                    this.hasarsiz = false;
                }
            }
        }
        
        // Üretim mantığı
        if (this.uretimPeriyot && this.uretimZamanlayici >= this.uretimPeriyot) {
            // Eğer saldırı altında değilse veya vurulurken de üretebiliyorsa
            if (!this.saldiriAltinda || this.data.vurulurken_uretir) {
                this.gunesUret();
            }
            this.uretimZamanlayici = 0;
        }
        
        // Atış mantığı
        if (this.atisPeriyot && this.atisZamanlayici >= this.atisPeriyot) {
            this.atesEt();
            this.atisZamanlayici = 0;
        }
        
        // Tek seferlik patlama mantığı
        if (this.patlamaGecikmesi) {
            if (this.sonEylemZamani >= this.patlamaGecikmesi) {
                // Patla
                if (window.OyunYonetici && this.hp > 0) {
                    window.OyunYonetici.alanHasariVer(this.satir, this.sutun, this.data.alan_yaricap || this.data.patlama_alani || 1, this.data.patlama_hasar || this.data.hasar || 200, true);
                }
                this.hp = 0; // Kendini yok et
            }
        }
    }

    // Ayçiçeği için güneş üretme fonksiyonu
    gunesUret() {
        console.log(`${this.emoji} ${this.ad} güneş üretti! (+${this.uretimMiktari} güneş)`);
        // Güneş oluşturma mantığı oyun.js'den çağrılacak
        if (window.OyunYonetici) {
            window.OyunYonetici.gunesOlustur(this.x, this.y, this.uretimMiktari, false);
        }
    }

    // Bezelye atıcısı için ateş etme fonksiyonu
    atesEt() {
        // İleride aynı satırda zombi varsa mermi oluşturulacak
        if (window.OyunYonetici) {
            // Sadece satırda zombi varsa ateş etme kontrolü OyunYonetici'ye eklenecek
            window.OyunYonetici.mermiOlustur(this);
        }
    }

    // Zombi ısırdığında çağrılır
    hasarAl(miktar) {
        if (this.hasarsiz) return;
        this.hp -= miktar;
        if (this.hp <= 0) {
            console.log(`💀 ${this.ad} yok edildi!`);
            if (window.sesYonetici) window.sesYonetici.efektCal("bitki_yenildi");
        }
    }

    // Ekrana bitkiyi ve can barını çizer
    ciz(ctx) {
        // 1. ÖNCE: Görsel yüklü mü kontrol et
        let gorselCizildi = false;
        
        let cizimX = this.x;
        // Patlayan kiraz titreme animasyonu (son 500ms)
        if (this.patlamaGecikmesi && (this.patlamaGecikmesi - this.sonEylemZamani) < 500) {
            cizimX += (Math.random() * 4) - 2; // ±2px titreme
        }
        
        if (this.gorselYolu && window.gorselYukleyici) {
            const gorsel = window.gorselYukleyici.getir(this.gorselYolu);
            if (gorsel) {
                // 2. PNG çiz (Hücreye sığması için 80x80 boyutunda merkeze)
                const boyut = 80;
                ctx.drawImage(gorsel, cizimX - boyut / 2, this.y - boyut / 2, boyut, boyut);
                gorselCizildi = true;
            }
        }
        
        if (!gorselCizildi) {
            // 3. FALLBACK: Emoji çiz (eski mantık)
            if (this.gorselYolu && window.gorselYukleyici) {
                console.warn(`⚠️ Görsel bulunamadı: ${this.gorselYolu}, emoji'ye düşülüyor`);
            }
            ctx.save();
            if (this.hasarsiz) {
                ctx.fillStyle = "#B0BEC5"; // Taş rengi
            }
            ctx.font = "48px 'Press Start 2P', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.emoji, cizimX, this.y);
            ctx.restore();
        }
        
        // Yetenek Tozu alındıysa etrafında altın parıltı (Halo efekti) çiz
        if (this.tozHazir) {
            ctx.save();
            // Nefes alan bir halo efekti
            const zamanBuyumesi = Math.sin(Date.now() / 200) * 5;
            ctx.shadowColor = "#FFD700";
            ctx.shadowBlur = 15 + Math.abs(zamanBuyumesi);
            ctx.strokeStyle = "#FFD700";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cizimX, this.y, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Seçim modunda tüm yetenekli bitkileri hafifçe vurgula
        if (window.OyunYonetici && window.OyunYonetici.arayuz.yetenekSecimModu && this.data.yetenek && !this.tozHazir) {
            ctx.save();
            ctx.shadowColor = "#FFFFFF";
            ctx.shadowBlur = 10;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cizimX, this.y, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Can barını çiz (Eğer hasar almışsa göster)
        if (this.sokAltinda) {
            ctx.save();
            ctx.fillStyle = "rgba(0, 255, 255, 0.4)";
            ctx.fillRect(cizimX - 40, this.y - 40, 80, 80);
            ctx.font = "20px sans-serif";
            ctx.fillStyle = "#FFF";
            ctx.fillText("⚡", cizimX, this.y - 20);
            ctx.restore();
        }
        
        if (this.hp < this.maxHp) {
            const barGenislik = 40;
            const barYukseklik = 6;
            const barX = cizimX - barGenislik / 2;
            const barY = this.y - 30;
            
            // Arka plan (kırmızı)
            ctx.fillStyle = "#F44336";
            ctx.fillRect(barX, barY, barGenislik, barYukseklik);
            
            // Ön plan (yeşil)
            const canOrani = Math.max(0, this.hp / this.maxHp);
            ctx.fillStyle = "#4CAF50";
            ctx.fillRect(barX, barY, barGenislik * canOrani, barYukseklik);
        }
    }

    yetenekHazir() {
        return this.data.yetenek && this.tozHazir;
    }

    yetenekAktiveEt(oyunYonetici) {
        this.tozHazir = true;
        console.log(`✨ ${this.ad} için yetenek tozu eklendi!`);
    }

    yetenekKullan(oyunYonetici) {
        if (!this.data.yetenek) return;
        
        if (!this.yetenekHazir()) {
            // Toz yok uyarısı ver
            oyunYonetici.efektler.push({
                x: this.x,
                y: this.y - 50,
                tip: "yazi",
                metin: "Yetenek Tozu topla!",
                renk: "#E91E63", // Pembe/Kırmızı uyarı
                gecenZaman: 0,
                suresi: 1000
            });
            return;
        }
        
        // Yeteneği kullan ve tozu tüket
        this.tozHazir = false;
        const yet = this.data.yetenek;
        console.log(`✨ ${this.ad} YETENEK KULLANDI: ${yet.ad}`);
        
        // Ekranda yetenek ismini görsel olarak uçur (Floating Text)
        oyunYonetici.efektler.push({
            x: this.x,
            y: this.y - 50,
            tip: "yazi",
            metin: yet.ad.toUpperCase(),
            renk: "#00E5FF", // Neon Turkuaz
            gecenZaman: 0,
            suresi: 2000
        });

        if (window.sesYonetici) window.sesYonetici.efektCal("yetenek_aktif");

        // Etkiyi uygula
        switch(yet.etki) {
            case "anlik_gunes":
                oyunYonetici.gunesEkle(yet.miktar);
                break;
            case "hizli_atis":
                this.yetenekAktif = true;
                this.yetenekKalanSure = yet.sure_ms;
                this.atisPeriyot = this.orijinalAtisPeriyodu / yet.carpan;
                break;
            case "sertlesme":
                this.yetenekAktif = true;
                this.yetenekKalanSure = yet.sure_ms;
                this.hasarsiz = true; // hasarAl() içerisinde bunu kontrol ediyoruz
                break;
            case "buz_patlamasi":
                // Kendi satırındaki tüm zombileri dondur
                for (let z of oyunYonetici.zombiler) {
                    if (z.satir === this.satir) {
                        z.yavaslat(0, yet.sure_ms); // Hız 0 = tamamen durur (Dondurma)
                    }
                }
                break;
            case "kavun_yagmuru":
                // Art arda 3 mermi fırlat
                for(let i = 0; i < yet.atis_sayisi; i++) {
                    setTimeout(() => {
                        if(this.hp > 0 && oyunYonetici) oyunYonetici.mermiOlustur(this);
                    }, i * 300);
                }
                break;
            case "sivri_yagmuru":
                // Tüm satırlarda ateş ediyormuş gibi sahte bitkiler üzerinden mermi fırlat
                for(let s = 0; s < oyunYonetici.izgara.satirSayisi; s++) {
                    const sahteBitki = { 
                        x: this.x, 
                        y: oyunYonetici.izgara.merkezKoordinat(s, 0).y, 
                        satir: s, 
                        tip: "kaktus" 
                    };
                    oyunYonetici.mermiOlustur(sahteBitki);
                }
                break;
        }
    }
}

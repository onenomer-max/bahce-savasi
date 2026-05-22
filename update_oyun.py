import os

path = 'c:/Antigravity_Projects/bahce_savasi/js/oyun.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update olaylariDinle
olaylari_dinle_old = """    // Fare ve dokunma olaylarını yönet
    olaylariDinle() {"""

olaylari_dinle_new = """    // Fare ve dokunma olaylarını yönet
    olaylariDinle() {
        const _koordinatHesapla = (e) => {
            let clientX = e.clientX;
            let clientY = e.clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else if (e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
            
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;
            return { x, y };
        };

        const mouseDown = (e) => {
            if (this.durum === "bitti") return;
            
            const { x, y } = _koordinatHesapla(e);
            
            if (this.arayuz.yetenekSecimModu) {
                let hucre = this.izgara.hucreBul(x, y);
                if (hucre) {
                    let bitki = this.bitkiler.find(b => b.satir === hucre.satir && b.sutun === hucre.sutun);
                    if (bitki && bitki.data.yetenek) {
                        bitki.yetenekAktiveEt(this);
                        this.arayuz.yetenekSecimModu = false;
                    } else {
                        this.arayuz.yetenekSecimModu = false;
                    }
                } else {
                    this.arayuz.yetenekSecimModu = false;
                }
                return;
            }
            
            if (e.button === 2) {
                if (this.arayuz.seciliBitkiTipi) {
                    this.arayuz.seciliBitkiTipi = null;
                    this.arayuz.kartlariGuncelle();
                } else {
                    let hucre = this.izgara.hucreBul(x, y);
                    if (hucre) {
                        let bitki = this.bitkiler.find(b => b.satir === hucre.satir && b.sutun === hucre.sutun);
                        if (bitki) bitki.yetenekKullan(this);
                    }
                }
                return;
            }
            
            for (let i = this.itemler.length - 1; i >= 0; i--) {
                let item = this.itemler[i];
                if (!item.toplandi && item.tiklandiMi(x, y)) {
                    item.topla(this);
                    return;
                }
            }
            
            for (let i = this.gunesler.length - 1; i >= 0; i--) {
                let gunes = this.gunesler[i];
                if (!gunes.toplandi && gunes.tiklandiMi(x, y)) {
                    let toplananMiktar = gunes.topla();
                    this.gunesEkle(toplananMiktar);
                    if (window.sesYonetici) window.sesYonetici.efektCal("gunes_topla");
                    return;
                }
            }
            
            if (this.arayuz.atesTopuModu) {
                let hucre = this.izgara.hucreBul(x, y);
                if (hucre) {
                    const hedefSatir = hucre.satir;
                    for (let zombi of this.zombiler) {
                        if (zombi.satir === hedefSatir) zombi.hasarAl(this.arayuz.atesTopuHasar);
                    }
                    const yKoor = this.izgara.merkezKoordinat(hedefSatir, 0).y;
                    this.efektler.push({ x: 300, y: yKoor, gecenZaman: 0, suresi: 600, gorselYolu: "assets/efektler/patlama.png" });
                    this.efektler.push({ x: 600, y: yKoor, gecenZaman: 0, suresi: 600, gorselYolu: "assets/efektler/patlama.png" });
                    this.efektler.push({ x: 900, y: yKoor, gecenZaman: 0, suresi: 600, gorselYolu: "assets/efektler/patlama.png" });
                    if (window.sesYonetici) window.sesYonetici.efektCal("patlama");
                    this.arayuz.atesTopuModu = false;
                }
                return;
            }
            
            let hucre = this.izgara.hucreBul(x, y);
            if (hucre) {
                let bitki = this.bitkiler.find(b => b.satir === hucre.satir && b.sutun === hucre.sutun);
                
                // Mod 2: Sürükle Bırak (Seçili kart yokken var olan bitkiyi sürükle)
                if (bitki && !this.arayuz.seciliBitkiTipi) {
                    this.surukleAktif = true;
                    this.suruklenenBitki = { bitki, kaynak: { satir: hucre.satir, sutun: hucre.sutun } };
                    this.surukleKonum = { x, y };
                    return;
                }
                
                // Mod 1: Kart seçiliyken hücreye tıkla
                if (this.arayuz.seciliBitkiTipi) {
                    this.bitkiYerlestir(this.arayuz.seciliBitkiTipi, hucre.satir, hucre.sutun);
                }
            }
        };
        
        const mouseMove = (e) => {
            if (this.surukleAktif) {
                const { x, y } = _koordinatHesapla(e);
                this.surukleKonum = { x, y };
            }
        };
        
        const mouseUp = (e) => {
            if (!this.surukleAktif) return;
            
            const { x, y } = _koordinatHesapla(e);
            let hucre = this.izgara.hucreBul(x, y);
            
            if (!hucre) {
                this.surukleAktif = false;
                this.suruklenenBitki = null;
                return;
            }
            
            const satir = hucre.satir;
            const sutun = hucre.sutun;
            const hedefBitki = this.bitkiler.find(b => b.satir === satir && b.sutun === sutun);
            const kaynak = this.suruklenenBitki.kaynak;
            
            if (satir === kaynak.satir && sutun === kaynak.sutun) {
                this.surukleAktif = false;
                this.suruklenenBitki = null;
                return;
            }
            
            if (hedefBitki) {
                const tarifAdi = `${this.suruklenenBitki.bitki.tip}+${hedefBitki.tip}`;
                const tarif = typeof FUSION_TARIFLERI !== "undefined" ? FUSION_TARIFLERI[tarifAdi] : null;
                
                if (tarif && typeof fusionAcikMi !== "undefined" && fusionAcikMi(tarif)) {
                    const yeniBitkiData = BITKILER_DATA[tarif.sonuc];
                    const ekMaliyet = Math.max(0, yeniBitkiData.maliyet - (this.suruklenenBitki.bitki.maliyet + hedefBitki.maliyet)) || 0; // İstenen kural: Sürükle bırakta fark alınabilir veya ücretsiz olabilir. Oyuncu sürükle-bırakta fusion yaparsa ekstra bedel yok, ama maliyeti zaten bitkiler karşılamış oluyor. FUSION_TARIFLERI içinde ek_maliyet varsa onu al, yoksa sıfır.
                    const ekOzelMaliyet = tarif.ek_maliyet || 0;
                    
                    if (this.gunesSayisi >= ekOzelMaliyet) {
                        this.gunesEkle(-ekOzelMaliyet);
                        
                        this.bitkiSil(kaynak.satir, kaynak.sutun);
                        this.bitkiSil(satir, sutun);
                        
                        const merkez = this.izgara.merkezKoordinat(satir, sutun);
                        const yeniBitki = new Bitki(tarif.sonuc, satir, sutun, merkez.x, merkez.y);
                        this.bitkiler.push(yeniBitki);
                        
                        this.fusionEfektiOlustur(satir, sutun, yeniBitkiData.ad);
                        if (window.sesYonetici) window.sesYonetici.efektCal("yetenek_aktif");
                        console.log(`🧬 FUSION: ${yeniBitkiData.ad} oluşturuldu!`);
                    } else {
                        if (window.arayuz) window.arayuz.mesajGoster("Yeterli güneş yok!");
                    }
                } else if (tarif && typeof fusionAcikMi !== "undefined" && !fusionAcikMi(tarif)) {
                    if (window.arayuz) window.arayuz.mesajGoster(`🔒 Level ${tarif.acilma_seviye}'de açılır!`);
                } else {
                    if (window.arayuz) window.arayuz.mesajGoster("Bu ikisi birleşemez!");
                }
            }
            
            this.surukleAktif = false;
            this.suruklenenBitki = null;
        };

        this.canvas.addEventListener("mousedown", mouseDown);
        this.canvas.addEventListener("mousemove", mouseMove);
        this.canvas.addEventListener("mouseup", mouseUp);
        
        this.canvas.addEventListener("touchstart", (e) => { if(e.cancelable) e.preventDefault(); mouseDown(e); }, { passive: false });
        this.canvas.addEventListener("touchmove", (e) => { if(e.cancelable) e.preventDefault(); mouseMove(e); }, { passive: false });
        this.canvas.addEventListener("touchend", (e) => { if(e.cancelable) e.preventDefault(); mouseUp(e); }, { passive: false });
        
        this.canvas.addEventListener("dblclick", (e) => {
            if (this.durum === "bitti") return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            let hucre = this.izgara.hucreBul(x, y);
            if (hucre) {
                let bitki = this.bitkiler.find(b => b.satir === hucre.satir && b.sutun === hucre.sutun);
                if (bitki) bitki.yetenekKullan(this);
            }
        });

        this.canvas.addEventListener("contextmenu", e => e.preventDefault());
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.arayuz.yetenekSecimModu) {
                this.arayuz.yetenekSecimModu = false;
            }
        });
    }

    // Yeni bitki yerleştirme ve Mod 1 Fusion
    bitkiSil(satir, sutun) {
        this.bitkiler = this.bitkiler.filter(b => !(b.satir === satir && b.sutun === sutun));
    }
    
    fusionEfektiOlustur(satir, sutun, isim) {
        const merkez = this.izgara.merkezKoordinat(satir, sutun);
        this.efektler.push({
            x: merkez.x, y: merkez.y, gecenZaman: 0, suresi: 1500, tur: 'fusion', metin: `✨ ${isim}! ✨`
        });
    }

    fusionAcildiBildir(bitkiAd, seviye) {
        this.efektler.push({
            x: this.canvas.width / 2, y: this.canvas.height / 2, gecenZaman: 0, suresi: 3000, tur: 'fusion_acildi', metin: `🎉 YENİ FUSION AÇILDI: ${bitkiAd}! 🎉`
        });
    }

    bitkiYerlestir(bitkiTipi, satir, sutun) {
        const mevcutBitki = this.bitkiler.find(b => b.satir === satir && b.sutun === sutun);
        
        if (mevcutBitki) {
            const tarifAdi = `${mevcutBitki.tip}+${bitkiTipi}`;
            const tarif = typeof FUSION_TARIFLERI !== "undefined" ? FUSION_TARIFLERI[tarifAdi] : null;
            
            if (tarif && typeof fusionAcikMi !== "undefined" && fusionAcikMi(tarif)) {
                const yeniBitkiData = BITKILER_DATA[tarif.sonuc];
                const ekMaliyet = Math.max(0, yeniBitkiData.maliyet - mevcutBitki.maliyet); // Maliyet farkı tahsil edilir
                
                if (this.gunesSayisi >= ekMaliyet) {
                    this.gunesEkle(-ekMaliyet);
                    this.bitkiSil(satir, sutun);
                    const merkez = this.izgara.merkezKoordinat(satir, sutun);
                    const yeniBitki = new Bitki(tarif.sonuc, satir, sutun, merkez.x, merkez.y);
                    this.bitkiler.push(yeniBitki);
                    this.fusionEfektiOlustur(satir, sutun, yeniBitkiData.ad);
                    if (window.sesYonetici) window.sesYonetici.efektCal("yetenek_aktif");
                    
                    // Mod 1'de arayüzden seçimi temizle
                    if (this.arayuz) {
                        this.arayuz.seciliBitkiTipi = null;
                        this.arayuz.kartlariGuncelle();
                    }
                } else {
                    if (window.arayuz) window.arayuz.mesajGoster("Yeterli güneş yok!");
                }
            } else if (tarif && typeof fusionAcikMi !== "undefined" && !fusionAcikMi(tarif)) {
                if (window.arayuz) window.arayuz.mesajGoster(`🔒 Level ${tarif.acilma_seviye}'de açılır!`);
            } else {
                if (window.arayuz) window.arayuz.mesajGoster("Bu ikisi birleşemez!");
            }
            return;
        }

        const bitkiVeri = BITKILER_DATA[bitkiTipi];
        if (this.gunesSayisi >= bitkiVeri.maliyet) {
            this.gunesEkle(-bitkiVeri.maliyet);
            const merkez = this.izgara.merkezKoordinat(satir, sutun);
            const yeniBitki = new Bitki(bitkiTipi, satir, sutun, merkez.x, merkez.y);
            this.bitkiler.push(yeniBitki);
            if (window.sesYonetici) window.sesYonetici.efektCal("click");
            if (this.arayuz) {
                this.arayuz.seciliBitkiTipi = null;
                this.arayuz.kartlariGuncelle();
            }
        } else {
            if (window.arayuz) window.arayuz.mesajGoster("Yeterli güneş yok!");
        }
    }
"""

# Replace all of olaylariDinle block and the original bitkiYerlestir logic
start_idx = content.find('    // Fare ve dokunma olaylarını yönet')
end_idx = content.find('    // Dalga (Wave) sistemini güncelle', start_idx)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + olaylari_dinle_new + "\n" + content[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

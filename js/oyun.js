// js/oyun.js
// Bu dosya genel oyun durumunu, sahneyi, çizimleri ve çarpışmaları yönetir.

class Oyun {
    constructor() {
        this.canvas = document.getElementById("oyun-sahnesi");
        this.ctx = this.canvas.getContext("2d");
        
        // Izgarayı oluştur
        this.izgara = new Izgara(this.canvas.width, this.canvas.height);
        
        // Oyun elemanları listeleri
        this.bitkiler = [];
        this.zombiler = [];
        this.mermiler = [];
        this.gunesler = [];
        this.itemler = []; // Faz 4: Düşen eşyalar
        this.efektler = []; // Patlama gibi geçici görsel efektler için
        
        // Fusion Sürükle-Bırak State
        this.surukleAktif = false;
        this.suruklenenBitki = null;
        this.surukleKonum = { x: 0, y: 0 };
        
        // Seviye verisini al
        this.seviye = SEVIYELER_DATA["seviye_1"];
        
        // Oyun durumu
        this.kilitAcikBitkiler = ["aycicegi", "bezelye_atici", "ceviz"]; // Faz 3B: Başlangıçta 3 kart
        
        this.gunesSayisi = this.seviye.baslangic_gunes;
        this.durum = "hazirlik"; // "hazirlik", "oynaniyor", "bitti"
        this.guncelDalgaIndex = 0;
        this.dalgaZamanlayici = 0;
        this.bekleyenZombiler = []; // Sıradaki dalga için bekleyen zombiler
        this.goktenGunesZamanlayici = 0; // Gökten düşen rastgele güneşler için
        
        // Arayüz yöneticisini oluştur
        this.arayuz = new Arayuz(this);
        this.arayuz.gunesGuncelle(this.gunesSayisi);
        
        // Arka plan çizimini cachelemek için
        this.arkaplanCache = null;
        
        // Fare olaylarını dinle
        this.olaylariDinle();
    }

    baslat() {
        console.log("🌻 Bahçe Savaşı - Oyun Yöneticisi Başladı.");
    }

    // Başla butonuna basılınca ilk dalga başlar
    dalgaBaslat() {
        if (this.guncelDalgaIndex >= this.seviye.dalgalar.length) return;
        
        this.durum = "oynaniyor";
        const dalga = this.seviye.dalgalar[this.guncelDalgaIndex];
        
        // Zombileri bekleme listesine al (gecikme sürelerine göre sıralı kopyala)
        this.bekleyenZombiler = dalga.zombiler.map(z => ({ ...z }));
        this.dalgaZamanlayici = 0;
        
        this.arayuz.dalgaGuncelle(`Dalga ${dalga.no}`);
        console.log(`🧟 Dalga ${dalga.no} Başlıyor!`);
        
        // Dinamik Müzik Geçişi
        if (window.sesYonetici) {
            const dalgaNo = dalga.no;
            if (dalgaNo === 10) {
                window.sesYonetici.muzikCal("muzik2_gulyabani");
            } else if (dalgaNo === 11) {
                window.sesYonetici.muzikCal("muzik3_yogunlasma");
            } else if (dalgaNo === 20) {
                window.sesYonetici.muzikCal("muzik4_nekromant");
            } else if (dalgaNo === 1) {
                window.sesYonetici.muzikCal("muzik1_bahce");
            }
        }
    }

    // Fare ve dokunma olaylarını yönet
    olaylariDinle() {
        const handleInput = (e) => {
            if (this.durum === "bitti") return;
            
            // Dokunma (Touch) veya Fare (Mouse) koordinatlarını al
            let clientX = e.clientX;
            let clientY = e.clientY;
            
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            
            const rect = this.canvas.getBoundingClientRect();
            // Gerçek tuval boyutuna göre koordinatları düzelt
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;
            
            if (this.arayuz.yetenekSecimModu) {
                // Seçim modunda bitkiye tıklama
                let hucre = this.izgara.hucreBul(x, y);
                if (hucre) {
                    let bitki = this.bitkiler.find(b => b.satir === hucre.satir && b.sutun === hucre.sutun);
                    if (bitki && bitki.data.yetenek) {
                        bitki.yetenekAktiveEt(this); // Toz verildi
                        this.arayuz.yetenekSecimModu = false;
                    } else {
                        // Tıklanan yerde bitki yoksa veya yeteneksiz bir bitkiyse iptal et
                        this.arayuz.yetenekSecimModu = false;
                    }
                } else {
                    this.arayuz.yetenekSecimModu = false;
                }
                return;
            }
            
            // Sağ tık: Seçimi iptal et VEYA seçili değilse yetenek kullan
            if (e.button === 2) {
                if (this.arayuz.seciliBitkiTipi) {
                    this.arayuz.seciliBitkiTipi = null;
                    this.arayuz.kartlariGuncelle();
                } else {
                    // Seçili bitki yoksa, o hücredeki bitkinin yeteneğini kullan
                    let hucre = this.izgara.hucreBul(x, y);
                    if (hucre) {
                        let bitki = this.bitkiler.find(b => b.satir === hucre.satir && b.sutun === hucre.sutun);
                        if (bitki) bitki.yetenekKullan(this);
                    }
                }
                return;
            }
            
            // 1. Önce güneş ve item toplama kontrolü yap
            
            // Item toplama (Güneşten daha öncelikli olsun)
            for (let i = this.itemler.length - 1; i >= 0; i--) {
                let item = this.itemler[i];
                if (!item.toplandi && item.tiklandiMi(x, y)) {
                    item.topla(this); // 'this' Oyun örneğidir
                    return;
                }
            }
            
            for (let i = this.gunesler.length - 1; i >= 0; i--) {
                let gunes = this.gunesler[i];
                if (!gunes.toplandi && gunes.tiklandiMi(x, y)) {
                    let toplananMiktar = gunes.topla();
                    this.gunesEkle(toplananMiktar);
                    if (window.sesYonetici) window.sesYonetici.efektCal("gunes_topla");
                    return; // Güneş tıklandıysa başka bir şey yapma
                }
            }
            
            // Ateş Topu Modu kontrolü (Satıra tıklandığında)
            if (this.arayuz.atesTopuModu) {
                let hucre = this.izgara.hucreBul(x, y);
                if (hucre) {
                    const hedefSatir = hucre.satir;
                    console.log(`🔥 ATEŞ TOPU ${hedefSatir}. SATIRA ATILDI!`);
                    
                    // O satırdaki tüm zombilere hasar ver
                    for (let zombi of this.zombiler) {
                        if (zombi.satir === hedefSatir) {
                            zombi.hasarAl(this.arayuz.atesTopuHasar);
                        }
                    }
                    
                    // Görsel efekt (Satırın başında ortasında sonunda patlama)
                    const yKoor = this.izgara.merkezKoordinat(hedefSatir, 0).y;
                    this.efektler.push({ x: 300, y: yKoor, gecenZaman: 0, suresi: 600, gorselYolu: "assets/efektler/patlama.png" });
                    this.efektler.push({ x: 600, y: yKoor, gecenZaman: 0, suresi: 600, gorselYolu: "assets/efektler/patlama.png" });
                    this.efektler.push({ x: 900, y: yKoor, gecenZaman: 0, suresi: 600, gorselYolu: "assets/efektler/patlama.png" });
                    
                    if (window.sesYonetici) window.sesYonetici.efektCal("patlama");
                    
                    this.arayuz.atesTopuModu = false;
                }
                return;
            }
            
            // 2. Eğer bir bitki seçiliyse ızgaraya yerleştir
            if (this.arayuz.seciliBitkiTipi) {
                let hucre = this.izgara.hucreBul(x, y);
                if (hucre) {
                    this.bitkiYerlestir(this.arayuz.seciliBitkiTipi, hucre.satir, hucre.sutun);
                }
            } else {
                // MOD 2: Sürükle bırak için bitkiyi tut
                let hucre = this.izgara.hucreBul(x, y);
                if (hucre) {
                    let bitki = this.bitkiler.find(b => b.satir === hucre.satir && b.sutun === hucre.sutun);
                    if (bitki) {
                        this.surukleAktif = true;
                        this.suruklenenBitki = { bitki: bitki, kaynak: { satir: hucre.satir, sutun: hucre.sutun } };
                        this.surukleKonum = { x: x, y: y };
                    }
                }
            }
        };

        const handleMove = (e) => {
            if (!this.surukleAktif) return;
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            let clientY = e.clientY || (e.touches && e.touches[0].clientY);
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.surukleKonum = {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        };

        const handleUp = (e) => {
            if (!this.surukleAktif) return;
            
            let clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
            let clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;
            
            let hucre = this.izgara.hucreBul(x, y);
            if (hucre && this.suruklenenBitki) {
                const satir = hucre.satir;
                const sutun = hucre.sutun;
                const hedefBitki = this.bitkiler.find(b => b.satir === satir && b.sutun === sutun);
                const kaynak = this.suruklenenBitki.kaynak;
                
                if (satir !== kaynak.satir || sutun !== kaynak.sutun) {
                    if (hedefBitki) {
                        const tarifAdi = `${this.suruklenenBitki.bitki.tip}+${hedefBitki.tip}`;
                        const tarif = typeof FUSION_TARIFLERI !== "undefined" ? FUSION_TARIFLERI[tarifAdi] : null;
                        
                        if (tarif) {
                            if (typeof fusionAcikMi !== "undefined" && fusionAcikMi(tarif)) {
                                this.fusionGerceklestir(satir, sutun, hedefBitki, this.suruklenenBitki.bitki.tip, tarif);
                                this.bitkiSil(kaynak.satir, kaynak.sutun);
                            } else {
                                if (window.arayuz) window.arayuz.mesajGoster(`🔒 Level ${tarif.acilma_seviye}'de açılır!`);
                            }
                        } else {
                            if (window.arayuz) window.arayuz.mesajGoster("Bu ikisi birleşemez!");
                        }
                    }
                }
            }
            
            this.surukleAktif = false;
            this.suruklenenBitki = null;
        };

        this.canvas.addEventListener("mousedown", handleInput);
        this.canvas.addEventListener("mousemove", handleMove);
        this.canvas.addEventListener("mouseup", handleUp);
        
        this.canvas.addEventListener("touchstart", (e) => {
            if (e.cancelable) e.preventDefault();
            handleInput(e);
        }, { passive: false });
        this.canvas.addEventListener("touchmove", (e) => {
            if (e.cancelable) e.preventDefault();
            handleMove(e);
        }, { passive: false });
        this.canvas.addEventListener("touchend", (e) => {
            if (e.cancelable) e.preventDefault();
            handleUp(e);
        }, { passive: false });
        
        // Çift tıklama olayı (Özel Yetenek Tetikleme)
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

        // Sağ tık menüsünü engelle
        this.canvas.addEventListener("contextmenu", e => e.preventDefault());
        
        // ESC Tuşu (Yetenek Seçim Modundan Çıkış)
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.arayuz.yetenekSecimModu) {
                this.arayuz.yetenekSecimModu = false;
            }
        });
    }

    // Yeni bitki yerleştirme ve Mod 1 Fusion
    bitkiYerlestir(bitkiTipi, satir, sutun) {
        // Bu hücrede zaten bitki var mı?
        const mevcutBitki = this.bitkiler.find(b => b.satir === satir && b.sutun === sutun);
        
        // FUSION KONTROL ÖNCELİKLİ
        if (mevcutBitki && typeof FUSION_TARIFLERI !== 'undefined') {
            const tarifAdi = `${mevcutBitki.tip}+${bitkiTipi}`;
            const tarif = FUSION_TARIFLERI[tarifAdi];
            
            if (tarif) {
                if (typeof fusionAcikMi !== "undefined" && fusionAcikMi(tarif)) {
                    this.fusionGerceklestir(satir, sutun, mevcutBitki, bitkiTipi, tarif);
                    return; // Fusion yapıldı, normal yerleşim çağırma
                } else {
                    if (window.arayuz) window.arayuz.mesajGoster(`🔒 Level ${tarif.acilma_seviye}'de açılır!`);
                    return;
                }
            } else {
                if (window.arayuz) window.arayuz.mesajGoster("Bu ikisi birleşemez!");
                return;
            }
        }
        
        if (mevcutBitki) {
            console.log("Bu hücre dolu!");
            return;
        }

        const bitkiVeri = BITKILER_DATA[bitkiTipi];
        if (this.gunesSayisi >= bitkiVeri.maliyet) {
            // Güneşi düş ve arayüzü güncelle
            this.gunesEkle(-bitkiVeri.maliyet);
            
            // Bitkiyi oluştur ve listeye ekle
            const merkez = this.izgara.merkezKoordinat(satir, sutun);
            const yeniBitki = new Bitki(bitkiTipi, satir, sutun, merkez.x, merkez.y);
            this.bitkiler.push(yeniBitki);
            
            if (window.sesYonetici) window.sesYonetici.efektCal("click");
            console.log(`${bitkiVeri.emoji} ${bitkiVeri.ad} ekildi! Kalan Güneş: ${this.gunesSayisi}`);
            
            // Seçimi iptal et
            this.arayuz.seciliBitkiTipi = null;
            this.arayuz.kartlariGuncelle();
        } else {
            if (window.arayuz) window.arayuz.mesajGoster("Yeterli güneş yok!");
        }
    }

    fusionGerceklestir(satir, sutun, hedefBitki, eklenenBitkiTip, tarif) {
        const yeniBitkiData = BITKILER_DATA[tarif.sonuc];
        const eklenenVeri = BITKILER_DATA[eklenenBitkiTip];
        
        const ekMaliyet = Math.max(0, yeniBitkiData.maliyet - (hedefBitki.data.maliyet + eklenenVeri.maliyet)) || 0;
        
        if (this.gunesSayisi >= ekMaliyet) {
            this.gunesEkle(-ekMaliyet);
            
            this.bitkiSil(satir, sutun);
            
            const merkez = this.izgara.merkezKoordinat(satir, sutun);
            const yeniBitki = new Bitki(tarif.sonuc, satir, sutun, merkez.x, merkez.y);
            this.bitkiler.push(yeniBitki);
            
            this.fusionEfektiOlustur(satir, sutun, yeniBitkiData.ad);
            if (window.sesYonetici) window.sesYonetici.efektCal("yetenek_aktif");
            console.log(`🧬 FUSION: ${yeniBitkiData.ad} oluşturuldu!`);
            
            if (this.arayuz) {
                this.arayuz.seciliBitkiTipi = null;
                this.arayuz.kartlariGuncelle();
            }
        } else {
            if (window.arayuz) window.arayuz.mesajGoster("Yeterli güneş yok!");
        }
    }
    
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

    // Güneş ekle/çıkar ve UI güncelle
    gunesEkle(miktar) {
        this.gunesSayisi += miktar;
        this.arayuz.gunesGuncelle(this.gunesSayisi);
    }

    // Bitkiler tarafından çağrılır
    gunesOlustur(x, y, deger, hareketli) {
        this.gunesler.push(new Gunes(x, y, deger, hareketli));
    }

    // Saldırgan bitkiler tarafından çağrılır
    mermiOlustur(bitki) {
        const bitkiVeri = BITKILER_DATA[bitki.tip];
        
        // Kendi satırında bitkinin önünde olan hedefleri bul
        const hedefler = this.zombiler.filter(z => 
            z.satir === bitki.satir && 
            z.x > bitki.x &&
            (bitkiVeri.hedef_alabilir ? bitkiVeri.hedef_alabilir.includes(z.data.hareket_tipi || "yer") : true)
        );
        
        if (hedefler.length > 0) {
            this.mermiler.push(new Mermi(bitki.x + 30, bitki.y, bitkiVeri));
            if (window.sesYonetici) window.sesYonetici.efektCal("ates_et");
        }
    }
    
    // Faz 4 ve 5: Rastgele veya zorunlu bir eşya düşür
    itemDusur(x, y, zorunluTip = null) {
        let secilenTip = zorunluTip;
        
        if (!secilenTip) {
            let toplamOlasilik = 0;
            for (let anahtar in ITEMLER_DATA) {
                toplamOlasilik += ITEMLER_DATA[anahtar].olasilik;
            }
            
            let rastgele = Math.random() * toplamOlasilik;
            
            for (let anahtar in ITEMLER_DATA) {
                rastgele -= ITEMLER_DATA[anahtar].olasilik;
                if (rastgele <= 0) {
                    secilenTip = anahtar;
                    break;
                }
            }
        }
        
        if (secilenTip) {
            this.itemler.push(new Item(secilenTip, x, y));
            console.log(`🎁 Zombiden ${secilenTip} düştü!`);
        }
    }

    // 3x3 (yaricap: 1) alan hasarı uygulamak için
    alanHasariVer(merkezSatir, merkezSutun, yaricap, hasar, efektGoster, donduran = false, dondurSuresi = 0) {
        const merkezKoor = this.izgara.merkezKoordinat(merkezSatir, merkezSutun);
        // İki hücrenin x eksenindeki genişliği etki alanı olur
        const etkiMesafeX = yaricap * this.izgara.hucreGenislik + 60; 
        
        for (let z of this.zombiler) {
            if (Math.abs(z.satir - merkezSatir) <= yaricap && Math.abs(z.x - merkezKoor.x) <= etkiMesafeX) {
                z.hasarAl(hasar);
                if (donduran) {
                    z.yavaslat(0, dondurSuresi);
                }
            }
        }
        
        if (efektGoster) {
            this.efektler.push({
                x: merkezKoor.x,
                y: merkezKoor.y,
                gecenZaman: 0,
                suresi: 500, // 500ms ekranda kalsın
                gorselYolu: "assets/efektler/patlama.png"
            });
            if (window.sesYonetici) window.sesYonetici.efektCal("patlama");
        }
    }

    // Ana oyun döngüsü tarafından çağrılır
    guncelle(gecenZaman) {
        if (this.durum !== "oynaniyor") return;
        
        // Gökten rastgele güneş düşürme (Her 10 saniyede bir)
        this.goktenGunesZamanlayici += gecenZaman;
        if (this.goktenGunesZamanlayici >= 10000) {
            this.goktenGunesZamanlayici = 0;
            // Rastgele bir x koordinatı (ızgara içinde)
            const rastgeleX = Math.random() * (this.izgara.genislik - 100) + 50;
            const rastgeleHedefY = Math.random() * (this.izgara.yukseklik - 100) + this.izgara.ustBosluk + 50;
            this.gunesOlustur(rastgeleX, rastgeleHedefY, 25, true);
        }

        // Dalga mekaniği ve zombi spawn (üretme)
        this.dalgaZamanlayici += gecenZaman;
        
        // Bekleyen zombileri kontrol et
        for (let i = this.bekleyenZombiler.length - 1; i >= 0; i--) {
            const bz = this.bekleyenZombiler[i];
            const hedefGecikme = bz.gecikme_ms !== undefined ? bz.gecikme_ms : (bz.gecikme || 0);
            if (this.dalgaZamanlayici >= hedefGecikme) {
                // Zombiyi oluştur
                const satir = bz.satir !== undefined ? bz.satir : Math.floor(Math.random() * this.izgara.satirSayisi);
                const merkezY = this.izgara.merkezKoordinat(satir, 0).y; // Y koordinatı satırdan
                const baslangicX = this.canvas.width + 50; // Ekranın sağından gelsin
                
                const yeniZombi = new Zombi(bz.tip, satir, baslangicX, merkezY);
                this.zombiler.push(yeniZombi);
                
                // Eğer bu zombi bir boss ise ekranda banner çıkar
                if (yeniZombi.data.boss_baslik) {
                    this.arayuz.bossGeliyor(yeniZombi.data.boss_baslik);
                }
                
                // Bekleyenler listesinden çıkar
                this.bekleyenZombiler.splice(i, 1);
            }
        }
        
        // Dalga bitti mi kontrolü
        if (this.bekleyenZombiler.length === 0 && this.zombiler.length === 0) {
            console.log("Dalga bitti, kart seçimi başlıyor");
            // Sonraki dalgaya geç
            this.guncelDalgaIndex++;
            if (typeof maksimumAcilanSeviyeKaydet !== "undefined") {
                maksimumAcilanSeviyeKaydet(this.guncelDalgaIndex);
                if (typeof FUSION_TARIFLERI !== "undefined") {
                    const yeniAcilanFusion = Object.values(FUSION_TARIFLERI).find(t => t.acilma_seviye === this.guncelDalgaIndex);
                    if (yeniAcilanFusion) {
                        const yeniBitki = BITKILER_DATA[yeniAcilanFusion.sonuc];
                        this.fusionAcildiBildir(yeniBitki.ad, this.guncelDalgaIndex);
                        if (window.sesYonetici) window.sesYonetici.efektCal("kazanma");
                    }
                }
            }
            if (this.guncelDalgaIndex < this.seviye.dalgalar.length) {
                // Yeni kartları belirle (+1)
                try {
                    this.yeniKartlariBelirle();
                } catch (e) {
                    console.error("akilliKartSecimi() HATASI:", e);
                }
                
                // Sıradaki dalganın gecikme süresi varsa onu ayarla veya beklet
                console.log(`Dalga ${this.guncelDalgaIndex} temizlendi! Sıradakine geçiliyor...`);
                this.durum = "hazirlik";
                console.log("Yeni dalga başlatılıyor: 3 saniye sonra...");
                setTimeout(() => this.dalgaBaslat(), 3000); // 3 saniye ara
            } else {
                // Tüm dalgalar bitti!
                this.oyunBitti(true);
                return;
            }
        }

        // --- ELEMANLARI GÜNCELLE ---
        
        // Itemleri güncelle
        for (let item of this.itemler) item.guncelle(gecenZaman);
        
        // Güneşleri güncelle
        for (let gunes of this.gunesler) gunes.guncelle(gecenZaman);
        
        // Bitkileri güncelle
        for (let bitki of this.bitkiler) bitki.guncelle(gecenZaman);
        
        // Mermileri güncelle
        for (let mermi of this.mermiler) mermi.guncelle(gecenZaman);
        
        // Zombileri güncelle ve çarpışmaları kontrol et
        for (let bitki of this.bitkiler) {
            bitki.saldiriAltinda = false;
        }
        
        for (let i = 0; i < this.zombiler.length; i++) {
            let zombi = this.zombiler[i];
            
            // 1. Zombi - Bitki Çarpışması (Zombi yiyorsa durmalı)
            let hedefeUlasti = false;
            for (let j = 0; j < this.bitkiler.length; j++) {
                let bitki = this.bitkiler[j];
                
                // Aynı satırdalar ve zombi bitkinin hemen yanındaysa
                if (zombi.satir === bitki.satir && Math.abs(zombi.x - bitki.x) < 40) {
                    hedefeUlasti = true;
                    zombi.hareketEdiyor = false;
                    bitki.saldiriAltinda = true;
                    
                    // Temas Dondurma yeteneği varsa
                    if (bitki.data.ozel_yetenek === "temas_dondurur") {
                        zombi.yavaslat(0, bitki.data.temas_dondur_sure_ms || 2000);
                    }
                    
                                        // Isırma zamanı geldiyse
                    zombi.sonIsirmaZamani += gecenZaman;
                    if (zombi.sonIsirmaZamani >= zombi.isirmaPeriyot) {
                        bitki.hasarAl(zombi.isirmaHasari);
                        zombi.sonIsirmaZamani = 0;
                        
                        // Vampir Zombi HP Emer
                        if (zombi.tip === "vampir_zombi") {
                            const emilen = zombi.data.hasar * zombi.data.emme_orani;
                            zombi.hp = Math.min(zombi.hp + emilen, zombi.maxHp);
                        }
                    }
                    break;
                }
            }
            
            if (!hedefeUlasti) {
                zombi.hareketEdiyor = true;
                zombi.guncelle(gecenZaman);
            }
            
            // Zombi en sola ulaştıysa Oyun Biter!
            if (zombi.hp > 0 && zombi.x < 50) {
                console.warn("ZOMBİ SOLA ULAŞTI! KAYBEDİLDİ:", zombi.tip, zombi.x);
                this.oyunBitti(false);
                return;
            }
        }
        
        // 2. Mermi - Zombi çarpışması
        for (let m = 0; m < this.mermiler.length; m++) {
            let mermi = this.mermiler[m];
            if (!mermi.aktif) continue;
            
            for (let z = 0; z < this.zombiler.length; z++) {
                let zombi = this.zombiler[z];
                
                // Zombi uçuyorsa ve mermi sadece yere gidiyorsa içinden geç
                const uygunHedef = (zombi.havasal && mermi.hedefAlabilir.includes("hava")) || (!zombi.havasal && mermi.hedefAlabilir.includes("yer"));
                if (!uygunHedef) continue;
                
                // Zombi ile mermi aynı hizada(satır ve x koordinatı yakın) mı?
                if (Math.abs(mermi.y - zombi.y) < 20 && Math.abs(mermi.x - zombi.x) < 30) {
                    mermi.aktif = false; // Mermi patladı
                    
                    if (mermi.alanYaricap > 0) {
                        // Patlayan Kavun vb. için alan hasarı
                        let zHucre = this.izgara.hucreBul(zombi.x, zombi.y);
                        let sutun = zHucre ? zHucre.sutun : Math.floor((zombi.x - this.izgara.solBosluk) / this.izgara.hucreGenislik);
                        this.alanHasariVer(zombi.satir, sutun, mermi.alanYaricap, mermi.hasar, true, mermi.donduran, mermi.dondurSuresi);
                    } else {
                        // Normal hasar
                        zombi.hasarAl(mermi.hasar);
                        // Yavaşlatma etkisi
                        if (mermi.yavaslatmaOrani) {
                            zombi.yavaslat(mermi.yavaslatmaOrani, mermi.yavaslatmaSuresi);
                        }
                        // Dondurma etkisi
                        if (mermi.donduran) {
                            zombi.yavaslat(0, mermi.dondurSuresi);
                        }
                    }
                    break; // Bir mermi sadece bir zombiye çarpar (Alan hasarı ayrı verilir)
                }
            }
        }
        
        // 3. Efektleri güncelle
        for (let i = this.efektler.length - 1; i >= 0; i--) {
            let e = this.efektler[i];
            e.gecenZaman += gecenZaman;
            if (e.gecenZaman >= e.suresi) {
                this.efektler.splice(i, 1);
            }
        }
        
        // --- ÖLÜ ELEMANLARI TEMİZLE ---
        this.gunesler = this.gunesler.filter(g => !g.toplandi);
        this.itemler = this.itemler.filter(i => !i.silinecek); // Toplanmış veya ömrü bitmişleri sil
        this.bitkiler = this.bitkiler.filter(b => b.hp > 0);
        this.zombiler = this.zombiler.filter(z => z.hp > 0);
        this.mermiler = this.mermiler.filter(m => m.aktif);
    }

    oyunBitti(kazandinMi) {
        if (this.durum === "bitti") return; // Zaten bitmişse tekrar çağırma
        
        // Sadece tüm dalgalar bittiyse ve zombi kalmadıysa KAZANILIR
        if (kazandinMi && this.zombiler.length === 0 && this.bekleyenZombiler.length === 0 && this.guncelDalgaIndex >= this.seviye.dalgalar.length) {
            this.durum = "bitti";
            console.log("🏆 KAZANDIN! TÜM ZOMBİLER TEMİZLENDİ.");
            this.arayuz.oyunBittiMesaji("KAZANDIN! 🎉");
        } else {
            this.durum = "bitti";
            console.log("💀 KAYBETTİN! ZOMBİLER EVE GİRDİ VEYA BİTKİLER YOK EDİLDİ!");
            this.arayuz.oyunBittiMesaji("KAYBETTİN! 🧟");
        }
    }

    // Ana oyun döngüsü tarafından çağrılır
    ciz() {
        // Tuvali temizle
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Zemin çizimi: Pixel Art Çim (Offscreen Canvas ile Cachelenmiş)
        if (!this.arkaplanCache) {
            this.arkaplanCache = document.createElement('canvas');
            this.arkaplanCache.width = this.canvas.width;
            this.arkaplanCache.height = this.izgara.yukseklik;
            
            const bgCtx = this.arkaplanCache.getContext('2d');
            
            // 1. Çim Dokusunu Tile Olarak Döşe
            let dokuDolu = false;
            if (window.gorselYukleyici) {
                const cimDoku = window.gorselYukleyici.getir("assets/arkaplan/cim_doku.png");
                if (cimDoku) {
                    const pattern = bgCtx.createPattern(cimDoku, "repeat");
                    bgCtx.fillStyle = pattern;
                    bgCtx.fillRect(0, 0, this.canvas.width, this.izgara.yukseklik);
                    dokuDolu = true;
                }
            }
            
            // Fallback (Doku henüz yoksa)
            if (!dokuDolu) {
                bgCtx.fillStyle = "#7CB342";
                bgCtx.fillRect(0, 0, this.canvas.width, this.izgara.yukseklik);
            }
            
            // 2. Dikey Gradient (Üstten alta derinlik/ışık)
            const dikeyGradient = bgCtx.createLinearGradient(0, 0, 0, this.izgara.yukseklik);
            dikeyGradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
            dikeyGradient.addColorStop(1, "rgba(0, 0, 0, 0.15)");
            bgCtx.fillStyle = dikeyGradient;
            bgCtx.fillRect(0, 0, this.canvas.width, this.izgara.yukseklik);
            
            // 3. Yatay Gradient (Soldan sağa tehditkar hava, tüm alan biraz karanlık)
            const yatayGradient = bgCtx.createLinearGradient(0, 0, this.canvas.width, 0);
            yatayGradient.addColorStop(0, "rgba(0, 0, 0, 0.35)"); // Ev tarafı (Artık daha atmosferik)
            yatayGradient.addColorStop(1, "rgba(0, 0, 0, 0.55)"); // Zombi tarafı daha da karanlık
            bgCtx.fillStyle = yatayGradient;
            bgCtx.fillRect(0, 0, this.canvas.width, this.izgara.yukseklik);
        }
        
        // Cachelenmiş arka planı çiz (Izgara başlangıç noktasından itibaren)
        this.ctx.drawImage(this.arkaplanCache, 0, this.izgara.ustBosluk);
        
        // Önce ızgarayı çiz
        this.izgara.ciz(this.ctx);
        
        // Yetenek Seçim Modu Overlay'i (Karanlık filtre)
        if (this.arayuz.yetenekSecimModu) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            this.ctx.fillRect(0, this.izgara.ustBosluk, this.canvas.width, this.izgara.yukseklik);
            
            this.ctx.save();
            this.ctx.fillStyle = "#FFD700";
            this.ctx.font = "32px 'Press Start 2P', sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.shadowColor = "#000000";
            this.ctx.shadowBlur = 10;
            this.ctx.fillText("✨ YETENEK İÇİN BİR BİTKİ SEÇ ✨", this.canvas.width / 2, this.izgara.ustBosluk + 50);
            this.ctx.restore();
        }
        
        // Sırayla diğer elemanları çiz
        for (let bitki of this.bitkiler) bitki.ciz(this.ctx);
        for (let zombi of this.zombiler) zombi.ciz(this.ctx);
        for (let mermi of this.mermiler) mermi.ciz(this.ctx);
        for (let gunes of this.gunesler) gunes.ciz(this.ctx);
        for (let item of this.itemler) item.ciz(this.ctx);
        
        // Sürüklenen bitkiyi çiz
        if (this.surukleAktif && this.suruklenenBitki) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.6;
            const bitkiVeri = BITKILER_DATA[this.suruklenenBitki.bitki.tip];
            if (bitkiVeri.görsel || bitkiVeri.gorsel) {
                const gorselYol = bitkiVeri.görsel || bitkiVeri.gorsel;
                if (window.gorselYukleyici) {
                    const gorsel = window.gorselYukleyici.getir(gorselYol);
                    if (gorsel && gorsel.complete) {
                        this.ctx.drawImage(gorsel, this.surukleKonum.x - 40, this.surukleKonum.y - 40, 80, 80);
                    }
                }
            }
            this.ctx.restore();
        }
        
        // Efektleri çiz (Patlamalar, Yüzen Yazılar vs.)
        for (let efekt of this.efektler) {
            if (efekt.tip === "yazi") {
                this.ctx.save();
                this.ctx.font = "24px 'Press Start 2P', sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillStyle = efekt.renk;
                this.ctx.strokeStyle = "#000000";
                this.ctx.lineWidth = 4;
                
                // Yazı yavaşça yukarı çıksın
                const yukariHareket = (efekt.gecenZaman / efekt.suresi) * 30;
                
                this.ctx.strokeText(efekt.metin, efekt.x, efekt.y - yukariHareket);
                this.ctx.fillText(efekt.metin, efekt.x, efekt.y - yukariHareket);
                this.ctx.restore();
            } else if (efekt.tur === "fusion" || efekt.tur === "fusion_acildi") {
                this.ctx.save();
                this.ctx.font = "bold 32px 'Press Start 2P', sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillStyle = "#FFD700"; // Altın sarısı
                this.ctx.strokeStyle = "#000000";
                this.ctx.lineWidth = 6;
                this.ctx.shadowColor = "#FFFFFF";
                this.ctx.shadowBlur = 10;
                
                const yukariHareket = efekt.tur === "fusion" ? (efekt.gecenZaman / efekt.suresi) * 50 : 0;
                let scale = 1;
                if (efekt.tur === "fusion_acildi") {
                    scale = 1 + Math.sin(efekt.gecenZaman / 200) * 0.1; // Pulsing effect
                }
                
                this.ctx.translate(efekt.x, efekt.y - yukariHareket);
                this.ctx.scale(scale, scale);
                
                this.ctx.strokeText(efekt.metin, 0, 0);
                this.ctx.fillText(efekt.metin, 0, 0);
                this.ctx.restore();
            } else if (efekt.gorselYolu && window.gorselYukleyici) {
                const gorsel = window.gorselYukleyici.getir(efekt.gorselYolu);
                if (gorsel) {
                    const boyut = 144; // Patlamayı biraz büyük çizelim
                    this.ctx.drawImage(gorsel, efekt.x - boyut / 2, efekt.y - boyut / 2, boyut, boyut);
                }
            }
        }
    }

    yeniKartlariBelirle() {
        // Tüm bitkiler açıksa hiçbir şey yapma (Dalga 4 ve sonrası)
        if (this.kilitAcikBitkiler.length >= 7) return;

        const siradakiDalga = this.seviye.dalgalar[this.guncelDalgaIndex];
        const siradakiZombiler = siradakiDalga.zombiler.map(z => z.tip);
        
        let secilecekKart = null;

        // Öncelik 1: Balonlu Zombi -> Kaktüs
        if (siradakiZombiler.includes("balonlu") && !this.kilitAcikBitkiler.includes("kaktus")) {
            secilecekKart = "kaktus";
        }
        // Öncelik 2: Hızlı Zombi -> Kar Bezelye
        else if (siradakiZombiler.includes("hizli") && !this.kilitAcikBitkiler.includes("kar_bezelye")) {
            secilecekKart = "kar_bezelye";
        }
        // Öncelik 3: Kasklı Zombi -> Patlayan Kavun veya Kiraz (Rastgele biri)
        else if (siradakiZombiler.includes("kaskli")) {
            const adaylar = [];
            if (!this.kilitAcikBitkiler.includes("patlayan_kavun")) adaylar.push("patlayan_kavun");
            if (!this.kilitAcikBitkiler.includes("patlayan_kiraz")) adaylar.push("patlayan_kiraz");
            
            if (adaylar.length > 0) {
                secilecekKart = adaylar[Math.floor(Math.random() * adaylar.length)];
            }
        }
        
        // Eğer öncelikli bir tehdit yoksa veya tehdit bitkileri zaten açıksa, rastgele kalanlardan birini seç
        if (!secilecekKart) {
            const tumBitkiler = Object.keys(BITKILER_DATA);
            const kalanBitkiler = tumBitkiler.filter(b => !this.kilitAcikBitkiler.includes(b));
            if (kalanBitkiler.length > 0) {
                secilecekKart = kalanBitkiler[Math.floor(Math.random() * kalanBitkiler.length)];
            }
        }
        
        // Kartı aç ve arayüze ekle
        if (secilecekKart) {
            this.kilitAcikBitkiler.push(secilecekKart);
            this.arayuz.kartEkle(secilecekKart, true); // true = yeni (animasyonlu)
            console.log(`🎉 YENİ BİTKİ KİLİDİ AÇILDI: ${BITKILER_DATA[secilecekKart].ad}`);
            console.log(`Yeni kart seçildi: ${secilecekKart}`);
        } else {
            console.log(`Yeni kart seçilmedi. (Açılacak kart kalmamış olabilir)`);
        }
    }
}

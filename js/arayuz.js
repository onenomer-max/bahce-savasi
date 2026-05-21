// js/arayuz.js
// Bu sınıf alt menü, bitki kartları, güneş sayacı gibi HTML arayüz elemanlarını yönetir.

class Arayuz {
    constructor(oyunYonetici) {
        this.oyun = oyunYonetici;
        this.seciliBitkiTipi = null;
        
        // HTML elemanları
        this.gunesSayaciEl = document.getElementById("guncel-gunes");
        this.altMenuEl = document.getElementById("alt-menu");
        this.dalgaGostergesiEl = document.getElementById("dalga-gostergesi");
        this.butonBaslaEl = document.getElementById("buton-basla");
        this.butonYenileEl = document.getElementById("buton-yenile");
        this.merkezMesajEl = document.getElementById("merkez-mesaj");
        this.butonTamEkranEl = document.getElementById("buton-tamekran");
        this.butonSesEl = document.getElementById("buton-ses");
        
        // Buton olayları
        if (this.butonTamEkranEl) {
            this.butonTamEkranEl.addEventListener("click", () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error("Tam ekrana geçilemedi:", err);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }
        
        if (this.butonSesEl) {
            this.butonSesEl.addEventListener("click", () => {
                if (window.sesYonetici) {
                    const sessizMi = window.sesYonetici.sessizModuToggle();
                    this.butonSesEl.innerText = sessizMi ? "🔇" : "🔊";
                    this.butonSesEl.title = sessizMi ? "Sesi Aç" : "Sesi Kapat";
                }
            });
        }
        
        this.butonBaslaEl.addEventListener("click", () => {
            this.oyun.dalgaBaslat();
            this.butonBaslaEl.style.display = "none";
        });
        
        this.butonYenileEl.addEventListener("click", () => {
            window.location.reload();
        });
        
        this.kartlariOlustur();
    }

    // Sadece kilidi açık bitkilere göre alt menüyü çizer
    kartlariOlustur() {
        this.altMenuEl.innerHTML = ""; // Temizle
        
        for (let anahtar of this.oyun.kilitAcikBitkiler) {
            this.kartEkle(anahtar, false);
        }
        
        this.kartlariGuncelle(); // Başlangıçta yeterli güneş olmayanları karart
    }

    kartEkle(anahtar, yeniMi = false) {
        // Eğer zaten varsa ekleme
        if (document.getElementById(`kart-${anahtar}`)) return;

        const bitki = BITKILER_DATA[anahtar];
        const kart = document.createElement("div");
        kart.className = "bitki-karti";
        
        // Yeni karta parıltı animasyonu ver (3 saniye sonra sil)
        if (yeniMi) {
            kart.classList.add("yeni-kart");
            setTimeout(() => kart.classList.remove("yeni-kart"), 3000);
        }
        
        kart.id = `kart-${anahtar}`;
        
        let gorselHTML = "";
        if (bitki.görsel) {
            gorselHTML = `<div class="bitki-karti-gorsel"><img src="${bitki.görsel}" alt="${bitki.ad}"></div>`;
        } else {
            gorselHTML = `<div class="bitki-karti-emoji">${bitki.emoji}</div>`;
        }
        
        kart.innerHTML = `
            ${gorselHTML}
            <div class="bitki-karti-maliyet">☀️ ${bitki.maliyet}</div>
        `;
        
        // Karta tıklanma olayı
        kart.addEventListener("click", () => {
            this.kartSec(anahtar, bitki.maliyet);
        });
        
        this.altMenuEl.appendChild(kart);
    }

    // Bir bitki kartı seçildiğinde
    kartSec(bitkiTipi, maliyet) {
        if (this.oyun.gunesSayisi >= maliyet) {
            this.seciliBitkiTipi = bitkiTipi;
            this.kartlariGuncelle(); // Seçili olanı vurgula
            console.log(`Seçilen bitki: ${BITKILER_DATA[bitkiTipi].ad}`);
        } else {
            console.log("Yeterli güneş yok!");
        }
    }

    // Kartların seçili/soluk durumlarını günceller
    kartlariGuncelle() {
        for (let anahtar of this.oyun.kilitAcikBitkiler) {
            const bitki = BITKILER_DATA[anahtar];
            const kart = document.getElementById(`kart-${anahtar}`);
            if (!kart) continue;
            
            // Sınıfları temizle
            kart.classList.remove("secili", "yetersiz-gunes");
            
            // Eğer güneş yetmiyorsa
            if (this.oyun.gunesSayisi < bitki.maliyet) {
                kart.classList.add("yetersiz-gunes");
                // Eğer seçiliyken güneşi bittiyse seçimi iptal et
                if (this.seciliBitkiTipi === anahtar) {
                    this.seciliBitkiTipi = null;
                }
            }
            
            // Seçiliyse vurgula
            if (this.seciliBitkiTipi === anahtar) {
                kart.classList.add("secili");
            }
        }
    }

    // Güneş sayısını HUD üzerinde günceller
    gunesGuncelle(miktar) {
        this.gunesSayaciEl.innerText = miktar;
        this.kartlariGuncelle();
    }

    // Dalga bilgisini günceller
    dalgaGuncelle(metin) {
        // Eğer dalga sayısı ise yanına "/ 20" ekle (örn: "Dalga 1" -> "Dalga 1 / 20")
        if (metin.startsWith("Dalga ")) {
            this.dalgaGostergesiEl.innerText = metin + " / 20";
        } else {
            this.dalgaGostergesiEl.innerText = metin;
        }
    }

    // Boss sahaya girdiğinde devasa banner gösterir
    bossGeliyor(baslik) {
        if (window.sesYonetici) window.sesYonetici.efektCal("boss_giris");
        
        let banner = document.getElementById("boss-banner");
        if (!banner) {
            banner = document.createElement("div");
            banner.id = "boss-banner";
            document.getElementById("oyun-alani").appendChild(banner);
        }
        banner.innerText = baslik;
        banner.classList.add("aktif");
        
        // 3 saniye sonra kaybolsun
        setTimeout(() => {
            banner.classList.remove("aktif");
        }, 3000);
    }

    // Kazandın / Kaybettin mesajı
    oyunBittiMesaji(mesaj) {
        this.merkezMesajEl.innerText = mesaj;
        this.merkezMesajEl.style.display = "block";
        this.butonYenileEl.style.display = "inline-block";
    }
}

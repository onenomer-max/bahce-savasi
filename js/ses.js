// js/ses.js
// Sesleri çalmayı, yönetmeyi ve fade efektlerini sağlayan sınıf.

class SesYonetici {
    constructor(yukleyici) {
        this.yukleyici = yukleyici;
        this.aktifMuzik = null;
        this.muzikSeviye = 0.3;
        this.efektSeviye = 0.5;
        this.sessizMi = false;
        
        // Tarayıcı otomatik çalma politikası için, 
        // müzik çalmaya başlamadan önce etkileşim olmuş mu kontrolü
        this.kullaniciEtkilesimiOlduMu = false;
        this.bekleyenMuzik = null;
        
        // Ekrana ilk tıklandığında etkileşim bayrağını aç
        window.addEventListener("click", () => {
            if (!this.kullaniciEtkilesimiOlduMu) {
                this.kullaniciEtkilesimiOlduMu = true;
                if (this.bekleyenMuzik) {
                    this.muzikCal(this.bekleyenMuzik);
                    this.bekleyenMuzik = null;
                }
            }
        }, { once: true });
    }
    
    muzikCal(ad) {
        if (!this.kullaniciEtkilesimiOlduMu) {
            this.bekleyenMuzik = ad;
            return; // Etkileşim olmadan müzik çalamayız
        }
        
        if (this.sessizMi) return;
        
        const yeniMuzik = this.yukleyici.getir(ad);
        if (!yeniMuzik) return;
        
        // Eğer zaten bu müzik çalıyorsa baştan başlatma
        if (this.aktifMuzik === yeniMuzik) return;
        
        // Önceki müziği fade-out yap
        if (this.aktifMuzik) {
            const eskiMuzik = this.aktifMuzik;
            this.fadeOut(eskiMuzik, 1000, () => {
                eskiMuzik.pause();
                eskiMuzik.currentTime = 0;
            });
        }
        
        // Yeni müziği hazırla ve fade-in yap
        this.aktifMuzik = yeniMuzik;
        this.aktifMuzik.loop = true;
        this.aktifMuzik.volume = 0;
        this.aktifMuzik.play().catch(e => {
            console.warn("Otomatik oynatma engellendi: ", e);
            this.kullaniciEtkilesimiOlduMu = false;
            this.bekleyenMuzik = ad;
        });
        
        this.fadeIn(this.aktifMuzik, 1000, this.muzikSeviye);
    }
    
    efektCal(ad) {
        if (this.sessizMi || !this.kullaniciEtkilesimiOlduMu) return;
        
        const ses = this.yukleyici.getir(ad);
        if (ses) {
            // Anlık efekt, her defasında yeni bir klon oluşturarak üst üste çalabilmeyi sağla
            const klon = ses.cloneNode();
            klon.volume = this.efektSeviye;
            klon.play().catch(e => console.warn("Efekt çalınamadı:", e));
        }
    }
    
    sessizModuToggle() {
        this.sessizMi = !this.sessizMi;
        
        if (this.aktifMuzik) {
            if (this.sessizMi) {
                // Sessiz mod açıldıysa müziği kapat
                this.aktifMuzik.pause();
            } else {
                // Sessiz mod kapandıysa müziği devam ettir
                this.aktifMuzik.volume = this.muzikSeviye;
                this.aktifMuzik.play().catch(e => console.warn(e));
            }
        } else if (!this.sessizMi && this.bekleyenMuzik && this.kullaniciEtkilesimiOlduMu) {
            // Eğer müzik hiç başlamamışsa ve sessizden çıkıldıysa
            this.muzikCal(this.bekleyenMuzik);
        }
        
        return this.sessizMi;
    }
    
    // --- Yardımcı Fade Fonksiyonları ---
    
    fadeOut(audio, sure, callback) {
        const adimSayisi = 20;
        const intervalSuresi = sure / adimSayisi;
        const baslangicSes = audio.volume;
        const adimMiktari = baslangicSes / adimSayisi;
        
        let mevcutAdim = 0;
        const timer = setInterval(() => {
            mevcutAdim++;
            const yeniSes = baslangicSes - (adimMiktari * mevcutAdim);
            if (yeniSes > 0) {
                audio.volume = yeniSes;
            } else {
                audio.volume = 0;
                clearInterval(timer);
                if (callback) callback();
            }
        }, intervalSuresi);
    }
    
    fadeIn(audio, sure, hedefSes) {
        const adimSayisi = 20;
        const intervalSuresi = sure / adimSayisi;
        const adimMiktari = hedefSes / adimSayisi;
        
        let mevcutAdim = 0;
        const timer = setInterval(() => {
            mevcutAdim++;
            const yeniSes = adimMiktari * mevcutAdim;
            if (yeniSes < hedefSes) {
                audio.volume = yeniSes;
            } else {
                audio.volume = hedefSes;
                clearInterval(timer);
            }
        }, intervalSuresi);
    }
}

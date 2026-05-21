// js/ses_yukleyici.js
// Bu sınıf oyun başlamadan önce tüm ses (ogg/mp3) dosyalarını belleğe (RAM'e) yükler.

class SesYukleyici {
    constructor() {
        this.sesler = {};
        
        // Yüklenecek tüm seslerin yolları
        this.sesYollari = {
            // Müzikler
            "muzik1_bahce": "assets/sesler/muzik/muzik1_bahce.ogg",
            "muzik2_gulyabani": "assets/sesler/muzik/muzik2_gulyabani.ogg",
            "muzik3_yogunlasma": "assets/sesler/muzik/muzik3_yogunlasma.ogg",
            "muzik4_nekromant": "assets/sesler/muzik/muzik4_nekromant.ogg",
            // Efektler
            "click": "assets/sesler/efektler/click.ogg",
            "gunes_uret": "assets/sesler/efektler/gunes_uret.ogg",
            "gunes_topla": "assets/sesler/efektler/gunes_topla.ogg",
            "ates_et": "assets/sesler/efektler/ates_et.ogg",
            "zombi_olum": "assets/sesler/efektler/zombi_olum.ogg",
            "bitki_yenildi": "assets/sesler/efektler/bitki_yenildi.ogg",
            "patlama": "assets/sesler/efektler/patlama.ogg",
            "yetenek_aktif": "assets/sesler/efektler/yetenek_aktif.ogg",
            "toz_topla": "assets/sesler/efektler/toz_topla.ogg",
            "boss_giris": "assets/sesler/efektler/boss_giris.ogg",
            "kazanma": "assets/sesler/efektler/kazanma.ogg",
            "kaybetme": "assets/sesler/efektler/kaybetme.ogg"
        };
    }

    async yukle() {
        console.log("⏳ Sesler yükleniyor...");
        let basariliSayisi = 0;
        
        const promises = Object.keys(this.sesYollari).map(ad => {
            return new Promise((resolve) => {
                const yol = this.sesYollari[ad];
                const audio = new Audio();
                
                audio.oncanplaythrough = () => {
                    this.sesler[ad] = audio;
                    basariliSayisi++;
                    // Olayı temizle ki her çalmada tekrar tetiklenmesin
                    audio.oncanplaythrough = null;
                    resolve();
                };
                
                audio.onerror = () => {
                    console.error(`❌ Ses yüklenemedi: ${yol}`);
                    // Hata olsa da resolve edelim ki oyun çökmesin
                    resolve();
                };
                
                audio.src = yol;
                audio.load();
            });
        });

        // Tüm seslerin yüklenmesini bekle
        await Promise.all(promises);
        
        console.log(`🎵 ${basariliSayisi} ses başarıyla yüklendi!`);
    }

    // Yüklenmiş sesi döndürür, yoksa null
    getir(ad) {
        if (this.sesler[ad]) {
            return this.sesler[ad];
        }
        return null;
    }
}

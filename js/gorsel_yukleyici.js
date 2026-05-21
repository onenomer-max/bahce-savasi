// js/gorsel_yukleyici.js
// Bu sınıf oyun başlamadan önce tüm PNG görsellerini belleğe (RAM'e) yükler.

class GorselYukleyici {
    constructor() {
        this.gorseller = {};
        
        // Yüklenecek tüm görsellerin yolları
        this.yuklenecekListesi = [
            "assets/bitkiler/aycicegi.png",
            "assets/bitkiler/bezelye_atici.png",
            "assets/bitkiler/ceviz.png",
            "assets/bitkiler/kar_bezelye.png",
            "assets/bitkiler/patlayan_kavun.png",
            "assets/bitkiler/patlayan_kiraz.png",
            "assets/bitkiler/kaktus.png",
            "assets/bitkiler/gunesli_mantar.png",
            
            "assets/zombiler/zombi_normal.png",
            "assets/zombiler/zombi_koni.png",
            "assets/zombiler/zombi_kaskli.png",
            "assets/zombiler/zombi_hizli.png",
            "assets/zombiler/zombi_balonlu.png",
            "assets/zombiler/boss_gulyabani.png",
            "assets/zombiler/boss_nekromant.png",
            
            "assets/mermiler/bezelye_mermi.png",
            "assets/mermiler/kar_bezelye_mermi.png",
            
            "assets/itemler/para.png",
            "assets/itemler/kalp.png",
            "assets/itemler/elmas.png",
            "assets/itemler/simsek.png",
            "assets/itemler/ates_topu.png",
            "assets/itemler/yetenek_tozu.png",
            
            "assets/efektler/gunes.png",
            "assets/efektler/patlama.png",
            
            "assets/arkaplan/cim_doku.png",
            "assets/arkaplan/kart_zemini.png",
            "assets/arkaplan/basla_butonu.png"
        ];
    }

    async yukle() {
        console.log("⏳ Görseller yükleniyor...");
        let basariliSayisi = 0;
        
        const promises = this.yuklenecekListesi.map(yol => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.gorseller[yol] = img;
                    basariliSayisi++;
                    resolve();
                };
                img.onerror = () => {
                    console.error(`❌ Görsel yüklenemedi: ${yol}`);
                    // Hata olsa da resolve edelim ki oyun çökmesin (emoji fallback çalışacak)
                    resolve();
                };
                img.src = yol;
            });
        });

        // Tüm resimlerin yüklenmesini bekle
        await Promise.all(promises);
        
        console.log(`✅ ${basariliSayisi} görsel başarıyla yüklendi!`);
    }

    // Yüklenmiş görseli döndürür, yoksa null
    getir(yol) {
        if (this.gorseller[yol]) {
            return this.gorseller[yol];
        }
        return null;
    }
}

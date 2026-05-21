// js/main.js
// Bu dosya oyunun giriş noktasıdır (Entry Point). Oyun döngüsü (Game Loop) burada çalışır.

// Oyunun başlatılması için gerekli değişkenler
let sonZaman = 0;
let animasyonIstegi;

// Responsive Ekran Ölçeklendirme (CSS Transform tabanlı)
function ekranOcekle() {
    const oyunAlani = document.getElementById("oyun-alani");
    if (!oyunAlani) return;
    
    // Tarayıcı penceresinin boyutlarına göre scale hesapla
    const scaleX = window.innerWidth / 1280;
    const scaleY = window.innerHeight / 720;
    
    // 16:9 oranını bozmamak için en dar limiti al (letterboxing)
    const scale = Math.min(scaleX, scaleY);
    
    oyunAlani.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", ekranOcekle);

// Ana oyun döngüsü fonksiyonu. Her saniyede yaklaşık 60 kere (60 FPS) çağrılır.
function oyunDongusu(zaman) {
    // Ne kadar zaman geçtiğini hesapla (Delta Time)
    const gecenZaman = zaman - sonZaman;
    sonZaman = zaman;

    // Oyunu güncelle (Hareketler, çarpışmalar)
    if (window.OyunYonetici) {
        window.OyunYonetici.guncelle(gecenZaman);
        // Ekrana çiz (Karakterler, arkaplan, bitkiler)
        window.OyunYonetici.ciz();
    }

    // Bir sonraki frame için tekrar çağır
    animasyonIstegi = requestAnimationFrame(oyunDongusu);
}

// Sayfa tamamen yüklendiğinde oyunu başlat
window.onload = async () => {
    console.log("🌻 Bahçe Savaşı Yükleniyor...");
    console.log("🎮 Sürüm: v0.2");
    
    // Ekranı başlangıçta doğru ölçekle
    ekranOcekle();
    
    // Yükleniyor mesajını göster
    const merkezMesaj = document.getElementById("merkez-mesaj");
    if (merkezMesaj) {
        merkezMesaj.innerText = "Görseller Yükleniyor...";
        merkezMesaj.style.display = "block";
    }

    // Görselleri ve Sesleri yükle
    window.gorselYukleyici = new GorselYukleyici();
    window.sesYukleyici = new SesYukleyici();
    
    await Promise.all([
        window.gorselYukleyici.yukle(),
        window.sesYukleyici.yukle()
    ]);
    
    window.sesYonetici = new SesYonetici(window.sesYukleyici);

    // Yükleme bitti, mesajı gizle
    if (merkezMesaj) {
        merkezMesaj.style.display = "none";
    }
    
    // Oyun durumunu yönetecek ana objeyi oluştur
    // Oyun sınıfı oyun.js içinde tanımlanacak
    if (typeof Oyun === "function") {
        window.OyunYonetici = new Oyun();
        window.OyunYonetici.baslat();
        
        // Döngüyü başlat
        requestAnimationFrame((zaman) => {
            sonZaman = zaman;
            oyunDongusu(zaman);
        });
    } else {
        console.error("HATA: Oyun sınıfı bulunamadı. Diğer scriptler yüklenmemiş olabilir.");
    }
};

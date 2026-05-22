import re

path = 'c:/Antigravity_Projects/bahce_savasi/js/oyun.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

correct_block = """        // --- ELEMANLARI GÜNCELLE ---
        
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
                    }
                    break;
                }
            }
            
            if (!hedefeUlasti) {"""

start_idx = content.find('        // --- ELEMANLARI G')
end_idx = content.find('            if (!hedefeUlasti) {', start_idx)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + correct_block + content[end_idx + len('            if (!hedefeUlasti) {'):]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find boundaries")

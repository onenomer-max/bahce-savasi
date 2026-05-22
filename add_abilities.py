import re

path = 'c:/Antigravity_Projects/bahce_savasi/js/zombi.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add logic to zombi.js guncelle method
# Search for: if (this.data.ozel_mekanik === "diriltme") {
# After that block, insert the new boss logic.

new_logic = """        // Mekanik Zombi - Elektrik Şoku
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
"""

content = content.replace('if (this.hareketEdiyor) {', new_logic + '\n        if (this.hareketEdiyor) {')
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated zombi.js")


path_oyun = 'c:/Antigravity_Projects/bahce_savasi/js/oyun.js'
with open(path_oyun, 'r', encoding='utf-8') as f:
    content_oyun = f.read()

# Update Vampir zombi in oyun.js
bite_logic = """                    // Isırma zamanı geldiyse
                    zombi.sonIsirmaZamani += gecenZaman;
                    if (zombi.sonIsirmaZamani >= zombi.isirmaPeriyot) {
                        bitki.hasarAl(zombi.isirmaHasari);
                        zombi.sonIsirmaZamani = 0;
                        
                        // Vampir Zombi HP Emer
                        if (zombi.tip === "vampir_zombi") {
                            const emilen = zombi.data.hasar * zombi.data.emme_orani;
                            zombi.hp = Math.min(zombi.hp + emilen, zombi.maxHp);
                        }
                    }"""

content_oyun = re.sub(
    r"// Isırma zamanı geldiyse\s+zombi\.sonIsirmaZamani \+= gecenZaman;\s+if \(zombi\.sonIsirmaZamani >= zombi\.isirmaPeriyot\) \{\s+bitki\.hasarAl\(zombi\.isirmaHasari\);\s+zombi\.sonIsirmaZamani = 0;\s+\}",
    bite_logic,
    content_oyun
)
with open(path_oyun, 'w', encoding='utf-8') as f:
    f.write(content_oyun)
print("Updated oyun.js")


path_bitki = 'c:/Antigravity_Projects/bahce_savasi/js/bitki.js'
with open(path_bitki, 'r', encoding='utf-8') as f:
    content_bitki = f.read()

sok_logic = """    // Her karede çağrılır. Bitkinin saldırı veya üretim yapıp yapmayacağını kontrol eder.
    guncelle(gecenZaman) {
        if (this.sokAltinda) {
            this.sokBitisZamani -= gecenZaman;
            if (this.sokBitisZamani <= 0) {
                this.sokAltinda = false;
            } else {
                return; // Şok altındayken hiçbir şey yapma
            }
        }
        
        this.sonEylemZamani += gecenZaman;"""

content_bitki = content_bitki.replace('    guncelle(gecenZaman) {\n        this.sonEylemZamani += gecenZaman;', sok_logic)

# Add visual cue for shock
draw_logic = """        if (this.hp < this.maxHp) {
            const barGenislik = 40;"""

new_draw_logic = """        if (this.sokAltinda) {
            ctx.save();
            ctx.fillStyle = "rgba(0, 255, 255, 0.4)";
            ctx.fillRect(cizimX - 40, this.y - 40, 80, 80);
            ctx.font = "20px sans-serif";
            ctx.fillStyle = "#FFF";
            ctx.fillText("⚡", cizimX, this.y - 20);
            ctx.restore();
        }
        
        if (this.hp < this.maxHp) {"""

content_bitki = content_bitki.replace(draw_logic, new_draw_logic)
with open(path_bitki, 'w', encoding='utf-8') as f:
    f.write(content_bitki)
print("Updated bitki.js")

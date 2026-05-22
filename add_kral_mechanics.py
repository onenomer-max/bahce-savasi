import re

# 1. Update zombi.js
path_z = 'c:/Antigravity_Projects/bahce_savasi/js/zombi.js'
with open(path_z, 'r', encoding='utf-8') as f:
    z_content = f.read()

# 1a. hasarAl immunity
old_hasar = """    hasarAl(miktar) {
        this.hp -= miktar;"""
new_hasar = """    hasarAl(miktar, hasarTipi = "yer") {
        if (this.immuniteTipi && this.immuniteTipi === hasarTipi) {
            console.log("🛡️ Kral immün:", hasarTipi);
            return; // Immunite aktif, hasar almaz
        }
        this.hp -= miktar;"""
if old_hasar in z_content:
    z_content = z_content.replace(old_hasar, new_hasar)

# 1b. yavaslat immunity
old_yavas = """    yavaslat(oran, sure) {"""
new_yavas = """    yavaslat(oran, sure) {
        if (this.immuniteTipi) {
            if (oran === 0 && this.immuniteTipi === "dondurma") {
                console.log("🛡️ Kral immün: dondurma");
                return;
            }
            if (oran > 0 && this.immuniteTipi === "yavaslatma") {
                console.log("🛡️ Kral immün: yavaslatma");
                return;
            }
        }"""
if old_yavas in z_content:
    z_content = z_content.replace(old_yavas, new_yavas)

# 1c. guncelle mechanics
old_guncelle = """    guncelle(gecenZaman) {
        if (this.hp <= 0) return;"""
new_guncelle = """    guncelle(gecenZaman) {
        if (this.hp <= 0) return;
        
        // ZOMBI KRAL MEKANIKLERI
        if (this.tip === "zombi_kral") {
            const simdi = Date.now();
            
            // 1. Spawn Mekaniği
            if (!this.sonSpawnZamani) this.sonSpawnZamani = simdi;
            if (simdi - this.sonSpawnZamani >= this.data.spawn_periyot_ms) {
                if (window.OyunYonetici) {
                    const yeniZombi = new window.OyunYonetici.ZombiSinif("normal", this.satir, this.x - 80, this.y);
                    window.OyunYonetici.zombiler.push(yeniZombi);
                    console.log("👑 Zombi Kral asker çağırdı!");
                }
                this.sonSpawnZamani = simdi;
            }
            
            // 2. İmmünite Rotasyonu
            if (!this.sonImmuniteDegisim) {
                this.sonImmuniteDegisim = simdi;
                this.immuniteTipi = "yok";
            }
            if (simdi - this.sonImmuniteDegisim >= this.data.immunite_periyot_ms) {
                const tipler = ["yer", "alan", "yavaslatma", "dondurma"];
                this.immuniteTipi = tipler[Math.floor(Math.random() * tipler.length)];
                this.sonImmuniteDegisim = simdi;
                console.log("🛡️ Zombi Kral yeni immünite:", this.immuniteTipi);
            }
        }"""
# In case ZombiSinif doesn't exist, I should use the global Zombi or rely on OyunYonetici mapping
if old_guncelle in z_content:
    z_content = z_content.replace(old_guncelle, new_guncelle.replace('window.OyunYonetici.ZombiSinif', 'Zombi'))

with open(path_z, 'w', encoding='utf-8') as f:
    f.write(z_content)
print("Updated zombi.js with Zombi Kral mechanics!")

# 2. Update oyun.js to pass hasarTipi to alanHasari and handle win condition
path_o = 'c:/Antigravity_Projects/bahce_savasi/js/oyun.js'
with open(path_o, 'r', encoding='utf-8') as f:
    o_content = f.read()

# Update alanHasariVer to pass hasarTipi = "alan"
old_alan = """z.hasarAl(hasar);"""
new_alan = """z.hasarAl(hasar, "alan");"""
o_content = o_content.replace(old_alan, new_alan)

# Update game loop win condition
# Look for dalga kontrolü:
win_condition_check = """        // Zombi dalgas tamamland m?
        if (this.bekleyenZombiler.length === 0 && this.zombiler.length === 0) {
            // Dalga bitmiY
            if (this.guncelDalgaIndex < this.seviyeData.dalgalar.length - 1) {"""
win_condition_new = """        // Kazanma kontrolü (Son dalga, hiç zombi kalmadıysa)
        if (this.guncelDalgaIndex === this.seviyeData.dalgalar.length - 1 && this.bekleyenZombiler.length === 0 && this.zombiler.length === 0) {
            this.kazandiniz = true;
            this.durum = "bitti";
            return;
        }
        
        // Zombi dalgası tamamlandı mı?
        if (this.bekleyenZombiler.length === 0 && this.zombiler.length === 0) {
            // Dalga bitmiş
            if (this.guncelDalgaIndex < this.seviyeData.dalgalar.length - 1) {"""
# Regex to replace safely:
import re
o_content = re.sub(r'(\s*// Zombi dalgas.\s*tamamland.\s*m.\?\s*if \(this\.bekleyenZombiler\.length === 0 && this\.zombiler\.length === 0\) \{\s*// Dalga bitmi.\s*if \(this\.guncelDalgaIndex < this\.seviyeData\.dalgalar\.length - 1\) \{)',
                   r'\n        // Kazanma kontrolü (Son dalga, hiç zombi kalmadıysa)\n        if (this.guncelDalgaIndex === 49 && this.bekleyenZombiler.length === 0 && this.zombiler.length === 0) {\n            this.kazandiniz = true;\n        }\n\1',
                   o_content)

# We also need to draw "KAZANDINIZ" in oyun.js ciz() method
old_ciz_bitti = """        if (this.durum === "bitti") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.fillStyle = "red";
            ctx.font = "bold 60px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("OYUN BTT!", this.canvas.width/2, this.canvas.height/2);"""
new_ciz_bitti = """        if (this.kazandiniz) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.fillStyle = "gold";
            ctx.font = "bold 70px sans-serif";
            ctx.textAlign = "center";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 10;
            ctx.fillText("🎉 TEBRİKLER! KAZANDIN! 🎉", this.canvas.width/2, this.canvas.height/2 - 30);
            
            ctx.fillStyle = "#FFF";
            ctx.font = "30px sans-serif";
            ctx.fillText("Zombi Kral'ı yendin, oyunu bitirdin!", this.canvas.width/2, this.canvas.height/2 + 30);
            ctx.shadowBlur = 0;
            return;
        }

        if (this.durum === "bitti") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.fillStyle = "red";
            ctx.font = "bold 60px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("OYUN BİTTİ!", this.canvas.width/2, this.canvas.height/2);"""
if "this.durum === \"bitti\"" in o_content:
    # Just a simple string replace for the game over screen
    idx_bitti = o_content.find('        if (this.durum === "bitti") {')
    if idx_bitti != -1:
        o_content = o_content[:idx_bitti] + new_ciz_bitti + o_content[idx_bitti + len(old_ciz_bitti):]

with open(path_o, 'w', encoding='utf-8') as f:
    f.write(o_content)
print("Updated oyun.js with Win condition!")

import random
import re

# 1. Fix seviyeler.js
path = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Cut everything from "dalga_21": onwards
idx = content.find('  "dalga_21": {')
if idx != -1:
    # Need to also remove the comma before "dalga_21"
    idx_comma = content.rfind(',', 0, idx)
    if idx_comma != -1:
        content = content[:idx_comma] + '\n  }\n};'
    else:
        content = content[:idx] + '\n  }\n};'

# Now content is back to normal, but wait, dalgalar array might not be closed properly if I just cut.
# Let's find where dalgalar array closes.
dalga_close_idx = content.find('    ]\n  }')
if dalga_close_idx == -1:
    dalga_close_idx = content.find('    ]\n  }\n};')

# Let's do it safely: parse or just regex
# Actually, I know the original ends with Dalga 20.
# I'll just find Dalga 20 block.
dalga20_idx = content.find('"no": 20')
end_bracket = content.find(']', dalga20_idx)
# We want to insert our new waves right after the last object in dalgalar array.
# The array ends right after dalga 20's closing '}'
dalga20_end = content.find('}', end_bracket)

new_waves = []

types_early = ["normal", "koni", "hizli"]
types_mid = ["normal", "koni", "hizli", "kaskli"]
types_late = ["koni", "hizli", "kaskli", "balonlu"]

for i in range(21, 51):
    zombies = []
    
    if i == 30:
        zombies.append({"tip": "mekanik_zombi", "gecikme": 3000})
        count = random.randint(4, 6)
        delay = 0
        for j in range(count):
            zombies.append({"tip": random.choice(types_mid), "gecikme": delay})
            delay += random.randint(1000, 2000)
    elif i == 40:
        zombies.append({"tip": "vampir_zombi", "gecikme": 3000})
        count = random.randint(4, 6)
        delay = 0
        for j in range(count):
            zombies.append({"tip": random.choice(types_late), "gecikme": delay})
            delay += random.randint(1000, 2000)
    elif i == 50:
        zombies.append({"tip": "zombi_kral", "gecikme": 4000})
        count = random.randint(4, 6)
        delay = 0
        for j in range(count):
            zombies.append({"tip": random.choice(types_late), "gecikme": delay})
            delay += random.randint(1000, 2000)
    else:
        if 21 <= i <= 29:
            count = random.randint(5, 7)
            t_pool = types_early
            delay_step = (1500, 3000)
        elif 31 <= i <= 39:
            count = random.randint(7, 10)
            t_pool = types_mid
            delay_step = (1000, 2000)
        else: # 41-49
            count = random.randint(10, 15)
            t_pool = types_late
            delay_step = (500, 1500)
            
        delay = 0
        for j in range(count):
            if 31 <= i <= 39 and random.random() < 0.6:
                t = random.choice(["hizli", "kaskli"])
            elif 41 <= i <= 49 and random.random() < 0.7:
                t = random.choice(["balonlu", "kaskli"])
            else:
                t = random.choice(t_pool)
                
            zombies.append({"tip": t, "gecikme": delay})
            delay += random.randint(delay_step[0], delay_step[1])
            
    # sort by gecikme
    zombies.sort(key=lambda x: x["gecikme"])
    
    # User's specific formats for 30, 40, 50 to match exactly
    if i == 30:
        zombies = [
            {"tip": "normal", "gecikme": 0},
            {"tip": "normal", "gecikme": 1500},
            {"tip": "mekanik_zombi", "gecikme": 3000},
            {"tip": "kaskli", "gecikme": 5000},
            {"tip": "koni", "gecikme": 7000}
        ]
    elif i == 40:
        zombies = [
            {"tip": "kaskli", "gecikme": 0},
            {"tip": "hizli", "gecikme": 1500},
            {"tip": "vampir_zombi", "gecikme": 3000},
            {"tip": "kaskli", "gecikme": 5000},
            {"tip": "balonlu", "gecikme": 7000},
            {"tip": "hizli", "gecikme": 9000}
        ]
    elif i == 50:
        zombies = [
            {"tip": "kaskli", "gecikme": 0},
            {"tip": "hizli", "gecikme": 1000},
            {"tip": "balonlu", "gecikme": 2000},
            {"tip": "zombi_kral", "gecikme": 4000},
            {"tip": "kaskli", "gecikme": 6000},
            {"tip": "hizli", "gecikme": 8000},
            {"tip": "balonlu", "gecikme": 10000}
        ]
        
    lines = []
    for z in zombies:
        lines.append(f'        {{ tip: "{z["tip"]}", gecikme: {z["gecikme"]} }}')
    
    wave_str = '      {\n        "no": ' + str(i) + ',\n        "zombiler": [\n' + ",\n".join(lines) + '\n        ]\n      }'
    new_waves.append(wave_str)

new_waves_str = ",\n".join(new_waves)

# Insert after dalga 20
content = content[:dalga20_end+1] + ",\n" + new_waves_str + "\n" + content[dalga20_end+1:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated seviyeler.js")


# 2. Fix oyun.js to handle "gecikme" and undefined "satir"
oyun_path = 'c:/Antigravity_Projects/bahce_savasi/js/oyun.js'
with open(oyun_path, 'r', encoding='utf-8') as f:
    oyun_content = f.read()

# Replace gecikme_ms logic
old_logic = """            const bz = this.bekleyenZombiler[i];
            if (this.dalgaZamanlayici >= bz.gecikme_ms) {
                // Zombiyi oluştur
                const merkezY = this.izgara.merkezKoordinat(bz.satir, 0).y; // Y koordinatı satırdan"""

new_logic = """            const bz = this.bekleyenZombiler[i];
            const hedefGecikme = bz.gecikme_ms !== undefined ? bz.gecikme_ms : (bz.gecikme || 0);
            if (this.dalgaZamanlayici >= hedefGecikme) {
                // Zombiyi oluştur
                const satir = bz.satir !== undefined ? bz.satir : Math.floor(Math.random() * this.izgara.satirSayisi);
                const merkezY = this.izgara.merkezKoordinat(satir, 0).y; // Y koordinatı satırdan"""

oyun_content = oyun_content.replace(old_logic, new_logic)
oyun_content = oyun_content.replace('new Zombi(bz.tip, bz.satir, baslangicX, merkezY)', 'new Zombi(bz.tip, satir, baslangicX, merkezY)')

with open(oyun_path, 'w', encoding='utf-8') as f:
    f.write(oyun_content)
print("Updated oyun.js")

path = 'c:/Antigravity_Projects/bahce_savasi/js/gorsel_yukleyici.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_images = """            "assets/zombiler/boss_mekanik.png",
            "assets/zombiler/boss_vampir.png",
            "assets/zombiler/boss_kral.png",
            
            "assets/zombiler/animasyon/zombi_mekanik_walk_1.png",
            "assets/zombiler/animasyon/zombi_mekanik_walk_2.png",
            "assets/zombiler/animasyon/zombi_mekanik_walk_3.png",
            "assets/zombiler/animasyon/zombi_mekanik_walk_4.png",
            
            "assets/zombiler/animasyon/zombi_vampir_walk_1.png",
            "assets/zombiler/animasyon/zombi_vampir_walk_2.png",
            "assets/zombiler/animasyon/zombi_vampir_walk_3.png",
            "assets/zombiler/animasyon/zombi_vampir_walk_4.png",
            
            "assets/zombiler/animasyon/zombi_kral_walk_1.png",
            "assets/zombiler/animasyon/zombi_kral_walk_2.png",
            "assets/zombiler/animasyon/zombi_kral_walk_3.png",
            "assets/zombiler/animasyon/zombi_kral_walk_4.png",\n"""

# Insert the new images right before the hibrit ones
start_idx = content.find('"assets/bitkiler/hibrit/gunes_atici.png",')
if start_idx != -1:
    content = content[:start_idx] + new_images + content[start_idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated gorsel_yukleyici.js")
else:
    print("Could not find hibrit index")

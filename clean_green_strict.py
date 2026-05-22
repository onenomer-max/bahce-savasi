from PIL import Image
import os

def temizle_yesil(image_path):
    if not os.path.exists(image_path):
        print("Bulunamadı:", image_path)
        return
        
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for item in data:
        r, g, b, a = item
        # Stricter green check to remove green halos and spills
        # If green is significantly higher than red/blue, it's green spill
        if g > 100 and r < 150 and b < 150 and (g > r + 15) and (g > b + 15):
            new_data.append((255, 255, 255, 0))
        elif g > 200 and r < 180 and b < 180: # Very bright green even with some r/b
            new_data.append((255, 255, 255, 0))
        # The user's requested tolerance as well
        elif g > 150 and r < 120 and b < 120:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(image_path, "PNG")
    print("Temizlendi:", image_path)

boss_frames_kalan = [
    "assets/zombiler/boss_vampir.png",
    "assets/zombiler/boss_kral.png",
    "assets/zombiler/animasyon/zombi_vampir_walk_1.png",
    "assets/zombiler/animasyon/zombi_vampir_walk_2.png",
    "assets/zombiler/animasyon/zombi_vampir_walk_3.png",
    "assets/zombiler/animasyon/zombi_vampir_walk_4.png",
    "assets/zombiler/animasyon/zombi_kral_walk_1.png",
    "assets/zombiler/animasyon/zombi_kral_walk_2.png",
    "assets/zombiler/animasyon/zombi_kral_walk_3.png",
    "assets/zombiler/animasyon/zombi_kral_walk_4.png",
]

base_dir = "c:/Antigravity_Projects/bahce_savasi/"
for path in boss_frames_kalan:
    temizle_yesil(os.path.join(base_dir, path))

print("Vampir ve Kral frame'leri için yeşil temizlik tamamlandı!")

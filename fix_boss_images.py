from PIL import Image
import os

def temizle_ve_cevir(image_path):
    if not os.path.exists(image_path):
        print("Bulunamadı:", image_path)
        return
        
    img = Image.open(image_path).convert("RGBA")
    
    # 1. Flip horizontally
    img = img.transpose(Image.FLIP_LEFT_RIGHT)
    
    # 2. Clear green
    data = img.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        # Daha geniş yeşil toleransı: g > 150 ve r < 120 ve b < 120
        if g > 150 and r < 120 and b < 120:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    
    img.save(image_path, "PNG")
    print("Düzeltildi:", image_path)

boss_frames = [
    "assets/zombiler/boss_mekanik.png",
    "assets/zombiler/boss_vampir.png",
    "assets/zombiler/boss_kral.png",
]

# 4 frames for each boss
boss_prefixes = ["zombi_mekanik_walk", "zombi_vampir_walk", "zombi_kral_walk"]
for prefix in boss_prefixes:
    for i in range(1, 5):
        boss_frames.append(f"assets/zombiler/animasyon/{prefix}_{i}.png")

base_dir = "c:/Antigravity_Projects/bahce_savasi/"
for path in boss_frames:
    temizle_ve_cevir(os.path.join(base_dir, path))

print("Tüm görseller temizlendi ve çevrildi!")

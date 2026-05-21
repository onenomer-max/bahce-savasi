import os
from PIL import Image
from collections import deque

def is_background(r, g, b):
    max_diff = 30
    min_light = 100
    if abs(r-g) < max_diff and abs(r-b) < max_diff and abs(g-b) < max_diff:
        if r > min_light and g > min_light and b > min_light:
            return True
    return False

def clean_and_resize(filepath):
    try:
        img = Image.open(filepath).convert("RGBA")
        pixels = img.load()
        w, h = img.size
        
        # Don't process if already 128x128 and transparent? 
        # Just run the background cleaner anyway.
        
        visited = set()
        queue = deque()
        
        for x in range(w):
            queue.append((x, 0))
            queue.append((x, h-1))
        for y in range(h):
            queue.append((0, y))
            queue.append((w-1, y))
            
        changed = 0
        while queue:
            curr = queue.popleft()
            x, y = curr
            if x < 0 or x >= w or y < 0 or y >= h:
                continue
            if curr in visited:
                continue
            visited.add(curr)
            
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
                
            if is_background(r, g, b):
                pixels[x, y] = (0, 0, 0, 0)
                changed += 1
                queue.append((x+1, y))
                queue.append((x-1, y))
                queue.append((x, y+1))
                queue.append((x, y-1))
                queue.append((x+1, y+1))
                queue.append((x-1, y-1))
                queue.append((x+1, y-1))
                queue.append((x-1, y+1))
                
        # Pixel art koruyarak 128x128 boyutuna getir
        img = img.resize((128, 128), Image.Resampling.NEAREST)
        img.save(filepath)
        print(f"[OK] {os.path.basename(filepath)} -> Şeffaflaştırıldı ({changed} piksel) & 128x128 yapıldı.")
    except Exception as e:
        print(f"[HATA] {filepath}: {e}")

folders = [
    "assets/bitkiler",
    "assets/zombiler",
    "assets/mermiler",
    "assets/itemler",
    "assets/efektler"
]

print("Görseller işleniyor, lütfen bekleyin...")
for folder in folders:
    if os.path.exists(folder):
        for filename in os.listdir(folder):
            if filename.endswith(".png"):
                clean_and_resize(os.path.join(folder, filename))

print("Tüm karakter ve eşya görselleri başarıyla temizlendi ve 128x128 yapıldı!")

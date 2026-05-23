# downscale_squash.py
# Squash.png'yi 1024x1024 -> 128x128'e indirir (diğer bitkilerle uyumlu boyut)
# Tek seferlik üretim aracıdır (CLAUDE.md'deki "kök dizindeki Python scriptler" kuralına uyar)

from PIL import Image

KAYNAK = "assets/bitkiler/squash.png"
HEDEF = "assets/bitkiler/squash.png"  # Yerine yaz (üzerine yaz)

img = Image.open(KAYNAK)
img_resized = img.resize((128, 128), Image.LANCZOS)
img_resized.save(HEDEF, "PNG", optimize=True)

print(f"OK: {KAYNAK} -> 128x128 ({Image.open(HEDEF).size})")

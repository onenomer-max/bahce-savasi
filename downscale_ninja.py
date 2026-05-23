import os
from PIL import Image

# Ensure the output directory exists
os.makedirs("assets/cutscene", exist_ok=True)

images = [
    (r"C:\Users\omer\.gemini\antigravity\brain\24c7ee72-7710-4bbf-a44b-b2e94c47c847\ninja_babisko_1_1779545745463.png", "assets/cutscene/ninja_babisko_1.png"),
    (r"C:\Users\omer\.gemini\antigravity\brain\24c7ee72-7710-4bbf-a44b-b2e94c47c847\ninja_babisko_2_1779545757725.png", "assets/cutscene/ninja_babisko_2.png"),
    (r"C:\Users\omer\.gemini\antigravity\brain\24c7ee72-7710-4bbf-a44b-b2e94c47c847\ninja_babisko_3_1779545770635.png", "assets/cutscene/ninja_babisko_3.png"),
    (r"C:\Users\omer\.gemini\antigravity\brain\24c7ee72-7710-4bbf-a44b-b2e94c47c847\ninja_babisko_4_1779545784431.png", "assets/cutscene/ninja_babisko_4.png"),
]

def make_transparent(img, threshold=240):
    img = img.convert("RGBA")
    datas = img.getdata()
    newData = []
    for item in datas:
        # Change white-ish background to transparent
        if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    return img

for src, dst in images:
    if os.path.exists(src):
        img = Image.open(src)
        img = make_transparent(img)
        img_resized = img.resize((128, 128), Image.LANCZOS)
        img_resized.save(dst, "PNG")
        print(f"Processed {dst}")
    else:
        print(f"File not found: {src}")

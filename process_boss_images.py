import os
from PIL import Image
import numpy as np

def remove_green_background(img):
    img = img.convert("RGBA")
    data = np.array(img)
    
    # Define green background range
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    # Match bright green #00FF00 or close
    mask = (r < 50) & (g > 200) & (b < 50)
    data[mask, 3] = 0
    
    return Image.fromarray(data)

def process_static(src_path, dest_path, target_size):
    print(f"Processing static: {src_path} -> {dest_path}")
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        return
        
    img = Image.open(src_path)
    img = remove_green_background(img)
    img = img.resize(target_size, Image.Resampling.NEAREST)
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    img.save(dest_path)

def process_sheet(src_path, dest_prefix, size=128):
    print(f"Processing sheet: {src_path} -> {dest_prefix}_X.png")
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        return
        
    img = Image.open(src_path)
    img = remove_green_background(img)
    
    # It's a 2x2 grid, so width/2 and height/2
    w, h = img.size
    grid_w = w // 2
    grid_h = h // 2
    
    frames = [
        (0, 0, grid_w, grid_h),
        (grid_w, 0, w, grid_h),
        (0, grid_h, grid_w, h),
        (grid_w, grid_h, w, h)
    ]
    
    for i, box in enumerate(frames):
        frame = img.crop(box)
        frame = frame.resize((size, size), Image.Resampling.NEAREST)
        dest_path = f"{dest_prefix}_{i+1}.png"
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        frame.save(dest_path)

brain_dir = r"C:\Users\PC\.gemini\antigravity\brain\ae4fc25b-25f9-47e8-a1c9-bcf252a798ca"
proj_dir = r"c:\Antigravity_Projects\bahce_savasi"

statics = [
    ("boss_mekanik_1779443547334.png", "boss_mekanik.png", (130, 130)),
    ("boss_vampir_1779443560248.png", "boss_vampir.png", (130, 130)),
    ("boss_kral_1779443574344.png", "boss_kral.png", (160, 160))
]

for src_name, dest_name, size in statics:
    src_path = os.path.join(brain_dir, src_name)
    dest_path = os.path.join(proj_dir, "assets", "zombiler", dest_name)
    process_static(src_path, dest_path, size)

sheets = [
    ("boss_mekanik_sheet_1779443587001.png", "zombi_mekanik_walk"),
    ("boss_vampir_sheet_1779443601516.png", "zombi_vampir_walk"),
    ("boss_kral_sheet_1779443616991.png", "zombi_kral_walk")
]

for src_name, dest_prefix in sheets:
    src_path = os.path.join(brain_dir, src_name)
    dest_path_prefix = os.path.join(proj_dir, "assets", "zombiler", "animasyon", dest_prefix)
    process_sheet(src_path, dest_path_prefix)

print("Image processing complete!")

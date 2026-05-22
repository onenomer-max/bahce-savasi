import sys
from PIL import Image
import os

def isle_sprite_sheet(input_path, output_dir, prefix):
    img = Image.open(input_path).convert("RGBA")
    
    sheet_width, sheet_height = img.size
    print(f"[INFO] Orijinal sheet boyutu: {sheet_width}x{sheet_height}")
    
    frame_width = sheet_width // 2
    frame_height = sheet_height // 2
    print(f"[INFO] Hucre boyutu: {frame_width}x{frame_height}")
    
    try:
        data = img.getdata()
    except AttributeError:
        data = list(img.getdata())
    
    new_data = []
    for item in data:
        if item[0] < 100 and item[1] > 150 and item[2] < 100:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    frames_pos = [
        (0, 0, frame_width, frame_height),
        (frame_width, 0, sheet_width, frame_height),
        (0, frame_height, frame_width, sheet_height),
        (frame_width, frame_height, sheet_width, sheet_height),
    ]
    
    target_size = 128
    os.makedirs(output_dir, exist_ok=True)
    
    for i, box in enumerate(frames_pos):
        frame = img.crop(box)
        frame = frame.resize((target_size, target_size), Image.NEAREST)
        output_path = os.path.join(output_dir, f"{prefix}_{i+1}.png")
        frame.save(output_path, "PNG")
        print(f"[OK] Frame {i+1} kaydedildi: {output_path} ({target_size}x{target_size})")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python process_sprite.py <input_path> <output_dir> <prefix>")
        sys.exit(1)
    isle_sprite_sheet(sys.argv[1], sys.argv[2], sys.argv[3])

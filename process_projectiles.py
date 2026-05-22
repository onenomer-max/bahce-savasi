from PIL import Image
import os
import sys

def process_projectile(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    try:
        data = img.getdata()
    except AttributeError:
        data = list(img.getdata())
        
    new_data = []
    for item in data:
        # Green screen removal
        if item[0] < 100 and item[1] > 150 and item[2] < 100:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # We won't resize, just save
    img.save(output_path, "PNG")
    print(f"[OK] Processed and saved: {output_path}")

if __name__ == "__main__":
    files = {
        sys.argv[1]: "c:/Antigravity_Projects/bahce_savasi/assets/mermiler/bezelye_mermi.png",
        sys.argv[2]: "c:/Antigravity_Projects/bahce_savasi/assets/mermiler/kar_bezelye_mermi.png",
        sys.argv[3]: "c:/Antigravity_Projects/bahce_savasi/assets/mermiler/kaktus_dikeni.png",
        sys.argv[4]: "c:/Antigravity_Projects/bahce_savasi/assets/mermiler/patlayan_kavun_mermi.png"
    }
    
    for in_path, out_path in files.items():
        process_projectile(in_path, out_path)

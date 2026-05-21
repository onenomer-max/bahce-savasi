import urllib.request
import urllib.error
import time
import os

files_to_download = {
    # Müzikler
    "assets/sesler/muzik/muzik1_bahce.ogg": "https://opengameart.org/sites/default/files/Juhani_Junkala_Retro_Game_Music_Pack_Title_Screen.ogg",
    "assets/sesler/muzik/muzik2_gulyabani.ogg": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Clash%20Defiant.mp3",
    "assets/sesler/muzik/muzik3_yogunlasma.ogg": "https://opengameart.org/sites/default/files/Juhani_Junkala_Retro_Game_Music_Pack_Level_1.ogg",
    "assets/sesler/muzik/muzik4_nekromant.ogg": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Volatile%20Reaction.mp3",
    
    # Efektler (Kenney paketlerindeki dosyaların temsili linkleri - genelde zip içindedir, o yüzden 404 verecektir)
    "assets/sesler/efektler/click.ogg": "https://kenney.nl/audio/click4.ogg",
    "assets/sesler/efektler/gunes_uret.ogg": "https://kenney.nl/audio/drop_003.ogg",
    "assets/sesler/efektler/gunes_topla.ogg": "https://kenney.nl/audio/powerUp2.ogg",
    "assets/sesler/efektler/ates_et.ogg": "https://kenney.nl/audio/laser4.ogg",
    "assets/sesler/efektler/zombi_olum.ogg": "https://kenney.nl/audio/monster_die.ogg",
    "assets/sesler/efektler/bitki_yenildi.ogg": "https://kenney.nl/audio/error_002.ogg",
    "assets/sesler/efektler/patlama.ogg": "https://kenney.nl/audio/explosion1.ogg",
    "assets/sesler/efektler/yetenek_aktif.ogg": "https://kenney.nl/audio/magic_001.ogg",
    "assets/sesler/efektler/toz_topla.ogg": "https://kenney.nl/audio/chime_001.ogg",
    "assets/sesler/efektler/boss_giris.ogg": "https://kenney.nl/audio/jingle_achievement_00.ogg",
    "assets/sesler/efektler/kazanma.ogg": "https://kenney.nl/audio/jingle_win.ogg",
    "assets/sesler/efektler/kaybetme.ogg": "https://kenney.nl/audio/jingle_lose.ogg"
}

indirme_basarili = 0
eksik_dosyalar = []
toplam_boyut = 0

print("Ses dosyalari indiriliyor...")

for dosya_yolu, url in files_to_download.items():
    baslangic = time.time()
    try:
        # Timeout 5 saniye
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response, open(dosya_yolu, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
            boyut = len(data)
            toplam_boyut += boyut
            indirme_basarili += 1
            print(f"[OK] {dosya_yolu} ({boyut // 1024} KB)")
    except Exception as e:
        print(f"MISSING: {dosya_yolu} (Hata: {e})")
        eksik_dosyalar.append(dosya_yolu)
        
        # Test için dosya bulunamazsa boş bir dosya oluşturarak oyunun çökmesini engelleyelim
        open(dosya_yolu, 'wb').close()

print("-" * 30)
print(f"OZET:")
print(f"Basarili Inen: {indirme_basarili} dosya")
print(f"Eksik: {len(eksik_dosyalar)} dosya")
print(f"Toplam Boyut: {toplam_boyut // 1024 // 1024} MB")

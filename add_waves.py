import random

path = 'c:/Antigravity_Projects/bahce_savasi/data/seviyeler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add "dalga_21" to "dalga_50"
new_waves = []

types_early = ["normal", "koni", "hizli"]
types_mid = ["normal", "koni", "hizli", "kaskli"]
types_late = ["koni", "hizli", "kaskli", "balonlu"]

for i in range(21, 51):
    wave_str = f'  "dalga_{i}": {{\n    zombiler: [\n'
    
    zombies = []
    
    if i == 30:
        zombies.append({"tip": "mekanik_zombi", "gecikme": 3000})
        count = random.randint(4, 6)
        delay = 0
        for j in range(count):
            zombies.append({"tip": random.choice(types_mid), "gecikme": delay})
            delay += random.randint(1000, 2000)
    elif i == 40:
        zombies.append({"tip": "vampir_zombi", "gecikme": 3000})
        count = random.randint(4, 6)
        delay = 0
        for j in range(count):
            zombies.append({"tip": random.choice(types_late), "gecikme": delay})
            delay += random.randint(1000, 2000)
    elif i == 50:
        zombies.append({"tip": "zombi_kral", "gecikme": 4000})
        count = random.randint(4, 6)
        delay = 0
        for j in range(count):
            zombies.append({"tip": random.choice(types_late), "gecikme": delay})
            delay += random.randint(1000, 2000)
    else:
        if 21 <= i <= 29:
            count = random.randint(5, 7)
            t_pool = types_early
            delay_step = (1500, 3000)
        elif 31 <= i <= 39:
            count = random.randint(7, 10)
            t_pool = types_mid
            delay_step = (1000, 2000)
        else: # 41-49
            count = random.randint(10, 15)
            t_pool = types_late
            delay_step = (500, 1500)
            
        delay = 0
        for j in range(count):
            # Biased towards specific types
            if 31 <= i <= 39 and random.random() < 0.6:
                t = random.choice(["hizli", "kaskli"])
            elif 41 <= i <= 49 and random.random() < 0.7:
                t = random.choice(["balonlu", "kaskli"])
            else:
                t = random.choice(t_pool)
                
            zombies.append({"tip": t, "gecikme": delay})
            delay += random.randint(delay_step[0], delay_step[1])
            
    # sort by gecikme
    zombies.sort(key=lambda x: x["gecikme"])
    
    lines = []
    for z in zombies:
        lines.append(f'      {{tip: "{z["tip"]}", gecikme: {z["gecikme"]}}}')
    
    wave_str += ",\n".join(lines)
    wave_str += '\n    ]\n  }'
    new_waves.append(wave_str)

new_waves_str = ",\n".join(new_waves)

start_idx = content.rfind('}')
content = content[:start_idx-1] + ",\n" + new_waves_str + "\n};"

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated seviyeler.js")

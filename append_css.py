css_content = """
/* Ninja Babisko cutscene banner — kırmızı/dramatik */
#ninja-banner {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    background: rgba(0, 0, 0, 0.92);
    color: #FF1744;                  /* Saf kırmızı (boss banner'dan farklı) */
    padding: 24px 48px;
    font-size: 28px;
    font-family: 'Press Start 2P', sans-serif;
    border: 4px solid #FF1744;
    border-radius: 12px;
    box-shadow: 0 0 40px #FF1744;
    z-index: 200;                    /* Boss banner'ın üstünde (z=100) */
    opacity: 0;
    pointer-events: none;
    text-align: center;
    max-width: 80%;
    line-height: 1.4;
    transition: opacity 0.3s, transform 0.3s;
}

#ninja-banner.aktif {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}
"""

with open("css/style.css", "a", encoding="utf-8") as f:
    f.write(css_content)

print("CSS appended.")

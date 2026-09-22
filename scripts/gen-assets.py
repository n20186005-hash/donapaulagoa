#!/usr/bin/env python3
"""Generate brand cover + PWA icons for the Dona Paula View Point Guide.

Outputs (under public/):
  images/hero.jpg      1600x900  brand hero / JSON-LD image
  images/og-cover.jpg  1200x630  social share image
  icons/icon-192.png   192x192    PWA icon (any)
  icons/icon-512.png   512x512    PWA icon (any)
  icons/icon-512-maskable.png 512x512 full-bleed maskable icon

Brand palette mirrors src/styles/global.css. Run from repo root.
"""
from __future__ import annotations
import math
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INK = (7, 46, 51)
SUN = (246, 215, 167)
CORAL = (231, 133, 85)
FOAM = (248, 251, 248)
SLATE = (199, 217, 214)
WHITE = (255, 255, 255)

SERIF = r"C:/Windows/Fonts/georgia.ttf"
SANS = r"C:/Windows/Fonts/arial.ttf"


def font(size: int, serif: bool = True) -> ImageFont.ImageFont:
    path = SERIF if serif else SANS
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def vgradient(w: int, h: int, top, bottom):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        for x in range(w):
            px[x, y] = (r, g, b)
    return img


def draw_sun_wave(d: ImageDraw.ImageDraw, box, sun_color, wave_color):
    """Draw the logo mark (sun + wave) centred inside box=(x0,y0,x1,y1)."""
    x0, y0, x1, y1 = box
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    size = min(x1 - x0, y1 - y0)
    # sun
    sr = size * 0.16
    d.ellipse([cx - sr, cy - sr * 1.9, cx + sr, cy - sr * 0.9], fill=sun_color)
    # wave (filled blob approximating the logo path)
    wpts = []
    steps = 40
    base_y = cy + size * 0.12
    amp = size * 0.12
    for i in range(steps + 1):
        x = x0 + (x1 - x0) * (i / steps)
        y = base_y + amp * math.sin((i / steps) * math.pi * 2.2)
        wpts.append((x, y))
    bottom = [(x1, y1), (x0, y1)]
    d.polygon(wpts + bottom, fill=wave_color)


def cover(w: int, h: int, out_path: str, *, big: bool):
    img = vgradient(w, h, INK, (12, 64, 70))
    d = ImageDraw.Draw(img)
    # sun glow lower-right
    glow = INK[0] + 30, 70, 76
    d.ellipse([w * 0.62, h * 0.30, w * 1.05, h * 0.78], fill=glow)
    d.ellipse([w * 0.74, h * 0.46, w * 0.95, h * 0.67], fill=SUN)
    # waves near bottom
    count = 3
    for k in range(count):
        yoff = h * (0.74 + k * 0.07)
        pts = []
        steps = 60
        amp = h * 0.022
        for i in range(steps + 1):
            x = w * (i / steps)
            y = yoff + amp * math.sin((i / steps) * math.pi * 2) + k * 4
            pts.append((x, y))
        pts += [(w, h), (0, h)]
        d.polygon(pts, fill=(INK[0], INK[1] - k * 3, INK[2] - k * 2))
    # text
    title = "DONA PAULA VIEW POINT"
    sub = "Panaji · Goa · India"
    tf = font(int(h * 0.16), serif=True)
    sf = font(int(h * 0.062), serif=False)
    tbox = d.textbbox((0, 0), title, font=tf, anchor="mm")
    tw = tbox[2] - tbox[0]
    tx = (w - tw) / 2
    ty = h * (0.40 if big else 0.42)
    # soft shadow
    d.text((tx + 3, ty + 3), title, font=tf, anchor="mm", fill=(0, 0, 0))
    d.text((tx, ty), title, font=tf, anchor="mm", fill=FOAM)
    sbox = d.textbbox((0, 0), sub, font=sf, anchor="mm")
    sw = sbox[2] - sbox[0]
    sx = (w - sw) / 2
    sy = ty + h * 0.16
    d.text((sx, sy), sub, font=sf, anchor="mm", fill=SUN)
    img.save(out_path, "JPEG", quality=88)
    print("wrote", out_path)


def icon(size: int, out_path: str, maskable: bool):
    img = Image.new("RGB", (size, size), INK)
    d = ImageDraw.Draw(img)
    if maskable:
        # full-bleed background, content within central 80% safe zone
        m = size * 0.12
        box = (m, m, size - m, size - m)
        coralfill = CORAL
    else:
        m = size * 0.20
        box = (m, m * 0.6, size - m, size - m * 0.9)
        coralfill = CORAL
    draw_sun_wave(d, box, SUN, coralfill)
    img.save(out_path, "PNG")
    print("wrote", out_path)


def main():
    pub = os.path.join(ROOT, "public")
    img_dir = os.path.join(pub, "images")
    ico_dir = os.path.join(pub, "icons")
    os.makedirs(img_dir, exist_ok=True)
    os.makedirs(ico_dir, exist_ok=True)
    cover(1600, 900, os.path.join(img_dir, "hero.jpg"), big=True)
    cover(1200, 630, os.path.join(img_dir, "og-cover.jpg"), big=False)
    icon(192, os.path.join(ico_dir, "icon-192.png"), maskable=False)
    icon(512, os.path.join(ico_dir, "icon-512.png"), maskable=False)
    icon(512, os.path.join(ico_dir, "icon-512-maskable.png"), maskable=True)


if __name__ == "__main__":
    main()

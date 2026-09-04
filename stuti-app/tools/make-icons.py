#!/usr/bin/env python3
"""Regenerate the app icons from the kalasha brand mark.

Source: design_handoff_stuti/app/assets/kalasha.png (square, transparent).
Writes the PWA icons (public/icons/) and the 1024-px sources
(stuti-app/assets/) that @capacitor/assets turns into every Android
launcher density + the splash. To swap the mark, replace the source (or
point SRC elsewhere), then from the repo root:

  python3 -m venv /tmp/stuti-venv && /tmp/stuti-venv/bin/pip install pillow
  /tmp/stuti-venv/bin/python stuti-app/tools/make-icons.py
  cd stuti-app && npx --yes @capacitor/assets generate --android \
      --iconBackgroundColor '#faf6ee' --iconBackgroundColorDark '#faf6ee' \
      --splashBackgroundColor '#faf6ee' --splashBackgroundColorDark '#faf6ee'

The maskable icon and the Android foreground are inset to 66% so
Android's circular crop keeps the leaves; cream is the app's --bg.
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
SRC = os.path.join(ROOT, "design_handoff_stuti", "app", "assets", "kalasha.png")
PWA = os.path.join(ROOT, "stuti-app", "public", "icons")
AND = os.path.join(ROOT, "stuti-app", "assets")
CREAM = (250, 246, 238, 255)  # #faf6ee


def fit(img, size, scale):
    m = int(size * scale)
    r = img.resize((m, m), Image.LANCZOS)
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    c.paste(r, ((size - m) // 2, (size - m) // 2), r)
    return c


def on_cream(img):
    bg = Image.new("RGBA", img.size, CREAM)
    bg.alpha_composite(img)
    return bg.convert("RGB")


src = Image.open(SRC).convert("RGBA")
os.makedirs(PWA, exist_ok=True)
os.makedirs(AND, exist_ok=True)

fit(src, 192, 0.92).save(os.path.join(PWA, "icon-192.png"))
fit(src, 512, 0.92).save(os.path.join(PWA, "icon-512.png"))
on_cream(fit(src, 512, 0.66)).save(os.path.join(PWA, "icon-512-maskable.png"))

fit(src, 1024, 0.92).save(os.path.join(AND, "icon-only.png"))
fit(src, 1024, 0.66).save(os.path.join(AND, "icon-foreground.png"))
Image.new("RGB", (1024, 1024), CREAM[:3]).save(os.path.join(AND, "icon-background.png"))
on_cream(fit(src, 2732, 0.30)).save(os.path.join(AND, "splash.png"))

print("icons written to", PWA, "and", AND)

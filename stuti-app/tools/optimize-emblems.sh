#!/bin/bash
# Shrinks the emblem PNGs in public/emblems for the app build. The designer's
# exports are 1200px+ illustrations shown as ~300px tiles; the app carries a
# 720px copy with the palette reduced. Re-run after a design export lands.
set -e
cd "$(dirname "$0")/../public/emblems"
for f in *-inkday.png *-inknight.png; do
  magick "$f" -resize 720x720\> -strip -colors 255 -define png:compression-level=9 "$f.tmp.png" && mv "$f.tmp.png" "$f"
done
for f in *-portrait*.png; do
  magick "$f" -resize 720x720\> -strip -colors 255 -dither FloydSteinberg -define png:compression-level=9 "$f.tmp.png" && mv "$f.tmp.png" "$f"
done
for f in *-face*.png; do
  magick "$f" -resize 512x512\> -strip -define png:compression-level=9 "$f.tmp.png" && mv "$f.tmp.png" "$f"
done
du -sh .
# the parva cards: the same treatment for the illustrations in assets/
cd ../assets
for f in parva-*.png; do
  magick "$f" -resize 720x720\> -strip -colors 255 -define png:compression-level=9 "$f.tmp.png" && mv "$f.tmp.png" "$f"
done
du -sh .

#!/usr/bin/env python3
"""Crop one line of a printed page at high resolution, to settle a doubtful reading.

Reading a whole page at 190 dpi is enough to transcribe from and not always
enough to decide a broken conjunct. This renders one PDF page at 400 dpi, finds
the bands of text by row darkness, and writes each band out as its own image,
enlarged. Look at the band the verse is on.

A repha is the usual difficulty: र् is drawn as a hook ABOVE the cluster that
follows it, so दार्ढ्य looks like दा + ḍhya-with-a-hook and is easily written
down as दाढ्यार्. Check where the hook sits before deciding.

    python3 zoom.py 7                # every band on PDF page 7
    python3 zoom.py 7 --band 1       # just that band, bigger
"""
import argparse, subprocess, sys, tempfile
from pathlib import Path

CACHE = Path(__file__).resolve().parents[1] / 'cache' / 'gurucaritra'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('page', type=int, help='PDF page number')
    ap.add_argument('--band', type=int, default=None)
    ap.add_argument('--dpi', type=int, default=400)
    ap.add_argument('--out', default='/tmp/zoom')
    a = ap.parse_args()

    try:
        from PIL import Image
        import numpy as np
    except ImportError:
        sys.exit('zoom: needs Pillow and numpy')

    with tempfile.TemporaryDirectory() as td:
        subprocess.run(['pdftoppm', '-r', str(a.dpi), '-f', str(a.page),
                        '-l', str(a.page), '-png', str(CACHE / 'dwi.pdf'),
                        f'{td}/p'], check=True)
        src = next(Path(td).glob('p-*.png'))
        im = Image.open(src)
        g = np.array(im.convert('L'))
        dark = (g < 128).sum(axis=1)
        bands, inb, start = [], False, 0
        for y, v in enumerate(dark):
            if v > 20 and not inb:
                start, inb = y, True
            elif v <= 20 and inb:
                if y - start > 25:
                    bands.append((start, y))
                inb = False
        if not bands:
            sys.exit('zoom: no text found on that page')
        want = [a.band] if a.band is not None else range(len(bands))
        for i in want:
            if i >= len(bands):
                continue
            s, e = bands[i]
            pad = 12
            c = im.crop((0, max(0, s - pad), im.width, min(im.height, e + pad)))
            k = 2 if a.band is not None else 1
            if k > 1:
                c = c.resize((c.width * k, c.height * k), Image.LANCZOS)
            out = f'{a.out}_p{a.page}_b{i}.png'
            c.save(out)
            print(f'band {i}: rows {s}-{e} -> {out}')


if __name__ == '__main__':
    main()

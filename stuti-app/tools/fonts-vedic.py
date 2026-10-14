#!/usr/bin/env python3
"""Build the two accented-Vedic faces the reader uses.

    python3 -m venv .venv && .venv/bin/pip install 'fonttools[woff]' brotli
    .venv/bin/python tools/fonts-vedic.py

Reads the pristine upstream fonts in src/fonts/ and writes:

    Krishna-Vedic.woff2     Krishna Sanskrit, above-marks raised, tone marks coloured
    TiroTelugu-Vedic.woff2  Tiro Telugu, tone marks coloured (positions untouched)

Both upstream fonts are SIL OFL 1.1 and neither declares a Reserved Font Name, so
modification and redistribution are permitted; their OFL.txt files sit beside them
and must stay there. Our builds carry their own family names so they cannot be
mistaken for the upstream originals.

WHY THE COLOUR IS IN THE FONT.  A combining mark is painted with its base run's
colour: wrapping the mark alone in a span does not recolour it (tested -- the mark
stays ink). Wrapping the whole akshara tints the letter too, which is what made the
accent read as a vowel sign. COLR/CPAL puts the colour on the glyph instead, so the
reader emits plain text and every consumer -- print, the share card, the karaoke
highlight, night mode, selection -- keeps working untouched. The colours themselves
stay in stuti.css via @font-palette-values override-colors; the font only says which
glyph takes which palette slot.

WHY THE DEVANAGARI MARKS ARE RAISED.  In Krishna Sanskrit the headline sits at
y=1325, the e-matra runs 1377..1905 and the udatta runs 1370..2058 -- the accent
begins seven units from where the vowel sign begins, in the same band. So केन॑ reads
as केने and करा॑म as करोम. Every candidate face measured the same way overlaps
(Chandas -110 was the best of seven, Tiro -239, Krishna -261); none separates them,
because above the headline is simply where Devanagari puts everything. Lifting the
above-marks 400 units clears the matra zone. 550 was clearer still and is the limit:
beyond that the mark drifts off the syllable it belongs to.

TELUGU IS NOT RAISED, DELIBERATELY.  Telugu's vowel signs are curls, not vertical
strokes, so there is nothing for the accent to be confused with. And where a syllable
ends in the sunna, the printed tradition puts BOTH marks on the sunna itself --
verified at 8x on the 600 dpi scan of Samula Srimadandhra Rigveda Samhita (1981),
archive.org samulasrimadandh015268mbp, in हयं / హ్యంచ్చా. Our rendering matches the
print. Do not shift the Telugu mark left to imitate Devanagari.
"""
import sys
import unicodedata
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.colorLib.builder import buildCOLR, buildCPAL

HERE = Path(__file__).resolve().parent
FONTS = HERE.parent / "src" / "fonts"

# Palette slots. The actual colours live in stuti.css (@font-palette-values
# override-colors); these defaults only matter where font-palette is unsupported,
# so they are the day values -- the worst case is day colours at night.
SLOT_ABOVE, SLOT_BELOW, SLOT_DOUBLE = 0, 1, 2
DAY = [(0.753, 0.224, 0.169, 1.0),   # sindura  #C0392B  mark above
       (0.157, 0.227, 0.400, 1.0),   # nila     #283A66  mark below
       (0.420, 0.247, 0.627, 1.0)]   # draksa   #6B3FA0  double svarita
NIGHT = [(0.937, 0.463, 0.408, 1.0),
         (0.592, 0.651, 0.800, 1.0),
         (0.729, 0.580, 0.878, 1.0)]

# A tone mark is a combining mark in one of the two attached classes a tone mark
# actually uses -- 220 below, 230 above. Taking the class from Unicode rather than
# listing ranges matters twice: U+1CEA VEDIC SIGN ANUSVARA BAHIRGOMUKHA sits in the
# Vedic Extensions block but is category Lo, a letter, and the virama and nukta are
# combining marks that stand before a spacing sign quite legitimately.
TONE = [cp for cp in range(0x0900, 0xA900)
        if unicodedata.combining(chr(cp)) in (220, 230)
        and (0x0900 <= cp <= 0x097F or 0x1CD0 <= cp <= 0x1CFF or 0xA8E0 <= cp <= 0xA8FF)]

BELOW = {cp for cp in TONE if unicodedata.combining(chr(cp)) == 220}
DOUBLE = {0x1CDA, 0x1CDB}
RAISE_DEVA = 400


def slot(cp):
    if cp in DOUBLE:
        return SLOT_DOUBLE
    return SLOT_BELOW if cp in BELOW else SLOT_ABOVE


def raise_above_marks(font, amount):
    """Lift the above-marks clear of the vowel-sign band."""
    cmap, glyf = font.getBestCmap(), font["glyf"]
    moved = 0
    for cp in TONE:
        if cp in BELOW:
            continue
        g = cmap.get(cp)
        if not g or g not in glyf:
            continue
        gl = glyf[g]
        if gl.numberOfContours == 0:
            continue
        if gl.isComposite():
            for c in gl.components:
                c.y += amount
        else:
            co = gl.coordinates
            for i in range(len(co)):
                x, y = co[i]
                co[i] = (x, y + amount)
        gl.recalcBounds(glyf)
        moved += 1
    return moved


def colour_tone_marks(font):
    """Give each tone-mark glyph its own palette slot."""
    cmap = font.getBestCmap()
    layers = {}
    for cp in TONE:
        g = cmap.get(cp)
        if g:
            layers[g] = [(g, slot(cp))]
    if not layers:
        sys.exit("no tone-mark glyphs found")
    font["COLR"] = buildCOLR(layers, version=0)
    font["CPAL"] = buildCPAL([DAY, NIGHT])
    return len(layers)


def build(src_name, out_name, raise_by=0):
    src = FONTS / src_name
    if not src.exists():
        sys.exit(f"missing upstream font: {src}")
    font = TTFont(src)
    moved = raise_above_marks(font, raise_by) if raise_by else 0
    n = colour_tone_marks(font)
    font.flavor = "woff2"
    font.save(FONTS / out_name)
    note = f", {moved} above-marks raised {raise_by}" if raise_by else ""
    print(f"{out_name}: {n} tone marks coloured{note}")


if __name__ == "__main__":
    build("KrishnaSanskrit-Regular.woff2", "Krishna-Vedic.woff2", RAISE_DEVA)
    # Telugu: colour only. See the module docstring -- the print puts the mark on
    # the sunna, and we match it.
    build("TiroTelugu-Upstream.woff2", "TiroTelugu-Vedic.woff2")

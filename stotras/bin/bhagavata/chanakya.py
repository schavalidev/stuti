#!/usr/bin/env python3
"""Chanakya (Gītā Press 8-bit typesetting font) → Unicode Devanāgarī.

Built 1 Oct 2026 (S60) for the Gītā Press Śrīmad Bhāgavata, codes 26 and 27, whose PDFs carry
the typesetter's own text layer in this encoding. The Sundarkāṇḍ decoder of 8 Sep 2026 was never
saved; this one is, and it was calibrated against GRETIL's Bhāgavata, not written from memory.

How the font works, in brief:
  * Letters with a vertical stem are drawn as a half-form plus a stem glyph. `Ê` after a half-form
    is that stem (ण् + Ê = ण); after a full letter it is the ā-mātrā. `U`, `§` and `Ô` are stem
    and spacing glyphs that carry no letter of their own and are dropped.
  * `Á` (ि) is typeset before its cluster, `¸` (reph) after it. Both are moved to logical order.
    `Ì` is ि and reph together, `Ï` is ि, reph and anusvāra, `®` is ि and anusvāra, `Z` is reph
    and anusvāra — each is expanded and then moved like its parts.
  * ASCII letters are ligatures, not Latin (`h` = द्ध, `l` = द्य, `r` = ह्म, `K` = ्य). Anything the
    table does not know is emitted as ⟦c⟧, never passed through, so an unknown glyph is visible.

Usage:  decode(text) -> str
"""
import re

VIRAMA = '्'

# Half-forms: alone they are the dead consonant; followed by the stem `Ê` they are the full letter.
HALF = {
    'Ä': 'क', 'Å': 'ख', 'Ç': 'ग', 'É': 'घ', 'æ': 'ङ', 'ë': 'च', 'ì': 'च्च', 'Ö': 'ज', 'î': 'ज्ज',
    '¤': 'झ', 'Ü': 'ञ', 'á': 'ण', 'à': 'त', 'û': 'त्त', 'ò': 'त्र', 'â': 'थ', 'ä': 'ध', 'ã': 'न',
    'å': 'प', 'é': 'ब', 'è': 'भ', 'ê': 'म', 'ƒ': 'य', 'À': 'ल', '√': 'व', '‡': 'श', 'ü': 'श्र',
    'c': 'ष', 'S': 'स', 'ˇ': 'क्ष', 'ô': 'ज्ञ', 'r': 'ह्म', '±': 'ह',
}

# Everything else, longest sequences first.
MULTI = [
    ('∞', 'ऐ'), ('ß¸', 'ई'), ('©U', 'उ'), ('™§', 'ऊ'), ('´§', 'ऋ'),
    ('«∏', 'ड़'), ('…∏', 'ढ़'), ('ÎÎ', 'ॄ'),
]
SINGLE = {
    # full consonants
    '∑': 'क', 'π': 'ख', 'ª': 'ग', 'ø': 'च', '¿': 'छ', '¡': 'ज', '≈': 'ट', '∆': 'ठ', '«': 'ड',
    '…': 'ढ', 'Ã': 'त', 'Õ': 'थ', 'Œ': 'द', 'º': 'द', 'œ': 'ध', 'Ÿ': 'न', '¬': 'प', '»': 'फ', '’': 'ब',
    '÷': 'भ', '◊': 'म', 'ÿ': 'य', '⁄': 'र', '‹': 'ल', 'ﬂ': 'व', '·': 'ष', '‚': 'स', '„': 'ह',
    # ligatures
    'h': 'द्ध', 'l': 'द्य', 'j': 'द्भ', 'g': 'द्द', 'i': 'द्ब', 'k': 'द्म', 'm': 'द्व', 'µ': 'द्ब्र',
    'u': 'ह्व', 's': 'ह्य', 'q': 'ह्न', 't': 'ह्ल', 'O': 'ह्र', 'ˆ': 'ह्ण', 'N': 'हृ',
    'L': 'रु', 'M': 'रू', 'Q': 'क्त', 'P': 'क्क', 'V': 'ङ्क', 'X': 'ङ्ग', 'W': 'ङ्ख', 'Y': 'ङ्घ',
    '@': 'ञ्च', 'T': 'ञ्ज', '^': 'ट्ट', 'C': 'ष्ट', 'D': 'ष्ठ', 'd': 'स्र', 'F': 'स्न',
    'K': '्य', '˝': '्र', '˛': '्र', 'A': '्न',
    'o': 'श',
    # vowels
    '•': 'अ', 'ß': 'इ', '∞': 'ए',
    # mātrās and signs
    'Ê': 'ा', 'Ë': 'ी', 'È': 'ु', 'Í': 'ू', 'Î': 'ृ', '': 'े', 'Ò': 'ै', 'Ù': 'ो', 'ı': 'ौ',
    '‰': 'ु', '´': 'ऋ',
    '¢': 'ं', '¥': 'ं', '°': 'ँ', '—': 'ः', '˜': '्', '˘': 'ऽ', '∏': '़',
    '–': '।', 'H': '॥', 'ó': '—', '˙': 'ॐ',
    # silent stems and spacers
    'U': '', '§': '', 'Ô': '',
    # punctuation that is itself
    ' ': ' ', '\n': '\n', ',': ',', '.': '.', '!': '!', '?': '?', ';': ';', '-': '-', '(': '(',
    ')': ')', '[': '[', ']': ']', '“': '“', '”': '”', '*': '*', '/': '/', ':': ':', "'": "'",
}
DIGITS = str.maketrans('0123456789', '०१२३४५६७८९')

# Positional markers used between the substitution pass and the reordering pass.
I_PRE, IR_PRE, IRM_PRE, IM_PRE, REPH, REPH_M = '\x01', '\x02', '\x03', '\x04', '\x05', '\x06'
PRE = {'Á': I_PRE, 'Ì': IR_PRE, 'Ï': IRM_PRE, '®': IM_PRE}
POST = {'¸': REPH, 'Z': REPH_M}

CONS = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह'
MATRA = 'ािीुूृॄेैोौंँः'


HALF_RE = '[' + re.escape(''.join(HALF)) + ']'


def _prepass(s):
    # `Á¢` together is a wide ि-hook, not ि + anusvāra (वंचितो, अङ्गिरसौ, लिंगिनो — GRETIL agrees).
    # But ि + half-forms + `¢` is a real anusvāra set over the hook: तस्मिंस्, ग्रन्थिं, त्रिंशद्.
    s = re.sub('Á(' + HALF_RE + '+)[ ]?¢', r'®\1', s)
    s = s.replace('Á¢', 'Á')
    return s


def _subst(s):
    s = _prepass(s)
    out, i, n = [], 0, len(s)
    while i < n:
        for a, b in MULTI:
            if s.startswith(a, i):
                out.append(b); i += len(a); break
        else:
            c = s[i]
            if c in HALF:
                # a half-form takes the next stem `Ê` (skipping silent glyphs) as its completion
                j = i + 1
                while j < n and s[j] in 'U§Ô':
                    j += 1
                if j < n and s[j] == 'Ê':
                    out.append(HALF[c]); i = j + 1
                elif j < n and s[j] == 'Ù':
                    # after a half-form, `Ù` is the stem with the e-mātrā on it (शे, णे, ज्ञे),
                    # not ो — confirmed against GRETIL on 729 places in volume 1
                    out.append(HALF[c] + 'े'); i = j + 1
                elif j < n and s[j] == '˜':
                    # an explicit virāma after a half-form adds nothing (ङ् + ् is still ङ्)
                    out.append(HALF[c] + VIRAMA); i = j + 1
                else:
                    out.append(HALF[c] + VIRAMA); i += 1
            elif c in PRE:
                out.append(PRE[c]); i += 1
            elif c in POST:
                out.append(POST[c]); i += 1
            elif c in SINGLE:
                out.append(SINGLE[c]); i += 1
            elif c.isdigit():
                out.append(c.translate(DIGITS)); i += 1
            else:
                out.append('⟦%s⟧' % c); i += 1
    return ''.join(out)


def _cluster_end(s, k):
    """Index just past the consonant cluster that starts at k (C, then any ्C, with nukta)."""
    n = len(s)
    if k >= n or s[k] not in CONS:
        return k
    j = k + 1
    while True:
        if j < n and s[j] == '़':
            j += 1
        if j + 1 < n and s[j] == VIRAMA and s[j + 1] in CONS:
            j += 2
            continue
        break
    return j


def _cluster_start(s, k):
    """Index of the first consonant of the cluster that ends at k (inclusive of s[k])."""
    j = k
    while j >= 2 and s[j - 1] == VIRAMA and s[j - 2] in CONS:
        j -= 2
    return j


def _reorder(s):
    s = list(s)
    # 1. reph after its cluster → र् before it. Must run before the i-mātrā pass.
    k = 0
    while k < len(s):
        if s[k] in (REPH, REPH_M):
            m = s[k]
            del s[k]
            j = k - 1
            tail = []
            while j >= 0 and s[j] in MATRA + '़':
                j -= 1
            if j >= 0 and s[j] in CONS:
                st = _cluster_start(s, j)
                s[st:st] = ['र', VIRAMA]
                k += 2
            elif j >= 0 and s[j] in 'अआइईउऊऋएऐओऔ':
                # reph over an initial vowel: निर्ऋति, कर्णयोर्ऋषिः
                s[j:j] = ['र', VIRAMA]
                k += 2
            if m == REPH_M:
                s.insert(k, 'ं'); k += 1
            continue
        k += 1
    # 2. pre-positioned ि (alone or with reph / anusvāra) → after its cluster
    k = 0
    while k < len(s):
        m = s[k]
        if m in (I_PRE, IR_PRE, IRM_PRE, IM_PRE):
            del s[k]
            e = _cluster_end(''.join(s), k)
            add = ['ि'] + (['ं'] if m in (IRM_PRE, IM_PRE) else [])
            s[e:e] = add
            if m in (IR_PRE, IRM_PRE):
                s[k:k] = ['र', VIRAMA]
                e += 2
            k = e + len(add)
            continue
        k += 1
    return ''.join(s)


def decode(text):
    s = _subst(text).replace('ं्र', '्रं')      # भ्रंश is set भ + ं + ्र
    s = _reorder(s)
    s = s.replace('ंु', 'ुं').replace('ंू', 'ूं')
    # independent vowels written as अ + mātrā
    s = s.replace('ाे', 'ो').replace('ाै', 'ौ')
    s = s.replace('अा', 'आ').replace('अो', 'ओ').replace('अौ', 'औ')
    return s


if __name__ == '__main__':
    import sys
    print(decode(sys.stdin.read()))

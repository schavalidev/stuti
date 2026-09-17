# -*- coding: utf-8 -*-
"""Corrections found by reading every verse line of the Paurāṇika builds (2026-09-17).

Each entry is applied to a built unit, identified by its unit number in the Vedic source file.
('DROP',) removes the unit. Otherwise (field, pattern, replacement): the pattern is a regular
expression and must match at least once, or the build stops. Nothing here adds a word of Sanskrit;
every edit only removes text.
"""
import re

HEAD = [  # "recitation of hymns and sūktas" becomes "recitation of hymns" once the sūktas are gone
 ('deva', r'स्तोत्र[-/]सूक्त पठनम्', 'स्तोत्र पठनम्'), ('iast', r'stotra[-/]sūkta paṭhanam', 'stotra paṭhanam'),
 ('tel', r'స్తోత్ర[-/]సూక్త పఠనం', 'స్తోత్ర పఠనం'),
]
INCIPIT = [('en', r'(?i)^\([^)]*puruṣa ?sūkta[^)]*\)\s*', ''), ('tel', r'^\([^)]*పురుషసూక్త[^)]*\)\s*', ''), ('hi', r'^\([^)]*पुरुषसूक्त[^)]*\)\s*', '')]
POST_EDITS = {
 '14_vinayaka_chaviti_vrata': {
   9: [('en', r'Oṁ, to Keśava, svāhā; to Nārāyaṇa, svāhā; to Mādhava, svāhā', 'Oṁ, salutation to Keśava; to Nārāyaṇa; to Mādhava')],
   19: [('deva', r'इत्याद्येन ', ''), ('iast', r'ityādyena ', ''),
        ('en', r'(breath\.) O Anumati.*?welfare\. (Having performed the installation of the breath) with this and what follows,', r'\1 \2,'),
        ('tel', r'(చేస్తాను\.) .*?ఇవి మొదలైనవాటితో ', r'\1 '), ('hi', r'(करूँगा।) .*?इत्यादि से ', r'\1 ')],
   23: INCIPIT,
   24: INCIPIT,
   25: INCIPIT,
   26: INCIPIT,
   28: INCIPIT,
   30: INCIPIT,
   31: INCIPIT,
   54: [('en', r'^With the sacrifice.*?abide\. ', ''), ('tel', r'^యజ్ఞముచేత.*?ఉన్నారో\. ', ''), ('hi', r'^यज्ञ से देवताओं.*?करते हैं। ', '')]},
 '04_ganapati_nitya_puja': {56: HEAD + [
   ('deva', r'गणपति अथर्वशीर्षम् । ', ''), ('iast', r'gaṇapati atharvaśīrṣam \| ', ''),
   ('en', r'Recitation of hymns and sūktas — the Gaṇapati Atharvaśīrṣa; ', 'Recitation of hymns — '),
   ('tel', r'గణపతి అథర్వశీర్షం; ', ''), ('hi', r'स्तोत्र-सूक्त पाठ — गणपति अथर्वशीर्ष; ', 'स्तोत्र पाठ — ')]},
 '05_shiva_nitya_puja': {57: HEAD + [
   ('deva', r'श्री रुद्रं नमकम् । ', ''), ('iast', r'śrī rudraṁ namakam \| ', ''),
   ('en', r'Recitation of hymns and sūktas — the Śrī Rudram, the Namakam; ', 'Recitation of hymns — '),
   ('tel', r'శ్రీ రుద్రం నమకం; ', ''), ('hi', r'स्तोत्र-सूक्त पाठ — श्री रुद्रं नमकम्; ', 'स्तोत्र पाठ — ')]},
 '06_vishnu_nitya_puja': {55: HEAD + [
   ('deva', r'पुरुष सूक्तम् । नारायण सूक्तम् । ', ''), ('iast', r'puruṣa sūktam \| nārāyaṇa sūktam \| ', ''),
   ('en', r'Recitation of hymns and sūktas — the Puruṣasūkta; the Nārāyaṇasūkta; ', 'Recitation of hymns — '),
   ('tel', r'పురుష సూక్తం; నారాయణ సూక్తం; ', ''), ('hi', r'स्तोत्र-सूक्त पाठ — पुरुष सूक्तम्; नारायण सूक्तम्; ', 'स्तोत्र पाठ — ')]},
 '13_navagraha_nitya_puja': {55: HEAD + [
   ('deva', r'नवग्रह सूक्तम् । ', ''), ('iast', r'navagraha sūktam \| ', ''),
   ('en', r'The recitation of the stotras and the sūkta — the Navagraha Stotra; the Navagraha Sūkta; ', 'The recitation of the stotras — the Navagraha Stotra; '),
   ('tel', r'నవగ్రహ సూక్తం; ', ''), ('hi', r'स्तोत्र/सूक्त पठन — नवग्रह स्तोत्र; नवग्रह सूक्त; ', 'स्तोत्र पठन — नवग्रह स्तोत्र; ')]},
 '11_surya_nitya_puja': {53: [
   ('deva', r'^उद्यन्नद्य विवस्वानारोहन्नुत्तरां दिवम् ।\nदेवः हृद्रोगं मम सूर्यो हरिमाणं चाशु नाशयतु ॥\n', ''),
   ('iast', r'^udyannadya[^\n]*\n[^\n]*nāśayatu \|\|\n', ''),
   ('en', r'^Rising today.*?pallor\. ', ''), ('tel', r'^ఈనాడు.*?నశింపజేయుగాక\. ', ''), ('hi', r'^आज उदय.*?नष्ट करें। ', '')]},
 '15_mahaganapati_shodashopachara_puja': {13: [
   ('deva', r'\n\( श्रीगणपत्यथर्वशीर्षोपनिषत् पश्यतु ॥ \)', ''), ('iast', r'\n\( śrīgaṇapatyatharvaśīrṣopaniṣat paśyatu \|\| \)', ''),
   ('en', r' \(See the Gaṇapati Atharvaśīrṣa Upaniṣad\.\)', ''), ('tel', r'\s*\(శ్రీ గణపతి అథర్వశీర్షోపనిషత్[^)]*\)', ''),
   ('hi', r' \(श्रीगणपति अथर्वशीर्ष उपनिषद् देखिए।\)', '')]},
 '17_shiva_shodashopachara_puja': {
   1: [('deva', r'\nलघुन्यासम् पश्यतु ॥', ''), ('iast', r'\nlaghunyāsam paśyatu \|\|', ''),
       ('en', r' See the short nyāsa\.', ''), ('tel', r' లఘున్యాసమును చూడుము\.', ''), ('hi', r' लघुन्यास देखिए।', '')],
   17: [('deva', r'^रुद्रप्रश्नः – नमकम् पश्यतु ॥\nरुद्रप्रश्नः – चमकम् पश्यतु ॥\nपुरुष सूक्तम् पश्यतु ॥\nश्री सूक्तम् पश्यतु ॥\n', ''),
        ('iast', r'^rudrapraśnaḥ – namakam paśyatu \|\|\nrudrapraśnaḥ – camakam paśyatu \|\|\npuruṣa sūktam paśyatu \|\|\nśrī sūktam paśyatu \|\|\n', ''),
        ('en', r'^The question to Rudra — see the Namakam\. The question to Rudra — see the Camakam\. See the Puruṣa Sūkta\. See the Śrī Sūkta\. ', ''),
        ('tel', r'^రుద్రప్రశ్నః — నమకమును చూడుము\. రుద్రప్రశ్నః — చమకమును చూడుము\. పురుష సూక్తమును చూడుము\. శ్రీ సూక్తమును చూడుము\. ', ''),
        ('hi', r'^रुद्रप्रश्नः — नमकम् देखिए। रुद्रप्रश्नः — चमकम् देखिए। पुरुष सूक्त देखिए। श्री सूक्त देखिए। ', '')],
   37: [('DROP',)],
   43: [('deva', r'अनया सद्योजात विधिना ', 'अनया '), ('iast', r'anayā sadyojāta vidhinā ', 'anayā '),
        ('en', r', performed according to the rule of Sadyojāta,', ','), ('tel', r'ఈ సద్యోజాత విధిచే ', 'ఈ '), ('hi', r'इस सद्योजात विधि से, ', 'इस ')]},
 '18_mahalakshmi_visesha_shodashopachara_puja': {44: [
   ('deva', r'श्रीसूक्त विधान पूर्वक ', ''), ('iast', r'śrīsūkta vidhāna pūrvaka ', ''),
   ('en', r' and preceded by the rule of the Śrī Sūkta', ''), ('tel', r'శ్రీ ?సూక్త ?విధాన ?పూర్వక\S* ', ''), ('hi', r'श्री ?सूक्त ?विधान ?पूर्वक ', '')]},
 '19_durga_shodashopachara_puja': {42: [
   ('deva', r'श्रीसूक्त विधानेन ', ''), ('iast', r'śrīsūkta vidhānena ', ''),
   ('en', r', according to the rule of the Śrī Sūkta,', ','), ('tel', r'ఈ శ్రీసూక్త విధానముచే ', 'ఈ '), ('hi', r'इस श्रीसूक्त विधान से ', 'इस ')]},
 '22_surya_shodashopachara_puja': {
   30: [('deva', r'\nउद्यन्नद्यविवस्वानारोहन्नुत्तरां दिवं देवः ।\nहृद्रोगं मम सूर्यो हरिमाणं चाऽऽशु नाशयतु ॥', ''),
        ('iast', r'\nudyannadyavivasvān[^\n]*\n[^\n]*nāśayatu \|\|', ''),
        ('en', r' The god Vivasvān.*?of my body\.', ''), ('tel', r' నేడు ఉదయించుచు.*?నశింపజేయుగాక\.', ''), ('hi', r' आज उदय होते.*?नष्ट करें।', '')],
   35: [('deva', r'पुरुषसूक्त विधान पूर्वक ', ''), ('iast', r'puruṣasūkta vidhāna pūrvaka ', ''),
        ('en', r' and preceded by the rule of the Puruṣa Sūkta', ''), ('tel', r'పురుషసూక్త విధాన పూర్వక\S* ', ''), ('hi', r'पुरुषसूक्त विधान पूर्वक ', '')]},
 '24_anaghashtami_vrata_kalpam': {53: [
   ('deva', r'^यत्र पूर्वे साध्यास्संति देवाः ॥\n', ''), ('iast', r'^yatra pūrve sādhyāssaṁti devāḥ \|\|\n', ''),
   ('en', r'^By sacrifice.*?the gods\. ', ''), ('tel', r'^యజ్ఞంతో.*?పొందుతారు\. ', ''), ('hi', r'^यज्ञ से देवों.*?देव हैं। ', '')]},
 '02_kedareswara_vrata_kalpam': {4: [
   ('deva', r'^ओं गौरीर्मिमाय[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\(ऋ\.१\.१६१\.४१\)\n', ''),
   ('iast', r'^oṁ gaurīrmimāya[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\(ṛ\.1\.161\.41\)\n', ''),
   ('en', r'^[^\n]*\n', ''), ('tel', r'^[^\n]*\n', ''), ('hi', r'^[^\n]*\n', '')]},
}

def apply_post_edits(stem, out, log):
    plan = POST_EDITS.get(stem, {})
    seen = set(); kept = []
    for u in out:
        edits = plan.get(u['n'])
        if not edits:
            kept.append(u); continue
        seen.add(u['n'])
        if edits[0] == ('DROP',):
            log.append(f"{u['n']}: dropped on reading — Vedic"); continue
        for fld, pat, rep in edits:
            new, k = re.subn(pat, rep, u.get(fld, ''), flags=re.S | re.M)
            if not k:
                raise SystemExit(f"post-edit did not match: {stem} unit {u['n']} {fld}: {pat[:60]}")
            u[fld] = new.strip()
        log.append(f"{u['n']}: Vedic text removed on reading")
        kept.append(u)
    missing = set(plan) - seen
    if missing: raise SystemExit(f"post-edit units not found in {stem}: {sorted(missing)}")
    return apply_global(kept)


# Dangling references found by the independent second reading (2026-09-17). Applied to every unit;
# they only remove words that describe a mantra no longer present.
GLOBAL = {
 'deva': [(r'^\s*(ओम्|ॐ|ओं)\s*॥\s*$\n?', ''), (r'(श्री ?सूक्त|पुरुषसूक्त) विधानेन ', '')],
 'iast': [(r'^\s*(om|oṁ)\s*\|\|\s*$\n?', ''), (r'(śrī ?sūkta|puruṣasūkta) vidhānena ', '')],
 'en':   [(r',? according to the rule of the (Śrī|Puruṣa) Sūkta', '')],
 'tel':  [(r'(శ్రీ ?సూక్త|పురుషసూక్త) విధానముచే ', '')],
 'hi':   [(r'(श्री ?सूक्त|पुरुषसूक्त) के विधान से ', '')],
 'vidhi': [
   (r' The mantra is the yajñopavīta verse\.', ''), (r' The full rite says the yajñopavīta verse here\.', ''),
   (r', with the yajñopavīta verse', ''), (r' Recorded, not imported\.', ''),
   (r' The same act, differently named — recorded, not harmonised\.', ''),
   (r'the threefold peace and ', ''), (r', and the rite ends with the threefold peace', ''),
   (r',? and the closing peace', ''), (r', and the peace', ''),
   (r' — and here, instead of the eight-limbed prostration.*$', '.'),
   (r'^Agni Jātavedas is asked to bring Lakṣmī near\.', 'Meditation on Lakṣmī.'),
   (r' The verse turns on.*$', ''),
   (r' The mantra of the waters is spoken first, and then the verse of the rite\.', ''),
   (r' The five faces of Śiva are addressed in turn.*$', ''),
   (r'^The offering of the food into the five breaths\.', 'The close of the food-offering.'),
   (r'^The five offerings to the five breaths, with water given in between\.', 'Water is given between the mouthfuls.'),
 ],
}
BLURB = [(r' Three things set this rite apart\.', ''), (r' And after the salutations', ' After the salutations'),
         (r' The salutation itself keeps an old healing verse[^.]*\.', ''), (r' the putting on of the pavitra,', '')]

def apply_global(out):
    kept = []
    for u in out:
        for fld, rules in GLOBAL.items():
            if fld in u:
                for pat, rep in rules:
                    u[fld] = re.sub(pat, rep, u[fld], flags=re.M).strip()
        if not u.get('deva', '').strip():
            continue          # a unit left with nothing but a bare praṇava
        kept.append(u)
    return kept

def fix_blurb(b):
    for pat, rep in BLURB:
        b = re.sub(pat, rep, b)
    return b

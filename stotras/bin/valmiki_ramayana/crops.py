"""Page images and line crops from the primary Gītā Press scans, for reading a line by eye.

    python3 crops.py page <vol> <leaf>                 -> path of the cached page image
    python3 crops.py line <vol> <leaf> x0 y0 x1 y1     -> path of a crop with a line of context

The page images are archive.org's own (BookReader `page/n<leaf>.jpg`), at the scan's full
resolution, 1865 x 2772 for both volumes; the hOCR bounding boxes are in the same pixels.
Everything is cached under ../cache/gitapress_ramayana/pages/ and crops/.
"""
import os, sys, time, urllib.request
from PIL import Image
import sources as S

PAGES = os.path.join(S.GPC, 'pages')
CROPS = os.path.join(S.GPC, 'crops')

def page(vol, leaf):
    os.makedirs(PAGES, exist_ok=True)
    p = os.path.join(PAGES, f'gp{vol}_{leaf:04d}.jpg')
    if os.path.exists(p) and os.path.getsize(p) > 20000:
        return p
    url = f'https://archive.org/download/{S.SCAN_ID[f"gp{vol}"]}/page/n{leaf}.jpg'
    for t in range(4):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'curl/8.4.0'}),
                                          timeout=120).read()
            if len(data) > 20000:
                tmp = p + f'.{os.getpid()}.part'
                open(tmp, 'wb').write(data)
                Image.open(tmp).load()            # a truncated download raises here
                os.replace(tmp, p)                 # atomic: no reader ever sees half a page
                return p
        except Exception:
            time.sleep(2 + 3 * t)
    raise SystemExit(f'could not fetch {url}')

def line(vol, leaf, bbox, pad_y=40, pad_x=30, name=None):
    """Crop a printed line with some margin, upscaled 1.5x so mātrās and conjuncts read clearly."""
    os.makedirs(CROPS, exist_ok=True)
    x0, y0, x1, y1 = bbox
    out = os.path.join(CROPS, name or f'gp{vol}_{leaf:04d}_{x0}_{y0}_{x1}_{y1}.png')
    if os.path.exists(out):
        return out
    im = Image.open(page(vol, leaf))
    W, H = im.size
    # the page is set in two columns; take the whole column, since the OCR sometimes splits a
    # printed line and a box can stop short of its end (or of the verse number)
    mid = W // 2
    if x1 <= mid + 60:
        cx0, cx1 = 20, mid + 25
    elif x0 >= mid - 60:
        cx0, cx1 = mid - 25, W - 20
    else:
        cx0, cx1 = 20, W - 20
    box = (max(0, min(x0 - pad_x, cx0)), max(0, y0 - pad_y), min(W, max(x1 + pad_x, cx1)), min(H, y1 + pad_y))
    c = im.crop(box)
    c = c.resize((int(c.width * 1.5), int(c.height * 1.5)), Image.LANCZOS)
    c.save(out)
    return out

def block(vol, leaf, bboxes, name, pad_y=30, pad_x=30):
    """One crop spanning several lines on the same page (a whole verse, say)."""
    x0 = min(b[0] for b in bboxes); y0 = min(b[1] for b in bboxes)
    x1 = max(b[2] for b in bboxes); y1 = max(b[3] for b in bboxes)
    return line(vol, leaf, (x0, y0, x1, y1), pad_y=pad_y, pad_x=pad_x, name=name)

def sheet(paths, out, max_w=1500):
    """Stack line crops into one numbered sheet, so one look reads several lines.
    Each crop keeps its own scale (no shrinking below 1x of the scan); a number in a grey
    margin on the left says which entry it is."""
    from PIL import ImageDraw, ImageFont
    ims = [Image.open(p).convert('RGB') for p in paths]
    W = min(max_w, max(i.width for i in ims)) + 90
    rows = []
    for i in ims:
        if i.width > max_w:
            i = i.resize((max_w, int(i.height * max_w / i.width)), Image.LANCZOS)
        rows.append(i)
    H = sum(r.height for r in rows) + 14 * len(rows)
    sh = Image.new('RGB', (W, H), 'white')
    d = ImageDraw.Draw(sh)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 44)
    except Exception:
        font = ImageFont.load_default()
    y = 0
    for n, r in enumerate(rows, 1):
        d.rectangle([0, y, 80, y + r.height], fill=(225, 225, 225))
        d.text((12, y + r.height // 2 - 24), str(n), fill=(200, 0, 0), font=font)
        sh.paste(r, (90, y))
        y += r.height
        d.line([0, y + 6, W, y + 6], fill=(200, 0, 0), width=3)
        y += 14
    sh.save(out)
    return out

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'page':
        print(page(int(a[1]), int(a[2])))
    elif a[0] == 'line':
        print(line(int(a[1]), int(a[2]), tuple(int(x) for x in a[3:7])))

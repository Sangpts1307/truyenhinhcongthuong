"""Remove encoded black padding from editorial photos before publishing."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import unquote, urlsplit
from PIL import Image, ImageChops, ImageStat
import hashlib
import json
import re
import shutil

root = Path(__file__).resolve().parent.parent
report_path = root / 'image-fit-report.json'
previous = json.loads(report_path.read_text())['images'] if report_path.exists() else {}
backup = Path('/tmp/cms-view-original-images')
photo_prefixes = ('/assets/mirrored/', '/assets/original/featured-', '/assets/original/hero.', '/assets/images/albums/', '/storage/')
pages = [root / 'index.html']
for directory in ['bai-viet', 'chuyen-muc', 'video', 'album-anh', 'tim-kiem']:
    pages.extend((root / directory).rglob('*.html'))
photos = set()
for page in pages:
    for url in re.findall(r'(?:src|poster)="([^"<>]+)"', page.read_text()):
        path = unquote(urlsplit(url).path)
        if path.startswith(photo_prefixes) and not path.startswith(('/storage/banners/', '/storage/site-settings/')) and Path(path).suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp'):
            photos.add(path)

def bounds(image):
    rgb = image.convert('RGB')
    # A border is a nearly solid black strip spanning the entire edge.
    maximum = ImageChops.lighter(ImageChops.lighter(rgb.getchannel('R'), rgb.getchannel('G')), rgb.getchannel('B'))
    width, height = rgb.size
    def black(box):
        histogram = maximum.crop(box).histogram()
        count = sum(histogram)
        statistics = ImageStat.Stat(rgb.crop(box))
        return sum(histogram[:42]) / count >= .985 and max(statistics.mean) < 25 and max(statistics.stddev) < 5
    left, top, right, bottom = 0, 0, width, height
    while top < height * .24 and black((0, top, width, top + 1)):
        top += 1
    while bottom > height * .76 and black((0, bottom - 1, width, bottom)):
        bottom -= 1
    while left < width * .24 and black((left, top, left + 1, bottom)):
        left += 1
    while right > width * .76 and black((right - 1, top, right, bottom)):
        right -= 1
    # Allow asymmetric padding; require a real strip rather than a dark pixel.
    if top < 2: top = 0
    if height - bottom < 2: bottom = height
    if left < 2: left = 0
    if width - right < 2: right = width
    # Include the JPEG boundary blend in the removed padding.
    return (left + (1 if left else 0), top + (1 if top else 0), right - (1 if right < width else 0), bottom - (1 if bottom < height else 0))

def process(url):
    file = root / url.lstrip('/')
    data = file.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if previous.get(url, {}).get('sha256') == digest:
        return url, previous[url]
    with Image.open(file) as image:
        size = image.size
        crop = (0, 0, *size)
        working = image
        for _ in range(5):
            detected = bounds(working)
            if detected == (0, 0, *working.size): break
            crop = (crop[0] + detected[0], crop[1] + detected[1], crop[0] + detected[2], crop[1] + detected[3])
            working = image.crop(crop)
        changed = crop != (0, 0, *size)
        if changed:
            original = backup / url.lstrip('/')
            original.parent.mkdir(parents=True, exist_ok=True)
            if not original.exists(): shutil.copyfile(file, original)
            output = image.crop(crop)
            options = {'quality': 95, 'subsampling': 0} if image.format == 'JPEG' else {}
            output.save(file, format=image.format, **options)
            # JPEG encoding can expose a final dark boundary pixel.
            for _ in range(3):
                with Image.open(file) as saved:
                    extra = bounds(saved)
                    if extra == (0, 0, *saved.size): break
                    crop = (crop[0] + extra[0], crop[1] + extra[1], crop[0] + extra[2], crop[1] + extra[3])
                    saved.crop(extra).save(file, format=image.format, **options)
        return url, {'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'original': list(size), 'crop': list(crop), 'cropped': changed}

with ThreadPoolExecutor(max_workers=8) as executor:
    results = dict(executor.map(process, sorted(photos)))
# Prevent the old browser-side approximation from cropping an image a second time.
script = root / 'assets/js/cms-public.js'
content = script.read_text()
start, end = content.find('    const croppedThumbnails = new Map();'), content.find("    const drawer = document.getElementById('mobile-menu-drawer');")
if start >= 0 and end > start:
    script.write_text(content[:start] + content[end:])

style = '<link rel="stylesheet" href="/assets/css/preview-images.css?v=2">'
for page in pages:
    content = page.read_text()
    if style not in content: content = content.replace('</head>', style + '</head>')
    def version(match):
        attribute, url = match.groups()
        path = unquote(urlsplit(url).path)
        if path not in results: return match.group()
        return f'{attribute}="{urlsplit(url).path}?fit={results[path]["sha256"][:12]}"'
    content = re.sub(r'(src|poster)="([^"<>]+)"', version, content)
    content = re.sub(r'(/assets/js/cms-public\.js\?v=)[^"<>]+', r'\g<1>image-fit-2', content)
    page.write_text(content)
index_path = root / 'assets/search-index.json'
index = json.loads(index_path.read_text())
for item in index:
    path = unquote(urlsplit(item['thumbnail']).path)
    if path in results: item['thumbnail'] = urlsplit(item['thumbnail']).path + '?fit=' + results[path]['sha256'][:12]
index_path.write_text(json.dumps(index, ensure_ascii=False, separators=(',', ':')))
for source, target in [('index.html', 'homepage.html'), ('tim-kiem/index.html', 'search.html'), ('chuyen-muc/tin-tuc/index.html', 'category-detail.html'), (index[0]['url'].lstrip('/') + '/index.html', 'new-detail.html')]:
    shutil.copyfile(root / source, root / target)
report_path.write_text(json.dumps({'checked': len(results), 'cropped': sum(item['cropped'] for item in results.values()), 'images': results}, ensure_ascii=False, indent=2))
print(f'Checked {len(results)} editorial images; removed padding from {sum(item["cropped"] for item in results.values())}.')

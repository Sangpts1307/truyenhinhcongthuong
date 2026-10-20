from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
import hashlib
import html
import json
import re
import shutil
from urllib.error import HTTPError
fallbacks = []

root = Path(__file__).resolve().parent.parent
source = root.parent / 'cms-news'
for source_folder, target_folder in [('public/assets', 'assets'), ('public/build', 'build'), ('storage/app/public', 'storage')]:
    shutil.copytree(source / source_folder, root / target_folder, dirs_exist_ok=True)
pages = [root / 'index.html', *root.glob('bai-viet/**/*.html'), *root.glob('chuyen-muc/**/*.html'), *root.glob('video/**/*.html'), *root.glob('album-anh/**/*.html'), *root.glob('tim-kiem/**/*.html')]
urls = set()
for page in pages:
    content = page.read_text()
    urls.update(html.unescape(url) for url in re.findall(r'(?:src|poster)="(https?://[^"<>]+)"', content) if urlsplit(html.unescape(url)).hostname in ('img.youtube.com', 'i.ytimg.com'))
for item in json.loads((root / 'assets/search-index.json').read_text()):
    url = item['thumbnail']
    if url.startswith('http') and urlsplit(url).hostname in ('img.youtube.com', 'i.ytimg.com'):
        urls.add(url)
media = root / 'assets' / 'mirrored'
media.mkdir(exist_ok=True)
def download(url):
    destination = media / (hashlib.sha256(url.encode()).hexdigest()[:24] + '.jpg')
    if not destination.exists():
        request = Request(url.replace('http://', 'https://'), headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urlopen(request, timeout=30) as response:
                if not response.headers.get('Content-Type', '').startswith('image/'):
                    raise RuntimeError('Không nhận được ảnh: ' + url)
                destination.write_bytes(response.read())
        except HTTPError as error:
            if error.code != 404:
                raise
            fallbacks.append(url)
            return url, '/assets/original/hero.jpg'
    return url, '/assets/mirrored/' + destination.name
with ThreadPoolExecutor(max_workers=8) as executor:
    mapping = dict(executor.map(download, sorted(urls)))
# Local copies also let thumbnail cropping work without cross-origin restrictions.
for page in [*pages, root / 'assets/search-index.json']:
    content = page.read_text()
    content = re.sub(r'https?://(?:img\.youtube\.com|i\.ytimg\.com)/[^"<>\\\s]+', lambda match: mapping.get(html.unescape(match.group()), match.group()), content)
    page.write_text(content)
shutil.copyfile(root / 'index.html', root / 'homepage.html')
shutil.copyfile(root / 'tim-kiem/index.html', root / 'search.html')
shutil.copyfile(root / 'chuyen-muc/tin-tuc/index.html', root / 'category-detail.html')
articles = json.loads((root / 'assets/search-index.json').read_text())
shutil.copyfile(root / articles[0]['url'].lstrip('/') / 'index.html', root / 'new-detail.html')
manifest_path = root / 'preview-manifest.json'
manifest = json.loads(manifest_path.read_text())
manifest['unavailableSourceImages'] = fallbacks
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
print(f'Đã lưu {len(mapping)} ảnh bên ngoài và đồng bộ các đường dẫn cũ.')

import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'preview-manifest.json'), 'utf8'));
if (manifest.failures.length) throw new Error('Bản xuất có trang lỗi. Chạy lại npm run export.');
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const entry of ['index.html', 'homepage.html', 'category-detail.html', 'new-detail.html', 'search.html', 'robots.txt', 'assets', 'build', 'storage', 'chuyen-muc', 'bai-viet', 'video', 'album-anh', 'tim-kiem']) {
    await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
console.log(`Đã đóng gói ${manifest.pages} trang và ${manifest.articles} bài viết vào dist/.`);

import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'preview-manifest.json'), 'utf8'));
if (manifest.failures.length) throw new Error('Bản xuất có trang lỗi. Chạy lại npm run export.');
// Fail the deployment if a public asset was omitted from the repository.
const assetPaths = new Set();
async function inspectPages(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) await inspectPages(file);
        else if (entry.name.endsWith('.html')) {
            const html = await readFile(file, 'utf8');
            for (const match of html.matchAll(/(?:src|href|poster)="(\/(?:assets|storage|build)\/[^"#?]+)/g)) {
                assetPaths.add(decodeURIComponent(match[1]).replace(/^\//, ''));
            }
        }
    }
}
for (const directory of ['bai-viet', 'chuyen-muc', 'video', 'album-anh', 'tim-kiem']) {
    await inspectPages(path.join(root, directory));
}
const missingAssets = [];
for (const file of assetPaths) {
    try { if (!(await stat(path.join(root, file))).isFile()) missingAssets.push(file); }
    catch { missingAssets.push(file); }
}
if (missingAssets.length) {
    throw new Error(`Thiếu ${missingAssets.length} tài nguyên công khai. Kiểm tra .gitignore và đưa ảnh vào Git:\n${missingAssets.slice(0, 20).join('\n')}`);
}
console.log(`Đã kiểm tra ${assetPaths.size} tài nguyên công khai.`);
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const entry of ['index.html', 'homepage.html', 'category-detail.html', 'new-detail.html', 'search.html', 'robots.txt', 'assets', 'build', 'storage', 'chuyen-muc', 'bai-viet', 'video', 'album-anh', 'tim-kiem']) {
    await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
console.log(`Đã đóng gói ${manifest.pages} trang và ${manifest.articles} bài viết vào dist/.`);

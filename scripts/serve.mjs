import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat, readFile } from 'node:fs/promises';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };
const port = Number(process.env.PORT || 8094);
http.createServer(async (request, response) => {
    try {
        const url = new URL(request.url, 'http://localhost');
        const pathname = decodeURIComponent(url.pathname);
        if (pathname.split('/').some(part => part.startsWith('.') || part === 'scripts') || request.method !== 'GET' && request.method !== 'HEAD') {
            response.writeHead(404).end(); return;
        }
        let file = path.resolve(root, `.${pathname}`);
        if (!file.startsWith(root + path.sep) && file !== root) { response.writeHead(404).end(); return; }
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
        response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Robots-Tag': 'noindex, nofollow' });
        response.end(request.method === 'HEAD' ? undefined : await readFile(file));
    } catch {
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end('<h1>Không tìm thấy trang</h1><a href="/">Về trang chủ</a>');
    }
}).listen(port, '127.0.0.1', () => console.log(`Xem giao diện tại http://localhost:${port}`));

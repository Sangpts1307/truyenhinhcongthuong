(() => {
    'use strict';
    const nativeFetch = window.fetch.bind(window);
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    let indexPromise;
    const index = () => indexPromise ||= nativeFetch('/assets/search-index.json').then(response => {
        if (!response.ok) throw new Error('Không tải được dữ liệu tìm kiếm.');
        return response.json();
    });
    const find = async query => {
        const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
        if (normalize(query).trim().length < 2) return [];
        return (await index()).filter(item => terms.every(term => normalize(`${item.title} ${item.excerpt} ${item.category} ${item.text}`).includes(term)));
    };
    // Keep the original keyboard navigation and suggestion UI from cms-news.
    window.fetch = async (input, options) => {
        const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.origin);
        if (url.origin === location.origin && url.pathname === '/tim-kiem/goi-y') {
            return new Response(JSON.stringify({ results: (await find(url.searchParams.get('q'))).slice(0, 5) }), { headers: { 'Content-Type': 'application/json' } });
        }
        return nativeFetch(input, options);
    };
    const query = new URLSearchParams(location.search);
    if (query.has('page') && !location.pathname.includes('/trang/') && !location.pathname.startsWith('/tim-kiem')) {
        const page = Math.max(1, Number.parseInt(query.get('page'), 10) || 1);
        location.replace(`${location.pathname.replace(/\/$/, '')}/trang/${page}${location.hash}`);
        return;
    }
    const escape = value => String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
    async function renderSearch() {
        if (!/^\/tim-kiem\/?$/.test(location.pathname)) return;
        const main = document.querySelector('main.site-main-content');
        const form = main?.querySelector('form');
        const results = main?.querySelector('section');
        if (!form || !results) return;
        const keyword = (query.get('q') || '').trim().slice(0, 100);
        form.querySelector('[name=q]').value = keyword;
        const status = form.nextElementSibling;
        if (keyword.length < 2) {
            status.textContent = 'Vui lòng nhập ít nhất 2 ký tự để tìm kiếm.';
            return;
        }
        status.textContent = 'Đang tìm kiếm…';
        try {
            const matches = await find(keyword);
            const pages = Math.max(1, Math.ceil(matches.length / 10));
            const page = Math.min(pages, Math.max(1, Number.parseInt(query.get('page'), 10) || 1));
            status.textContent = `Kết quả tìm kiếm cho từ khóa “${keyword}”: ${matches.length} bài viết.`;
            results.innerHTML = matches.slice((page - 1) * 10, page * 10).map(item => `<article class="flex flex-col sm:flex-row gap-4 pb-4 mb-4 border-b border-gray-200"><a class="video-thumb-frame horizontal-news-thumb sm:w-56 aspect-video shrink-0" href="${escape(item.url)}"><img src="${escape(item.thumbnail)}" alt="${escape(item.title)}" width="480" height="360" loading="lazy"></a><div><p class="text-[11px] font-bold text-[#be1016] uppercase mb-1"><a href="${escape(item.categoryUrl)}">${escape(item.category)}</a></p><h2 class="text-base font-bold font-playfair text-gray-900 leading-snug mb-2"><a href="${escape(item.url)}">${escape(item.title)}</a></h2><p class="text-xs text-gray-600 leading-relaxed line-clamp-3">${escape(item.excerpt)}</p></div></article>`).join('') || '<p>Không tìm thấy bài viết nào phù hợp.</p>';
            if (pages > 1) {
                const nav = document.createElement('nav');
                nav.setAttribute('aria-label', 'Phân trang tìm kiếm');
                nav.style.cssText = 'display:flex;gap:12px;padding:20px 0;align-items:center';
                for (const [label, target] of [['← Trước', page - 1], ['Sau →', page + 1]]) {
                    if (target < 1 || target > pages) continue;
                    const link = document.createElement('a');
                    link.textContent = label;
                    link.href = `/tim-kiem?q=${encodeURIComponent(keyword)}&page=${target}`;
                    nav.append(link);
                }
                nav.append(document.createTextNode(`Trang ${page} / ${pages}`));
                results.append(nav);
            }
        } catch {
            status.textContent = 'Chưa tải được dữ liệu. Vui lòng thử lại.';
        }
    }
    function initComments() {
        document.querySelectorAll('form.comment-form').forEach(form => {
            const storageKey = `preview-comments:${location.pathname}`;
            const list = document.createElement('div');
            form.before(list);
            const read = () => {
                try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
            };
            const heading = form.closest('section').querySelector('h2');
            const originalCount = Number(heading?.textContent.match(/\d+/)?.[0] || 0);
            const render = () => {
                if (heading) heading.textContent = `Bình luận (${originalCount + read().length})`;
                list.innerHTML = read().map(item => `<div class="comment-item"><span class="author">${escape(item.name)}</span><span class="time"> · Demo — chỉ lưu trên trình duyệt này</span><div class="body">${escape(item.body)}</div></div>`).join('');
            };
            form.addEventListener('submit', event => {
                event.preventDefault();
                if (!form.reportValidity()) return;
                const data = new FormData(form);
                try {
                    localStorage.setItem(storageKey, JSON.stringify([...read(), { name: data.get('name'), body: data.get('body') }]));
                    render();
                    form.reset();
                    let status = form.querySelector('[role=status]');
                    if (!status) { status = document.createElement('p'); status.setAttribute('role', 'status'); form.append(status); }
                    status.textContent = 'Đã gửi bình luận demo. Nội dung chỉ lưu trên trình duyệt này.';
                } catch { alert('Trình duyệt không cho phép lưu bình luận demo.'); }
            });
            render();
        });
    }
    document.querySelectorAll('a.article-share-button').forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('u', location.href);
        link.href = url.href;
    });
    renderSearch();
    initComments();
})();

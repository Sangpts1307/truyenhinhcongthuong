/**
 * Truyen Hinh Cong Thuong - Modern UI Engine & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initBreakingTicker();
    initQuickSwitcher();
    initMobileNav();
    initSearchTriggers();
    initScrollToTop();
});

// 1. Live Clock
function initLiveClock() {
    const clockEl = document.getElementById('header-live-clock');
    if (!clockEl) return;
    
    function updateClock() {
        const now = new Date();
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = days[now.getDay()];
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${dayName}, ${d}/${m}/${y} | ${hh}:${mm} (GMT+7)`;
    }
    updateClock();
    setInterval(updateClock, 30000);
}

// 2. Breaking News Ticker (Chữ chạy ngang liên tục)
function initBreakingTicker() {
    const tickerContainer = document.getElementById('ticker-slider');
    if (!tickerContainer) return;
    
    // If marquee track is already rendered in HTML, let CSS handle smooth horizontal continuous scrolling!
    if (tickerContainer.querySelector('.ticker-marquee-track')) {
        return;
    }

    if (!window.TVCT_DB) return;
    const breakingNews = TVCT_DB.getAll().filter(a => a.is_breaking).slice(0, 5);
    if (!breakingNews.length) return;
    
    let currentIndex = 0;
    function renderTicker() {
        const item = breakingNews[currentIndex];
        tickerContainer.innerHTML = `
            <a href="new-detail.html?id=${item.id}" class="inline-flex items-center gap-2 text-slate-800 hover:text-red-700 font-medium text-sm transition line-clamp-1">
                <span class="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Mới nhận</span>
                <span>${item.title}</span>
                <span class="text-xs text-slate-400 font-normal">(${item.published_at.split(' ')[1] || '14:30'})</span>
            </a>
        `;
        currentIndex = (currentIndex + 1) % breakingNews.length;
    }
    renderTicker();
    setInterval(renderTicker, 5000);
}

// 3. Quick View Switcher Floating Pill
function initQuickSwitcher() {
    const currentPath = window.location.pathname.split('/').pop() || 'homepage.html';
    
    const switcher = document.createElement('aside');
    switcher.className = 'view-switcher-pill';
    switcher.setAttribute('aria-label', 'Chuyển đổi giao diện demo');
    switcher.innerHTML = `
        <div class="flex items-center gap-1.5 pl-2 pr-1 border-r border-slate-700 text-xs font-bold text-amber-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            <span>MÀN HÌNH:</span>
        </div>
        <div class="flex items-center gap-1">
            <a href="homepage.html" class="${currentPath.includes('homepage') || currentPath === '' ? 'active-screen' : ''}">Trang chủ</a>
            <a href="category-detail.html" class="${currentPath.includes('category-detail') ? 'active-screen' : ''}">Chuyên mục</a>
            <a href="new-detail.html?id=1" class="${currentPath.includes('new-detail') ? 'active-screen' : ''}">Chi tiết tin</a>
            <a href="search.html" class="${currentPath.includes('search') ? 'active-screen' : ''}">Tìm kiếm</a>
        </div>
    `;
    document.body.appendChild(switcher);
}

// 4. Mobile Navigation
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('close-mobile-nav');
    
    if (toggleBtn && drawer) {
        toggleBtn.addEventListener('click', () => {
            drawer.classList.remove('hidden');
        });
    }
    if (closeBtn && drawer) {
        closeBtn.addEventListener('click', () => {
            drawer.classList.add('hidden');
        });
    }
}

// 5. Search Triggers
function initSearchTriggers() {
    const searchInputs = document.querySelectorAll('.global-search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const q = input.value.trim();
                if (q) {
                    window.location.href = `search.html?q=${encodeURIComponent(q)}`;
                }
            }
        });
    });
}

// 6. YouTube Player Modal (No black borders, 16:9 strictly)
window.openVideoModal = function(youtubeId, title) {
    let modal = document.getElementById('video-player-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'video-player-modal';
        modal.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden max-w-4xl w-full shadow-2xl">
                <div class="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
                    <h3 id="modal-video-title" class="text-white font-bold text-base truncate pr-4">Video Clip</h3>
                    <button onclick="closeVideoModal()" class="text-slate-400 hover:text-white p-1 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="p-0 bg-black">
                    <div class="video-responsive-box">
                        <iframe id="modal-video-iframe" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modal-video-title').textContent = title || 'Bản tin Truyền hình Công Thương';
    document.getElementById('modal-video-iframe').src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    modal.classList.remove('hidden');
};

window.closeVideoModal = function() {
    const modal = document.getElementById('video-player-modal');
    if (modal) {
        document.getElementById('modal-video-iframe').src = '';
        modal.classList.add('hidden');
    }
};

// 7. Toast Message
window.showToast = function(msg, isSuccess = true) {
    let toast = document.getElementById('tvct-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'tvct-toast';
        toast.className = 'fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl text-sm font-semibold flex items-center gap-3 transition-all duration-300 transform translate-y-[-20px] opacity-0';
        document.body.appendChild(toast);
    }
    toast.className = `fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl text-sm font-semibold flex items-center gap-3 transition-all duration-300 transform ${
        isSuccess ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`;
    toast.innerHTML = `
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${isSuccess ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>'}
        </svg>
        <span>${msg}</span>
    `;
    setTimeout(() => {
        toast.classList.remove('translate-y-[-20px]', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);
    setTimeout(() => {
        toast.classList.add('translate-y-[-20px]', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3500);
};

// 8. Copy Link
window.copyArticleLink = function() {
    navigator.clipboard.writeText(window.location.href);
    window.showToast('Đã sao chép liên kết bài viết vào clipboard!');
};

// 9. Font Size Adjuster for Article Body
let currentFontSize = 16;
window.adjustFontSize = function(delta) {
    const el = document.getElementById('article-body-text');
    if (!el) return;
    currentFontSize = Math.max(13, Math.min(22, currentFontSize + delta));
    el.style.fontSize = currentFontSize + 'px';
    window.showToast(`Đã đổi cỡ chữ: ${currentFontSize}px`);
};

// 10. Voice Reader Toggle
let isReading = false;
window.toggleVoiceReader = function() {
    const btnText = document.getElementById('voice-reader-text');
    if (!('speechSynthesis' in window)) {
        window.showToast('Trình duyệt không hỗ trợ đọc giọng nói tự động!', false);
        return;
    }
    if (isReading) {
        window.speechSynthesis.cancel();
        isReading = false;
        if (btnText) btnText.textContent = '🔊 Nghe đọc bài';
        window.showToast('Đã dừng đọc bài viết');
    } else {
        const bodyText = document.getElementById('article-body-text')?.innerText || '';
        const sapo = document.querySelector('.sapo-quote')?.innerText || '';
        const title = document.querySelector('h1')?.innerText || '';
        const full = `${title}. ${sapo}. ${bodyText.slice(0, 500)}`;
        
        const utter = new SpeechSynthesisUtterance(full);
        utter.lang = 'vi-VN';
        utter.rate = 1.0;
        utter.onend = () => {
            isReading = false;
            if (btnText) btnText.textContent = '🔊 Nghe đọc bài';
        };
        window.speechSynthesis.speak(utter);
        isReading = true;
        if (btnText) btnText.textContent = '⏹ Dừng đọc';
        window.showToast('Đang phát giọng đọc trí tuệ nhân tạo (AI Audio)...');
    }
};

// 11. Comment Submission with Banned Words Moderation (Meeting Note 10)
const BANNED_WORDS = ['lừa đảo', 'xấu xa', 'phản động', 'đồi trụy', 'tục tĩu', 'chửi', 'scam', 'dm', 'vcl'];
window.handleCommentSubmit = function(event) {
    event.preventDefault();
    const nameInput = document.getElementById('comment-name');
    const emailInput = document.getElementById('comment-email');
    const textInput = document.getElementById('comment-text');
    const alertBox = document.getElementById('comment-banned-alert');
    const listBox = document.getElementById('comments-list-box');
    const countEl = document.getElementById('comments-count');

    if (!nameInput || !textInput) return;
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text) return;

    // Check banned words
    const lower = text.toLowerCase();
    const hasBanned = BANNED_WORDS.some(w => lower.includes(w));
    if (hasBanned) {
        if (alertBox) {
            alertBox.classList.remove('hidden');
        }
        window.showToast('Bình luận vi phạm quy chế bình luận của tòa soạn!', false);
        return;
    }

    if (alertBox) {
        alertBox.classList.add('hidden');
    }

    // Prepend new comment
    if (listBox) {
        const item = document.createElement('div');
        item.className = 'p-3 bg-red-50/50 border-b border-gray-150 transition-all duration-300';
        item.innerHTML = `
            <div class="flex items-center justify-between mb-1">
                <strong class="text-xs text-gray-900 font-bold">${name} <span class="text-[10px] text-[#be1016] font-normal">(Vừa xong)</span></strong>
                <span class="text-[10px] text-gray-400">Vừa gửi</span>
            </div>
            <p class="text-xs text-gray-700 leading-relaxed">${text}</p>
        `;
        listBox.prepend(item);
    }

    if (countEl) {
        const cur = parseInt(countEl.textContent, 10) || 3;
        countEl.textContent = cur + 1;
    }

    textInput.value = '';
    window.showToast('Bình luận của bạn đã được tiếp nhận và hiển thị!');
};

// 12. Floating Scroll To Top
function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 250) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 13. Interactive Modals Management
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.openAdContactModal = function() {
    window.openModal('ad-contact-modal');
};
window.closeAdContactModal = function() {
    window.closeModal('ad-contact-modal');
};

window.openLoginModal = function() {
    window.openModal('login-modal');
};
window.closeLoginModal = function() {
    window.closeModal('login-modal');
};

window.openContactModal = function() {
    window.openModal('editorial-contact-modal');
};
window.closeContactModal = function() {
    window.closeModal('editorial-contact-modal');
};

window.openNewsletterModal = function() {
    window.openModal('newsletter-modal');
};
window.closeNewsletterModal = function() {
    window.closeModal('newsletter-modal');
};

// Handle Ad Contact Form Submit
window.handleAdContactSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('ad-contact-name')?.value || 'Quý khách';
    window.closeAdContactModal();
    window.showToast(`Cảm ơn ${name}! Bộ phận kinh doanh Truyền hình Công Thương sẽ liên hệ trong 30 phút.`);
};

// Handle Login Form Submit
window.handleLoginSubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value || '';
    window.closeLoginModal();
    window.showToast(`Đăng nhập thành công! Chào mừng độc giả ${email}.`);
};

// Handle Editorial Contact Form Submit
window.handleEditorialSubmit = function(e) {
    e.preventDefault();
    window.closeContactModal();
    window.showToast('Thông tin của bạn đã được gửi đến Ban Thư ký Biên tập Truyền hình Công Thương!');
};

// Handle Newsletter Form Submit
window.handleNewsletterSubmit = function(e) {
    e.preventDefault();
    window.closeNewsletterModal();
    window.showToast('Đăng ký nhận bản tin thành công! Cảm ơn bạn đã quan tâm.');
};

// Global modal dismiss on ESC key & backdrop click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
        window.collapseHeaderSearch();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Collapse search pill if clicking outside
    const container = document.getElementById('header-search-container');
    if (container && !container.contains(e.target)) {
        const input = document.getElementById('header-search-input');
        if (input && !input.value.trim()) {
            window.collapseHeaderSearch();
        }
    }
});

// 14. Expandable Header Search (Chuẩn ảnh 1 tooltip & ảnh 2 pill input)
window.expandHeaderSearch = function() {
    const btn = document.getElementById('header-search-btn');
    const pill = document.getElementById('header-search-pill');
    const input = document.getElementById('header-search-input');
    if (btn && pill) {
        btn.classList.add('hidden');
        pill.classList.remove('hidden');
        pill.classList.add('active');
        if (input) {
            input.focus();
        }
    }
};

window.collapseHeaderSearch = function() {
    const btn = document.getElementById('header-search-btn');
    const pill = document.getElementById('header-search-pill');
    const input = document.getElementById('header-search-input');
    if (btn && pill) {
        pill.classList.add('hidden');
        pill.classList.remove('active');
        btn.classList.remove('hidden');
        if (input) {
            input.value = '';
        }
    }
};

window.handleHeaderSearch = function(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('header-search-input');
    const q = (input ? input.value : '').trim();
    if (q) {
        window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    } else {
        window.location.href = `search.html`;
    }
};

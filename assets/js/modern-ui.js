/**
 * Truyen Hinh Cong Thuong - Modern UI Engine & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initBreakingTicker();
    initMobileNav();
    initSearchTriggers();
    initScrollToTop();
    initReadingProgressBar();
    initAdPopupModal();
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
    // Removed as requested
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
    // Collapse search overlay if clicking outside
    const container = document.getElementById('header-search-wrapper');
    if (container && !container.contains(e.target)) {
        const input = document.getElementById('header-search-input');
        if (input && !input.value.trim()) {
            window.collapseHeaderSearch();
        }
    }
});

// 14. Expandable Header Search Overlay (Mở ra đè lên che đi YouTube, Facebook, Quảng cáo)
window.expandHeaderSearch = function() {
    const socialGroup = document.getElementById('header-utility-social-ads');
    const searchBtn = document.getElementById('header-search-btn');
    const searchOverlay = document.getElementById('header-search-overlay-bar');
    const input = document.getElementById('header-search-input');
    
    if (socialGroup) {
        socialGroup.classList.add('opacity-0', 'pointer-events-none');
    }
    if (searchBtn) {
        searchBtn.classList.add('hidden');
    }
    if (searchOverlay) {
        searchOverlay.classList.remove('hidden');
        if (input) {
            setTimeout(() => input.focus(), 60);
        }
    }
};

window.collapseHeaderSearch = function() {
    const socialGroup = document.getElementById('header-utility-social-ads');
    const searchBtn = document.getElementById('header-search-btn');
    const searchOverlay = document.getElementById('header-search-overlay-bar');
    const input = document.getElementById('header-search-input');

    if (searchOverlay) {
        searchOverlay.classList.add('hidden');
    }
    if (searchBtn) {
        searchBtn.classList.remove('hidden');
    }
    if (socialGroup) {
        socialGroup.classList.remove('opacity-0', 'pointer-events-none');
    }
    if (input) {
        input.value = '';
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

// 15. Reading Progress Bar (Thanh tiến trình đọc bài viết)
function initReadingProgressBar() {
    let bar = document.getElementById('reading-progress-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'reading-progress-bar';
        document.body.prepend(bar);
    }
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            bar.style.width = Math.min(progress, 100) + '%';
        }
    }, { passive: true });
}

// 16. Font Size Resizer for Detail Articles
window.changeArticleFontSize = function(delta) {
    const content = document.getElementById('article-main-body') || document.querySelector('.article-content');
    if (!content) return;
    const currentSize = parseFloat(window.getComputedStyle(content).fontSize) || 16;
    const newSize = Math.max(14, Math.min(22, currentSize + delta));
    content.style.fontSize = newSize + 'px';
    window.showToast(`Cỡ chữ: ${newSize}px`);
};

// 17. Popup Ad Modal with 5s countdown
let adTimerInterval = null;
function initAdPopupModal() {
    const modal = document.getElementById('ad-popup-modal');
    if (!modal) return;

    // Check if user chose not to see for 24h
    const hideUntil = localStorage.getItem('tvct_hide_ad_popup_until');
    if (hideUntil && Date.now() < parseInt(hideUntil, 10)) {
        return;
    }

    // Auto open popup ad after 3.5s on first visit
    setTimeout(() => {
        window.openAdPopupDemo();
    }, 3500);
}

window.openAdPopupDemo = function() {
    const modal = document.getElementById('ad-popup-modal');
    if (!modal) return;
    modal.classList.add('active');

    let secondsLeft = 5;
    const timerEl = document.getElementById('popup-ad-timer');
    if (timerEl) {
        timerEl.innerHTML = `Tự đóng sau <strong class="text-amber-400">${secondsLeft}</strong>s`;
    }

    if (adTimerInterval) clearInterval(adTimerInterval);
    adTimerInterval = setInterval(() => {
        secondsLeft--;
        if (timerEl) {
            timerEl.innerHTML = `Tự đóng sau <strong class="text-amber-400">${secondsLeft}</strong>s`;
        }
        if (secondsLeft <= 0) {
            clearInterval(adTimerInterval);
            window.closeAdPopupModal();
        }
    }, 1000);
};

window.closeAdPopupModal = function() {
    const modal = document.getElementById('ad-popup-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    if (adTimerInterval) clearInterval(adTimerInterval);

    const noRepeatCheckbox = document.getElementById('popup-no-repeat');
    if (noRepeatCheckbox && noRepeatCheckbox.checked) {
        // Save 24h timestamp
        localStorage.setItem('tvct_hide_ad_popup_until', String(Date.now() + 24 * 3600 * 1000));
        window.showToast('Đã lưu tùy chọn không hiển thị quảng cáo trong 24h');
    }
};



// 18. Interactive Right Gutter 360 Color Switcher
window.switchAdCarColor = function(colorName, imgUrl, btnEl) {
    const carImg = document.getElementById('ad-car-preview-img');
    const colorLabel = document.getElementById('ad-car-color-label');
    if (carImg && imgUrl) {
        carImg.src = imgUrl;
    }
    if (colorLabel && colorName) {
        colorLabel.textContent = colorName;
    }
    document.querySelectorAll('.ad-color-dot').forEach(d => d.classList.remove('ring-2', 'ring-offset-1', 'ring-red-600'));
    if (btnEl) {
        btnEl.classList.add('ring-2', 'ring-offset-1', 'ring-red-600');
    }
};


// 18. Interactive Right Gutter 360 Color Switcher
window.switchAdCarColor = function(colorName, imgUrl, btnEl) {
    const carImg = document.getElementById('ad-car-preview-img');
    const colorLabel = document.getElementById('ad-car-color-label');
    if (carImg && imgUrl) {
        carImg.src = imgUrl;
    }
    if (colorLabel && colorName) {
        colorLabel.textContent = colorName;
    }
    document.querySelectorAll('.ad-color-dot').forEach(d => d.classList.remove('ring-2', 'ring-offset-1', 'ring-red-600'));
    if (btnEl) {
        btnEl.classList.add('ring-2', 'ring-offset-1', 'ring-red-600');
    }
};

// 19. Interactive Ad Poll / Mini Survey
window.voteAdPoll = function(btnEl, optionIndex) {
    const pollCard = btnEl.closest('.ad-poll-card') || document.getElementById('ad-poll-widget');
    if (!pollCard) return;
    
    const results = [
        { label: 'Xe điện & AI', pct: 48 },
        { label: 'Năng lượng xanh', pct: 36 },
        { label: 'Xúc tiến XK', pct: 16 }
    ];
    
    let html = `<div class="p-2.5 bg-gray-50 text-left">
        <div class="text-[10px] font-bold text-emerald-700 uppercase mb-2 flex items-center gap-1">
            <svg class="w-3 h-3 text-emerald-600 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            Đã ghi nhận!
        </div>`;
        
    results.forEach((r, idx) => {
        const isChosen = idx === optionIndex;
        html += `
        <div class="mb-1.5">
            <div class="flex justify-between text-[10px] ${isChosen ? 'font-black text-[#be1016]' : 'text-gray-600'}">
                <span>${r.label} ${isChosen ? '✓' : ''}</span>
                <span>${r.pct}%</span>
            </div>
            <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div class="h-full ${isChosen ? 'bg-[#be1016]' : 'bg-gray-400'}" style="width: ${r.pct}%;"></div>
            </div>
        </div>`;
    });
    
    html += `<div class="text-[9px] text-gray-400 text-center mt-2">Tổng số: 1.420 lượt bình chọn</div></div>`;
    pollCard.innerHTML = html;
    window.showToast('Cảm ơn bạn đã bình chọn khảo sát độc giả!');
};

// 20. Story Mute / Video Toggle
window.toggleStoryMute = function(e, btn) {
    if (e) e.stopPropagation();
    const isMuted = btn.getAttribute('data-muted') === 'true';
    btn.setAttribute('data-muted', isMuted ? 'false' : 'true');
    btn.innerHTML = isMuted 
        ? `<svg class="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`
        : `<svg class="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
    window.showToast(isMuted ? 'Đã bật âm thanh Story' : 'Đã tắt âm thanh Story');
};

window.openStoryVideoAd = function() {
    window.openVideoModal('https://www.youtube.com/watch?v=lGC9zZ4lL2A', 'VinFast VF9 - Tiên phong Công nghệ Xe điện Việt Nam');
};


// ==========================================================================
// 21. RIGHT GUTTER VERTICAL AD AUTO-SLIDER (3 ẢNH DỌC TỰ ĐỘNG CHUYỂN SLIDE)
// ==========================================================================
let rightAdSlideIndex = 0;
let rightAdInterval = null;

function initRightGutterSlider() {
    const slider = document.getElementById('right-gutter-ad-slider');
    if (!slider) return;
    const slides = slider.querySelectorAll('.right-ad-slide');
    const dots = slider.querySelectorAll('.right-ad-dot');
    if (!slides.length) return;

    function showSlide(n) {
        slides.forEach((s, idx) => {
            if (idx === n) {
                s.style.opacity = '1';
                s.style.pointerEvents = 'auto';
            } else {
                s.style.opacity = '0';
                s.style.pointerEvents = 'none';
            }
        });
        dots.forEach((d, idx) => {
            if (idx === n) {
                d.classList.add('bg-red-600', 'w-4');
                d.classList.remove('bg-white/60', 'w-1.5');
            } else {
                d.classList.remove('bg-red-600', 'w-4');
                d.classList.add('bg-white/60', 'w-1.5');
            }
        });
        rightAdSlideIndex = n;
    }

    function nextSlide() {
        const next = (rightAdSlideIndex + 1) % slides.length;
        showSlide(next);
    }

    window.goToRightAdSlide = function(n) {
        showSlide(n);
        resetTimer();
    };

    function resetTimer() {
        if (rightAdInterval) clearInterval(rightAdInterval);
        rightAdInterval = setInterval(nextSlide, 3500);
    }

    slider.addEventListener('mouseenter', () => {
        if (rightAdInterval) clearInterval(rightAdInterval);
    });
    slider.addEventListener('mouseleave', resetTimer);

    showSlide(0);
    resetTimer();
}

// ==========================================================================
// 22. MOBILE NAVIGATION DRAWER (MENU CHO ĐIỆN THOẠI)
// ==========================================================================
window.toggleMobileMenu = function() {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (!drawer) return;
    if (drawer.classList.contains('active')) {
        window.closeMobileMenu();
    } else {
        window.openMobileMenu();
    }
};

window.openMobileMenu = function() {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (!drawer) return;
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeMobileMenu = function() {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (!drawer) return;
    drawer.classList.remove('active');
    document.body.style.overflow = '';
};

// Auto init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initRightGutterSlider();
    initStickyPinning();
    initCategoryRouter();
});

// ==========================================================================
// 23. STICKY NAVBAR & GUTTER PINNING ENGINE
// ==========================================================================
function initStickyPinning() {
    const nav = document.getElementById('main-navbar') || document.querySelector('nav');
    const leftGutter = document.querySelector('.side-gutter-ad.left-gutter');
    const rightGutter = document.querySelector('.side-gutter-ad.right-gutter');

    function onScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (nav) {
            if (scrollY > 150) {
                nav.classList.add('nav-pinned-active');
            } else {
                nav.classList.remove('nav-pinned-active');
            }
        }
        if (leftGutter) {
            leftGutter.style.top = '48px';
            leftGutter.style.position = 'sticky';
            leftGutter.style.alignSelf = 'flex-start';
        }
        if (rightGutter) {
            rightGutter.style.top = '48px';
            rightGutter.style.position = 'sticky';
            rightGutter.style.alignSelf = 'flex-start';
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
}

// ==========================================================================
// 24. CATEGORY DETAIL DYNAMIC ENGINE & GAP-FREE HERO ROUTER
// ==========================================================================
function initCategoryRouter() {
    // Only run on category-detail.html
    if (!document.getElementById('cat-hero-subside-container')) return;

    const params = new URLSearchParams(window.location.search);
    const catSlug = params.get('cat') || 'tin-tuc';
    const subParam = params.get('sub') || '';

    const CAT_CONFIG = {
        'tin-tuc': {
            name: 'Tin tức',
            title: 'CHUYÊN MỤC TIN TỨC',
            count: 'Hơn <strong>2.600</strong> tin bài thời sự',
            parentBreadcrumb: 'Tin tức',
            childBreadcrumb: 'Thời sự kinh tế',
            sponsorName: 'TẬP ĐOÀN ĐIỆN LỰC VIỆT NAM (EVN)',
            sponsorUrl: 'https://evn.com.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Thời sự trong ngày', sub: 'Thời sự' },
                { label: 'Chính sách & Pháp luật', sub: 'Chính sách' },
                { label: 'Kinh tế vĩ mô', sub: 'Kinh tế' },
                { label: 'Bộ Công Thương', sub: 'Bộ ngành' },
                { label: 'Địa phương', sub: 'Địa phương' }
            ]
        },
        'thuong-hieu': {
            name: 'Thương hiệu',
            title: 'CHUYÊN MỤC THƯƠNG HIỆU',
            count: 'Hơn <strong>850</strong> tin bài & phóng sự Thương hiệu Quốc gia',
            parentBreadcrumb: 'Thương hiệu',
            childBreadcrumb: 'Thương hiệu Quốc gia',
            sponsorName: 'SABECO - TỰ HÀO THƯƠNG HIỆU QUỐC GIA',
            sponsorUrl: 'https://sabeco.com.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Thương hiệu Quốc gia', sub: 'Thương hiệu Quốc gia' },
                { label: 'Tự hào hàng Việt', sub: 'Hàng Việt Nam' },
                { label: 'Sản phẩm OCOP', sub: 'OCOP' },
                { label: 'Doanh nghiệp tiêu biểu', sub: 'Doanh nghiệp tiêu biểu' }
            ]
        },
        'cong-nghiep': {
            name: 'Công nghiệp',
            title: 'CHUYÊN MỤC CÔNG NGHIỆP',
            count: 'Hơn <strong>3.200</strong> tin bài Năng lượng & Công nghiệp chế biến',
            parentBreadcrumb: 'Công nghiệp',
            childBreadcrumb: 'Năng lượng & Điện lực',
            sponsorName: 'TẬP ĐOÀN DẦU KHÍ VIỆT NAM (PETROVIETNAM)',
            sponsorUrl: 'https://pvn.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Năng lượng & Điện lực', sub: 'Năng lượng' },
                { label: 'Dầu khí & Xăng dầu', sub: 'Dầu khí' },
                { label: 'Công nghiệp chế biến', sub: 'Chế biến' },
                { label: 'Than & Khoáng sản', sub: 'Khoáng sản' }
            ]
        },
        'thuong-mai': {
            name: 'Thương mại',
            title: 'CHUYÊN MỤC THƯƠNG MẠI',
            count: 'Hơn <strong>2.800</strong> tin bài Xuất nhập khẩu & Thị trường',
            parentBreadcrumb: 'Thương mại',
            childBreadcrumb: 'Xuất nhập khẩu',
            sponsorName: 'CỤC XÚC TIẾN THƯƠNG MẠI (VIETRADE)',
            sponsorUrl: 'https://vietrade.gov.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Xuất nhập khẩu', sub: 'Xuất nhập khẩu' },
                { label: 'Thị trường nội địa', sub: 'Thị trường nội địa' },
                { label: 'Quản lý thị trường', sub: 'Quản lý thị trường' },
                { label: 'Xúc tiến thương mại', sub: 'Xúc tiến thương mại' }
            ]
        },
        'hoi-nhap': {
            name: 'Hội nhập',
            title: 'CHUYÊN MỤC HỘI NHẬP',
            count: 'Hơn <strong>1.900</strong> tin bài EVFTA, CPTPP & Hội nhập quốc tế',
            parentBreadcrumb: 'Hội nhập',
            childBreadcrumb: 'Hiệp định EVFTA',
            sponsorName: 'CỔNG THÔNG TIN FTAS BỘ CÔNG THƯƠNG',
            sponsorUrl: 'https://vietnamfta.gov.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Hiệp định EVFTA', sub: 'EVFTA' },
                { label: 'Hiệp định CPTPP', sub: 'CPTPP' },
                { label: 'AEC & RCEP', sub: 'RCEP' },
                { label: 'WTO & Quốc tế', sub: 'WTO' }
            ]
        },
        'khoa-hoc-cong-nghe': {
            name: 'Khoa học công nghệ',
            title: 'CHUYÊN MỤC KHOA HỌC CÔNG NGHỆ',
            count: 'Hơn <strong>1.400</strong> tin bài Chuyển đổi số & Công nghệ 4.0',
            parentBreadcrumb: 'Khoa học công nghệ',
            childBreadcrumb: 'Chuyển đổi số doanh nghiệp',
            sponsorName: 'TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI (VIETTEL)',
            sponsorUrl: 'https://viettel.com.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Chuyển đổi số', sub: 'Chuyển đổi số' },
                { label: 'Công nghệ 4.0', sub: 'Công nghệ 4.0' },
                { label: 'Đổi mới sáng tạo', sub: 'Đổi mới sáng tạo' }
            ]
        },
        'doanh-nghiep': {
            name: 'Doanh nghiệp',
            title: 'CHUYÊN MỤC DOANH NGHIỆP',
            count: 'Hơn <strong>2.100</strong> tin bài Doanh nghiệp & Chuyển đổi xanh',
            parentBreadcrumb: 'Doanh nghiệp',
            childBreadcrumb: 'Doanh nghiệp tiêu biểu',
            sponsorName: 'HIỆP HỘI DOANH NGHIỆP VIỆT NAM',
            sponsorUrl: 'https://vcci.com.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Doanh nghiệp tiêu biểu', sub: 'Doanh nghiệp tiêu biểu' },
                { label: 'Chuyển đổi xanh', sub: 'Chuyển đổi xanh' },
                { label: 'Khởi nghiệp Đổi mới', sub: 'Khởi nghiệp' }
            ]
        },
        'van-hoa-cong-thuong': {
            name: 'Văn hóa Công Thương',
            title: 'CHUYÊN MỤC VĂN HÓA CÔNG THƯƠNG',
            count: 'Hơn <strong>950</strong> tin bài Người lao động & Truyền thống ngành',
            parentBreadcrumb: 'Văn hóa Công Thương',
            childBreadcrumb: 'Người lao động',
            sponsorName: 'CÔNG ĐOÀN CÔNG THƯƠNG VIỆT NAM',
            sponsorUrl: 'https://congdoancongthuong.org.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Người lao động ngành', sub: 'Người lao động' },
                { label: 'Hoạt động đoàn thể', sub: 'Hoạt động đoàn thể' }
            ]
        },
        'tap-chi-anh': {
            name: 'Tạp chí ảnh',
            title: 'CHUYÊN MỤC TẠP CHÍ ẢNH',
            count: 'Hơn <strong>480</strong> phóng sự ảnh đa phương tiện độc quyền',
            parentBreadcrumb: 'Tạp chí ảnh',
            childBreadcrumb: 'Phóng sự ảnh chuyên đề',
            sponsorName: 'TẬP ĐOÀN DẦU KHÍ QUỐC GIA VIỆT NAM (PETROVIETNAM)',
            sponsorUrl: 'https://pvn.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Ảnh Công nghiệp', sub: 'Công nghiệp' },
                { label: 'Năng lượng & Điện gió', sub: 'Năng lượng' },
                { label: 'Xuất nhập khẩu & Cảng biển', sub: 'Xuất nhập khẩu' },
                { label: 'Làng nghề & OCOP', sub: 'Làng nghề' }
            ]
        },
        'video': {
            name: 'Video',
            title: 'CHUYÊN MỤC VIDEO & PHÓNG SỰ',
            count: 'Hơn <strong>3.200</strong> video tin tức & phóng sự điều tra',
            parentBreadcrumb: 'Video',
            childBreadcrumb: 'Bản tin truyền hình',
            sponsorName: 'TỔNG CÔNG TY THƯƠNG MẠI SÀI GÒN (SATRA)',
            sponsorUrl: 'https://satra.com.vn',
            subtabs: [
                { label: 'Tất cả', sub: '' },
                { label: 'Thời sự Công Thương', sub: 'Thời sự' },
                { label: 'Tiêu điểm tuần', sub: 'Tiêu điểm' },
                { label: 'Phóng sự chuyên đề', sub: 'Phóng sự' },
                { label: 'Talkshow', sub: 'Talkshow' }
            ]
        }
    };

    const cfg = CAT_CONFIG[catSlug] || CAT_CONFIG['tin-tuc'];

    // 1. Update Title & Meta
    document.title = `${cfg.title} - Truyền hình Công Thương`;

    // 2. Highlight active navbar item
    document.querySelectorAll('.nav-item-wrapper').forEach(el => {
        el.classList.remove('active');
        const link = el.querySelector('a');
        if (link) {
            const href = link.getAttribute('href') || '';
            if (href.includes(`cat=${catSlug}`)) {
                el.classList.add('active');
            }
        }
    });

    // 3. Update Headings & Breadcrumbs
    const mainTitleEl = document.getElementById('cat-main-title');
    if (mainTitleEl) mainTitleEl.textContent = cfg.title;

    const countEl = document.getElementById('cat-article-count');
    if (countEl) countEl.innerHTML = cfg.count;

    const pBreadcrumb = document.getElementById('cat-breadcrumb-parent');
    if (pBreadcrumb) pBreadcrumb.textContent = cfg.parentBreadcrumb;

    const cBreadcrumb = document.getElementById('cat-breadcrumb-child');
    if (cBreadcrumb) cBreadcrumb.textContent = subParam || cfg.childBreadcrumb;

    // 4. Update Sponsor
    const sponsorNameEl = document.getElementById('cat-sponsor-name');
    if (sponsorNameEl) sponsorNameEl.textContent = cfg.sponsorName;
    const sponsorLinkEl = document.getElementById('cat-sponsor-link');
    if (sponsorLinkEl) sponsorLinkEl.setAttribute('href', cfg.sponsorUrl);

    // 5. Update Subtabs
    const subtabsBox = document.getElementById('cat-subtabs-container');
    if (subtabsBox && cfg.subtabs) {
        subtabsBox.innerHTML = cfg.subtabs.map(tab => {
            const isActive = (!subParam && !tab.sub) || (subParam === tab.sub);
            const activeClass = isActive ? 'bg-[#be1016] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800';
            const url = tab.sub ? `category-detail.html?cat=${catSlug}&sub=${encodeURIComponent(tab.sub)}` : `category-detail.html?cat=${catSlug}`;
            return `<a href="${url}" class="px-3 py-1.5 ${activeClass} transition">${tab.label}</a>`;
        }).join('');
    }

    // 6. Load & Render Matching Articles from TVCT_DB
    if (window.TVCT_DB && TVCT_DB.articles) {
        let items = TVCT_DB.articles.filter(a => a.category_slug === catSlug);
        if (subParam) {
            const filtered = items.filter(a => 
                (a.sub_category && a.sub_category.toLowerCase().includes(subParam.toLowerCase())) ||
                (a.title && a.title.toLowerCase().includes(subParam.toLowerCase()))
            );
            if (filtered.length) items = filtered;
        }

        if (!items.length) {
            items = TVCT_DB.articles.filter(a => a.category_slug === catSlug);
        }
        if (!items.length) {
            items = TVCT_DB.articles.slice(0, 25);
        }

        renderCategoryContent(items, cfg.name);
    }
}

function renderCategoryContent(items, catName) {
    if (!items || items.length === 0) return;

    function getThumb(item) {
        const yt = item.youtube_url || '';
        const img = item.featured_image || item.thumbnail || '';
        let yid = '';
        if (yt.includes('v=')) yid = yt.split('v=')[1].split('&')[0];
        else if (yt.includes('youtu.be/')) yid = yt.split('youtu.be/')[1].split('?')[0];

        if (yid) return `https://i.ytimg.com/vi/${yid}/mqdefault.jpg`;
        if (img && img.startsWith('http')) return img;
        return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
    }

    // 1. Lead Article
    const lead = items[0];
    const leadLink = document.getElementById('cat-hero-lead-link');
    const leadImg = document.getElementById('cat-hero-lead-img');
    const leadTitle = document.getElementById('cat-hero-lead-title');
    const leadSapo = document.getElementById('cat-hero-lead-sapo');
    const leadDate = document.getElementById('cat-hero-lead-date');

    if (lead) {
        if (leadLink) leadLink.href = `new-detail.html?id=${lead.id}`;
        if (leadImg) {
            leadImg.src = getThumb(lead);
            leadImg.alt = lead.title;
        }
        if (leadTitle) {
            leadTitle.href = `new-detail.html?id=${lead.id}`;
            leadTitle.textContent = lead.title;
        }
        if (leadSapo) {
            leadSapo.textContent = lead.excerpt || lead.title;
        }
        if (leadDate) {
            leadDate.textContent = (lead.published_at || '2026-10-04').slice(0, 16);
        }
    }

    // 2. 6 Sub-articles on Right Side (Sub-hero 1..6 - EXACTLY 6 ARTICLES AS REQUESTED)
    const sideBox = document.getElementById('cat-hero-subside-container');
    if (sideBox) {
        const subSideItems = items.slice(1, 7);
        sideBox.innerHTML = subSideItems.map(item => `
            <article class="flex gap-2.5 pb-2 border-b border-gray-100 last:border-b-0">
                <a href="new-detail.html?id=${item.id}" class="video-thumb-frame w-28 aspect-16-9 flex-shrink-0 rounded-xs">
                    <img src="${getThumb(item)}" alt="${item.title.replace(/"/g, '&quot;')}" loading="lazy">
                    <span class="video-play-icon" style="width:22px;height:22px;">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                    </span>
                </a>
                <div class="flex-1 min-w-0 flex flex-col justify-between">
                    <span class="text-[9px] font-bold text-[#be1016] uppercase leading-none mb-0.5">${item.sub_category || catName}</span>
                    <h3 class="text-xs font-bold text-gray-900 leading-snug hover:text-[#be1016] line-clamp-2">
                        <a href="new-detail.html?id=${item.id}">${item.title}</a>
                    </h3>
                    <span class="text-[10px] text-gray-400 mt-0.5 leading-none">${(item.published_at || '2026-10-04').slice(0, 16)}</span>
                </div>
            </article>
        `).join('');
    }

    // 3. 4 Sub-articles in Bottom Row (Sub-hero 7..10)
    const bottomBox = document.getElementById('cat-hero-subbottom-container');
    if (bottomBox) {
        const subBottomItems = items.slice(7, 11);
        bottomBox.innerHTML = subBottomItems.map(item => `
            <article class="flex flex-col">
                <a href="new-detail.html?id=${item.id}" class="video-thumb-frame aspect-16-9 mb-2">
                    <img src="${getThumb(item)}" alt="${item.title.replace(/"/g, '&quot;')}" loading="lazy">
                    <span class="video-play-icon" style="width:30px;height:30px;">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                    </span>
                </a>
                <span class="text-[10px] font-bold text-[#be1016] uppercase mb-0.5">${item.sub_category || catName}</span>
                <h4 class="text-xs font-bold text-gray-900 hover:text-[#be1016] leading-snug line-clamp-2 mb-1">
                    <a href="new-detail.html?id=${item.id}">${item.title}</a>
                </h4>
                <span class="text-[10px] text-gray-400">${(item.published_at || '2026-10-04').slice(0, 10)}</span>
            </article>
        `).join('');
    }

    // 4. 10 Dense Stream Articles (Items 11..21)
    const streamBox = document.getElementById('cat-stream-articles-container');
    if (streamBox) {
        const streamItems = items.slice(11, 21);
        if (streamItems.length) {
            streamBox.innerHTML = streamItems.map((item, idx) => `
                <article class="flex flex-col sm:flex-row gap-4 pb-4 mb-4 border-b border-gray-150">
                    <a href="new-detail.html?id=${item.id}" class="video-thumb-frame horizontal-news-thumb sm:w-56 aspect-16-9 flex-shrink-0">
                        <img src="${getThumb(item)}" alt="${item.title.replace(/"/g, '&quot;')}" loading="lazy">
                        <span class="video-play-icon" style="width:34px;height:34px;">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                    </a>
                    <div class="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <span class="text-[11px] font-bold text-[#be1016] uppercase tracking-wider block mb-1">${item.sub_category || catName}</span>
                            <h3 class="text-base font-bold text-gray-900 leading-snug mb-1.5 hover:text-[#be1016]">
                                <a href="new-detail.html?id=${item.id}">${item.title}</a>
                            </h3>
                            <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">${item.excerpt || item.title}</p>
                        </div>
                        <div class="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                            <span class="font-medium text-gray-700 flex items-center gap-1">
                                <svg class="w-3 h-3 text-gray-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                ${item.author || 'Ban Biên tập'}
                            </span>
                            <span>•</span>
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                ${(item.published_at || '2026-10-04').slice(0, 16)}
                            </span>
                            <span>•</span>
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                ${item.views || (1500 + idx*130)} lượt đọc
                            </span>
                        </div>
                    </div>
                </article>
            `).join('');
        }
    }
}

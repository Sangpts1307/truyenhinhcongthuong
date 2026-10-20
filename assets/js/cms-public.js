(() => {
    const mastheadSlides = Array.from(document.querySelectorAll('.cms-masthead-slide'));
    if (mastheadSlides.length > 1) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let currentSlide = 0;
        let slideshowTimer;
        const syncMastheadPlayback = () => {
            clearInterval(slideshowTimer);
            if (document.hidden || reducedMotion.matches) return;
            slideshowTimer = setInterval(() => {
                // Skip an image that has not loaded; leave the current photo visible.
                let nextSlide = currentSlide;
                for (let offset = 1; offset < mastheadSlides.length; offset++) {
                    const candidate = (currentSlide + offset) % mastheadSlides.length;
                    if (mastheadSlides[candidate].complete && mastheadSlides[candidate].naturalWidth) {
                        nextSlide = candidate;
                        break;
                    }
                }
                if (nextSlide === currentSlide) return;
                mastheadSlides[currentSlide].classList.remove('is-active');
                currentSlide = nextSlide;
                mastheadSlides[currentSlide].classList.add('is-active');
            }, 6000);
        };
        document.addEventListener('visibilitychange', syncMastheadPlayback);
        reducedMotion.addEventListener('change', syncMastheadPlayback);
        syncMastheadPlayback();
    }

    const drawer = document.getElementById('mobile-menu-drawer');
    const search = document.getElementById('header-search-overlay-bar');
    const utilities = document.getElementById('header-utility-social-ads');
    window.expandHeaderSearch = () => {
        search?.classList.remove('hidden');
        utilities?.classList.add('invisible');
        document.getElementById('header-search-btn')?.setAttribute('aria-expanded', 'true');
        document.getElementById('header-search-input')?.focus();
    };
    window.collapseHeaderSearch = () => {
        search?.classList.add('hidden');
        utilities?.classList.remove('invisible');
        document.getElementById('header-search-btn')?.setAttribute('aria-expanded', 'false');
    };
    window.closeMobileMenu = () => {
        drawer?.classList.remove('active');
        if (drawer) drawer.inert = true;
        document.body.style.overflow = '';
        document.querySelector('[aria-label="Menu di động"]')?.setAttribute('aria-expanded', 'false');
    };
    window.toggleMobileMenu = () => {
        const open = drawer?.classList.toggle('active');
        if (drawer) drawer.inert = !open;
        document.body.style.overflow = open ? 'hidden' : '';
        document.querySelector('[aria-label="Menu di động"]')?.setAttribute('aria-expanded', String(Boolean(open)));
    };
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            window.closeMobileMenu();
            window.collapseHeaderSearch();
        }
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#header-search-wrapper')) window.collapseHeaderSearch();
    });
    document.querySelectorAll('[data-spotlight]').forEach((spotlight) => {
        const slides = [...spotlight.querySelectorAll('[data-spotlight-slide]')];
        const dots = [...spotlight.querySelectorAll('[data-spotlight-dot]')];
        let current = 0;
        const show = (index) => {
            current = index;
            slides.forEach((slide, position) => { slide.hidden = position !== current; });
            dots.forEach((dot, position) => {
                dot.classList.toggle('is-active', position === current);
                dot.setAttribute('aria-pressed', String(position === current));
            });
        };
        dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && slides.length > 1) {
            window.setInterval(() => {
                if (!spotlight.matches(':hover') && !spotlight.contains(document.activeElement)) show((current + 1) % slides.length);
            }, 5000);
        }
    });
    document.querySelectorAll('[data-scroll-target]').forEach((button) => {
        button.addEventListener('click', () => {
            const track = document.getElementById(button.dataset.scrollTarget);
            track?.scrollBy({ left: track.clientWidth * Number(button.dataset.scrollDirection), behavior: 'smooth' });
        });
    });
    document.querySelectorAll('[data-ad-carousel]').forEach((carousel) => {
        const slides = [...carousel.querySelectorAll('[data-ad-slide]')];
        const dots = [...carousel.querySelectorAll('[data-ad-dot]')];
        let current = 0;
        const show = (index) => {
            current = index;
            slides.forEach((slide, position) => { slide.hidden = position !== index; });
            dots.forEach((dot, position) => dot.setAttribute('aria-pressed', String(position === index)));
        };
        dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
        if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.setInterval(() => {
                if (!carousel.matches(':hover') && !carousel.contains(document.activeElement)) show((current + 1) % slides.length);
            }, 5000);
        }
    });
    document.querySelectorAll('[data-article-font]').forEach((button) => {
        button.addEventListener('click', () => {
            const body = document.getElementById('article-body-text');
            if (body) body.style.fontSize = `${Math.max(14, Math.min(24, parseFloat(getComputedStyle(body).fontSize) + Number(button.dataset.articleFont)))}px`;
        });
    });
    document.querySelector('[data-copy-article]')?.addEventListener('click', async () => {
        const status = document.querySelector('[data-copy-status]');
        try {
            await navigator.clipboard.writeText(location.href);
            if (status) status.textContent = 'Đã sao chép liên kết';
        } catch {
            if (status) status.textContent = 'Chọn địa chỉ trên trình duyệt để sao chép.';
        }
    });
    const backTop = document.getElementById('back-to-top');
    backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => { if (backTop) backTop.hidden = window.scrollY < 400; }, { passive: true });
})();

(() => {
    document.querySelectorAll('form[data-recaptcha-key]').forEach((form) => {
        let verifying = false;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (verifying) return;
            verifying = true;
            const button = form.querySelector('[type="submit"]');
            const status = form.querySelector('[data-recaptcha-status]');
            if (button) button.disabled = true;
            try {
                if (!window.grecaptcha) throw new Error('unavailable');
                await new Promise((resolve) => grecaptcha.ready(resolve));
                const token = await grecaptcha.execute(form.dataset.recaptchaKey, { action: 'comment' });
                if (!token) throw new Error('missing token');
                form.querySelector('[name="g-recaptcha-response"]').value = token;
                HTMLFormElement.prototype.submit.call(form);
            } catch {
                if (status) status.textContent = 'Không thể xác minh chống spam. Vui lòng thử lại.';
                verifying = false;
                if (button) button.disabled = false;
            }
        });
    });
    const popup = document.querySelector('[data-ad-popup]');
    if (popup?.showModal) {
        const key = `cms-ad-popup:${popup.dataset.adPopup}`;
        let seen = false;
        try { seen = sessionStorage.getItem(key) === '1'; } catch { /* Storage can be unavailable. */ }
        if (!seen) {
            popup.showModal();
            try { sessionStorage.setItem(key, '1'); } catch { /* Closing still works without storage. */ }
        }
        popup.querySelector('[data-ad-close]')?.addEventListener('click', () => popup.close());
        popup.addEventListener('close', () => popup.querySelectorAll('video').forEach((video) => video.pause()));
    }
})();

(() => {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
    const record = (url) => fetch(url, {
        method: 'POST', credentials: 'same-origin', keepalive: true,
        headers: { 'X-CSRF-TOKEN': csrf || '', Accept: 'application/json' },
    }).catch(() => {});
    const visibleAds = new Set();
    const recordedAds = new WeakSet();
    const timers = new WeakMap();
    const cancel = (element) => {
        clearTimeout(timers.get(element));
        timers.delete(element);
    };
    const schedule = (element) => {
        if (document.hidden || recordedAds.has(element) || timers.has(element)) return;
        timers.set(element, setTimeout(() => {
            timers.delete(element);
            if (!document.hidden && visibleAds.has(element)) {
                recordedAds.add(element);
                record(element.dataset.adImpression);
            }
        }, 1000));
    };
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(({ target, intersectionRatio, isIntersecting }) => {
                if (isIntersecting && intersectionRatio >= 0.5) {
                    visibleAds.add(target);
                    schedule(target);
                } else {
                    visibleAds.delete(target);
                    cancel(target);
                }
            });
        }, { threshold: [0, 0.5] });
        document.querySelectorAll('[data-ad-impression]').forEach((element) => observer.observe(element));
        document.addEventListener('visibilitychange', () => {
            visibleAds.forEach((element) => document.hidden ? cancel(element) : schedule(element));
        });
    }
    document.querySelectorAll('[data-ad-click]').forEach((element) => {
        element.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (link && link.getAttribute('href') !== element.dataset.adClick) record(element.dataset.adClick);
        });
    });
})();

(() => {
    document.querySelectorAll('form[data-search-suggest]').forEach((form, formIndex) => {
        const input = form.querySelector('input[name="q"]');
        if (!input) return;
        const list = document.createElement('div');
        list.id = `search-suggestions-${formIndex}`;
        list.setAttribute('role', 'listbox');
        list.setAttribute('aria-label', 'Bài viết gợi ý');
        list.hidden = true;
        Object.assign(list.style, {
            position: 'absolute', top: 'calc(100% + 4px)', left: '0', right: '0', zIndex: '100',
            background: '#fff', border: '1px solid #ddd', borderRadius: '6px',
            boxShadow: '0 4px 16px #0002', maxHeight: '60vh', overflowY: 'auto',
        });
        form.style.position = 'relative';
        form.append(list);
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-controls', list.id);
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('autocomplete', 'off');
        input.maxLength = 100;
        let timer;
        let controller;
        let generation = 0;
        let active = -1;
        let links = [];
        const close = () => {
            clearTimeout(timer);
            controller?.abort();
            generation++;
            list.hidden = true;
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
            active = -1;
        };
        const select = (index) => {
            active = index;
            links.forEach((link, position) => {
                link.setAttribute('aria-selected', String(position === index));
                link.style.background = position === index ? '#fff1f2' : '#fff';
            });
            if (links[index]) {
                input.setAttribute('aria-activedescendant', links[index].id);
                links[index].scrollIntoView({ block: 'nearest' });
            }
        };
        input.addEventListener('input', (event) => {
            close();
            if (event.isComposing) return;
            const query = input.value.trim();
            if ([...query].length < 2) return;
            const current = generation;
            timer = setTimeout(async () => {
                controller = new AbortController();
                try {
                    const url = new URL(form.dataset.searchSuggest, location.origin);
                    url.searchParams.set('q', query);
                    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
                    if (!response.ok) return;
                    const data = await response.json();
                    if (current !== generation || input.value.trim() !== query || document.activeElement !== input) return;
                    list.replaceChildren();
                    links = [];
                    (data.results || []).forEach((result, index) => {
                        const link = document.createElement('a');
                        link.id = `${list.id}-${index}`;
                        link.href = result.url;
                        link.setAttribute('role', 'option');
                        link.setAttribute('aria-selected', 'false');
                        Object.assign(link.style, { display: 'block', padding: '10px 12px', fontSize: '13px', lineHeight: '1.5', color: '#222' });
                        link.textContent = result.title;
                        if (result.category) {
                            const category = document.createElement('small');
                            category.textContent = result.category;
                            Object.assign(category.style, { display: 'block', color: '#777' });
                            link.append(category);
                        }
                        link.addEventListener('mouseenter', () => select(index));
                        list.append(link);
                        links.push(link);
                    });
                    if (!links.length) {
                        const empty = document.createElement('p');
                        empty.textContent = 'Không tìm thấy bài viết phù hợp.';
                        empty.style.padding = '10px 12px';
                        empty.style.fontSize = '13px';
                        empty.setAttribute('role', 'status');
                        list.append(empty);
                    }
                    list.hidden = false;
                    input.setAttribute('aria-expanded', 'true');
                } catch { /* Enter still opens the full search page if suggestions are unavailable. */ }
            }, 250);
        });
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') { close(); return; }
            if (list.hidden || !links.length) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                select((active + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length);
            } else if (event.key === 'Enter' && active >= 0) {
                event.preventDefault();
                location.assign(links[active].href);
            }
        });
        form.addEventListener('focusout', (event) => {
            if (!form.contains(event.relatedTarget)) close();
        });
        document.addEventListener('pointerdown', (event) => {
            if (!form.contains(event.target)) close();
        });
    });
})();

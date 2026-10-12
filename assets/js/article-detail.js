(() => {
  'use strict';

  const ALBUMS = [
    ['Đại công trường điện gió ngoài khơi: những cánh quạt khổng lồ đón gió biển Đông', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Tinh hoa làng nghề truyền thống và sản vật OCOP Việt Nam vươn ra biển lớn', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Nhịp sống mới trên những công trình năng lượng trọng điểm', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Cảng container quốc tế: cửa ngõ đưa hàng hóa Việt Nam vươn khơi', 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Những bàn tay giữ lửa ở làng nghề truyền thống', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Nhà máy thông minh và hành trình sản xuất xanh', 'assets/images/hero-evn-smart-grid.jpg'],
    ['Nông sản Việt trên hành trình chinh phục thị trường mới', 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Những chuyến tàu hàng nối dài nhịp phát triển', 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Gìn giữ giá trị văn hóa trong nhịp sống đương đại', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Năng lượng mặt trời và những mái nhà xanh', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Sắc màu phiên chợ hàng Việt vùng cao', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&h=934&q=85'],
    ['Hành trình số hóa đưa dịch vụ đến gần người dân', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&h=934&q=85']
  ];

  const GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&h=667&q=85',
    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&h=667&q=85',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&h=667&q=85',
    'https://images.unsplash.com/photo-1513828742146-cc5e7bca7e1a?auto=format&fit=crop&w=1000&h=667&q=85',
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&h=667&q=85'
  ];

  const labels = {
    video: 'Bản tin video',
    text: 'Bài viết',
    album: 'Album ảnh'
  };

  // Các bài cũ chưa có trường content_type trong dữ liệu. Khi biên tập thêm
  // content_type (video, text hoặc album), giá trị đó sẽ tự động được ưu tiên.
  const LEGACY_TYPE_BY_ARTICLE_ID = { 4: 'video' };

  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  const cleanExcerpt = (article) => {
    const withoutTitle = String(article.excerpt || '').replace(article.title || '', '').trim();
    return withoutTitle || 'Thông tin được Truyền hình Công Thương cập nhật.';
  };

  // Dữ liệu excerpt cũ có thể là bản cắt ngắn từ crawler và kết thúc bằng
  // dấu ba chấm. Với bản tin video, ưu tiên đoạn văn đầy đủ đầu tiên trong
  // nội dung để phần tóm tắt luôn hiển thị trọn vẹn.
  const fullVideoSummary = (article) => {
    const paragraphs = [...String(article.content || '').matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(([, paragraph]) => paragraph.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(paragraph => paragraph.length > 80 && !/(?:…|\.\.\.)\s*$/.test(paragraph));
    return paragraphs[0] || cleanExcerpt(article).replace(/\s*(?:…|\.\.\.)\s*$/, '');
  };

  const getVideoId = (article) => {
    const candidate = String(article.youtube_id || '').trim();
    return /^[A-Za-z0-9_-]{6,}$/.test(candidate) ? candidate : '';
  };

  const renderToolbar = () => `
    <div class="article-toolbar">
      <div class="article-font-controls" aria-label="Điều chỉnh cỡ chữ">
        <button type="button" onclick="window.adjustFontSize(-1)" title="Giảm cỡ chữ">A-</button>
        <button type="button" onclick="window.adjustFontSize(1)" title="Tăng cỡ chữ">A+</button>
      </div>
      <button type="button" class="article-share-button" onclick="window.showToast('Đang chia sẻ lên Facebook...')">Chia sẻ</button>
      <button type="button" class="article-copy-button" onclick="window.copyArticleLink()">Sao chép liên kết</button>
    </div>`;

  const renderHeader = (article, type) => `
    <header class="article-detail-header">
      <div class="article-format-label article-format-label--${type}">${labels[type]}</div>
      <a class="article-detail-category" href="category-detail.html?cat=${encodeURIComponent(article.category_slug || 'tin-tuc')}">${escapeHtml(article.category || 'Tin tức')}</a>
      <h1>${escapeHtml(article.title)}</h1>
      <div class="article-detail-meta">
        <span>${escapeHtml(article.author || 'Ban Biên tập Truyền hình Công Thương')}</span>
        <span aria-hidden="true">•</span>
        <time>${escapeHtml(String(article.published_at || '').replace(' ', ' • '))}</time>
      </div>
      ${renderToolbar()}
    </header>`;

  const renderVideo = (article) => {
    const videoId = getVideoId(article);
    const player = videoId
      ? `<div class="video-responsive-16-9"><iframe src="https://www.youtube.com/embed/${videoId}?rel=0" title="${escapeHtml(article.title)}" allowfullscreen></iframe></div>`
      : `<img class="article-video-poster" src="${escapeHtml(article.thumbnail)}" alt="${escapeHtml(article.title)}">`;
    return `${renderHeader(article, 'video')}
      <p id="article-body-text" class="article-video-summary">${escapeHtml(fullVideoSummary(article))}</p>
      <div class="article-video-main">${player}</div>`;
  };

  const renderText = (article) => `${renderHeader(article, 'text')}
    <p class="article-summary">${escapeHtml(cleanExcerpt(article))}</p>
    <figure class="article-hero-image">
      <img src="${escapeHtml(article.thumbnail)}" alt="${escapeHtml(article.title)}">
      <figcaption>Ảnh minh họa: Truyền hình Công Thương</figcaption>
    </figure>
    <div id="article-body-text" class="article-text-body">${article.content || ''}</div>`;

  const renderAlbum = (article, albumIndex) => {
    const album = ALBUMS[albumIndex] || [article.title, article.thumbnail];
    const albumArticle = {
      ...article,
      title: album[0],
      thumbnail: album[1],
      category: 'Tạp chí ảnh',
      category_slug: 'tap-chi-anh',
      author: 'Ban Ảnh Truyền hình Công Thương'
    };
    const images = [album[1], ...GALLERY_IMAGES];
    const gallery = images.map((image, index) => `
      <figure class="article-gallery-item ${index === 0 ? 'article-gallery-item--lead' : ''}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(album[0])}" loading="${index === 0 ? 'eager' : 'lazy'}">
        <figcaption>${index === 0 ? 'Khoảnh khắc tiêu biểu trong album ảnh.' : `Hình ảnh ${index + 1} trong album.`}</figcaption>
      </figure>`).join('');
    return `${renderHeader(albumArticle, 'album')}
      <p id="article-body-text" class="article-album-intro">${escapeHtml(cleanExcerpt(article))}</p>
      <div class="article-gallery">${gallery}</div>`;
  };

  const renderBreadcrumb = (article, type) => {
    const breadcrumb = document.querySelector('nav[aria-label="Breadcrumb"]');
    if (!breadcrumb) return;
    const category = type === 'album' ? 'Tạp chí ảnh' : (article.category || 'Tin tức');
    const slug = type === 'album' ? 'tap-chi-anh' : (article.category_slug || 'tin-tuc');
    breadcrumb.innerHTML = `<a href="homepage.html" class="hover:text-[#be1016]">Trang chủ</a><span>›</span><a href="category-detail.html?cat=${encodeURIComponent(slug)}" class="hover:text-[#be1016]">${escapeHtml(category)}</a><span>›</span><span class="text-gray-900 font-bold">${labels[type]}</span>`;
  };

  const init = () => {
    const root = document.getElementById('article-detail-content');
    const database = typeof TVCT_DB !== 'undefined' ? TVCT_DB : window.TVCT_DB;
    if (!root || !database) return;

    const params = new URLSearchParams(window.location.search);
    const article = database.getById(params.get('id') || 1);
    const requestedType = params.get('type');
    const configuredType = article.content_type || LEGACY_TYPE_BY_ARTICLE_ID[article.id] || 'text';
    const type = ['video', 'text', 'album'].includes(requestedType)
      ? requestedType
      : ['video', 'text', 'album'].includes(configuredType) ? configuredType : 'text';
    const albumIndex = Math.max(0, Math.min(ALBUMS.length - 1, Number(params.get('album') || 1) - 1));

    root.closest('article')?.setAttribute('data-article-type', type);
    renderBreadcrumb(article, type);
    document.title = `${type === 'album' ? ALBUMS[albumIndex][0] : article.title} | Truyền hình Công Thương`;
    root.innerHTML = type === 'video'
      ? renderVideo(article)
      : type === 'album'
        ? renderAlbum(article, albumIndex)
        : renderText(article);
  };

  init();
})();

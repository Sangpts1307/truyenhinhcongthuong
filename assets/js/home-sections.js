(() => {
  // Ảnh 3:2 chất lượng cao, không dùng thumbnail YouTube có sẵn dải đen.
  const categoryImages = [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1565514020179-026b92b2d1b5?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1513828742146-cc5e7bca7e1a?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&h=600&q=85',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&h=600&q=85'
  ];

  const categories = [
    {
      name: 'Công nghiệp', slug: 'cong-nghiep', start: 1,
      titles: [
        'EVNNPC phát huy vai trò phong trào sáng kiến cải tiến kỹ thuật và chuyển đổi số',
        'Doanh nghiệp ngành giấy đổi mới công nghệ để bảo vệ môi trường',
        'Dây cáp điện khẳng định vị thế tại thị trường trong nước',
        'Từ nỗi lo môi trường tro, xỉ thành vật liệu xây dựng',
        'Mô hình sản xuất công nghiệp thúc đẩy sản xuất thông minh',
        'Ngành điện miền Bắc đẩy mạnh công tác an toàn lao động',
        'Định vị tầm vóc và nòng cốt trong quá trình chuyển dịch năng lượng',
        'Ngành gốm sứ chuyển đổi số, đẩy mạnh phát triển thị trường nội địa',
        'Ngành phân bón chuyển đổi xanh để bảo vệ môi trường'
      ]
    },
    {
      name: 'Thương mại', slug: 'thuong-mai', start: 20,
      titles: [
        'Sản vật OCOP Việt Nam mở rộng thị trường xuất khẩu sang các nước EU',
        'Kết nối cung cầu, nâng tầm giá trị hàng Việt tại thị trường nội địa',
        'Doanh nghiệp chủ động thích ứng quy định xanh của thị trường quốc tế',
        'Hàng Việt chinh phục người tiêu dùng bằng chất lượng và đổi mới',
        'Xúc tiến thương mại số mở thêm cơ hội cho doanh nghiệp nhỏ',
        'Tận dụng ưu đãi FTA để đa dạng hóa thị trường xuất khẩu',
        'Thương mại điện tử xuyên biên giới đưa nông sản Việt vươn xa',
        'Thị trường bán lẻ giữ nhịp tăng trưởng tích cực',
        'Kết nối vùng nguyên liệu bền vững cho hàng hóa xuất khẩu'
      ]
    },
    {
      name: 'Khoa học công nghệ', slug: 'khoa-hoc-cong-nghe', start: 40,
      titles: [
        'Chuyển đổi số để tiết kiệm và sử dụng hiệu quả năng lượng',
        'Đổi mới sáng tạo tạo động lực phát triển công nghiệp hiện đại',
        'Ứng dụng dữ liệu lớn trong điều hành và quản trị doanh nghiệp',
        'Công nghệ số hỗ trợ doanh nghiệp nâng cao năng suất',
        'Tự động hóa giúp tối ưu dây chuyền sản xuất',
        'Giải pháp xanh cho mục tiêu phát triển bền vững',
        'Công nghệ mới mở rộng không gian phát triển cho ngành điện',
        'Nhân lực số là nền tảng của tăng trưởng dài hạn',
        'Hệ sinh thái đổi mới sáng tạo gắn với nhu cầu thị trường'
      ]
    },
    {
      name: 'Hội nhập quốc tế', slug: 'hoi-nhap', start: 60,
      titles: [
        'Việt Nam đảm nhiệm thành công vai trò đối tác toàn diện CPTPP và EVFTA',
        'Mở rộng hợp tác thương mại với các thị trường tiềm năng',
        'Doanh nghiệp Việt tận dụng cơ hội từ các hiệp định thương mại tự do',
        'Chuỗi cung ứng khu vực trước yêu cầu chuyển đổi xanh',
        'Nâng cao năng lực cạnh tranh trong bối cảnh hội nhập sâu rộng',
        'Xuất khẩu Việt Nam khẳng định vị thế tại thị trường quốc tế',
        'Tiêu chuẩn mới và hành trình chinh phục thị trường EU',
        'Hợp tác quốc tế thúc đẩy phát triển công nghiệp bền vững',
        'Kết nối giao thương, tạo dư địa tăng trưởng mới'
      ]
    }
  ];

  const albums = [
    ['Đại công trường điện gió ngoài khơi: những cánh quạt khổng lồ đón gió biển Đông', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Tinh hoa làng nghề truyền thống và sản vật OCOP Việt Nam vươn ra biển lớn', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Nhịp sống mới trên những công trình năng lượng trọng điểm', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Cảng container quốc tế: cửa ngõ đưa hàng hóa Việt Nam vươn khơi', 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Những bàn tay giữ lửa ở làng nghề truyền thống', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Nhà máy thông minh và hành trình sản xuất xanh', 'assets/images/hero-evn-smart-grid.jpg'],
    ['Nông sản Việt trên hành trình chinh phục thị trường mới', 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Những chuyến tàu hàng nối dài nhịp phát triển', 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Gìn giữ giá trị văn hóa trong nhịp sống đương đại', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Năng lượng mặt trời và những mái nhà xanh', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Sắc màu phiên chợ hàng Việt vùng cao', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&h=667&q=85'],
    ['Hành trình số hóa đưa dịch vụ đến gần người dân', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&h=667&q=85']
  ];

  const spotlightStories = [
    {
      id: 1,
      image: 'assets/images/hero-evn-smart-grid.jpg',
      title: 'EVNNPC phát huy vai trò phong trào sáng kiến cải tiến kỹ thuật và chuyển đổi số trong quản lý vận hành',
      excerpt: 'Tổng công ty Điện lực miền Bắc đẩy mạnh áp dụng công nghệ số, nâng cao năng suất lao động và bảo đảm cấp điện an toàn, ổn định.'
    },
    {
      id: 2,
      image: 'assets/images/vtv1-energy-news-studio.jpg',
      title: 'Định vị tầm vóc và nòng cốt trong quá trình chuyển dịch năng lượng',
      excerpt: 'Các giải pháp đồng bộ đang mở ra nền tảng phát triển năng lượng bền vững, đáp ứng yêu cầu tăng trưởng mới của nền kinh tế.'
    },
    {
      id: 3,
      image: 'https://i.ytimg.com/vi/9HnIZZ0Kvkw/hqdefault.jpg',
      title: 'Doanh nghiệp ngành giấy đổi mới công nghệ để bảo vệ môi trường',
      excerpt: 'Đổi mới công nghệ và quản trị xanh giúp doanh nghiệp giảm phát thải, nâng cao hiệu quả sản xuất.'
    },
    {
      id: 4,
      image: 'https://i.ytimg.com/vi/kiYPsWdo6m8/hqdefault.jpg',
      title: 'Dây cáp điện khẳng định vị thế tại thị trường trong nước',
      excerpt: 'Nâng chất lượng sản phẩm và đầu tư công nghệ đang giúp doanh nghiệp Việt chủ động hơn trong chuỗi cung ứng.'
    },
    {
      id: 5,
      image: 'https://i.ytimg.com/vi/GMcFabBa3Lk/hqdefault.jpg',
      title: 'Từ nỗi lo môi trường tro, xỉ thành vật liệu xây dựng',
      excerpt: 'Mô hình kinh tế tuần hoàn đưa phụ phẩm công nghiệp trở thành nguồn vật liệu có giá trị.'
    }
  ];

  function renderCategory(category, index) {
    const cards = category.titles.map((title, itemIndex) => {
      const articleId = category.start + itemIndex;
      const image = categoryImages[(itemIndex + index * 3) % categoryImages.length];
      return `<article class="uniform-category-card">
        <a href="new-detail.html?id=${articleId}" class="uniform-category-image">
          <img src="${image}" alt="${title}" loading="lazy">
          <span class="uniform-category-play" aria-hidden="true">▶</span>
        </a>
        <h3><a href="new-detail.html?id=${articleId}">${title}</a></h3>
      </article>`;
    }).join('');
    return `<section class="uniform-category-section" aria-label="Chuyên mục ${category.name}">
      <div class="uniform-section-heading"><h2><a href="category-detail.html?cat=${category.slug}">${category.name}</a></h2><a href="category-detail.html?cat=${category.slug}" class="uniform-section-more">Xem tất cả →</a></div>
      <div class="uniform-category-grid">${cards}</div>
    </section>`;
  }

  function renderAlbums() {
    const cards = albums.map(([title, image], index) => `<article class="album-card">
      <a href="new-detail.html?id=${index + 1}" class="album-image"><img src="${image}" alt="${title}" loading="lazy"><span>${index + 6} ẢNH</span></a>
      <h3><a href="new-detail.html?id=${index + 1}">${title}</a></h3>
    </article>`).join('');
    return `<div class="uniform-section-heading album-heading"><h2><a href="category-detail.html?cat=tap-chi-anh">Album ảnh</a></h2><a href="category-detail.html?cat=tap-chi-anh" class="uniform-section-more">Xem tất cả →</a></div><div class="album-grid">${cards}</div>`;
  }

  function initSpotlight() {
    const image = document.querySelector('#spotlight-image');
    const link = document.querySelector('#spotlight-link');
    const title = document.querySelector('#spotlight-title');
    const excerpt = document.querySelector('#spotlight-excerpt') || document.querySelector('#spottelight-excerpt');
    const dots = document.querySelector('#spotlight-dots');
    if (!image || !link || !title || !excerpt || !dots) return;

    let active = 0;
    let timer;
    const show = (next) => {
      active = (next + spotlightStories.length) % spotlightStories.length;
      const story = spotlightStories[active];
      image.classList.add('is-changing');
      window.setTimeout(() => {
        image.src = story.image;
        image.alt = story.title;
        link.href = `new-detail.html?id=${story.id}`;
        title.href = link.href;
        title.textContent = story.title;
        excerpt.textContent = story.excerpt;
        image.classList.remove('is-changing');
      }, 180);
      [...dots.children].forEach((dot, index) => dot.classList.toggle('is-active', index === active));
    };
    dots.innerHTML = spotlightStories.map((_, index) => `<button type="button" aria-label="Tiêu điểm ${index + 1}" class="${index === 0 ? 'is-active' : ''}"></button>`).join('');
    [...dots.children].forEach((dot, index) => dot.addEventListener('click', () => { show(index); reset(); }));
    const reset = () => { window.clearInterval(timer); timer = window.setInterval(() => show(active + 1), 3000); };
    reset();
  }

  function init() {
    const categoryRoot = document.querySelector('#uniform-category-sections');
    const albumRoot = document.querySelector('#full-width-albums');
    if (categoryRoot) categoryRoot.innerHTML = categories.map(renderCategory).join('');
    if (albumRoot) albumRoot.innerHTML = renderAlbums();
    initSpotlight();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

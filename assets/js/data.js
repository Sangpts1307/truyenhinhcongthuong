const siteData = {
  menu: [
    { label: 'Trang chủ', href: 'index.html' }, { label: 'Tin tức', href: 'category.html' },
    { label: 'Công nghiệp', href: 'category.html' }, { label: 'Thương mại', href: 'category.html' },
    { label: 'Hội nhập', href: 'category.html' }, { label: 'Thương hiệu', href: 'category.html' },
    { label: 'Khoa học công nghệ', href: 'category.html' }, { label: 'Doanh nghiệp', href: 'category.html' }
  ],
  hero: {
    category: 'Công nghiệp', date: '22.09.2026',
    title: 'Định vị tầm vóc mới của ngành năng lượng trong chuyển dịch xanh',
    excerpt: 'Ngành năng lượng đang từng bước nâng cao năng lực cạnh tranh, đóng vai trò nòng cốt trong bảo đảm an ninh năng lượng và phát triển bền vững.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=85'
  },
  featured: [
    ['Tin tức','Diễn đàn phòng vệ thương mại 2026: Kiến tạo động lực tăng trưởng','https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=80'],
    ['Thương mại','Chuỗi cung ứng toàn cầu mở ra cơ hội mới cho doanh nghiệp Việt','https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=700&q=80'],
    ['Khoa học công nghệ','Chuyển đổi số để tiết kiệm và sử dụng hiệu quả năng lượng','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80'],
    ['Doanh nghiệp','Công nghiệp hỗ trợ tăng tốc đổi mới sáng tạo','https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=700&q=80'],
    ['Thương hiệu','Đưa thương hiệu Việt tiến sâu vào thị trường quốc tế','https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80'],
    ['Hội nhập','Kết nối giao thương Việt Nam với các đối tác mới','https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=700&q=80']
  ].map(([category,title,image], i) => ({ category, title, image, date: `${18 - i}.09.2026` })),
  latest: [
    ['08:30','Ngành gốm sứ chuyển đổi số, đẩy mạnh phát triển thị trường nội địa'],
    ['07:45','Mở rộng kết nối chuỗi cung ứng ngành thực phẩm, đồ uống'],
    ['Hôm qua','Ứng dụng công nghệ thực tế ảo kiến tạo môi trường làm việc an toàn'],
    ['Hôm qua','Kim ngạch xuất nhập khẩu lập kỷ lục mới'],
    ['20.09','Nông sản vùng cao vươn xa trên nền tảng số']
  ].map(([time,title], i) => ({time,title, category: i % 2 ? 'Thương mại' : 'Tin tức'})),
  videos: [
    ['Toàn cảnh chuyển dịch năng lượng xanh tại Việt Nam','https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'],
    ['Sức sống hàng Việt: Kết nối vùng miền','https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'],
    ['Thương hiệu quốc gia trong kỷ nguyên mới','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80']
  ].map(([title,image], i) => ({title,image,duration:`${12 + i}:2${i}`})),
  sections: [
    { name: 'Tin tức', lead: 'Diễn đàn phòng vệ thương mại 2026: Kiến tạo động lực mới cho tăng trưởng', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80', links: ['Bộ Công Thương tiếp nhận chức năng quản lý địa chất, khoáng sản', 'Khởi động TechFest 2026: Đưa sản phẩm khởi nghiệp Việt ra thị trường toàn cầu', 'Hội nghị thúc đẩy chuyển đổi xanh trong sản xuất'] },
    { name: 'Công nghiệp', lead: 'Mô hình sản xuất thông minh thúc đẩy năng lực cạnh tranh mới', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80', links: ['Dây cáp điện khẳng định vị thế tại thị trường trong nước', 'Từ tro xỉ đến vật liệu xây dựng bền vững', 'Doanh nghiệp đổi mới công nghệ để phát triển xanh'] },
    { name: 'Thương mại', lead: 'Quảng bá hàng Việt, kích cầu tiêu dùng nội địa', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80', links: ['Đẩy mạnh xúc tiến thương mại cho sản phẩm địa phương', 'Nâng cao sức cạnh tranh qua hoạt động khuyến công', 'Kết nối giao thương Việt Nam – quốc tế'] }
  ],
  articles: [
    {category:'Tin tức', title:'Diễn đàn phòng vệ thương mại 2026: Kiến tạo động lực tăng trưởng', date:'18.09.2026', image:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80', excerpt:'Diễn đàn là không gian kết nối chính sách, doanh nghiệp và chuyên gia nhằm tăng sức chống chịu cho nền kinh tế.'},
    {category:'Công nghiệp', title:'Định vị tầm vóc mới của ngành năng lượng trong chuyển dịch xanh', date:'22.09.2026', image:'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80', excerpt:'Phát triển năng lượng xanh mở ra cơ hội để Việt Nam tham gia sâu hơn vào chuỗi giá trị toàn cầu.'},
    {category:'Thương mại', title:'Chuyển dịch chuỗi cung ứng toàn cầu: Cơ hội cho doanh nghiệp Việt', date:'17.09.2026', image:'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=900&q=80', excerpt:'Doanh nghiệp cần chủ động nâng chuẩn quản trị để nắm bắt các đơn hàng chất lượng cao.'},
    {category:'Khoa học công nghệ', title:'Chuyển đổi số để tiết kiệm và sử dụng hiệu quả năng lượng', date:'16.09.2026', image:'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', excerpt:'Dữ liệu và công nghệ đang giúp tối ưu tiêu thụ năng lượng trong hoạt động sản xuất.'},
    {category:'Doanh nghiệp', title:'Công nghiệp hỗ trợ tăng tốc đổi mới sáng tạo', date:'15.09.2026', image:'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=900&q=80', excerpt:'Đầu tư chiều sâu và liên kết chuỗi là hướng đi quan trọng của doanh nghiệp công nghiệp hỗ trợ.'}
  ]
};

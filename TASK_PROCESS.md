# Tiến độ triển khai giao diện CMS View

> Nguồn yêu cầu: `task.md`  
> Rà soát gần nhất: 12/10/2026
> Cách dùng: đổi `- [ ]` thành `- [x]` khi hạng mục đã hoàn tất và được kiểm tra trên giao diện. Mục **Cần rà soát** là hạng mục đã có một phần triển khai nhưng chưa đáp ứng trọn vẹn yêu cầu, nên chưa tick.

## 1. Nền tảng thương hiệu

- [x] Dùng Playfair Display cho tiêu đề bài viết.
- [x] Dùng Roboto cho nội dung bài viết.
- [ ] Dùng logo ảnh động bánh răng xoay tròn.

## 2. Header và điều hướng

### Bố cục header

- [x] Bỏ banner lớn ở đầu trang và dùng header gọn hơn.
- [x] Thiết kế lại header, dành đủ không gian cho logo và phần nhận diện thương hiệu.
- [ ] Giữ hình ảnh/định hướng thị giác theo thiết kế gốc sau khi thay header.
- [ ] Tạo slideshow ảnh tự chạy ở bên phải, nằm trong một khung lớn; hoặc thay bằng một video.
- [ ] Phương án thay thế: dùng ảnh làm nền header, đặt slideshow phủ lên trên nhưng vẫn bảo đảm nền sáng và chữ dễ đọc.

### Tiện ích và menu

- [ ] Ẩn nút **Đăng ký bản tin** ở giao diện công khai và thêm cấu hình bật/tắt từ admin.
- [ ] Làm thanh menu bớt phẳng, có xử lý thị giác phù hợp.
- [x] Đổi tab **Video** thành **Bản tin**.
- [ ] Đổi tab **Tạp chí ảnh** thành **Album ảnh**.
- [ ] Ẩn danh mục con ở giao diện công khai và thêm cấu hình bật/tắt từ admin.
- [ ] Tắt thanh **Tin nóng 24/7** ở giao diện công khai và thêm cấu hình bật/tắt từ admin.

**Cần rà soát:** tab chính đã đổi thành `BẢN TIN`; nhãn Album trên trang chủ hiện bị gõ thành `ALBUMN ẢNH` nên chưa thể tick. Tin nóng đã được ẩn ở trang chủ nhưng vẫn còn ở các trang khác; newsletter vẫn đang hiển thị và chưa có cấu hình admin.

## 3. Trang chủ / nội dung giữa trang

### Bố cục và quảng cáo

- [x] Quy hoạch lại bố cục tổng thể theo cấu trúc yêu cầu bên dưới.
- [x] Bỏ toàn bộ quảng cáo bên trái, chỉ giữ quảng cáo bên phải để mở rộng vùng nội dung chính.
- [x] Đặt banner quảng cáo ngang giữa khối Top 10 và khối chuyên mục.
- [ ] Bỏ quảng cáo ở cuối trang.
- [ ] Tạm ẩn khối **Đồng hành cùng…**, đồng thời chuẩn bị cấu hình bật/tắt trong admin và nội dung thay thế. *(Đã ẩn ở giao diện; phần cấu hình admin chưa thực hiện.)*

**Cần rà soát:** banner ngang và quảng cáo phải dạng slideshow vẫn được giữ; quảng cáo trái và khối “Đồng hành cùng Thương hiệu Quốc gia Việt Nam” đã được ẩn bằng CSS. Cần chuyển các trạng thái này sang cấu hình admin khi có backend.

### Khối nội dung đầu trang

- [x] Chia phần đầu thành ba khu: trái là **Tin đọc nhiều nhất** (theo khung ver3); giữa/phải là **Tiêu điểm bản tin** và **Bản tin mới nhất / Tin tức nhanh**.
- [x] Hiển thị Bản tin mới nhất theo dạng tin chữ hoặc tin ảnh, luôn có tiêu đề/nội dung chữ và thumbnail.
- [ ] Với album ảnh trong Bản tin mới nhất, tự chuyển/lật qua các ảnh trong album.
- [x] Dùng ảnh phẳng cho Bản tin mới nhất, không có khung đen bao quanh ảnh.
- [ ] Đặt Tiêu điểm bản tin mặc định là video mới nhất.
- [x] Làm slider cho Tiêu điểm bản tin: 5 bài, tự chuyển mỗi 3 giây, đồng thời đổi ảnh/video đại diện, tiêu đề và mô tả.
- [x] Gộp **Tin tức nhanh** vào cùng một khối với **Bản tin mới nhất**.

### Dòng thời sự và chuyên mục

- [x] Đặt **Dòng thời sự** (Top 10 tin theo khung ver3) trước các chuyên mục.
- [ ] Giữ Top 10 tin video được xếp theo lượt xem.
- [x] Ẩn các danh mục con nằm dưới từng chuyên mục ở giao diện công khai.
- [x] Hiển thị đủ 4 danh mục chính, chia đều hai cột.
- [x] Mỗi danh mục hiển thị lưới 3 × 3, tức 9 bài viết/danh mục.
- [x] Bố trí 4 danh mục thành tổng cộng 6 hàng theo yêu cầu thiết kế.
- [x] Có khối album ảnh nằm dưới các chuyên mục và trải rộng theo vùng nội dung chính.
- [x] Chuẩn hóa tỷ lệ ảnh album là 3:2.
- [ ] Tự resize/crop ảnh được đăng từ admin về kích thước hoặc pixel chuẩn.

**Cần rà soát:** trang hiện có đầy đủ khung Tin đọc nhiều nhất, Tiêu điểm, Bản tin mới, Dòng thời sự Top 10, 4 chuyên mục × 9 bài và Album 12 ảnh. Toàn bộ danh sách/slider hiện dùng dữ liệu mockup tĩnh; cần nối dữ liệu thực, trong đó Top 10 phải được xếp theo lượt xem.

## 4. Footer

- [ ] Cập nhật nội dung footer đúng theo website cũ/nguồn thực tế đã được xác nhận.
- [ ] Cho phép chỉnh sửa nội dung footer từ admin.
- [ ] Ẩn phần **Liên hệ quảng cáo** ở giao diện công khai.

**Cần rà soát:** footer đã có khung thông tin liên hệ, nhưng vẫn có mục “Liên hệ quảng cáo” và chưa có bằng chứng về cấu hình quản trị.

## 5. Trang chi tiết bài viết

- [ ] Với tin video: ưu tiên video làm nội dung chính, giảm phần chữ.
- [ ] Với tin text: ưu tiên phần nội dung chữ.
- [x] Tắt chức năng đọc AI ở cả tin video và tin text.
- [ ] Đổi **Dòng thời sự 24/7** thành **Top 10 tin quan tâm**, không hiển thị mốc thời gian.
- [x] Bỏ khối Top 10 ở cuối trang chi tiết.
- [x] Bỏ khối video quan tâm ở trang chi tiết.

**Cần rà soát:** nút “Nghe đọc bài” đã được comment/ẩn. Trang chi tiết mẫu hiện ưu tiên video, nhưng chưa có logic phân loại dữ liệu để tự đổi layout riêng cho tin video và tin text.

## 6. Hạng mục admin và kiểm thử chung

- [ ] Xác định vị trí cấu hình admin cho: newsletter, danh mục con, Tin nóng 24/7, khối Đồng hành cùng và footer.
- [ ] Bổ sung các cờ bật/tắt tương ứng nếu hệ thống admin chưa có.
- [ ] Kiểm thử desktop, tablet và mobile cho header, menu, slider, các khối nội dung và footer.
- [ ] Kiểm thử dữ liệu thực: thứ tự Top 10 theo lượt xem, video mới nhất, danh sách tin mới và ảnh album.

## Nhật ký cập nhật

| Ngày | Nội dung |
| --- | --- |
| 09/10/2026 | Tạo file tiến độ từ `task.md`; đối chiếu sơ bộ với mã giao diện hiện có và chỉ tick các hạng mục xác nhận được trực tiếp từ mã nguồn. |
| 09/10/2026 | Đổi khung nội dung dùng chung cho toàn site: bỏ quảng cáo trái, mở rộng vùng tin bài; trang chủ có khối Tin đọc nhiều nhất, Dòng thời sự Top 10 hai cột và bố cục chuyên mục hai cột theo tham chiếu `u2`. |
| 09/10/2026 | Cân lại khối đầu trang; dùng ảnh local 1376 × 768 cho hai tin đầu; bổ sung slider Tiêu điểm 5 bài/3 giây. Chuẩn hóa 4 danh mục thành lưới 2 × 2, mỗi mục 9 bài (3 × 3), và đặt Album ảnh 3:2 full-width bên dưới. |
| 09/10/2026 | Chuẩn hóa thumbnail dạng ảnh crop kín 3:2, không dùng thumbnail video có dải đen; đổi menu Video thành Bản tin trên các trang; Album ảnh hiển thị 12 bài, 6 cột × 2 hàng trên desktop. |
| 09/10/2026 | Tinh chỉnh khối đầu trang: Bản tin mới không còn nền/border đen; Tiêu điểm có vùng ảnh, tiêu đề, mô tả và tin liên quan cố định để slider không làm nhảy bố cục; Dòng thời sự bỏ thời gian, trạng thái cập nhật và các đường kẻ đen. |
| 09/10/2026 | Bỏ các đường phân cách đen ở vùng nội dung và Album ảnh; chuyển Bản tin mới thành tin ảnh/chữ không có icon video, tiêu đề ba dòng; căn cố định cột nhãn của Top 10 để toàn bộ hàng thẳng nhau. |
| 12/10/2026 | Rà soát lại toàn bộ tiến độ theo mã hiện tại; tick các hạng mục đã xác nhận và ghi rõ phần còn thiếu là dữ liệu thực, cấu hình admin hoặc logic phân loại bài viết. |

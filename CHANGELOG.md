# Changelog

## 4.2.1 — 2026-10-19

- Sửa bố cục điều khiển TV khi toàn màn hình: giữ lớp điều khiển phủ đúng video khi nhận focus.
- Tự ẩn điều khiển sau 3,5 giây khi đang phát; giữ mở khi tạm dừng hoặc chỉnh cài đặt.
- OK phát/tạm dừng trực tiếp, lên/xuống mở điều khiển, trái/phải tua nhanh; Back đóng từng lớp theo thứ tự.
- Tách cài đặt âm thanh/phụ đề khỏi thanh phát, hỗ trợ giữ focus và thoát fullscreen dự phòng.

## 4.2.0 — 2026-10-19

- Giao diện TV riêng với sidebar cố định, chữ và poster tối ưu cho màn hình lớn, toàn bộ luồng chính dùng bốn hướng và OK.
- Quản lý focus theo nhóm; giữ focus trong modal/fullscreen, phục hồi đúng phim và vị trí cuộn khi quay lại; hỗ trợ key/keyCode của remote cũ và chặn OK lặp.
- Tìm kiếm bằng bàn phím QWERTY có chữ hoa, ký hiệu và tiếng Việt; giữ bản nháp khi mở phim từ gợi ý rồi quay lại.
- Mã QR riêng cạnh bàn phím để nhập tìm kiếm bằng điện thoại. Phiên 15 phút, token điện thoại và TV riêng, tiếp tục gửi khi TV đang ở kết quả, thu hồi khi rời tìm kiếm hoặc tạo QR mới.
- Banner có khung ổn định từ lúc mở trang và hiển thị trọn ảnh; sửa lỗi cuộn hụt sau khi tải dữ liệu.
- Sửa thẻ thư viện tràn khỏi cột, tiêu đề dài chồng lên phim bên cạnh; thêm tab rõ ràng, tiến độ xem và thao tác bỏ ẩn riêng.
- Chi tiết TV có nhóm 30 tập, phiên bản/ngôn ngữ, yêu thích/theo dõi/ẩn, phim tương tự, thông tin và bình luận bằng bàn phím màn hình.
- Điều khiển TV trong fullscreen: phát/dừng, tua, tập trước/sau, intro/outro, âm lượng, phụ đề, tốc độ và tự chuyển tập.
- Dừng HLS/embed khi về thông tin phim; ngăn tải lại luồng khi lưu tiến độ sau chuyển tập; tránh kết quả skip-times cũ ghi đè tập mới.
- Sửa đích quay lại từ trang chủ không có hash; nhận diện con trỏ chính xác để máy tính có chuột không tự chuyển sang TV lúc tải chậm.
- Dữ liệu cá nhân, đề xuất, API danh mục và bộ phát được dùng chung với web. Giữ tương thích các luồng desktop hiện có.
- Xác minh: server/client build thành công, Svelte 0 lỗi/cảnh báo, 183 unit tests và 22 ca Chromium E2E qua. Bao phủ 960×540, 1280×720, 1920×1080 và phiên điện thoại 390×844. Codec/remote/fullscreen của TV thật vẫn cần kiểm tra trên thiết bị.

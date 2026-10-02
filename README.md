# Đông 33
Website HTML/CSS/JavaScript thuần. Mở index.html để xem thử.

Đưa toàn bộ nội dung thư mục lên gốc repository GitHub. Import repo trong Vercel với Framework Preset: Other, không cần Build Command.

index.html chứa nội dung; style.css chứa giao diện; app.js chứa tương tác; assets chứa hình ảnh.

Video nằm trong hero; hình Lát chỉ dùng tại Sống Rì Lát. Video giới thiệu và lịch hẹn chưa kết nối. Facebook, YouTube và Zalo đã có link chính thức.

## Kết nối form với Google Sheet

1. Tạo một Google Sheet mới → menu **Tiện ích → Apps Script**.
2. Xoá code mẫu, dán toàn bộ nội dung file `google-apps-script.gs` → Lưu.
3. **Triển khai → Tùy chọn triển khai mới** → loại **Ứng dụng web** → "Thực thi với tư cách": Tôi, "Người có quyền truy cập": **Bất kỳ ai** → Triển khai → cấp quyền.
4. Copy URL Web App (dạng `https://script.google.com/macros/s/.../exec`), dán vào dòng `const LEAD_ENDPOINT = '';` ở đầu `app.js`.
5. Đăng ký thử trên web → kiểm tra tab "Dang ky" trong Sheet.

Đã kết nối (02/10/2026): Sheet "Đăng ký 15 phút – dong33.online" trên tài khoản dong33share@gmail.com, email báo về cskh@trambaohiem.com. Muốn đổi email nhận: sửa `NOTIFY_EMAIL` trong Apps Script → Lưu → Triển khai → Quản lý triển khai → Sửa → Phiên bản mới.

## Đổi video giới thiệu (không cần sửa code)

Mở Sheet "Đăng ký 15 phút – dong33.online" → tab **Cau hinh** → dán link YouTube vào ô **B1** (watch, youtu.be, shorts đều được). Web tự đổi ảnh bìa và phát video trong popup. Xoá ô B1 → trang quay lại "Video giới thiệu sắp có".

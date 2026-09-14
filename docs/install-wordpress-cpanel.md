# Cài WordPress trên cPanel

Hướng dẫn cài WordPress trên host dùng **cPanel**. Chọn **Cách A** (1-click, khuyên dùng);
nếu host không có trình cài tự động thì dùng **Cách B** (thủ công).

## Chuẩn bị (làm 1 lần)
1. **Domain đã trỏ về host chưa?** Nếu mua domain ở nơi khác → đổi **nameservers** của domain sang nameservers mà host cung cấp (thường có trong email chào mừng của host). Chờ vài giờ để cập nhật.
2. **SSL (https)**: cPanel → **SSL/TLS Status** → tick domain → **Run AutoSSL** (Let's Encrypt, miễn phí).
3. **PHP 8.1+**: cPanel → **Select PHP Version** (hoặc **MultiPHP Manager**) → chọn **8.1** trở lên.

---

## Cách A — Cài 1-click bằng Softaculous (khuyên dùng)
1. Đăng nhập **cPanel** (thường `tên-miền/cpanel` hoặc qua trang quản lý của nhà cung cấp).
2. Kéo tới nhóm **"Software"** → mở **"WordPress Manager by Softaculous"** / **"Softaculous Apps Installer"** / icon **WordPress** *(một số host gọi **"WP Toolkit"**)*.
3. Bấm **Install** (chọn **Custom Install** để chỉnh chi tiết).
4. Điền:
   - **Choose Protocol**: `https://` (nếu đã bật SSL) — hoặc `https://www.` tùy bạn thích có www hay không.
   - **Choose Domain**: chọn domain của bạn.
   - **In Directory**: **ĐỂ TRỐNG** để site ở gốc (`tenmien.com`). *(Điền "wp" chỉ khi muốn site nằm ở `tenmien.com/wp`.)*
   - **Site Name / Site Description**: tên + mô tả site (sửa được sau).
   - **Admin Username**: đặt khác `admin` (bảo mật). **Admin Password**: đặt mạnh. **Admin Email**: email của bạn.
   - **Language**: English (nội dung site là tiếng Anh).
   - Phần chọn theme/plugin: **bỏ qua** (mình sẽ upload theme CloudPixel riêng).
5. Bấm **Install** → chờ ~1–2 phút → nó hiện 2 link: **địa chỉ site** và **trang quản trị** (`tenmien.com/wp-admin`). Database MySQL được tạo tự động.
6. Vào `tenmien.com/wp-admin`, đăng nhập bằng user/password vừa đặt.

✅ Xong. Chuyển sang **[wordpress-setup.md](wordpress-setup.md)** để cài theme + import 129 mục.

---

## Cách B — Cài thủ công (khi host không có Softaculous)
1. **Tạo database**: cPanel → **MySQL® Database Wizard**:
   - Tạo **Database** (vd `cloudpixel_db`).
   - Tạo **User** + mật khẩu mạnh.
   - **Add user to database** → tick **ALL PRIVILEGES**.
   - **Ghi lại**: tên DB, user, password (cần ở bước 5).
2. **Tải WordPress**: vào <https://wordpress.org/download/> → tải `wordpress.zip`.
3. **Upload**: cPanel → **File Manager** → vào thư mục gốc website (thường **`public_html`**) → **Upload** `wordpress.zip` → chuột phải **Extract**.
   - Nếu giải nén ra thư mục con `wordpress/` → mở nó, chọn tất cả, **Move** ra ngoài `public_html` (để site ở gốc, không phải `/wordpress`).
4. **Chạy cài đặt**: mở trình duyệt tới `tenmien.com` → trình cài WordPress hiện ra → chọn ngôn ngữ.
5. Nhập thông tin DB: **Database Name / Username / Password** (từ bước 1), **Database Host** = `localhost`, Table Prefix để mặc định `wp_` → **Submit** → **Run the installation**.
6. Nhập **Site Title**, **Username/Password admin**, **Email** → **Install WordPress** → đăng nhập tại `/wp-admin`.

---

## Sau khi cài xong (tóm tắt — chi tiết ở wordpress-setup.md)
1. Appearance → Themes → **Upload Theme** → `cloudpixel-theme.zip` → **Activate**.
2. Settings → **Permalinks** → **Post name** → Save.
3. Tools → **Import → WordPress** → upload `cloudpixel.xml` (129 mục).
4. Cài plugin: Rank Math (SEO), ThirstyAffiliates/Pretty Links (cloak link affiliate), LiteSpeed/WP Rocket (tốc độ).

## Xử lý sự cố thường gặp
| Triệu chứng | Cách xử lý |
|---|---|
| Vào domain ra trang host mặc định | Domain chưa trỏ đúng nameservers, hoặc site cài trong thư mục con. |
| "Error establishing a database connection" (Cách B) | Sai tên DB/user/password, hoặc chưa gán user vào DB với ALL PRIVILEGES; Host = `localhost`. |
| Không thấy Softaculous | Host không hỗ trợ → dùng Cách B, hoặc hỏi nhà cung cấp bật WP Toolkit. |
| Trang trắng / lỗi PHP | Đặt PHP 8.1+ trong Select PHP Version. |
| Chưa có https | SSL/TLS Status → Run AutoSSL. |

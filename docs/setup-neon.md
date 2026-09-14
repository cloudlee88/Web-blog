# Kết nối Neon & nạp dữ liệu (local)

Mục tiêu: cắm database Neon (Postgres, free) vào smallcorner để **7 category + 20 bài
review** hiện lên tại `http://localhost:3000`.

Toàn bộ mất ~10 phút.

---

## 1. Tạo database trên Neon (miễn phí)

1. Vào <https://neon.tech> → **Sign up** (đăng nhập bằng GitHub/Google cho nhanh).
2. **Create project** → đặt tên (vd `smallcorner`), region gần bạn (vd Singapore).
3. Sau khi tạo, Neon hiện ô **Connection string** — bấm **Copy**.
   - 💡 **Mẹo cho bước local:** trong ô đó, **tắt** tuỳ chọn *"Connection pooling"*
     (lấy chuỗi *direct*). Chuỗi direct chạy `prisma migrate` mượt hơn.
   - Chuỗi trông như:
     `postgresql://<user>:<password>@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

## 2. Dán vào `.env`

Mở file `.env` ở gốc dự án, thay dòng `DATABASE_URL` bằng chuỗi vừa copy, và đặt
`ADMIN_SECRET` thành chuỗi ngẫu nhiên dài:

```bash
DATABASE_URL="postgresql://...@ep-xxxx....neon.tech/neondb?sslmode=require"
ADMIN_SECRET="dan-mot-chuoi-ngau-nhien-that-dai"   # tạo: openssl rand -base64 32
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> `.env` đã được gitignore — an toàn, không lên GitHub.

## 3. Tạo bảng + nạp dữ liệu

Chạy lần lượt (ở thư mục dự án):

```bash
npx prisma migrate dev --name init   # tạo toàn bộ bảng theo schema
npm run db:seed                      # 7 category + affiliate links + 2 bài blog
npm run import                       # 20 bài review từ content-import/tools/*.md
```

Kỳ vọng thấy:
```
✓ 7 categories
✓ 6 affiliate links
✓ 2 posts
✅ Imported 20 tool(s) into the database.
```

## 4. Chạy web

```bash
npm run dev
```

Mở **<http://localhost:3000>** — giờ đã có dữ liệu thật:

| Xem gì | URL |
|---|---|
| Home (featured + rankings) | `/` |
| Danh sách đầy đủ + filter | `/full-list` |
| Trang category | `/category/ai-chatbots` |
| **Trang review sâu** | `/tools/chatgpt` · `/tools/midjourney` |
| Tìm kiếm | `/search?q=writing` |
| Admin (nhập `ADMIN_SECRET`) | `/admin` |
| Redirect affiliate (test) | `/go/jasper` → nhảy sang target + ghi click |

> ⚠️ Nếu server dev đang chạy sẵn từ trước: **tắt và chạy lại** `npm run dev` sau khi
> sửa `.env` (Next chỉ đọc biến môi trường lúc khởi động).

---

## Cập nhật / thêm bài về sau

- Sửa nội dung một tool: sửa file `.md` tương ứng rồi `npm run import` (upsert, an toàn chạy lại).
- Thêm tool mới: copy `content-import/tools/_TEMPLATE.md` → điền → `npm run import:check` → `npm run import`.
- Đổi target/coupon của affiliate link: vào `/admin` (mục Affiliate links) — không cần sửa code.

## Xử lý sự cố

| Triệu chứng | Cách xử lý |
|---|---|
| `Can't reach database server` | Kiểm tra `DATABASE_URL` đúng chưa; chuỗi phải có `?sslmode=require`. |
| `prisma migrate` treo/lỗi pooling | Dùng chuỗi **direct** (tắt Connection pooling ở Neon). |
| Web vẫn trống sau khi seed | Tắt và chạy lại `npm run dev` để nạp lại `.env`. |
| Trang tool 404 | Slug phải khớp file, vd `/tools/chatgpt`. Chạy `npm run import` chưa? |

## Khi deploy lên Vercel (sau này)

- Trên Vercel, dùng chuỗi **pooled** của Neon cho `DATABASE_URL` (chịu tải serverless tốt hơn),
  và thêm biến `DIRECT_URL` = chuỗi direct; khi đó thêm `directUrl = env("DIRECT_URL")` vào
  block `datasource db` trong `prisma/schema.prisma`.
- Build command: `prisma generate && prisma migrate deploy && next build`.
- Sau deploy, nạp dữ liệu production: chạy `npm run db:seed && npm run import` (với env production),
  hoặc dùng admin/`POST /api/content`.

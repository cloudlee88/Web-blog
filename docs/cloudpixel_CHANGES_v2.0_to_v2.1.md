# CLOUDPIXEL — Bản tóm tắt thay đổi (v2.0 → v2.1) cho Claude Code

> **Mục đích:** File này liệt kê các thay đổi so với bộ tài liệu cũ (**cloudpixel v2.0**) để Claude Code nắm nhanh phần delta. Nguồn sự thật đầy đủ vẫn là 4 file: `cloudpixel_PRD_final.md`, `cloudpixel_PDR_final.md`, `cloudpixel_TechStack_final.md`, `cloudpixel_Implementation_Plan_final.md`. Nếu có mâu thuẫn ở đâu, **ưu tiên bản v2.1**.

---

## 0. TL;DR
- **Đổi tên:** cloudpixel → **CloudPixel**
- **Chốt phạm vi:** focus **AI/Tech** (bỏ Entertainment/du lịch)
- **Traffic:** cân bằng **SEO + social**
- **Tính năng mới:** **Buying Guides**, **Verdict/Score box**, trang **How We Review**
- **Thiết kế:** bản sắc **cảm hứng The Verge** — nhưng **giữ trang chủ directory** (không dùng feed tin tức)

---

## 1. Đổi tên thương hiệu
- Mọi chỗ `cloudpixel` / `CloudPixel` → **CloudPixel**.
- Dòng disclosure: `"Affiliate link — CloudPixel may earn a commission if you sign up through this link."`
- Domain giả định: `cloudpixel.com` — ⚠️ **cần xác nhận domain + trademark còn trống trước khi hardcode**. Dùng biến `NEXT_PUBLIC_SITE_URL`, không hardcode domain rải rác.
- Route affiliate: `cloudpixel.com/go/[slug]`.
- Lưu ý: tên "Cloudlee Review" **chỉ còn có thể** xuất hiện như *nhãn của một mục Blog giọng cá nhân* (tùy chọn), KHÔNG phải tên site.

## 2. Phạm vi nội dung (Scope)
- **Trước (đang cân nhắc):** mở rộng đa mảng kiểu The Verge — Tech / AI / Entertainment / du lịch / chill.
- **Chốt v2.1:** **focus AI/Tech**. Categories = **AI, Tools, Digital Products**. KHÔNG làm giải trí/du lịch (giữ topical authority cho SEO tiếng Anh).

## 3. Tính năng MỚI (so với v2.0)

### 3.1 Best-of Buying Guides — MỚI
- Content type mới: bài "Best AI [X] 2026" — danh sách tool **xếp hạng**, mỗi mục có **mini-verdict + CTA affiliate**, link tới review chi tiết.
- **Prisma model mới:**
  `Guide { id, slug, title, intro (markdown), items (JSON: [{toolId, rank, miniVerdict, score}]), updatedAt, metaTitle, metaDescription }`
- **Route mới:** `/best/[slug]`.
- Mục tiêu: nhắm **từ khóa thương mại** ("best X", "top X for Y"), tăng internal linking, CTR affiliate cao. (FR-2b.1 → FR-2b.4)

### 3.2 Verdict/Score box — MỚI (nâng cấp trang review)
- Trang review (`/tools/[slug]`) thêm **hộp tóm tắt nổi bật ở đầu trang**: điểm số lớn + hai cột **"The Good / The Bad"** + verdict 2–3 câu + **CTA affiliate/coupon** + disclosure.
- Yêu cầu: scan được trong ~5 giây, nằm trên màn hình đầu tiên (above the fold). (FR-2.6)

### 3.3 Trang "How We Review" (methodology) — MỚI
- Trang tĩnh: quy trình đánh giá, tiêu chí chấm điểm, quan hệ affiliate & độc lập biên tập.
- **Route mới:** `/methodology`. Link từ mỗi review + footer. Mục tiêu: E-E-A-T. (FR-2.7)

## 4. Thiết kế (PDR) — thay đổi
- Bản sắc **cảm hứng The Verge (lấy tinh thần, không copy mô hình tin tức):**
  - 1 **accent color mạnh** (dải hero màu điện) + **tiêu đề section cỡ đại (display type)**.
  - Typography tương phản: heading đậm/cá tính + body dễ đọc (cân nhắc serif nhẹ).
  - Cơ chế **"Follow topic"** — làm sau (Phase 3+).
- ⚠️ **KHÔNG** bê nguyên feed tin tức (StoryStream). **Giữ trang chủ directory** (card grid + bảng ranking).

## 5. Traffic / Go-to-market — thay đổi
- Cân bằng **SEO + social** (trước đây thiên SEO).
- **SEO:** review sâu + buying guides + methodology (E-E-A-T) + long-tail.
- **Social:** tái chế mỗi review/guide thành post ngắn; auto-post đa kênh ở **Phase 4**. Nguyên tắc: đăng **"nội dung giá trị + link về web"**, KHÔNG bắn link affiliate thẳng lên social (dễ bị bóp tương tác/khóa).
- Thêm nút **Share** + **OG image** đẹp cho mỗi trang.

## 6. Delta kỹ thuật gọn cho Claude Code
- **Prisma:** thêm model `Guide` (bên cạnh Tool, Category, Tag, AffiliateLink, ClickLog, Post, Subscriber). **Không** có `User`/`Vote` ở MVP.
- **App routes thêm:** `/best/[slug]`, `/methodology`.
- **Nav header:** `Best Guides — Categories (AI/Tools/Digital) — Blog — Search — Newsletter`. **Footer** thêm link `How We Review`.
- **Trang review:** thêm component `VerdictBox` (score + Good/Bad + CTA).

## 7. KHÔNG đổi (giữ nguyên từ v2.0)
- Stack: **Next.js (App Router, TS) + PostgreSQL (Neon) + Prisma + Tailwind/shadcn**, hosting **Vercel**.
- Kiến trúc **DB-backed, API-writable** (`/api/content`) — nền cho tự động hóa.
- **`/go/[slug]`** cloaking + ghi `ClickLog`; ranking = **biên tập + trending theo click** (không tài khoản/upvote ở MVP).
- **Admin CRUD** bảo vệ bằng `ADMIN_SECRET`.
- ~**30–50 tool** lúc launch. Nội dung **tiếng Anh**.
- Mọi affiliate link **bắt buộc** qua `/go/[slug]` + **bắt buộc** có disclosure cạnh CTA.

## 8. Nếu đã lỡ scaffold theo v2.0 (checklist migrate)
- [ ] Rename toàn bộ brand refs → CloudPixel; dùng `NEXT_PUBLIC_SITE_URL`.
- [ ] Thêm Prisma model `Guide` + tạo migration.
- [ ] Thêm route `/best/[slug]` và `/methodology`.
- [ ] Cập nhật nav header + footer (Best Guides, How We Review).
- [ ] Thêm `VerdictBox` vào template review.
- [ ] Áp accent color + display headers theo PDR mục 1 (bản sắc mới).

---
**Nguồn đầy đủ (đặt trong `docs/`):** `cloudpixel_PRD_final.md` · `cloudpixel_PDR_final.md` · `cloudpixel_TechStack_final.md` · `cloudpixel_Implementation_Plan_final.md`.

# SMALLCORNER — Tech Stack & Agent Instructions — FINAL

> **Dành cho Claude Code:** Đây là nguồn tham chiếu kỹ thuật duy nhất cho dự án **smallcorner**. Đọc toàn bộ trước khi thay đổi code. Đặt bản rút gọn của file này tại `CLAUDE.md` ở gốc repo để tự động nạp làm ngữ cảnh. Kiểm tra quy ước cấu hình Claude Code mới nhất tại https://docs.claude.com/en/docs/claude-code/overview.

**Định vị:** Hybrid directory + review sâu, nội dung tiếng Anh, mô hình affiliate. DB-backed, API-writable (sẵn sàng tự động hóa nội dung đa kênh sau này).

---

## 1. Vì sao chọn stack này (đã đổi so với bản draft đầu)
Bản draft đầu dùng MDX-in-Git cho blog review. Sau khi chốt mô hình **hybrid directory + tự động hóa đăng bài đa kênh về sau**, kiến trúc đổi sang **DB-backed** vì:
- Directory cần dữ liệu có cấu trúc (tool, category, tag, rank, click log) — DB hợp hơn file MDX rời rạc.
- Tự động hóa cần nội dung **ghi được qua API** — bot không bấm CMS/không commit MDX thủ công. DB + API route giải quyết trực tiếp.
- Vẫn **gần $0**: Neon free (Postgres) + Vercel Hobby. Không còn là "$0 tuyệt đối, không DB" — đây là đánh đổi có chủ đích để phục vụ tầm nhìn tự động hóa.

## 2. Cấu trúc Repository
```Plaintext
smallcorner/
├── src/
│   ├── app/
│   │   ├── (marketing)/          # Home, About, Contact, Disclosure
│   │   ├── tools/[slug]/         # Trang review chi tiết
│   │   ├── category/[slug]/      # Trang category
│   │   ├── tag/[slug]/           # Trang tag
│   │   ├── full-list/            # Directory đầy đủ + filter
│   │   ├── blog/[slug]/          # Blog / Tutorial / News
│   │   ├── search/
│   │   ├── go/[slug]/            # Route Handler redirect affiliate (cloaking)
│   │   ├── admin/                # Khu quản trị (bảo vệ auth) — CRUD tool/review
│   │   └── api/                  # Route Handlers: content (write), newsletter, search, click
│   ├── components/               # Card, RatingBadge, CTAButton, ComparisonTable, RankingList...
│   ├── features/                 # tools/, reviews/, affiliate/, newsletter/, admin/
│   ├── lib/                      # db.ts (Prisma), seo.ts, email.ts, affiliate.ts, analytics.ts, markdown.ts
│   ├── hooks/
│   └── schemas/                  # Zod schemas (content, form, API payload)
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                   # Seed 30–50 tool ban đầu
├── content-import/               # Script/dataset import hàng loạt (Phase 2)
├── public/
├── docs/                         # PRD_final, PDR_final, TechStack_final, Implementation_Plan_final
├── .env.example
└── CLAUDE.md
```

## 3. Bảng Tech Stack
| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Framework | Next.js 14+ App Router, TypeScript (strict) | SSG/ISR cho SEO, Route Handlers thay backend riêng |
| Database | PostgreSQL trên **Neon** (free tier) | Lưu tool, category, tag, review, affiliate link, click log, subscriber |
| ORM | Prisma | Type-safe, migration hợp Claude Code |
| Nội dung dài | Markdown lưu trong DB, render bằng `next-mdx-remote`/`react-markdown` | Giữ tính API-writable (khác MDX-in-Git) |
| Styling | Tailwind CSS + shadcn/ui | Đồng bộ design system PDR |
| Forms | React Hook Form + Zod | |
| Auth (admin) | Auth đơn giản cho `/admin` + `/api` (VD NextAuth Credentials hoặc middleware + secret) | KHÔNG có tài khoản người dùng công khai ở MVP |
| Email/Newsletter | ConvertKit **hoặc** Brevo qua API | Subscriber lưu ở ESP; DB chỉ giữ bản dự phòng nếu cần |
| Search | Postgres full-text / `ILIKE` (đủ ở quy mô vài trăm tool) + filter client-side | Nâng cấp Algolia nếu cần sau |
| SEO | Next.js Metadata API + `next-sitemap` + JSON-LD (Review/Article/Product) | |
| Analytics | GA4 + Vercel Speed Insights | |
| Hosting | **Vercel** (Hobby đầu, nâng Pro khi cần) | ISR, Image Optimization, preview deploy theo PR |
| Ảnh | `next/image` | Core Web Vitals |
| VCS/CI | GitHub + Vercel Git Integration | Deploy tự động theo push/PR |

## 4. Quy tắc chung (BẮT BUỘC)
1. **Không hardcode secret** — chỉ dùng `.env` / `.env.example`.
2. **Đọc `docs/PRD_final.md` + `docs/PDR_final.md`** trước khi thêm tính năng.
3. **Mọi affiliate link phải qua `/go/[slug]`** — không nhúng link affiliate trực tiếp trong nội dung.
4. **Mọi CTA affiliate/coupon phải có dòng disclosure** đi kèm (PDR mục 9) — không được lược bỏ.
5. **KHÔNG thêm tài khoản người dùng công khai / upvote** ở MVP (quyết định sản phẩm — dùng ranking biên tập + trending theo click).
6. **Nội dung phải ghi được qua API** (`/api/content`) — không quay lại mô hình chỉ-file-thủ-công, để giữ đường cho tự động hóa.
7. **TypeScript strict, không dùng `any`** — dùng `unknown` + validate Zod.

## 5. Data Model (Prisma — phác thảo)
```
Tool        { id, slug, name, logoUrl, screenshotUrl, categoryId, shortDesc,
              rating, pricing (free/paid/freemium), editorialRank, featured,
              verified, reviewBody (markdown), pros[], cons[], useCases[],
              affiliateSlug, createdAt, updatedAt }
Category    { id, slug, name, description }
Tag         { id, slug, name }  // quan hệ n-n với Tool
AffiliateLink { id, slug, targetUrl, network, couponCode?, active }
ClickLog    { id, affiliateSlug, createdAt, referrer, userAgentHash }  // ẩn danh
Post        { id, slug, title, type (blog|tutorial|news), body (markdown),
              publishedAt, metaTitle, metaDescription }
Subscriber  { id, email, createdAt }  // dự phòng; nguồn chính ở ESP
```
Không có `User`/`Vote` ở MVP. "Trending" = truy vấn tổng hợp trên `ClickLog`.

## 6. Route Handlers
| Route | Chức năng |
|---|---|
| `GET /go/[slug]` | Tra `AffiliateLink` theo slug → ghi `ClickLog` → redirect 302. Slug không tồn tại → 404 tùy chỉnh. |
| `POST /api/content` | (Bảo vệ auth) Tạo/cập nhật Tool/Post — nền cho tự động hóa. Validate Zod. |
| `POST /api/newsletter` | Nhận email → gọi API ESP thêm subscriber. |
| `GET /api/search` | Tìm kiếm tool/post (Postgres full-text). |

**Quy tắc:** dùng Prisma (không raw SQL trừ khi cần); click log ẩn danh (hash UA, không lưu IP đầy đủ); lỗi hiển thị thân thiện theo PDR mục 7.

## 7. Data fetching & Rendering
- Trang tool/category/list: **SSG + ISR** (revalidate ~1h) — cân bằng SEO/tốc độ và cập nhật.
- Nội dung động (search, click, form): Route Handlers gọi từ client.
- Review body: markdown trong DB → render server-side.

## 8. Tầm nhìn Tự động hóa (Phase 4 — thiết kế trước, build sau)
- `/api/content` là **điểm vào duy nhất** để tạo nội dung → cả admin lẫn bot đều dùng.
- Luồng: 1 nội dung gốc → AI sinh bản review (web) + bản ngắn theo từng social → đăng đồng thời.
- Đăng social: ưu tiên **dịch vụ đa kênh** (Ayrshare/Buffer/Publer) hoặc automation (Make/n8n) thay vì tự tích hợp API từng nền tảng.
- **Cảnh báo:** social hạn chế link affiliate + cross-post spam dễ bị bóp/khóa → thiết kế "nội dung giá trị + link về web", không bắn affiliate thẳng.

## 9. `.env.example`
```
DATABASE_URL=
ADMIN_SECRET=              # bảo vệ /admin + /api/content
ESP_API_KEY=              # ConvertKit / Brevo
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=
```

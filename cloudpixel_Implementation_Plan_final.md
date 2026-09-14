# CLOUDPIXEL — Kế hoạch Triển khai với Claude Code — FINAL

**Tài liệu đi kèm:** PRD_final, PDR_final, TechStack_final.
**Định hướng đã chốt:** Hybrid directory + review sâu · tiếng Anh · Vercel · Next.js + Neon/Postgres + Prisma · ~30–50 tool lúc launch · ranking biên tập + trending (không tài khoản/upvote) · sẵn sàng tự động hóa đa kênh về sau.

---

## 1. Nguyên tắc làm việc với Claude Code
- Đặt `docs/PRD_final.md`, `docs/PDR_final.md`, `docs/TechStack_final.md` vào repo **trước khi code**; tạo `CLAUDE.md` rút gọn ở gốc trỏ tới 3 file này để mỗi phiên Claude Code có đúng ngữ cảnh, tránh tự suy đoán kiến trúc khác đi.
- Làm theo **branch/PR nhỏ**, mỗi PR map với 1–2 task bên dưới → Vercel tạo preview deploy riêng để review.
- Sau mỗi Phase, chạy **QA checklist** (mục 7) trước khi sang Phase tiếp.
- Hoàn thành **Phase 0 → Phase 2** trước khi công bố (đây là MVP).

## 2. Phase 0 — Chuẩn bị hạ tầng (bạn tự làm, không phải việc của Claude Code)
| # | Việc | Ghi chú |
|---|---|---|
| 0.1 | Đăng ký domain (~$10–12/năm — khoản duy nhất nên chi) | Tránh dùng subdomain miễn phí cho site affiliate/SEO |
| 0.2 | Tạo GitHub repo | |
| 0.3 | Tạo Vercel, liên kết repo (auto-deploy `main` + preview PR) | |
| 0.4 | Tạo Postgres trên Neon (free) → lấy `DATABASE_URL` | |
| 0.5 | Tạo GA4 + Google Search Console | |
| 0.6 | Đăng ký ESP (ConvertKit/Brevo) → API key | |
| 0.7 | Đăng ký affiliate cho các tool sẽ review đầu tiên | Ưu tiên tool có chương trình affiliate rõ ràng |
| 0.8 | Cài Claude Code, trỏ vào repo | |

## 3. Phase 1 — Nền tảng kỹ thuật
| # | Task | Output |
|---|---|---|
| 1.1 | Scaffold Next.js 14 + TS (strict) + Tailwind + shadcn/ui | `npm run dev` chạy |
| 1.2 | Tạo cấu trúc thư mục theo TechStack mục 2 | |
| 1.3 | Setup Prisma + `DATABASE_URL`, tạo schema (Tool/Category/Tag/AffiliateLink/ClickLog/Post/Subscriber) | `prisma migrate dev` thành công |
| 1.4 | Viết `seed.ts` khung + seed vài tool mẫu | Dữ liệu vào DB, query được |
| 1.5 | Setup render markdown (`next-mdx-remote`/`react-markdown`) | Review body render đúng |
| 1.6 | Layout khung: Header/Footer, theme màu/typography theo PDR | |
| 1.7 | ESLint/Prettier/`.env.example` | |
| 1.8 | Deploy lần đầu lên Vercel (placeholder) | Xác nhận CI/CD + kết nối DB production |

## 4. Phase 2 — MVP (map PRD Phase 1)
| # | Task | FR |
|---|---|---|
| 2.1 | Component: Tool Card, Rating/Rank badge, Featured/Trending/Verified badge | FR-1.1, FR-2.2, FR-4.1 |
| 2.2 | Home: hero + search + card grid + section theo category | FR-1.1 |
| 2.3 | Home: bảng xếp hạng cuối trang (Featured/Trending/Category + "See all") | FR-1.2 |
| 2.4 | Trang Category + Full List | FR-1.3 |
| 2.5 | **Trang Tool Detail (review sâu)** đủ cấu trúc PDR 4.3 | FR-2.1, FR-2.3, FR-2.4, FR-2.5 |
| 2.6 | `/go/[slug]` redirect + ghi ClickLog | FR-3.2, FR-3.4 |
| 2.7 | CTA affiliate + disclosure + coupon block | FR-3.1, FR-3.3 |
| 2.8 | Trang Affiliate Disclosure, About, Contact | FR-3.5 |
| 2.9 | Admin CRUD (bảo vệ `ADMIN_SECRET`) cho tool/review/affiliate link | FR-6.1 |
| 2.10 | Trending theo click (7/30 ngày) | FR-4.2 |
| 2.11 | SEO cơ bản: Metadata API, `next-sitemap`, robots.txt | FR-7.1, FR-7.2 |
| 2.12 | GA4 + event click affiliate | FR-8.2 |
| 2.13 | Seed + viết 30–50 review (bạn + AI hỗ trợ draft, bạn biên tập) | FR-6.3 |
| 2.14 | QA vòng 1 (mục 7) → **launch MVP** | |

## 5. Phase 3 — Tối ưu hóa (map PRD Phase 2)
| # | Task | FR |
|---|---|---|
| 3.1 | Search (Postgres full-text) + filter Free/Paid/Rating/Tag | FR-1.5 |
| 3.2 | Trang Tag | FR-1.4 |
| 3.3 | Comparison table component | (PDR 5) |
| 3.4 | Newsletter (inline + popup) + tích hợp ESP | FR-8.1 |
| 3.5 | JSON-LD schema (Review/Article/Product) | FR-7.4 |
| 3.6 | Blog/Tutorial/News (markdown trong DB) + list/phân trang | FR-5.1, FR-5.2 |
| 3.7 | `/api/content` (write, có auth) — hoàn thiện làm nền tự động hóa | FR-6.2 |
| 3.8 | Search Console: submit sitemap, theo dõi index | FR-8.3 |
| 3.9 | Tinh chỉnh Core Web Vitals đạt "Good" | FR-7.3 |

## 6. Phase 4 — Mở rộng & Tự động hóa (làm khi có nhu cầu thực tế)
| # | Task |
|---|---|
| 4.1 | Import pipeline hàng loạt (`content-import/`) từ API/dataset |
| 4.2 | Luồng tự động: 1 nội dung → AI biến thể → đăng web (`/api/content`) + social |
| 4.3 | Tích hợp dịch vụ đăng đa kênh (Ayrshare/Buffer) hoặc Make/n8n |
| 4.4 | (Tùy chọn) Tài khoản người dùng + submit tool (paid featured listing) |

## 7. QA Checklist trước mỗi Launch/Release
- [ ] Lighthouse Performance/SEO/Accessibility ≥ 90
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Mọi CTA affiliate/coupon có disclosure (kiểm tra thủ công từng trang tool)
- [ ] `/go/[slug]` redirect đúng + ghi log; slug sai → 404 tùy chỉnh
- [ ] Sitemap.xml + robots.txt truy cập được
- [ ] Responsive: 375 / 768 / 1280px+
- [ ] `/admin` + `/api/content` chặn được truy cập trái phép
- [ ] Tương phản màu đạt WCAG AA
- [ ] GSC: site verified, sitemap submitted

## 8. Timeline tham khảo
> Phụ thuộc chủ yếu vào thời gian viết/biên tập nội dung, không chỉ code.

| Giai đoạn | Ước tính |
|---|---|
| Phase 0 — Hạ tầng | 1–2 ngày |
| Phase 1 — Nền tảng | 4–6 ngày |
| Phase 2 — MVP (kèm 30–50 review) | 3–4 tuần (viết nội dung là phần lâu nhất) |
| Phase 3 — Tối ưu | 1–2 tuần |
| Phase 4 — Tự động hóa | Theo nhu cầu sau launch |

## 9. Ghi chú chi phí (mục tiêu gần $0)
| Hạng mục | Chi phí |
|---|---|
| Domain | ~$10–12/năm (nên chi) |
| Vercel Hobby | $0 (nâng Pro ~$20/th khi traffic/doanh thu tăng — Hobby là gói phi thương mại) |
| Neon Postgres | $0 free tier |
| ESP (ConvertKit/Brevo) | $0 ở giai đoạn list nhỏ |
| GA4 / Search Console | $0 |
| Claude Code | Trả phí (công cụ dev của bạn, tách khỏi chi phí vận hành site) |

**Kết luận chi phí:** vận hành site gần $0, chỉ domain là khoản cố định nhỏ; các khoản trả phí (Vercel Pro, ESP trả phí) chỉ phát sinh khi site đã tăng trưởng — tức khi đã có cơ sở doanh thu affiliate để bù.

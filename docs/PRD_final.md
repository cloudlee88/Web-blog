# CLOUDPIXEL — Product Requirements Document (PRD) — FINAL

**Trạng thái:** Approved for build
**Phiên bản:** 2.0 (cập nhật theo mô hình hybrid directory sau khi phân tích bestainetwork.com)
**Người tạo (Product Owner):** [Tên của bạn]
**Ngày cập nhật cuối:** 04/07/2026

**Định vị sản phẩm:** Website hybrid — **directory chọn lọc + review chuyên sâu** cho sản phẩm công nghệ (AI, Tools, Digital Products), nội dung **tiếng Anh**, vận hành theo mô hình **affiliate marketing**. Tham chiếu mô hình: bestainetwork.com (điều chỉnh để review sâu hơn và chọn lọc hơn thay vì liệt kê hàng nghìn tool).

---

## 1. Tổng quan dự án (Project Overview)

### 1.1 Vấn đề và Mục tiêu

**Vấn đề:**
- **Với người đọc:** Các directory AI lớn (There's An AI For That, Futurepedia, BestAI Network...) liệt kê hàng nghìn tool nhưng mỗi tool chỉ có 2–3 dòng mô tả + screenshot — **rộng nhưng nông**. Người đọc vẫn phải tự đi research sâu ở nơi khác trước khi quyết định.
- **Với chủ site:** Cần một kênh có thương hiệu (CloudPixel) vừa chia sẻ chọn lọc, vừa tạo thu nhập affiliate — và có khả năng mở rộng bằng tự động hóa nội dung về sau.

**Mục tiêu:** Xây dựng cloudpixel — kết hợp **cấu trúc dễ khám phá của directory** với **chiều sâu của review** — để trở thành nơi người đọc tin tưởng khi chọn công cụ, đồng thời chuyển đổi traffic thành thu nhập affiliate.

**Khác biệt cốt lõi (vì sao chọn hybrid):** BestAI thắng ở *độ phủ* (2777 tool). cloudpixel không đua độ phủ (bất khả thi khi làm một mình + tiếng Anh cạnh tranh cực gắt), mà thắng ở *chiều sâu và độ chọn lọc*: ít tool hơn nhưng mỗi tool có review thật, pros/cons, use-case, so sánh — thứ mà các directory thuần không có. Đây vừa là định vị marketing, vừa là yếu tố E-E-A-T giúp SEO trong thị trường tiếng Anh.

### 1.2 Giá trị mang lại

| Đối tượng | Giá trị |
|---|---|
| Người mới | Directory dễ duyệt theo nhu cầu + review giải thích dễ hiểu |
| Người chuyên nghiệp | Review sâu, so sánh, pricing, use-case thực tế |
| Chủ site (business) | Thu nhập affiliate + nền tảng sẵn sàng cho tự động hóa nội dung đa kênh |

### 1.3 Tiêu chí Thành công (KPIs) — đã điều chỉnh cho thị trường tiếng Anh

> **Lưu ý thực tế:** Nội dung tiếng Anh nghĩa là cạnh tranh với các site lớn có hàng nghìn bài và domain authority cao. SEO sẽ **chậm và khó hơn nhiều** so với tiếng Việt. KPI dưới đây đã hạ kỳ vọng cho phù hợp; nên coi là mốc tham khảo, hiệu chỉnh sau 2–3 tháng có dữ liệu thật.

- **Traffic:** 500–1.500 organic sessions/tháng sau 6 tháng (thị trường EN khó, tập trung từ khóa long-tail).
- **Nội dung:** 30–50 tool review chất lượng lúc launch; +8–12 tool/bài mới mỗi tháng.
- **Affiliate:** CTR trên nút "Visit"/"Get Deal" ≥ 4–6% ở trang review; theo dõi EPC theo từng chương trình.
- **SEO:** ≥ 15 từ khóa long-tail lọt top 20 Google sau 6 tháng.
- **Engagement:** Thời gian đọc TB > 2 phút ở trang review (nhờ chiều sâu).
- **Email list:** 150–300 subscriber sau 6 tháng.

---

## 2. Đối tượng và Luồng người dùng

### 2.1 User Personas
- **Persona 1 — Người mới (global, EN):** tìm "best AI tool for X", cần review dễ hiểu + hướng dẫn.
- **Persona 2 — Dân chuyên (marketer/dev/freelancer/founder):** cần so sánh sâu, pricing, ROI, dẫn chứng thật.
- **Persona 3 — Người có nhu cầu cụ thể từ Google:** "X review", "X vs Y", "X coupon" — nhóm click affiliate cao nhất.

### 2.2 User Stories
- US-01: Là **người mới**, tôi muốn **duyệt tool theo nhu cầu (category/tag) và đọc review dễ hiểu**, để **chọn đúng tool tự tin**.
- US-02: Là **dân chuyên**, tôi muốn **xem review sâu + bảng so sánh**, để **quyết định nhanh có căn cứ**.
- US-03: Là **người đọc**, tôi muốn **thấy rõ đây là affiliate/coupon link**, để **tin vào tính minh bạch**.
- US-04: Là **người đọc**, tôi muốn **thấy tool nào đang "trending/hot"**, để **biết cái gì đáng chú ý**.
- US-05: Là **admin**, tôi muốn **thêm/sửa tool & review qua một nơi (admin/API)**, để **vận hành nhanh và sẵn sàng cho tự động hóa sau**.

### 2.3 User Flow chính
`Google ("X review" / "X vs Y" / "best AI for X")` → `Trang Review chi tiết hoặc Trang Category` → `Đọc review sâu (pros/cons, pricing, use-case)` → `Click CTA affiliate/coupon (có disclosure)` → `Sang trang sản phẩm`

Luồng khám phá: `Home (card grid + bảng ranking)` → `Category/Tag` → `Review detail` → `Similar tools / Newsletter`

---

## 3. Yêu cầu Chức năng (Functional Requirements)

### Epic 1: Directory & Khám phá
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-1.1 | Home card grid | Lưới card mỗi tool: logo, mô tả ngắn, tag, badge Featured, nút "Details" + "Visit" | Card responsive, load nhanh, đúng dữ liệu từ DB | P0 |
| FR-1.2 | Bảng xếp hạng | Cuối home: các bảng top theo nhóm (Featured, Trending, theo Category), có "See all" | Hiển thị đúng thứ hạng biên tập + trending | P0 |
| FR-1.3 | Trang Category | Trang riêng mỗi category, mô tả SEO + danh sách tool có phân trang | Đúng tool thuộc category, phân trang chạy | P0 |
| FR-1.4 | Hệ thống Tag | Mỗi tool gắn nhiều tag; trang tag liệt kê tool theo tag | Tag link đúng, trang tag hoạt động | P1 |
| FR-1.5 | Tìm kiếm & lọc | Search theo tên/mô tả + lọc theo category, pricing (free/paid), rating | Kết quả < 1s ở quy mô vài trăm tool; có empty state | P1 |

### Epic 2: Trang Review chuyên sâu (điểm khác biệt cốt lõi)
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-2.1 | Template review sâu | Cấu trúc: Overview, điểm số, Pros/Cons, Pricing, Use-cases, Screenshot, FAQ, Verdict | Mọi review theo template, không thiếu mục bắt buộc | P0 |
| FR-2.2 | Điểm đánh giá & rank | Điểm số + thứ hạng biên tập hiển thị nổi bật (breadcrumb, badge) | Điểm/rank hiển thị đúng, sort được | P0 |
| FR-2.3 | Similar tools | Gợi ý 3–4 tool tương tự (theo category/tag) | Gợi ý đúng, không trùng tool đang xem | P1 |
| FR-2.4 | Badge "Verified/Tested" | Đánh dấu tool đã thực sự dùng thử (tăng E-E-A-T) | Badge chỉ gắn khi đã đánh dấu verified | P1 |
| FR-2.5 | Ngày cập nhật | "Last updated" tự cập nhật khi sửa review | Ngày đổi đúng khi record update | P1 |

### Epic 3: Affiliate & Coupon
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-3.1 | CTA + Disclosure | Nút "Visit Site"/"Get Deal" mỗi tool, kèm dòng disclosure minh bạch | CTA rõ, disclosure ngay cạnh, không ẩn | P0 |
| FR-3.2 | Link cloaking `/go/[slug]` | Affiliate link đi qua domain riêng, redirect 302 | Redirect đúng, không 404, dễ thay link | P0 |
| FR-3.3 | Coupon/Deal | Hiển thị mã coupon (nếu có) ở trang review | Mã hiển thị/copy được; ẩn nếu tool không có | P1 |
| FR-3.4 | Theo dõi click | Ghi log mỗi click (slug, time, referrer, UA ẩn danh) → phục vụ "trending" | Log ghi đúng, dùng được để tính trending | P0 |
| FR-3.5 | Trang Affiliate Disclosure | Trang chính sách affiliate, link ở footer + gần CTA | Trang tồn tại, được link đúng chỗ | P0 |

### Epic 4: Ranking không cần tài khoản
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-4.1 | Xếp hạng biên tập | Admin đặt `featured` + `editorialRank` cho tool | Thứ hạng phản ánh đúng cấu hình admin | P0 |
| FR-4.2 | Trending theo click | Tính "hot/trending" từ số click thực tế (7/30 ngày) | Badge trending cập nhật theo dữ liệu click | P1 |

### Epic 5: Nội dung phụ (Blog / Tutorials / News)
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-5.1 | Bài viết (markdown) | Tutorial/News/Blog lưu markdown trong DB, render ra trang | Bài hiển thị đúng, hỗ trợ ảnh/heading | P1 |
| FR-5.2 | Danh sách & phân trang | Trang list cho từng loại nội dung | Phân trang chạy, sắp theo ngày | P1 |

### Epic 6: Quản trị nội dung (Admin/API) — nền tảng cho tự động hóa
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-6.1 | Admin CRUD | Khu vực quản trị (bảo vệ bằng auth đơn giản) tạo/sửa tool, review, affiliate link | CRUD hoạt động; chỉ admin truy cập được | P0 |
| FR-6.2 | Content API (write) | API endpoint tạo/cập nhật tool & bài viết (nền cho bot tự động sau) | API xác thực; tạo record đúng schema | P1 |
| FR-6.3 | Import/Seed | Script seed 30–50 tool ban đầu + hỗ trợ import hàng loạt về sau | Seed chạy được, dữ liệu vào DB đúng | P0 (seed) / P2 (import lớn) |

### Epic 7: SEO & Hiệu năng
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-7.1 | Metadata động | Title/description/OG/slug tùy chỉnh cho từng trang | Chỉnh độc lập với tiêu đề hiển thị | P0 |
| FR-7.2 | Sitemap & robots | Tự sinh sitemap.xml + robots.txt | GSC đọc sitemap không lỗi | P0 |
| FR-7.3 | Core Web Vitals | LCP < 2.5s, CLS < 0.1, INP < 200ms | Đạt "Good" trên PageSpeed Insights | P0 |
| FR-7.4 | Schema markup | Review/Article/Product schema cho rich snippet | Hợp lệ trên Rich Results Test | P1 |

### Epic 8: Newsletter & Analytics
| ID | Tính năng | Mô tả | Acceptance Criteria | Ưu tiên |
|---|---|---|---|---|
| FR-8.1 | Newsletter | Form inline + popup (kiểm soát tần suất), sync sang ESP | Email vào list ESP; popup ≤ 1 lần/phiên | P1 |
| FR-8.2 | GA4 + events | Track traffic + event: click affiliate, submit newsletter, search | Event hiện đúng trên GA4 | P0 |
| FR-8.3 | Search Console | Xác thực site, theo dõi index & từ khóa | Site verified, index đầy đủ | P1 |

---

## 4. Yêu cầu Phi chức năng
- **Performance:** LCP < 2.5s; chịu tải tốt ở quy mô vài trăm–vài nghìn tool nhờ ISR + query DB có index.
- **Security:** HTTPS toàn site; admin/API bảo vệ bằng auth; chống spam form; backup DB định kỳ; không commit secret.
- **Scalability:** Schema DB chịu được tăng trưởng lên hàng nghìn tool; ảnh qua CDN/`next/image`.
- **Platform:** Mobile-first; hỗ trợ Chrome/Safari/Firefox/Edge mới nhất.
- **Compliance:** Disclosure affiliate rõ ràng (thông lệ FTC — quan trọng vì audience tiếng Anh/global); cookie consent nếu đón traffic EU.

---

## 5. Yêu cầu Thiết kế
Xem chi tiết tại **Product Design Requirement (PDR) — FINAL**. Lưu ý các trạng thái: empty (category chưa có tool), loading (search/filter — skeleton), error (404, affiliate lỗi).

---

## 6. Yêu cầu Kỹ thuật & Tích hợp
Xem chi tiết tại **TechStack — FINAL** và **Implementation Plan — FINAL**. Tóm tắt:
- **Stack:** Next.js (App Router, TS) + PostgreSQL (Neon) + Prisma + Tailwind/shadcn, hosting Vercel.
- **Content model:** DB-backed, API-writable (nền cho tự động hóa đa kênh sau này).
- **Tích hợp:** Chương trình/mạng affiliate quốc tế (Impact, PartnerStack, ShareASale, hoặc affiliate riêng từng tool); ESP (ConvertKit/Brevo); GA4 + Search Console.
- **Tầm nhìn tự động hóa (giai đoạn sau):** Luồng "1 nội dung → website + social" qua Content API + dịch vụ đăng đa kênh (Ayrshare/Buffer) hoặc automation (Make/n8n).

---

## 7. Kế hoạch Triển khai (tóm tắt — chi tiết ở Implementation Plan)
- **Phase 1 (MVP):** Directory + review sâu 30–50 tool, affiliate `/go/[slug]` + disclosure + coupon, ranking biên tập + trending, admin CRUD, SEO cơ bản, GA4.
- **Phase 2:** Search/filter nâng cao, bảng so sánh, newsletter, schema, import pipeline, Content API hoàn thiện.
- **Phase 3:** Blog/Tutorials/News, tối ưu SEO chiều sâu.
- **Phase 4:** Luồng tự động hóa nội dung đa kênh; (tùy chọn) tài khoản người dùng + submit tool (paid listing).

### Rủi ro & Xử lý
| Rủi ro | Mức độ | Xử lý |
|---|---|---|
| SEO tiếng Anh cạnh tranh cực cao | Cao | Đánh long-tail + review sâu (E-E-A-T) thay vì đua độ phủ; niche category hẹp |
| Nội dung nông không cạnh tranh nổi directory lớn | Cao | Giữ đúng định vị "review sâu chọn lọc", không sa vào liệt kê |
| Social hạn chế link affiliate (khi làm automation) | Trung bình | Đăng "nội dung giá trị + link về web", không bắn affiliate thẳng lên social |
| Chương trình affiliate đổi điều khoản | Trung bình | Đa dạng nguồn, link cloaking để thay nhanh |
| Vercel Hobby là gói phi thương mại | Trung bình | Bắt đầu Hobby, nâng Pro (~$20/th) khi traffic/doanh thu tăng |

---

## 8. Phụ lục
**Glossary:** CTR (Click-Through Rate), EPC (Earnings Per Click), E-E-A-T (Experience-Expertise-Authoritativeness-Trust — tiêu chí chất lượng của Google), ISR (Incremental Static Regeneration), ESP (Email Service Provider), CDN (Content Delivery Network).
**Tài liệu liên quan:** PDR — FINAL, TechStack — FINAL, Implementation Plan — FINAL.

# CLOUDPIXEL — Product Design Requirement (PDR) — FINAL

**Trạng thái:** Approved for build
**Phiên bản:** 2.0
**Ngày cập nhật cuối:** 04/07/2026
**Tài liệu đi kèm:** PRD — FINAL, TechStack — FINAL, Implementation Plan — FINAL

**Ngôn ngữ giao diện & nội dung:** Tiếng Anh.

---

## 1. Tổng quan Thiết kế
cloudpixel là **hybrid**: giao diện dễ khám phá như một directory (card grid, category, tag, bảng xếp hạng — lấy cảm hứng từ bestainetwork.com) nhưng trang chi tiết là **review chuyên sâu**, không phải mô tả 2 dòng. Thiết kế cần truyền tải:
- **Đáng tin & minh bạch** — yếu tố sống còn với affiliate và audience tiếng Anh.
- **Chọn lọc, không rối** — khác cảm giác "biển tool" của directory lớn; ít nhưng chất.
- **Dễ duyệt, dễ quyết** — người đọc tìm nhanh, đọc sâu khi cần.

## 2. Nguyên tắc Thiết kế
1. **Clarity first:** điểm số, pricing, CTA phải thấy ngay.
2. **Minh bạch affiliate:** mọi CTA affiliate/coupon có disclosure đi kèm.
3. **Progressive disclosure:** card ngắn → trang review sâu; phục vụ cả người mới lẫn dân chuyên.
4. **Tốc độ là trải nghiệm:** ảnh tối ưu, layout ổn định (tránh CLS), animation nhẹ.
5. **Khác biệt hình ảnh với directory lớn:** không cố nhồi nhiều tool/khung; ưu tiên khoảng trắng, cảm giác biên tập chỉn chu.

## 3. Kiến trúc Thông tin (Sitemap)
```
Home
├── Full List (tất cả tool, có filter)
├── Categories
│   ├── AI
│   ├── Tools
│   └── Digital Products
├── Tool Detail (/tools/[slug])  ← trang review sâu
├── Tags (/tag/[slug])
├── Blog / Tutorials / News
├── Search
├── About
├── Affiliate Disclosure
├── Contact
└── /go/[slug]  ← redirect affiliate (không phải trang UI)
```
**Nav:** Header cố định: Logo — Full List — Categories — Tutorials — News — Search — CTA nhẹ ("Newsletter"). Footer: About, Affiliate Disclosure, Contact, social, category links.

## 4. Wireframe các trang chính

### 4.1 Home
- Hero ngắn + thanh search nổi bật + 1 câu định vị ("Hand-picked, honestly reviewed AI tools").
- **Card grid** tool nổi bật (logo, mô tả ngắn, tag, badge Featured/Trending/Verified, nút **Details** + **Visit**).
- Section theo category.
- Cuối trang: **các bảng xếp hạng** (Featured, Trending, theo Category) dạng list top-N + "See all" (giống layout cuối trang BestAI).
- CTA newsletter inline (không popup ngay khi vào).

### 4.2 Category / Full List
- Tiêu đề + mô tả SEO của category.
- Filter (Free/Paid, Rating, Tag) — sidebar (desktop) / dropdown (mobile).
- Card grid + phân trang.

### 4.3 Tool Detail (trang review — điểm nhấn khác biệt)
Từ trên xuống:
1. Header: logo + tên + **điểm số** + **rank** + category (breadcrumb) + badge Verified + **Last updated**.
2. **Quick verdict** (2–3 câu) + **CTA affiliate/coupon** ngay đầu + dòng disclosure.
3. Table of Contents (bài dài).
4. Nội dung sâu: Overview, **Pros/Cons** (2 khối tương phản), **Pricing** (bảng), **Use-cases** thực tế, **Screenshots** thật.
5. FAQ (accordion — tốt cho rich snippet).
6. CTA affiliate lặp cuối bài + disclosure.
7. **Similar tools** (3–4 card).

### 4.4 Blog / Tutorial / News
- Cover + tiêu đề + thời gian đọc; nội dung markdown; how-to dùng numbered steps có screenshot; CTA newsletter + bài liên quan.

### 4.5 Search / Filter results
- Search luôn ở đầu; kết quả card/list; "no result" gợi ý tool phổ biến.

## 5. Design System
- **Typography:** 1 font heading có cá tính + 1 font body tối ưu đọc; body ≥ 16px.
- **Màu (đề xuất hướng):** nền sáng/trung tính chủ đạo (nội dung là trọng tâm) + 1 màu accent brand riêng cho CTA/link/rating badge — chọn tông tránh xanh dương "mặc định" phổ biến để tạo nhận diện.
- **Component chuẩn hóa:**
  - Tool Card (logo, mô tả, tag, badge, Details/Visit).
  - Rating badge + Rank badge (nhất quán mọi nơi).
  - Badge Featured / Trending / Verified.
  - Ranking list block (top-N + "See all").
  - Comparison table (responsive → xếp chồng trên mobile).
  - CTA affiliate button (style riêng, icon "mở ngoài", disclosure ngay dưới).
  - Coupon block (mã + nút copy).
  - Accordion (FAQ), Newsletter form (inline + popup).

## 6. Responsive & Accessibility
- **Mobile-first**; test breakpoint ~375 / ~768 / ~1280px+.
- Tương phản đạt **WCAG AA**; ảnh có alt (kèm lợi SEO); tap target ≥ 44×44px; điều hướng bàn phím cho search/filter/accordion.

## 7. Trạng thái đặc biệt
| Trạng thái | Xử lý |
|---|---|
| Empty | Category chưa có tool: thông báo thân thiện + gợi ý category khác |
| Loading | Search/filter: skeleton card, giữ layout ổn định |
| Error 404 | Trang lỗi riêng, dẫn về Home / tool phổ biến |
| Affiliate lỗi | `/go/[slug]` sai: thông báo rõ, không để trắng trang |
| No search result | Gợi ý từ khóa/tool liên quan |

## 8. Content Design (tiếng Anh)
- **Tone:** thẳng thắn, am hiểu, như người bạn rành công nghệ — tránh giọng PR/quảng cáo. Chuẩn tiếng Anh tự nhiên, không "dịch cứng".
- **Độ dài review:** đủ trả lời "should I use this?" (thường 1000–1800 từ), có ToC.
- **Ảnh:** ưu tiên **screenshot thật** (đã dùng qua) → tăng E-E-A-T, rất quan trọng để cạnh tranh SEO tiếng Anh.
- **Nhất quán:** mọi review theo cùng khung (mục 4.3).

## 9. Thiết kế yếu tố Affiliate
- CTA nổi bật nhưng không "giật gân bán hàng" (dùng accent brand, tránh đỏ sale).
- Disclosure ("Affiliate link — cloudpixel may earn a commission if you sign up through this link") đặt **ngay cạnh/dưới** CTA, không giấu ở footer.
- Badge "Tested/Verified" cho tool đã thực sự dùng → khác biệt với directory chỉ tổng hợp.
- Coupon/deal (nếu có) hiển thị rõ để tăng lý do click.

## 10. Checklist bàn giao Thiết kế
- [ ] Wireframe đủ 5 loại trang (mục 4)
- [ ] Design system: màu, typography, component (Figma/tương đương)
- [ ] Đủ state: default/hover/loading/empty/error cho component tương tác
- [ ] Test responsive 3 breakpoint
- [ ] Tương phản đạt WCAG AA
- [ ] Xác nhận disclosure trên mọi CTA affiliate/coupon

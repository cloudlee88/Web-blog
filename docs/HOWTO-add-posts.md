# Cách thêm bài viết hàng loạt (batch) → WordPress

Quy trình chuẩn: soạn bài trong **1 file** → xuất ra `cloudpixel.xml` → **Import** vào WordPress.
Import **chỉ thêm bài mới** (khớp theo GUID/slug), **không đụng bài cũ** — nên thêm bao nhiêu đợt cũng an toàn.

---

## 1. Sửa 1 file duy nhất

Mở `content-import/posts.ts` và thêm object vào mảng `POSTS`. Mẫu:

```ts
{
  slug: "best-ai-chatbots-guide",              // duy nhất, chữ thường, gạch nối
  title: "The Best AI Chatbots in 2026",
  type: "BLOG",                                 // BLOG | TUTORIAL | NEWS | REVIEW
  categorySlug: "ai",                           // ← QUYẾT ĐỊNH BÀI HIỆN Ở TRANG NÀO (xem bảng dưới)
  // topic: "lifestyle",                         // chỉ dùng cho REVIEW sản phẩm vật lý
  excerpt: "One-sentence summary for the card and SEO.",
  body: `## Quick verdict

Short intro naming 2-3 top picks, linked: [ChatGPT](/tools/chatgpt), [Claude](/tools/claude).

## The ranking
1. [ChatGPT](/tools/chatgpt) — why.
2. [Claude](/tools/claude) — why.
3. Gemini — a tool NOT in our directory → plain text, no link.

## Bottom line
Wrap-up + a nudge to read the full reviews.`,
  publishedAt: "2026-07-11",                     // PHẢI ≤ hôm nay (bài ngày tương lai bị ẩn)
  metaTitle: "Best AI Chatbots 2026 — Ranked",   // ~60 ký tự
  metaDescription: "Honest, tested comparison of the best AI chatbots in 2026.", // ~150 ký tự
},
```

### `categorySlug` → bài hiện ở đâu

| `categorySlug` | Xuất hiện trên nav | Dùng cho |
|---|---|---|
| `"ai"` | **AI** | Bài/tool về AI |
| `"tech"` | **Tech** | Phần mềm, app, năng suất |
| `"digital-products"` | **Digital Products** | Khóa học, template, marketplace |
| `"buying-guides"` | **Best Guides** | Bài "The Best AI X" (best-of) |
| *(bỏ trống)* | **Smallcorner** | So sánh, tutorial, review sản phẩm |

> Muốn thêm bài **cho page AI** → đặt `categorySlug: "ai"`.

### `type` → tab trong Smallcorner (và nhãn thẻ)
`BLOG` → Blog · `TUTORIAL` → Tutorials · `NEWS` → News · `REVIEW` → Reviews (kèm `topic`).

---

## 2. Luật bắt buộc (để không lỗi khi import)

1. **Slug duy nhất**, không trùng bài đã có.
2. **Chỉ link nội bộ tới tool CÓ THẬT** bằng `/tools/<slug>`. Danh sách slug hợp lệ:
   `npm run` không cần — chạy: `ls content-import/tools/*.md` để xem 46 slug.
   Tool ngoài danh sách → viết tên **dạng chữ thường, KHÔNG link**.
3. **`publishedAt` ≤ hôm nay** (bài ngày tương lai bị WordPress ẩn thành "Scheduled").
4. Body là **Markdown** (có bảng, heading, list). Không dùng dấu backtick lồng nhau.

---

## 3. Xuất & kiểm tra

```bash
# 1) Kiểm tra link nội bộ có hợp lệ không (0 = ok)
grep -oP '/tools/[a-z0-9-]+' content-import/posts.ts | sed 's|/tools/||' | sort -u \
  | comm -23 - <(ls content-import/tools/*.md | xargs -n1 basename | sed 's/.md//' | grep -v _TEMPLATE | sort -u)

# 2) Xuất ra wordpress-export/cloudpixel.xml
npx tsx scripts/export-wxr.mts

# 3) (tùy chọn) xem trước trên local
npm run dev:db      # nếu DB chưa chạy
npm run db:seed     # nạp bài vào DB local
npm run dev         # http://localhost:3002/blog
```

---

## 4. Import vào WordPress

1. WP Admin → **Tools → Import → WordPress** → chọn `wordpress-export/cloudpixel.xml`.
2. Import → **bài mới được thêm, bài cũ được bỏ qua** (khớp GUID). Không cần xóa gì.
3. Xong.

> ⚠️ Nếu bạn **SỬA nội dung bài đã tồn tại** (không phải thêm mới): import sẽ **bỏ qua** (không cập nhật).
> Khi đó phải xóa bài đó trong WP rồi import lại, hoặc sửa trực tiếp qua WP Admin / MCP.

---

## 5. Gợi ý 30 chủ đề AI (theo category AIxploria)

Best-of (`categorySlug: "buying-guides"` hoặc `"ai"`), hoặc how-to (`type: "TUTORIAL"`):

Chatbots · Image Generators · Video Generators · Text-to-Video · Writing & SEO ·
Summarizer · Translation · Text-to-Speech · Voice Cloning · Music · Transcriber ·
Coding Assistants · No-Code/Low-Code · Website Builders · AI Agents · Automation ·
Presentation · E-mail · Education/Study · Search Engines · Marketing · E-commerce ·
Social Media · Customer Support · Sales · Finance · HR/Recruiting · Data & Analytics ·
AI Detection · Avatars · Logo Creation · 3D Models · Face Swap · Fashion.

---

## 6. Cách nhanh nhất

Nhờ Claude Code: *"Thêm 30 bài AI theo các category aixploria, categorySlug ai"* —
sẽ tự soạn vào `posts.ts`, validate link, xuất `cloudpixel.xml`. Bạn chỉ việc Import.

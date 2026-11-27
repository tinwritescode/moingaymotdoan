# Hướng dẫn đóng góp & hiệu đính nội dung

Dự án **Kinh Thánh — ghi chú từng đoạn** rất trân trọng mọi góp ý về thần học, dịch thuật, chính tả, cách diễn đạt cũng như cải tiến kỹ thuật từ anh chị em, mục sư và cộng đồng.

Vì toàn bộ ghi chú giải kinh được biên soạn với sự hỗ trợ của AI (**Opus 5.5** ~15% và **Gemini Neon 4** phần còn lại), sự kiểm chứng và hiệu đính từ con người là điều vô cùng quý giá.

---

## 1. Các cách đóng góp

- **Đóng góp ngôn ngữ khác**: Bạn muốn có thêm bản dịch cho một ngôn ngữ khác (như tiếng Hàn, tiếng Nhật, tiếng Hoa, tiếng Pháp, tiếng Tây Ban Nha, tiếng các dân tộc thiểu số…)? Xem [mục 5 bên dưới](#5-đóng-góp-ngôn-ngữ-khác) — không cần biết lập trình vẫn có thể bắt đầu bằng cách mở [GitHub Issue](https://github.com/tinwritescode/moingaymotdoan/issues).
- **Báo lỗi hoặc góp ý giải kinh**: Mở một [GitHub Issue](https://github.com/tinwritescode/moingaymotdoan/issues) ghi rõ tên sách, số đoạn (ví dụ: `Sáng-thế Ký 3`, `Thi-thiên 23`), đoạn văn cần xem lại và gợi ý chỉnh sửa hoặc nguồn tham khảo.
- **Sửa trực tiếp nội dung đoạn Kinh Thánh**: Chỉnh file Markdown tương ứng trong `content/<ten-sach>/<so-doan>.md` (ví dụ `content/sang-the-ky/01.md`) và gửi Pull Request.
- **Bổ sung hoặc cải thiện chủ đề cảm xúc**: Xem thư mục `lib/moods/groups/`.
- **Cải thiện giao diện, hiệu năng, accessibility**: Xem mã nguồn Solid 2.0 trong `src/`.

---

## 2. Quy chuẩn biên soạn nội dung

Mỗi đoạn (chương) là một file Markdown: `content/sang-the-ky/01.md`, `02.md`, ...

### Người đọc và giọng văn

- **Đối tượng**: Người đã tốt nghiệp đại học, muốn hiểu Kinh Thánh rõ ràng nhưng không chuyên về thần học.
- **Cách viết**: Viết như kể chuyện — câu rõ ràng, chữ dùng hằng ngày, hình ảnh cụ thể (gần với giọng dịch *Không gia đình* của Huỳnh Lý).
- **Thuật ngữ**: Tránh thuật ngữ thần học nặng nề và từ Hê-bơ-rơ/Hy Lạp khi không cần thiết; nếu phải dùng thì giải thích ngay bằng lời thường.
- **Bố cục đoạn**: Mỗi ý là một đoạn văn ngắn, mở đầu bằng một câu **in đậm** tóm ý.
- **Trích dẫn**: Dẫn câu Kinh Thánh trong ngoặc đơn ở cuối câu; mỗi câu văn chỉ dẫn gọn những chỗ thật sự cần.

### Cấu trúc bắt buộc của mỗi file Markdown

Ứng dụng phân tích file theo đúng thứ tự 5 heading cố định sau (phần frontmatter `--- ... ---` ở đầu file nếu có sẽ được bỏ qua). Nếu sai heading hoặc sai cấu trúc, bản build và test sẽ báo lỗi kèm tên file:

```markdown
# Sáng-thế Ký N — Tiêu đề

## Câu chuyện
## Ý chính
## Ý nghĩa sâu xa
## Lưu ý
## Các nhà giải kinh nói gì
```

- `## Câu chuyện`: Kể lại mạch nội dung đoạn Kinh Thánh bằng lời thường.
- `## Ý chính`: Những điểm cốt lõi dễ hiểu, dễ nhớ.
- `## Ý nghĩa sâu xa`: Kết nối đoạn này với mạch chung của cả Kinh Thánh.
- `## Lưu ý`: Các điểm dễ hiểu lầm hoặc những cách hiểu còn trao đổi.
- `## Các nhà giải kinh nói gì`: Mỗi đoạn văn là một ý kiến tóm tắt (không sao chép nguyên văn), mở đầu bằng **tên tác giả in đậm**, ghi rõ tên sách và kết thúc bằng chú thích mức tin cậy.
- Chỉ dùng `**in đậm**`, `*in nghiêng*` và các thẻ chú thích dưới đây; không dùng danh sách bullet, link hay thẻ HTML khác trong phần ghi chú.

### Quy ước chỗ dẫn Kinh Thánh

- Đặt trong ngoặc đơn: `(1:26)`, `(Giăng 1:1)`, `(Thi-thiên 33:20; 121:1–2)`, `(1:2; so Phục-truyền Luật-lệ Ký 32:11)`.
- Cùng sách thì chỉ ghi `đoạn:câu`. Sách khác phải ghi **đủ tên sách** theo bảng trong `lib/content/books.ts` (ví dụ `Khải-huyền`, `2 Cô-rinh-tô`; viết tắt như `Sáng-thế 9:6` sẽ bị bộ kiểm tra báo lỗi).
- Nhiều chỗ dẫn ngăn bằng dấu `;`. Một phần không nêu tên sách sẽ tự hiểu theo sách của phần đứng ngay trước nó.
- Mọi cụm có dạng `số:số` trong ngoặc đơn đều được ứng dụng tự động xác thực số đoạn/số câu theo Bản Truyền Thống 1926 và biến thành nút chạm xem nguyên văn tại chỗ.

### Mức tin cậy cho phần trích ý giải kinh

Mỗi ý kiến của nhà giải kinh cần có thẻ mức tin cậy đặt ở cuối đoạn văn:

- **Cao (`cao`)**: Rõ ý, rõ tên sách (và vị trí trong sách), quan điểm phổ biến và đã được biết rộng rãi.
- **Vừa (`vua`)**: Chắc về ý chính nhưng chưa chắc hoàn toàn cách diễn đạt hoặc vị trí cụ thể trong sách.
- **Thấp (`thap`)**: Chưa chắc nguồn hoặc chưa chắc tác giả nói đúng như vậy.

```html
<!-- tin-cay: cao|vua|thap | doi-chieu: roi|chua | ly-do: vì sao chọn mức này -->
```

Câu văn ở các mục khác còn điểm cần đối chiếu thêm có thể bọc bằng:

```html
<!-- thap: lý do -->câu cần kiểm chứng thêm<!-- /thap -->
```

---

## 3. Kiểm tra trước khi gửi Pull Request

Trước khi mở PR, chạy bộ kiểm tra sau để đảm bảo không có lỗi chỗ dẫn Kinh Thánh, kiểu dữ liệu, lint hay prerender:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

> Lưu ý: Dự án sử dụng **Solid 2.0** (file routes trong `src/routes`). Nếu thay đổi component hoặc route, xem thêm hướng dẫn trong `AGENTS.md` để đảm bảo không phát sinh cảnh báo reactivity (`expectNoDiagnostics`).

---

## 4. Nguồn tham khảo public domain

- **Lời Kinh Thánh**: Bản Truyền Thống 1926 (public domain), nguồn [eBible.org](https://ebible.org/find/details.php?id=vie1934).
- **Giải kinh cổ điển miễn phí (public domain)**: Matthew Henry, John Calvin, Augustine trên [ccel.org](https://www.ccel.org/); Charles Spurgeon trên [spurgeongems.org](https://www.spurgeongems.org/).

---

## 5. Đóng góp ngôn ngữ khác

Trang hiện có **Tiếng Việt** (`/`) và **English** (`/en`). Dự án luôn mở rộng cửa đón nhận các bản dịch sang ngôn ngữ khác (mã nguồn mở MIT, phi lợi nhuận).

### Nếu bạn không lập trình (mục sư, dịch giả, bạn đọc)

Chỉ cần mở một [GitHub Issue](https://github.com/tinwritescode/moingaymotdoan/issues) cho biết:

1. Ngôn ngữ bạn muốn đóng góp hoặc hỗ trợ rà soát.
2. Bản dịch Kinh Thánh thuộc phạm vi công cộng (public domain) hoặc giấy phép mở (CC0 / CC-BY) của ngôn ngữ đó (có thể tra cứu trên [eBible.org](https://ebible.org/)) nếu bạn biết.

Chúng tôi sẽ cùng phối hợp chuẩn bị cấu trúc kỹ thuật để bạn tập trung vào phần ngôn ngữ và kiểm duyệt nội dung.

### Nếu bạn là lập trình viên muốn gửi Pull Request

Bạn có thể dựa theo cách bản tiếng Anh (`/en`) được tổ chức trong repo:

1. **Nguyên văn Kinh Thánh**: Nhập bản văn public domain / giấy phép mở vào `data/bible-<lang>/` (xem mẫu tại `scripts/import-bible-en.mjs`).
2. **Ngôn ngữ giao diện & tên sách**: Khai báo mã ngôn ngữ trong `lib/i18n/` (`locale.ts`, `messages.ts`, `routes.ts`, `legal.ts`) và bảng tên/slug 66 sách trong `lib/content/books.ts`.
3. **Ghi chú từng đoạn & chủ đề cảm xúc**: Đặt ghi chú 5 mục trong `content-<lang>/` và các nhóm cảm xúc trong `lib/moods/<lang>/`.
4. **Định tuyến & prerender**: Thêm route trong `src/routes/<lang>/` và bổ sung đường dẫn dữ liệu vào `scripts/prerender.mjs`, rồi chạy `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

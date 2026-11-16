# Kinh Thánh — ghi chú giải kinh

Mỗi đoạn (chương) một file Markdown: `content/sang-the-ky/01.md`, `02.md`, ...

## Người đọc và giọng văn

- Người đọc: đã tốt nghiệp đại học, nhưng không chuyên về Kinh Thánh hay thần học.
- Viết như kể chuyện: câu rõ ràng, chữ dùng hằng ngày, hình ảnh cụ thể. Giọng mẫu: bản dịch *Không gia đình* của Huỳnh Lý.
- Tránh thuật ngữ thần học và chữ Hê-bơ-rơ. Nếu cần dùng, giải thích ngay bằng lời thường.
- Mỗi ý là một đoạn văn ngắn, mở đầu bằng một câu in đậm tóm ý.
- Dẫn câu Kinh Thánh trong ngoặc đơn ở cuối câu. Mỗi câu văn dẫn ít chỗ thôi.

## Cấu trúc mỗi file

App đọc theo phần đầu file và các heading cố định, đúng thứ tự này. Sai một chỗ là bản build báo lỗi kèm tên file.

```
---
duyet: false
---

# Sáng-thế Ký N — Tiêu đề
## Câu chuyện
## Ý chính
## Ý nghĩa sâu xa
## Lưu ý
## Các nhà giải kinh nói gì
```

- `duyet: true` khi chủ trang đã đọc và duyệt. Thiếu phần đầu file thì coi như chưa duyệt.
- `## Câu chuyện`: kể lại đoạn Kinh Thánh bằng lời thường
- `## Ý chính`: ý nghĩa dễ hiểu
- `## Ý nghĩa sâu xa`: liên kết với toàn bộ Kinh Thánh
- `## Lưu ý`: điểm dễ hiểu lầm, điểm còn tranh luận
- `## Các nhà giải kinh nói gì`: mỗi đoạn văn là một ý kiến, mở đầu bằng **tên in đậm**, ghi tên sách, và kết thúc bằng dấu mức tin cậy (xem dưới).
- Chỉ dùng `**đậm**`, `*nghiêng*` và các dấu bên dưới. Không dùng danh sách, link hay HTML khác.

## Chỗ dẫn

- Viết trong ngoặc đơn: `(1:26)`, `(Giăng 1:1)`, `(Thi-thiên 33:20; 121:1–2)`, `(1:2; so Phục-truyền Luật-lệ Ký 32:11)`.
- Cùng sách thì chỉ ghi `đoạn:câu`. Sách khác thì ghi đủ tên sách theo bảng trong `lib/content/books.ts` (vd. `Khải-huyền`, `2 Cô-rinh-tô`). Không viết tắt (`Sáng-thế 9:6` là lỗi).
- Nhiều chỗ thì ngăn bằng dấu `;`. Một phần không có tên sách thì dùng sách của phần trước nó.
- Ngoặc đơn có dạng `số:số` là chỗ dẫn. App kiểm tra câu có thật không và cho người đọc bấm vào để xem lời Kinh Thánh.

## Mức tin cậy

Ghi chú do AI soạn, nên mỗi ý kiến của nhà giải kinh phải có mức tin cậy:

- **Cao**: nhớ rõ ý, rõ sách (và vị trí trong sách), ý đó được trích rộng rãi.
- **Vừa**: chắc về ý chính nhưng chưa chắc cách nói hoặc vị trí trong sách.
- **Thấp**: không chắc nguồn, hoặc không chắc người đó nói vậy.

Dấu đặt ở cuối đoạn văn của ý kiến:

```
<!-- tin-cay: cao|vua|thap | doi-chieu: roi|chua | ly-do: vì sao chọn mức này -->
```

`doi-chieu: roi` khi chủ trang đã tự mở sách gốc ra xem. Ở trang công bố, ý kiến chưa đối chiếu bị ẩn.

Câu văn ở các phần khác mà chưa chắc thì bọc lại:

```
<!-- thap: lý do -->câu chưa chắc<!-- /thap -->
```

Ghi chú đã duyệt thì không được còn câu mức Thấp. Mức tin cậy chỉ hiện ở chế độ Nháp (`pnpm dev`), không hiện ở trang công bố (`pnpm build`).

## Nguồn và bản quyền

- Chỉ trích vài cụm từ ngắn theo Bản Truyền Thống 1926 (public domain). App lấy lời Kinh Thánh đầy đủ từ bản này.
- Mục "nói gì" là tóm tắt ý, không trích nguyên văn. Mỗi mục ghi tên sách để kiểm chứng. Đối chiếu với nguồn trước khi công bố.
- Đọc toàn văn miễn phí (public domain): Matthew Henry, John Calvin, Augustine trên ccel.org; Spurgeon trên spurgeongems.org.

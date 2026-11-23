---
name: viet-ghi-chu
description: Viết ghi chú cho một hay nhiều đoạn Kinh Thánh trong content/. Use when asked to write, draft or redo the ghi chú of a đoạn or a range of đoạn (vd. "viết Sáng-thế Ký 4–8").
---

# Viết ghi chú

Luật viết (người đọc, giọng văn, cấu trúc file, chỗ dẫn, mức tin cậy) nằm trong `README.md`. Đó là nguồn chuẩn duy nhất; skill này chỉ thêm quy trình và những điều README chưa nói.

Nhiều đoạn thì làm **tuần tự**: mỗi đoạn đi hết bước 2–4 rồi mới sang đoạn sau.

## 1. Nạp giọng

Đọc `README.md`, `GLOSSARY.md` và ba ghi chú mẫu `content/sang-the-ky/01.md`–`03.md`. Đọc thêm ghi chú của đoạn liền trước (nếu có), để Câu chuyện nối mạch với nó.

Xong khi: bạn nói lại được luật chỗ dẫn và ba mức tin cậy mà không cần mở README.

## 2. Đọc đoạn

```
node scripts/doan.mjs <slug> <đoạn>
```

In từng câu theo Bản Truyền Thống. Đọc hết từng câu. Chỗ dẫn sang sách khác thì tra trước khi viết, để chắc câu ấy nói đúng điều bạn định nói:

```
node scripts/doan.mjs cau "Hê-bơ-rơ 11:4; Ma-thi-ơ 18:21–22"
```

Xong khi: bạn chia được đoạn thành các cảnh, và biết câu nào thuộc cảnh nào.

## 3. Viết

File: `content/<slug>/NN.md` (`NN` hai chữ số, vd. `04.md`). Thư mục chưa có thì tạo. Dòng tiêu đề là `# <tên sách> <đoạn> — <tiêu đề>`, với tên sách đúng như trong `lib/content/books.ts`.

**Chỉ Câu chuyện**: khi chủ trang bảo viết Câu chuyện trước, giữ đủ năm tiêu đề theo thứ tự, chỉ viết nội dung cho Câu chuyện, bốn phần còn lại để trống. Trang tự ẩn phần trống. Bước 4 vẫn chạy như thường.

Từng phần, cỡ như ba file mẫu (khoảng 2.000 chữ cả bài):

- **Câu chuyện**: 5–9 đoạn văn, kể theo thứ tự trong Kinh Thánh. Mỗi đoạn văn kết bằng chỗ dẫn tới các câu nó kể. Gộp lại, các chỗ dẫn phủ cả đoạn. Gia phả và danh sách thì kể gọn ý chính (mấy đời, ai nổi bật) và dẫn cả khúc.
- **Ý chính**: 3–5 ý.
- **Ý nghĩa sâu xa**: 4–6 ý, mỗi ý nối với một chỗ khác trong Kinh Thánh, có chỗ dẫn.
- **Lưu ý**: 3–5 ý. Chỗ khó đọc (bạo lực, đa thê, nô lệ, lời rủa) thì nói thẳng và công bằng, nêu các cách hiểu chính.
- **Các nhà giải kinh nói gì**: 4–6 ý kiến, chọn người trong [nguon.md](nguon.md). Trộn các thời: Hội Thánh đầu tiên, Cải Chánh, hiện đại; có một tiếng nói Do Thái khi danh sách có. Lần đầu nhắc tên ai thì giới thiệu người đó trong một mệnh đề ngắn.

Mức tin cậy phải **thật thà**:

- Chỉ viết ý mà bạn thật sự nhớ người đó đã nói về đúng khúc này. Ý bạn suy ra "chắc ông ấy nghĩ vậy" thì không phải ý kiến. Không nhớ ý nào thì chọn người khác.
- **Cao** đòi hỏi nhớ được chính ý đó trong chính sách đó. Chỉ biết người đó có viết sách giải nghĩa sách này thì chưa đủ: đó là **Vừa** hoặc **Thấp**.
- Không bịa số trang, tên bài giảng hay câu trích nguyên văn. Không nhớ vị trí thì ghi tên sách thôi và nói rõ trong `ly-do`.
- Trong ngoặc ghi tên sách của nhà giải kinh, tránh dạng `số:số`: app hiểu đó là chỗ dẫn và báo lỗi. Viết `phần đoạn 4 câu 4`, không viết `câu 4:4`.

Phần đầu file luôn là `duyet: false`, mọi ý kiến luôn là `doi-chieu: chua`. Chỉ chủ trang mới đổi hai giá trị này.

## 4. Kiểm

```
node scripts/doan.mjs kiem content/<slug>/NN.md
pnpm test
```

- `kiem` dò mọi câu trong ngoặc kép trong cả bộ Kinh Thánh. `SÁCH KHÁC` là câu có ở sách khác: xem lại chỗ dẫn có đúng sách ấy không. `KHÔNG` là chữ của bạn hoặc **trích sai**. Trích sai thì sửa cho khớp Bản Truyền Thống từng chữ, hoặc bỏ ngoặc kép và kể lại bằng lời mình.
- `pnpm test` đọc mọi ghi chú và báo lỗi của mọi file cùng lúc, mỗi lỗi kèm tên file và chỗ sai: chỗ dẫn không có thật, sai tên sách, sai heading, thiếu dấu mức tin cậy. Sửa lỗi ở file của bạn; file khác có thể đang có người viết dở.
- Đọc lại cả bài một lượt: mỗi ý mở đầu bằng câu in đậm; không có danh sách, link hay HTML; chỗ dẫn ghi đủ tên sách.

Xong khi: mọi dòng `KHÔNG` đều là chữ của bạn, `pnpm test` không còn lỗi nào ở file của bạn, và lượt đọc lại không còn gì phải sửa.

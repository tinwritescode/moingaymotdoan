# Spec: bản đầu của trang đọc Kinh Thánh có ghi chú

Từ ngữ theo GLOSSARY. Quyết định về "đoạn" theo ADR 0001.

## Problem Statement

Người đã tốt nghiệp đại học nhưng không chuyên về Kinh Thánh hay thần học muốn hiểu từng đoạn Kinh Thánh nói gì: ý chính dễ hiểu, ý nghĩa sâu xa hơn, những điểm dễ hiểu lầm, và các nhà giải kinh nổi tiếng đã hiểu đoạn đó ra sao. Sách giải kinh hiện có thường viết cho người trong nghề, đầy thuật ngữ và chữ Hê-bơ-rơ. Lời Kinh Thánh và lời giải thích lại nằm ở hai nơi, nên người đọc phải lật qua lật lại.

Chủ dự án dùng AI để soạn ghi chú. AI có thể sai, nhất là khi gán ý kiến cho người thật. Chủ dự án cần biết AI chắc đến đâu ở từng ý, và cần chắc rằng không có ý kiến chưa kiểm nào lọt ra ngoài.

## Solution

Một trang web tĩnh, chỉ để đọc. Mỗi đoạn có một trang riêng: lời Kinh Thánh theo Bản Truyền Thống ở trên, ghi chú viết bằng lời thường ở dưới. Các chỗ dẫn trong ghi chú bấm được, và mở ra lời câu đó ngay tại chỗ. Giọng văn theo bản dịch *Không gia đình*: kể như kể chuyện, chữ thường ngày, hình ảnh cụ thể.

Mỗi ý kiến của nhà giải kinh có một mức tin cậy do AI xếp theo tiêu chí kiểm lại được (Cao, Vừa, Thấp), không dùng phần trăm. Chủ dự án thấy các mức này cùng số ý đã đối chiếu khi chạy trang ở máy mình (Nháp). Người đọc chỉ thấy ghi chú đã duyệt, và chỉ thấy những ý kiến đã đối chiếu với sách gốc (Công bố). Mỗi trang có một dòng nói rõ ghi chú do AI soạn và đã được duyệt.

Bản đầu chỉ có nội dung Sáng-thế Ký, nhưng cấu trúc đủ cho cả 66 sách.

## User Stories

### Người đọc

1. Là người đọc, tôi muốn mở trang mục lục và thấy các sách đã có ghi chú, để biết bắt đầu đọc từ đâu.
2. Là người đọc, tôi muốn thấy các đoạn của một sách kèm tiêu đề từng đoạn, để chọn đoạn mình quan tâm.
3. Là người đọc, tôi muốn thấy một dòng giải thích "đoạn" nghĩa là "chương", để không bối rối với cách gọi của Tin Lành.
4. Là người đọc, tôi muốn đọc nguyên văn lời Kinh Thánh của đoạn ngay trên trang, để không phải mở Kinh Thánh ở chỗ khác.
5. Là người đọc, tôi muốn lời Kinh Thánh hiện thành đoạn văn liền mạch với số câu nhỏ phía trên, để đọc trôi như văn xuôi mà vẫn biết câu nào là câu nào.
6. Là người đọc, tôi muốn lời Kinh Thánh giữ đúng nguyên văn, kể cả chữ cũ như "sanh", "nầy", để tin rằng trang không sửa lời Kinh Thánh.
7. Là người đọc, tôi muốn có nút "Đến phần ghi chú" ở đầu trang, để bỏ qua lời Kinh Thánh khi tôi đã đọc rồi.
8. Là người đọc, tôi muốn đọc phần Câu chuyện kể lại đoạn bằng lời thường, để nắm được chuyện gì xảy ra.
9. Là người đọc, tôi muốn đọc phần Ý chính, mỗi ý mở đầu bằng một câu in đậm, để lướt nhanh mà vẫn hiểu.
10. Là người đọc, tôi muốn đọc phần Ý nghĩa sâu xa, để thấy đoạn này nối với phần còn lại của Kinh Thánh ra sao.
11. Là người đọc, tôi muốn đọc phần Lưu ý, để tránh những hiểu lầm thường gặp và biết điểm nào còn tranh luận.
12. Là người đọc, tôi muốn những điểm còn tranh luận được trình bày công bằng các quan điểm, để tự suy nghĩ thay vì bị áp một cách hiểu.
13. Là người đọc, tôi muốn đọc ý kiến của các nhà giải kinh, mỗi người có một câu giới thiệu là ai và sống khi nào, để biết lời đó đến từ đâu.
14. Là người đọc, tôi muốn thấy tên tác phẩm sau mỗi ý kiến, để tự tìm đọc thêm nếu muốn.
15. Là người đọc, tôi muốn bấm vào chỗ dẫn như "(Giăng 1:1)" và thấy lời câu đó trong một khung nhỏ, để không phải rời trang.
16. Là người đọc, tôi muốn chỗ dẫn chỉ có số như "(1:26)" mở ra câu trong cùng sách, để đọc nhanh câu được nhắc tới.
17. Là người đọc, tôi muốn chỗ dẫn có khoảng câu hay nhiều câu như "(Thi-thiên 33:20; 121:1–2)" hiện đủ các câu, để không thiếu ý.
18. Là người đọc, tôi muốn đóng khung lời câu bằng phím Esc hoặc bấm ra ngoài, để quay lại đọc tiếp.
19. Là người đọc, tôi muốn mở chỗ dẫn bằng bàn phím, để đọc được khi không dùng chuột.
20. Là người đọc, tôi muốn chuyển sang đoạn trước hoặc đoạn sau ở cuối trang, để đọc liền mạch.
21. Là người đọc, tôi muốn đường dẫn dễ đọc như `/sang-the-ky/1`, để chia sẻ cho bạn bè.
22. Là người đọc, tôi muốn đọc trên điện thoại với chữ lớn, một cột, không phải kéo ngang, để đọc lâu không mỏi mắt.
23. Là người đọc, tôi muốn trang tự chuyển nền tối khi máy tôi đang ở chế độ tối, để đọc ban đêm dễ chịu.
24. Là người đọc, tôi muốn hiệu ứng nhẹ nhàng, và tắt hẳn khi tôi bật giảm chuyển động, để không bị phân tâm hay chóng mặt.
25. Là người đọc, tôi muốn biết ghi chú do AI soạn và đã được duyệt, để hiểu nội dung từ đâu ra.
26. Là người đọc, tôi muốn chỉ thấy những ý kiến đã được đối chiếu với sách gốc, để không đọc phải lời gán sai cho người thật.
27. Là người đọc, tôi muốn biết lời Kinh Thánh lấy từ đâu (Bản Truyền Thống, public domain, eBible.org), để yên tâm về nguồn.
28. Là người đọc, tôi muốn không bị theo dõi bởi công cụ đo lượt truy cập, để đọc riêng tư.
29. Là người đọc, khi gõ đường dẫn tới một đoạn chưa công bố, tôi muốn thấy trang "không tìm thấy", để không ai thấy được bản nháp.

### Chủ dự án

30. Là chủ dự án, tôi muốn chạy trang ở máy mình và thấy cả ghi chú chưa duyệt, để đọc và duyệt trước khi công bố.
31. Là chủ dự án, tôi muốn thấy ở đầu mỗi ghi chú trong Nháp một dòng `Cao 4 · Vừa 1 · Thấp 1 · Đã đối chiếu 2/6`, để biết còn bao nhiêu việc.
32. Là chủ dự án, tôi muốn thấy mức tin cậy và lý do một dòng của từng ý kiến, để kiểm ý mức Thấp trước.
33. Là chủ dự án, tôi muốn những câu AI đánh dấu mức Thấp ở các phần khác được tô nổi trong Nháp, để không bỏ sót.
34. Là chủ dự án, tôi muốn mục lục trong Nháp cho thấy đoạn nào đã duyệt và mỗi đoạn đã đối chiếu bao nhiêu ý, để biết đoạn nào cần làm.
35. Là chủ dự án, tôi muốn đánh dấu một ý kiến là đã đối chiếu bằng cách sửa một chỗ nhỏ trong file ghi chú, để không cần công cụ riêng.
36. Là chủ dự án, tôi muốn đánh dấu một ghi chú là đã duyệt bằng một dòng ở đầu file, để việc công bố đơn giản.
37. Là chủ dự án, tôi muốn ý kiến chưa đối chiếu tự ẩn khi công bố mà không chặn cả đoạn, để công bố được sớm.
38. Là chủ dự án, tôi muốn việc dựng trang báo lỗi rõ ràng (tên file, chỗ sai) khi ghi chú dùng tên sách lạ, dẫn tới câu không tồn tại, thiếu hay sai thứ tự các phần, hoặc có ý kiến thiếu mức tin cậy, để sửa ngay.
39. Là chủ dự án, tôi muốn việc dựng trang báo lỗi khi một ghi chú đã duyệt vẫn còn câu đánh dấu mức Thấp, để lời chưa chắc không lọt ra ngoài.
40. Là chủ dự án, tôi muốn sửa nội dung bằng file Markdown trong repo, để không phải lo thêm CMS hay database.
41. Là chủ dự án, tôi muốn đẩy code lên nhánh chính là trang thật tự cập nhật, để không phải triển khai bằng tay.
42. Là chủ dự án, tôi muốn nhận ghi chú mới theo từng lô 5 đoạn, để duyệt vừa sức và sửa sớm nếu khung có vấn đề.
43. Là chủ dự án, tôi muốn duyệt bảng tên 66 sách một lần, để mọi chỗ dẫn về sau dùng cùng một cách viết.

### AI soạn ghi chú

44. Là AI soạn ghi chú, tôi muốn có một hướng dẫn viết duy nhất (người đọc, giọng văn, cấu trúc, cách viết chỗ dẫn, tiêu chí mức tin cậy, cách đánh dấu), để mọi đoạn viết đồng nhất.
45. Là AI soạn ghi chú, tôi muốn ghi cho mỗi ý kiến một mức tin cậy theo tiêu chí kèm lý do một dòng, để chủ dự án biết kiểm chỗ nào trước.
46. Là AI soạn ghi chú, tôi muốn đánh dấu những câu mình không chắc ở các phần khác, để không câu nào chưa chắc bị bỏ qua khi duyệt.
47. Là AI soạn ghi chú, tôi muốn có bảng tên sách chuẩn, để chỗ dẫn tôi viết luôn hợp lệ.

## Implementation Decisions

### Dự án và hạ tầng

- Dự án nằm trong thư mục riêng, không nằm chung thư mục công việc. Repo GitHub riêng tư tên `kinh-thanh`. Tên chính thức của trang chọn sau, khi mua tên miền.
- Next.js (App Router), Tailwind CSS, motion (motion.dev), Vitest.
- Mọi trang dựng sẵn lúc build. Không có server chạy thường trực, không API, không database, không CMS.
- Triển khai lên Vercel gói miễn phí, tự cập nhật khi đẩy lên nhánh chính. Không gắn công cụ đo lượt truy cập.

### Dữ liệu Kinh Thánh

- Nguồn: eBible.org, mã `vie1934` (Bản Truyền Thống, public domain).
- Một script nhập dữ liệu, chạy lại được, kết quả luôn như nhau. Script tải gói của eBible và chuyển thành dữ liệu có cấu trúc (sách, đoạn, câu, lời câu), lưu vào repo. Script bỏ chú thích và ký hiệu định dạng, giữ nguyên văn từng chữ, kể cả chính tả cũ.
- Bảng tên sách gồm 66 mục. Mỗi mục có:
  - tên chuẩn theo Bản Truyền Thống, dạng có gạch nối (ví dụ Sáng-thế Ký, Phục-truyền Luật-lệ Ký); sách có số thì viết số Ả Rập đứng trước (1 Giăng, 2 Cô-rinh-tô);
  - slug: chữ thường, bỏ dấu, đ thành d, khoảng trắng và gạch nối thành `-` (ví dụ `sang-the-ky`, `1-giang`);
  - thứ tự trong Kinh Thánh.

  Chủ dự án duyệt bảng này một lần.

### Ghi chú

- Mỗi đoạn một file Markdown, xếp theo sách. Phần đầu file có cờ duyệt, mặc định là chưa duyệt.
- Tiêu đề cấp 1 có dạng "Tên sách N — Tiêu đề"; phần tiêu đề dùng cho mục lục.
- Năm phần cố định, đúng thứ tự: Câu chuyện, Ý chính, Ý nghĩa sâu xa, Lưu ý, Các nhà giải kinh nói gì. Phần cuối đổi tên từ "Các nhà giảng và giải kinh nói gì".
- Mỗi ý kiến là một đoạn văn trong phần cuối, mở đầu bằng tên nhà giải kinh in đậm, có tên tác phẩm trong ngoặc. Cuối mỗi ý kiến có một dấu máy đọc được, viết một dòng theo cú pháp cố định, không hiện ra khi Markdown được hiển thị bình thường (ví dụ chú thích HTML). Dấu này gồm: mức tin cậy, lý do một dòng, đã đối chiếu hay chưa.
- Câu mức Thấp ở các phần khác được bao bằng một cặp dấu cố định, cũng không hiện khi hiển thị bình thường, kèm lý do.
- Hướng dẫn viết (README) là nơi duy nhất định nghĩa người đọc, giọng văn, cấu trúc, cách viết chỗ dẫn, tiêu chí mức tin cậy và cú pháp các dấu. Spec này chỉ trỏ tới, không chép lại.
- Lập trường: lấy cách hiểu Tin Lành làm nền, vẫn trích các giáo phụ chung. Điểm còn tranh luận thì trình bày công bằng các quan điểm. Chưa trích mục sư Việt Nam.

### Mức tin cậy

- **Cao**: biết rõ tên tác phẩm và vị trí (quyển, chương), và ý này được nhiều nguồn khác trích lại.
- **Vừa**: biết tác phẩm, nhưng không chắc vị trí hoặc cách diễn đạt.
- **Thấp**: không chắc tác phẩm hay tên bài; cần tra lại.
- Không dùng phần trăm. Con số duy nhất là số ý đã đối chiếu trên tổng số ý kiến của đoạn.
- Mọi ý kiến đều phải có mức. Ở các phần khác, chỉ đánh dấu câu mức Thấp.

### Chỗ dẫn

- Viết bình thường trong ngoặc đơn. Dẫn sang sách khác thì ghi tên chuẩn đầy đủ cộng `đoạn:câu`. Dẫn trong cùng sách thì chỉ ghi `đoạn:câu`.
- Nhiều chỗ dẫn cách nhau bằng dấu chấm phẩy. Một chỗ dẫn chỉ có số đứng sau một chỗ dẫn có tên sách thì dùng lại sách đó: "(Thi-thiên 33:20; 121:1–2)".
- Khoảng câu viết bằng gạch ngang hoặc gạch nối. Cho phép chữ dẫn đầu như "so" ("so Phục-truyền Luật-lệ Ký 32:11").
- Module nội dung tự nhận ra chỗ dẫn; người viết không đánh dấu gì thêm. Chỉ nhận chỗ dẫn nằm trong ngoặc đơn.
- Lời các câu được tra sẵn lúc build và nhúng vào trang. Khung bật lên không gọi mạng.
- Build báo lỗi khi:
  - tên đứng trước `đoạn:câu` không có trong bảng tên chuẩn, ví dụ viết tắt "Sáng-thế 9:6";
  - đoạn hoặc câu được dẫn không tồn tại.

### Module nội dung: chỗ kiểm thử duy nhất

- Đầu vào: thư mục ghi chú và dữ liệu Kinh Thánh. Mặc định dùng dữ liệu trong repo; test có thể truyền dữ liệu mẫu.
- Chế độ: Nháp khi chạy dev, Công bố khi build production.
- Kiểm tra toàn bộ ghi chú một lần ngay khi nạp. Gặp lỗi thì ném lỗi kèm tên file và đoạn văn bị lỗi, làm build hỏng. Các lỗi cần bắt:
  - thiếu phần, hoặc các phần sai thứ tự;
  - ý kiến thiếu mức tin cậy;
  - tên sách lạ trong chỗ dẫn;
  - câu được dẫn không tồn tại;
  - ghi chú đã duyệt mà vẫn còn câu mức Thấp.
- Ba việc mà mọi trang gọi tới:
  - **Lấy mục lục(chế độ)**: các sách theo thứ tự, chỉ những sách có ít nhất một đoạn hiện được ở chế độ đó. Mỗi đoạn gồm số và tiêu đề. Ở Nháp có thêm trạng thái duyệt và dòng tóm tắt mức tin cậy.
  - **Lấy một đoạn(slug sách, số đoạn, chế độ)**: thông tin sách; số đoạn; các câu (số câu, lời câu); ghi chú chia theo phần, với chỗ dẫn đã tra sẵn (chữ như được viết, cộng lời các câu); danh sách ý kiến (tên, nội dung, tác phẩm, mức, lý do, đã đối chiếu hay chưa); dòng tóm tắt; đoạn trước và đoạn sau trong số các đoạn hiện được. Ở Công bố:
    - bỏ các ý kiến chưa đối chiếu; nếu không còn ý kiến nào thì bỏ luôn phần đó;
    - không trả mức, lý do hay dấu câu mức Thấp.

    Đoạn không tồn tại, hoặc chưa duyệt khi ở Công bố, thì trả về "không tìm thấy".
  - **Tra một chỗ dẫn(chỗ dẫn)**: danh sách (sách, đoạn, câu, lời câu), hoặc lỗi.

### Trang

- **Mục lục**:
  - danh sách sách, rồi các đoạn kèm tiêu đề;
  - một dòng "Đoạn = chương";
  - ở Nháp: nhãn đã duyệt hay chưa, và số ý đã đối chiếu.
- **Trang đoạn** (`/<slug sách>/<số đoạn>`), một cột, từ trên xuống:
  - tiêu đề và nút "Đến phần ghi chú";
  - lời Kinh Thánh viết liền, số câu nhỏ phía trên;
  - năm phần ghi chú;
  - dòng "Ghi chú do AI soạn, đã được duyệt; ý kiến các nhà giải kinh đã đối chiếu với nguồn.";
  - đoạn trước và đoạn sau;
  - chân trang ghi nguồn lời Kinh Thánh.
- **Chỗ dẫn**: hiển thị như một nút. Bấm, chạm hoặc nhấn Enter thì mở khung nhỏ có tên chỗ dẫn và lời câu. Esc hoặc bấm ra ngoài thì đóng, và con trỏ bàn phím quay về nút.
- **Chỉ có ở Nháp**: dòng tóm tắt, nhãn mức tin cậy kèm lý do và trạng thái đối chiếu của từng ý kiến, và phần tô nổi các câu mức Thấp.
- Đoạn không có, hoặc chưa công bố: trang 404.
- **Hình thức**:
  - chữ Literata (có bộ dấu tiếng Việt), cỡ lớn;
  - nền màu giấy ngà; chế độ tối theo cài đặt của máy;
  - màu đặt thành token trong theme Tailwind;
  - `lang="vi"`.
- **Hiệu ứng**: các phần hiện dần khi cuộn tới, chuyển trang mượt. Tắt hết khi máy bật giảm chuyển động.

### Quy trình nội dung

- Viết theo lô 5 đoạn. Chủ dự án duyệt xong lô này mới viết lô sau.
- Ghi chú mới khởi đầu ở trạng thái chưa duyệt, mọi ý kiến chưa đối chiếu.
- Sửa lại Sáng-thế Ký 1–3 cho khớp spec:
  - đổi tên phần cuối;
  - đổi chỗ dẫn sang tên chuẩn (ví dụ "Sáng-thế 9:6", "Thi Thiên 33:20");
  - sửa câu về 1:16 cho đúng chữ của Bản Truyền Thống ("vì lớn hơn", "vì nhỏ hơn");
  - thêm mức tin cậy và dấu. Ý kiến của Spurgeon ở đoạn 3 dự kiến ở mức Thấp.

## Testing Decisions

- Một test tốt gọi module nội dung đúng như các trang gọi, và kiểm dữ liệu mà người đọc hay chủ dự án sẽ thấy. Test nào vẫn qua khi mọi hàm trả về rỗng thì bỏ.
- Chỉ test module nội dung. Đây là chỗ kiểm thử duy nhất. Tính đúng của dữ liệu nhập từ eBible cũng được kiểm qua chỗ này.
- Trường hợp đúng dùng dữ liệu thật (Bản Truyền Thống và ghi chú Sáng-thế Ký 1–3). Trường hợp lỗi dùng vài thư mục ghi chú mẫu nhỏ.
- Các trường hợp:
  - dữ liệu Kinh Thánh: đủ 66 sách; Sáng-thế Ký có 50 đoạn, đoạn 1 có 31 câu; lời câu 1:1 đúng nguyên văn;
  - `sang-the-ky` và số 1 dẫn đúng tới Sáng-thế Ký đoạn 1; slug lạ hoặc số đoạn lạ trả về "không tìm thấy";
  - nhận đúng các dạng "(Giăng 1:1)", "(1:26)", "(Thi-thiên 33:20; 121:1–2)", "(2 Cô-rinh-tô 4:6)", "(1:2; so Phục-truyền Luật-lệ Ký 32:11)";
  - "(Sáng-thế 9:6)" hoặc dẫn tới "Giăng 1:99" làm việc nạp ném lỗi có tên file;
  - ghi chú chưa duyệt không có trong mục lục và lấy đoạn ở Công bố, nhưng có ở Nháp;
  - ở Công bố, ý kiến chưa đối chiếu bị bỏ, và không lộ mức hay lý do; ở Nháp, đủ ý kiến kèm mức;
  - dòng tóm tắt đếm đúng số ý kiến theo mức và số đã đối chiếu;
  - ghi chú đã duyệt còn câu mức Thấp làm việc nạp ném lỗi; ý kiến thiếu mức cũng vậy; thiếu phần hoặc sai thứ tự cũng vậy;
  - đoạn trước và đoạn sau chỉ trỏ tới các đoạn hiện được ở chế độ đang dùng.
- Không test tự động phần giao diện (bố cục, khung bật lên, hiệu ứng). Kiểm bằng tay khi chạy app: màn hình điện thoại, chế độ tối, giảm chuyển động, mở chỗ dẫn bằng bàn phím.
- Repo chưa có test nào để làm mẫu.

## Out of Scope

- Tài khoản, bình luận, tìm kiếm, đánh dấu trang, ghi chú cá nhân.
- Công cụ đo lượt truy cập.
- Nội dung các sách ngoài Sáng-thế Ký (cấu trúc thì đã hỗ trợ đủ 66 sách).
- Ý kiến của mục sư Việt Nam.
- Đường dẫn trỏ thẳng tới một câu; cuộn tới câu khi bấm chỗ dẫn.
- Đổi chính tả lời Kinh Thánh sang chữ mới; các bản dịch khác; cách gọi tên của Công giáo.
- Chỉ số tin cậy dạng phần trăm; mức tin cậy hiện cho người đọc.
- Lưu lại nguồn cụ thể đã dùng để đối chiếu mỗi ý kiến.
- Hai cột, thẻ chuyển qua lại, đọc offline, âm thanh, đa ngôn ngữ.
- Tên chính thức và tên miền.
- Chỗ dẫn nằm ngoài ngoặc đơn.

## Further Notes

- Từ ngữ: GLOSSARY. Quyết định "đoạn": ADR 0001.
- Dự án chưa có issue tracker. Skill `to-spec` bảo chạy `/setup-matt-pocock-skills`. Khi đã có repo GitHub, đăng spec này thành issue với nhãn `ready-for-agent`.
- Rủi ro chính là AI gán sai ý cho người thật. Có ba lớp chặn: mức tin cậy giúp chủ dự án biết kiểm chỗ nào trước; ý kiến chưa đối chiếu bị ẩn khi công bố; build hỏng nếu ghi chú đã duyệt còn câu mức Thấp.
- Bản quyền: lời Kinh Thánh thuộc public domain. Ý kiến các nhà giải kinh chỉ là tóm tắt ý, không chép nguyên văn.
- Chính tả cũ của Bản Truyền Thống ("sanh", "nầy", "đặng") được giữ nguyên. Chữ nào khó hiểu thì ghi chú giải thích.

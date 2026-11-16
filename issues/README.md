# Issues

Dự án không dùng issue tracker riêng. Mỗi issue là một file Markdown trong thư mục này.

- Tên file: `NNNN-ten-ngan.md`, số tăng dần, không dùng lại.
- Phần đầu file:

  ```
  ---
  status: open | in-progress | done
  labels: [ready-for-agent]
  ---
  ```

- Nhãn:
  - `ready-for-agent`: đủ rõ để agent làm mà không cần hỏi thêm.
  - `needs-owner`: chỉ chủ trang làm được (đọc, đối chiếu, duyệt).
- Đóng issue: đổi `status: done` và ghi một dòng kết quả ở cuối file. Không xóa file.
- Tìm issue đang mở: `grep -l "status: open" issues/*.md`

---
status: in-progress
labels: [ready-for-agent]
---

# Viết ghi chú Sáng-thế Ký 4–50

Viết hết phần còn lại của Sáng-thế Ký theo skill `viet-ghi-chu` (`.claude/skills/viet-ghi-chu/`). Chủ trang cho làm luôn, không chờ duyệt xong 1–3 (issue 0002).

- Mỗi file mở đầu bằng `duyet: false`; mọi ý kiến là `doi-chieu: chua`.
- Xong khi `pnpm test` và `pnpm build` đều qua, và `node scripts/doan.mjs kiem` của từng file không còn trích sai.

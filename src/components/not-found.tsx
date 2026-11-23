import { Title } from "@solidjs/meta";
import { SiteHeader } from "./site-header";

export function NotFound() {
  return (
    <>
      <Title>Không tìm thấy trang này — Kinh Thánh</Title>
      <SiteHeader />
      <div class="mx-auto w-full max-w-2xl px-4 py-8">
        <h1 class="text-2xl font-semibold">Không tìm thấy trang này</h1>
        <p class="mt-3 text-muted">Có thể đoạn này chưa có ghi chú, hoặc đường dẫn bị gõ sai.</p>
        <a href="/" class="mt-6 inline-block text-accent underline">
          Về mục lục
        </a>
      </div>
    </>
  );
}

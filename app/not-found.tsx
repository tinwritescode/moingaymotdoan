import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Không tìm thấy trang này</h1>
        <p className="mt-3 text-muted">Có thể đoạn này chưa có ghi chú, hoặc đường dẫn bị gõ sai.</p>
        <Link href="/" className="mt-6 inline-block text-accent underline">
          Về mục lục
        </Link>
      </div>
    </>
  );
}

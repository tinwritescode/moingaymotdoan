import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Không tìm thấy trang này</h1>
      <p className="mt-3 text-muted">Có thể đoạn này chưa có ghi chú, hoặc đường dẫn bị gõ sai.</p>
      <Link href="/" className="mt-6 inline-block text-accent underline">
        Về mục lục
      </Link>
    </div>
  );
}

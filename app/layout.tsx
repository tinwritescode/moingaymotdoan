import type { Metadata } from "next";
import { Literata } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Kinh Thánh — ghi chú từng đoạn",
  description: "Đọc Kinh Thánh từng đoạn, kèm ghi chú bằng lời thường và ý kiến các nhà giải kinh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${literata.variable} antialiased`}>
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh flex flex-col font-serif text-[1.075rem] leading-relaxed">
        <header className="border-b border-rule">
          <div className="mx-auto max-w-2xl px-4 py-3">
            <Link href="/" className="text-sm tracking-wide text-muted hover:text-accent">
              Kinh Thánh · ghi chú từng đoạn
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-rule">
          <p className="mx-auto max-w-2xl px-4 py-4 text-sm text-muted">
            Lời Kinh Thánh: Bản Truyền Thống (public domain), nguồn{" "}
            <a href="https://ebible.org/find/details.php?id=vie1934" className="underline hover:text-accent">
              eBible.org
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}

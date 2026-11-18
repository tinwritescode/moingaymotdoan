import type { Metadata } from "next";
import { Inter, Literata, Playfair_Display } from "next/font/google";
import "./globals.css";

/** Literata for reading, Inter for navigation and numbers, Playfair Display for the big headings. */
const literata = Literata({ variable: "--font-literata", subsets: ["latin", "vietnamese"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "vietnamese"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Kinh Thánh — ghi chú từng đoạn",
  description: "Đọc Kinh Thánh từng đoạn, kèm ghi chú bằng lời thường và ý kiến các nhà giải kinh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${literata.variable} ${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col font-serif text-[1.075rem] leading-relaxed">
        {/* isolate: Base UI portals its popups to <body>; this keeps them above the whole app. */}
        <div className="isolate flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">{children}</div>
          <footer className="border-t border-rule">
            <p className="px-6 py-4 font-sans text-sm text-muted">
              Lời Kinh Thánh: Bản Truyền Thống (public domain), nguồn{" "}
              <a href="https://ebible.org/find/details.php?id=vie1934" className="underline hover:text-accent">
                eBible.org
              </a>
              .
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}

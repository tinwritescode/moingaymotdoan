import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";

/** Literata for reading, Inter for navigation and numbers, Playfair Display for the big headings. */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Playfair+Display:ital,wght@0,600;0,800;1,600;1,800&display=swap";

/** The HTML shell around every page. */
export default function Document(props: ParentProps) {
  return (
    <html lang="vi" class="antialiased">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Đọc Kinh Thánh từng đoạn, kèm ghi chú bằng lời thường và ý kiến các nhà giải kinh."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link rel="stylesheet" href={FONTS} />
        <title>Kinh Thánh — ghi chú từng đoạn</title>
        <HydrationScript />
      </head>
      <body class="flex min-h-dvh flex-col font-serif text-[1.075rem] leading-relaxed">{props.children}</body>
    </html>
  );
}

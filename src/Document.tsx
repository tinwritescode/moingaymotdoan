import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";
import { DEFAULT_TITLE } from "./components/seo";

/** Lexend cho giao diện & tiêu đề tĩnh lặng; Source Serif 4 cho văn bản đọc Kinh Thánh. */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap";

/** The HTML shell around every page. Route-level SEO/OG/Twitter tags are emitted via <Seo /> (@solidjs/meta). */
export default function Document(props: ParentProps) {
  return (
    <html lang="vi" class="antialiased">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f4f3ee" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111312" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link rel="stylesheet" href={FONTS} />
        <title>{DEFAULT_TITLE}</title>
        <HydrationScript />
      </head>
      <body class="flex min-h-dvh flex-col font-serif text-[1.075rem] leading-relaxed">{props.children}</body>
    </html>
  );
}

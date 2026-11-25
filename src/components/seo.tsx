import { Head, Link, Meta, Title } from "@solidjs/meta";

export const SITE_URL = "https://moingaymotdoan.xyz";
export const SITE_NAME = "Mỗi Ngày Một Đoạn — Kinh Thánh";
export const DEFAULT_TITLE = "Mỗi Ngày Một Đoạn — Kinh Thánh ghi chú từng đoạn";
export const DEFAULT_DESCRIPTION =
  "Đọc trọn bộ 66 sách, 1.189 đoạn Kinh Thánh bằng lời thường — chạm chỗ dẫn xem ngay nguyên văn Bản Truyền Thống 1926, 100 chủ đề cảm xúc, ebook Kindle và lịch sử đọc đồng bộ. Luôn phi lợi nhuận & mã nguồn mở.";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_ALT =
  "Mỗi Ngày Một Đoạn — Đọc trọn bộ 66 sách Kinh Thánh bằng lời thường kèm nguyên văn Bản Truyền Thống 1926";

/** Rút gọn đoạn mô tả SEO/OG gọn đẹp (~160 ký tự) không cắt ngang từ. */
export function truncateMeta(text: string, max = 160): string {
  const clean = text.replace(/\s+/gu, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?—-]+$/u, "")}…`;
}

export function canonicalUrl(path: string): string {
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/gu, "")}`;
  return `${SITE_URL}${clean}`;
}

export type SeoProps = {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

/**
 * Thiết lập thẻ <title>, canonical, Open Graph (Facebook/Zalo) và Twitter/X Card
 * cho từng trang prerendered tĩnh qua @solidjs/meta.
 */
export function Seo(props: SeoProps) {
  const description = () => truncateMeta(props.description ?? DEFAULT_DESCRIPTION);
  const url = () => canonicalUrl(props.path ?? "/");
  const ogType = () => props.type ?? "website";

  return (
    <Head>
      <Title>{props.title}</Title>
      <Meta name="description" content={description()} />
      {props.noindex ? <Meta name="robots" content="noindex, nofollow" /> : null}
      <Link rel="canonical" href={url()} key="canonical" />

      <Meta property="og:type" content={ogType()} />
      <Meta property="og:site_name" content={SITE_NAME} />
      <Meta property="og:locale" content="vi_VN" />
      <Meta property="og:url" content={url()} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={description()} />
      <Meta property="og:image" content={OG_IMAGE_URL} />
      <Meta property="og:image:secure_url" content={OG_IMAGE_URL} />
      <Meta property="og:image:type" content="image/png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta property="og:image:alt" content={OG_IMAGE_ALT} />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:url" content={url()} />
      <Meta name="twitter:title" content={props.title} />
      <Meta name="twitter:description" content={description()} />
      <Meta name="twitter:image" content={OG_IMAGE_URL} />
      <Meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
    </Head>
  );
}

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";
export type ReadingScale = "sm" | "md" | "lg";
export type ReadingFontId = "source-serif" | "literata" | "lora" | "newsreader" | "be-vietnam" | "lexend";

export const THEME_STORAGE_KEY = "kt:theme:v1";
export const FONT_STORAGE_KEY = "kt:reading-font:v1";
export const SCALE_STORAGE_KEY = "kt:reading-scale:v1";
/** Height (px) of the home page's Continue reading card on its last settled render; absent when it had none. */
export const CONTINUE_HEIGHT_STORAGE_KEY = "kt:continue-height:v1";

export const THEME_COLOR_LIGHT = "#f4f3ee";
export const THEME_COLOR_DARK = "#111312";

export const DEFAULT_THEME: ThemeMode = "system";
export const DEFAULT_FONT: ReadingFontId = "source-serif";
export const DEFAULT_SCALE: ReadingScale = "md";

export type ReadingFontOption = {
  id: ReadingFontId;
  name: string;
  tag: string;
  category: "serif" | "sans";
  description: string;
  cssFamily: string;
  /** Null when already loaded in Document.tsx `<head>`. */
  stylesheetUrl: string | null;
};

/**
 * Danh sách phông chữ chọn lọc cho việc đọc Kinh Thánh tiếng Việt:
 * tất cả đều hỗ trợ đầy đủ dấu tiếng Việt (kể cả chữ nghiêng và dấu chồng tầng).
 */
export const READING_FONTS: readonly ReadingFontOption[] = [
  {
    id: "source-serif",
    name: "Source Serif 4",
    tag: "Serif cổ điển",
    category: "serif",
    description: "Cân đối, sắc nét như bản in Kinh Thánh — mặc định của trang.",
    cssFamily: '"Source Serif 4", Georgia, serif',
    stylesheetUrl: null,
  },
  {
    id: "literata",
    name: "Literata",
    tag: "Kiểu sách · Kindle",
    category: "serif",
    description: "Chế tác cho đọc sách dài trên màn hình (Google Play Books).",
    cssFamily: '"Literata", Georgia, serif',
    stylesheetUrl:
      "https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400;1,7..72,600&display=swap",
  },
  {
    id: "lora",
    name: "Lora",
    tag: "Serif mềm mại",
    category: "serif",
    description: "Nét chữ ấm áp, uyển chuyển — hợp đọc Thi-thiên và suy ngẫm.",
    cssFamily: '"Lora", Georgia, serif',
    stylesheetUrl: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap",
  },
  {
    id: "newsreader",
    name: "Newsreader",
    tag: "Serif thanh mảnh",
    category: "serif",
    description: "Thanh lịch kiểu ấn phẩm văn chương, thoáng mắt ở cỡ chữ lớn.",
    cssFamily: '"Newsreader", Georgia, serif',
    stylesheetUrl:
      "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400;1,6..72,600&display=swap",
  },
  {
    id: "be-vietnam",
    name: "Be Vietnam Pro",
    tag: "Không chân · Thuần Việt",
    category: "sans",
    description: "Thiết kế riêng cho dấu tiếng Việt, hiện đại và rõ trên di động.",
    cssFamily: '"Be Vietnam Pro", system-ui, sans-serif',
    stylesheetUrl:
      "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap",
  },
  {
    id: "lexend",
    name: "Lexend",
    tag: "Không chân · Dễ đọc",
    category: "sans",
    description: "Giãn chữ thoáng, giúp giảm mỏi mắt khi đọc liên tục.",
    cssFamily: '"Lexend", system-ui, sans-serif',
    stylesheetUrl: null,
  },
] as const;

export const THEME_OPTIONS: readonly { id: ThemeMode; label: string }[] = [
  { id: "system", label: "Hệ thống" },
  { id: "light", label: "Sáng" },
  { id: "dark", label: "Tối" },
] as const;

export const SCALE_OPTIONS: readonly { id: ReadingScale; label: string; sampleClass: string }[] = [
  { id: "sm", label: "Nhỏ", sampleClass: "text-xs" },
  { id: "md", label: "Vừa", sampleClass: "text-sm" },
  { id: "lg", label: "Lớn", sampleClass: "text-base" },
] as const;

const FONT_BY_ID = new Map<ReadingFontId, ReadingFontOption>(READING_FONTS.map((f) => [f.id, f]));

export function getReadingFont(id: ReadingFontId): ReadingFontOption {
  return FONT_BY_ID.get(id) ?? READING_FONTS[0];
}

export function parseThemeMode(raw: string | null | undefined): ThemeMode {
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return DEFAULT_THEME;
}

export function parseReadingFont(raw: string | null | undefined): ReadingFontId {
  if (raw && FONT_BY_ID.has(raw as ReadingFontId)) return raw as ReadingFontId;
  return DEFAULT_FONT;
}

export function parseReadingScale(raw: string | null | undefined): ReadingScale {
  if (raw === "sm" || raw === "md" || raw === "lg") return raw;
  return DEFAULT_SCALE;
}

export function resolveTheme(mode: ThemeMode, systemDark: boolean): ResolvedTheme {
  if (mode === "light" || mode === "dark") return mode;
  return systemDark ? "dark" : "light";
}

export function ensureFontStylesheet(id: ReadingFontId): void {
  if (typeof document === "undefined") return;
  const font = getReadingFont(id);
  if (!font.stylesheetUrl) return;
  if (document.head.querySelector(`link[data-kt-font="${id}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.crossOrigin = "";
  link.dataset.ktFont = id;
  link.href = font.stylesheetUrl;
  document.head.appendChild(link);
}

export function preloadAllReadingFonts(): void {
  for (const font of READING_FONTS) {
    if (font.stylesheetUrl) ensureFontStylesheet(font.id);
  }
}

export function applyThemeToDom(mode: ThemeMode, resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "system") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = mode;
  }

  const existing = document.head.querySelector('meta[data-kt-theme-color="override"]');
  if (mode === "system") {
    existing?.remove();
    return;
  }
  const meta = existing instanceof HTMLMetaElement ? existing : document.createElement("meta");
  if (!existing) {
    meta.name = "theme-color";
    meta.dataset.ktThemeColor = "override";
    document.head.appendChild(meta);
  }
  meta.content = resolved === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
}

export function applyFontToDom(id: ReadingFontId): void {
  if (typeof document === "undefined") return;
  ensureFontStylesheet(id);
  const root = document.documentElement;
  if (id === DEFAULT_FONT) {
    delete root.dataset.font;
  } else {
    root.dataset.font = id;
  }
}

/**
 * Script khởi tạo sớm đặt trong `<head>` để áp dụng giao diện tối/sáng và phông chữ
 * ngay trước lần vẽ đầu tiên (không nháy giao diện). Tránh hoàn toàn ký tự `<`, `>`, `&`
 * để an toàn dù trình biên dịch SSR có escape text bên trong `<script>`.
 */
export function buildPrefsInitScript(): string {
  const fontUrls: Record<string, string> = {};
  const validFonts: Record<string, 1> = {};
  for (const font of READING_FONTS) {
    if (font.id === DEFAULT_FONT) continue;
    validFonts[font.id] = 1;
    if (font.stylesheetUrl) fontUrls[font.id] = font.stylesheetUrl;
  }
  const safeJson = (value: unknown) => JSON.stringify(value).replace(/&/g, "\\u0026");

  return [
    "try{",
    "var d=document.documentElement,h=document.head,l=localStorage;",
    `var t=l.getItem(${safeJson(THEME_STORAGE_KEY)});`,
    'if(t==="light"||t==="dark"){',
    "d.dataset.theme=t;",
    'var m=document.createElement("meta");',
    'm.name="theme-color";m.dataset.ktThemeColor="override";',
    `m.content=t==="dark"?${safeJson(THEME_COLOR_DARK)}:${safeJson(THEME_COLOR_LIGHT)};`,
    "h.appendChild(m);",
    "}",
    `var f=l.getItem(${safeJson(FONT_STORAGE_KEY)}),v=${safeJson(validFonts)},u=${safeJson(fontUrls)};`,
    "if(f){",
    "if(v[f]){",
    "d.dataset.font=f;",
    "if(u[f]){",
    'var k=document.createElement("link");',
    'k.rel="stylesheet";k.crossOrigin="";k.dataset.ktFont=f;k.href=u[f];',
    "h.appendChild(k);",
    "}",
    "}",
    "}",
    // The Continue reading card renders only after hydration (and the cloud fetch when signed in): hold its room.
    `var c=+l.getItem(${safeJson(CONTINUE_HEIGHT_STORAGE_KEY)});`,
    'if(c)d.style.setProperty("--kt-continue-h",c+"px");',
    "}catch{}",
  ].join("");
}

export const PREFS_INIT_SCRIPT = buildPrefsInitScript();

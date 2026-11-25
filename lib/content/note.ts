import type { Locale } from "../i18n/locale";
import type { Bible } from "./bible";
import type { Book } from "./books";
import { parseRefGroup, type RefPart } from "./refs";

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; children: Inline[] }
  | { kind: "em"; children: Inline[] }
  | { kind: "refs"; parts: RefPart[] }
  | { kind: "thap"; reason: string; children: Inline[] };

export type Paragraph = Inline[];

export const PROSE_HEADINGS = ["Câu chuyện", "Ý chính", "Ý nghĩa sâu xa", "Lưu ý"] as const;
export const OPINIONS_HEADING = "Các nhà giải kinh nói gì";

export const PROSE_HEADINGS_EN = ["Story", "Key Takeaways", "Deeper Meaning", "Notes & Nuances"] as const;
export const OPINIONS_HEADING_EN = "What Commentators Say";

export type SectionKey = "story" | "takeaways" | "meaning" | "notes";
export const SECTION_KEYS: readonly SectionKey[] = ["story", "takeaways", "meaning", "notes"] as const;

export type ProseHeading = (typeof PROSE_HEADINGS)[number] | (typeof PROSE_HEADINGS_EN)[number];

export type Section = {
  key?: SectionKey;
  heading: ProseHeading;
  paragraphs: Paragraph[];
};

export type Level = "cao" | "vua" | "thap";

export type Opinion = {
  name: string;
  body: Paragraph;
  level: Level;
  reason: string;
};

export type Note = {
  title: string;
  sections: Section[];
  opinions: Opinion[];
};

export function proseHeadingsFor(locale: Locale = "vi"): readonly ProseHeading[] {
  return locale === "en" ? PROSE_HEADINGS_EN : PROSE_HEADINGS;
}

export function opinionsHeadingFor(locale: Locale = "vi"): string {
  return locale === "en" ? OPINIONS_HEADING_EN : OPINIONS_HEADING;
}

/** Finds a section by semantic key, falling back to VI/EN heading names for test fixtures. */
export function findSection(sections: readonly Section[], key: SectionKey): Section | undefined {
  const idx = SECTION_KEYS.indexOf(key);
  return sections.find(
    (s) => s.key === key || s.heading === PROSE_HEADINGS[idx] || s.heading === PROSE_HEADINGS_EN[idx],
  );
}

const THAP_OPEN_VI = "<!-- thap:";
const THAP_CLOSE_VI = "<!-- /thap -->";
const THAP_OPEN_EN = "<!-- low:";
const THAP_CLOSE_EN = "<!-- /low -->";

const OPINION_MARK_VI =
  /<!--\s*tin-cay:\s*(cao|vua|thap)\s*\|\s*doi-chieu:\s*(roi|chua)\s*\|\s*ly-do:\s*(.+?)\s*-->\s*$/u;
const OPINION_MARK_EN =
  /<!--\s*confidence:\s*(high|medium|low)\s*\|\s*verified:\s*(yes|no)\s*\|\s*reason:\s*(.+?)\s*-->\s*$/u;

type Ctx = { book: Book; bible: Bible; locale: Locale };

function closing(s: string, token: string, from: number, locale: Locale): number {
  const end = s.indexOf(token, from);
  if (end < 0) {
    throw new Error(
      locale === "en"
        ? `Missing closing "${token}" near: "${s.slice(from - 1, from + 40)}"`
        : `Thiếu "${token}" đóng, gần: "${s.slice(from - 1, from + 40)}"`,
    );
  }
  return end;
}

/** Hand-rolled on purpose: notes use only **bold**, *italic*, low-confidence marks and "( … )" groups. */
function parseInline(s: string, ctx: Ctx): Inline[] {
  const out: Inline[] = [];
  let text = "";
  const push = (node: Inline) => {
    if (text) out.push({ kind: "text", text });
    text = "";
    out.push(node);
  };
  let i = 0;
  while (i < s.length) {
    if (s.startsWith(THAP_OPEN_VI, i)) {
      const headEnd = closing(s, "-->", i, ctx.locale);
      const end = closing(s, THAP_CLOSE_VI, headEnd, ctx.locale);
      const reason = s.slice(i + THAP_OPEN_VI.length, headEnd).trim();
      push({ kind: "thap", reason, children: parseInline(s.slice(headEnd + 3, end), ctx) });
      i = end + THAP_CLOSE_VI.length;
    } else if (s.startsWith(THAP_OPEN_EN, i)) {
      const headEnd = closing(s, "-->", i, ctx.locale);
      const end = closing(s, THAP_CLOSE_EN, headEnd, ctx.locale);
      const reason = s.slice(i + THAP_OPEN_EN.length, headEnd).trim();
      push({ kind: "thap", reason, children: parseInline(s.slice(headEnd + 3, end), ctx) });
      i = end + THAP_CLOSE_EN.length;
    } else if (s.startsWith("<!--", i)) {
      throw new Error(
        ctx.locale === "en" ? `Unexpected comment: "${s.slice(i, i + 60)}"` : `Dấu lạ: "${s.slice(i, i + 60)}"`,
      );
    } else if (s.startsWith("**", i)) {
      const end = closing(s, "**", i + 2, ctx.locale);
      push({ kind: "strong", children: parseInline(s.slice(i + 2, end), ctx) });
      i = end + 2;
    } else if (s[i] === "*") {
      const end = closing(s, "*", i + 1, ctx.locale);
      push({ kind: "em", children: parseInline(s.slice(i + 1, end), ctx) });
      i = end + 1;
    } else {
      const end = s[i] === "(" ? s.indexOf(")", i + 1) : -1;
      const parts = end < 0 ? null : parseRefGroup({ inner: s.slice(i + 1, end), ...ctx });
      if (parts) {
        push({ kind: "refs", parts });
        i = end + 1;
      } else {
        text += s[i];
        i += 1;
      }
    }
  }
  if (text) out.push({ kind: "text", text });
  return out;
}

export function plainText(nodes: Inline[]): string {
  return nodes
    .map((n) => {
      switch (n.kind) {
        case "text":
          return n.text;
        case "refs":
          return `(${n.parts.map((p) => p.lead + p.ref.label).join("; ")})`;
        case "strong":
        case "em":
        case "thap":
          return plainText(n.children);
        default: {
          const _exhaustive: never = n;
          return _exhaustive;
        }
      }
    })
    .join("");
}

function paragraphs(block: string): string[] {
  return block
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter((p) => p !== "");
}

function stripFrontmatter(source: string): string {
  const m = /^---\n[\s\S]*?\n---\n/.exec(source);
  return m ? source.slice(m[0].length) : source;
}

function parseOpinion(text: string, ctx: Ctx): Opinion {
  const mVi = OPINION_MARK_VI.exec(text);
  const mEn = mVi ? null : OPINION_MARK_EN.exec(text);
  const m = mVi ?? mEn;
  if (!m) {
    throw new Error(
      ctx.locale === "en"
        ? `Opinion missing confidence comment: "${text.slice(0, 60)}…"`
        : `Ý kiến thiếu dấu mức tin cậy: "${text.slice(0, 60)}…"`,
    );
  }
  const [mark, rawLevel, , reason] = m;
  const lvl: Level =
    rawLevel === "cao" || rawLevel === "high"
      ? "cao"
      : rawLevel === "vua" || rawLevel === "medium"
        ? "vua"
        : "thap";
  const body = parseInline(text.slice(0, text.length - mark.length).trim(), ctx);
  const first = body[0];
  if (first?.kind !== "strong") {
    throw new Error(
      ctx.locale === "en"
        ? `Opinion must start with a bold author name: "${text.slice(0, 60)}…"`
        : `Ý kiến phải mở đầu bằng tên in đậm: "${text.slice(0, 60)}…"`,
    );
  }
  return { name: plainText(first.children), body, level: lvl, reason };
}

/** Parses one chapter note file. Throws on any rule the authoring guide sets. */
export function parseNote(args: {
  source: string;
  book: Book;
  chapter: number;
  bible: Bible;
  locale?: Locale;
}): Note {
  const locale = args.locale ?? "vi";
  const ctx: Ctx = { book: args.book, bible: args.bible, locale };
  const body = stripFrontmatter(args.source.replace(/\r\n/g, "\n"));
  const [head, ...rest] = body.split(/^## /m);

  const h1 = head.trim();
  const prefixes =
    locale === "en" && args.book.code === "PSA"
      ? [`# Psalms ${args.chapter} — `, `# Psalm ${args.chapter} — `]
      : [`# ${args.book.name} ${args.chapter} — `];
  const matchedPrefix = prefixes.find((p) => h1.startsWith(p));
  if (!matchedPrefix || h1.includes("\n")) {
    throw new Error(
      locale === "en"
        ? `Heading must be "${prefixes[0]}<title>" on a single line before sections`
        : `Tiêu đề phải là "${prefixes[0]}<tiêu đề>" và đứng một mình trước các phần`,
    );
  }

  const proseHeadings = proseHeadingsFor(locale);
  const opinionsHeading = opinionsHeadingFor(locale);
  const expected = [...proseHeadings, opinionsHeading];
  const headings = rest.map((r) => r.split("\n", 1)[0].trim());
  if (headings.join("|") !== expected.join("|")) {
    throw new Error(
      locale === "en"
        ? `Sections must appear in exact order: ${expected.join(", ")}. Found: ${headings.join(", ")}`
        : `Các phần phải đúng thứ tự: ${expected.join(", ")}. Đang có: ${headings.join(", ")}`,
    );
  }
  const blocks = rest.map((r) => paragraphs(r.slice(r.split("\n", 1)[0].length + 1)));

  const sections: Section[] = proseHeadings.map((heading, i) => ({
    key: SECTION_KEYS[i],
    heading,
    paragraphs: blocks[i].map((p) => parseInline(p, ctx)),
  }));
  const opinions = blocks[proseHeadings.length].map((p) => parseOpinion(p, ctx));

  return { title: h1.slice(matchedPrefix.length).trim(), sections, opinions };
}

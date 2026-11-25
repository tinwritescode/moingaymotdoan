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

export type Section = { heading: (typeof PROSE_HEADINGS)[number]; paragraphs: Paragraph[] };

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

const THAP_OPEN = "<!-- thap:";
const THAP_CLOSE = "<!-- /thap -->";
const OPINION_MARK =
  /<!--\s*tin-cay:\s*(cao|vua|thap)\s*\|\s*doi-chieu:\s*(roi|chua)\s*\|\s*ly-do:\s*(.+?)\s*-->\s*$/u;

type Ctx = { book: Book; bible: Bible };

function closing(s: string, token: string, from: number): number {
  const end = s.indexOf(token, from);
  if (end < 0) throw new Error(`Thiếu "${token}" đóng, gần: "${s.slice(from - 1, from + 40)}"`);
  return end;
}

/** Hand-rolled on purpose: notes use only **bold**, *italic*, Thấp marks and "( … )" groups. */
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
    if (s.startsWith(THAP_OPEN, i)) {
      const headEnd = closing(s, "-->", i);
      const end = closing(s, THAP_CLOSE, headEnd);
      const reason = s.slice(i + THAP_OPEN.length, headEnd).trim();
      push({ kind: "thap", reason, children: parseInline(s.slice(headEnd + 3, end), ctx) });
      i = end + THAP_CLOSE.length;
    } else if (s.startsWith("<!--", i)) {
      throw new Error(`Dấu lạ: "${s.slice(i, i + 60)}"`);
    } else if (s.startsWith("**", i)) {
      const end = closing(s, "**", i + 2);
      push({ kind: "strong", children: parseInline(s.slice(i + 2, end), ctx) });
      i = end + 2;
    } else if (s[i] === "*") {
      const end = closing(s, "*", i + 1);
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
  const m = OPINION_MARK.exec(text);
  if (!m) throw new Error(`Ý kiến thiếu dấu mức tin cậy: "${text.slice(0, 60)}…"`);
  const [mark, level, , reason] = m;
  // The regex only matches these literals, so the narrowing below is exact.
  const lvl: Level = level === "cao" ? "cao" : level === "vua" ? "vua" : "thap";
  const body = parseInline(text.slice(0, text.length - mark.length).trim(), ctx);
  const first = body[0];
  if (first?.kind !== "strong") throw new Error(`Ý kiến phải mở đầu bằng tên in đậm: "${text.slice(0, 60)}…"`);
  return { name: plainText(first.children), body, level: lvl, reason };
}

/** Parses one ghi chú file. Throws on any rule the authoring guide (README) sets. */
export function parseNote(args: { source: string; book: Book; chapter: number; bible: Bible }): Note {
  const ctx = { book: args.book, bible: args.bible };
  const body = stripFrontmatter(args.source.replace(/\r\n/g, "\n"));
  const [head, ...rest] = body.split(/^## /m);

  const prefix = `# ${args.book.name} ${args.chapter} — `;
  const h1 = head.trim();
  if (!h1.startsWith(prefix) || h1.includes("\n")) {
    throw new Error(`Tiêu đề phải là "${prefix}<tiêu đề>" và đứng một mình trước các phần`);
  }

  const expected = [...PROSE_HEADINGS, OPINIONS_HEADING];
  const headings = rest.map((r) => r.split("\n", 1)[0].trim());
  if (headings.join("|") !== expected.join("|")) {
    throw new Error(`Các phần phải đúng thứ tự: ${expected.join(", ")}. Đang có: ${headings.join(", ")}`);
  }
  // Body after the heading line; a heading on the last line has none.
  const blocks = rest.map((r) => paragraphs(r.slice(r.split("\n", 1)[0].length + 1)));

  const sections = PROSE_HEADINGS.map((heading, i) => ({
    heading,
    paragraphs: blocks[i].map((p) => parseInline(p, ctx)),
  }));
  const opinions = blocks[PROSE_HEADINGS.length].map((p) => parseOpinion(p, ctx));

  return { title: h1.slice(prefix.length).trim(), sections, opinions };
}

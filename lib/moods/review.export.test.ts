// Xuất bản duyệt nội dung cảm xúc: nguyên văn Bản Truyền Thống đặt ngay cạnh lời gợi ý.
//   MOOD_REVIEW_OUT=/duong/dan.md [MOOD_REVIEW_GROUP=toi-loi] pnpm mood:review
// Chạy qua vitest vì thư viện viết bằng TypeScript; không đặt biến thì bỏ qua.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { it } from "vitest";
import { createContent } from "../content";
import { auditMoods, createMoodCatalog, type MoodView } from "./index";

const OUT = process.env.MOOD_REVIEW_OUT;
const GROUP = process.env.MOOD_REVIEW_GROUP;

function renderMood(view: MoodView, issues: string[], useCount: Map<string, number>): string {
  const lines = [`## ${view.title} (\`${view.slug}\`)`, "", `*${view.prompt}*`, "", `> ${view.intro}`, ""];
  view.passages.forEach((p, i) => {
    const reused = Math.max(
      ...p.ref.verses.map((v) => useCount.get(`${p.ref.book.code} ${p.ref.chapter}:${v.number}`) ?? 0),
    );
    lines.push(`### ${i + 1}. ${p.ref.label}${reused > 1 ? ` — câu cũng dùng ở ${reused - 1} chuyên mục khác` : ""}`);
    lines.push("", p.ref.verses.map((v) => `**${v.number}** ${v.text}`).join(" "), "", `→ ${p.note}`, "");
  });
  lines.push(`**Lời cầu nguyện:** ${view.prayer || "(chưa có)"}`, "");
  if (issues.length > 0) lines.push("**Lỗi tự động:**", ...issues.map((m) => `- ${m}`), "");
  return lines.join("\n");
}

it.runIf(OUT)("xuất bản duyệt nội dung cảm xúc", () => {
  const root = join(import.meta.dirname, "..", "..");
  const catalog = createMoodCatalog({
    content: createContent({ contentDir: join(root, "content"), bibleDir: join(root, "data", "bible") }),
  });
  const views = catalog.index().moods.flatMap((m) => catalog.mood(m.slug) ?? []);
  const issues = auditMoods(views);
  const useCount = new Map<string, number>();
  for (const v of views) {
    for (const p of v.passages) {
      for (const verse of p.ref.verses) {
        const key = `${p.ref.book.code} ${p.ref.chapter}:${verse.number}`;
        useCount.set(key, (useCount.get(key) ?? 0) + 1);
      }
    }
  }
  const picked = views.filter((v) => !GROUP || v.group.id === GROUP);
  const body = picked.map((v) =>
    renderMood(
      v,
      issues.filter((i) => i.slug === v.slug).map((i) => i.message),
      useCount,
    ),
  );
  writeFileSync(OUT!, `# Bản duyệt cảm xúc${GROUP ? ` — nhóm ${GROUP}` : ""}\n\n${body.join("\n---\n\n")}`);
});

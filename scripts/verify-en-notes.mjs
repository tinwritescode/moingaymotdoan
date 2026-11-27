// Verifies English chapter notes in content-en/<en-slug>/NN.md against BSB (data/bible-en/)
// and compares chapter completeness against Vietnamese source content/<vi-slug>/.
// Usage:
//   node scripts/verify-en-notes.mjs genesis:41-45 ruth
//   node scripts/verify-en-notes.mjs --all
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const CONTENT_VI = join(ROOT, "content");
const CONTENT_EN = join(ROOT, "content-en");
const BIBLE_EN = join(ROOT, "data", "bible-en");

// Parse canonical book table from lib/content/books.ts directly (pure Node, no bundler needed).
const booksSrc = readFileSync(join(ROOT, "lib", "content", "books.ts"), "utf8");
const slugify = (name) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[\s-]+/g, "-");

const BOOKS = [...booksSrc.matchAll(/\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)"\]/g)].map(([, code, viName, enName]) => ({
  code,
  viName,
  viSlug: slugify(viName),
  enName,
  enSlug: slugify(enName),
}));

const byEnSlug = new Map(BOOKS.map((b) => [b.enSlug, b]));
const byEnName = new Map(BOOKS.map((b) => [b.enName, b]));
byEnName.set("Psalm", BOOKS.find((b) => b.code === "PSA"));
byEnName.set("Song of Songs", BOOKS.find((b) => b.code === "SOL"));

const bible = new Map();
for (const b of BOOKS) {
  bible.set(b.code, JSON.parse(readFileSync(join(BIBLE_EN, `${b.code}.json`), "utf8")).chapters);
}

const EXPECTED_HEADINGS = ["Story", "Key Takeaways", "Deeper Meaning", "Notes & Nuances", "What Commentators Say"];
const PART_EN = /^(?:(cf\.|see|compare)\s+)?(?:(.+?)\s+)?(\d+):(\d+)(?:\s*[–-]\s*(\d+))?$/iu;
const HAS_REF = /\d+:\d+/;
const OPINION_MARK_EN =
  /<!--\s*confidence:\s*(high|medium|low)\s*\|\s*verified:\s*(yes|no)\s*\|\s*reason:\s*(.+?)\s*-->\s*$/u;
const VI_LEAK_RE = /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/iu;
const ALLOWED_ACCENTED =
  /(?<![A-Za-zÀ-ÖØ-öø-ÿ])(?:Genève|Geneva|résumés?|naïve|naïveté|cafés?|clichés?|façades?|protégés?|protégées?|exposés?|fiancés?|fiancées?|séances?|André|René|François|José|Noël|Zoë|Chloë|Hélène|Bénédicte|Ménard|Émile|Étienne|Sébastien|Thérèse|Céline|Jérôme|Rémi|Vérone|Fénelon|Chateaubriand|Père|Mère|frère|Søren|Kierkegaard|Irenæus|Cæsarea|Ægyptus|déjà|d'être|crème|attachés?|risqué|blasé|passé|touché|émigrés?|soirées?|matinées?|entrées?|dénouement|bête|vis-à-vis|à\s+la|über|corvée|Göttingen|Tübingen|Münster|Zürich|Nürnberg|Würzburg|Königsberg|Böhm|Böhme|Köhler|Müller|Schröder|Jürgen|Moltmann|Brüggemann|Lüdemann|Kähler|Römer|Jüngel|Käsemann|Schürmann|Philo|Irenaeus|Athanasius|Édouard|Mémoires|Poétique|Léon|Céphas|Nazôraios|Jésuites|Jérusalem|Gutiérrez|César|Martín|Ramón|Álvarez|Bérulle|Grégoire|Éphrem|Origène|Clément|Bézà|Bèze|Théodore|Döblin|Gunkel|Böll|Löwith|Küng|Schüssler|Fiorenza|Hengel|Ratzinger|Buber|Zohar|Péguy|Bloy|Maritain|Balthasar|de\s+Lubac|Daniélou|Congar|Chenu|Teilhard|Ricoeur|Ricœur|Levinas|Lévinas|Sánchez|Rodríguez|González|Fernández|Pérez|López|García|Jiménez|Hernández|Díaz|Vázquez|Márquez|Córdoba|Ávila|Ignatius|Loyola|Alcalá|Salamanca|Évangile|Études|Théologie|Commentaire|Traité|Œuvres|Pensées|Méditations|Révélation|Rédemption|Création|Psaumes|Genèse|Exode|Lévitique|Deutéronome|Ésaïe|Jérémie|Ézéchiel|Jésus|Mystère|jusqu'à|Kêphas|Hēgēsippos|dēmos|poimēn|chēra|agapē|ēthos|gnōsis|sōtēria|diathēkē|paraklētos|episkopos|presbyteros|hēmerai)(?![A-Za-zÀ-ÖØ-öø-ÿ])/giu;

function validateInline(s, book, errors, prefix) {
  let i = 0;
  while (i < s.length) {
    if (s.startsWith("<!-- low:", i)) {
      const headEnd = s.indexOf("-->", i);
      const end = headEnd >= 0 ? s.indexOf("<!-- /low -->", headEnd) : -1;
      if (headEnd < 0 || end < 0) {
        errors.push(`${prefix}: unclosed <!-- low: ... -->`);
        return;
      }
      validateInline(s.slice(headEnd + 3, end), book, errors, prefix);
      i = end + "<!-- /low -->".length;
    } else if (s.startsWith("<!--", i)) {
      errors.push(`${prefix}: unexpected comment "${s.slice(i, i + 50)}"`);
      return;
    } else if (s.startsWith("**", i)) {
      const end = s.indexOf("**", i + 2);
      if (end < 0) {
        errors.push(`${prefix}: unclosed ** near "${s.slice(i, i + 40)}"`);
        return;
      }
      validateInline(s.slice(i + 2, end), book, errors, prefix);
      i = end + 2;
    } else if (s[i] === "*") {
      const end = s.indexOf("*", i + 1);
      if (end < 0) {
        errors.push(`${prefix}: unclosed * near "${s.slice(i, i + 40)}"`);
        return;
      }
      validateInline(s.slice(i + 1, end), book, errors, prefix);
      i = end + 1;
    } else if (s[i] === "(") {
      const end = s.indexOf(")", i + 1);
      if (end > i && HAS_REF.test(s.slice(i + 1, end))) {
        const inner = s.slice(i + 1, end);
        let curBook = book;
        for (const rawPart of inner.split(";")) {
          const text = rawPart.trim();
          const m = PART_EN.exec(text);
          if (!m) {
            errors.push(`${prefix}: cannot parse reference "${text}"`);
            continue;
          }
          const [, , name, c, v, endV] = m;
          const target = name === undefined ? curBook : byEnName.get(name);
          if (!target) {
            errors.push(`${prefix}: unknown book "${name}" in "${text}"`);
            continue;
          }
          curBook = target;
          const chNum = Number(c);
          const from = Number(v);
          const to = endV ? Number(endV) : from;
          const verses = bible.get(target.code)[chNum - 1];
          if (!verses || from < 1 || to < from || to > verses.length) {
            errors.push(`${prefix}: nonexistent verse "${text}" in ${target.enName}`);
          }
        }
        i = end + 1;
      } else {
        i += 1;
      }
    } else {
      i += 1;
    }
  }
}

const args = process.argv.slice(2);
const checkAll = args.includes("--all");
const specs = checkAll ? BOOKS.map((b) => b.enSlug) : args.filter((a) => !a.startsWith("-"));

if (specs.length === 0) {
  console.error("Usage: node scripts/verify-en-notes.mjs <en-slug[:start-end]...> | --all");
  process.exit(1);
}

let totalChecked = 0;
let totalExpected = 0;
const errors = [];

for (const spec of specs) {
  const [slug, range] = spec.split(":");
  const book = byEnSlug.get(slug);
  if (!book) {
    errors.push(`Unknown English book slug: ${slug}`);
    continue;
  }
  const viDir = join(CONTENT_VI, book.viSlug);
  const enDir = join(CONTENT_EN, book.enSlug);
  let expectedFiles = readdirSync(viDir)
    .filter((f) => /^\d+\.md$/.test(f))
    .sort();
  if (range) {
    const [fromStr, toStr] = range.split("-");
    const from = Number(fromStr);
    const to = toStr ? Number(toStr) : from;
    expectedFiles = expectedFiles.filter((f) => {
      const n = Number(f.replace(".md", ""));
      return n >= from && n <= to;
    });
  }
  totalExpected += expectedFiles.length;

  if (!existsSync(enDir)) {
    errors.push(`${book.enSlug}: directory content-en/${book.enSlug} missing (${expectedFiles.length} expected)`);
    continue;
  }

  const actualFiles = new Set(readdirSync(enDir).filter((f) => /^\d+\.md$/.test(f)));
  for (const file of expectedFiles) {
    const label = `content-en/${book.enSlug}/${file}`;
    if (!actualFiles.has(file)) {
      errors.push(`${label}: MISSING`);
      continue;
    }
    const raw = readFileSync(join(enDir, file), "utf8").replace(/\r\n/g, "\n");
    totalChecked++;
    const num = Number(file.replace(".md", ""));
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
    const [head, ...rest] = body.split(/^## /m);
    const h1 = head.trim();
    const prefixes =
      book.code === "PSA" ? [`# Psalms ${num} — `, `# Psalm ${num} — `] : [`# ${book.enName} ${num} — `];
    if (!prefixes.some((p) => h1.startsWith(p)) || h1.includes("\n")) {
      errors.push(`${label}: bad H1 "${h1.slice(0, 60)}" (expected "${prefixes[0]}<title>")`);
    }
    const headings = rest.map((r) => r.split("\n", 1)[0].trim());
    if (headings.join("|") !== EXPECTED_HEADINGS.join("|")) {
      errors.push(`${label}: bad headings [${headings.join(", ")}]`);
      continue;
    }
    const blocks = rest.map((r) =>
      r
        .slice(r.split("\n", 1)[0].length + 1)
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
        .filter(Boolean),
    );
    for (let sIdx = 0; sIdx < 4; sIdx++) {
      for (const p of blocks[sIdx]) validateInline(p, book, errors, label);
    }
    for (const op of blocks[4]) {
      const m = OPINION_MARK_EN.exec(op);
      if (!m) {
        errors.push(`${label}: opinion missing confidence comment: "${op.slice(0, 50)}"`);
        continue;
      }
      const textPart = op.slice(0, op.length - m[0].length).trim();
      if (!textPart.startsWith("**")) {
        errors.push(`${label}: opinion must start with bold author name: "${textPart.slice(0, 50)}"`);
      }
      validateInline(textPart, book, errors, label);
    }
    if (/^\s*[-*+]\s+/m.test(body) || /^\s*\d+\.\s+/m.test(body)) {
      errors.push(`${label}: contains disallowed bullet/numbered list`);
    }
    if (/\[[^\]]+\]\([^)]+\)/.test(body)) {
      errors.push(`${label}: contains disallowed markdown link`);
    }
    if (blocks[0].length === 0) errors.push(`${label}: Story section is empty`);

    const viRaw = readFileSync(join(viDir, file), "utf8").replace(/\r\n/g, "\n");
    const viParts = viRaw
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .split(/^## /m)
      .slice(1);
    for (let i = 0; i < 5; i++) {
      const viBlock = (viParts[i] ?? "").split("\n").slice(1).join("\n").trim();
      if (viBlock.length > 0 && blocks[i].length === 0) {
        errors.push(`${label}: section "${EXPECTED_HEADINGS[i]}" is empty but VI is non-empty`);
      }
    }
    const stripped = body.replace(ALLOWED_ACCENTED, "");
    if (VI_LEAK_RE.test(stripped)) {
      const m = VI_LEAK_RE.exec(stripped);
      const ctx = stripped.slice(Math.max(0, m.index - 20), m.index + 30).replace(/\n/g, " ");
      errors.push(`${label}: possible untranslated Vietnamese character near "...${ctx}..."`);
    }
  }
}

if (errors.length > 0) {
  console.error(`FAILED (${errors.length} error(s), checked ${totalChecked}/${totalExpected} chapters):`);
  for (const e of errors.slice(0, 60)) console.error("  -", e);
  if (errors.length > 60) console.error(`  ... and ${errors.length - 60} more`);
  process.exit(1);
}

console.log(`OK: ${totalChecked}/${totalExpected} English chapter notes passed all checks.`);

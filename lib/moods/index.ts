import { getContent, type Content } from "../content";
import type { Locale } from "../i18n/locale";
import { ANXIETY_AND_ANGER } from "./en/groups/anxiety-and-anger";
import { FAMILY_AND_DIRECTION } from "./en/groups/family-and-direction";
import { JOY_AND_SORROW } from "./en/groups/joy-and-sorrow";
import { SIN_AND_TRIALS } from "./en/groups/sin-and-trials";
import { GIA_DINH_VA_DINH_HUONG } from "./groups/gia-dinh-va-dinh-huong";
import { LO_AU_VA_TUC_GIAN } from "./groups/lo-au-va-tuc-gian";
import { NIEM_VUI_VA_NOI_BUON } from "./groups/niem-vui-va-noi-buon";
import { TOI_LOI_VA_THU_THACH } from "./groups/toi-loi-va-thu-thach";
export { auditMoods, MOOD_STANDARD, quotedPieces, type MoodIssue } from "./audit";
export { matchesMood, normalizeSearch } from "./search";
import type {
  MoodDefinition,
  MoodGroup,
  MoodIndex,
  MoodNavLink,
  MoodPassageView,
  MoodSummary,
  MoodView,
} from "./types";

export type {
  MoodDefinition,
  MoodGroup,
  MoodIndex,
  MoodNavLink,
  MoodPassageDef,
  MoodPassageView,
  MoodSummary,
  MoodView,
} from "./types";

export const MOOD_GROUPS: readonly MoodGroup[] = [
  {
    id: "niem-vui",
    name: "Niềm vui & biết ơn",
    shortName: "Niềm vui",
    description: "Khi lòng nhẹ nhõm, bình an, biết ơn hoặc khao khát tôn vinh Chúa.",
  },
  {
    id: "noi-buon",
    name: "Nỗi buồn, mất mát & cô đơn",
    shortName: "Nỗi buồn",
    description: "Khi lòng tan vỡ, lẻ loi, hụt hẫng hay đang bước qua mất mát.",
  },
  {
    id: "lo-au",
    name: "Lo âu, sợ hãi & áp lực",
    shortName: "Lo âu",
    description: "Khi tâm trí bất an, căng thẳng, mất ngủ hoặc hoang mang trước ngày mai.",
  },
  {
    id: "tuc-gian",
    name: "Tức giận, xung đột & tha thứ",
    shortName: "Xung đột & tha thứ",
    description: "Khi bị tổn thương, oan ức, nóng giận hoặc đang vật lộn với sự tha thứ.",
  },
  {
    id: "toi-loi",
    name: "Tội lỗi, cám dỗ & ăn năn",
    shortName: "Cám dỗ & ăn năn",
    description: "Khi đối diện cám dỗ, mặc cảm lỗi lầm hay mong muốn làm lại cuộc đời.",
  },
  {
    id: "thu-thach",
    name: "Kiệt sức, bệnh tật & thử thách",
    shortName: "Thử thách",
    description: "Khi thân thể mỏi mệt, gặp biến cố tài chính, sức khỏe hoặc thử thách dài.",
  },
  {
    id: "gia-dinh",
    name: "Gia đình, tình yêu & các mối quan hệ",
    shortName: "Gia đình & tình yêu",
    description: "Khi xây dựng hôn nhân, nuôi dạy con cái, giữ tình bạn và hòa giải.",
  },
  {
    id: "dinh-huong",
    name: "Công việc, khôn ngoan & định hướng sống",
    shortName: "Định hướng sống",
    description: "Khi cần sự sáng suốt, giữ chính trực, kiên trì và tìm mục đích đời mình.",
  },
];

export const MOOD_GROUPS_EN: readonly MoodGroup[] = [
  {
    id: "joy",
    name: "Joy & Gratitude",
    shortName: "Joy",
    description: "When your heart feels light, peaceful, thankful, or moved to praise God.",
  },
  {
    id: "sorrow",
    name: "Sorrow, Loss & Loneliness",
    shortName: "Sorrow",
    description: "When your heart aches with grief, heartbreak, loneliness, or quiet heaviness.",
  },
  {
    id: "anxiety",
    name: "Anxiety, Fear & Pressure",
    shortName: "Anxiety",
    description: "When your mind feels restless, stressed, sleepless, or uncertain about tomorrow.",
  },
  {
    id: "anger-and-forgiveness",
    name: "Anger, Conflict & Forgiveness",
    shortName: "Conflict & Forgiveness",
    description: "When you feel wronged, angry, bitter, or struggling to forgive and make peace.",
  },
  {
    id: "temptation-and-repentance",
    name: "Sin, Temptation & Repentance",
    shortName: "Temptation & Repentance",
    description: "When facing temptation, carrying guilt, or longing for a fresh start with God.",
  },
  {
    id: "trials",
    name: "Exhaustion, Illness & Trials",
    shortName: "Trials",
    description: "When body and spirit are drained, facing sickness, hardship, or long seasons of testing.",
  },
  {
    id: "family-and-love",
    name: "Family, Love & Relationships",
    shortName: "Family & Love",
    description: "When nurturing marriage, parenting, loyal friendships, boundaries, and reconciliation.",
  },
  {
    id: "life-direction",
    name: "Work, Wisdom & Life Direction",
    shortName: "Life Direction",
    description: "When seeking clarity, integrity, perseverance, deeper prayer, and purpose.",
  },
];

export const MOOD_DEFINITIONS: readonly MoodDefinition[] = [
  ...NIEM_VUI_VA_NOI_BUON,
  ...LO_AU_VA_TUC_GIAN,
  ...TOI_LOI_VA_THU_THACH,
  ...GIA_DINH_VA_DINH_HUONG,
];

export const MOOD_DEFINITIONS_EN: readonly MoodDefinition[] = [
  ...JOY_AND_SORROW,
  ...ANXIETY_AND_ANGER,
  ...SIN_AND_TRIALS,
  ...FAMILY_AND_DIRECTION,
];

export const moodGroupsFor = (locale: Locale = "vi"): readonly MoodGroup[] =>
  locale === "en" ? MOOD_GROUPS_EN : MOOD_GROUPS;

export const moodDefinitionsFor = (locale: Locale = "vi"): readonly MoodDefinition[] =>
  locale === "en" ? MOOD_DEFINITIONS_EN : MOOD_DEFINITIONS;

export type MoodCatalog = {
  locale: Locale;
  index(): MoodIndex;
  mood(slug: string): MoodView | null;
};

type ResolvedMood = {
  def: MoodDefinition;
  group: MoodGroup;
  summary: MoodSummary;
  passages: { ref: ReturnType<Content["lookup"]>; note: string }[];
};

/** Validates all 100 mood guides and resolves every Scripture reference once. */
export function createMoodCatalog(args: {
  content: Content;
  locale?: Locale;
  groups?: readonly MoodGroup[];
  definitions?: readonly MoodDefinition[];
}): MoodCatalog {
  const locale = args.locale ?? args.content.locale ?? "vi";
  const groups = [...(args.groups ?? moodGroupsFor(locale))];
  const definitions = args.definitions ?? moodDefinitionsFor(locale);
  const groupById = new Map(groups.map((g) => [g.id, g]));
  const seenSlugs = new Set<string>();
  const errors: string[] = [];
  const resolved: ResolvedMood[] = [];

  for (const def of definitions) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(def.slug)) {
      errors.push(`Invalid mood slug: "${def.slug}"`);
    }
    if (seenSlugs.has(def.slug)) {
      errors.push(`Duplicate mood slug: "${def.slug}"`);
    }
    seenSlugs.add(def.slug);

    const group = groupById.get(def.groupId);
    if (!group) {
      errors.push(`${def.slug}: unknown group "${def.groupId}"`);
      continue;
    }
    if (!def.title.trim() || !def.prompt.trim() || !def.intro.trim()) {
      errors.push(`${def.slug}: missing title, prompt, or intro`);
    }
    if (def.passages.length === 0) {
      errors.push(`${def.slug}: has no passages`);
    }

    const seenRefs = new Set<string>();
    const passages: ResolvedMood["passages"] = [];
    for (const p of def.passages) {
      if (!p.note.trim()) {
        errors.push(`${def.slug} (${p.ref}): missing reflection note`);
      }
      if (seenRefs.has(p.ref)) {
        errors.push(`${def.slug}: duplicate reference "${p.ref}"`);
      }
      seenRefs.add(p.ref);
      try {
        passages.push({ ref: args.content.lookup({ text: p.ref }), note: p.note });
      } catch (e) {
        errors.push(`${def.slug} (${p.ref}): ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    const books = [...new Set(passages.map((p) => p.ref.book.name))];

    resolved.push({
      def,
      group,
      summary: {
        slug: def.slug,
        title: def.title,
        groupId: def.groupId,
        prompt: def.prompt,
        keywords: [...def.keywords],
        books,
        passageCount: passages.length,
      },
      passages,
    });
  }

  if (errors.length > 0) throw new Error(errors.join("\n"));

  const bySlug = new Map(resolved.map((entry, idx) => [entry.def.slug, { entry, idx }]));
  const byGroup = new Map<string, ResolvedMood[]>();
  for (const entry of resolved) {
    const list = byGroup.get(entry.def.groupId) ?? [];
    list.push(entry);
    byGroup.set(entry.def.groupId, list);
  }

  const navLink = (entry: ResolvedMood | undefined): MoodNavLink | null =>
    entry ? { slug: entry.def.slug, title: entry.def.title } : null;

  return {
    locale,
    index() {
      return {
        groups,
        moods: resolved.map((r) => r.summary),
      };
    },

    mood(slug) {
      const found = bySlug.get(slug);
      if (!found) return null;
      const { entry, idx } = found;

      const tocChapters = new Map<string, string>();
      for (const b of args.content.toc()) {
        for (const ch of b.chapters) {
          tocChapters.set(`${b.book.code}:${ch.number}`, ch.title);
        }
      }

      const passages: MoodPassageView[] = entry.passages.map(({ ref, note }) => {
        const key = `${ref.book.code}:${ref.chapter}`;
        const chapterTitle = tocChapters.get(key) ?? null;
        return { ref, note, chapterTitle, hasChapter: chapterTitle !== null };
      });

      const siblings = byGroup.get(entry.def.groupId) ?? [];
      const siblingIdx = siblings.findIndex((s) => s.def.slug === slug);
      const related: MoodSummary[] = [];
      for (let offset = 1; offset < siblings.length && related.length < 4; offset++) {
        related.push(siblings[(siblingIdx + offset) % siblings.length].summary);
      }

      return {
        slug: entry.def.slug,
        title: entry.def.title,
        group: entry.group,
        prompt: entry.def.prompt,
        intro: entry.def.intro,
        keywords: [...entry.def.keywords],
        passages,
        prayer: entry.def.prayer,
        related,
        prev: navLink(resolved[idx - 1]),
        next: navLink(resolved[idx + 1]),
      };
    },
  };
}

const cached: Partial<Record<Locale, MoodCatalog>> = {};

export function getMoodCatalog(locale: Locale = "vi"): MoodCatalog {
  if (process.env.NODE_ENV !== "production") {
    return createMoodCatalog({ content: getContent(locale), locale });
  }
  cached[locale] ??= createMoodCatalog({ content: getContent(locale), locale });
  return cached[locale];
}

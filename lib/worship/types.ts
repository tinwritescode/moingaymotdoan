/**
 * Domain types for Vietnamese worship resources:
 * Thánh Ca (HTTLVN 1–903), Biệt Thánh Ca / TVCHH (1–387),
 * Kinh Thánh Đối Đáp (1–100), and Bài Tín Điều Các Sứ Đồ.
 */

export type WorshipTab = "thanh-ca" | "tvchh" | "doi-dap" | "tin-dieu" | "chuong-trinh";

export const WORSHIP_TABS: readonly WorshipTab[] = [
  "thanh-ca",
  "tvchh",
  "doi-dap",
  "tin-dieu",
  "chuong-trinh",
] as const;

export function isWorshipTab(value: string | null | undefined): value is WorshipTab {
  return (
    value === "thanh-ca" ||
    value === "tvchh" ||
    value === "doi-dap" ||
    value === "tin-dieu" ||
    value === "chuong-trinh"
  );
}

export type LyricStanza = {
  label: string;
  text: string;
};

export type HymnCategory = {
  roman: string;
  title: string;
  ranges: string;
  subtopics: string[];
  description: string;
};

export type Hymn = {
  number: number;
  code: string;
  title: string;
  categoryRoman: string;
  category: string;
  scriptureRef?: string;
  karaokeId?: string;
  mp3Url: string;
  sheetUrl: string;
  stanzas: LyricStanza[];
};

export type ThanhCaDataset = {
  categories: HymnCategory[];
  songs: Hymn[];
};

export type TvchhSong = {
  number: number;
  code: string;
  title: string;
  tcRef?: number;
  karaokeId?: string;
  stanzas: LyricStanza[];
};

export type TvchhDataset = {
  songs: TvchhSong[];
};

export type ResponsiveTurn = {
  role: "leader" | "congregation";
  text: string;
  ref?: string;
};

export type ResponsiveReading = {
  number: number;
  code: string;
  title: string;
  category: string;
  scriptureRefs: string[];
  turns: ResponsiveTurn[];
};

export type KtddDataset = {
  categories: string[];
  readings: ResponsiveReading[];
};

export type CreedClause = {
  id: string;
  order: number;
  trinitySection: string;
  clause: string;
  doctrineTitle: string;
  explanation: string;
  scriptureRefs: string[];
  hienChuongRef: string;
};

export type LiturgicalPrayer = {
  title: string;
  performer: string;
  citation: string;
  note: string;
  verbatimText: string;
};

export type TinDieuDataset = {
  creed: {
    title: string;
    citation: string;
    liturgicalNote: string;
    verbatimText: string;
    clauses: CreedClause[];
  };
  liturgy: {
    lordsPrayer: LiturgicalPrayer;
    benediction: LiturgicalPrayer;
  };
};

export type WorshipSlide = {
  badge?: string;
  body: string;
  emphasis?: boolean;
  footer?: string;
};

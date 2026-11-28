import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { KtddDataset, ThanhCaDataset, TinDieuDataset, TvchhDataset } from "./types";

export type {
  CreedClause,
  Hymn,
  HymnCategory,
  KtddDataset,
  LiturgicalPrayer,
  LyricStanza,
  ResponsiveReading,
  ResponsiveTurn,
  ThanhCaDataset,
  TinDieuDataset,
  TvchhDataset,
  TvchhSong,
  WorshipSlide,
  WorshipTab,
} from "./types";
export { isWorshipTab, WORSHIP_TABS } from "./types";
export {
  buildCreedSlides,
  buildHymnSlides,
  buildKtddSlides,
  firstLyricLine,
  formatSongCopyText,
  formatKtddCopyText,
  matchesHymn,
  matchesKtdd,
  resolveScriptureChapterHref,
  thanhCaBeatUrl,
} from "./search";
export { buildPptx, pptxFilename } from "./pptx";
export {
  hasProgramItem,
  moveProgramItem,
  parseProgramStorage,
  PROGRAM_STORAGE_KEY,
  programItemId,
  removeProgramItem,
  toggleProgramItem,
  type ProgramItem,
} from "./program";

const WORSHIP_DIR = join(process.cwd(), "data", "worship");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(WORSHIP_DIR, file), "utf8")) as T;
}

let thanhCaCache: ThanhCaDataset | undefined;
let tvchhCache: TvchhDataset | undefined;
let ktddCache: KtddDataset | undefined;
let tinDieuCache: TinDieuDataset | undefined;

export function loadThanhCa(): ThanhCaDataset {
  thanhCaCache ??= readJson<ThanhCaDataset>("thanh-ca.json");
  return thanhCaCache;
}

export function loadTvchh(): TvchhDataset {
  tvchhCache ??= readJson<TvchhDataset>("tvchh.json");
  return tvchhCache;
}

export function loadKtdd(): KtddDataset {
  ktddCache ??= readJson<KtddDataset>("ktdd.json");
  return ktddCache;
}

export function loadTinDieu(): TinDieuDataset {
  tinDieuCache ??= readJson<TinDieuDataset>("tin-dieu.json");
  return tinDieuCache;
}

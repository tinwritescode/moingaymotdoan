import { createMemo, createSignal, For, Loading, onCleanup, onSettled, Show } from "solid-js";
import { normalizeSearch } from "../../lib/moods/search";
import {
  buildCreedSlides,
  buildHymnSlides,
  buildKtddSlides,
  downloadPptx,
  firstLyricLine,
  formatKtddCopyText,
  formatSongCopyText,
  hasProgramItem,
  isWorshipTab,
  matchesHymn,
  matchesKtdd,
  moveProgramItem,
  parseProgramStorage,
  pptxFilename,
  PROGRAM_STORAGE_KEY,
  programItemId,
  removeProgramItem,
  resolveScriptureChapterHref,
  thanhCaBeatUrl,
  toggleProgramItem,
  WORSHIP_TABS,
  type Hymn,
  type KtddDataset,
  type ProgramItem,
  type ResponsiveReading,
  type ThanhCaDataset,
  type TinDieuDataset,
  type TvchhDataset,
  type TvchhSong,
  type WorshipSlide,
  type WorshipTab,
} from "../../lib/worship/search-client";
import { getKtdd, getThanhCa, getTinDieu, getTvchh } from "../data";
import { ariaState } from "./aria";
import { copyText } from "./copy-verse-button";
import { useLocale } from "./locale-context";

const FONT_SIZES = ["text-[1.02rem]", "text-[1.15rem]", "text-[1.32rem]", "text-[1.5rem]"] as const;
const LIST_PAGE_SIZE = 100;

export type WorshipBrowserProps = {
  /** Optional injected datasets (used by tests to avoid network fetches). */
  thanhCa?: ThanhCaDataset;
  tvchh?: TvchhDataset;
  ktdd?: KtddDataset;
  tinDieu?: TinDieuDataset;
};

const TAB_COUNTS: Record<Exclude<WorshipTab, "chuong-trinh">, number> = {
  "thanh-ca": 903,
  tvchh: 387,
  "doi-dap": 100,
  "tin-dieu": 12,
};

function saveProgram(items: readonly ProgramItem[]): void {
  try {
    window.localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota / private mode failures.
  }
}

/**
 * Quiet worship library: 903 Thánh Ca, 387 Biệt Thánh Ca (TVCHH), 100 Kinh Thánh Đối Đáp,
 * and Bài Tín Điều Các Sứ Đồ — with instant search, audio/karaoke, copy, and slide presentation.
 */
export function WorshipBrowser(props: WorshipBrowserProps) {
  const { t } = useLocale();
  const [tab, setTab] = createSignal<WorshipTab>("thanh-ca");
  const [selectedTc, setSelectedTc] = createSignal(1);
  const [selectedTv, setSelectedTv] = createSignal(1);
  const [selectedKtdd, setSelectedKtdd] = createSignal(1);
  const [tcCategory, setTcCategory] = createSignal<string>("all");
  const [ktddCategory, setKtddCategory] = createSignal<string>("all");
  const [search, setSearch] = createSignal("");
  const [listLimit, setListLimit] = createSignal(LIST_PAGE_SIZE);
  const [mobileView, setMobileView] = createSignal<"list" | "detail">("list");
  const [fontIdx, setFontIdx] = createSignal(1);
  const [slides, setSlides] = createSignal<WorshipSlide[] | null>(null);
  const [program, setProgram] = createSignal<ProgramItem[]>([]);
  const [programBusy, setProgramBusy] = createSignal(false);

  const thanhCaData = createMemo(() => props.thanhCa ?? getThanhCa());
  const tvchhData = createMemo(() => (tab() === "tvchh" ? (props.tvchh ?? getTvchh()) : undefined));
  const ktddData = createMemo(() => (tab() === "doi-dap" ? (props.ktdd ?? getKtdd()) : undefined));
  const tinDieuData = createMemo(() => (tab() === "tin-dieu" ? (props.tinDieu ?? getTinDieu()) : undefined));

  const updateProgram = (next: ProgramItem[]) => {
    setProgram(next);
    saveProgram(next);
  };

  const handleToggleProgram = (item: ProgramItem) => updateProgram(toggleProgramItem(program(), item));
  const handleMoveProgram = (index: number, delta: -1 | 1) => updateProgram(moveProgramItem(program(), index, delta));
  const handleRemoveProgram = (id: string) => updateProgram(removeProgramItem(program(), id));
  const handleClearProgram = () => updateProgram([]);

  const resolveProgramSlides = async (items: readonly ProgramItem[]): Promise<WorshipSlide[]> => {
    const needTc = items.some((i) => i.kind === "thanh-ca");
    const needTv = items.some((i) => i.kind === "tvchh");
    const needKt = items.some((i) => i.kind === "doi-dap");
    const needTd = items.some((i) => i.kind === "tin-dieu");
    const [tc, tv, kt, td] = await Promise.all([
      needTc ? (props.thanhCa ?? getThanhCa()) : Promise.resolve(undefined),
      needTv ? (props.tvchh ?? getTvchh()) : Promise.resolve(undefined),
      needKt ? (props.ktdd ?? getKtdd()) : Promise.resolve(undefined),
      needTd ? (props.tinDieu ?? getTinDieu()) : Promise.resolve(undefined),
    ]);
    const deck: WorshipSlide[] = [];
    for (const item of items) {
      if (item.kind === "thanh-ca") {
        const song = tc?.songs.find((s) => s.number === item.number);
        if (song) deck.push(...buildHymnSlides(song));
      } else if (item.kind === "tvchh") {
        const song = tv?.songs.find((s) => s.number === item.number);
        if (song) deck.push(...buildHymnSlides(song));
      } else if (item.kind === "doi-dap") {
        const reading = kt?.readings.find((r) => r.number === item.number);
        if (reading) {
          deck.push(
            ...buildKtddSlides(reading, {
              leader: t().worship.leaderLabel,
              congregation: t().worship.congregationLabel,
            }),
          );
        }
      } else if (item.kind === "tin-dieu" && td) {
        deck.push(...buildCreedSlides(td));
      }
    }
    return deck;
  };

  const presentProgram = async () => {
    const items = program();
    if (items.length === 0 || programBusy()) return;
    setProgramBusy(true);
    try {
      const deck = await resolveProgramSlides(items);
      if (deck.length > 0) setSlides(deck);
    } finally {
      setProgramBusy(false);
    }
  };

  const exportProgramPptx = async () => {
    const items = program();
    if (items.length === 0 || programBusy()) return;
    setProgramBusy(true);
    try {
      const deck = await resolveProgramSlides(items);
      if (deck.length > 0) downloadPptx("chuong-trinh-tho-phuong.pptx", deck);
    } finally {
      setProgramBusy(false);
    }
  };

  const syncUrl = (next: { tab?: WorshipTab; so?: number; q?: string }) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const nextTab = next.tab ?? tab();
    url.searchParams.set("tab", nextTab);
    if (nextTab === "tin-dieu" || nextTab === "chuong-trinh") {
      url.searchParams.delete("so");
    } else if (next.so !== undefined) {
      url.searchParams.set("so", String(next.so));
    }
    if (next.q !== undefined) {
      if (next.q.trim()) url.searchParams.set("q", next.q.trim());
      else url.searchParams.delete("q");
    }
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  };

  onSettled(() => {
    const params = new URLSearchParams(window.location.search);
    const rawTab = params.get("tab");
    const initialTab: WorshipTab = isWorshipTab(rawTab) ? rawTab : "thanh-ca";
    setTab(initialTab);
    const rawSo = Number(params.get("so") ?? params.get("hymn") ?? params.get("ktdd") ?? "");
    if (Number.isInteger(rawSo) && rawSo >= 1) {
      if (initialTab === "thanh-ca") setSelectedTc(rawSo);
      else if (initialTab === "tvchh") setSelectedTv(rawSo);
      else if (initialTab === "doi-dap") setSelectedKtdd(rawSo);
      setMobileView("detail");
    }
    const q = params.get("q") ?? "";
    if (q) setSearch(q);
    try {
      setProgram(parseProgramStorage(window.localStorage.getItem(PROGRAM_STORAGE_KEY)));
    } catch {
      // Ignore storage access errors.
    }
  });

  const switchTab = (next: WorshipTab) => {
    setTab(next);
    setSearch("");
    setListLimit(LIST_PAGE_SIZE);
    setMobileView(next === "tin-dieu" || next === "chuong-trinh" ? "detail" : "list");
    const num = next === "thanh-ca" ? selectedTc() : next === "tvchh" ? selectedTv() : selectedKtdd();
    syncUrl({ tab: next, so: num, q: "" });
  };

  const openThanhCa = (num: number) => {
    setTab("thanh-ca");
    setSelectedTc(num);
    setMobileView("detail");
    syncUrl({ tab: "thanh-ca", so: num });
  };

  const openTvchh = (num: number) => {
    setTab("tvchh");
    setSelectedTv(num);
    setMobileView("detail");
    syncUrl({ tab: "tvchh", so: num });
  };

  const openKtdd = (num: number) => {
    setTab("doi-dap");
    setSelectedKtdd(num);
    setMobileView("detail");
    syncUrl({ tab: "doi-dap", so: num });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setListLimit(LIST_PAGE_SIZE);
    if (value.trim()) setMobileView("list");
    syncUrl({ q: value });
  };

  const fontSizeClass = () => FONT_SIZES[fontIdx()];
  const stepFont = (delta: -1 | 1) => setFontIdx((i) => Math.min(FONT_SIZES.length - 1, Math.max(0, i + delta)));

  const normalizedQuery = createMemo(() => normalizeSearch(search()));

  const tabCount = (id: WorshipTab): number => {
    if (id === "chuong-trinh") return program().length;
    if (id === "thanh-ca" && props.thanhCa) return props.thanhCa.songs.length;
    if (id === "tvchh" && props.tvchh) return props.tvchh.songs.length;
    if (id === "doi-dap" && props.ktdd) return props.ktdd.readings.length;
    if (id === "tin-dieu" && props.tinDieu) return props.tinDieu.creed.clauses.length;
    return TAB_COUNTS[id];
  };

  return (
    <main class="mx-auto w-full max-w-[60rem] animate-reveal overflow-x-clip px-4 pt-5 pb-14 sm:px-5 motion-reduce:animate-none">
      <header>
        <p class="font-sans text-xs font-medium text-accent">{t().worship.kicker}</p>
        <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          {t().worship.heading}
        </h1>
        <p class="mt-1.5 text-[15px] leading-relaxed text-muted">{t().worship.subtitle}</p>
        <Show when={t().worship.vietnameseNote}>
          {(note) => <p class="mt-1 font-sans text-xs text-muted/90">{note()}</p>}
        </Show>

        {/* 4 worship tabs */}
        <div
          role="tablist"
          aria-label={t().worship.tabsLabel}
          class="-mx-4 mt-5 flex gap-1.5 overflow-x-auto border-b border-rule px-4 pb-3 font-sans [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
        >
          <For each={WORSHIP_TABS}>
            {(id) => {
              const active = () => tab() === id;
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={ariaState(active())}
                  onClick={() => switchTab(id)}
                  class={[
                    "inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    active()
                      ? "border-accent bg-side text-accent"
                      : "border-rule bg-card text-muted hover:border-accent/60 hover:text-ink",
                  ]}
                >
                  <span class="sm:hidden">{t().worship.tabs[id].short}</span>
                  <span class="hidden sm:inline">{t().worship.tabs[id].label}</span>
                  <span
                    class={[
                      "rounded-full px-1.5 py-0.5 text-[11px] leading-none",
                      active() ? "bg-accent text-paper" : "bg-paper text-muted",
                    ]}
                  >
                    {tabCount(id)}
                  </span>
                </button>
              );
            }}
          </For>
        </div>
      </header>

      <div class="mt-5">
        <Show when={tab() === "thanh-ca"}>
          <Loading fallback={<TabSkeleton />}>
            <Show when={thanhCaData()}>
              {(dataset) => (
                <ThanhCaSection
                  dataset={dataset()}
                  selectedNumber={selectedTc()}
                  category={tcCategory()}
                  search={search()}
                  normalizedQuery={normalizedQuery()}
                  listLimit={listLimit()}
                  mobileView={mobileView()}
                  fontSizeClass={fontSizeClass()}
                  onSelectCategory={(c) => {
                    setTcCategory(c);
                    setListLimit(LIST_PAGE_SIZE);
                  }}
                  onSearch={handleSearch}
                  onSelect={openThanhCa}
                  onBackToList={() => setMobileView("list")}
                  onLoadMore={() => setListLimit((n) => n + LIST_PAGE_SIZE)}
                  onStepFont={stepFont}
                  onPresent={(song) => setSlides(buildHymnSlides(song))}
                  onDownloadPptx={(song) => downloadPptx(pptxFilename(`thanh-ca-${song.number}`, song.title), buildHymnSlides(song))}
                  program={program()}
                  onToggleProgram={handleToggleProgram}
                />
              )}
            </Show>
          </Loading>
        </Show>

        <Show when={tab() === "tvchh"}>
          <Loading fallback={<TabSkeleton />}>
            <Show when={tvchhData()}>
              {(dataset) => (
                <TvchhSection
                  dataset={dataset()}
                  selectedNumber={selectedTv()}
                  search={search()}
                  normalizedQuery={normalizedQuery()}
                  listLimit={listLimit()}
                  mobileView={mobileView()}
                  fontSizeClass={fontSizeClass()}
                  onSearch={handleSearch}
                  onSelect={openTvchh}
                  onOpenThanhCa={openThanhCa}
                  onBackToList={() => setMobileView("list")}
                  onLoadMore={() => setListLimit((n) => n + LIST_PAGE_SIZE)}
                  onStepFont={stepFont}
                  onPresent={(song) => setSlides(buildHymnSlides(song))}
                  onDownloadPptx={(song) => downloadPptx(pptxFilename(`tvchh-${song.number}`, song.title), buildHymnSlides(song))}
                  program={program()}
                  onToggleProgram={handleToggleProgram}
                />
              )}
            </Show>
          </Loading>
        </Show>

        <Show when={tab() === "doi-dap"}>
          <Loading fallback={<TabSkeleton />}>
            <Show when={ktddData()}>
              {(dataset) => (
                <KtddSection
                  dataset={dataset()}
                  selectedNumber={selectedKtdd()}
                  category={ktddCategory()}
                  search={search()}
                  normalizedQuery={normalizedQuery()}
                  mobileView={mobileView()}
                  fontSizeClass={fontSizeClass()}
                  onSelectCategory={setKtddCategory}
                  onSearch={handleSearch}
                  onSelect={openKtdd}
                  onBackToList={() => setMobileView("list")}
                  onStepFont={stepFont}
                  onPresent={(reading) =>
                    setSlides(
                      buildKtddSlides(reading, {
                        leader: t().worship.leaderLabel,
                        congregation: t().worship.congregationLabel,
                      }),
                    )
                  }
                  onDownloadPptx={(reading) =>
                    downloadPptx(
                      pptxFilename(`ktdd-${reading.code}`, reading.title),
                      buildKtddSlides(reading, {
                        leader: t().worship.leaderLabel,
                        congregation: t().worship.congregationLabel,
                      }),
                    )
                  }
                  program={program()}
                  onToggleProgram={handleToggleProgram}
                />
              )}
            </Show>
          </Loading>
        </Show>

        <Show when={tab() === "tin-dieu"}>
          <Loading fallback={<TabSkeleton />}>
            <Show when={tinDieuData()}>
              {(dataset) => (
                <TinDieuSection
                  dataset={dataset()}
                  fontSizeClass={fontSizeClass()}
                  onStepFont={stepFont}
                  onPresent={() => setSlides(buildCreedSlides(dataset()))}
                  onDownloadPptx={() => downloadPptx("tin-dieu-cac-su-do.pptx", buildCreedSlides(dataset()))}
                  program={program()}
                  onToggleProgram={handleToggleProgram}
                />
              )}
            </Show>
          </Loading>
        </Show>

        <Show when={tab() === "chuong-trinh"}>
          <ProgramSection
            items={program()}
            busy={programBusy()}
            onOpen={(item) => {
              if (item.kind === "thanh-ca") openThanhCa(item.number);
              else if (item.kind === "tvchh") openTvchh(item.number);
              else if (item.kind === "doi-dap") openKtdd(item.number);
              else switchTab("tin-dieu");
            }}
            onMove={handleMoveProgram}
            onRemove={handleRemoveProgram}
            onClear={handleClearProgram}
            onPresent={() => void presentProgram()}
            onDownloadPptx={() => void exportProgramPptx()}
          />
        </Show>
      </div>

      <p class="mt-10 rounded-2xl border border-rule bg-card/70 px-4 py-3 font-sans text-xs leading-relaxed text-muted">
        {t().worship.sourceNote}
      </p>

      <Show when={slides()}>
        {(deck) => <SlidePresenter slides={deck()} onClose={() => setSlides(null)} />}
      </Show>
    </main>
  );
}

function TabSkeleton() {
  const { t } = useLocale();
  return (
    <div class="rounded-3xl border border-rule bg-card p-8 text-center font-sans text-sm text-muted">
      {t().skeleton.loading}
    </div>
  );
}

function SearchInput(props: { value: string; placeholder: string; onInput: (value: string) => void }) {
  const { t } = useLocale();
  return (
    <div class="relative font-sans">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.5-4.5" />
      </svg>
      <input
        type="search"
        aria-label={t().worship.searchLabel}
        placeholder={props.placeholder}
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        class="min-h-11 w-full rounded-full border border-rule bg-paper py-2 pr-9 pl-10 text-sm text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      <Show when={props.value.length > 0}>
        <button
          type="button"
          aria-label={t().worship.clearSearchAria}
          onClick={() => props.onInput("")}
          class="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-lg text-muted hover:bg-side hover:text-ink"
        >
          ×
        </button>
      </Show>
    </div>
  );
}

function FontSizeButtons(props: { onStep: (delta: -1 | 1) => void }) {
  const { t } = useLocale();
  return (
    <div
      role="group"
      aria-label={t().worship.fontSizeLabel}
      class="inline-flex items-center rounded-full border border-rule bg-paper p-0.5 font-sans text-xs"
    >
      <button
        type="button"
        onClick={() => props.onStep(-1)}
        class="min-h-8 cursor-pointer rounded-full px-2.5 text-muted hover:bg-side hover:text-ink"
      >
        A−
      </button>
      <button
        type="button"
        onClick={() => props.onStep(1)}
        class="min-h-8 cursor-pointer rounded-full px-2.5 text-muted hover:bg-side hover:text-ink"
      >
        A+
      </button>
    </div>
  );
}

function CopyActionButton(props: { text: () => string }) {
  const { t } = useLocale();
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  const handleCopy = async () => {
    const ok = await copyText(props.text());
    if (!ok) return;
    setCopied(true);
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      class={[
        "inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 font-sans text-xs font-medium transition-colors",
        copied()
          ? "border-accent bg-accent text-paper"
          : "border-rule bg-paper text-ink hover:border-accent hover:text-accent",
      ]}
    >
      {copied() ? t().worship.copied : t().worship.copy}
    </button>
  );
}

function ScriptureChip(props: { citation: string }) {
  const { locale } = useLocale();
  const href = createMemo(() => resolveScriptureChapterHref(props.citation, locale()));
  return (
    <Show
      when={href()}
      fallback={
        <span class="inline-flex items-center rounded-full border border-rule bg-paper px-2.5 py-0.5 font-sans text-xs text-muted">
          {props.citation}
        </span>
      }
    >
      {(url) => (
        <a
          href={url()}
          class="inline-flex items-center rounded-full border border-rule bg-paper px-2.5 py-0.5 font-sans text-xs text-accent transition-colors hover:border-accent hover:bg-side"
        >
          {props.citation} →
        </a>
      )}
    </Show>
  );
}

function ProgramToggleButton(props: {
  item: ProgramItem;
  program: readonly ProgramItem[];
  onToggle: (item: ProgramItem) => void;
}) {
  const { t } = useLocale();
  const active = () => hasProgramItem(props.program, programItemId(props.item));
  return (
    <button
      type="button"
      aria-pressed={ariaState(active())}
      onClick={() => props.onToggle(props.item)}
      class={[
        "inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 font-sans text-xs font-medium transition-colors",
        active()
          ? "border-accent bg-side text-accent"
          : "border-rule bg-paper text-ink hover:border-accent hover:text-accent",
      ]}
    >
      {active() ? t().worship.inProgram : t().worship.addToProgram}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 1. Thánh Ca (903)
// ---------------------------------------------------------------------------
function ThanhCaSection(props: {
  dataset: ThanhCaDataset;
  selectedNumber: number;
  category: string;
  search: string;
  normalizedQuery: string;
  listLimit: number;
  mobileView: "list" | "detail";
  fontSizeClass: string;
  onSelectCategory: (cat: string) => void;
  onSearch: (q: string) => void;
  onSelect: (num: number) => void;
  onBackToList: () => void;
  onLoadMore: () => void;
  onStepFont: (delta: -1 | 1) => void;
  onPresent: (song: Hymn) => void;
  onDownloadPptx: (song: Hymn) => void;
  program: readonly ProgramItem[];
  onToggleProgram: (item: ProgramItem) => void;
}) {
  const { t } = useLocale();
  const [media, setMedia] = createSignal<{ song: number; mode: "audio" | "beat" | "karaoke" } | null>(null);
  const activeMedia = () => {
    const m = media();
    return m && m.song === props.selectedNumber ? m.mode : "none";
  };
  const toggleMedia = (mode: "audio" | "beat" | "karaoke") => {
    setMedia((cur) =>
      cur && cur.song === props.selectedNumber && cur.mode === mode ? null : { song: props.selectedNumber, mode },
    );
  };

  const countsByRoman = createMemo(() => {
    const map = new Map<string, number>();
    for (const s of props.dataset.songs) {
      map.set(s.categoryRoman, (map.get(s.categoryRoman) ?? 0) + 1);
    }
    return map;
  });

  const filtered = createMemo(() => {
    const cat = props.category;
    const q = props.normalizedQuery;
    return props.dataset.songs.filter((s) => (cat === "all" || s.categoryRoman === cat) && matchesHymn(s, q));
  });

  const currentSong = createMemo(
    () => props.dataset.songs.find((s) => s.number === props.selectedNumber) ?? props.dataset.songs[0],
  );

  const adjacent = createMemo(() => {
    const list = props.dataset.songs;
    const idx = list.findIndex((s) => s.number === currentSong()?.number);
    return {
      prev: idx > 0 ? list[idx - 1] : null,
      next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
    };
  });

  const visibleList = createMemo(() => filtered().slice(0, props.listLimit));

  return (
    <div class="space-y-4">
      {/* Category pills */}
      <div class="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 font-sans [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          aria-pressed={ariaState(props.category === "all")}
          onClick={() => props.onSelectCategory("all")}
          class={[
            "min-h-8 shrink-0 cursor-pointer rounded-full border px-3 text-xs transition-colors",
            props.category === "all"
              ? "border-accent bg-accent font-medium text-paper"
              : "border-rule bg-card text-muted hover:border-accent/60 hover:text-ink",
          ]}
        >
          {t().worship.allCategories(props.dataset.songs.length)}
        </button>
        <For each={props.dataset.categories}>
          {(cat) => {
            const count = () => countsByRoman().get(cat.roman) ?? 0;
            const active = () => props.category === cat.roman;
            return (
              <Show when={count() > 0}>
                <button
                  type="button"
                  aria-pressed={ariaState(active())}
                  onClick={() => props.onSelectCategory(active() ? "all" : cat.roman)}
                  class={[
                    "min-h-8 shrink-0 cursor-pointer rounded-full border px-3 text-xs transition-colors",
                    active()
                      ? "border-accent bg-side font-medium text-accent"
                      : "border-rule bg-card text-muted hover:border-accent/60 hover:text-ink",
                  ]}
                >
                  {cat.title} ({count()})
                </button>
              </Show>
            );
          }}
        </For>
      </div>

      <div class="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        {/* Sidebar song list */}
        <aside
          aria-label={t().worship.songListHeading}
          class={[
            "min-w-0 rounded-3xl border border-rule bg-card p-3 lg:sticky lg:top-[4.5rem] lg:flex lg:max-h-[calc(100dvh-7.5rem)] lg:flex-col",
            props.mobileView === "detail" && "hidden lg:flex",
          ]}
        >
          <SearchInput
            value={props.search}
            placeholder={t().worship.searchHymnPlaceholder}
            onInput={props.onSearch}
          />
          <p class="mt-2 px-1 font-sans text-[11px] text-muted">
            {t().worship.showingCount(filtered().length, props.dataset.songs.length)}
          </p>
          <div class="mt-2 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
            <Show
              when={visibleList().length > 0}
              fallback={<p class="p-4 text-center font-sans text-xs text-muted">{t().worship.emptyList}</p>}
            >
              <For each={visibleList()}>
                {(song) => {
                  const selected = () => currentSong()?.number === song.number;
                  return (
                    <button
                      type="button"
                      onClick={() => props.onSelect(song.number)}
                      class={[
                        "w-full cursor-pointer rounded-2xl border px-3 py-2.5 text-left transition-colors",
                        selected()
                          ? "border-accent bg-side"
                          : "border-transparent bg-paper/60 hover:border-rule hover:bg-paper",
                      ]}
                    >
                      <div class="flex min-w-0 items-baseline gap-2">
                        <span class="shrink-0 font-sans text-xs font-semibold text-accent">#{song.number}</span>
                        <span class="min-w-0 truncate font-serif text-[15px] font-medium text-ink">{song.title}</span>
                      </div>
                      <p class="mt-0.5 truncate font-sans text-xs text-muted">
                        {firstLyricLine(song.stanzas) || song.category}
                      </p>
                    </button>
                  );
                }}
              </For>
              <Show when={visibleList().length < filtered().length}>
                <button
                  type="button"
                  onClick={() => props.onLoadMore()}
                  class="mt-2 min-h-10 w-full cursor-pointer rounded-full border border-rule bg-paper font-sans text-xs font-medium text-accent hover:border-accent"
                >
                  +{filtered().length - visibleList().length}
                </button>
              </Show>
            </Show>
          </div>
        </aside>

        {/* Detail reader */}
        <section class={["min-w-0", props.mobileView === "list" ? "hidden lg:block" : "block"]}>
          <Show when={currentSong()}>
            {(song) => (
              <article class="min-w-0 rounded-3xl border border-rule bg-card p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() => props.onBackToList()}
                  class="mb-3 inline-flex min-h-9 cursor-pointer items-center font-sans text-xs font-medium text-accent hover:underline lg:hidden"
                >
                  {t().worship.backToList}
                </button>

                <div class="flex flex-wrap items-center gap-2 font-sans">
                  <span class="rounded-full bg-side px-2.5 py-0.5 text-xs font-semibold text-accent">
                    Thánh ca #{song().number}
                  </span>
                  <span class="text-xs text-muted">{song().category}</span>
                </div>

                <h2 class="mt-2 font-serif text-2xl leading-snug font-semibold text-ink sm:text-[1.75rem]">
                  {song().title}
                </h2>

                <Show when={song().scriptureRef}>
                  {(ref) => (
                    <div class="mt-2 flex flex-wrap items-center gap-1.5 font-sans text-xs text-muted">
                      <span>{t().worship.scripturePrefix}</span>
                      <ScriptureChip citation={ref()} />
                    </div>
                  )}
                </Show>

                {/* Action bar */}
                <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-rule py-3">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => props.onPresent(song())}
                      class="inline-flex min-h-9 cursor-pointer items-center rounded-full bg-accent px-3.5 font-sans text-xs font-medium text-paper hover:opacity-90"
                    >
                      {t().worship.present}
                    </button>
                    <button
                      type="button"
                      onClick={() => props.onDownloadPptx(song())}
                      class="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 font-sans text-xs font-medium text-ink hover:border-accent hover:text-accent"
                    >
                      {t().worship.pptx}
                    </button>
                    <ProgramToggleButton
                      item={{ kind: "thanh-ca", number: song().number, code: song().code, title: song().title }}
                      program={props.program}
                      onToggle={props.onToggleProgram}
                    />
                    <CopyActionButton text={() => formatSongCopyText(song())} />
                    <button
                      type="button"
                      aria-pressed={ariaState(activeMedia() === "audio")}
                      onClick={() => toggleMedia("audio")}
                      class={[
                        "inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 font-sans text-xs font-medium transition-colors",
                        activeMedia() === "audio"
                          ? "border-accent bg-side text-accent"
                          : "border-rule bg-paper text-ink hover:border-accent hover:text-accent",
                      ]}
                    >
                      {t().worship.listen}
                    </button>
                    <button
                      type="button"
                      aria-pressed={ariaState(activeMedia() === "beat")}
                      onClick={() => toggleMedia("beat")}
                      class={[
                        "inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 font-sans text-xs font-medium transition-colors",
                        activeMedia() === "beat"
                          ? "border-accent bg-side text-accent"
                          : "border-rule bg-paper text-ink hover:border-accent hover:text-accent",
                      ]}
                    >
                      {t().worship.beat}
                    </button>
                    <Show when={song().karaokeId}>
                      <button
                        type="button"
                        aria-pressed={ariaState(activeMedia() === "karaoke")}
                        onClick={() => toggleMedia("karaoke")}
                        class={[
                          "inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 font-sans text-xs font-medium transition-colors",
                          activeMedia() === "karaoke"
                            ? "border-accent bg-side text-accent"
                            : "border-rule bg-paper text-ink hover:border-accent hover:text-accent",
                        ]}
                      >
                        {t().worship.karaoke}
                      </button>
                    </Show>
                    <a
                      href={song().sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex min-h-9 items-center rounded-full border border-rule bg-paper px-3.5 font-sans text-xs font-medium text-muted hover:border-accent hover:text-accent"
                    >
                      {t().worship.sheetMusic} ↗
                    </a>
                  </div>
                  <FontSizeButtons onStep={props.onStepFont} />
                </div>

                {/* Optional Audio / Beat / YouTube Karaoke player (lazy — loads only when toggled) */}
                <Show when={activeMedia() === "audio" || activeMedia() === "beat"}>
                  <div class="mt-4 rounded-2xl border border-rule bg-paper p-3">
                    <audio
                      controls
                      preload="none"
                      src={activeMedia() === "beat" ? thanhCaBeatUrl(song().number) : song().mp3Url}
                      class="w-full"
                    />
                  </div>
                </Show>
                <Show when={activeMedia() === "karaoke" && song().karaokeId}>
                  {(ytId) => (
                    <div class="mt-4 aspect-video overflow-hidden rounded-2xl border border-rule bg-paper">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId()}`}
                        title={`${song().title} — Karaoke`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        class="h-full w-full border-0"
                      />
                    </div>
                  )}
                </Show>

                {/* Lyrics stanzas */}
                <div class="mt-5 space-y-3.5">
                  <For each={song().stanzas}>
                    {(stanza) => (
                      <div
                        class={[
                          "rounded-2xl border p-4 sm:p-5",
                          /điệp khúc/i.test(stanza.label)
                            ? "border-accent/35 bg-side/55"
                            : "border-rule bg-paper/70",
                        ]}
                      >
                        <p class="font-sans text-xs font-semibold tracking-wide text-accent">{stanza.label}</p>
                        <p
                          class={[
                            "mt-2 whitespace-pre-line font-serif leading-[1.85] text-ink",
                            props.fontSizeClass,
                          ]}
                        >
                          {stanza.text}
                        </p>
                      </div>
                    )}
                  </For>
                </div>

                {/* Prev / Next */}
                <div class="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-4 font-sans text-xs">
                  <Show when={adjacent().prev} fallback={<span />}>
                    {(prev) => (
                      <button
                        type="button"
                        onClick={() => props.onSelect(prev().number)}
                        class="inline-flex min-h-10 max-w-full min-w-0 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 text-muted hover:border-accent hover:text-accent"
                      >
                        <span class="truncate">← #{prev().number} {prev().title}</span>
                      </button>
                    )}
                  </Show>
                  <Show when={adjacent().next}>
                    {(next) => (
                      <button
                        type="button"
                        onClick={() => props.onSelect(next().number)}
                        class="inline-flex min-h-10 max-w-full min-w-0 cursor-pointer items-center rounded-full bg-side px-3.5 font-medium text-accent hover:bg-accent hover:text-paper"
                      >
                        <span class="truncate">#{next().number} {next().title} →</span>
                      </button>
                    )}
                  </Show>
                </div>
              </article>
            )}
          </Show>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Biệt Thánh Ca — TVCHH (387)
// ---------------------------------------------------------------------------
function TvchhSection(props: {
  dataset: TvchhDataset;
  selectedNumber: number;
  search: string;
  normalizedQuery: string;
  listLimit: number;
  mobileView: "list" | "detail";
  fontSizeClass: string;
  onSearch: (q: string) => void;
  onSelect: (num: number) => void;
  onOpenThanhCa: (num: number) => void;
  onBackToList: () => void;
  onLoadMore: () => void;
  onStepFont: (delta: -1 | 1) => void;
  onPresent: (song: TvchhSong) => void;
  onDownloadPptx: (song: TvchhSong) => void;
  program: readonly ProgramItem[];
  onToggleProgram: (item: ProgramItem) => void;
}) {
  const { t } = useLocale();
  const [karaokeSong, setKaraokeSong] = createSignal<number | null>(null);
  const showKaraoke = () => karaokeSong() === props.selectedNumber;
  const toggleKaraoke = () => setKaraokeSong((n) => (n === props.selectedNumber ? null : props.selectedNumber));

  const filtered = createMemo(() => {
    const q = props.normalizedQuery;
    return props.dataset.songs.filter((s) => matchesHymn(s, q));
  });

  const currentSong = createMemo(
    () => props.dataset.songs.find((s) => s.number === props.selectedNumber) ?? props.dataset.songs[0],
  );

  const adjacent = createMemo(() => {
    const list = props.dataset.songs;
    const idx = list.findIndex((s) => s.number === currentSong()?.number);
    return {
      prev: idx > 0 ? list[idx - 1] : null,
      next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
    };
  });

  const visibleList = createMemo(() => filtered().slice(0, props.listLimit));

  return (
    <div class="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
      <aside
        aria-label={t().worship.songListHeading}
        class={[
          "min-w-0 rounded-3xl border border-rule bg-card p-3 lg:sticky lg:top-[4.5rem] lg:flex lg:max-h-[calc(100dvh-7.5rem)] lg:flex-col",
          props.mobileView === "detail" && "hidden lg:flex",
        ]}
      >
        <SearchInput
          value={props.search}
          placeholder={t().worship.searchHymnPlaceholder}
          onInput={props.onSearch}
        />
        <p class="mt-2 px-1 font-sans text-[11px] text-muted">
          {t().worship.showingCount(filtered().length, props.dataset.songs.length)}
        </p>
        <div class="mt-2 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
          <Show
            when={visibleList().length > 0}
            fallback={<p class="p-4 text-center font-sans text-xs text-muted">{t().worship.emptyList}</p>}
          >
            <For each={visibleList()}>
              {(song) => {
                const selected = () => currentSong()?.number === song.number;
                return (
                  <button
                    type="button"
                    onClick={() => props.onSelect(song.number)}
                    class={[
                      "w-full cursor-pointer rounded-2xl border px-3 py-2.5 text-left transition-colors",
                      selected()
                        ? "border-accent bg-side"
                        : "border-transparent bg-paper/60 hover:border-rule hover:bg-paper",
                    ]}
                  >
                    <div class="flex min-w-0 items-baseline gap-2">
                      <span class="shrink-0 font-sans text-xs font-semibold text-accent">#{song.number}</span>
                      <span class="min-w-0 truncate font-serif text-[15px] font-medium text-ink">{song.title}</span>
                    </div>
                    <p class="mt-0.5 truncate font-sans text-xs text-muted">{firstLyricLine(song.stanzas)}</p>
                  </button>
                );
              }}
            </For>
            <Show when={visibleList().length < filtered().length}>
              <button
                type="button"
                onClick={() => props.onLoadMore()}
                class="mt-2 min-h-10 w-full cursor-pointer rounded-full border border-rule bg-paper font-sans text-xs font-medium text-accent hover:border-accent"
              >
                +{filtered().length - visibleList().length}
              </button>
            </Show>
          </Show>
        </div>
      </aside>

      <section class={["min-w-0", props.mobileView === "list" ? "hidden lg:block" : "block"]}>
        <Show when={currentSong()}>
          {(song) => (
            <article class="min-w-0 rounded-3xl border border-rule bg-card p-4 sm:p-6">
              <button
                type="button"
                onClick={() => props.onBackToList()}
                class="mb-3 inline-flex min-h-9 cursor-pointer items-center font-sans text-xs font-medium text-accent hover:underline lg:hidden"
              >
                {t().worship.backToList}
              </button>

              <div class="flex flex-wrap items-center gap-2 font-sans">
                <span class="rounded-full bg-side px-2.5 py-0.5 text-xs font-semibold text-accent">
                  TVCHH #{song().number}
                </span>
                <Show when={song().tcRef}>
                  {(tcNum) => (
                    <button
                      type="button"
                      onClick={() => props.onOpenThanhCa(tcNum())}
                      class="cursor-pointer rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs text-accent hover:border-accent"
                    >
                      {t().worship.alsoInThanhCa(tcNum())} →
                    </button>
                  )}
                </Show>
              </div>

              <h2 class="mt-2 font-serif text-2xl leading-snug font-semibold text-ink sm:text-[1.75rem]">
                {song().title}
              </h2>

              <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-rule py-3">
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => props.onPresent(song())}
                    class="inline-flex min-h-9 cursor-pointer items-center rounded-full bg-accent px-3.5 font-sans text-xs font-medium text-paper hover:opacity-90"
                  >
                    {t().worship.present}
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onDownloadPptx(song())}
                    class="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 font-sans text-xs font-medium text-ink hover:border-accent hover:text-accent"
                  >
                    {t().worship.pptx}
                  </button>
                  <ProgramToggleButton
                    item={{ kind: "tvchh", number: song().number, code: song().code, title: song().title }}
                    program={props.program}
                    onToggle={props.onToggleProgram}
                  />
                  <CopyActionButton text={() => formatSongCopyText(song())} />
                  <Show when={song().karaokeId}>
                    <button
                      type="button"
                      aria-pressed={ariaState(showKaraoke())}
                      onClick={toggleKaraoke}
                      class={[
                        "inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 font-sans text-xs font-medium transition-colors",
                        showKaraoke()
                          ? "border-accent bg-side text-accent"
                          : "border-rule bg-paper text-ink hover:border-accent hover:text-accent",
                      ]}
                    >
                      {t().worship.karaoke}
                    </button>
                  </Show>
                </div>
                <FontSizeButtons onStep={props.onStepFont} />
              </div>

              <Show when={showKaraoke() && song().karaokeId}>
                {(ytId) => (
                  <div class="mt-4 aspect-video overflow-hidden rounded-2xl border border-rule bg-paper">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytId()}`}
                      title={`${song().title} — Karaoke`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      class="h-full w-full border-0"
                    />
                  </div>
                )}
              </Show>

              <div class="mt-5 space-y-3.5">
                <For each={song().stanzas}>
                  {(stanza) => (
                    <div
                      class={[
                        "rounded-2xl border p-4 sm:p-5",
                        /điệp khúc/i.test(stanza.label)
                          ? "border-accent/35 bg-side/55"
                          : "border-rule bg-paper/70",
                      ]}
                    >
                      <p class="font-sans text-xs font-semibold tracking-wide text-accent">{stanza.label}</p>
                      <p
                        class={[
                          "mt-2 whitespace-pre-line font-serif leading-[1.85] text-ink",
                          props.fontSizeClass,
                        ]}
                      >
                        {stanza.text}
                      </p>
                    </div>
                  )}
                </For>
              </div>

              <div class="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-4 font-sans text-xs">
                <Show when={adjacent().prev} fallback={<span />}>
                  {(prev) => (
                    <button
                      type="button"
                      onClick={() => props.onSelect(prev().number)}
                      class="inline-flex min-h-10 max-w-full min-w-0 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 text-muted hover:border-accent hover:text-accent"
                    >
                      <span class="truncate">← #{prev().number} {prev().title}</span>
                    </button>
                  )}
                </Show>
                <Show when={adjacent().next}>
                  {(next) => (
                    <button
                      type="button"
                      onClick={() => props.onSelect(next().number)}
                      class="inline-flex min-h-10 max-w-full min-w-0 cursor-pointer items-center rounded-full bg-side px-3.5 font-medium text-accent hover:bg-accent hover:text-paper"
                    >
                      <span class="truncate">#{next().number} {next().title} →</span>
                    </button>
                  )}
                </Show>
              </div>
            </article>
          )}
        </Show>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Kinh Thánh Đối Đáp (100)
// ---------------------------------------------------------------------------
function KtddSection(props: {
  dataset: KtddDataset;
  selectedNumber: number;
  category: string;
  search: string;
  normalizedQuery: string;
  mobileView: "list" | "detail";
  fontSizeClass: string;
  onSelectCategory: (cat: string) => void;
  onSearch: (q: string) => void;
  onSelect: (num: number) => void;
  onBackToList: () => void;
  onStepFont: (delta: -1 | 1) => void;
  onPresent: (reading: ResponsiveReading) => void;
  onDownloadPptx: (reading: ResponsiveReading) => void;
  program: readonly ProgramItem[];
  onToggleProgram: (item: ProgramItem) => void;
}) {
  const { t } = useLocale();

  const filtered = createMemo(() => {
    const cat = props.category;
    const q = props.normalizedQuery;
    return props.dataset.readings.filter((r) => (cat === "all" || r.category === cat) && matchesKtdd(r, q));
  });

  const currentReading = createMemo(
    () => props.dataset.readings.find((r) => r.number === props.selectedNumber) ?? props.dataset.readings[0],
  );

  const adjacent = createMemo(() => {
    const list = props.dataset.readings;
    const idx = list.findIndex((r) => r.number === currentReading()?.number);
    return {
      prev: idx > 0 ? list[idx - 1] : null,
      next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
    };
  });

  return (
    <div class="space-y-4">
      <div class="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 font-sans [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          aria-pressed={ariaState(props.category === "all")}
          onClick={() => props.onSelectCategory("all")}
          class={[
            "min-h-8 shrink-0 cursor-pointer rounded-full border px-3 text-xs transition-colors",
            props.category === "all"
              ? "border-accent bg-accent font-medium text-paper"
              : "border-rule bg-card text-muted hover:border-accent/60 hover:text-ink",
          ]}
        >
          {t().worship.allCategories(props.dataset.readings.length)}
        </button>
        <For each={props.dataset.categories}>
          {(cat) => {
            const active = () => props.category === cat;
            return (
              <button
                type="button"
                aria-pressed={ariaState(active())}
                onClick={() => props.onSelectCategory(active() ? "all" : cat)}
                class={[
                  "min-h-8 shrink-0 cursor-pointer rounded-full border px-3 text-xs transition-colors",
                  active()
                    ? "border-accent bg-side font-medium text-accent"
                    : "border-rule bg-card text-muted hover:border-accent/60 hover:text-ink",
                ]}
              >
                {cat}
              </button>
            );
          }}
        </For>
      </div>

      <div class="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        <aside
          aria-label={t().worship.songListHeading}
          class={[
            "min-w-0 rounded-3xl border border-rule bg-card p-3 lg:sticky lg:top-[4.5rem] lg:flex lg:max-h-[calc(100dvh-7.5rem)] lg:flex-col",
            props.mobileView === "detail" && "hidden lg:flex",
          ]}
        >
          <SearchInput
            value={props.search}
            placeholder={t().worship.searchKtddPlaceholder}
            onInput={props.onSearch}
          />
          <p class="mt-2 px-1 font-sans text-[11px] text-muted">
            {t().worship.showingCount(filtered().length, props.dataset.readings.length)}
          </p>
          <div class="mt-2 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
            <Show
              when={filtered().length > 0}
              fallback={<p class="p-4 text-center font-sans text-xs text-muted">{t().worship.emptyList}</p>}
            >
              <For each={filtered()}>
                {(item) => {
                  const selected = () => currentReading()?.number === item.number;
                  return (
                    <button
                      type="button"
                      onClick={() => props.onSelect(item.number)}
                      class={[
                        "w-full cursor-pointer rounded-2xl border px-3 py-2.5 text-left transition-colors",
                        selected()
                          ? "border-accent bg-side"
                          : "border-transparent bg-paper/60 hover:border-rule hover:bg-paper",
                      ]}
                    >
                      <div class="flex min-w-0 items-baseline gap-2">
                        <span class="shrink-0 font-sans text-xs font-semibold text-accent">#{item.code}</span>
                        <span class="min-w-0 truncate font-serif text-[15px] font-medium text-ink">{item.title}</span>
                      </div>
                      <p class="mt-0.5 truncate font-sans text-xs text-muted">{item.scriptureRefs.join(" · ")}</p>
                    </button>
                  );
                }}
              </For>
            </Show>
          </div>
        </aside>

        <section class={["min-w-0", props.mobileView === "list" ? "hidden lg:block" : "block"]}>
          <Show when={currentReading()}>
            {(reading) => (
              <article class="min-w-0 rounded-3xl border border-rule bg-card p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() => props.onBackToList()}
                  class="mb-3 inline-flex min-h-9 cursor-pointer items-center font-sans text-xs font-medium text-accent hover:underline lg:hidden"
                >
                  {t().worship.backToList}
                </button>

                <div class="flex flex-wrap items-center gap-2 font-sans">
                  <span class="rounded-full bg-side px-2.5 py-0.5 text-xs font-semibold text-accent">
                    KTĐĐ #{reading().code}
                  </span>
                  <span class="text-xs text-muted">{reading().category}</span>
                </div>

                <h2 class="mt-2 font-serif text-2xl leading-snug font-semibold text-ink sm:text-[1.75rem]">
                  {reading().title}
                </h2>

                <div class="mt-2.5 flex flex-wrap gap-1.5">
                  <For each={reading().scriptureRefs}>{(ref) => <ScriptureChip citation={ref} />}</For>
                </div>

                <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-rule py-3">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => props.onPresent(reading())}
                      class="inline-flex min-h-9 cursor-pointer items-center rounded-full bg-accent px-3.5 font-sans text-xs font-medium text-paper hover:opacity-90"
                    >
                      {t().worship.present}
                    </button>
                    <button
                      type="button"
                      onClick={() => props.onDownloadPptx(reading())}
                      class="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 font-sans text-xs font-medium text-ink hover:border-accent hover:text-accent"
                    >
                      {t().worship.pptx}
                    </button>
                    <ProgramToggleButton
                      item={{
                        kind: "doi-dap",
                        number: reading().number,
                        code: `KTĐĐ ${reading().code}`,
                        title: reading().title,
                      }}
                      program={props.program}
                      onToggle={props.onToggleProgram}
                    />
                    <CopyActionButton
                      text={() =>
                        formatKtddCopyText(reading(), {
                          leader: t().worship.leaderLabel,
                          congregation: t().worship.congregationLabel,
                        })
                      }
                    />
                  </div>
                  <FontSizeButtons onStep={props.onStepFont} />
                </div>

                <ol class="mt-5 space-y-3">
                  <For each={reading().turns}>
                    {(turn) => (
                      <li
                        class={[
                          "rounded-2xl border p-4",
                          turn.role === "congregation"
                            ? "border-accent/35 border-l-4 border-l-accent bg-side/60"
                            : "border-rule bg-paper/70",
                        ]}
                      >
                        <p class="font-sans text-[11px] font-semibold tracking-wide text-accent uppercase">
                          {turn.role === "leader" ? t().worship.leaderLabel : t().worship.congregationLabel}
                        </p>
                        <p
                          class={[
                            "mt-1.5 font-serif leading-[1.8] text-ink",
                            props.fontSizeClass,
                            turn.role === "congregation" && "font-semibold",
                          ]}
                        >
                          {turn.text}
                        </p>
                        <Show when={turn.ref}>
                          {(ref) => (
                            <p class="mt-2 text-right font-sans text-xs text-muted italic">{ref()}</p>
                          )}
                        </Show>
                      </li>
                    )}
                  </For>
                </ol>

                <div class="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-4 font-sans text-xs">
                  <Show when={adjacent().prev} fallback={<span />}>
                    {(prev) => (
                      <button
                        type="button"
                        onClick={() => props.onSelect(prev().number)}
                        class="inline-flex min-h-10 max-w-full min-w-0 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 text-muted hover:border-accent hover:text-accent"
                      >
                        <span class="truncate">← #{prev().code} {prev().title}</span>
                      </button>
                    )}
                  </Show>
                  <Show when={adjacent().next}>
                    {(next) => (
                      <button
                        type="button"
                        onClick={() => props.onSelect(next().number)}
                        class="inline-flex min-h-10 max-w-full min-w-0 cursor-pointer items-center rounded-full bg-side px-3.5 font-medium text-accent hover:bg-accent hover:text-paper"
                      >
                        <span class="truncate">#{next().code} {next().title} →</span>
                      </button>
                    )}
                  </Show>
                </div>
              </article>
            )}
          </Show>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Tín điều Các Sứ Đồ (12 tín khoản + Cầu nguyện chung & Chúc phước)
// ---------------------------------------------------------------------------
function TinDieuSection(props: {
  dataset: TinDieuDataset;
  fontSizeClass: string;
  onStepFont: (delta: -1 | 1) => void;
  onPresent: () => void;
  onDownloadPptx: () => void;
  program: readonly ProgramItem[];
  onToggleProgram: (item: ProgramItem) => void;
}) {
  const { t } = useLocale();

  return (
    <div class="space-y-6">
      <section class="rounded-3xl border border-rule bg-card p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-sans text-xs font-medium text-accent">{t().worship.creedFullHeading}</p>
            <h2 class="mt-1 font-serif text-2xl font-semibold text-ink sm:text-[1.75rem]">
              {props.dataset.creed.title}
            </h2>
            <p class="mt-1 font-sans text-xs text-muted">{props.dataset.creed.citation}</p>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => props.onPresent()}
              class="inline-flex min-h-9 cursor-pointer items-center rounded-full bg-accent px-3.5 font-sans text-xs font-medium text-paper hover:opacity-90"
            >
              {t().worship.present}
            </button>
            <button
              type="button"
              onClick={() => props.onDownloadPptx()}
              class="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 font-sans text-xs font-medium text-ink hover:border-accent hover:text-accent"
            >
              {t().worship.pptx}
            </button>
            <ProgramToggleButton
              item={{ kind: "tin-dieu", code: "Tín điều CSĐ", title: props.dataset.creed.title }}
              program={props.program}
              onToggle={props.onToggleProgram}
            />
            <CopyActionButton
              text={() => `${props.dataset.creed.title}\n\n${props.dataset.creed.verbatimText}`}
            />
            <FontSizeButtons onStep={props.onStepFont} />
          </div>
        </div>

        <blockquote
          class={[
            "mt-5 whitespace-pre-line rounded-2xl border border-accent/25 bg-side/50 p-5 font-serif leading-[1.85] text-ink",
            props.fontSizeClass,
          ]}
        >
          {props.dataset.creed.verbatimText}
        </blockquote>

        <p class="mt-3 font-sans text-xs leading-relaxed text-muted">{props.dataset.creed.liturgicalNote}</p>
      </section>

      <section aria-labelledby="tin-khoan">
        <h3 id="tin-khoan" class="font-display text-lg font-normal text-ink">
          {t().worship.creedClausesHeading(props.dataset.creed.clauses.length)}
        </h3>
        <ol class="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          <For each={props.dataset.creed.clauses}>
            {(clause) => (
              <li class="flex min-w-0 flex-col justify-between rounded-2xl border border-rule bg-card p-4">
                <div>
                  <div class="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 font-sans text-xs">
                    <span class="font-semibold text-accent">
                      #{clause.order} · {clause.trinitySection}
                    </span>
                    <span class="text-[11px] text-muted">{clause.hienChuongRef}</span>
                  </div>
                  <p class="mt-2 font-serif text-[17px] leading-relaxed font-medium text-ink">
                    “{clause.clause}”
                  </p>
                  <p class="mt-2 font-sans text-xs font-medium text-ink/90">{clause.doctrineTitle}</p>
                  <p class="mt-1 font-sans text-xs leading-relaxed text-muted">{clause.explanation}</p>
                </div>
                <div class="mt-3 flex flex-wrap gap-1.5 border-t border-rule pt-2.5">
                  <For each={clause.scriptureRefs}>{(ref) => <ScriptureChip citation={ref} />}</For>
                </div>
              </li>
            )}
          </For>
        </ol>
      </section>

      <section aria-labelledby="giao-nghi">
        <h3 id="giao-nghi" class="font-display text-lg font-normal text-ink">
          {t().worship.creedLiturgyHeading}
        </h3>
        <div class="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          <For each={[props.dataset.liturgy.lordsPrayer, props.dataset.liturgy.benediction]}>
            {(item) => (
              <article class="min-w-0 rounded-2xl border border-rule bg-card p-5">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="font-sans text-xs font-medium text-accent">{item.performer}</p>
                    <h4 class="mt-0.5 font-serif text-lg font-semibold text-ink">{item.title}</h4>
                    <p class="mt-0.5 font-sans text-[11px] text-muted">{item.citation}</p>
                  </div>
                  <CopyActionButton text={() => `${item.title}\n\n${item.verbatimText}`} />
                </div>
                <p
                  class={[
                    "mt-3 whitespace-pre-line font-serif leading-[1.8] text-ink",
                    props.fontSizeClass,
                  ]}
                >
                  {item.verbatimText}
                </p>
                <p class="mt-3 font-sans text-xs leading-relaxed text-muted">{item.note}</p>
              </article>
            )}
          </For>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Chương trình thờ phượng (Service Program Builder)
// ---------------------------------------------------------------------------
function ProgramSection(props: {
  items: readonly ProgramItem[];
  busy: boolean;
  onOpen: (item: ProgramItem) => void;
  onMove: (index: number, delta: -1 | 1) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onPresent: () => void;
  onDownloadPptx: () => void;
}) {
  const { t } = useLocale();

  return (
    <section class="rounded-3xl border border-rule bg-card p-5 sm:p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="font-serif text-2xl font-semibold text-ink sm:text-[1.75rem]">{t().worship.programHeading}</h2>
          <p class="mt-1 font-sans text-xs leading-relaxed text-muted">{t().worship.programIntro}</p>
        </div>
        <Show when={props.items.length > 0}>
          <div class="flex flex-wrap items-center gap-1.5 font-sans text-xs">
            <button
              type="button"
              disabled={props.busy}
              onClick={() => props.onPresent()}
              class="inline-flex min-h-9 cursor-pointer items-center rounded-full bg-accent px-3.5 font-medium text-paper hover:opacity-90 disabled:opacity-50"
            >
              {t().worship.programPresentAll}
            </button>
            <button
              type="button"
              disabled={props.busy}
              onClick={() => props.onDownloadPptx()}
              class="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-rule bg-paper px-3.5 font-medium text-ink hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {t().worship.programDownloadPptx}
            </button>
            <button
              type="button"
              onClick={() => props.onClear()}
              class="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-rule bg-paper px-3 text-muted hover:border-thap hover:text-thap"
            >
              {t().worship.programClear}
            </button>
          </div>
        </Show>
      </div>

      <Show
        when={props.items.length > 0}
        fallback={
          <p class="mt-6 rounded-2xl border border-dashed border-rule bg-paper/60 p-6 text-center font-sans text-sm leading-relaxed text-muted">
            {t().worship.programEmpty}
          </p>
        }
      >
        <ol class="mt-5 space-y-2.5">
          <For each={props.items}>
            {(item, i) => (
              <li class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-rule bg-paper/70 px-4 py-3">
                <div class="flex min-w-0 flex-1 items-baseline gap-2.5">
                  <span class="font-sans text-xs font-semibold text-muted">{i() + 1}.</span>
                  <span class="shrink-0 rounded-full bg-side px-2 py-0.5 font-sans text-[11px] font-semibold text-accent">
                    {item.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => props.onOpen(item)}
                    class="cursor-pointer truncate text-left font-serif text-base font-medium text-ink hover:text-accent"
                  >
                    {item.title}
                  </button>
                </div>
                <div class="flex items-center gap-1 font-sans text-xs">
                  <button
                    type="button"
                    disabled={i() === 0}
                    aria-label={t().worship.programMoveUp}
                    onClick={() => props.onMove(i(), -1)}
                    class="min-h-8 cursor-pointer rounded-full border border-rule bg-card px-2.5 text-muted hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={i() === props.items.length - 1}
                    aria-label={t().worship.programMoveDown}
                    onClick={() => props.onMove(i(), 1)}
                    class="min-h-8 cursor-pointer rounded-full border border-rule bg-card px-2.5 text-muted hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onRemove(programItemId(item))}
                    class="min-h-8 cursor-pointer rounded-full border border-rule bg-card px-2.5 text-muted hover:border-thap hover:text-thap"
                  >
                    {t().worship.programRemove}
                  </button>
                </div>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Fullscreen Presentation ("Chiếu") overlay
// ---------------------------------------------------------------------------
function SlidePresenter(props: { slides: WorshipSlide[]; onClose: () => void }) {
  const { t } = useLocale();
  const [index, setIndex] = createSignal(0);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(props.slides.length - 1, i + 1));

  onSettled(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
      else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const current = () => props.slides[index()] ?? props.slides[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t().worship.present}
      class="fixed inset-0 z-50 flex flex-col justify-between bg-paper p-5 text-ink sm:p-10"
    >
      <div class="flex items-center justify-between gap-3 font-sans text-xs text-muted">
        <span class="rounded-full bg-side px-3 py-1 font-medium text-accent">{current()?.badge}</span>
        <div class="flex items-center gap-3">
          <span>{t().worship.slideOf(index() + 1, props.slides.length)}</span>
          <button
            type="button"
            onClick={() => props.onClose()}
            class="min-h-9 cursor-pointer rounded-full border border-rule bg-card px-3.5 font-medium text-ink hover:border-accent"
          >
            {t().worship.slideClose}
          </button>
        </div>
      </div>

      <div class="mx-auto flex max-w-[52rem] flex-1 flex-col items-center justify-center py-6 text-center">
        <p
          class={[
            "whitespace-pre-line font-serif text-2xl leading-[1.6] text-ink sm:text-4xl sm:leading-[1.55]",
            current()?.emphasis && "font-semibold text-accent",
          ]}
        >
          {current()?.body}
        </p>
        <Show when={current()?.footer}>
          {(footer) => <p class="mt-6 font-sans text-sm text-muted">{footer()}</p>}
        </Show>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 font-sans text-xs">
        <button
          type="button"
          disabled={index() === 0}
          onClick={prev}
          class="min-h-11 cursor-pointer rounded-full border border-rule bg-card px-5 font-medium text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← {t().worship.slidePrev}
        </button>
        <span class="hidden text-muted sm:inline">{t().worship.slideHint}</span>
        <button
          type="button"
          disabled={index() >= props.slides.length - 1}
          onClick={next}
          class="min-h-11 cursor-pointer rounded-full bg-accent px-5 font-medium text-paper hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t().worship.slideNext} →
        </button>
      </div>
    </div>
  );
}

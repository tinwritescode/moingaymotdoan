import { createMemo, createSignal, For, onSettled, Show } from "solid-js";
import { matchesMood, normalizeSearch } from "../../lib/moods/search";
import type { MoodGroup, MoodIndex, MoodSummary } from "../../lib/moods/types";
import { moodHref } from "../router";
import { ariaState } from "./aria";
import { useHistory } from "./history-context";
import { useLocale } from "./locale-context";

/** 8 muted hues matching the 8 mood groups. */
const GROUP_HUES = [
  "#c9a227",
  "#6b7fa8",
  "#8a6fb0",
  "#c0714f",
  "#9b5a6a",
  "#5d8f7b",
  "#c47a9a",
  "#4d8a7f",
] as const;

/**
 * Quiet browser for 100 mood & life-situation guides:
 * instant accent-insensitive search (including book names), pastel quick shortcuts, 8 group cards, and random pick.
 */
export function MoodBrowser(props: { index: MoodIndex; onRandom?: (slug: string) => void }) {
  const { locale, t } = useLocale();
  const [selectedGroup, setSelectedGroup] = createSignal<string>("tat-ca");
  const [search, setSearch] = createSignal("");
  const { hydrated, progressFor } = useHistory();
  const isRead = (slug: string) => hydrated() && progressFor("mood", slug) !== undefined;
  const groupParamKey = () => (locale() === "en" ? "group" : "nhom");

  /** Only accept a group from the URL if it actually exists in the current index. */
  const knownGroup = (id: string | null) => (id && props.index.groups.some((g) => g.id === id) ? id : "tat-ca");

  /** Updates filters and syncs them into URL (?q=, ?nhom= / ?group=) so Back/sharing keeps the exact view. */
  const updateFilter = (next: { q?: string; group?: string }) => {
    const url = new URL(window.location.href);
    const key = groupParamKey();
    const q = next.q ?? url.searchParams.get("q") ?? "";
    const group = next.group ?? knownGroup(url.searchParams.get(key) ?? url.searchParams.get("nhom") ?? url.searchParams.get("group"));
    setSearch(q);
    setSelectedGroup(group);
    if (q.trim()) url.searchParams.set("q", q.trim());
    else url.searchParams.delete("q");
    url.searchParams.delete("nhom");
    url.searchParams.delete("group");
    if (group !== "tat-ca") url.searchParams.set(key, group);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  };
  const resetFilter = () => updateFilter({ q: "", group: "tat-ca" });

  // Read query params after hydration so static prerendered HTML never mismatches.
  onSettled(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("q") ?? "");
    setSelectedGroup(knownGroup(params.get(groupParamKey()) ?? params.get("nhom") ?? params.get("group")));
  });

  const queryText = createMemo(() => normalizeSearch(search()));

  const quickLinks = createMemo(() => {
    const slugs = new Set(props.index.moods.map((m) => m.slug));
    return t().moods.quickShortcuts.filter((q) => slugs.has(q.slug));
  });

  const countsByGroup = createMemo(() => {
    const map = new Map<string, number>();
    for (const m of props.index.moods) {
      map.set(m.groupId, (map.get(m.groupId) ?? 0) + 1);
    }
    return map;
  });

  const filteredMoods = createMemo(() => {
    const q = queryText();
    const g = selectedGroup();
    return props.index.moods.filter((m) => (g === "tat-ca" || m.groupId === g) && matchesMood(m, q));
  });

  const visibleSections = createMemo(() => {
    const byGroup = new Map<string, MoodSummary[]>();
    for (const m of filteredMoods()) {
      const list = byGroup.get(m.groupId) ?? [];
      list.push(m);
      byGroup.set(m.groupId, list);
    }
    return props.index.groups
      .map((group) => ({ group, moods: byGroup.get(group.id) ?? [] }))
      .filter((s) => s.moods.length > 0);
  });

  const pickRandom = () => {
    const shown = filteredMoods().length > 0 ? filteredMoods() : props.index.moods;
    const unread = shown.filter((m) => !isRead(m.slug));
    const pool = unread.length > 0 ? unread : shown;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    props.onRandom?.(pick.slug);
  };

  return (
    <main
      id="dau-trang"
      class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none"
    >
      <header>
        <p class="font-sans text-xs font-medium text-accent">{t().moods.kicker(props.index.moods.length)}</p>
        <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          {t().moods.heading}
        </h1>
        <p class="mt-2 text-base leading-relaxed text-muted">{t().moods.subtitle}</p>

        <div class="mt-5 flex flex-wrap items-center gap-2 font-sans">
          <label for="tim-cam-xuc" class="sr-only">
            {t().moods.searchLabel}
          </label>
          <div class="relative min-w-52 flex-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              class="pointer-events-none absolute top-1/2 left-4 h-[17px] w-[17px] -translate-y-1/2 text-muted"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.5-4.5" />
            </svg>
            <input
              id="tim-cam-xuc"
              type="search"
              placeholder={t().moods.searchPlaceholder}
              value={search()}
              onInput={(e) => updateFilter({ q: e.currentTarget.value })}
              class="min-h-12 w-full rounded-full border border-rule bg-card py-2 pr-10 pl-11 text-[15px] text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <Show when={search().length > 0}>
              <button
                type="button"
                aria-label={t().moods.clearSearchAria}
                onClick={() => updateFilter({ q: "" })}
                class="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-lg text-muted hover:bg-side hover:text-ink"
              >
                ×
              </button>
            </Show>
          </div>

          <Show when={search().trim().length > 0 || selectedGroup() !== "tat-ca"}>
            <button
              type="button"
              onClick={resetFilter}
              class="min-h-12 cursor-pointer rounded-full border border-rule bg-card px-4 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
            >
              {t().moods.clearFilter}
            </button>
          </Show>
        </div>

        <Show when={quickLinks().length > 0 && search().trim().length === 0 && selectedGroup() === "tat-ca"}>
          <div class="mt-3.5 flex flex-wrap gap-2 font-sans">
            <For each={quickLinks()}>
              {(item) => (
                <a
                  href={moodHref(item.slug, locale())}
                  style={{ background: `color-mix(in srgb, ${item.hue} 16%, var(--card))` }}
                  class="inline-flex min-h-9 items-center rounded-full border border-rule/70 px-3.5 text-[13.5px] text-ink transition-colors hover:border-accent"
                >
                  {item.label}
                </a>
              )}
            </For>
          </div>
        </Show>

        <div class="mt-7 flex flex-wrap items-center justify-between gap-2">
          <h2 class="font-display text-lg font-normal text-ink">{t().moods.groupsHeading}</h2>
          <div class="flex items-center gap-2 font-sans">
            <Show when={selectedGroup() !== "tat-ca"}>
              <button
                type="button"
                onClick={() => updateFilter({ group: "tat-ca" })}
                class="min-h-9 cursor-pointer rounded-full border border-rule bg-card px-3.5 text-xs text-muted hover:border-accent hover:text-ink"
              >
                {t().moods.allCount(props.index.moods.length)}
              </button>
            </Show>
            <Show when={props.onRandom}>
              <button
                type="button"
                onClick={pickRandom}
                class="min-h-9 cursor-pointer rounded-full bg-side px-3.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-paper"
              >
                {t().moods.randomMessage}
              </button>
            </Show>
          </div>
        </div>

        <div
          role="group"
          aria-label={t().moods.filterGroupAria}
          class="-mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1 font-sans [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          <For each={props.index.groups}>
            {(g, idx) => {
              const hue = () => GROUP_HUES[idx() % GROUP_HUES.length];
              const active = () => selectedGroup() === g.id;
              return (
                <button
                  type="button"
                  aria-pressed={ariaState(active())}
                  onClick={() => updateFilter({ group: active() ? "tat-ca" : g.id })}
                  style={{ background: `color-mix(in srgb, ${hue()} 11%, var(--card))` }}
                  class={[
                    "flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-left whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-h-[5.25rem] sm:flex-col sm:items-start sm:justify-between sm:rounded-2xl sm:p-3 sm:whitespace-normal",
                    active() ? "border-accent ring-1 ring-accent" : "border-rule hover:border-accent/60",
                  ]}
                >
                  <span class="text-[13px] leading-snug text-ink">{g.shortName}</span>
                  <strong class="text-sm leading-none font-light text-muted sm:text-xl">
                    {countsByGroup().get(g.id) ?? 0}
                  </strong>
                </button>
              );
            }}
          </For>
        </div>

        <Show when={search().trim().length > 0 || selectedGroup() !== "tat-ca"}>
          <p class="mt-3 font-sans text-xs text-muted" aria-live="polite">
            {t().moods.showingCountPrefix}{" "}
            <strong class="font-medium text-ink">{filteredMoods().length}</strong>{" "}
            {t().moods.showingCountSuffix(props.index.moods.length)}
          </p>
        </Show>
      </header>

      <Show
        when={visibleSections().length > 0}
        fallback={
          <div class="mt-8 rounded-3xl border border-rule bg-card p-8 text-center font-sans">
            <p class="text-base font-medium text-ink">{t().moods.emptyTitle(search())}</p>
            <p class="mt-2 text-sm text-muted">
              {t().moods.emptyHintPrefix} <em>{t().moods.emptyHintExamples[0]}</em>,{" "}
              <em>{t().moods.emptyHintExamples[1]}</em>, <em>{t().moods.emptyHintExamples[2]}</em>,{" "}
              <em>{t().moods.emptyHintExamples[3]}</em> {t().moods.emptyHintBookPrefix}{" "}
              <em>{t().moods.emptyHintBookExample}</em>.
            </p>
            <button
              type="button"
              onClick={resetFilter}
              class="mt-5 min-h-11 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-paper hover:opacity-90"
            >
              {t().moods.resetAllBtn(props.index.moods.length)}
            </button>
          </div>
        }
      >
        <For each={visibleSections()}>
          {(section, i) => (
            <GroupSection group={section.group} moods={section.moods} showBackToTop={i() > 0} isRead={isRead} />
          )}
        </For>
      </Show>

      <p class="mt-10 rounded-2xl border border-rule bg-card/70 px-4 py-3 font-sans text-xs leading-relaxed text-muted">
        {t().aiNotice}
      </p>
    </main>
  );
}

function GroupSection(props: {
  group: MoodGroup;
  moods: MoodSummary[];
  showBackToTop: boolean;
  isRead: (slug: string) => boolean;
}) {
  const { locale, t } = useLocale();
  return (
    <section id={props.group.id} aria-labelledby={`${props.group.id}-ten`} class="scroll-mt-20 pt-8">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <div class="flex flex-wrap items-baseline gap-2.5">
          <h2 id={`${props.group.id}-ten`} class="font-display text-lg font-normal text-ink">
            {props.group.name}
          </h2>
          <span class="font-sans text-xs text-muted">{t().moods.groupTopicsCount(props.moods.length)}</span>
        </div>
        <Show when={props.showBackToTop}>
          <a href="#dau-trang" class="font-sans text-xs text-muted hover:text-accent">
            {t().moods.backToTop}
          </a>
        </Show>
      </div>
      <p class="mt-1 font-sans text-xs text-muted">{props.group.description}</p>

      <ul class="mt-3 grid gap-2.5 sm:grid-cols-2">
        <For each={props.moods}>
          {(m) => (
            <li>
              <a
                href={moodHref(m.slug, locale())}
                class="group block h-full rounded-2xl border border-rule bg-card px-4 py-3.5 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div class="flex items-baseline justify-between gap-3">
                  <h3 class="font-serif text-[17px] leading-snug font-semibold text-ink group-hover:text-accent">
                    {m.title}
                  </h3>
                  <Show when={props.isRead(m.slug)}>
                    <span class="shrink-0 font-sans text-[11px] font-medium text-accent">{t().moods.readBadge}</span>
                  </Show>
                </div>
                <p class="mt-1 text-sm leading-relaxed text-muted">{m.prompt}</p>
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}

import { createMemo, createSignal, For, Show } from "solid-js";
import { matchesMood, normalizeSearch } from "../../lib/moods/search";
import type { MoodGroup, MoodIndex, MoodSummary } from "../../lib/moods/types";
import { AI_NOTICE } from "../../lib/notice";
import { moodHref } from "../router";
import { ariaState } from "./aria";

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";
const CHIP =
  "inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-rule bg-card px-3.5 font-sans text-sm transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper";

/** 8 cảm xúc thường tìm nhất để người đọc mở ngay bằng một chạm không cần cuộn. */
const QUICK_SLUGS: readonly { slug: string; label: string }[] = [
  { slug: "vui-mung", label: "Vui mừng" },
  { slug: "buon-ba", label: "Buồn bã" },
  { slug: "lo-au-tuong-lai", label: "Lo âu" },
  { slug: "co-don", label: "Cô đơn" },
  { slug: "met-moi-kiet-suc", label: "Mệt mỏi" },
  { slug: "tuc-gian", label: "Tức giận" },
  { slug: "kho-tha-thu-nguoi-khac", label: "Khó tha thứ" },
  { slug: "can-su-khon-ngoan", label: "Cần khôn ngoan" },
];

/**
 * Bộ duyệt 100 chuyên mục cảm xúc & chủ đề: tìm kiếm không dấu (kể cả tên sách),
 * lối tắt cảm xúc hay tìm, lọc theo 8 nhóm, và mở ngẫu nhiên.
 * Mặc định hiện trọn bộ tất cả chuyên mục để bản build tĩnh crawl đủ mọi trang con.
 */
export function MoodBrowser(props: { index: MoodIndex; onRandom?: (slug: string) => void }) {
  const [selectedGroup, setSelectedGroup] = createSignal<string>("tat-ca");
  const [search, setSearch] = createSignal("");

  const queryText = createMemo(() => normalizeSearch(search()));

  const quickLinks = createMemo(() => {
    const slugs = new Set(props.index.moods.map((m) => m.slug));
    return QUICK_SLUGS.filter((q) => slugs.has(q.slug));
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
    const pool = filteredMoods().length > 0 ? filteredMoods() : props.index.moods;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    props.onRandom?.(pick.slug);
  };

  return (
    <main id="dau-trang" class="mx-auto w-full max-w-6xl animate-reveal px-4 pb-20 sm:px-6 motion-reduce:animate-none">
      <header class="border-b border-rule pt-7 pb-6 sm:pt-10 sm:pb-8">
        <p class={`${KICKER} text-accent`}>Đọc Kinh Thánh theo cảm xúc · {props.index.moods.length} chủ đề</p>
        <h1 class="mt-2 font-display text-4xl leading-tight font-extrabold text-balance sm:text-5xl">
          Bạn đang cảm thấy thế nào?
        </h1>
        <p class="mt-2.5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Chọn tâm trạng hoặc gõ từ khóa để mở ngay lời Kinh Thánh Bản Truyền Thống và đi thẳng vào đoạn ghi chú tương
          ứng.
        </p>

        <div class="mt-5 flex flex-wrap items-center gap-2.5 font-sans">
          <label for="tim-cam-xuc" class="sr-only">
            Tìm cảm xúc, chủ đề hoặc tên sách Kinh Thánh
          </label>
          <div class="relative min-w-56 max-w-xl flex-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m13.5 13.5 3.5 3.5" stroke-linecap="round" />
            </svg>
            <input
              id="tim-cam-xuc"
              type="search"
              placeholder="Tìm: vui, buồn, lo âu, Thi-thiên…"
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="min-h-12 w-full rounded-xl border border-rule bg-card py-2 pr-10 pl-10 text-base text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <Show when={search().length > 0}>
              <button
                type="button"
                aria-label="Xóa từ khóa tìm kiếm"
                onClick={() => setSearch("")}
                class="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-lg text-muted hover:bg-side hover:text-ink"
              >
                ×
              </button>
            </Show>
          </div>

          <Show when={props.onRandom}>
            <button
              type="button"
              onClick={pickRandom}
              class="min-h-12 cursor-pointer rounded-xl bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Lời nhắn ngẫu nhiên
            </button>
          </Show>

          <Show when={search().trim().length > 0 || selectedGroup() !== "tat-ca"}>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedGroup("tat-ca");
              }}
              class="min-h-12 cursor-pointer rounded-xl border border-rule bg-card px-3.5 text-sm text-muted hover:border-accent hover:text-ink"
            >
              Xóa lọc
            </button>
          </Show>
        </div>

        <Show when={quickLinks().length > 0 && search().trim().length === 0 && selectedGroup() === "tat-ca"}>
          <div class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 font-sans text-sm">
            <span class="text-xs font-semibold tracking-wider text-muted uppercase">Hay tìm:</span>
            <For each={quickLinks()}>
              {(item) => (
                <a
                  href={moodHref(item.slug)}
                  class="rounded-lg bg-side px-2.5 py-1 text-ink transition-colors hover:bg-accent hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </a>
              )}
            </For>
          </div>
        </Show>

        <div
          role="group"
          aria-label="Lọc theo nhóm chủ đề"
          class="-mx-4 mt-5 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          <button
            type="button"
            aria-pressed={ariaState(selectedGroup() === "tat-ca")}
            onClick={() => setSelectedGroup("tat-ca")}
            class={CHIP}
          >
            <span>Tất cả</span>
            <span class="text-xs opacity-75">{props.index.moods.length}</span>
          </button>
          <For each={props.index.groups}>
            {(g) => (
              <button
                type="button"
                aria-pressed={ariaState(selectedGroup() === g.id)}
                onClick={() => setSelectedGroup(g.id)}
                class={CHIP}
              >
                <span class="sm:hidden">{g.shortName}</span>
                <span class="hidden sm:inline">{g.name}</span>
                <span class="text-xs opacity-75">{countsByGroup().get(g.id) ?? 0}</span>
              </button>
            )}
          </For>
        </div>

        <Show when={search().trim().length > 0 || selectedGroup() !== "tat-ca"}>
          <p class="mt-3 font-sans text-sm text-muted" aria-live="polite">
            Đang hiện <strong class="font-semibold text-ink">{filteredMoods().length}</strong> /{" "}
            {props.index.moods.length} chuyên mục.
          </p>
        </Show>
      </header>

      <Show
        when={visibleSections().length > 0}
        fallback={
          <div class="mt-10 rounded-xl border border-rule bg-card p-8 text-center font-sans">
            <p class="text-lg font-medium text-ink">
              Không tìm thấy chuyên mục nào khớp với &ldquo;{search()}&rdquo;.
            </p>
            <p class="mt-2 text-sm text-muted">
              Thử tìm bằng từ ngắn hơn như <em>vui</em>, <em>buồn</em>, <em>lo âu</em>, <em>cô đơn</em>,{" "}
              <em>công việc</em>, <em>gia đình</em> hoặc tên sách như <em>Thi-thiên</em>.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedGroup("tat-ca");
              }}
              class="mt-5 min-h-11 cursor-pointer rounded-lg bg-ink px-5 text-sm font-semibold text-paper hover:bg-accent"
            >
              Xem lại cả {props.index.moods.length} chuyên mục
            </button>
          </div>
        }
      >
        <For each={visibleSections()}>
          {(section, i) => <GroupSection group={section.group} moods={section.moods} showBackToTop={i() > 0} />}
        </For>
      </Show>

      <p class="mt-14 rounded-xl border border-rule bg-card px-4 py-3 font-sans text-sm leading-relaxed text-muted">
        {AI_NOTICE}
      </p>
    </main>
  );
}

function GroupSection(props: { group: MoodGroup; moods: MoodSummary[]; showBackToTop: boolean }) {
  return (
    <section id={props.group.id} aria-labelledby={`${props.group.id}-ten`} class="scroll-mt-6 pt-10">
      <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink pb-2">
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id={`${props.group.id}-ten`} class="font-display text-2xl font-semibold sm:text-3xl">
            {props.group.name}
          </h2>
          <span class="font-sans text-xs font-medium text-muted">{props.moods.length} chuyên mục</span>
        </div>
        <Show when={props.showBackToTop}>
          <a href="#dau-trang" class="font-sans text-xs text-muted hover:text-accent">
            ↑ Đầu trang
          </a>
        </Show>
      </div>
      <p class="mt-2 font-sans text-sm text-muted">{props.group.description}</p>

      <ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <For each={props.moods}>
          {(m) => (
            <li>
              <a
                href={moodHref(m.slug)}
                class="group flex h-full flex-col justify-between rounded-xl border border-rule bg-card p-4 transition-colors hover:border-accent hover:bg-side/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div>
                  <h3 class="font-serif text-lg leading-snug font-semibold group-hover:text-accent">{m.title}</h3>
                  <p class="mt-1.5 text-sm leading-relaxed text-muted">{m.prompt}</p>
                </div>
                <p class="mt-3 font-sans text-xs font-medium text-accent/90">{m.passageCount} đoạn Kinh Thánh →</p>
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}

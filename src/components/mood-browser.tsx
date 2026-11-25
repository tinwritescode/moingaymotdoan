import { createMemo, createSignal, For, onSettled, Show } from "solid-js";
import { matchesMood, normalizeSearch } from "../../lib/moods/search";
import type { MoodGroup, MoodIndex, MoodSummary } from "../../lib/moods/types";
import { AI_NOTICE } from "../../lib/notice";
import { moodHref } from "../router";
import { ariaState } from "./aria";
import { useUser } from "./user-context";

/** 8 sắc thái dịu mắt tương ứng 8 nhóm cảm xúc (pha mềm vào nền thẻ, không chói). */
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

/** 8 cảm xúc thường tìm nhất để người đọc mở ngay bằng một chạm không cần cuộn. */
const QUICK_SLUGS: readonly { slug: string; label: string; hue: string }[] = [
  { slug: "vui-mung", label: "Vui mừng", hue: "#c9a227" },
  { slug: "buon-ba", label: "Buồn bã", hue: "#6b7fa8" },
  { slug: "lo-au-tuong-lai", label: "Lo âu", hue: "#8a6fb0" },
  { slug: "co-don", label: "Cô đơn", hue: "#c0714f" },
  { slug: "met-moi-kiet-suc", label: "Mệt mỏi", hue: "#5d8f7b" },
  { slug: "tuc-gian", label: "Tức giận", hue: "#9b5a6a" },
  { slug: "kho-tha-thu-nguoi-khac", label: "Khó tha thứ", hue: "#c47a9a" },
  { slug: "can-su-khon-ngoan", label: "Cần khôn ngoan", hue: "#4d8a7f" },
];

/**
 * Bộ duyệt 100 chuyên mục cảm xúc theo phong cách Tĩnh Lặng:
 * tìm kiếm không dấu (kể cả tên sách), lối tắt màu dịu, 8 thẻ nhóm mềm mại và mở ngẫu nhiên.
 */
export function MoodBrowser(props: { index: MoodIndex; onRandom?: (slug: string) => void }) {
  const [selectedGroup, setSelectedGroup] = createSignal<string>("tat-ca");
  const [search, setSearch] = createSignal("");
  const { progressFor } = useUser();
  const isRead = (slug: string) => progressFor("mood", slug) !== undefined;

  /** Nhóm lấy từ URL chỉ được nhận khi có thật, nếu không thì hiện tất cả. */
  const knownGroup = (id: string | null) => (id && props.index.groups.some((g) => g.id === id) ? id : "tat-ca");

  /** Đổi bộ lọc và ghi vào URL (?q=, ?nhom=) để bấm quay lại hoặc gửi link vẫn giữ đúng kết quả. */
  const updateFilter = (next: { q?: string; group?: string }) => {
    // Lấy phần còn lại từ URL (ghi đồng bộ), không từ signal: signal chỉ cập nhật sau microtask.
    const url = new URL(window.location.href);
    const q = next.q ?? url.searchParams.get("q") ?? "";
    const group = next.group ?? knownGroup(url.searchParams.get("nhom"));
    setSearch(q);
    setSelectedGroup(group);
    if (q.trim()) url.searchParams.set("q", q.trim());
    else url.searchParams.delete("q");
    if (group !== "tat-ca") url.searchParams.set("nhom", group);
    else url.searchParams.delete("nhom");
    // replaceState giữ history.state của router (vị trí cuộn) và không tạo thêm mục lịch sử mỗi lần gõ.
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  };
  const resetFilter = () => updateFilter({ q: "", group: "tat-ca" });

  // Đọc URL sau khi hydrate: trang tĩnh được prerender không có query nên đọc sớm hơn sẽ lệch HTML.
  onSettled(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("q") ?? "");
    setSelectedGroup(knownGroup(params.get("nhom")));
  });

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
        <p class="font-sans text-xs font-medium text-accent">
          Đọc theo cảm xúc · {props.index.moods.length} chủ đề
        </p>
        <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          Bạn đang cảm thấy thế nào?
        </h1>
        <p class="mt-2 text-base leading-relaxed text-muted">
          Chọn tâm trạng hoặc gõ từ khóa. Lời Kinh Thánh Bản Truyền Thống sẽ ở ngay đây.
        </p>

        <div class="mt-5 flex flex-wrap items-center gap-2 font-sans">
          <label for="tim-cam-xuc" class="sr-only">
            Tìm cảm xúc, chủ đề hoặc tên sách Kinh Thánh
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
              placeholder="Tìm: vui, buồn, lo âu, Thi-thiên…"
              value={search()}
              onInput={(e) => updateFilter({ q: e.currentTarget.value })}
              class="min-h-12 w-full rounded-full border border-rule bg-card py-2 pr-10 pl-11 text-[15px] text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <Show when={search().length > 0}>
              <button
                type="button"
                aria-label="Xóa từ khóa tìm kiếm"
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
              Xóa lọc
            </button>
          </Show>
        </div>

        <Show when={quickLinks().length > 0 && search().trim().length === 0 && selectedGroup() === "tat-ca"}>
          <div class="mt-3.5 flex flex-wrap gap-2 font-sans">
            <For each={quickLinks()}>
              {(item) => (
                <a
                  href={moodHref(item.slug)}
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
          <h2 class="font-display text-lg font-normal text-ink">Nhóm chủ đề</h2>
          <div class="flex items-center gap-2 font-sans">
            <Show when={selectedGroup() !== "tat-ca"}>
              <button
                type="button"
                onClick={() => updateFilter({ group: "tat-ca" })}
                class="min-h-9 cursor-pointer rounded-full border border-rule bg-card px-3.5 text-xs text-muted hover:border-accent hover:text-ink"
              >
                Tất cả ({props.index.moods.length})
              </button>
            </Show>
            <Show when={props.onRandom}>
              <button
                type="button"
                onClick={pickRandom}
                class="min-h-9 cursor-pointer rounded-full bg-side px-3.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-paper"
              >
                Lời nhắn ngẫu nhiên
              </button>
            </Show>
          </div>
        </div>

        <div
          role="group"
          aria-label="Lọc theo nhóm chủ đề"
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
                  <strong class="text-sm leading-none font-light text-muted sm:text-xl">{countsByGroup().get(g.id) ?? 0}</strong>
                </button>
              );
            }}
          </For>
        </div>

        <Show when={search().trim().length > 0 || selectedGroup() !== "tat-ca"}>
          <p class="mt-3 font-sans text-xs text-muted" aria-live="polite">
            Đang hiện <strong class="font-medium text-ink">{filteredMoods().length}</strong> /{" "}
            {props.index.moods.length} chuyên mục.
          </p>
        </Show>
      </header>

      <Show
        when={visibleSections().length > 0}
        fallback={
          <div class="mt-8 rounded-3xl border border-rule bg-card p-8 text-center font-sans">
            <p class="text-base font-medium text-ink">
              Không tìm thấy chuyên mục nào khớp với &ldquo;{search()}&rdquo;.
            </p>
            <p class="mt-2 text-sm text-muted">
              Thử tìm bằng từ ngắn hơn như <em>vui</em>, <em>buồn</em>, <em>lo âu</em>, <em>cô đơn</em> hoặc tên sách
              như <em>Thi-thiên</em>.
            </p>
            <button
              type="button"
              onClick={resetFilter}
              class="mt-5 min-h-11 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-paper hover:opacity-90"
            >
              Xem lại cả {props.index.moods.length} chuyên mục
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
        {AI_NOTICE}
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
  return (
    <section id={props.group.id} aria-labelledby={`${props.group.id}-ten`} class="scroll-mt-20 pt-8">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <div class="flex flex-wrap items-baseline gap-2.5">
          <h2 id={`${props.group.id}-ten`} class="font-display text-lg font-normal text-ink">
            {props.group.name}
          </h2>
          <span class="font-sans text-xs text-muted">{props.moods.length} chuyên mục</span>
        </div>
        <Show when={props.showBackToTop}>
          <a href="#dau-trang" class="font-sans text-xs text-muted hover:text-accent">
            ↑ Đầu trang
          </a>
        </Show>
      </div>
      <p class="mt-1 font-sans text-xs text-muted">{props.group.description}</p>

      <ul class="mt-3 grid gap-2.5 sm:grid-cols-2">
        <For each={props.moods}>
          {(m) => (
            <li>
              <a
                href={moodHref(m.slug)}
                class="group block h-full rounded-2xl border border-rule bg-card px-4 py-3.5 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div class="flex items-baseline justify-between gap-3">
                  <h3 class="font-serif text-[17px] leading-snug font-semibold text-ink group-hover:text-accent">
                    {m.title}
                  </h3>
                  <Show when={props.isRead(m.slug)}>
                    <span class="shrink-0 font-sans text-[11px] font-medium text-accent">✓ Đã đọc</span>
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

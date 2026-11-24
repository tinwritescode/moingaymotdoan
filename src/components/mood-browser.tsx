import { createMemo, createSignal, For, Show } from "solid-js";
import { matchesMood, normalizeSearch } from "../../lib/moods/search";
import type { MoodGroup, MoodIndex, MoodSummary } from "../../lib/moods/types";
import { moodHref } from "../router";
import { ariaState } from "./aria";

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";
const CHIP =
  "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-rule bg-card px-3.5 font-sans text-sm hover:border-accent aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper";

/**
 * Bộ duyệt 100 chuyên mục cảm xúc & chủ đề: tìm kiếm không dấu, lọc theo 8 nhóm, và mở ngẫu nhiên.
 * Mặc định hiện trọn bộ tất cả chuyên mục để bản build tĩnh crawl đủ mọi trang con.
 */
export function MoodBrowser(props: { index: MoodIndex; onRandom?: (slug: string) => void }) {
  const [selectedGroup, setSelectedGroup] = createSignal<string>("tat-ca");
  const [search, setSearch] = createSignal("");

  const queryText = createMemo(() => normalizeSearch(search()));

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
    <main class="mx-auto w-full max-w-6xl animate-reveal px-6 pb-20 motion-reduce:animate-none">
      <header class="border-b border-rule pt-10 pb-10 sm:pt-14">
        <p class={`${KICKER} text-accent`}>Đọc Kinh Thánh theo cảm xúc &amp; chủ đề</p>
        <h1 class="mt-3 font-display text-4xl leading-tight font-extrabold text-balance sm:text-6xl">
          Bạn đang cảm thấy thế nào?
        </h1>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Tổng hợp {props.index.moods.length} tâm trạng và hoàn cảnh quen thuộc trong đời sống. Chọn điều ngài đang
          trải qua để mở lời Kinh Thánh Bản Truyền Thống, lời gợi ý suy ngẫm và đi thẳng vào đoạn ghi chú tương ứng.
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-3 font-sans">
          <label for="tim-cam-xuc" class="sr-only">
            Tìm cảm xúc hoặc chủ đề
          </label>
          <div class="relative min-w-64 max-w-xl flex-1">
            <input
              id="tim-cam-xuc"
              type="search"
              placeholder="Tìm cảm xúc hay chủ đề… vd: vui, buồn, lo âu, cô đơn, tha thứ, gia đình"
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="min-h-12 w-full rounded-xl border border-rule bg-card px-4 text-base text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none"
            />
          </div>
          <Show when={search().trim().length > 0 || selectedGroup() !== "tat-ca"}>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedGroup("tat-ca");
              }}
              class="min-h-12 cursor-pointer rounded-xl border border-rule bg-card px-4 text-sm text-muted hover:border-accent hover:text-ink"
            >
              Xóa lọc
            </button>
          </Show>
          <Show when={props.onRandom}>
            <button
              type="button"
              onClick={pickRandom}
              class="min-h-12 cursor-pointer rounded-xl bg-ink px-5 text-sm font-semibold text-paper hover:bg-accent"
            >
              Mở một lời nhắn ngẫu nhiên
            </button>
          </Show>
        </div>

        <div role="group" aria-label="Lọc theo nhóm chủ đề" class="mt-6 flex flex-wrap gap-2">
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
                <span>{g.name}</span>
                <span class="text-xs opacity-75">{countsByGroup().get(g.id) ?? 0}</span>
              </button>
            )}
          </For>
        </div>

        <p class="mt-4 font-sans text-sm text-muted" aria-live="polite">
          Đang hiện <strong class="font-semibold text-ink">{filteredMoods().length}</strong> /{" "}
          {props.index.moods.length} chuyên mục.
        </p>
      </header>

      <Show
        when={visibleSections().length > 0}
        fallback={
          <div class="mt-12 rounded-xl border border-rule bg-card p-8 text-center font-sans">
            <p class="text-lg font-medium text-ink">Không tìm thấy chuyên mục nào khớp với &ldquo;{search()}&rdquo;.</p>
            <p class="mt-2 text-sm text-muted">
              Thử tìm bằng từ ngắn hơn như <em>vui</em>, <em>buồn</em>, <em>lo âu</em>, <em>cô đơn</em>,{" "}
              <em>công việc</em> hoặc <em>gia đình</em>.
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
        <For each={visibleSections()}>{(section) => <GroupSection group={section.group} moods={section.moods} />}</For>
      </Show>
    </main>
  );
}

function GroupSection(props: { group: MoodGroup; moods: MoodSummary[] }) {
  return (
    <section id={props.group.id} aria-labelledby={`${props.group.id}-ten`} class="scroll-mt-6 pt-12">
      <div class="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-2">
        <h2 id={`${props.group.id}-ten`} class="font-display text-3xl font-semibold">
          {props.group.name}
        </h2>
        <span class="font-sans text-sm text-muted">{props.moods.length} chuyên mục</span>
      </div>
      <p class="mt-2 font-sans text-sm text-muted">{props.group.description}</p>

      <ul class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <For each={props.moods}>
          {(m) => (
            <li>
              <a
                href={moodHref(m.slug)}
                class="group flex h-full flex-col justify-between rounded-xl border border-rule bg-card p-4 transition-colors hover:border-accent"
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

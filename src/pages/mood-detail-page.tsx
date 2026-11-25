import { createMemo, For, isPending, Show } from "solid-js";
import type { Locale } from "../../lib/i18n";
import type { MoodNavLink } from "../../lib/moods/types";
import { ChapterKeys } from "../components/chapter-keys";
import { CopyVerseButton } from "../components/copy-verse-button";
import { FloatingDock } from "../components/floating-dock";
import { useLocale } from "../components/locale-context";
import { NotFound } from "../components/not-found";
import { MoodVisitRecorder } from "../components/reading-tracker";
import { Seo } from "../components/seo";
import { ShareButton } from "../components/share-button";
import { SiteHeader } from "../components/site-header";
import { VerseText } from "../components/verse-text";
import { getMood } from "../data";
import { chapterHref, moodHref, moodsHref } from "../router";

const linkHref = (link: MoodNavLink | null, locale: Locale) => (link ? moodHref(link.slug, locale) : null);

/** Shared mood guide detail page for Vietnamese (/cam-xuc/:slug) and English (/en/moods/:slug). */
export function MoodDetailPageView(props: { slug: string }) {
  const { locale, t } = useLocale();
  const view = createMemo(() => getMood(props.slug, locale()));

  return (
    <Show when={view()} fallback={<NotFound />}>
      {(mood) => (
        <div class={["flex flex-1 flex-col transition-opacity", { "opacity-60": isPending(view) }]}>
          <Seo
            title={t().seo.moodDetailTitle(mood().title)}
            description={`${mood().prompt} ${mood().intro}`}
            path={moodHref(mood().slug, locale())}
            type="article"
          />
          <SiteHeader section="cam-xuc" />

          <ChapterKeys prev={linkHref(mood().prev, locale())} next={linkHref(mood().next, locale())} />
          <MoodVisitRecorder slug={mood().slug} title={mood().title} groupName={mood().group.name} />

          <main class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
            <header>
              <div class="flex flex-wrap items-center justify-between gap-2 font-sans text-xs">
                <a
                  href={`${moodsHref(locale())}#${mood().group.id}`}
                  class="font-medium text-accent hover:underline"
                >
                  {mood().group.name}
                </a>
                <a href={moodsHref(locale())} class="text-muted hover:text-accent">
                  {t().moods.detail.backToAll}
                </a>
              </div>
              <h1 class="mt-2 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.2rem]">
                {mood().title}
              </h1>
              <div class="mt-1.5 flex items-start justify-between gap-3">
                <p class="font-sans text-sm text-muted">{mood().prompt}</p>
                <ShareButton title={mood().title} text={mood().prompt} />
              </div>
              <p class="mt-5 border-l-[3px] border-accent py-1 pl-4 text-base leading-[1.75] text-ink/90">
                {mood().intro}
              </p>
            </header>

            <section aria-labelledby="loi-kinh-thanh" class="mt-8">
              <h2 id="loi-kinh-thanh" class="font-sans text-xs font-medium text-accent">
                {t().moods.detail.scriptureHeading(mood().passages.length)}
              </h2>

              <ol class="mt-3 space-y-3">
                <For each={mood().passages}>
                  {(p, i) => (
                    <li class="rounded-3xl border border-rule bg-card p-5">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-baseline gap-2 font-sans">
                          <h3 class="text-sm font-medium text-accent">{p.ref.label}</h3>
                          <span class="text-xs text-muted">
                            {i() + 1}/{mood().passages.length}
                          </span>
                        </div>
                        <CopyVerseButton label={p.ref.label} verses={p.ref.verses} />
                      </div>

                      <blockquote class="mt-3 font-serif text-[1.125rem] leading-[1.8] text-ink">
                        <VerseText verses={p.ref.verses} />
                      </blockquote>

                      <p class="mt-3 font-sans text-[13px] leading-relaxed text-muted">{p.note}</p>

                      <div class="mt-4 border-t border-rule pt-3 font-sans text-xs">
                        <Show
                          when={p.hasChapter}
                          fallback={
                            <span class="text-muted">
                              {t().moods.detail.belongsToChapter(p.ref.book.name, p.ref.chapter)}
                            </span>
                          }
                        >
                          <a
                            href={chapterHref({ slug: p.ref.book.slug, number: p.ref.chapter, locale: locale() })}
                            class="inline-flex flex-wrap items-baseline gap-x-1 font-medium text-accent underline-offset-4 hover:underline"
                          >
                            <span>{t().moods.detail.readFullChapter(p.ref.book.name, p.ref.chapter)}</span>
                            <Show when={p.chapterTitle}>
                              {(title) => <span class="font-normal text-muted">— {title()}</span>}
                            </Show>
                            <span aria-hidden="true">→</span>
                          </a>
                        </Show>
                      </div>
                    </li>
                  )}
                </For>
              </ol>
            </section>

            <section aria-labelledby="loi-cau-nguyen" class="mt-8 rounded-3xl bg-side px-5 py-5">
              <h2 id="loi-cau-nguyen" class="font-sans text-xs font-medium text-accent">
                {t().moods.detail.prayerHeading}
              </h2>
              <p class="mt-2 font-serif text-[1.075rem] leading-[1.8] text-ink italic">{mood().prayer}</p>
            </section>

            <Show when={mood().related.length > 0}>
              <section aria-labelledby="lien-quan" class="mt-9">
                <h2 id="lien-quan" class="font-display text-lg font-normal text-ink">
                  {t().moods.detail.relatedHeading}
                </h2>
                <ul class="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <For each={mood().related}>
                    {(r) => (
                      <li>
                        <a
                          href={moodHref(r.slug, locale())}
                          class="group block h-full rounded-2xl border border-rule bg-card p-4 transition-colors hover:border-accent"
                        >
                          <p class="font-serif text-base font-semibold text-ink group-hover:text-accent">{r.title}</p>
                          <p class="mt-1 text-sm text-muted">{r.prompt}</p>
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </section>
            </Show>

            <nav
              aria-label={t().moods.detail.bottomNavLabel}
              class="mt-8 flex flex-wrap items-center justify-between gap-2.5 border-t border-rule pt-6 font-sans text-xs"
            >
              <Show when={mood().prev} fallback={<span />}>
                {(l) => (
                  <a
                    href={moodHref(l().slug, locale())}
                    class="inline-flex min-h-10 items-center rounded-full border border-rule bg-card px-4 text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    ← {l().title}
                  </a>
                )}
              </Show>
              <Show when={mood().next}>
                {(l) => (
                  <a
                    href={moodHref(l().slug, locale())}
                    class="inline-flex min-h-10 items-center rounded-full bg-side px-4 font-medium text-accent transition-colors hover:bg-accent hover:text-paper"
                  >
                    {l().title} →
                  </a>
                )}
              </Show>
            </nav>

            <p class="mt-6 font-sans text-xs leading-relaxed text-muted">{t().aiNotice}</p>
          </main>

          <FloatingDock active="cam-xuc" />
        </div>
      )}
    </Show>
  );
}

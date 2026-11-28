import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, Show } from "solid-js";
import { safeNextPath } from "../../lib/auth/types";
import { booksFor } from "../../lib/content/books";
import { useAuth } from "../components/auth-context";
import { FloatingDock } from "../components/floating-dock";
import { useHistory } from "../components/history-context";
import { useLocale } from "../components/locale-context";
import { useStreak } from "../components/streak-context";
import { WeeklyDots } from "../components/progress-ring";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { Bone, Skeleton } from "../components/skeleton";
import { formatAuthError } from "../lib/auth-messages";
import { tourHref } from "../lib/tour";
import { accountHref, chapterHref, historyHref } from "../router";

/** Shared AuthKit sign-in & cloud sync profile page for Vietnamese (/tai-khoan) and English (/en/account). */
export function AccountPageView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const {
    user,
    initialized,
    authLoading,
    authError,
    configured,
    redirectReturnTo,
    clearRedirectReturnTo,
    signIn,
    signUp,
    signOut,
  } = useAuth();
  const { stats } = useHistory();
  const streak = useStreak();
  const authErrorMessage = createMemo(() => formatAuthError(authError(), locale()));

  const nextUrl = createMemo(() => {
    const params = new URLSearchParams(location.search);
    return safeNextPath(params.get("next"), historyHref(locale()));
  });

  // After WorkOS AuthKit redirects back to /tai-khoan?code=... and merges history, navigate to target (VI or EN).
  createEffect(
    () => redirectReturnTo(),
    (target) => {
      if (!target) return;
      clearRedirectReturnTo();
      if (target !== "/tai-khoan" && target !== "/en/account") {
        navigate(target, { replace: true });
      }
    },
  );

  return (
    <>
      <Seo
        title={t().seo.accountTitle}
        description={t().seo.accountDescription}
        path={accountHref(locale())}
        noindex
      />
      <SiteHeader section="tai-khoan" />

      <main class="mx-auto w-full max-w-[34rem] animate-reveal px-5 pt-7 pb-12 motion-reduce:animate-none">
        <Show
          when={initialized()}
          fallback={
            <Skeleton
              label={t().account.loadingLabel}
              class="rounded-3xl border border-rule bg-card p-6 sm:p-8"
            >
              <div class="flex items-center gap-4">
                <Bone class="h-14 w-14 shrink-0" />
                <div class="flex-1 space-y-2">
                  <Bone class="h-3 w-28" />
                  <Bone class="h-6 w-1/2" />
                  <Bone class="h-3 w-2/5" />
                </div>
              </div>
              <div class="mt-6 space-y-2.5">
                <Bone class="h-12 w-full" />
                <Bone class="h-12 w-full" />
              </div>
            </Skeleton>
          }
        >
          <Show
            when={user()}
            fallback={
              <section aria-labelledby="auth-heading" class="rounded-3xl border border-rule bg-card p-6 sm:p-8">
                <p class="font-sans text-xs font-medium text-accent">{t().account.syncKicker}</p>
                <h1
                  id="auth-heading"
                  class="mt-1 font-display text-3xl font-light tracking-tight text-ink sm:text-[2.1rem]"
                >
                  {t().account.signInHeading}
                </h1>
                <p class="mt-2 font-sans text-sm leading-relaxed text-muted">{t().account.signInDesc}</p>

                <Show when={authErrorMessage()}>
                  {(msg) => (
                    <p
                      role="alert"
                      class="mt-5 rounded-2xl border border-thap/40 bg-thap/10 px-4 py-3 font-sans text-xs text-thap"
                    >
                      {msg()}
                    </p>
                  )}
                </Show>

                <Show
                  when={configured()}
                  fallback={
                    <p class="mt-6 rounded-2xl bg-side p-4 font-sans text-xs text-ink/85">
                      {t().account.notConfiguredBefore}
                      <a href={historyHref(locale())} class="font-medium text-accent underline">
                        {t().account.notConfiguredLink}
                      </a>
                      {t().account.notConfiguredAfter}
                    </p>
                  }
                >
                  <div class="mt-6 space-y-2.5 font-sans">
                    <button
                      type="button"
                      disabled={authLoading()}
                      onClick={() => void signIn(nextUrl())}
                      class="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authLoading() ? t().account.redirecting : t().account.signInBtn}
                    </button>

                    <button
                      type="button"
                      disabled={authLoading()}
                      onClick={() => void signUp(nextUrl())}
                      class="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-side px-5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t().account.signUpBtn}
                    </button>
                  </div>
                </Show>

                <p class="mt-6 border-t border-rule pt-4 font-sans text-xs leading-relaxed text-muted">
                  {t().account.securityFootnote}
                </p>
              </section>
            }
          >
            {(signedIn) => (
              <section aria-labelledby="profile-heading" class="rounded-3xl border border-rule bg-card p-6 sm:p-8">
                <div class="flex items-center gap-4">
                  <Show
                    when={signedIn().avatarUrl}
                    fallback={
                      <div
                        aria-hidden="true"
                        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-side font-display text-2xl font-medium text-accent"
                      >
                        {signedIn().name.slice(0, 1).toUpperCase()}
                      </div>
                    }
                  >
                    {(url) => (
                      <img
                        src={url()}
                        alt={signedIn().name}
                        class="h-14 w-14 shrink-0 rounded-full border border-rule object-cover"
                      />
                    )}
                  </Show>
                  <div class="min-w-0">
                    <p class="font-sans text-xs font-medium text-accent">{t().account.syncingBadge}</p>
                    <h1 id="profile-heading" class="truncate font-display text-2xl font-normal text-ink">
                      {signedIn().name}
                    </h1>
                    <p class="truncate font-sans text-xs text-muted">{signedIn().email}</p>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-3 gap-2 font-sans">
                  <div class="rounded-2xl border border-rule bg-paper/50 p-3.5">
                    <strong class="block text-2xl leading-none font-light text-ink">{stats().chaptersRead}</strong>
                    <span class="mt-1 block text-[11px] text-muted">{t().account.chaptersSeen(stats().chaptersRead)}</span>
                  </div>
                  <div class="rounded-2xl border border-rule bg-paper/50 p-3.5">
                    <strong class="block text-2xl leading-none font-light text-accent">
                      {stats().chaptersCompleted}
                    </strong>
                    <span class="mt-1 block text-[11px] text-muted">{t().account.chaptersCompleted}</span>
                  </div>
                  <div class="rounded-2xl border border-rule bg-paper/50 p-3.5">
                    <strong class="block text-2xl leading-none font-light text-ink">{streak.state().days}</strong>
                    <span class="mt-1 block text-[11px] text-muted">{t().account.dayStreak}</span>
                    <WeeklyDots />
                  </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-2.5 font-sans text-sm">
                  <a
                    href={historyHref(locale())}
                    class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
                  >
                    {t().account.openHistoryBtn}
                  </a>
                  <button
                    type="button"
                    disabled={authLoading()}
                    onClick={() => void signOut()}
                    class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-rule bg-paper/50 px-5 text-muted transition-colors hover:border-thap hover:text-thap disabled:opacity-60"
                  >
                    {t().account.signOutBtn}
                  </button>
                </div>
              </section>
            )}
          </Show>
        </Show>

        <a
          href={tourHref(chapterHref({ slug: booksFor(locale())[0].slug, number: 1, locale: locale() }))}
          class="mt-4 flex min-h-16 items-center gap-3.5 rounded-[20px] border border-rule bg-card px-[18px] font-sans text-ink transition-colors hover:border-accent"
        >
          <span
            aria-hidden="true"
            class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-side text-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" class="h-[18px] w-[18px]">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          <span class="flex flex-1 flex-col gap-0.5">
            <span class="text-[15px] font-medium">{t().tour.replay}</span>
            <span class="text-xs text-muted">{t().tour.replayHint}</span>
          </span>
          <span aria-hidden="true" class="text-muted">›</span>
        </a>
      </main>

      <FloatingDock active="tai-khoan" />
    </>
  );
}

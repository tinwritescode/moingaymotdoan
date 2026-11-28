import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { safeNextPath } from "../../lib/auth/types";
import { booksFor } from "../../lib/content/books";
import { useAuth } from "../components/auth-context";
import { FloatingDock } from "../components/floating-dock";
import { useHistory } from "../components/history-context";
import { useLocale } from "../components/locale-context";
import { NavRow } from "../components/nav-row";
import { useProfile } from "../components/profile-context";
import { Avatar, ProfileEditor } from "../components/profile-editor";
import { useStreak } from "../components/streak-context";
import { WeeklyDots } from "../components/progress-ring";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { Bone, Skeleton } from "../components/skeleton";
import { formatAuthError } from "../lib/auth-messages";
import { tourHref } from "../lib/tour";
import { accountHref, chapterHref, historyHref, settingsHref } from "../router";

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
  const me = useProfile();
  const [editingProfile, setEditingProfile] = createSignal(false);
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
                  <Avatar
                    profile={me.profile() ?? { name: signedIn().name, avatar: signedIn().avatarUrl }}
                    class="h-14 w-14 text-2xl"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="font-sans text-xs font-medium text-accent">{t().account.syncingBadge}</p>
                    <h1 id="profile-heading" class="truncate font-display text-2xl font-normal text-ink">
                      {me.profile()?.name ?? signedIn().name}
                    </h1>
                    <p class="truncate font-sans text-xs text-muted">{signedIn().email}</p>
                  </div>
                  <Show when={!editingProfile()}>
                    <button
                      type="button"
                      aria-label={t().profile.editLong}
                      onClick={() => setEditingProfile(true)}
                      class="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full px-3 font-sans text-sm font-medium text-accent hover:bg-side"
                    >
                      {t().profile.edit}
                    </button>
                  </Show>
                </div>
                <Show when={editingProfile()}>
                  <div class="mt-4 rounded-2xl border border-rule p-4">
                    <ProfileEditor onClose={() => setEditingProfile(false)} />
                  </div>
                </Show>

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

        <NavRow
          href={settingsHref(locale())}
          title={t().settings.kicker}
          description={t().settings.intro}
          class="mt-4"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-[18px] w-[18px]">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          }
        />

        <NavRow
          href={tourHref(chapterHref({ slug: booksFor(locale())[0].slug, number: 1, locale: locale() }))}
          title={t().tour.replay}
          description={t().tour.replayHint}
          class="mt-2.5"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" class="h-[18px] w-[18px]">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
              <path d="M12 17h.01" />
            </svg>
          }
        />
      </main>

      <FloatingDock active="tai-khoan" />
    </>
  );
}

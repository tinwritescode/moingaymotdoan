import { Title } from "@solidjs/meta";
import { useLocation, useNavigate, type RouteDefinition } from "@solidjs/router";
import { createEffect, createMemo, Show } from "solid-js";
import { safeNextPath } from "../../lib/history/types";
import { SiteHeader } from "../components/site-header";
import { useUser } from "../components/user-context";
import { getToc } from "../data";

export const route = {
  preload: () => {
    void getToc();
  },
} satisfies RouteDefinition;

/** Trang đăng nhập, tạo tài khoản (WorkOS AuthKit) và quản lý đồng bộ lịch sử đọc Kinh Thánh. */
export default function TaiKhoanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    ready,
    authLoading,
    authError,
    authConfigured,
    redirectReturnTo,
    clearRedirectReturnTo,
    stats,
    signIn,
    signUp,
    signOut,
  } = useUser();

  const nextUrl = createMemo(() => {
    const params = new URLSearchParams(location.search);
    return safeNextPath(params.get("next"), "/lich-su");
  });

  // Sau khi WorkOS AuthKit quay về /tai-khoan?code=... và đồng bộ lịch sử xong, tự chuyển đến trang đích.
  createEffect(
    () => redirectReturnTo(),
    (target) => {
      if (!target) return;
      clearRedirectReturnTo();
      if (target !== "/tai-khoan") {
        navigate(target, { replace: true });
      }
    },
  );

  return (
    <>
      <Title>Tài khoản — Kinh Thánh</Title>
      <SiteHeader section="tai-khoan" />

      <main class="mx-auto w-full max-w-lg animate-reveal px-4 pt-8 pb-20 sm:px-6 sm:pt-12 motion-reduce:animate-none">
        <Show
          when={ready()}
          fallback={
            <section class="rounded-2xl border border-rule bg-card p-6 font-sans text-sm text-muted sm:p-8">
              Đang kiểm tra phiên đăng nhập và đồng bộ lịch sử…
            </section>
          }
        >
          <Show
            when={user()}
            fallback={
              <section aria-labelledby="auth-heading" class="rounded-2xl border border-rule bg-card p-6 sm:p-8">
                <p class="font-sans text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                  Đồng bộ lịch sử đọc
                </p>
                <h1 id="auth-heading" class="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                  Đăng nhập tài khoản
                </h1>
                <p class="mt-2 font-sans text-sm leading-relaxed text-muted">
                  Lưu lại ngày tháng năm đã xem, đoạn đang đọc dở và các đoạn đã đọc xong để mở xem tiếp liền mạch trên
                  mọi thiết bị.
                </p>

                <Show when={authError()}>
                  {(msg) => (
                    <p
                      role="alert"
                      class="mt-5 rounded-xl border border-thap/40 bg-thap/10 px-3.5 py-2.5 font-sans text-sm text-thap"
                    >
                      {msg()}
                    </p>
                  )}
                </Show>

                <Show
                  when={authConfigured}
                  fallback={
                    <p class="mt-6 rounded-xl border border-rule bg-side/70 p-4 font-sans text-sm text-muted">
                      Chưa cấu hình WorkOS Client ID trên môi trường này. Bạn vẫn có thể đọc và lưu lịch sử tạm trên
                      trình duyệt tại{" "}
                      <a href="/lich-su" class="font-medium text-accent underline">
                        trang Lịch sử
                      </a>
                      .
                    </p>
                  }
                >
                  <div class="mt-6 space-y-3 font-sans">
                    <button
                      type="button"
                      disabled={authLoading()}
                      onClick={() => void signIn(nextUrl())}
                      class="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authLoading() ? "Đang chuyển sang trang đăng nhập…" : "Đăng nhập"}
                    </button>

                    <button
                      type="button"
                      disabled={authLoading()}
                      onClick={() => void signUp(nextUrl())}
                      class="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-rule bg-paper/60 px-5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Tạo tài khoản mới
                    </button>
                  </div>
                </Show>

                <p class="mt-6 border-t border-rule pt-4 font-sans text-xs leading-relaxed text-muted">
                  Xác thực an toàn qua WorkOS AuthKit. Lịch sử bạn đã đọc trước khi đăng nhập trên trình duyệt này sẽ tự
                  động được gộp vào tài khoản của bạn.
                </p>
              </section>
            }
          >
            {(signedIn) => (
              <section aria-labelledby="profile-heading" class="rounded-2xl border border-rule bg-card p-6 sm:p-8">
                <div class="flex items-center gap-4">
                  <Show
                    when={signedIn().avatarUrl}
                    fallback={
                      <div
                        aria-hidden="true"
                        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-2xl font-bold text-paper"
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
                    <p class="font-sans text-xs font-semibold tracking-[0.14em] text-cao uppercase">
                      ✓ Đang đồng bộ đám mây
                    </p>
                    <h1 id="profile-heading" class="truncate font-display text-3xl font-bold">
                      {signedIn().name}
                    </h1>
                    <p class="truncate font-sans text-sm text-muted">{signedIn().email}</p>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-3 gap-3 border-y border-rule py-5 text-center font-sans">
                  <div>
                    <p class="font-display text-2xl font-semibold text-ink">{stats().chaptersRead}</p>
                    <p class="mt-0.5 text-xs text-muted">Đoạn đã xem</p>
                  </div>
                  <div>
                    <p class="font-display text-2xl font-semibold text-cao">{stats().chaptersCompleted}</p>
                    <p class="mt-0.5 text-xs text-muted">Đã đọc xong</p>
                  </div>
                  <div>
                    <p class="font-display text-2xl font-semibold text-accent">{stats().streak}</p>
                    <p class="mt-0.5 text-xs text-muted">Chuỗi ngày</p>
                  </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-3 font-sans text-sm">
                  <a
                    href="/lich-su"
                    class="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-ink px-5 font-semibold text-paper transition-colors hover:bg-accent"
                  >
                    Mở lịch sử đọc →
                  </a>
                  <button
                    type="button"
                    disabled={authLoading()}
                    onClick={() => void signOut()}
                    class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-rule bg-paper/60 px-5 font-medium text-muted transition-colors hover:border-thap hover:text-thap disabled:opacity-60"
                  >
                    Đăng xuất
                  </button>
                </div>
              </section>
            )}
          </Show>
        </Show>
      </main>
    </>
  );
}

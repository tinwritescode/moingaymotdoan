import { useLocation, useNavigate, type RouteDefinition } from "@solidjs/router";
import { createEffect, createMemo, Show } from "solid-js";
import { safeNextPath } from "../../lib/history/types";
import { FloatingDock } from "../components/floating-dock";
import { WeeklyDots } from "../components/progress-ring";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { useUser } from "../components/user-context";
import { getToc } from "../data";

export const route = {
  preload: () => {
    void getToc();
  },
} satisfies RouteDefinition;

/** Trang đăng nhập, tạo tài khoản (WorkOS AuthKit) và hồ sơ đồng bộ phong cách Tĩnh Lặng. */
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
    logs,
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
      <Seo
        title="Tài khoản & Đồng bộ lịch sử | Mỗi Ngày Một Đoạn"
        description="Đăng nhập để đồng bộ lịch sử đọc Kinh Thánh và tiến độ từng sách trên điện thoại và máy tính."
        path="/tai-khoan"
        noindex
      />
      <SiteHeader section="tai-khoan" />

      <main class="mx-auto w-full max-w-[34rem] animate-reveal px-5 pt-7 pb-12 motion-reduce:animate-none">
        <Show
          when={ready()}
          fallback={
            <section class="rounded-3xl border border-rule bg-card p-6 font-sans text-sm text-muted">
              Đang kiểm tra phiên đăng nhập và đồng bộ lịch sử…
            </section>
          }
        >
          <Show
            when={user()}
            fallback={
              <section aria-labelledby="auth-heading" class="rounded-3xl border border-rule bg-card p-6 sm:p-8">
                <p class="font-sans text-xs font-medium text-accent">Đồng bộ lịch sử đọc</p>
                <h1
                  id="auth-heading"
                  class="mt-1 font-display text-3xl font-light tracking-tight text-ink sm:text-[2.1rem]"
                >
                  Đăng nhập tài khoản
                </h1>
                <p class="mt-2 font-sans text-sm leading-relaxed text-muted">
                  Lưu lại ngày tháng năm đã xem, đoạn đang đọc dở và chuỗi ngày đọc để mở xem tiếp liền mạch trên mọi
                  thiết bị.
                </p>

                <Show when={authError()}>
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
                  when={authConfigured}
                  fallback={
                    <p class="mt-6 rounded-2xl bg-side p-4 font-sans text-xs text-ink/85">
                      Chưa cấu hình WorkOS Client ID trên môi trường này. Bạn vẫn có thể xem lịch sử tạm tại{" "}
                      <a href="/lich-su" class="font-medium text-accent underline">
                        trang Lịch sử
                      </a>
                      .
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
                      {authLoading() ? "Đang chuyển sang trang đăng nhập…" : "Đăng nhập"}
                    </button>

                    <button
                      type="button"
                      disabled={authLoading()}
                      onClick={() => void signUp(nextUrl())}
                      class="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-side px-5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Tạo tài khoản mới
                    </button>
                  </div>
                </Show>

                <p class="mt-6 border-t border-rule pt-4 font-sans text-xs leading-relaxed text-muted">
                  Xác thực an toàn qua WorkOS AuthKit. Lịch sử bạn đã đọc trên trình duyệt này sẽ tự động gộp vào tài
                  khoản sau khi đăng nhập.
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
                    <p class="font-sans text-xs font-medium text-accent">✓ Đang đồng bộ đám mây</p>
                    <h1 id="profile-heading" class="truncate font-display text-2xl font-normal text-ink">
                      {signedIn().name}
                    </h1>
                    <p class="truncate font-sans text-xs text-muted">{signedIn().email}</p>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-3 gap-2 font-sans">
                  <div class="rounded-2xl border border-rule bg-paper/50 p-3.5">
                    <strong class="block text-2xl leading-none font-light text-ink">{stats().chaptersRead}</strong>
                    <span class="mt-1 block text-[11px] text-muted">đoạn đã xem</span>
                  </div>
                  <div class="rounded-2xl border border-rule bg-paper/50 p-3.5">
                    <strong class="block text-2xl leading-none font-light text-accent">
                      {stats().chaptersCompleted}
                    </strong>
                    <span class="mt-1 block text-[11px] text-muted">đã đọc xong</span>
                  </div>
                  <div class="rounded-2xl border border-rule bg-paper/50 p-3.5">
                    <strong class="block text-2xl leading-none font-light text-ink">{stats().streak}</strong>
                    <span class="mt-1 block text-[11px] text-muted">ngày liên tiếp</span>
                    <WeeklyDots logs={logs()} />
                  </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-2.5 font-sans text-sm">
                  <a
                    href="/lich-su"
                    class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
                  >
                    Mở lịch sử đọc →
                  </a>
                  <button
                    type="button"
                    disabled={authLoading()}
                    onClick={() => void signOut()}
                    class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-rule bg-paper/50 px-5 text-muted transition-colors hover:border-thap hover:text-thap disabled:opacity-60"
                  >
                    Đăng xuất
                  </button>
                </div>
              </section>
            )}
          </Show>
        </Show>
      </main>

      <FloatingDock active="tai-khoan" />
    </>
  );
}

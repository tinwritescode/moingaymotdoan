import { Title } from "@solidjs/meta";
import { useLocation, useNavigate, type RouteDefinition } from "@solidjs/router";
import { createMemo, createSignal, Show } from "solid-js";
import { safeNextPath } from "../../lib/history/types";
import { ariaState } from "../components/aria";
import { SiteHeader } from "../components/site-header";
import { useUser } from "../components/user-context";
import { getToc } from "../data";

export const route = {
  preload: () => {
    void getToc();
  },
} satisfies RouteDefinition;

type AuthMode = "sign-in" | "sign-up";

const INPUT =
  "mt-1.5 min-h-12 w-full rounded-xl border border-rule bg-paper/60 px-3.5 text-base text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";

/** Trang đăng nhập, đăng ký và quản lý tài khoản đồng bộ lịch sử đọc Kinh Thánh. */
export default function TaiKhoanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, ready, authLoading, authConfigured, stats, signIn, signUp, signOut } = useUser();

  const [mode, setMode] = createSignal<AuthMode>("sign-in");
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);

  const nextUrl = createMemo(() => {
    const params = new URLSearchParams(location.search);
    return safeNextPath(params.get("next"), "/lich-su");
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email().trim();
    const rawPassword = password();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    if (rawPassword.length < 8) {
      setError("Mật khẩu cần có ít nhất 8 ký tự.");
      return;
    }

    setSubmitting(true);
    try {
      const result =
        mode() === "sign-in"
          ? await signIn({ email: trimmedEmail, password: rawPassword })
          : await signUp({ name: name(), email: trimmedEmail, password: rawPassword });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPassword("");
      navigate(nextUrl());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Title>Tài khoản — Kinh Thánh</Title>
      <SiteHeader section="tai-khoan" />

      <main class="mx-auto w-full max-w-lg animate-reveal px-4 pt-8 pb-20 sm:px-6 sm:pt-12 motion-reduce:animate-none">
        <Show
          when={ready()}
          fallback={<p class="font-sans text-sm text-muted">Đang kiểm tra phiên đăng nhập…</p>}
        >
          <Show
            when={user()}
            fallback={
              <section aria-labelledby="auth-heading" class="rounded-2xl border border-rule bg-card p-6 sm:p-8">
                <p class="font-sans text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                  Đồng bộ lịch sử đọc
                </p>
                <h1 id="auth-heading" class="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                  {mode() === "sign-in" ? "Đăng nhập" : "Tạo tài khoản"}
                </h1>
                <p class="mt-2 font-sans text-sm leading-relaxed text-muted">
                  Lưu lại ngày tháng năm đã xem, đoạn đang đọc dở và các đoạn đã đọc xong để xem tiếp trên mọi thiết bị.
                </p>

                <Show
                  when={authConfigured}
                  fallback={
                    <p class="mt-6 rounded-xl border border-rule bg-side/70 p-4 font-sans text-sm text-muted">
                      Máy chủ đăng nhập chưa được cấu hình trên môi trường này. Bạn vẫn có thể đọc và lưu lịch sử tạm
                      trên trình duyệt tại{" "}
                      <a href="/lich-su" class="font-medium text-accent underline">
                        trang Lịch sử
                      </a>
                      .
                    </p>
                  }
                >
                  <div role="tablist" aria-label="Chọn đăng nhập hoặc đăng ký" class="mt-6 grid grid-cols-2 gap-2 font-sans">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={ariaState(mode() === "sign-in")}
                      onClick={() => {
                        setMode("sign-in");
                        setError(null);
                      }}
                      class={[
                        "min-h-11 cursor-pointer rounded-xl border text-sm font-semibold transition-colors",
                        mode() === "sign-in"
                          ? "border-ink bg-ink text-paper"
                          : "border-rule bg-paper/50 text-muted hover:border-accent hover:text-ink",
                      ]}
                    >
                      Đăng nhập
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={ariaState(mode() === "sign-up")}
                      onClick={() => {
                        setMode("sign-up");
                        setError(null);
                      }}
                      class={[
                        "min-h-11 cursor-pointer rounded-xl border text-sm font-semibold transition-colors",
                        mode() === "sign-up"
                          ? "border-ink bg-ink text-paper"
                          : "border-rule bg-paper/50 text-muted hover:border-accent hover:text-ink",
                      ]}
                    >
                      Tạo tài khoản
                    </button>
                  </div>

                  <form onSubmit={(e) => void handleSubmit(e)} class="mt-6 font-sans" novalidate>
                    <fieldset disabled={submitting() || authLoading()} class="space-y-4">
                      <Show when={mode() === "sign-up"}>
                        <div>
                          <label for="auth-name" class="block text-sm font-medium text-ink">
                            Tên hiển thị
                          </label>
                          <input
                            id="auth-name"
                            type="text"
                            autocomplete="name"
                            placeholder="Ví dụ: Minh Anh"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                            class={INPUT}
                          />
                        </div>
                      </Show>

                      <div>
                        <label for="auth-email" class="block text-sm font-medium text-ink">
                          Email
                        </label>
                        <input
                          id="auth-email"
                          type="email"
                          autocomplete="email"
                          required
                          placeholder="ban@example.com"
                          value={email()}
                          onInput={(e) => setEmail(e.currentTarget.value)}
                          class={INPUT}
                        />
                      </div>

                      <div>
                        <label for="auth-password" class="block text-sm font-medium text-ink">
                          Mật khẩu
                        </label>
                        <input
                          id="auth-password"
                          type="password"
                          autocomplete={mode() === "sign-in" ? "current-password" : "new-password"}
                          required
                          placeholder="Ít nhất 8 ký tự"
                          value={password()}
                          onInput={(e) => setPassword(e.currentTarget.value)}
                          class={INPUT}
                        />
                      </div>

                      <Show when={error()}>
                        {(msg) => (
                          <p
                            role="alert"
                            class="rounded-xl border border-thap/40 bg-thap/10 px-3.5 py-2.5 text-sm text-thap"
                          >
                            {msg()}
                          </p>
                        )}
                      </Show>

                      <button
                        type="submit"
                        class="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting()
                          ? "Đang xử lý…"
                          : mode() === "sign-in"
                            ? "Đăng nhập"
                            : "Tạo tài khoản & đồng bộ lịch sử"}
                      </button>
                    </fieldset>
                  </form>
                </Show>

                <p class="mt-6 border-t border-rule pt-4 font-sans text-xs text-muted">
                  Lịch sử bạn đã đọc trước khi đăng nhập trên trình duyệt này sẽ được tự động gộp vào tài khoản của bạn.
                </p>
              </section>
            }
          >
            {(signedIn) => (
              <section aria-labelledby="profile-heading" class="rounded-2xl border border-rule bg-card p-6 sm:p-8">
                <div class="flex items-center gap-4">
                  <div
                    aria-hidden="true"
                    class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-2xl font-bold text-paper"
                  >
                    {signedIn().name.slice(0, 1).toUpperCase()}
                  </div>
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

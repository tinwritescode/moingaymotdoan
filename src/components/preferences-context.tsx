import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onSettled,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import {
  applyFontToDom,
  applyThemeToDom,
  DEFAULT_FONT,
  DEFAULT_SCALE,
  DEFAULT_THEME,
  FONT_STORAGE_KEY,
  parseReadingFont,
  parseReadingScale,
  parseThemeMode,
  resolveTheme,
  SCALE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type ReadingFontId,
  type ReadingScale,
  type ResolvedTheme,
  type ThemeMode,
} from "../lib/preferences";

export type PreferencesContextValue = {
  ready: Accessor<boolean>;
  theme: Accessor<ThemeMode>;
  resolvedTheme: Accessor<ResolvedTheme>;
  font: Accessor<ReadingFontId>;
  scale: Accessor<ReadingScale>;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setFont: (id: ReadingFontId) => void;
  setScale: (scale: ReadingScale) => void;
};

const FALLBACK_PREFERENCES: PreferencesContextValue = {
  ready: () => false,
  theme: () => DEFAULT_THEME,
  resolvedTheme: () => "light",
  font: () => DEFAULT_FONT,
  scale: () => DEFAULT_SCALE,
  setTheme: () => {},
  toggleTheme: () => {},
  setFont: () => {},
  setScale: () => {},
};

const PreferencesContext = createContext<PreferencesContextValue>(FALLBACK_PREFERENCES);

export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string | null): void {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // ignore private mode / quota errors
  }
}

/**
 * Quản lý tùy chọn giao diện (sáng/tối/hệ thống), phông chữ đọc và cỡ chữ trên toàn trang.
 * Trong lúc SSR giữ giá trị mặc định để khớp HTML prerender; sau hydration mới đọc localStorage
 * và lắng nghe thay đổi giao diện hệ thống cũng như đồng bộ giữa các tab.
 */
export function PreferencesProvider(props: ParentProps) {
  const [ready, setReady] = createSignal(false);
  const [theme, setThemeSignal] = createSignal<ThemeMode>(DEFAULT_THEME);
  const [systemDark, setSystemDark] = createSignal(false);
  const [font, setFontSignal] = createSignal<ReadingFontId>(DEFAULT_FONT);
  const [scale, setScaleSignal] = createSignal<ReadingScale>(DEFAULT_SCALE);

  const resolvedTheme = createMemo<ResolvedTheme>(() => resolveTheme(theme(), systemDark()));

  onSettled(() => {
    const mq = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    setSystemDark(mq?.matches ?? false);
    setThemeSignal(parseThemeMode(readStorage(THEME_STORAGE_KEY)));
    setFontSignal(parseReadingFont(readStorage(FONT_STORAGE_KEY)));
    setScaleSignal(parseReadingScale(readStorage(SCALE_STORAGE_KEY)));
    setReady(true);

    const onMediaChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq?.addEventListener("change", onMediaChange);

    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) setThemeSignal(parseThemeMode(e.newValue));
      else if (e.key === FONT_STORAGE_KEY) setFontSignal(parseReadingFont(e.newValue));
      else if (e.key === SCALE_STORAGE_KEY) setScaleSignal(parseReadingScale(e.newValue));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mq?.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
    };
  });

  const appliedThemeKey = createMemo(() => (ready() ? `${theme()}:${resolvedTheme()}` : null));
  createEffect(
    () => appliedThemeKey(),
    (key) => {
      if (!key) return;
      const [mode, resolved] = key.split(":") as [ThemeMode, ResolvedTheme];
      applyThemeToDom(mode, resolved);
    },
  );

  const appliedFont = createMemo(() => (ready() ? font() : null));
  createEffect(
    () => appliedFont(),
    (id) => {
      if (id) applyFontToDom(id);
    },
  );

  const setTheme = (mode: ThemeMode) => {
    setThemeSignal(mode);
    writeStorage(THEME_STORAGE_KEY, mode === DEFAULT_THEME ? null : mode);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme() === "dark" ? "light" : "dark");
  };

  const setFont = (id: ReadingFontId) => {
    setFontSignal(id);
    writeStorage(FONT_STORAGE_KEY, id === DEFAULT_FONT ? null : id);
  };

  const setScale = (next: ReadingScale) => {
    setScaleSignal(next);
    writeStorage(SCALE_STORAGE_KEY, next);
  };

  const value: PreferencesContextValue = {
    ready,
    theme,
    resolvedTheme,
    font,
    scale,
    setTheme,
    toggleTheme,
    setFont,
    setScale,
  };

  return <PreferencesContext value={value}>{props.children}</PreferencesContext>;
}

export function usePreferences(): PreferencesContextValue {
  return useContext(PreferencesContext);
}

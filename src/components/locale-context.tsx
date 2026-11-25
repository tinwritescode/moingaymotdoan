import { useLocation } from "@solidjs/router";
import {
  createContext,
  createEffect,
  createMemo,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import {
  DEFAULT_LOCALE,
  localeFromPath,
  messagesFor,
  type Locale,
  type Messages,
} from "../../lib/i18n";

export type LocaleContextValue = {
  locale: Accessor<Locale>;
  pathname: Accessor<string>;
  t: Accessor<Messages>;
};

const DEFAULT_MESSAGES = messagesFor(DEFAULT_LOCALE);

const FALLBACK_LOCALE: LocaleContextValue = {
  locale: () => DEFAULT_LOCALE,
  pathname: () => "/",
  t: () => DEFAULT_MESSAGES,
};

const LocaleContext = createContext<LocaleContextValue>(FALLBACK_LOCALE);

/** Explicit locale provider (useful in unit tests or standalone subtrees). */
export function LocaleProvider(props: ParentProps<{ locale?: Locale; pathname?: string }>) {
  const locale = createMemo<Locale>(() => props.locale ?? DEFAULT_LOCALE);
  const pathname = createMemo<string>(() => props.pathname ?? (locale() === "en" ? "/en" : "/"));
  const t = createMemo<Messages>(() => messagesFor(locale()));

  return <LocaleContext value={{ locale, pathname, t }}>{props.children}</LocaleContext>;
}

/** Router-aware locale provider placed inside <Router>: derives locale reactively from URL path. */
export function RouterLocaleProvider(props: ParentProps) {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);
  const locale = createMemo<Locale>(() => localeFromPath(pathname()));
  const t = createMemo<Messages>(() => messagesFor(locale()));

  createEffect(
    () => locale(),
    (loc) => {
      if (typeof document !== "undefined") {
        document.documentElement.lang = loc;
      }
    },
  );

  return <LocaleContext value={{ locale, pathname, t }}>{props.children}</LocaleContext>;
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

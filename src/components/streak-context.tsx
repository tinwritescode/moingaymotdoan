import { useMutation, useQuery } from "@tanstack/solid-query";
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
import type { StreakMarksRemote } from "../../lib/history/ports";
import { localDateKey } from "../../lib/history/types";
import { DEFAULT_REMIND_HOUR, EMPTY_MARKS, isDateKey, isRemindHour, mergeMarks, type StreakMarks } from "../../lib/streak/marks";
import {
  computeStreak,
  readDaysFromLogs,
  weekStrip,
  type DayMark,
  type StreakInput,
  type StreakState,
} from "../../lib/streak/streak";
import { createHttpStreakMarksRemote, getHistoryApiUrl } from "../lib/browser-history-adapters";
import { useAuth } from "./auth-context";
import { useHistory } from "./history-context";
import { readStorage, writeStorage } from "./preferences-context";

export const STREAK_STORAGE_KEY = "kt:streak:v1";
/** The device copy, field by field: one bad field does not cost the others. */
export function parseStreakMarks(raw: string | null): StreakMarks {
  try {
    const v: unknown = raw ? JSON.parse(raw) : null;
    if (typeof v !== "object" || v === null) return EMPTY_MARKS;
    const restDays = "restDays" in v && Array.isArray(v.restDays) ? v.restDays.filter(isDateKey) : [];
    const restartedOn = "restartedOn" in v && isDateKey(v.restartedOn) ? v.restartedOn : null;
    const remindHour = "remindHour" in v && isRemindHour(v.remindHour) ? v.remindHour : DEFAULT_REMIND_HOUR;
    return {
      restDays,
      restartedOn,
      remindHour,
    };
  } catch {
    return EMPTY_MARKS;
  }
}

export type StreakContextValue = {
  ready: Accessor<boolean>;
  state: Accessor<StreakState>;
  week: Accessor<{ date: string; mark: DayMark }[]>;
  /** Today not read, a streak to lose, and past the reminder hour. */
  atRisk: Accessor<boolean>;
  now: Accessor<Date>;
  remindHour: Accessor<number>;
  /** Date → đoạn read, for the share card's 30-day grid. */
  readDays: Accessor<ReadonlyMap<string, number>>;
  rest: () => void;
  restart: () => void;
  setRemindHour: (hour: number) => void;
};

const StreakContext = createContext<StreakContextValue>({
  ready: () => false,
  state: () => ({ kind: "today", days: 0, record: 0 }),
  week: () => [],
  atRisk: () => false,
  now: () => new Date(),
  remindHour: () => DEFAULT_REMIND_HOUR,
  readDays: () => new Map(),
  rest: () => {},
  restart: () => {},
  setRemindHour: () => {},
});

const sameMarks = (a: StreakMarks, b: StreakMarks) => JSON.stringify(a) === JSON.stringify(b);

/**
 * The streak, derived from the reading history and the marks; re-evaluated each minute.
 * Marks live on the device and, for a signed-in reader, merge with the server copy so every device agrees.
 * `remoteFor` replaces the history API in tests.
 */
export function StreakProvider(props: ParentProps<{ remoteFor?: (userId: string) => StreakMarksRemote | null }>) {
  const history = useHistory();
  const auth = useAuth();
  const [marks, setMarks] = createSignal<StreakMarks>(EMPTY_MARKS);
  const [loaded, setLoaded] = createSignal(false);
  const [now, setNow] = createSignal(new Date());

  onSettled(() => {
    setMarks(parseStreakMarks(readStorage(STREAK_STORAGE_KEY)));
    setLoaded(true);
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  });

  const readDays = createMemo(() => readDaysFromLogs(history.logs()));
  const input = createMemo<StreakInput>(() => ({
    readDays: readDays(),
    restDays: new Set(marks().restDays),
    restartedOn: marks().restartedOn,
    today: localDateKey(now()),
  }));
  const state = createMemo(() => computeStreak(input()));
  const week = createMemo(() => weekStrip(input()));
  const atRisk = createMemo(() => {
    const s = state();
    return s.kind === "today" && s.days > 0 && now().getHours() >= marks().remindHour;
  });

  const save = (next: StreakMarks) => {
    setMarks(next);
    writeStorage(STREAK_STORAGE_KEY, JSON.stringify(next));
  };

  const httpRemote = (): StreakMarksRemote | null => {
    const baseUrl = getHistoryApiUrl();
    return baseUrl ? createHttpStreakMarksRemote({ baseUrl, getAccessToken: (force) => auth.getAccessToken(force) }) : null;
  };
  const localMarks = createMemo(() => marks(), { equals: sameMarks });
  const userId = createMemo(() => (loaded() ? (auth.user()?.id ?? null) : null));
  const remote = createMemo(() => {
    const id = userId();
    return id ? (props.remoteFor ?? httpRemote)(id) : null;
  });
  // Sign-in pulls the server copy first (its reminder hour wins); after that each local change is pushed.
  const pulled = useQuery(() => ({
    queryKey: ["streak-marks", userId()],
    queryFn: async () => (await remote()?.fetch()) ?? null,
    enabled: remote() !== null,
    staleTime: Infinity,
  }));
  const push = useMutation(() => ({
    mutationFn: (args: { server: StreakMarksRemote; marks: StreakMarks }) => args.server.merge(args.marks),
  }));
  let mergedFor: string | null = null;
  createEffect(
    () => {
      const id = userId();
      const server = remote();
      if (!id || !server || !pulled.isSuccess) return null;
      return { userId: id, server, local: localMarks(), pulled: pulled.data };
    },
    (target) => {
      if (!target) return;
      const first = mergedFor !== target.userId;
      mergedFor = target.userId;
      let stale = false;
      push
        .mutate({
          server: target.server,
          marks: first && target.pulled ? mergeMarks(target.local, target.pulled) : target.local,
        })
        .then((merged) => {
          if (!stale) save(merged);
        })
        .catch(() => {
          // shortcut: a failed push waits for the next change or page load; no retry timer.
        });
      return () => {
        stale = true;
      };
    },
  );

  const value: StreakContextValue = {
    ready: () => loaded() && history.hydrated(),
    state,
    week,
    atRisk,
    now,
    remindHour: () => marks().remindHour,
    readDays,
    rest: () => {
      const s = state();
      if (s.kind !== "rescue" || !s.restAvailable) return;
      save({ ...marks(), restDays: [...marks().restDays, s.missed] });
    },
    restart: () => save({ ...marks(), restartedOn: localDateKey(now()) }),
    setRemindHour: (hour) => save({ ...marks(), remindHour: hour }),
  };

  return <StreakContext value={value}>{props.children}</StreakContext>;
}

export function useStreak(): StreakContextValue {
  return useContext(StreakContext);
}

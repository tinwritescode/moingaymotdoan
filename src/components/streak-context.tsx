import { createContext, createMemo, createSignal, onSettled, useContext, type Accessor, type ParentProps } from "solid-js";
import { localDateKey } from "../../lib/history/types";
import {
  computeStreak,
  readDaysFromLogs,
  weekStrip,
  type DayMark,
  type StreakInput,
  type StreakState,
} from "../../lib/streak/streak";
import { useHistory } from "./history-context";
import { readStorage, writeStorage } from "./preferences-context";

export const STREAK_STORAGE_KEY = "kt:streak:v1";
export const DEFAULT_REMIND_HOUR = 21;

/** What the reading logs cannot tell: kept on this device only (see the OpenSpec design, Risks). */
type StreakMarks = { restDays: string[]; restartedOn: string | null; remindHour: number };

const EMPTY_MARKS: StreakMarks = { restDays: [], restartedOn: null, remindHour: DEFAULT_REMIND_HOUR };
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/u;
const isDate = (v: unknown): v is string => typeof v === "string" && DATE_RE.test(v);
const isHour = (v: unknown): v is number => Number.isInteger(v) && Number(v) >= 6 && Number(v) <= 23;

export function parseStreakMarks(raw: string | null): StreakMarks {
  try {
    const v: unknown = raw ? JSON.parse(raw) : null;
    if (!v || typeof v !== "object") return EMPTY_MARKS;
    const o = v as Record<string, unknown>;
    return {
      restDays: Array.isArray(o.restDays) ? o.restDays.filter(isDate) : [],
      restartedOn: isDate(o.restartedOn) ? o.restartedOn : null,
      remindHour: isHour(o.remindHour) ? o.remindHour : DEFAULT_REMIND_HOUR,
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

/** The streak, derived from the reading history and the marks kept on this device; re-evaluated each minute. */
export function StreakProvider(props: ParentProps) {
  const history = useHistory();
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

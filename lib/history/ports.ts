import type {
  CompleteMutationResult,
  CompletePayload,
  HistoryKind,
  HistorySnapshot,
  VisitMutationResult,
  VisitPayload,
} from "./types";
import type { StreakMarks } from "../streak/marks";

/** Client local persistence seam (browser localStorage in prod, in-memory store in tests). */
export type LocalHistoryStore = {
  read(): HistorySnapshot;
  write(snapshot: HistorySnapshot): void;
  clear(): void;
};

/** Client remote sync seam (HTTP adapter to cloud function in prod, in-memory adapter in tests). */
export type RemoteHistoryAdapter = {
  fetchHistory(): Promise<HistorySnapshot>;
  recordVisit(payload: VisitPayload): Promise<VisitMutationResult>;
  setCompleted(payload: CompletePayload): Promise<CompleteMutationResult>;
  syncGuest(items: VisitPayload[]): Promise<HistorySnapshot>;
  deleteLog(id: string): Promise<void>;
  clearAll(): Promise<void>;
};

/** Client seam for the signed-in user's streak marks (HTTP in prod, in-memory repository in tests). */
export type StreakMarksRemote = {
  fetch(): Promise<StreakMarks | null>;
  /** Merges into the server copy; resolves to the merged marks. */
  merge(marks: StreakMarks): Promise<StreakMarks>;
};

/** Server persistence seam (Postgres adapter in prod, in-memory repository in tests). */
export type HistoryRepository = {
  fetchUserHistory(userId: string): Promise<HistorySnapshot>;
  upsertVisit(userId: string, item: VisitPayload, options: { isSync: boolean }): Promise<VisitMutationResult>;
  setCompleted(
    userId: string,
    input: {
      kind: HistoryKind;
      itemKey: string;
      completed: boolean;
      fallbackVisit: VisitPayload | null;
    },
  ): Promise<CompleteMutationResult | null>;
  syncVisits(userId: string, items: VisitPayload[]): Promise<HistorySnapshot>;
  deleteLog(userId: string, id: string): Promise<boolean>;
  /** Also forgets the user's streak marks. */
  clearUserHistory(userId: string): Promise<void>;
  fetchStreakMarks(userId: string): Promise<StreakMarks | null>;
  /** Merges `marks` into the stored copy (see mergeMarks) and returns the result. */
  mergeStreakMarks(userId: string, marks: StreakMarks): Promise<StreakMarks>;
};

/** Server bearer-token verification seam: returns the authenticated userId or null. */
export type TokenVerifier = (token: string) => Promise<string | null>;

/** Server CORS origin policy seam. */
export type OriginPolicy = (origin: string) => boolean;

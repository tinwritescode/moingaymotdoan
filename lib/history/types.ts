export type HistoryKind = "chapter" | "mood";

export type ReadingProgress = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  firstReadAt: string;
  lastReadAt: string;
  readCount: number;
  completed: boolean;
  completedAt: string | null;
};

export type ReadingLog = {
  id: string;
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  /** Ngày theo lịch địa phương của người đọc: YYYY-MM-DD */
  readDate: string;
  readAt: string;
};

export type HistorySnapshot = {
  progress: ReadingProgress[];
  logs: ReadingLog[];
};

export type VisitInput = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug?: string | null;
  chapter?: number | null;
  title: string;
  subtitle: string;
  completed?: boolean;
};

export type DateGroup = {
  dateKey: string;
  label: string;
  items: ReadingLog[];
};

const WEEKDAYS_VI = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"] as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Trả về khóa ngày địa phương dạng YYYY-MM-DD (không bị lệch múi giờ UTC). */
export function localDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Chuyển YYYY-MM-DD thành DD/MM/YYYY. */
export function formatDateKeyDMY(dateKey: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(dateKey);
  if (!m) return dateKey;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** Nhãn tiêu đề ngày cho lịch sử đọc: "Hôm nay · Thứ Tư, 25/11/2026", "Hôm qua · ...", hoặc "Thứ Hai, 23/11/2026". */
export function formatDateHeading(dateKey: string, now: Date = new Date()): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(dateKey);
  if (!m) return dateKey;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(year, month - 1, day);
  const weekday = WEEKDAYS_VI[d.getDay()];
  const dmy = `${m[3]}/${m[2]}/${m[1]}`;

  const todayKey = localDateKey(now);
  if (dateKey === todayKey) return `Hôm nay · ${weekday}, ${dmy}`;

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (dateKey === localDateKey(yesterday)) return `Hôm qua · ${weekday}, ${dmy}`;

  return `${weekday}, ${dmy}`;
}

/** Định dạng ngày ngắn DD/MM/YYYY từ chuỗi ISO. */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Định dạng giờ:phút (24h) từ chuỗi ISO theo múi giờ người đọc. */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Định dạng "DD/MM/YYYY lúc HH:MM". */
export function formatDateTime(iso: string): string {
  const date = formatShortDate(iso);
  const time = formatTime(iso);
  if (!date) return "";
  return time ? `${date} lúc ${time}` : date;
}

/** Đường dẫn tương đối đến đoạn Kinh Thánh hoặc chuyên mục cảm xúc. */
export function itemHref(item: {
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
}): string {
  if (item.kind === "chapter" && item.bookSlug && item.chapter) {
    return `/${item.bookSlug}/${item.chapter}`;
  }
  return `/cam-xuc/${item.itemKey}`;
}

/** Khóa tra cứu duy nhất cho một bản ghi progress. */
export function progressMapKey(kind: HistoryKind, itemKey: string): string {
  return `${kind}:${itemKey}`;
}

/** Gom lịch sử đọc theo ngày giảm dần (mới nhất lên đầu). */
export function groupLogsByDate(logs: ReadingLog[], now: Date = new Date()): DateGroup[] {
  const map = new Map<string, ReadingLog[]>();
  const sorted = [...logs].sort((a, b) => {
    if (a.readDate !== b.readDate) return b.readDate.localeCompare(a.readDate);
    return b.readAt.localeCompare(a.readAt);
  });
  for (const log of sorted) {
    const list = map.get(log.readDate) ?? [];
    list.push(log);
    map.set(log.readDate, list);
  }
  return [...map.entries()].map(([dateKey, items]) => ({
    dateKey,
    label: formatDateHeading(dateKey, now),
    items,
  }));
}

/** Tính số ngày đọc liên tiếp tính đến hôm nay (hoặc hôm qua nếu hôm nay chưa mở). */
export function computeStreak(logs: ReadingLog[], now: Date = new Date()): number {
  const days = new Set(logs.map((l) => l.readDate));
  if (days.size === 0) return 0;

  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(localDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(localDateKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Chỉ cho phép đường dẫn tương đối an toàn sau khi đăng nhập (chặn open-redirect). */
export function safeNextPath(raw: string | null | undefined, fallback = "/lich-su"): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback;
  }
  return trimmed;
}

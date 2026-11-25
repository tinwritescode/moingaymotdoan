import type { Ref } from "../content";

export type MoodGroup = {
  id: string;
  name: string;
  /** Nhãn gọn cho thanh lọc ngang trên điện thoại. */
  shortName: string;
  description: string;
};

export type MoodPassageDef = {
  /** Chỗ dẫn đủ tên sách theo Bản Truyền Thống, vd. "Thi-thiên 34:18" hoặc "Ma-thi-ơ 11:28–30". */
  ref: string;
  /** Lời gợi ý ngắn gọn nối câu Kinh Thánh với tâm trạng người đọc. */
  note: string;
};

export type MoodDefinition = {
  slug: string;
  title: string;
  groupId: string;
  /** Một câu ngắn mô tả tình huống, hiện trên thẻ danh sách. */
  prompt: string;
  /** Lời nhắn mở đầu ngắn gọn, đồng cảm ở đầu trang chuyên mục. */
  intro: string;
  /** Từ khóa bổ sung hỗ trợ tìm kiếm nhanh. */
  keywords: readonly string[];
  passages: readonly MoodPassageDef[];
  /** Lời cầu nguyện ngắn (1–3 câu) khép lại trang, xưng "con" với Chúa. */
  prayer: string;
};

export type MoodSummary = {
  slug: string;
  title: string;
  groupId: string;
  prompt: string;
  keywords: string[];
  /** Các sách Kinh Thánh xuất hiện trong chuyên mục, giúp tìm nhanh theo tên sách. */
  books: string[];
  passageCount: number;
};

export type MoodIndex = {
  groups: MoodGroup[];
  moods: MoodSummary[];
};

export type MoodPassageView = {
  ref: Ref;
  note: string;
  chapterTitle: string | null;
  hasChapter: boolean;
};

export type MoodNavLink = {
  slug: string;
  title: string;
};

export type MoodView = {
  slug: string;
  title: string;
  group: MoodGroup;
  prompt: string;
  intro: string;
  keywords: string[];
  passages: MoodPassageView[];
  prayer: string;
  related: MoodSummary[];
  prev: MoodNavLink | null;
  next: MoodNavLink | null;
};

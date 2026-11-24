import type { Mode, Ref } from "../content";

export type MoodGroup = {
  id: string;
  name: string;
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
};

export type MoodSummary = {
  slug: string;
  title: string;
  groupId: string;
  prompt: string;
  keywords: string[];
  passageCount: number;
};

export type MoodIndex = {
  mode: Mode;
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
  mode: Mode;
  slug: string;
  title: string;
  group: MoodGroup;
  prompt: string;
  intro: string;
  keywords: string[];
  passages: MoodPassageView[];
  related: MoodSummary[];
  prev: MoodNavLink | null;
  next: MoodNavLink | null;
};

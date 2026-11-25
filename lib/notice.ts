import { messagesFor, type Locale } from "./i18n";

/** Thông báo nguồn biên soạn hiện nhất quán trên trang chủ, từng đoạn, trang cảm xúc và ebook. */
export const AI_NOTICE = messagesFor("vi").aiNotice;

export function aiNotice(locale: Locale = "vi"): string {
  return messagesFor(locale).aiNotice;
}

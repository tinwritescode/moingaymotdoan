import type { APIEvent } from "filesystem-routing/api";
import { loadMood } from "../../../content.server";

/** `<slug>.json`: một chuyên mục cảm xúc kèm lời Kinh Thánh đã tra sẵn. */
export function GET(event: APIEvent) {
  const m = /^([a-z0-9-]+)\.json$/.exec(event.params?.file ?? "");
  const view = m && loadMood(m[1]);
  return view ? Response.json(view) : new Response("Không có chuyên mục này", { status: 404 });
}

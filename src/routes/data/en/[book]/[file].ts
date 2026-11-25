import type { APIEvent } from "filesystem-routing/api";
import { loadChapter } from "../../../../content.server";

/** `<number>.json`: one English chapter view, as its page reads it in the browser. */
export function GET(event: APIEvent) {
  const m = /^(\d+)\.json$/.exec(event.params?.file ?? "");
  const view = m && loadChapter({ slug: event.params?.book ?? "", number: Number(m[1]), locale: "en" });
  return view ? Response.json(view) : new Response("Chapter not found", { status: 404 });
}

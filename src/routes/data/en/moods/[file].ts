import type { APIEvent } from "filesystem-routing/api";
import { loadMood } from "../../../../content.server";

/** `<slug>.json`: one English mood guide with resolved BSB scripture passages. */
export function GET(event: APIEvent) {
  const m = /^([a-z0-9-]+)\.json$/.exec(event.params?.file ?? "");
  const view = m && loadMood(m[1], "en");
  return view ? Response.json(view) : new Response("Mood guide not found", { status: 404 });
}

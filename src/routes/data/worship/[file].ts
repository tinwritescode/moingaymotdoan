import type { APIEvent } from "filesystem-routing/api";
import { loadKtdd, loadThanhCa, loadTinDieu, loadTvchh } from "../../../content.server";

/** Static worship JSON endpoints: thanh-ca.json, tvchh.json, ktdd.json, tin-dieu.json. */
export function GET(event: APIEvent) {
  switch (event.params?.file) {
    case "thanh-ca.json":
      return Response.json(loadThanhCa());
    case "tvchh.json":
      return Response.json(loadTvchh());
    case "ktdd.json":
      return Response.json(loadKtdd());
    case "tin-dieu.json":
      return Response.json(loadTinDieu());
    default:
      return new Response("Not found", { status: 404 });
  }
}

import { loadToc } from "../../../content.server";

export const GET = () => Response.json(loadToc("en"));

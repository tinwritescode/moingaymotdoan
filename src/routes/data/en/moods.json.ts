import { loadMoodIndex } from "../../../content.server";

export const GET = () => Response.json(loadMoodIndex("en"));

import type { RouteDefinition } from "@solidjs/router";
import { getToc } from "../../data";
import { EbookPageView } from "../../pages/ebook-page";

export const route = { preload: () => void getToc("vi") } satisfies RouteDefinition;

export default EbookPageView;

import type { RouteDefinition } from "@solidjs/router";
import { getChapter, getToc } from "../../data";
import { HomePage, startOf } from "../../pages/home-page";

export const route = {
  preload: () =>
    void getToc("en").then((toc) => {
      const start = startOf(toc);
      if (start) void getChapter(start.book.slug, start.chapters[0].number, "en");
    }),
} satisfies RouteDefinition;

export default HomePage;

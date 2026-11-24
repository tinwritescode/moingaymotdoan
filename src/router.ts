import { pageRoutes } from "virtual:file-routes";
import { createRouter, intentPreload } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";

// intentPreload: hovering or focusing a link fetches that đoạn's data before the click.
export const Router = createRouter({
  routes: fileRoutes(pageRoutes),
  preloadLinks: intentPreload(),
});

export const { paths } = Router;

/** Where a đoạn lives; also where its prerendered page is written. */
export const chapterHref = (args: { slug: string; number: number }) => `/${args.slug}/${args.number}`;

/** Where a mood/topic page lives. */
export const moodHref = (slug: string) => `/cam-xuc/${slug}`;

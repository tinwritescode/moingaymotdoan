import { pageRoutes } from "virtual:file-routes";
import { createRouter, intentPreload } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";

export {
  accountHref,
  alternatePath,
  chapterHref,
  contactHref,
  ebookFileHref,
  ebookHref,
  historyHref,
  homeHref,
  moodHref,
  moodsHref,
  privacyHref,
  termsHref,
} from "../lib/i18n";

// intentPreload: hovering or focusing a link fetches that chapter's data before the click.
export const Router = createRouter({
  routes: fileRoutes(pageRoutes),
  preloadLinks: intentPreload(),
});

export const { paths } = Router;

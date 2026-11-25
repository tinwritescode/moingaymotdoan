import type { RouteDefinition } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";
import { localeFromPath } from "../../lib/i18n";
import { NotFound } from "../components/not-found";
import { getToc } from "../data";

export const route = {
  preload: ({ location }) => {
    httpStatus(404);
    void getToc(localeFromPath(location.pathname));
  },
} satisfies RouteDefinition;

export default NotFound;

import type { RouteDefinition } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";
import { NotFound } from "../components/not-found";
import { getToc } from "../data";

// Set in preload, so the status is in place before the response head flushes.
export const route = {
  preload: () => {
    httpStatus(404);
    void getToc();
  },
} satisfies RouteDefinition;

export default NotFound;

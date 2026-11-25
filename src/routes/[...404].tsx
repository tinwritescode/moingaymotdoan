import type { RouteDefinition } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";
import { NotFound } from "../components/not-found";

export const route = {
  preload: () => {
    httpStatus(404);
  },
} satisfies RouteDefinition;

export default NotFound;

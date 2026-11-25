import type { RouteDefinition } from "@solidjs/router";
import { getToc } from "../data";
import { AccountPageView } from "../pages/account-page";

export const route = {
  preload: () => {
    void getToc("vi");
  },
} satisfies RouteDefinition;

export default AccountPageView;

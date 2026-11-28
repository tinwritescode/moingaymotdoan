import type { RouteDefinition } from "@solidjs/router";
import { getThanhCa } from "../../data";
import { WorshipPageView } from "../../pages/worship-page";

export const route = {
  preload: () => {
    void getThanhCa();
  },
} satisfies RouteDefinition;

export default WorshipPageView;

import type { RouteDefinition } from "@solidjs/router";
import { getMoodIndex } from "../../../data";
import { MoodsPageView } from "../../../pages/moods-page";

export const route = {
  preload: () => {
    void getMoodIndex("en");
  },
} satisfies RouteDefinition;

export default MoodsPageView;

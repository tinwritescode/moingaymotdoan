import type { RouteDefinition } from "@solidjs/router";
import { getMoodIndex, getToc } from "../../../data";
import { MoodsPageView } from "../../../pages/moods-page";

export const route = {
  preload: () => {
    void getToc("en");
    void getMoodIndex("en");
  },
} satisfies RouteDefinition;

export default MoodsPageView;

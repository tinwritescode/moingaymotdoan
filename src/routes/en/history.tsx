import type { RouteDefinition } from "@solidjs/router";
import { getMoodIndex, getToc } from "../../data";
import { HistoryPageView } from "../../pages/history-page";

export const route = {
  preload: () => {
    void getToc("en");
    void getMoodIndex("en");
  },
} satisfies RouteDefinition;

export default HistoryPageView;

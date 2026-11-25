import type { RouteDefinition } from "@solidjs/router";
import { getMoodIndex, getToc } from "../data";
import { HistoryPageView } from "../pages/history-page";

export const route = {
  preload: () => {
    void getToc("vi");
    void getMoodIndex("vi");
  },
} satisfies RouteDefinition;

export default HistoryPageView;

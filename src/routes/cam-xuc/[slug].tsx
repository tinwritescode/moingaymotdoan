import type { RouteProps } from "@solidjs/router";
import { defineFileRoute } from "@solidjs/router/fs";
import { getMood } from "../../data";
import { MoodDetailPageView } from "../../pages/mood-detail-page";

export const route = defineFileRoute("/cam-xuc/:slug", {
  preload: ({ params }) => {
    void getMood(params.slug, "vi");
  },
});

export default function CamXucDetailPage(props: RouteProps<typeof route>) {
  return <MoodDetailPageView slug={props.params.slug} />;
}

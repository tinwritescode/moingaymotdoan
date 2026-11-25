import type { RouteProps } from "@solidjs/router";
import { defineFileRoute } from "@solidjs/router/fs";
import { getMood, getToc } from "../../../data";
import { MoodDetailPageView } from "../../../pages/mood-detail-page";

export const route = defineFileRoute("/en/moods/:slug", {
  preload: ({ params }) => {
    void getToc("en");
    void getMood(params.slug, "en");
  },
});

export default function EnMoodDetailPage(props: RouteProps<typeof route>) {
  return <MoodDetailPageView slug={props.params.slug} />;
}

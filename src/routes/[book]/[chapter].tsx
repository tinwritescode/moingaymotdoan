import type { RouteProps } from "@solidjs/router";
import { defineFileRoute } from "@solidjs/router/fs";
import { getChapter } from "../../data";
import { ChapterPageView } from "../../pages/chapter-page";

export const route = defineFileRoute("/:book/:chapter", {
  preload: ({ params }) => {
    void getChapter(params.book, Number(params.chapter), "vi");
  },
});

export default function ChapterPage(props: RouteProps<typeof route>) {
  return <ChapterPageView book={props.params.book} chapter={Number(props.params.chapter)} />;
}

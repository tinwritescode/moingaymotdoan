import type { RouteProps } from "@solidjs/router";
import { defineFileRoute } from "@solidjs/router/fs";
import { getChapter } from "../../../data";
import { ChapterPageView } from "../../../pages/chapter-page";

export const route = defineFileRoute("/en/:book/:chapter", {
  preload: ({ params }) => {
    void getChapter(params.book, Number(params.chapter), "en");
  },
});

export default function EnChapterPage(props: RouteProps<typeof route>) {
  return <ChapterPageView book={props.params.book} chapter={Number(props.params.chapter)} />;
}

import { captureArtifact } from "@solidjs/diagnostics";
import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { createRouter } from "@solidjs/router";
import { createMemo, flush, Loading, Show } from "solid-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createHistoryEngine } from "../../lib/history/engine";
import { createMemoryLocalHistoryStore } from "../../lib/history/memory-adapters";
import { TOUR_STORAGE_KEY } from "../lib/tour";
import { HistoryProvider } from "./history-context";
import { ChapterTour, WelcomeSheet } from "./tour";
import { expectNoSolidWarnings } from "./diagnostics-fixtures";

beforeEach(() => {
  localStorage.clear();
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

const engine = () => createHistoryEngine({ local: createMemoryLocalHistoryStore(), now: () => new Date(2026, 10, 25) });

describe("<WelcomeSheet />", () => {
  const renderSheet = () =>
    render(() => (
      <HistoryProvider engine={engine()}>
        <WelcomeSheet startHref="/sang-the-ky/1" />
      </HistoryProvider>
    ));

  test("greets a new reader, links to the guided first chapter, and stays gone once dismissed", () => {
    const first = renderSheet();
    flush();
    expect(first.getByRole("link", { name: "Đọc đoạn đầu, có chỉ dẫn" }).getAttribute("href")).toBe(
      "/sang-the-ky/1?tour",
    );

    fireEvent.click(first.getByRole("button", { name: "Tôi tự xem" }));
    flush();
    expect(first.queryByRole("dialog")).toBeNull();
    first.unmount();

    const again = renderSheet();
    flush();
    expect(again.queryByRole("dialog")).toBeNull();
  });
});

describe("<ChapterTour />", () => {
  /** A chapter page with a chỗ dẫn, folds and the pager, but no display controls. */
  const page = () => (
    <>
      <section id="cau-chuyen">
        <button type="button" class="kt-ref">
          1:2
        </button>
      </section>
      <div class="kt-notes">folds</div>
      <nav class="kt-chapter-nav">next</nav>
      <ChapterTour />
    </>
  );

  const routes = [
    { path: "/", component: () => <a href="/sang-the-ky/1?tour">Xem lại hướng dẫn</a> },
    {
      path: "/sang-the-ky/1",
      // Async like the real chapter data, so an in-app link holds the address bar until the page is ready.
      component: () => {
        const chapter = createMemo(() => Promise.resolve(1));
        return <Show when={chapter()}>{page()}</Show>;
      },
    },
  ];

  const openAt = async (url: string) => {
    window.history.replaceState(null, "", url);
    const Router = createRouter({ routes });
    const view = render(() => <Router>{(props) => <Loading>{props.children}</Loading>}</Router>);
    await view.findByText(url === "/" ? "Xem lại hướng dẫn" : "next");
    flush();
    return view;
  };

  test("without ?tour it shows nothing", async () => {
    const { queryByRole } = await openAt("/sang-the-ky/1");
    expect(queryByRole("dialog")).toBeNull();
  });

  test("walks the steps whose targets exist, then ends the tour for good", async () => {
    const { getByRole, queryByRole } = await openAt("/sang-the-ky/1?tour");
    const { artifact } = await captureArtifact(
      () => {
        expect(getByRole("dialog").textContent).toContain("Bước 1 / 3");
        expect(getByRole("dialog").textContent).toContain("Chạm số câu để đọc nguyên văn");

        fireEvent.click(getByRole("button", { name: "Tiếp" }));
        flush();
        expect(getByRole("dialog").textContent).toContain("Bước 2 / 3");

        fireEvent.click(getByRole("button", { name: "Tiếp" }));
        flush();
        expect(getByRole("dialog").textContent).toContain("Bước 3 / 3");

        fireEvent.click(getByRole("button", { name: "Xong, đọc tiếp" }));
        flush();
        expect(queryByRole("dialog")).toBeNull();
        expect(window.location.search).toBe("");
        expect(localStorage.getItem(TOUR_STORAGE_KEY)).toBe("done");
      },
      { scenario: "chapter-tour" },
    );
    expectNoSolidWarnings(artifact);
  });

  test("starts when an in-app link leads to the chapter with ?tour", async () => {
    const { findByRole, getByRole } = await openAt("/");
    fireEvent.click(getByRole("link", { name: "Xem lại hướng dẫn" }));

    expect((await findByRole("dialog")).textContent).toContain("Bước 1 / 3");
  });

  test("Escape skips the tour", async () => {
    const { queryByRole } = await openAt("/sang-the-ky/1?tour");

    fireEvent.keyDown(window, { key: "Escape" });
    flush();
    expect(queryByRole("dialog")).toBeNull();
    expect(localStorage.getItem(TOUR_STORAGE_KEY)).toBe("done");
  });
});

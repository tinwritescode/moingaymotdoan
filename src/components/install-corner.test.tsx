import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { createRouter } from "@solidjs/router";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TOUR_STORAGE_KEY } from "../lib/tour";
import { InstallCorner } from "./install-corner";
import { RouterLocaleProvider } from "./locale-context";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const WINDOWS_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function device(ua: string, standalone = false) {
  Object.defineProperty(navigator, "userAgent", { value: ua, configurable: true });
  Object.defineProperty(navigator, "maxTouchPoints", { value: ua === IPHONE ? 5 : 0, configurable: true });
  window.matchMedia = ((query: string) => ({ matches: standalone && query.includes("standalone") })) as typeof window.matchMedia;
}

/** Chrome's install offer, as the page receives it. */
function offerInstall() {
  const prompt = vi.fn(async () => {});
  window.dispatchEvent(Object.assign(new Event("beforeinstallprompt"), { prompt }));
  return prompt;
}

const routes = [
  { path: "/", component: () => <p>home</p> },
  { path: "/sang-the-ky/1", component: () => <p>chapter</p> },
  { path: "/cai-dat", component: () => <p>install guide</p> },
];

async function openAt(url: string) {
  window.history.replaceState(null, "", url);
  const Router = createRouter({ routes });
  const view = render(() => (
    <Router>
      {(props) => (
        <RouterLocaleProvider>
          {props.children}
          <InstallCorner />
        </RouterLocaleProvider>
      )}
    </Router>
  ));
  await view.findByText(/home|chapter|install guide/);
  flush();
  return view;
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(TOUR_STORAGE_KEY, "done");
  device(IPHONE);
});

afterEach(() => {
  cleanup();
  // Drops any install offer a test left behind.
  window.dispatchEvent(new Event("appinstalled"));
  window.history.replaceState(null, "", "/");
});

describe("<InstallCorner />", () => {
  test("greets an iPhone reader once with the tip, then hides for good when dismissed", async () => {
    const first = await openAt("/sang-the-ky/1");
    expect(first.getByRole("button", { name: "Cài ứng dụng" })).toBeTruthy();
    expect(first.getByText("Cài app, đọc cả khi offline")).toBeTruthy();

    fireEvent.click(first.getByRole("button", { name: "Ẩn nút cài" }));
    flush();
    expect(first.queryByRole("button", { name: "Cài ứng dụng" })).toBeNull();
    expect(first.getByRole("status").textContent).toContain("Đã ẩn");
    cleanup();

    const again = await openAt("/sang-the-ky/1");
    expect(again.queryByRole("button", { name: "Cài ứng dụng" })).toBeNull();
  });

  test("undo brings the corner back, without the tip", async () => {
    const view = await openAt("/sang-the-ky/1");
    fireEvent.click(view.getByRole("button", { name: "Ẩn nút cài" }));
    flush();
    fireEvent.click(view.getByRole("button", { name: "Hoàn tác" }));
    flush();
    expect(view.getByRole("button", { name: "Cài ứng dụng" })).toBeTruthy();
    expect(view.queryByText("Cài app, đọc cả khi offline")).toBeNull();
  });

  test("on iPhone, the first tap opens the tip and the second goes to the install guide", async () => {
    localStorage.setItem("kt:install-tip:v1", "seen");
    const view = await openAt("/sang-the-ky/1");
    expect(view.queryByText("Cài app, đọc cả khi offline")).toBeNull();

    fireEvent.click(view.getByRole("button", { name: "Cài ứng dụng" }));
    flush();
    expect(view.getByText("Cài app, đọc cả khi offline")).toBeTruthy();

    fireEvent.click(view.getByRole("button", { name: "Cài ứng dụng" }));
    await view.findByText("install guide");
    expect(location.pathname).toBe("/cai-dat");
  });

  test("on a computer, it waits for the browser's install offer and then opens its dialog", async () => {
    device(WINDOWS_CHROME);
    localStorage.setItem("kt:install-tip:v1", "seen");
    const view = await openAt("/sang-the-ky/1");
    expect(view.queryByRole("button", { name: "Cài ứng dụng" })).toBeNull();

    const prompt = offerInstall();
    flush();
    fireEvent.click(view.getByRole("button", { name: "Cài ứng dụng" }));
    flush();
    fireEvent.click(view.getByRole("button", { name: "Cài ứng dụng" }));
    expect(prompt).toHaveBeenCalledOnce();
  });

  test("stays away in the installed app, on the install guide, and under the welcome sheet", async () => {
    device(IPHONE, true);
    expect((await openAt("/sang-the-ky/1")).queryByRole("button", { name: "Cài ứng dụng" })).toBeNull();
    cleanup();

    device(IPHONE);
    expect((await openAt("/cai-dat")).queryByRole("button", { name: "Cài ứng dụng" })).toBeNull();
    cleanup();

    localStorage.removeItem(TOUR_STORAGE_KEY);
    expect((await openAt("/")).queryByRole("button", { name: "Cài ứng dụng" })).toBeNull();
  });
});

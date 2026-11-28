import { render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Flame } from "./flame";

const loadAnimation = vi.hoisted(() => vi.fn());
vi.mock("lottie-web/build/player/lottie_light", () => ({ default: { loadAnimation } }));

function prefersReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({ matches: reduce && query.includes("reduce") })) as typeof window.matchMedia;
}

describe("<Flame />", () => {
  beforeEach(() => {
    loadAnimation.mockReturnValue({ addEventListener: vi.fn(), destroy: vi.fn() });
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ v: "5.7.4" }))));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    loadAnimation.mockReset();
  });

  test("draws the static flame and plays its Lottie file", async () => {
    prefersReducedMotion(false);
    const { container } = render(() => <Flame kind="den-dau" mode="dim" />);
    flush();
    expect(container.querySelector("svg")).not.toBeNull();
    await vi.waitFor(() => expect(loadAnimation).toHaveBeenCalledOnce());
    expect(fetch).toHaveBeenCalledWith("/lottie/den-dau-leo-let.json");
    expect(loadAnimation.mock.calls[0][0]).toMatchObject({ loop: true, animationData: { v: "5.7.4" } });
  });

  test("keeps the static drawing and loads no player under reduced motion", async () => {
    prefersReducedMotion(true);
    const { container } = render(() => <Flame kind="nen" mode="lit" />);
    flush();
    await new Promise((r) => setTimeout(r, 20));
    expect(container.querySelector("svg")).not.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(loadAnimation).not.toHaveBeenCalled();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { fitText, isShareTemplate, last30Days, SHARE_TEMPLATES, shareOrDownload } from "./share-card";

describe("last30Days", () => {
  it("lists the last 30 days oldest first, ending today", () => {
    const days = last30Days(
      new Map([
        ["2026-11-29", 1],
        ["2026-10-31", 2],
        ["2026-10-30", 1],
      ]),
      "2026-11-29",
    );
    expect(days).toHaveLength(30);
    expect(days[0]).toBe(true); // 2026-10-31
    expect(days[29]).toBe(true);
    expect(days.filter(Boolean)).toHaveLength(2);
  });
});

describe("shareOrDownload", () => {
  afterEach(() => vi.unstubAllGlobals());
  const png = new Blob(["png"], { type: "image/png" });

  it("opens the share sheet with the PNG when files can be shared", async () => {
    const share = vi.fn(async () => {});
    vi.stubGlobal("navigator", { canShare: () => true, share });
    expect(await shareOrDownload(png, "moingaymotdoan-24-ngay.png")).toBe("shared");
    const [{ files }] = share.mock.calls[0] as unknown as [{ files: File[] }];
    expect(files[0].name).toBe("moingaymotdoan-24-ngay.png");
    expect(files[0].type).toBe("image/png");
  });

  it("treats a cancelled share as done", async () => {
    vi.stubGlobal("navigator", { canShare: () => true, share: async () => Promise.reject(new DOMException("x", "AbortError")) });
    expect(await shareOrDownload(png, "a.png")).toBe("cancelled");
  });

  it("downloads the PNG when files cannot be shared", async () => {
    vi.stubGlobal("navigator", {});
    const click = vi.fn();
    const a = { click, href: "", download: "" };
    vi.stubGlobal("document", { createElement: () => a });
    vi.stubGlobal("URL", { createObjectURL: () => "blob:x", revokeObjectURL: () => {} });
    expect(await shareOrDownload(png, "moingaymotdoan-24-ngay.png")).toBe("downloaded");
    expect(a.download).toBe("moingaymotdoan-24-ngay.png");
    expect(click).toHaveBeenCalledOnce();
  });
});

describe("fitText", () => {
  // One unit per code point, so "…" costs 1.
  const width = (s: string) => [...s].length;

  it("keeps a name that fits", () => {
    expect(fitText("Tin Nguyễn", 10, width)).toBe("Tin Nguyễn");
  });

  it("cuts a long name and ends it with an ellipsis, within the width", () => {
    expect(fitText("Nguyễn Thị Minh Khai", 8, width)).toBe("Nguyễn…");
  });
});

describe("SHARE_TEMPLATES", () => {
  it("lists the original card plus ten additional templates", () => {
    expect(SHARE_TEMPLATES.map((t) => t.id)).toEqual([
      "paper",
      "night",
      "moss",
      "manuscript",
      "dawn",
      "editorial",
      "postcard",
      "celestial",
      "terracotta",
      "journal",
      "monochrome",
    ]);
  });

  it("validates stored template identifiers", () => {
    expect(isShareTemplate("night")).toBe(true);
    expect(isShareTemplate("monochrome")).toBe(true);
    expect(isShareTemplate("unknown")).toBe(false);
    expect(isShareTemplate(null)).toBe(false);
  });
});

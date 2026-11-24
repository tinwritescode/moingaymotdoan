import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { describe, expect, test } from "vitest";
import type { MoodIndex } from "../../lib/moods/types";
import { MoodBrowser } from "./mood-browser";

const SAMPLE: MoodIndex = {
  mode: "nhap",
  groups: [
    { id: "niem-vui", name: "Niềm vui & biết ơn", description: "Mô tả vui." },
    { id: "noi-buon", name: "Nỗi buồn & cô đơn", description: "Mô tả buồn." },
  ],
  moods: [
    {
      slug: "vui-mung",
      title: "Vui mừng",
      groupId: "niem-vui",
      prompt: "Khi lòng rạng rỡ.",
      keywords: ["vui", "hân hoan"],
      passageCount: 4,
    },
    {
      slug: "buon-ba",
      title: "Buồn bã",
      groupId: "noi-buon",
      prompt: "Khi lòng nặng trĩu.",
      keywords: ["buồn", "u sầu"],
      passageCount: 4,
    },
    {
      slug: "co-don",
      title: "Cô đơn",
      groupId: "noi-buon",
      prompt: "Khi thấy lẻ loi.",
      keywords: ["một mình"],
      passageCount: 4,
    },
  ],
};

describe("<MoodBrowser />", () => {
  test("lọc theo từ khóa không dấu và nhóm chủ đề không phát sinh cảnh báo Solid 2.0", async () => {
    const { artifact } = await captureArtifact(
      () => {
        const { container, getByRole } = render(() => <MoodBrowser index={SAMPLE} />);
        expect(container.querySelectorAll("a[href^='/cam-xuc/']")).toHaveLength(3);

        const input = getByRole("searchbox");
        fireEvent.input(input, { target: { value: "buon" } });
        flush();
        expect(container.querySelectorAll("a[href^='/cam-xuc/']")).toHaveLength(1);
        expect(container.textContent).toContain("Buồn bã");

        const clear = getByRole("button", { name: "Xóa lọc" });
        fireEvent.click(clear);
        flush();
        expect(container.querySelectorAll("a[href^='/cam-xuc/']")).toHaveLength(3);

        const groupBtn = getByRole("button", { name: /Niềm vui/ });
        fireEvent.click(groupBtn);
        flush();
        expect(container.querySelectorAll("a[href^='/cam-xuc/']")).toHaveLength(1);
        expect(container.textContent).toContain("Vui mừng");
      },
      { scenario: "mood-browser-filter" },
    );
    expectNoDiagnostics(artifact);
  });
});

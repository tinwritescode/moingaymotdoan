import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { describe, expect, test } from "vitest";
import type { MoodIndex } from "../../lib/moods/types";
import { MoodBrowser } from "./mood-browser";

const SAMPLE: MoodIndex = {
  groups: [
    { id: "niem-vui", name: "Niềm vui & biết ơn", shortName: "Niềm vui", description: "Mô tả vui." },
    { id: "noi-buon", name: "Nỗi buồn & cô đơn", shortName: "Nỗi buồn", description: "Mô tả buồn." },
  ],
  moods: [
    {
      slug: "vui-mung",
      title: "Vui mừng",
      groupId: "niem-vui",
      prompt: "Khi lòng rạng rỡ.",
      keywords: ["vui", "hân hoan"],
      books: ["Phi-líp", "Thi-thiên"],
      passageCount: 4,
    },
    {
      slug: "buon-ba",
      title: "Buồn bã",
      groupId: "noi-buon",
      prompt: "Khi lòng nặng trĩu.",
      keywords: ["buồn", "u sầu"],
      books: ["Thi-thiên", "Ma-thi-ơ"],
      passageCount: 4,
    },
    {
      slug: "co-don",
      title: "Cô đơn",
      groupId: "noi-buon",
      prompt: "Khi thấy lẻ loi.",
      keywords: ["một mình"],
      books: ["Phục-truyền Luật-lệ Ký"],
      passageCount: 4,
    },
  ],
};

describe("<MoodBrowser />", () => {
  test("lọc theo từ khóa không dấu, tên sách và nhóm chủ đề không phát sinh cảnh báo Solid 2.0", async () => {
    const { artifact } = await captureArtifact(
      () => {
        const { container, getByRole } = render(() => <MoodBrowser index={SAMPLE} />);
        // 3 thẻ chính trong danh sách + 3 lối tắt "Hay tìm" khớp với SAMPLE
        expect(container.querySelectorAll("section a[href^='/cam-xuc/']")).toHaveLength(3);

        const input = getByRole("searchbox");
        fireEvent.input(input, { target: { value: "buon" } });
        flush();
        expect(container.querySelectorAll("section a[href^='/cam-xuc/']")).toHaveLength(1);
        expect(container.textContent).toContain("Buồn bã");

        fireEvent.input(input, { target: { value: "phi-lip" } });
        flush();
        expect(container.querySelectorAll("section a[href^='/cam-xuc/']")).toHaveLength(1);
        expect(container.textContent).toContain("Vui mừng");

        const clear = getByRole("button", { name: "Xóa lọc" });
        fireEvent.click(clear);
        flush();
        expect(container.querySelectorAll("section a[href^='/cam-xuc/']")).toHaveLength(3);

        const groupBtn = getByRole("button", { name: /Niềm vui/ });
        fireEvent.click(groupBtn);
        flush();
        expect(container.querySelectorAll("section a[href^='/cam-xuc/']")).toHaveLength(1);
        expect(container.textContent).toContain("Vui mừng");
      },
      { scenario: "mood-browser-filter" },
    );
    expectNoDiagnostics(artifact);
  });

  test("giữ từ khóa và nhóm trên URL để bấm quay lại không mất bộ lọc", async () => {
    window.history.replaceState(null, "", "/cam-xuc?q=buon");
    const { artifact } = await captureArtifact(
      () => {
        const { container, getByRole } = render(() => <MoodBrowser index={SAMPLE} />);
        flush();
        expect(container.querySelectorAll("section a[href^='/cam-xuc/']")).toHaveLength(1);
        expect((getByRole("searchbox") as HTMLInputElement).value).toBe("buon");

        fireEvent.input(getByRole("searchbox"), { target: { value: "" } });
        fireEvent.click(getByRole("button", { name: /Nỗi buồn/ }));
        flush();
        expect(window.location.search).toBe("?nhom=noi-buon");
        expect(container.querySelectorAll("section a[href^='/cam-xuc/']")).toHaveLength(2);
      },
      { scenario: "mood-browser-url" },
    );
    expectNoDiagnostics(artifact);
    window.history.replaceState(null, "", "/");
  });
});

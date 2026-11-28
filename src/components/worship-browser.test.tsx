import { captureArtifact } from "@solidjs/diagnostics";
import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, describe, expect, test } from "vitest";
import type { KtddDataset, ThanhCaDataset, TinDieuDataset, TvchhDataset } from "../../lib/worship/types";
import { expectNoSolidWarnings } from "./diagnostics-fixtures";
import { WorshipBrowser } from "./worship-browser";

afterEach(cleanup);

const TC_SAMPLE: ThanhCaDataset = {
  categories: [
    { roman: "I", title: "Thờ Phượng", ranges: "1–38", subtopics: [], description: "" },
    { roman: "II", title: "Đức Chúa Trời", ranges: "39–50", subtopics: [], description: "" },
  ],
  songs: [
    {
      number: 1,
      code: "TC 001",
      title: "Cúi Xin Vua Thánh Ngự Lai",
      categoryRoman: "I",
      category: "I. Thờ Phượng",
      scriptureRef: "Khải-huyền 4:8",
      karaokeId: "h5Ic2ro_bY4",
      mp3Url: "https://audio.httlvn.org/TC/thanh-ca/mp3/1.mp3",
      sheetUrl: "https://thanhca.httlvn.org/thanh-ca-1?op=sheet",
      stanzas: [{ label: "Câu 1", text: "Cúi xin Vua Thánh ngự lai,\nHộ tôi cung chúc danh Ngài;" }],
    },
    {
      number: 39,
      code: "TC 039",
      title: "Thánh Thay! Thánh Thay!",
      categoryRoman: "II",
      category: "II. Đức Chúa Trời",
      mp3Url: "https://audio.httlvn.org/TC/thanh-ca/mp3/39.mp3",
      sheetUrl: "https://thanhca.httlvn.org/thanh-ca-39?op=sheet",
      stanzas: [{ label: "Câu 1", text: "Thánh thay! Thánh thay! Thánh thay!" }],
    },
  ],
};

const TV_SAMPLE: TvchhDataset = {
  songs: [
    {
      number: 1,
      code: "TVCHH 001",
      title: "Xin Thần Linh Đến",
      karaokeId: "xRGWcRK7PcI",
      stanzas: [{ label: "Lời 1", text: "Từ cõi lòng sâu thẳm, con xin Thần Linh Chúa." }],
    },
  ],
};

const KTDD_SAMPLE: KtddDataset = {
  categories: ["Đức Chúa Trời & Sáng Tạo"],
  readings: [
    {
      number: 1,
      code: "001",
      title: "Đấng Tạo Hóa",
      category: "Đức Chúa Trời & Sáng Tạo",
      scriptureRefs: ["Sáng-thế Ký 1:1-6"],
      turns: [
        { role: "leader", text: "Ban đầu Đức Chúa Trời dựng nên trời đất." },
        { role: "congregation", text: "Vả, đất là vô hình và trống không." },
      ],
    },
  ],
};

const TIN_DIEU_SAMPLE: TinDieuDataset = {
  creed: {
    title: "Bài Tín Điều Các Sứ Đồ",
    citation: "Hiến chương Điều 76",
    liturgicalNote: "Hội chúng đồng đứng lên đọc chung.",
    verbatimText: "Tôi tin Đức Chúa Trời toàn năng là Cha.",
    clauses: [
      {
        id: "creed-01",
        order: 1,
        trinitySection: "Đức Chúa Cha",
        clause: "Tôi tin Đức Chúa Trời Toàn Năng là Cha.",
        doctrineTitle: "Đức Chúa Trời Ba Ngôi",
        explanation: "Xưng nhận Đức Chúa Trời hằng sống.",
        scriptureRefs: ["Sáng-thế Ký 1:1"],
        hienChuongRef: "Hiến chương Điều 56",
      },
    ],
  },
  liturgy: {
    lordsPrayer: {
      title: "Cầu Nguyện Chung",
      performer: "Hội Thánh",
      citation: "Ma-thi-ơ 6:9-13",
      note: "Đọc chung.",
      verbatimText: "Lạy Cha chúng con ở trên trời.",
    },
    benediction: {
      title: "Lời Chúc Phước",
      performer: "Mục sư",
      citation: "II Cô-rinh-tô 13:13",
      note: "Chúc phước tất lễ.",
      verbatimText: "Nguyền xin ơn của Đức Chúa Jêsus Christ.",
    },
  },
};

describe("<WorshipBrowser />", () => {
  test("chuyển 4 mục thờ phượng, lọc, tìm kiếm và bật trình chiếu không phát sinh cảnh báo Solid 2.0", async () => {
    window.history.replaceState(null, "", "/tho-phuong");
    const { artifact } = await captureArtifact(
      () => {
        const { container, getByRole } = render(() => (
          <WorshipBrowser
            thanhCa={TC_SAMPLE}
            tvchh={TV_SAMPLE}
            ktdd={KTDD_SAMPLE}
            tinDieu={TIN_DIEU_SAMPLE}
          />
        ));
        flush();

        expect(container.textContent).toContain("Cúi Xin Vua Thánh Ngự Lai");

        // Search by song number
        const searchBox = getByRole("searchbox");
        fireEvent.input(searchBox, { target: { value: "39" } });
        flush();
        expect(container.textContent).toContain("Thánh Thay! Thánh Thay!");

        // Open slide presentation
        fireEvent.click(getByRole("button", { name: "Chiếu" }));
        flush();
        expect(getByRole("dialog")).toBeTruthy();
        fireEvent.click(getByRole("button", { name: "Đóng trình chiếu" }));
        flush();

        // Toggle Beat player and add to Chương trình
        fireEvent.click(getByRole("button", { name: "Beat" }));
        flush();
        const audio = container.querySelector("audio");
        expect(audio?.getAttribute("src")).toBe("https://audio.httlvn.org/TC/thanh-ca/beat/1.mp3");

        fireEvent.click(getByRole("button", { name: "+ Chương trình" }));
        flush();
        expect(getByRole("button", { name: "✓ Chương trình" })).toBeTruthy();

        // Switch to TVCHH
        fireEvent.click(getByRole("tab", { name: /TVCHH/ }));
        flush();
        expect(container.textContent).toContain("Xin Thần Linh Đến");

        // Switch to KT đối đáp
        fireEvent.click(getByRole("tab", { name: /KT đối đáp/ }));
        flush();
        expect(container.textContent).toContain("Đấng Tạo Hóa");
        expect(container.textContent).toContain("Hướng dẫn");
        expect(container.textContent).toContain("Hội chúng");

        // Switch to Tín điều CSĐ and add to program
        fireEvent.click(getByRole("tab", { name: /Tín điều/ }));
        flush();
        expect(container.textContent).toContain("Bài Tín Điều Các Sứ Đồ");
        expect(container.textContent).toContain("Cầu Nguyện Chung");
        fireEvent.click(getByRole("button", { name: "+ Chương trình" }));
        flush();

        // Switch to Chương trình tab, reorder and clear
        fireEvent.click(getByRole("tab", { name: /Chương trình/ }));
        flush();
        expect(container.textContent).toContain("Cúi Xin Vua Thánh Ngự Lai");
        expect(container.textContent).toContain("Bài Tín Điều Các Sứ Đồ");
        fireEvent.click(getByRole("button", { name: "Xóa tất cả" }));
        flush();
        expect(container.textContent).toContain("Chưa có tiết mục nào");
      },
      { scenario: "worship-browser-tabs" },
    );
    expectNoSolidWarnings(artifact);
    window.history.replaceState(null, "", "/");
  });
});

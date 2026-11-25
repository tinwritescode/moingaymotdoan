import { useNavigate, type RouteDefinition } from "@solidjs/router";
import { createMemo } from "solid-js";
import { FloatingDock } from "../../components/floating-dock";
import { MoodBrowser } from "../../components/mood-browser";
import { Seo } from "../../components/seo";
import { SiteHeader } from "../../components/site-header";
import { getMoodIndex, getToc } from "../../data";
import { moodHref } from "../../router";

export const route = {
  preload: () => {
    void getToc();
    void getMoodIndex();
  },
} satisfies RouteDefinition;

/** Trang chọn đọc Kinh Thánh theo cảm xúc và chủ đề đời sống (100 chuyên mục). */
export default function CamXucPage() {
  const index = createMemo(() => getMoodIndex());
  const navigate = useNavigate();

  return (
    <>
      <Seo
        title="Đọc Kinh Thánh theo cảm xúc — 100 chủ đề | Mỗi Ngày Một Đoạn"
        description="Chọn tâm trạng hiện tại (lo âu, buồn bã, vui mừng, biết ơn, cần khôn ngoan...) để đọc ngay Lời Kinh Thánh Bản Truyền Thống 1926 và sao chép câu gốc."
        path="/cam-xuc"
      />
      <SiteHeader section="cam-xuc" />
      <MoodBrowser index={index()} onRandom={(slug) => navigate(moodHref(slug))} />
      <FloatingDock active="cam-xuc" />
    </>
  );
}

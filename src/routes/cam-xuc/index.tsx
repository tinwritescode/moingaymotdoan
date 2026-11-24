import { Title } from "@solidjs/meta";
import { useNavigate, type RouteDefinition } from "@solidjs/router";
import { createMemo } from "solid-js";
import { MoodBrowser } from "../../components/mood-browser";
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
      <Title>Đọc Kinh Thánh theo cảm xúc — 100 chuyên mục</Title>
      <SiteHeader>
        <nav aria-label="Vị trí" class="kt-crumbs flex gap-2 text-sm text-muted">
          <a href="/" class="hover:text-accent">
            Mục lục
          </a>
          <span aria-hidden="true">/</span>
          <span class="text-ink">Theo cảm xúc</span>
        </nav>
      </SiteHeader>
      <MoodBrowser index={index()} onRandom={(slug) => navigate(moodHref(slug))} />
    </>
  );
}

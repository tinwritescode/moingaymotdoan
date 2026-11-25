import { createMemo, For } from "solid-js";
import { localDateKey, type ReadingLog } from "../../lib/history/types";

/** Vòng tròn tiến độ SVG mềm mại (dùng cho thẻ Xem tiếp và thanh tiến độ đọc). */
export function ProgressRing(props: { radius: number; percent: number; strokeWidth?: number; class?: string }) {
  const sw = () => props.strokeWidth ?? (props.radius > 20 ? 5.5 : 3.2);
  const size = () => props.radius * 2 + sw() * 2;
  const center = () => size() / 2;
  const circumference = () => 2 * Math.PI * props.radius;
  const clamped = () => Math.max(0, Math.min(100, props.percent));
  const offset = () => circumference() * (1 - clamped() / 100);

  return (
    <svg viewBox={`0 0 ${size()} ${size()}`} aria-hidden="true" class={props.class ?? "h-full w-full"}>
      <circle cx={center()} cy={center()} r={props.radius} fill="none" stroke="var(--rule)" stroke-width={sw()} />
      <circle
        cx={center()}
        cy={center()}
        r={props.radius}
        fill="none"
        stroke="var(--accent)"
        stroke-width={sw()}
        stroke-linecap="round"
        stroke-dasharray={circumference().toFixed(1)}
        stroke-dashoffset={offset().toFixed(1)}
        transform={`rotate(-90 ${center()} ${center()})`}
        class="transition-[stroke-dashoffset] duration-200 motion-reduce:transition-none"
      />
    </svg>
  );
}

/** 7 chấm nhỏ biểu thị 7 ngày gần nhất (từ 6 ngày trước đến hôm nay). */
export function WeeklyDots(props: { logs: ReadingLog[] }) {
  const dots = createMemo(() => {
    const readDays = new Set(props.logs.map((l) => l.readDate));
    const today = new Date();
    const out: { key: string; active: boolean }[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = localDateKey(d);
      out.push({ key, active: readDays.has(key) });
    }
    return out;
  });

  return (
    <span class="mt-2 flex gap-1" aria-hidden="true">
      <For each={dots()}>
        {(d) => <i class={["block h-[7px] w-[7px] rounded-full", d.active ? "bg-accent" : "bg-rule"]} />}
      </For>
    </span>
  );
}

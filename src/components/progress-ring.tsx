import { For } from "solid-js";
import { useStreak } from "./streak-context";

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

/** 7 chấm nhỏ cho tuần này, Thứ Hai đến Chủ Nhật: đậm khi đã đọc, nhạt khi nghỉ Sa-bát hay thắp lại. */
export function WeeklyDots() {
  const streak = useStreak();
  return (
    <span class="mt-2 flex gap-1" aria-hidden="true">
      <For each={streak.week()}>
        {(d) => (
          <i
            class={[
              "block h-[7px] w-[7px] rounded-full",
              d.mark === "read" ? "bg-accent" : d.mark === "rest" || d.mark === "rekindled" ? "bg-accent/45" : "bg-rule",
            ]}
          />
        )}
      </For>
    </span>
  );
}

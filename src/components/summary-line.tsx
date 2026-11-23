import type { Summary } from "../../lib/content";

/** Nháp only: the confidence counts of one ghi chú. */
export function SummaryLine(props: { summary: Summary }) {
  return (
    <span class="font-sans text-xs text-muted">
      <span class="text-cao">Cao {props.summary.cao}</span> · <span class="text-vua">Vừa {props.summary.vua}</span> ·{" "}
      <span class="text-thap">Thấp {props.summary.thap}</span> · Đã đối chiếu {props.summary.verified}/
      {props.summary.total}
    </span>
  );
}

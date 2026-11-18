import type { Summary } from "@/lib/content";

/** Nháp only: the confidence counts of one ghi chú. */
export function SummaryLine(props: { summary: Summary }) {
  const s = props.summary;
  return (
    <span className="font-sans text-xs text-muted">
      <span className="text-cao">Cao {s.cao}</span> · <span className="text-vua">Vừa {s.vua}</span> ·{" "}
      <span className="text-thap">Thấp {s.thap}</span> · Đã đối chiếu {s.verified}/{s.total}
    </span>
  );
}

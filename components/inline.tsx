import type { Inline } from "@/lib/content";
import { RefButton } from "./ref-button";

/** Renders the parsed inline nodes of a ghi chú paragraph. */
export function InlineText(props: { nodes: Inline[] }) {
  return props.nodes.map((n, i) => {
    switch (n.kind) {
      case "text":
        return n.text;
      case "strong":
        return (
          <strong key={i}>
            <InlineText nodes={n.children} />
          </strong>
        );
      case "em":
        return (
          <em key={i}>
            <InlineText nodes={n.children} />
          </em>
        );
      case "thap":
        return (
          <mark key={i} title={`Mức Thấp: ${n.reason}`} className="rounded-sm bg-mark px-0.5 text-inherit">
            <InlineText nodes={n.children} />
          </mark>
        );
      case "refs":
        return (
          <span key={i}>
            (
            {n.parts.map((p, j) => (
              <span key={j}>
                {j > 0 && "; "}
                {p.lead}
                <RefButton reference={p.ref} />
              </span>
            ))}
            )
          </span>
        );
      default: {
        const _exhaustive: never = n;
        return _exhaustive;
      }
    }
  });
}

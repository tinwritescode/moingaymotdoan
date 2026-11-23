import type { JSX } from "@solidjs/web";
import { For } from "solid-js";
import type { Inline } from "../../lib/content";
import { RefButton } from "./ref-button";

function node(n: Inline): JSX.Element {
  switch (n.kind) {
    case "text":
      return n.text;
    case "strong":
      return (
        <strong>
          <InlineText nodes={n.children} />
        </strong>
      );
    case "em":
      return (
        <em>
          <InlineText nodes={n.children} />
        </em>
      );
    case "thap":
      return (
        <mark title={`Mức Thấp: ${n.reason}`} class="rounded-sm bg-mark px-0.5 text-inherit">
          <InlineText nodes={n.children} />
        </mark>
      );
    case "refs":
      return (
        <span>
          (
          <For each={n.parts}>
            {(p, j) => (
              <span>
                {j() > 0 && "; "}
                {p.lead}
                <RefButton reference={p.ref} />
              </span>
            )}
          </For>
          )
        </span>
      );
    default: {
      const _exhaustive: never = n;
      return _exhaustive;
    }
  }
}

/** Renders the parsed inline nodes of a ghi chú paragraph. */
export function InlineText(props: { nodes: Inline[] }) {
  return <For each={props.nodes}>{(n) => node(n)}</For>;
}

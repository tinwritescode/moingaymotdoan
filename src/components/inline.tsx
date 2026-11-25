import type { JSX } from "@solidjs/web";
import { For } from "solid-js";
import type { Inline } from "../../lib/content";
import { useLocale } from "./locale-context";
import { RefButton } from "./ref-button";

function ThapMark(props: { reason: string; children: Inline[] }) {
  const { t } = useLocale();
  return (
    <mark
      title={`${t().chapter.lowConfidencePrefix} ${props.reason}`}
      class="rounded-sm bg-mark px-0.5 text-inherit"
    >
      <InlineText nodes={props.children} />
    </mark>
  );
}

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
      return <ThapMark reason={n.reason} children={n.children} />;
    case "refs":
      return (
        <span class={n.parts.length === 1 && !n.parts[0].lead ? "whitespace-nowrap" : undefined}>
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

/** Renders the parsed inline nodes of a chapter note paragraph. */
export function InlineText(props: { nodes: Inline[] }) {
  return <For each={props.nodes}>{(n) => node(n)}</For>;
}

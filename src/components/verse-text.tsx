import { For } from "solid-js";
import type { Verse } from "../../lib/content";

/** Verses run together as one passage, each with its number raised. */
export function VerseText(props: { verses: Verse[] }) {
  return (
    <For each={props.verses}>
      {(v) => (
        <span>
          <sup class="kt-verse-number mr-0.5 font-sans text-[0.7rem] text-muted">{v.number}</sup>
          {v.text}{" "}
        </span>
      )}
    </For>
  );
}

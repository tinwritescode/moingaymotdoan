import type { Verse } from "@/lib/content";

/** "1:3" or "1:3–13". */
export function verseLabel(args: { chapter: number; verses: Verse[] }) {
  const from = args.verses[0].number;
  const to = args.verses[args.verses.length - 1].number;
  return `${args.chapter}:${from}${to > from ? `–${to}` : ""}`;
}

/** Verses run together as one passage, each with its number raised. */
export function VerseText(props: { verses: Verse[] }) {
  return props.verses.map((v) => (
    <span key={v.number}>
      <sup className="mr-0.5 font-sans text-[0.7rem] text-muted">{v.number}</sup>
      {v.text}{" "}
    </span>
  ));
}

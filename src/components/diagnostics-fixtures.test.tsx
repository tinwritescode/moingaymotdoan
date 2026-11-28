import { captureArtifact } from "@solidjs/diagnostics";
import { render } from "@solidjs/testing-library";
import { createSignal, onSettled } from "solid-js";
import { expect, test } from "vitest";
import { expectNoSolidWarnings } from "./diagnostics-fixtures";

function Slow() {
  onSettled(() => {
    const end = performance.now() + 20;
    while (performance.now() < end);
  });
  return <p>slow</p>;
}

// The bad read is the point: Solid must still report it.
function ReadsInBody() {
  // oxlint-disable-next-line solid/no-unused-signal -- a fixed signal is enough to read.
  const [n] = createSignal(1);
  // oxlint-disable-next-line solid/reactivity -- the untracked read under test.
  const once = n();
  return <p>{once}</p>;
}

test("a component that only runs slow, as on a busy test machine, passes", async () => {
  const { artifact } = await captureArtifact(() => render(() => <Slow />));
  expect(artifact.diagnostics.map((d) => d.code)).toContain("HOT_SCOPE_TIME");
  expectNoSolidWarnings(artifact);
});

test("a signal read in the component body still fails", async () => {
  const { artifact } = await captureArtifact(() => render(() => <ReadsInBody />));
  expect(() => expectNoSolidWarnings(artifact)).toThrow(/STRICT_READ_UNTRACKED/u);
});

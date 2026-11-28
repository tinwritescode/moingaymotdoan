import { expectNoDiagnostics } from "@solidjs/diagnostics";

type Artifact = Parameters<typeof expectNoDiagnostics>[0];

/** The tests' correctness gate: every Solid warning fails it except stopwatch ones, which vary with machine load. */
export function expectNoSolidWarnings(artifact: Artifact): void {
  expectNoDiagnostics(artifact, { allow: ["HOT_SCOPE_TIME"] });
}

import { describe, expect, it } from "vitest";
import { flameFor, flameSvg, isMilestone, nextMilestone } from "./flames";

describe("flames", () => {
  it("earns the flame of the highest milestone reached", () => {
    expect(flameFor(1).kind).toBe("nen");
    expect(flameFor(7).kind).toBe("den-dau");
    expect(flameFor(23).kind).toBe("den-dau");
    expect(flameFor(30).kind).toBe("duoc");
    expect(flameFor(400).kind).toBe("tru-lua");
  });

  it("reports the next milestone and the days left", () => {
    expect(nextMilestone(23)).toMatchObject({ flame: { kind: "duoc", at: 30 }, left: 7 });
    expect(nextMilestone(0)).toMatchObject({ flame: { kind: "nen" }, left: 1 });
    expect(nextMilestone(400)).toBeNull();
  });

  it("marks the exact milestone days after day 1", () => {
    expect([1, 7, 8, 30, 365].map(isMilestone)).toEqual([false, true, false, true, true]);
  });

  it("draws the flame lit, guttering, or out with smoke", () => {
    const lit = flameSvg("den-dau", "lit");
    expect(lit).toContain("#c9962f");
    expect(lit).not.toContain("#7d847c");
    expect(flameSvg("den-dau", "dim")).toContain("scale(0.55)");
    const out = flameSvg("den-dau", "out");
    expect(out).not.toContain("#c9962f");
    expect(out).toContain("#7d847c");
  });
});

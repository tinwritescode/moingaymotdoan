// The six flames a streak earns, drawn on a 64×64 viewBox. The same drawings made the Lottie files in
// public/lottie/ (scripts/flame-lottie.cjs), so the static and animated flames match.

export type FlameKind = "nen" | "den-dau" | "duoc" | "chan-den" | "bui-gai" | "tru-lua";
/** lit: burning; dim: guttering (streak at risk); out: gone out with smoke (day missed). */
export type FlameState = "lit" | "dim" | "out";

type SubFlame = { base: [number, number]; markup: string };
type Flame = { kind: FlameKind; at: number; name: { vi: string; en: string }; flames: SubFlame[]; smoke: string; body: string };

const GOLD = "#c9962f";
const ORANGE = "#d9822b";
const LIGHT = "#f2d48a";
const SMOKE = 'fill="none" stroke="#7d847c" stroke-width="1.6" stroke-linecap="round"';

const path = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const branch = (x: number): SubFlame => ({
  base: [x, 20],
  markup: path(`M${x} 9c2 3 3.5 5 3.5 7.5a3.5 3.5 0 0 1-7 0c0-2.5 1.5-4.5 3.5-7.5z`, GOLD),
});

/** Ordered by milestone. */
export const FLAMES: readonly Flame[] = [
  {
    kind: "nen",
    at: 1,
    name: { vi: "Ngọn nến", en: "Candle" },
    flames: [
      {
        base: [32, 25],
        markup:
          path("M32 4c4 6 7 9 7 14a7 7 0 0 1-14 0c0-5 3-8 7-14z", "#e0ab3c") +
          path("M32 12c2 3 3.5 4.5 3.5 7a3.5 3.5 0 0 1-7 0c0-2.5 1.5-4 3.5-7z", "#f7e2a6"),
      },
    ],
    smoke: `<path d="M32 23c-3-4 3-6 0-10s3-6 0-10" ${SMOKE}/>`,
    body:
      '<path d="M32 25v6" stroke="#2b2e2a" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="25" y="31" width="14" height="23" rx="2" fill="#fbfaf6" stroke="#4d7059" stroke-width="1.8"/>' +
      '<path d="M28 31v6a1.5 1.5 0 0 0 3 0v-6" fill="#fbfaf6" stroke="#4d7059" stroke-width="1.5"/>' +
      '<rect x="17" y="54" width="30" height="5" rx="2.5" fill="#4d7059"/>',
  },
  {
    kind: "den-dau",
    at: 7,
    name: { vi: "Đèn dầu", en: "Oil lamp" },
    flames: [
      {
        base: [32, 34],
        markup:
          path("M32 2c7 9 11 13 11 21a11 11 0 0 1-22 0c0-8 4-12 11-21z", GOLD) +
          path("M32 13c3.5 4.5 6 7 6 10.5a6 6 0 0 1-12 0c0-3.5 2.5-6 6-10.5z", LIGHT),
      },
    ],
    smoke: `<path d="M32 31c-3-4 3-6 0-10s3-6 0-10" ${SMOKE}/>`,
    body:
      '<path d="M32 33v5" stroke="#2b2e2a" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M8 38h48c0 9-10 14-24 14S8 47 8 38z" fill="#4d7059"/>' +
      '<rect x="24" y="53" width="16" height="5" rx="2.5" fill="#4d7059"/>',
  },
  {
    kind: "duoc",
    at: 30,
    name: { vi: "Ngọn đuốc", en: "Torch" },
    flames: [
      {
        base: [32, 36],
        markup:
          path("M32 2c2 6 8 8 8 16 2-1 3-3 3-5 3 4 4 7 4 10a15 15 0 0 1-30 0c0-3 1-6 4-9 0 2 1 4 3 5 0-8 6-10 8-17z", ORANGE) +
          path("M32 14c2 4 6 6 6 11a6 6 0 0 1-12 0c0-4 4-6 6-11z", LIGHT),
      },
    ],
    smoke: `<path d="M32 31c-3-4 3-6 0-10s3-6 0-10" ${SMOKE}/>`,
    body:
      '<path d="M25 37h14l-4 23h-6z" fill="#8b6f26"/>' +
      '<rect x="23" y="33" width="18" height="6" rx="1.5" fill="#4d7059"/>' +
      '<path d="M27 45h10M26.5 51h11" stroke="#4d7059" stroke-width="1.6" stroke-linecap="round"/>',
  },
  {
    kind: "chan-den",
    at: 100,
    name: { vi: "Chân đèn bảy nhánh", en: "Lampstand" },
    flames: [
      branch(8),
      branch(16),
      branch(24),
      { base: [32, 18], markup: path("M32 6c2.5 3.5 4 6 4 8.5a4 4 0 0 1-8 0c0-2.5 1.5-5 4-8.5z", GOLD) },
      branch(40),
      branch(48),
      branch(56),
    ],
    smoke: `<path d="M32 17c-3-4 3-6 0-10s3-6 0-8M16 19c-2-3 2-4 0-7M48 19c-2-3 2-4 0-7" ${SMOKE}/>`,
    body:
      '<path d="M32 21v32M24 21v5a8 8 0 0 0 16 0v-5M16 21v5a16 16 0 0 0 32 0v-5M8 21v5a24 24 0 0 0 48 0v-5" fill="none" stroke="#8b6f26" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M24 60h16l-4-7h-8z" fill="#8b6f26"/>',
  },
  {
    kind: "bui-gai",
    at: 200,
    name: { vi: "Bụi gai cháy", en: "Burning bush" },
    flames: [
      { base: [20, 33], markup: path("M20 14c3 5 6 8 6 13a6 6 0 0 1-12 0c0-5 3-8 6-13z", ORANGE) },
      { base: [44, 33], markup: path("M44 14c3 5 6 8 6 13a6 6 0 0 1-12 0c0-5 3-8 6-13z", ORANGE) },
      {
        base: [32, 29],
        markup:
          path("M32 2c4.5 7 9 11 9 18a9 9 0 0 1-18 0c0-7 4.5-11 9-18z", ORANGE) +
          path("M32 11c2.5 4 4.5 6 4.5 9.5a4.5 4.5 0 0 1-9 0c0-3.5 2-5.5 4.5-9.5z", LIGHT),
      },
    ],
    smoke: `<path d="M32 27c-3-4 3-6 0-10s3-6 0-10" ${SMOKE}/>`,
    body:
      '<circle cx="20" cy="42" r="10" fill="#4d7059"/><circle cx="44" cy="42" r="10" fill="#4d7059"/>' +
      '<circle cx="32" cy="38" r="12" fill="#3d6d4d"/>' +
      '<path d="M28 60l2-10M36 60l-2-10" stroke="#2b2e2a" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M14 60h36" stroke="#8b6f26" stroke-width="2" stroke-linecap="round"/>',
  },
  {
    kind: "tru-lua",
    at: 365,
    name: { vi: "Trụ lửa", en: "Pillar of fire" },
    flames: [
      {
        base: [32, 59],
        markup:
          path("M32 2c6 6 10 12 10 20 0 6-3 9-3 14s4 8 4 13c0 6-5 10-11 10s-11-4-11-10c0-5 4-8 4-13s-3-8-3-14c0-8 4-14 10-20z", ORANGE) +
          path("M32 12c3 4 5 7 5 12 0 4-2 7-2 11s2 7 2 11c0 4-2 7-5 7s-5-3-5-7c0-4 2-7 2-11s-2-7-2-11c0-5 2-8 5-12z", LIGHT),
      },
    ],
    smoke: `<path d="M32 58c-3-4 3-6 0-10s3-6 0-10s3-6 0-10" ${SMOKE}/>`,
    body: '<path d="M12 61h40" stroke="#8b6f26" stroke-width="2" stroke-linecap="round"/>',
  },
];

/** The flame a streak of `days` has earned (Ngọn nến below 1 too, shown out). */
export function flameFor(days: number): Flame {
  return FLAMES.findLast((f) => f.at <= days) ?? FLAMES[0];
}

/** The next flame to earn and the days left, or null past the last milestone. */
export function nextMilestone(days: number): { flame: Flame; left: number } | null {
  const flame = FLAMES.find((f) => f.at > days);
  return flame ? { flame, left: flame.at - days } : null;
}

/** True on the exact day a new flame is earned (day 1 is the start, not a milestone). */
export function isMilestone(days: number): boolean {
  return days > 1 && FLAMES.some((f) => f.at === days);
}

export function flameByKind(kind: FlameKind): Flame {
  return FLAMES.find((f) => f.kind === kind) ?? FLAMES[0];
}

/** Standalone SVG markup of a flame, for the page, the share card's canvas and as the Lottie fallback. */
export function flameSvg(kind: FlameKind, state: FlameState): string {
  const f = flameByKind(kind);
  const flames =
    state === "out"
      ? ""
      : f.flames
          .map(({ base: [x, y], markup }) =>
            state === "dim"
              ? `<g transform="translate(${x} ${y}) rotate(-6) scale(0.55) translate(${-x} ${-y})" opacity="0.85">${markup}</g>`
              : markup,
          )
          .join("");
  const smoke = state === "out" ? f.smoke.replace("/>", ' opacity="0.7"/>') : "";
  const body = state === "out" ? `<g style="filter:grayscale(1)" opacity="0.75">${f.body}</g>` : f.body;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">${flames}${smoke}${body}</svg>`;
}

/** The flame as an image URL, for <img> and for drawing on a canvas. */
export const flameDataUrl = (kind: FlameKind, state: FlameState) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(flameSvg(kind, state))}`;

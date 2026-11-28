// Turns the six flame drawings from the Design canvas (Flame.dc.html, 64×64 viewBox) into Lottie files:
//   <slug>.json       a 2 s flicker loop
//   <slug>-thap.json     a 2 s one-shot ignition (spark, burst, embers) that ends on the loop's first frame,
//                        so a player can switch to the loop file without a jump.
//   <slug>-leo-let.json  a 2 s loop of a small guttering flame that nearly dies once per loop (streak at risk).
//   <slug>-tat.json      a 2.5 s one-shot that starts on the guttering loop's first frame, sputters out and leaves
//                        smoke; it ends with no flame (streak lost).
// Usage: node scripts/flame-lottie.cjs public/lottie   (the drawings match lib/streak/flames.ts; change both together)
const svgpath = require('svgpath');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const MODES = [['loop', '', 60], ['ignite', '-thap', 60], ['dim', '-leo-let', 60], ['out', '-tat', 75]]; // mode, file suffix, frames at 30 fps
let FR = 60; // frames in the file being built
const SCALE = 8; // 64 → 512 px composition

const C = {
  gold: '#c9962f', goldLight: '#f2d48a', candle: '#e0ab3c', candleLight: '#f7e2a6', orange: '#d9822b',
  ink: '#2b2e2a', accent: '#4d7059', card: '#fbfaf6', brass: '#8b6f26', moss: '#3d6d4d',
};
const r3 = (n) => Math.round(n * 1000) / 1000;
const rgb = (h) => [1, 3, 5].map((i) => r3(parseInt(h.slice(i, i + 2), 16) / 255)).concat(1);
const still = (k) => ({ a: 0, k });

/** SVG path data → Lottie bezier shapes (one per subpath). */
function toBeziers(d) {
  const segs = svgpath(d).abs().unarc().unshort().segments;
  const subs = [];
  let s = null, px = 0, py = 0;
  const add = (x, y) => { s.v.push([r3(x), r3(y)]); s.i.push([0, 0]); s.o.push([0, 0]); px = x; py = y; };
  for (const seg of segs) {
    const c = seg[0];
    if (c === 'M') { s = { v: [], i: [], o: [], c: false }; subs.push(s); add(seg[1], seg[2]); }
    else if (c === 'L') add(seg[1], seg[2]);
    else if (c === 'H') add(seg[1], py);
    else if (c === 'V') add(px, seg[1]);
    else if (c === 'C') {
      s.o[s.v.length - 1] = [r3(seg[1] - px), r3(seg[2] - py)];
      const [x, y] = [seg[5], seg[6]];
      add(x, y);
      s.i[s.v.length - 1] = [r3(seg[3] - x), r3(seg[4] - y)];
    } else if (c === 'Q') {
      const [qx, qy, x, y] = seg.slice(1);
      s.o[s.v.length - 1] = [r3((2 / 3) * (qx - px)), r3((2 / 3) * (qy - py))];
      add(x, y);
      s.i[s.v.length - 1] = [r3((2 / 3) * (qx - x)), r3((2 / 3) * (qy - y))];
    } else if (c === 'Z') {
      s.c = true;
      const n = s.v.length, a = s.v[0], b = s.v[n - 1];
      if (n > 1 && Math.abs(a[0] - b[0]) < 1e-3 && Math.abs(a[1] - b[1]) < 1e-3) {
        s.i[0] = s.i[n - 1]; s.v.pop(); s.i.pop(); s.o.pop();
      }
      [px, py] = s.v[0];
    } else throw new Error(`unsupported segment ${c} in ${d}`);
  }
  return subs;
}

const tr = ({ p = still([0, 0]), a = [0, 0], s = still([100, 100]), r = still(0), o = still(100) } = {}) =>
  ({ ty: 'tr', p: Array.isArray(p) ? still(p) : p, a: still(a), s, r, o, sk: still(0), sa: still(0) });

function geometry(el) {
  if (el.d) return toBeziers(el.d).map((b) => ({ ty: 'sh', ks: still(b) }));
  if (el.rect) { const [x, y, w, h, rr = 0] = el.rect; return [{ ty: 'rc', d: 1, p: still([x + w / 2, y + h / 2]), s: still([w, h]), r: still(rr) }]; }
  if (el.circle) { const [cx, cy, rr] = el.circle; return [{ ty: 'el', d: 1, p: still([cx, cy]), s: still([2 * rr, 2 * rr]) }]; }
  throw new Error('unknown element');
}

/** One drawn element as a Lottie group. Stroke is listed before fill so it paints on top, as in SVG. */
function group(el, { fillOpacity, transform } = {}) {
  const it = geometry(el);
  if (el.stroke) it.push({ ty: 'st', c: still(rgb(el.stroke)), o: still(100), w: still(el.sw ?? 1.5), lc: el.cap === 'round' ? 2 : 1, lj: 2, ml: 4 });
  if (el.fill) it.push({ ty: 'fl', c: still(rgb(el.fill)), o: fillOpacity ?? still(100), r: 1 });
  it.push(tr(transform));
  return { ty: 'gr', nm: el.nm ?? 'shape', it };
}

// Keyframes. `keys` takes [frame, value] pairs (frames clamped to the file); `loop` spreads a cycle evenly and closes it.
const EASE = { i: { x: [0.45], y: [1] }, o: { x: [0.55], y: [0] } };
const keys = (pairs) => {
  const k = pairs.map(([t, s]) => ({ t: Math.min(FR, Math.round(t)), s: Array.isArray(s) ? s : [s] }));
  return { a: 1, k: k.map((f, j) => (j < k.length - 1 ? { ...f, ...EASE } : f)) };
};
const loop = (vals) => keys([...vals, vals[0]].map((v, j) => [(j * FR) / vals.length, v]));
const rotate = (arr, k) => { k %= arr.length; return arr.slice(k).concat(arr.slice(0, k)); };
const SCALE_STEPS = [[100, 100], [96, 107], [103, 97], [97, 105], [102, 99]];
const TILT_STEPS = [0, -3, 2, -2, 3];
const GLOW_OPACITY = [16, 28, 20, 26, 18];
const GLOW_SCALE = [100, 108, 102, 106, 100];

// Guttering: a small flame, twisting more, that dips almost to nothing on the fourth beat.
const DIM_STEPS = [[55, 52], [48, 58], [58, 50], [30, 34], [50, 56], [54, 50]];
const DIM_INNER = [[60, 60], [50, 64], [66, 56], [20, 24], [56, 60], [62, 58]];
const DIM_TILT = [0, -6, 4, -2, 5, -3];
const DIM_GLOW_OPACITY = [10, 6, 12, 3, 9, 7];
const DIM_GLOW_SCALE = [85, 80, 88, 70, 84, 82];

function flicker(f) {
  const amp = f.amp ?? 1, ph = f.phase ?? 0, tilt = f.tilt ?? 1;
  const scales = (k) => rotate(SCALE_STEPS, k).map(([x, y]) => [r3(100 + (x - 100) * amp), r3(100 + (y - 100) * amp)]);
  return {
    outer: scales(ph), inner: scales(ph + 2), tilt: rotate(TILT_STEPS, ph).map((v) => v * tilt),
    dimOuter: rotate(DIM_STEPS, ph), dimInner: rotate(DIM_INNER, ph + 2), dimTilt: rotate(DIM_TILT, ph).map((v) => v * tilt),
  };
}

/** Per-mode keyframes for a flame's outer scale, core scale and tilt. `d` delays a flame within the drawing. */
function flameMotion(fl, mode, d, tilt) {
  switch (mode) {
    case 'loop': return { outer: loop(fl.outer), inner: loop(fl.inner), tilt: loop(fl.tilt) };
    case 'dim': return { outer: loop(fl.dimOuter), inner: loop(fl.dimInner), tilt: loop(fl.dimTilt) };
    case 'ignite': return {
      outer: keys([[0, [0, 0]], [d + 8, [0, 0]], [d + 20, [70, 118]], [d + 28, [118, 106]], [d + 36, [95, 99]], [d + 44, fl.outer[0]]]),
      inner: keys([[0, [0, 0]], [d + 12, [0, 0]], [d + 26, [120, 120]], [d + 44, fl.inner[0]]]),
      tilt: keys([[0, 0], [d + 8, 0], [d + 20, -4 * tilt], [d + 30, 3 * tilt], [d + 44, fl.tilt[0]]]),
    };
    case 'out': return {
      outer: keys([[0, fl.dimOuter[0]], [d + 6, [44, 62]], [d + 12, [58, 48]], [d + 18, [34, 40]], [d + 24, [46, 52]], [d + 32, [10, 14]], [d + 36, [0, 0]]]),
      inner: keys([[0, fl.dimInner[0]], [d + 16, [40, 40]], [d + 28, [0, 0]]]),
      tilt: keys([[0, fl.dimTilt[0]], [d + 8, -6 * tilt], [d + 16, 5 * tilt], [d + 24, -4 * tilt], [d + 34, 0]]),
    };
  }
  throw new Error(`unknown mode ${mode}`);
}

/** A flame (outer + optional inner core) animated for one mode: flicker, ignite, gutter, or go out. */
function flame(f, mode) {
  const d = f.delay ?? 0;
  const m = flameMotion(flicker(f), mode, d, f.tilt ?? 1);
  const parts = [];
  if (f.inner) parts.push(group({ d: f.inner, fill: f.innerFill, nm: 'inner' }, { transform: { p: f.base, a: f.base, s: m.inner } }));
  parts.push(group({ d: f.outer, fill: f.outerFill, nm: 'outer' }));
  const out = [{ ty: 'gr', nm: 'flame', it: [...parts, tr({ p: f.base, a: f.base, s: m.outer, r: m.tilt })] }];
  if (mode === 'ignite') out.push(spark(f.base, d));
  if (mode === 'ignite' && f.embers !== false) out.push(...embers(f, d));
  if (mode === 'out') out.push(...smoke(f, d));
  return out;
}

/** Grey wisps that rise from the wick once the flame is gone and fade away. Small flames get one, the rest two. */
function smoke(f, d) {
  const [x, y] = f.base;
  const wisps = f.embers === false ? [[0, 0.6]] : [[0, 1], [5, 0.8]];
  return wisps.map(([lag, size], j) => {
    const s = d + 32 + lag;
    const from = [x + (j ? 2 : 0), y - 4], to = [x + (j ? 5 : 2), y - 4 - 20 * size];
    return group(
      { d: 'M0 0c-2-3 2-5 0-8s2-5 0-8', stroke: '#7d847c', sw: 1.4, cap: 'round', nm: 'smoke' },
      {
        transform: {
          p: keys([[0, from], [s, from], [s + 30, to]]),
          s: keys([[0, [80 * size, 80 * size]], [s, [80 * size, 80 * size]], [s + 30, [130 * size, 130 * size]]]),
          o: keys([[0, 0], [s, 0], [s + 6, 70], [s + 30, 0]]),
        },
      },
    );
  });
}

/** The small bright dot the flame grows out of. */
function spark([x, y], d) {
  const at = [x, y - 3];
  return group(
    { circle: [at[0], at[1], 2.4], fill: C.goldLight, nm: 'spark' },
    { transform: { p: at, a: at, s: keys([[0, [0, 0]], [d + 6, [150, 150]], [d + 14, [70, 70]], [d + 18, [0, 0]]]) } },
  );
}

/** Six sparks thrown up and out as the flame bursts, fading as they go. */
function embers(f, d) {
  const top = Math.min(...toBeziers(f.outer).flatMap((b) => b.v.map((v) => v[1])));
  const from = [f.base[0], (f.base[1] + top) / 2];
  return [-160, -125, -100, -80, -55, -20].map((deg, j) => {
    const dist = (j % 2 ? 16 : 12) * (f.amp ?? 1);
    const rad = (deg * Math.PI) / 180;
    const to = [r3(from[0] + Math.cos(rad) * dist), r3(from[1] + Math.sin(rad) * dist)];
    const start = d + 22 + (j % 3) * 2;
    return group(
      { circle: [0, 0, 1.4], fill: j % 2 ? C.goldLight : C.gold, nm: 'ember' },
      {
        fillOpacity: keys([[0, 0], [start - 1, 0], [start, 100], [start + 24, 0]]),
        transform: { p: keys([[0, from], [start, from], [start + 24, to]]), s: keys([[0, [100, 100]], [start, [100, 100]], [start + 24, [30, 30]]]) },
      },
    );
  });
}

function glow([cx, cy, rr], mode) {
  const sq = (v) => [v, v];
  const [opacity, scale] = {
    loop: () => [loop(GLOW_OPACITY.map((v) => [v])), loop(GLOW_SCALE.map(sq))],
    dim: () => [loop(DIM_GLOW_OPACITY.map((v) => [v])), loop(DIM_GLOW_SCALE.map(sq))],
    ignite: () => [keys([[0, 0], [18, 0], [30, 45], [50, GLOW_OPACITY[0]]]), keys([[0, sq(40)], [16, sq(40)], [32, sq(130)], [50, sq(GLOW_SCALE[0])]])],
    out: () => [keys([[0, DIM_GLOW_OPACITY[0]], [20, 8], [36, 0]]), keys([[0, sq(DIM_GLOW_SCALE[0])], [36, sq(50)]])],
  }[mode]();
  return group({ circle: [cx, cy, rr], fill: C.gold, nm: 'glow' }, { fillOpacity: opacity, transform: { p: [cx, cy], a: [cx, cy], s: scale } });
}

const candleFlame = (x, y) => `M${x} ${y}c2 3 3.5 5 3.5 7.5a3.5 3.5 0 0 1-7 0c0-2.5 1.5-4.5 3.5-7.5z`;

// Each drawing back to front, matching Flame.dc.html.
const KINDS = (m) => ({
  'nen': ['Ngọn nến', [
    glow([32, 16, 13], m),
    ...flame({ base: [32, 25], outer: 'M32 4c4 6 7 9 7 14a7 7 0 0 1-14 0c0-5 3-8 7-14z', outerFill: C.candle, inner: 'M32 12c2 3 3.5 4.5 3.5 7a3.5 3.5 0 0 1-7 0c0-2.5 1.5-4 3.5-7z', innerFill: C.candleLight }, m),
    group({ d: 'M32 25v6', stroke: C.ink, sw: 2, cap: 'round' }),
    group({ rect: [25, 31, 14, 23, 2], fill: C.card, stroke: C.accent, sw: 1.8 }),
    group({ d: 'M28 31v6a1.5 1.5 0 0 0 3 0v-6', fill: C.card, stroke: C.accent, sw: 1.5 }),
    group({ rect: [17, 54, 30, 5, 2.5], fill: C.accent }),
  ]],
  'den-dau': ['Đèn dầu', [
    glow([32, 22, 16], m),
    ...flame({ base: [32, 34], outer: 'M32 2c7 9 11 13 11 21a11 11 0 0 1-22 0c0-8 4-12 11-21z', outerFill: C.gold, inner: 'M32 13c3.5 4.5 6 7 6 10.5a6 6 0 0 1-12 0c0-3.5 2.5-6 6-10.5z', innerFill: C.goldLight }, m),
    group({ d: 'M32 33v5', stroke: C.ink, sw: 2, cap: 'round' }),
    group({ d: 'M8 38h48c0 9-10 14-24 14S8 47 8 38z', fill: C.accent }),
    group({ rect: [24, 53, 16, 5, 2.5], fill: C.accent }),
  ]],
  'duoc': ['Ngọn đuốc', [
    glow([32, 20, 18], m),
    ...flame({ base: [32, 36], amp: 1.3, tilt: 1.3, outer: 'M32 2c2 6 8 8 8 16 2-1 3-3 3-5 3 4 4 7 4 10a15 15 0 0 1-30 0c0-3 1-6 4-9 0 2 1 4 3 5 0-8 6-10 8-17z', outerFill: C.orange, inner: 'M32 14c2 4 6 6 6 11a6 6 0 0 1-12 0c0-4 4-6 6-11z', innerFill: C.goldLight }, m),
    group({ d: 'M25 37h14l-4 23h-6z', fill: C.brass }),
    group({ rect: [23, 33, 18, 6, 1.5], fill: C.accent }),
    group({ d: 'M27 45h10M26.5 51h11', stroke: C.accent, sw: 1.6, cap: 'round' }),
  ]],
  'chan-den': ['Chân đèn bảy nhánh', [
    glow([32, 14, 24], m),
    // Lit from the centre outward, one pair at a time; goes out from the edges inward.
    ...[8, 16, 24, 40, 48, 56].flatMap((x, j) => {
      const ring = Math.abs(x - 32) / 8; // 1 next to the centre, 3 at the edge
      return flame({ base: [x, 20], phase: j + 1, delay: m === 'out' ? 2 * (3 - ring) : 4 * ring, embers: false, outer: candleFlame(x, 9), outerFill: C.gold }, m);
    }),
    ...flame({ base: [32, 18], delay: m === 'out' ? 6 : 0, outer: 'M32 6c2.5 3.5 4 6 4 8.5a4 4 0 0 1-8 0c0-2.5 1.5-5 4-8.5z', outerFill: C.gold }, m),
    group({ d: 'M32 21v32M24 21v5a8 8 0 0 0 16 0v-5M16 21v5a16 16 0 0 0 32 0v-5M8 21v5a24 24 0 0 0 48 0v-5', stroke: C.brass, sw: 2.4, cap: 'round' }),
    group({ d: 'M24 60h16l-4-7h-8z', fill: C.brass }),
  ]],
  'bui-gai': ['Bụi gai cháy', [
    glow([32, 18, 22], m),
    ...flame({ base: [20, 33], phase: 2, amp: 1.2, delay: 4, embers: false, outer: 'M20 14c3 5 6 8 6 13a6 6 0 0 1-12 0c0-5 3-8 6-13z', outerFill: C.orange }, m),
    ...flame({ base: [44, 33], phase: 4, amp: 1.2, delay: 6, embers: false, outer: 'M44 14c3 5 6 8 6 13a6 6 0 0 1-12 0c0-5 3-8 6-13z', outerFill: C.orange }, m),
    ...flame({ base: [32, 29], amp: 1.2, outer: 'M32 2c4.5 7 9 11 9 18a9 9 0 0 1-18 0c0-7 4.5-11 9-18z', outerFill: C.orange, inner: 'M32 11c2.5 4 4.5 6 4.5 9.5a4.5 4.5 0 0 1-9 0c0-3.5 2-5.5 4.5-9.5z', innerFill: C.goldLight }, m),
    group({ circle: [20, 42, 10], fill: C.accent }),
    group({ circle: [44, 42, 10], fill: C.accent }),
    group({ circle: [32, 38, 12], fill: C.moss }),
    group({ d: 'M28 60l2-10M36 60l-2-10', stroke: C.ink, sw: 2, cap: 'round' }),
    group({ d: 'M14 60h36', stroke: C.brass, sw: 2, cap: 'round' }),
  ]],
  'tru-lua': ['Trụ lửa', [
    glow([32, 32, 26], m),
    ...flame({ base: [32, 59], amp: 0.7, tilt: 0.5, outer: 'M32 2c6 6 10 12 10 20 0 6-3 9-3 14s4 8 4 13c0 6-5 10-11 10s-11-4-11-10c0-5 4-8 4-13s-3-8-3-14c0-8 4-14 10-20z', outerFill: C.orange, inner: 'M32 12c3 4 5 7 5 12 0 4-2 7-2 11s2 7 2 11c0 4-2 7-5 7s-5-3-5-7c0-4 2-7 2-11s-2-7-2-11c0-5 2-8 5-12z', innerFill: C.goldLight }, m),
    group({ d: 'M12 61h40', stroke: C.brass, sw: 2, cap: 'round' }),
  ]],
});

fs.mkdirSync(OUT, { recursive: true });
for (const [mode, suffix, frames] of MODES) {
  FR = frames;
  for (const [slug, [name, back2front]] of Object.entries(KINDS(mode))) {
    const anim = {
      v: '5.7.4', fr: 30, ip: 0, op: FR, w: 64 * SCALE, h: 64 * SCALE, nm: name, ddd: 0, assets: [],
      layers: [{
        ddd: 0, ind: 1, ty: 4, nm: name, sr: 1, ao: 0, bm: 0, ip: 0, op: FR, st: 0,
        ks: { o: still(100), r: still(0), p: still([0, 0, 0]), a: still([0, 0, 0]), s: still([SCALE * 100, SCALE * 100, 100]) },
        shapes: [...back2front].reverse(), // Lottie paints the first item on top
      }],
    };
    const file = path.join(OUT, `${slug}${suffix}.json`);
    fs.writeFileSync(file, JSON.stringify(anim));
    console.log(path.basename(file), fs.statSync(file).size, 'bytes');
  }
}

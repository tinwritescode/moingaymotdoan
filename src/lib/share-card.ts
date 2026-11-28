import { flameDataUrl, type FlameKind } from "../../lib/streak/flames";
import { initialOf } from "../../lib/profile/profile";
import {
  DEFAULT_SHARE_TEMPLATE,
  SHARE_TEMPLATES,
  SHARE_TEMPLATE_STORAGE_KEY,
  isShareTemplate,
  type ShareTemplate,
  type ShareTemplateMeta,
} from "../../lib/streak/share-templates";
import { addDays } from "../../lib/streak/streak";

export {
  DEFAULT_SHARE_TEMPLATE,
  SHARE_TEMPLATES,
  SHARE_TEMPLATE_STORAGE_KEY,
  isShareTemplate,
  type ShareTemplate,
  type ShareTemplateMeta,
};

export type ShareSize = "post" | "story";

// `foot` is the date and URL baseline's distance from the bottom edge. The post card sits 40px high so a
// two-line verse and its reference clear the footer row.
const SIZES: Record<ShareSize, { w: number; h: number; top: number; foot: number }> = {
  post: { w: 1080, h: 1350, top: -40, foot: 50 },
  story: { w: 1080, h: 1920, top: 240, foot: 70 },
};

const C = {
  paper: "#f4f3ee",
  ink: "#2b2e2a",
  muted: "#636a62",
  accent: "#4d7059",
  rule: "#e2e1d9",
  mark: "#eee5c8",
  side: "#e3ebe2",
};
const SANS = "Lexend, system-ui, sans-serif";
const SERIF = '"Source Serif 4", Georgia, serif';
const SITE_HOST = "moingaymotdoan.xyz";

/** Whether each of the last 30 days, oldest first and ending today, had a đoạn read. */
export function last30Days(readDays: ReadonlyMap<string, number>, today: string): boolean[] {
  return Array.from({ length: 30 }, (_, i) => (readDays.get(addDays(today, i - 29)) ?? 0) > 0);
}

export type ShareCardInput = {
  size: ShareSize;
  template?: ShareTemplate;
  days: number;
  flame: FlameKind;
  last30: boolean[];
  /** As printed, e.g. 29.11.2026. */
  date: string;
  text: { site: string; tagline: string; verse: string; verseRef: string };
  /** The reader's name and photo (an image URL) in place of the site name; none keeps the site name. */
  identity?: { name: string; avatar: string | null } | null;
};

type LoadedAssets = {
  flame: HTMLImageElement;
  avatar: HTMLImageElement | null;
};

type IdentityStyle = {
  align: "center" | "left";
  x: number;
  y: number;
  radius?: number;
  fontSize?: number;
  maxWidth?: number;
  ringColor: string;
  gapColor: string;
  fillColor: string;
  initialColor: string;
  textColor: string;
  pill?: { bg: string; border: string; padX: number; height: number };
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // An account photo from another origin would taint the canvas without CORS; one that refuses fails to load.
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image failed"));
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  return line ? [...lines, line] : lines;
}

/** `text` cut to fit `maxWidth`, ending in an ellipsis when cut. */
export function fitText(text: string, maxWidth: number, measure: (s: string) => number): string {
  if (measure(text) <= maxWidth) return text;
  const chars = [...text];
  while (chars.length > 0 && measure(`${chars.join("").trimEnd()}…`) > maxWidth) chars.pop();
  return `${chars.join("").trimEnd()}…`;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function archPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, bottomR: number) {
  const archR = w / 2;
  ctx.beginPath();
  ctx.arc(x + archR, y + archR, archR, Math.PI, 0, false);
  ctx.lineTo(x + w, y + h - bottomR);
  ctx.arcTo(x + w, y + h, x + w - bottomR, y + h, bottomR);
  ctx.lineTo(x + bottomR, y + h);
  ctx.arcTo(x, y + h, x, y + h - bottomR, bottomR);
  ctx.closePath();
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fill();
}

function drawCrosshairDivider(ctx: CanvasRenderingContext2D, cx: number, y: number, halfWidth: number, lineColor: string, diamondColor: string) {
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - halfWidth, y);
  ctx.lineTo(cx - 18, y);
  ctx.moveTo(cx + 18, y);
  ctx.lineTo(cx + halfWidth, y);
  ctx.stroke();
  drawDiamond(ctx, cx, y, 6, diamondColor);
}

function fitVerse(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  sizes: readonly number[],
  maxLines: number,
): { lines: string[]; px: number } {
  let lines: string[] = [];
  let chosen = sizes[sizes.length - 1];
  for (const px of sizes) {
    ctx.font = `italic 400 ${px}px ${SERIF}`;
    lines = wrap(ctx, text, maxWidth);
    chosen = px;
    if (lines.length <= maxLines) break;
  }
  return { lines, px: chosen };
}

/** The reader's photo in a ringed circle (or their initial), then their name, aligned on baseline `y`. */
function drawIdentity(
  ctx: CanvasRenderingContext2D,
  identity: { name: string; avatar: HTMLImageElement | null },
  style: IdentityStyle,
) {
  const r = style.radius ?? 38;
  const fontSize = style.fontSize ?? 36;
  const gap = Math.round(r * 0.58);
  ctx.font = `500 ${fontSize}px ${SANS}`;
  const name = fitText(identity.name, style.maxWidth ?? 760, (s) => ctx.measureText(s).width);
  const textW = ctx.measureText(name).width;
  const totalW = 2 * r + gap + textW;
  const left = style.align === "center" ? style.x - totalW / 2 : style.x;
  const cx = left + r;
  const cy = style.y - Math.round(fontSize * 0.36);

  if (style.pill) {
    const pillW = totalW + style.pill.padX * 2;
    const pillX = style.align === "center" ? style.x - pillW / 2 : left - style.pill.padX;
    const pillY = cy - style.pill.height / 2;
    roundRectPath(ctx, pillX, pillY, pillW, style.pill.height, style.pill.height / 2);
    ctx.fillStyle = style.pill.bg;
    ctx.fill();
    ctx.strokeStyle = style.pill.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const circle = (radius: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  circle(r + 6, style.ringColor);
  circle(r + 3, style.gapColor);
  circle(r, style.fillColor);
  const img = identity.avatar;
  if (img) {
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.save();
    ctx.clip();
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, cx - r, cy - r, 2 * r, 2 * r);
    ctx.restore();
  } else {
    ctx.fillStyle = style.initialColor;
    ctx.font = `600 ${Math.round(r * 1.05)}px ${SERIF}`;
    ctx.textAlign = "center";
    ctx.fillText(initialOf(identity.name), cx, cy + Math.round(r * 0.36));
  }
  ctx.fillStyle = style.textColor;
  ctx.font = `500 ${fontSize}px ${SANS}`;
  ctx.textAlign = "left";
  ctx.fillText(name, cx + r + gap, style.y);
  ctx.textAlign = "center";
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  w: number,
  y: number,
  marginX: number,
  date: string,
  dateColor: string,
  hostColor: string,
) {
  ctx.font = `400 30px ${SANS}`;
  ctx.textAlign = "left";
  ctx.fillStyle = dateColor;
  ctx.fillText(date, marginX, y);
  ctx.textAlign = "right";
  ctx.fillStyle = hostColor;
  ctx.fillText(SITE_HOST, w - marginX, y);
  ctx.textAlign = "center";
}

/** 0. Giấy ấm (Warm Paper) — original quiet parchment card. */
function drawPaper(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h, top, foot } = SIZES[input.size];
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "center",
      x: w / 2,
      y: top + 120,
      ringColor: C.accent,
      gapColor: C.paper,
      fillColor: C.side,
      initialColor: C.accent,
      textColor: C.ink,
    });
  } else {
    ctx.fillStyle = C.accent;
    ctx.font = `500 34px ${SANS}`;
    ctx.fillText(input.text.site, w / 2, top + 120);
  }

  ctx.fillStyle = C.mark;
  ctx.beginPath();
  ctx.arc(w / 2, top + 370, 190, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(assets.flame, w / 2 - 136, top + 234, 272, 272);

  ctx.fillStyle = C.ink;
  ctx.font = `600 230px ${SERIF}`;
  ctx.fillText(String(input.days), w / 2, top + 790);
  ctx.font = `400 46px ${SANS}`;
  ctx.fillText(input.text.tagline, w / 2, top + 870);

  // 30 days: 10 per row, oldest top left.
  const r = 15;
  const gap = 56;
  const left = w / 2 - (gap * 9) / 2;
  input.last30.forEach((on, i) => {
    ctx.fillStyle = on ? C.accent : C.rule;
    ctx.beginPath();
    ctx.arc(left + (i % 10) * gap, top + 950 + Math.floor(i / 10) * gap, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = C.ink;
  const verseTop = top + 1150 + (input.size === "story" ? 80 : 0);
  const { lines } = fitVerse(ctx, input.text.verse, 860, [40, 36, 32], 2);
  lines.forEach((line, i) => ctx.fillText(line, w / 2, verseTop + i * 54));
  ctx.fillStyle = C.muted;
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, verseTop + 54 * lines.length + 24);

  drawFooter(ctx, w, h - foot, 80, input.date, C.muted, C.accent);
}

/** 1. Đêm tĩnh (Night Vigil) — candlelight glow on deep moss-charcoal with fine gold framing. */
function drawNight(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#171d19");
  bg.addColorStop(0.55, "#121714");
  bg.addColorStop(1, "#0d110f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const lanternY = story ? 580 : 340;
  const lanternR = story ? 162 : 142;

  // Warm ambient candlelight halo behind the lantern.
  const glow = ctx.createRadialGradient(w / 2, lanternY, lanternR * 0.4, w / 2, lanternY, story ? 480 : 390);
  glow.addColorStop(0, "rgba(224, 179, 82, 0.34)");
  glow.addColorStop(0.45, "rgba(224, 179, 82, 0.11)");
  glow.addColorStop(1, "rgba(224, 179, 82, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Fine double gold hairline border with tiny corner diamonds.
  const outer = 42;
  const inner = 54;
  ctx.strokeStyle = "rgba(224, 181, 83, 0.28)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(outer, outer, w - outer * 2, h - outer * 2);
  ctx.strokeStyle = "rgba(224, 181, 83, 0.12)";
  ctx.strokeRect(inner, inner, w - inner * 2, h - inner * 2);
  for (const [cx, cy] of [
    [outer, outer],
    [w - outer, outer],
    [outer, h - outer],
    [w - outer, h - outer],
  ]) {
    drawDiamond(ctx, cx, cy, 5, "#e0b553");
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const idY = story ? 304 : 124;
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "center",
      x: w / 2,
      y: idY,
      radius: 34,
      fontSize: 34,
      ringColor: "#e0b553",
      gapColor: "#141916",
      fillColor: "#232c26",
      initialColor: "#e0b553",
      textColor: "#f0ece2",
    });
  } else {
    ctx.fillStyle = "#e0b553";
    ctx.font = `500 32px ${SANS}`;
    ctx.fillText(input.text.site, w / 2, idY);
  }

  // Luminous cream-gold lantern moon so all six flames hold crisp contrast in the dark.
  ctx.strokeStyle = "rgba(224, 181, 83, 0.42)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w / 2, lanternY, lanternR + 18, 0, Math.PI * 2);
  ctx.stroke();

  const moon = ctx.createRadialGradient(w / 2, lanternY - 24, 12, w / 2, lanternY, lanternR);
  moon.addColorStop(0, "#fbf6e8");
  moon.addColorStop(1, "#eee2c2");
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(w / 2, lanternY, lanternR, 0, Math.PI * 2);
  ctx.fill();
  const flameSize = story ? 236 : 208;
  ctx.drawImage(assets.flame, w / 2 - flameSize / 2, lanternY - flameSize / 2, flameSize, flameSize);

  ctx.fillStyle = "#f4efe4";
  ctx.font = `600 ${story ? 242 : 216}px ${SERIF}`;
  ctx.fillText(String(input.days), w / 2, story ? 976 : 690);
  ctx.fillStyle = "#c7ccc4";
  ctx.font = `400 ${story ? 44 : 40}px ${SANS}`;
  ctx.fillText(input.text.tagline, w / 2, story ? 1052 : 756);

  drawCrosshairDivider(ctx, w / 2, story ? 1118 : 806, 210, "rgba(224, 181, 83, 0.34)", "#e0b553");

  // 30-day constellation dots: active days glow softly in amber gold.
  const dotR = story ? 14 : 12.5;
  const gap = story ? 58 : 52;
  const left = w / 2 - (gap * 9) / 2;
  const dotTop = story ? 1184 : 858;
  input.last30.forEach((on, i) => {
    const cx = left + (i % 10) * gap;
    const cy = dotTop + Math.floor(i / 10) * gap;
    if (on) {
      ctx.fillStyle = "rgba(224, 181, 83, 0.24)";
      ctx.beginPath();
      ctx.arc(cx, cy, dotR + 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = on ? "#e6bd5c" : "rgba(240, 236, 226, 0.14)";
    ctx.beginPath();
    ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
    ctx.fill();
  });

  const verseTop = story ? 1456 : 1074;
  ctx.fillStyle = "#f2ede2";
  const { lines, px } = fitVerse(ctx, input.text.verse, 820, story ? [42, 38, 34] : [38, 34, 30], 2);
  const lh = Math.round(px * 1.4);
  lines.forEach((line, i) => ctx.fillText(line, w / 2, verseTop + i * lh));
  ctx.fillStyle = "#e0b553";
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, verseTop + lh * lines.length + 20);

  drawFooter(ctx, w, h - (story ? 100 : 82), 92, input.date, "#8f998f", "#e0b553");
}

/** 2. Rêu thẫm (Deep Moss) — botanical forest poster with pill badge, 30-day tick bar, and frosted quote card. */
function drawMoss(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";

  const bg = ctx.createRadialGradient(w / 2, story ? 540 : 340, 80, w / 2, h * 0.55, h * 0.85);
  bg.addColorStop(0, "#355341");
  bg.addColorStop(0.55, "#284133");
  bg.addColorStop(1, "#1e3227");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const emblemY = story ? 548 : 326;
  const emblemR = story ? 156 : 134;

  // Subtle botanical concentric rings.
  ctx.strokeStyle = "rgba(244, 242, 235, 0.06)";
  ctx.lineWidth = 2;
  for (const r of [emblemR + 80, emblemR + 170, emblemR + 260]) {
    ctx.beginPath();
    ctx.arc(w / 2, emblemY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const idY = story ? 280 : 114;
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "center",
      x: w / 2,
      y: idY,
      radius: 30,
      fontSize: 32,
      maxWidth: 620,
      ringColor: "#e6c87a",
      gapColor: "#2c4637",
      fillColor: "#3d5e4b",
      initialColor: "#f4f2eb",
      textColor: "#f4f2eb",
      pill: { bg: "rgba(244, 242, 235, 0.1)", border: "rgba(244, 242, 235, 0.2)", padX: 28, height: 84 },
    });
  } else {
    ctx.font = `500 30px ${SANS}`;
    const labelW = ctx.measureText(input.text.site).width;
    roundRectPath(ctx, w / 2 - labelW / 2 - 34, idY - 48, labelW + 68, 72, 36);
    ctx.fillStyle = "rgba(244, 242, 235, 0.1)";
    ctx.fill();
    ctx.strokeStyle = "rgba(244, 242, 235, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#e6c87a";
    ctx.fillText(input.text.site, w / 2, idY);
  }

  // Dashed gold halo + warm cream medallion.
  ctx.save();
  ctx.strokeStyle = "rgba(230, 200, 122, 0.55)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([7, 11]);
  ctx.beginPath();
  ctx.arc(w / 2, emblemY, emblemR + 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#f4efe2";
  ctx.beginPath();
  ctx.arc(w / 2, emblemY, emblemR, 0, Math.PI * 2);
  ctx.fill();
  const flameSize = story ? 232 : 200;
  ctx.drawImage(assets.flame, w / 2 - flameSize / 2, emblemY - flameSize / 2, flameSize, flameSize);

  ctx.fillStyle = "#f7f4ec";
  ctx.font = `600 ${story ? 242 : 212}px ${SERIF}`;
  ctx.fillText(String(input.days), w / 2, story ? 952 : 668);
  ctx.fillStyle = "#dce6dd";
  ctx.font = `400 ${story ? 44 : 40}px ${SANS}`;
  ctx.fillText(input.text.tagline, w / 2, story ? 1030 : 736);

  // 30-day vertical tick strip: 30 sleek rounded capsules in a single balanced row.
  const barW = 18;
  const barGap = 11;
  const barH = story ? 58 : 48;
  const stripW = 30 * barW + 29 * barGap;
  const stripX = (w - stripW) / 2;
  const stripY = story ? 1110 : 792;
  input.last30.forEach((on, i) => {
    const x = stripX + i * (barW + barGap);
    const hNow = on ? barH : Math.round(barH * 0.56);
    const y = stripY + (barH - hNow) / 2;
    roundRectPath(ctx, x, y, barW, hNow, barW / 2);
    ctx.fillStyle = on ? "#e6c87a" : "rgba(244, 242, 235, 0.18)";
    ctx.fill();
  });

  // Frosted botanical verse card at bottom.
  const boxX = 76;
  const boxW = w - boxX * 2;
  const boxY = story ? 1274 : 910;
  const boxH = story ? 344 : 284;
  roundRectPath(ctx, boxX, boxY, boxW, boxH, 34);
  ctx.fillStyle = "rgba(244, 242, 235, 0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(230, 200, 122, 0.24)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const { lines, px } = fitVerse(ctx, input.text.verse, boxW - 110, story ? [42, 38, 34] : [38, 34, 30], 3);
  const lh = Math.round(px * 1.42);
  const refGap = 42;
  const contentH = (lines.length - 1) * lh + refGap;
  const startY = boxY + (boxH - contentH) / 2 + Math.round(px * 0.32);

  ctx.fillStyle = "#f7f4ec";
  ctx.font = `italic 400 ${px}px ${SERIF}`;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lh));
  ctx.fillStyle = "#e6c87a";
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, startY + (lines.length - 1) * lh + refGap + 8);

  drawFooter(ctx, w, h - (story ? 96 : 68), 80, input.date, "#b4c6b7", "#e6c87a");
}

/** 3. Kinh bản (Scripture Folio) — printed bookplate layout with double vellum frame and asymmetric split hero. */
function drawManuscript(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";
  const vellum = "#f6f0e2";
  const gold = "#8b6f26";

  ctx.fillStyle = vellum;
  ctx.fillRect(0, 0, w, h);

  // Double-ruled bookplate frame.
  const fx = 44;
  const fy = story ? 128 : 44;
  const fw = w - fx * 2;
  const fh = h - fy * 2;
  ctx.strokeStyle = "#c8bba0";
  ctx.lineWidth = 2;
  ctx.strokeRect(fx, fy, fw, fh);
  ctx.strokeStyle = "#dfd5be";
  ctx.lineWidth = 1.25;
  ctx.strokeRect(fx + 12, fy + 12, fw - 24, fh - 24);

  // Corner L-ornaments in antique gold.
  const cornerLen = 22;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  const corners: [number, number, number, number][] = [
    [fx, fy, 1, 1],
    [fx + fw, fy, -1, 1],
    [fx, fy + fh, 1, -1],
    [fx + fw, fy + fh, -1, -1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * cornerLen, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * cornerLen);
    ctx.stroke();
  }

  const padX = 104;
  ctx.textBaseline = "alphabetic";

  // Top header row inside the frame: identity left, date right.
  const headerY = story ? 228 : 126;
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "left",
      x: padX,
      y: headerY,
      radius: 26,
      fontSize: 30,
      maxWidth: 520,
      ringColor: gold,
      gapColor: vellum,
      fillColor: "#e9e0ca",
      initialColor: gold,
      textColor: C.ink,
    });
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = gold;
    ctx.font = `500 30px ${SANS}`;
    ctx.fillText(input.text.site, padX, headerY);
  }
  ctx.textAlign = "right";
  ctx.fillStyle = C.muted;
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText(input.date, w - padX, headerY);

  const rule1Y = story ? 270 : 162;
  ctx.strokeStyle = "#d9ceb6";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX, rule1Y);
  ctx.lineTo(w - padX, rule1Y);
  ctx.stroke();

  // Split hero: giant serif numeral + tagline left; arched antique-gold flame niche right.
  const nicheW = story ? 286 : 276;
  const nicheH = story ? 344 : 302;
  const nicheX = w - padX - nicheW;
  const nicheY = story ? 336 : 206;

  archPath(ctx, nicheX, nicheY, nicheW, nicheH, 24);
  ctx.fillStyle = "#ede3ca";
  ctx.fill();
  ctx.strokeStyle = "#cbb98f";
  ctx.lineWidth = 1.75;
  ctx.stroke();
  const flameSize = story ? 214 : 196;
  ctx.drawImage(
    assets.flame,
    nicheX + (nicheW - flameSize) / 2,
    nicheY + (nicheH - flameSize) / 2 + 12,
    flameSize,
    flameSize,
  );

  const bigNumPx = input.days >= 100 ? (story ? 212 : 186) : story ? 264 : 226;
  ctx.textAlign = "left";
  ctx.fillStyle = C.ink;
  ctx.font = `600 ${bigNumPx}px ${SERIF}`;
  const numY = story ? 574 : 400;
  ctx.fillText(String(input.days), padX, numY);

  ctx.fillStyle = "#4d554d";
  ctx.font = `400 ${story ? 40 : 36}px ${SANS}`;
  const tagLines = wrap(ctx, input.text.tagline, nicheX - padX - 36);
  tagLines.forEach((line, i) => ctx.fillText(line, padX, numY + (story ? 70 : 58) + i * 48));

  const rule2Y = story ? 764 : 550;
  ctx.strokeStyle = "#d9ceb6";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX, rule2Y);
  ctx.lineTo(w - padX, rule2Y);
  ctx.stroke();

  // 30-day folio bookplate grid: 3 rows × 10 rounded squares spanning the column width.
  const cols = 10;
  const cellW = 56;
  const cellH = story ? 48 : 42;
  const gapX = (w - padX * 2 - cols * cellW) / (cols - 1);
  const gapY = story ? 26 : 20;
  const gridY = story ? 842 : 600;
  input.last30.forEach((on, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (cellW + gapX);
    const y = gridY + row * (cellH + gapY);
    roundRectPath(ctx, x, y, cellW, cellH, 10);
    if (on) {
      ctx.fillStyle = C.accent;
      ctx.fill();
    } else {
      ctx.fillStyle = "#efe7d4";
      ctx.fill();
      ctx.strokeStyle = "#d7ccb4";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });

  const rule3Y = story ? 1118 : 812;
  ctx.strokeStyle = "#d9ceb6";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX, rule3Y);
  ctx.lineTo(w - padX, rule3Y);
  ctx.stroke();

  // Editorial left-aligned scripture callout with gold vertical rule & drop quote mark.
  const quoteTop = story ? 1272 : 938;
  const quoteX = padX + 36;
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(139, 111, 38, 0.28)";
  ctx.font = `600 120px ${SERIF}`;
  ctx.fillText("“", quoteX - 6, quoteTop - 16);

  const { lines, px } = fitVerse(ctx, input.text.verse, w - padX - quoteX, story ? [44, 40, 36] : [40, 36, 32], 3);
  const lh = Math.round(px * 1.44);
  const blockH = lines.length * lh + 48;
  ctx.fillStyle = gold;
  ctx.fillRect(padX, quoteTop - Math.round(px * 0.85), 4, blockH);

  ctx.fillStyle = C.ink;
  ctx.font = `italic 400 ${px}px ${SERIF}`;
  lines.forEach((line, i) => ctx.fillText(line, quoteX, quoteTop + i * lh));
  ctx.fillStyle = gold;
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(input.text.verseRef, quoteX, quoteTop + lines.length * lh + 18);

  // Centered URL tucked neatly into the bottom border break.
  ctx.font = `500 28px ${SANS}`;
  const hostW = ctx.measureText(SITE_HOST).width;
  const bottomBorderY = fy + fh;
  ctx.fillStyle = vellum;
  ctx.fillRect(w / 2 - hostW / 2 - 26, bottomBorderY - 22, hostW + 52, 44);
  ctx.textAlign = "center";
  ctx.fillStyle = C.accent;
  ctx.fillText(SITE_HOST, w / 2, bottomBorderY + 9);
}

/** 4. Bình minh (Morning Light) — warm apricot-to-sage sunrise wash framing an ivory cathedral arch. */
function drawDawn(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#f5e2c6");
  sky.addColorStop(0.45, "#f4efe2");
  sky.addColorStop(1, "#dde8df");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Soft morning sun bloom behind the arch crown.
  const sunY = story ? 360 : 210;
  const sun = ctx.createRadialGradient(w / 2, sunY, 40, w / 2, sunY, 520);
  sun.addColorStop(0, "rgba(255, 249, 235, 0.85)");
  sun.addColorStop(0.55, "rgba(246, 214, 158, 0.25)");
  sun.addColorStop(1, "rgba(246, 214, 158, 0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const idY = story ? 228 : 96;
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "center",
      x: w / 2,
      y: idY,
      radius: 32,
      fontSize: 32,
      ringColor: "#c9962f",
      gapColor: "#f5e7d2",
      fillColor: "#fbfaf6",
      initialColor: "#8b6f26",
      textColor: C.ink,
    });
  } else {
    ctx.fillStyle = "#7a6332";
    ctx.font = `500 32px ${SANS}`;
    ctx.fillText(input.text.site, w / 2, idY);
  }

  // Ivory cathedral arch card.
  const archX = 88;
  const archW = w - archX * 2;
  const archY = story ? 314 : 150;
  const archBottom = story ? 1746 : 1244;
  const archH = archBottom - archY;

  ctx.save();
  ctx.shadowColor = "rgba(53, 82, 64, 0.1)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  archPath(ctx, archX, archY, archW, archH, 38);
  ctx.fillStyle = "#fbfaf6";
  ctx.fill();
  ctx.restore();

  archPath(ctx, archX, archY, archW, archH, 38);
  ctx.strokeStyle = "rgba(201, 150, 47, 0.26)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Flame sun disk near the crown of the arch.
  const diskY = story ? 572 : 344;
  const diskR = story ? 150 : 124;
  const diskGrad = ctx.createRadialGradient(w / 2, diskY - 16, 16, w / 2, diskY, diskR);
  diskGrad.addColorStop(0, "#fcf2da");
  diskGrad.addColorStop(1, "#f4e1b8");
  ctx.fillStyle = diskGrad;
  ctx.beginPath();
  ctx.arc(w / 2, diskY, diskR, 0, Math.PI * 2);
  ctx.fill();
  const flameSize = story ? 224 : 184;
  ctx.drawImage(assets.flame, w / 2 - flameSize / 2, diskY - flameSize / 2, flameSize, flameSize);

  ctx.fillStyle = "#355240";
  ctx.font = `600 ${story ? 242 : 206}px ${SERIF}`;
  ctx.fillText(String(input.days), w / 2, story ? 960 : 664);
  ctx.fillStyle = C.ink;
  ctx.font = `400 ${story ? 44 : 40}px ${SANS}`;
  ctx.fillText(input.text.tagline, w / 2, story ? 1038 : 732);

  // 30-day dots inside the arch.
  const dotR = story ? 14 : 12;
  const gap = story ? 56 : 48;
  const left = w / 2 - (gap * 9) / 2;
  const dotTop = story ? 1134 : 802;
  input.last30.forEach((on, i) => {
    ctx.fillStyle = on ? C.accent : "#e5e3da";
    ctx.beginPath();
    ctx.arc(left + (i % 10) * gap, dotTop + Math.floor(i / 10) * gap, dotR, 0, Math.PI * 2);
    ctx.fill();
  });

  drawCrosshairDivider(ctx, w / 2, story ? 1326 : 956, 170, "#e3decb", "#c9962f");

  const verseTop = story ? 1430 : 1030;
  ctx.fillStyle = C.ink;
  const { lines, px } = fitVerse(ctx, input.text.verse, archW - 150, story ? [40, 36, 32] : [36, 32, 28], 2);
  const lh = Math.round(px * 1.44);
  lines.forEach((line, i) => ctx.fillText(line, w / 2, verseTop + i * lh));
  ctx.fillStyle = "#7a6332";
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, verseTop + lh * lines.length + 18);

  drawFooter(ctx, w, h - (story ? 74 : 44), 92, input.date, "#536056", "#355240");
}

/** 5. Tối giản (Editorial) — contemporary left-aligned big-type layout with split-tone scripture band. */
function drawEditorial(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";
  const padX = 84;
  const bandY = story ? 1120 : 804;

  // Upper alabaster canvas + lower sage-stone verse band.
  ctx.fillStyle = "#fbfaf6";
  ctx.fillRect(0, 0, w, bandY);
  ctx.fillStyle = "#e8ece4";
  ctx.fillRect(0, bandY, w, h - bandY);
  ctx.fillStyle = "#d5dcd0";
  ctx.fillRect(0, bandY, w, 2);

  // Crisp deep-pine edge ribbon at the top.
  ctx.fillStyle = C.accent;
  ctx.fillRect(0, 0, w, story ? 20 : 16);

  ctx.textBaseline = "alphabetic";

  // Top row: identity left, compact flame badge right.
  const topY = story ? 256 : 132;
  const badgeR = story ? 82 : 70;
  const badgeCx = w - padX - badgeR;
  const badgeCy = topY - 10;
  ctx.fillStyle = C.mark;
  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, badgeR, 0, Math.PI * 2);
  ctx.fill();
  const flameSize = story ? 122 : 104;
  ctx.drawImage(assets.flame, badgeCx - flameSize / 2, badgeCy - flameSize / 2, flameSize, flameSize);

  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "left",
      x: padX,
      y: topY,
      radius: 34,
      fontSize: 34,
      maxWidth: 660,
      ringColor: C.accent,
      gapColor: "#fbfaf6",
      fillColor: C.side,
      initialColor: C.accent,
      textColor: C.ink,
    });
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = C.accent;
    ctx.font = `500 34px ${SANS}`;
    ctx.fillText(input.text.site, padX, topY);
  }

  // Monumental left-aligned streak number & tagline.
  ctx.textAlign = "left";
  ctx.fillStyle = "#1f241f";
  ctx.font = `600 ${story ? 326 : 276}px ${SERIF}`;
  const numY = story ? 690 : 482;
  ctx.fillText(String(input.days), padX - 8, numY);

  const tagY = story ? 786 : 562;
  ctx.fillStyle = C.accent;
  ctx.font = `500 ${story ? 46 : 42}px ${SANS}`;
  ctx.fillText(input.text.tagline, padX, tagY);

  const activeDays = input.last30.filter(Boolean).length;
  ctx.textAlign = "right";
  ctx.fillStyle = C.muted;
  ctx.font = `500 ${story ? 34 : 30}px ${SANS}`;
  ctx.fillText(`${activeDays}/30`, w - padX, tagY);

  // 2 × 15 horizontal progress chips across the full column width.
  const cols = 15;
  const chipW = 46;
  const chipH = story ? 34 : 28;
  const gapX = (w - padX * 2 - cols * chipW) / (cols - 1);
  const gapY = story ? 18 : 14;
  const gridY = story ? 878 : 632;
  input.last30.forEach((on, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (chipW + gapX);
    const y = gridY + row * (chipH + gapY);
    roundRectPath(ctx, x, y, chipW, chipH, 9);
    ctx.fillStyle = on ? C.accent : "#e2e4db";
    ctx.fill();
  });

  // Lower sage-stone band: short accent dash, large left-aligned italic verse, reference, and footer.
  const dashY = story ? 1244 : 884;
  roundRectPath(ctx, padX, dashY, 60, 6, 3);
  ctx.fillStyle = C.accent;
  ctx.fill();

  const verseTop = story ? 1344 : 968;
  ctx.textAlign = "left";
  ctx.fillStyle = "#1f241f";
  const { lines, px } = fitVerse(ctx, input.text.verse, w - padX * 2, story ? [46, 40, 36] : [42, 36, 32], 3);
  const lh = Math.round(px * 1.44);
  lines.forEach((line, i) => ctx.fillText(line, padX, verseTop + i * lh));
  ctx.fillStyle = C.accent;
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(input.text.verseRef, padX, verseTop + lines.length * lh + 22);

  drawFooter(ctx, w, h - (story ? 84 : 58), padX, input.date, C.muted, C.accent);
}

function drawFourPointStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, color: string) {
  const innerR = outerR * 0.34;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

/** 6. Bưu thiếp (Postcard) — floating keepsake postcard on warm stone with a perforated flame stamp and ruled verse lines. */
function drawPostcard(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";
  const clay = "#8e4a31";

  ctx.fillStyle = "#e6e0d4";
  ctx.fillRect(0, 0, w, h);

  // Subtle woven stone border frame on the mat.
  ctx.strokeStyle = "rgba(125, 117, 102, 0.22)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Floating white keepsake postcard.
  const cardX = 68;
  const cardW = w - cardX * 2;
  const cardY = story ? 176 : 66;
  const cardH = story ? 1510 : 1174;

  ctx.save();
  ctx.shadowColor = "rgba(58, 49, 38, 0.14)";
  ctx.shadowBlur = 44;
  ctx.shadowOffsetY = 16;
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 26);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  roundRectPath(ctx, cardX, cardY, cardW, cardH, 26);
  ctx.strokeStyle = "#ded7c8";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const innerL = cardX + 64;
  const innerR = cardX + cardW - 64;
  const innerW = innerR - innerL;
  ctx.textBaseline = "alphabetic";

  // Top-right die-cut perforated postage stamp holding the flame.
  const stampW = story ? 204 : 186;
  const stampH = story ? 236 : 214;
  const stampX = innerR - stampW;
  const stampY = cardY + (story ? 66 : 52);

  // Wavy postal cancel lines brushing the left edge of the stamp.
  ctx.strokeStyle = "rgba(142, 74, 49, 0.2)";
  ctx.lineWidth = 2.5;
  for (let row = 0; row < 3; row++) {
    const wy = stampY + stampH * 0.36 + row * 22;
    ctx.beginPath();
    ctx.moveTo(stampX - 110, wy);
    ctx.bezierCurveTo(stampX - 75, wy - 12, stampX - 45, wy + 12, stampX - 10, wy);
    ctx.bezierCurveTo(stampX + 15, wy - 10, stampX + 35, wy + 10, stampX + 52, wy);
    ctx.stroke();
  }

  ctx.fillStyle = "#f5ecd8";
  ctx.fillRect(stampX, stampY, stampW, stampH);
  // Perforated notches along all 4 stamp edges punched in postcard white.
  ctx.fillStyle = "#ffffff";
  const notchR = 7;
  const stepX = stampW / 8;
  for (let i = 0; i <= 8; i++) {
    ctx.beginPath();
    ctx.arc(stampX + i * stepX, stampY, notchR, 0, Math.PI * 2);
    ctx.arc(stampX + i * stepX, stampY + stampH, notchR, 0, Math.PI * 2);
    ctx.fill();
  }
  const stepY = stampH / 9;
  for (let i = 1; i < 9; i++) {
    ctx.beginPath();
    ctx.arc(stampX, stampY + i * stepY, notchR, 0, Math.PI * 2);
    ctx.arc(stampX + stampW, stampY + i * stepY, notchR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(142, 74, 49, 0.32)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(stampX + 16, stampY + 16, stampW - 32, stampH - 32);

  const flameSize = story ? 148 : 132;
  ctx.drawImage(
    assets.flame,
    stampX + (stampW - flameSize) / 2,
    stampY + (stampH - flameSize) / 2,
    flameSize,
    flameSize,
  );

  // Top-left identity + date postmark.
  const idY = cardY + (story ? 124 : 102);
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "left",
      x: innerL,
      y: idY,
      radius: 28,
      fontSize: 30,
      maxWidth: 440,
      ringColor: clay,
      gapColor: "#ffffff",
      fillColor: "#f5ece6",
      initialColor: clay,
      textColor: C.ink,
    });
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = clay;
    ctx.font = `500 30px ${SANS}`;
    ctx.fillText(input.text.site, innerL, idY);
  }
  ctx.textAlign = "left";
  ctx.fillStyle = "#8a8275";
  ctx.font = `400 26px ${SANS}`;
  ctx.fillText(input.date, innerL, idY + 54);

  // Hero clay numeral + tagline.
  const numY = cardY + (story ? 556 : 418);
  ctx.fillStyle = clay;
  ctx.font = `600 ${story ? 256 : 216}px ${SERIF}`;
  ctx.fillText(String(input.days), innerL - 6, numY);

  ctx.fillStyle = C.ink;
  ctx.font = `400 ${story ? 42 : 38}px ${SANS}`;
  ctx.fillText(input.text.tagline, innerL, numY + (story ? 74 : 62));

  // 30-day stamped rings grid (3 × 10).
  const cols = 10;
  const dotR = story ? 15 : 13;
  const gapX = (innerW - dotR * 2) / (cols - 1);
  const gapY = story ? 62 : 52;
  const gridY = cardY + (story ? 752 : 570);
  input.last30.forEach((on, i) => {
    const cx = innerL + dotR + (i % cols) * gapX;
    const cy = gridY + Math.floor(i / cols) * gapY;
    ctx.beginPath();
    ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
    if (on) {
      ctx.fillStyle = clay;
      ctx.fill();
    } else {
      ctx.fillStyle = "#faf7f1";
      ctx.fill();
      ctx.strokeStyle = "#d9d0c1";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Postcard writing rules + verse tucked cleanly above them.
  const verseTop = cardY + (story ? 1140 : 834);
  const { lines, px } = fitVerse(ctx, input.text.verse, innerW - 12, story ? [42, 38, 34] : [38, 34, 30], 3);
  const lh = story ? 74 : 64;
  const ruleCount = Math.max(3, lines.length + 1);
  ctx.strokeStyle = "#ebe4d6";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < ruleCount; i++) {
    const ry = verseTop + i * lh + 16;
    ctx.beginPath();
    ctx.moveTo(innerL, ry);
    ctx.lineTo(innerR, ry);
    ctx.stroke();
  }

  ctx.textAlign = "left";
  ctx.fillStyle = C.ink;
  ctx.font = `italic 400 ${px}px ${SERIF}`;
  lines.forEach((line, i) => ctx.fillText(line, innerL, verseTop + i * lh));

  ctx.fillStyle = clay;
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText(`— ${input.text.verseRef}`, innerL, verseTop + lines.length * lh);

  // Subtle site imprint on the warm stone mat below the postcard.
  ctx.textAlign = "center";
  ctx.fillStyle = "#6c655a";
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText(SITE_HOST, w / 2, h - (story ? 104 : 42));
}

// Deterministic celestial starfield coordinates: [nx, ny, radius, opacity, isSparkle].
const STARS: readonly (readonly [number, number, number, number, boolean])[] = [
  [0.11, 0.08, 2.2, 0.65, false],
  [0.24, 0.05, 5.5, 0.55, true],
  [0.37, 0.11, 1.8, 0.45, false],
  [0.64, 0.07, 2.4, 0.6, false],
  [0.78, 0.06, 6.0, 0.6, true],
  [0.89, 0.12, 2.0, 0.5, false],
  [0.08, 0.21, 5.0, 0.48, true],
  [0.17, 0.28, 2.0, 0.4, false],
  [0.84, 0.22, 2.4, 0.55, false],
  [0.92, 0.31, 5.2, 0.5, true],
  [0.12, 0.44, 2.0, 0.38, false],
  [0.88, 0.47, 2.2, 0.42, false],
  [0.07, 0.62, 1.8, 0.35, false],
  [0.93, 0.66, 2.0, 0.35, false],
  [0.14, 0.81, 4.8, 0.4, true],
  [0.86, 0.83, 2.2, 0.42, false],
  [0.21, 0.91, 1.8, 0.35, false],
  [0.79, 0.9, 5.0, 0.45, true],
];

/** 7. Sao đêm (Starlit) — midnight-indigo celestial sky with orbital arcs, moon lantern, and 4-point star streak markers. */
function drawCelestial(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";
  const starGold = "#ebd082";

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#101a2e");
  sky.addColorStop(0.5, "#192947");
  sky.addColorStop(1, "#0d1526");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const moonY = story ? 566 : 344;
  const moonR = story ? 156 : 136;

  // Soft moonbeam aura.
  const aura = ctx.createRadialGradient(w / 2, moonY, moonR * 0.4, w / 2, moonY, story ? 480 : 390);
  aura.addColorStop(0, "rgba(235, 208, 130, 0.3)");
  aura.addColorStop(0.5, "rgba(148, 180, 232, 0.1)");
  aura.addColorStop(1, "rgba(16, 26, 46, 0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, w, h);

  // Subtle concentric celestial orbital rings around the moon lantern.
  ctx.strokeStyle = "rgba(235, 208, 130, 0.14)";
  ctx.lineWidth = 1.5;
  for (const r of [moonR + 48, moonR + 132, moonR + 240]) {
    ctx.beginPath();
    ctx.arc(w / 2, moonY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Deterministic starfield.
  for (const [nx, ny, r, alpha, sparkle] of STARS) {
    const sx = nx * w;
    const sy = ny * h;
    const col = `rgba(245, 231, 186, ${alpha})`;
    if (sparkle) drawFourPointStar(ctx, sx, sy, r * 1.9, col);
    else {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const idY = story ? 286 : 118;
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "center",
      x: w / 2,
      y: idY,
      radius: 32,
      fontSize: 32,
      ringColor: starGold,
      gapColor: "#142038",
      fillColor: "#223457",
      initialColor: starGold,
      textColor: "#f5f2e8",
    });
  } else {
    ctx.fillStyle = starGold;
    ctx.font = `500 32px ${SANS}`;
    ctx.fillText(input.text.site, w / 2, idY);
  }

  // Pearl-ivory moon disk framing the flame.
  const moon = ctx.createRadialGradient(w / 2 - 20, moonY - 24, 18, w / 2, moonY, moonR);
  moon.addColorStop(0, "#fdfaf0");
  moon.addColorStop(1, "#ece0c0");
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(w / 2, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  const flameSize = story ? 226 : 196;
  ctx.drawImage(assets.flame, w / 2 - flameSize / 2, moonY - flameSize / 2, flameSize, flameSize);

  ctx.fillStyle = "#f7f4eb";
  ctx.font = `600 ${story ? 242 : 212}px ${SERIF}`;
  ctx.fillText(String(input.days), w / 2, story ? 956 : 690);
  ctx.fillStyle = "#c3d2e8";
  ctx.font = `400 ${story ? 44 : 40}px ${SANS}`;
  ctx.fillText(input.text.tagline, w / 2, story ? 1034 : 756);

  // Starlight divider.
  const divY = story ? 1102 : 808;
  ctx.strokeStyle = "rgba(235, 208, 130, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 200, divY);
  ctx.lineTo(w / 2 - 22, divY);
  ctx.moveTo(w / 2 + 22, divY);
  ctx.lineTo(w / 2 + 200, divY);
  ctx.stroke();
  drawFourPointStar(ctx, w / 2, divY, 10, starGold);

  // 30-day constellation: 4-point golden stars for read days, quiet twilight dots for unread.
  const gap = story ? 60 : 54;
  const left = w / 2 - (gap * 9) / 2;
  const dotTop = story ? 1178 : 862;
  input.last30.forEach((on, i) => {
    const cx = left + (i % 10) * gap;
    const cy = dotTop + Math.floor(i / 10) * gap;
    if (on) {
      ctx.fillStyle = "rgba(235, 208, 130, 0.22)";
      ctx.beginPath();
      ctx.arc(cx, cy, story ? 18 : 16, 0, Math.PI * 2);
      ctx.fill();
      drawFourPointStar(ctx, cx, cy, story ? 16 : 14, starGold);
    } else {
      ctx.fillStyle = "rgba(195, 210, 232, 0.22)";
      ctx.beginPath();
      ctx.arc(cx, cy, story ? 7 : 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const verseTop = story ? 1456 : 1074;
  ctx.fillStyle = "#f5f2e8";
  const { lines, px } = fitVerse(ctx, input.text.verse, 830, story ? [42, 38, 34] : [38, 34, 30], 2);
  const lh = Math.round(px * 1.42);
  lines.forEach((line, i) => ctx.fillText(line, w / 2, verseTop + i * lh));
  ctx.fillStyle = starGold;
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, verseTop + lh * lines.length + 20);

  drawFooter(ctx, w, h - (story ? 90 : 62), 84, input.date, "#91a6c7", starGold);
}

/** 8. Đất nung (Terracotta) — warm Mediterranean clay & sunlit limestone inverted stage. */
function drawTerracotta(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";
  const clay = "#a6583d";
  const espresso = "#39221a";

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#b66749");
  bg.addColorStop(1, "#8e472f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Upper limestone card resting over the bold terracotta scripture stage.
  const cardX = 56;
  const cardW = w - cardX * 2;
  const cardY = story ? 104 : 48;
  const cardH = story ? 1110 : 816;

  ctx.save();
  ctx.shadowColor = "rgba(57, 34, 26, 0.22)";
  ctx.shadowBlur = 42;
  ctx.shadowOffsetY = 16;
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 48);
  ctx.fillStyle = "#f7f1e6";
  ctx.fill();
  ctx.restore();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const idY = cardY + (story ? 104 : 80);
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "center",
      x: w / 2,
      y: idY,
      radius: 32,
      fontSize: 32,
      ringColor: clay,
      gapColor: "#f7f1e6",
      fillColor: "#efe2cf",
      initialColor: clay,
      textColor: espresso,
    });
  } else {
    ctx.fillStyle = clay;
    ctx.font = `500 32px ${SANS}`;
    ctx.fillText(input.text.site, w / 2, idY);
  }

  const diskY = cardY + (story ? 324 : 244);
  const diskR = story ? 148 : 120;
  ctx.fillStyle = "#f0dfc1";
  ctx.beginPath();
  ctx.arc(w / 2, diskY, diskR, 0, Math.PI * 2);
  ctx.fill();
  const flameSize = story ? 216 : 178;
  ctx.drawImage(assets.flame, w / 2 - flameSize / 2, diskY - flameSize / 2, flameSize, flameSize);

  ctx.fillStyle = espresso;
  ctx.font = `600 ${story ? 236 : 196}px ${SERIF}`;
  ctx.fillText(String(input.days), w / 2, cardY + (story ? 692 : 522));
  ctx.fillStyle = "#7d4530";
  ctx.font = `400 ${story ? 42 : 38}px ${SANS}`;
  ctx.fillText(input.text.tagline, w / 2, cardY + (story ? 764 : 582));

  // 30-day warm terracotta pebbles inside the limestone card.
  const dotR = story ? 14 : 11.5;
  const gap = story ? 56 : 48;
  const left = w / 2 - (gap * 9) / 2;
  const dotTop = cardY + (story ? 856 : 646);
  input.last30.forEach((on, i) => {
    ctx.fillStyle = on ? clay : "#e5d9c7";
    ctx.beginPath();
    ctx.arc(left + (i % 10) * gap, dotTop + Math.floor(i / 10) * gap, dotR, 0, Math.PI * 2);
    ctx.fill();
  });

  // Lower terracotta scripture stage.
  const stageTop = cardY + cardH;
  const stageBottom = h - (story ? 130 : 96);
  const { lines, px } = fitVerse(ctx, input.text.verse, 860, story ? [44, 38, 34] : [40, 36, 32], 3);
  const lh = Math.round(px * 1.44);
  const refGap = 44;
  const blockH = (lines.length - 1) * lh + refGap;
  const verseY = stageTop + (stageBottom - stageTop - blockH) / 2 + Math.round(px * 0.32);

  ctx.fillStyle = "#fbf6ee";
  ctx.font = `italic 400 ${px}px ${SERIF}`;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, verseY + i * lh));
  ctx.fillStyle = "#f4d594";
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, verseY + (lines.length - 1) * lh + refGap + 8);

  drawFooter(ctx, w, h - (story ? 74 : 46), 76, input.date, "#ebd2c4", "#f4d594");
}

/** 9. Sổ tay (Journal) — dot-grid reading notebook with margin line, taped flame sticker, highlighter swipe, and checkmarks. */
function drawJournal(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";

  ctx.fillStyle = "#faf7ef";
  ctx.fillRect(0, 0, w, h);

  // Subtle dot-grid paper pattern.
  ctx.fillStyle = "rgba(99, 106, 98, 0.2)";
  const dotStep = 36;
  for (let y = dotStep; y < h; y += dotStep) {
    for (let x = dotStep; x < w; x += dotStep) {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Classic notebook vertical margin rule on the left.
  ctx.strokeStyle = "rgba(182, 92, 74, 0.34)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(74, 0);
  ctx.lineTo(74, h);
  ctx.stroke();

  const colX = 114;
  const colR = w - 72;
  const colW = colR - colX;
  ctx.textBaseline = "alphabetic";

  // Top row: identity left, soft date-stamp pill right.
  const topY = story ? 228 : 124;
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "left",
      x: colX,
      y: topY,
      radius: 28,
      fontSize: 32,
      maxWidth: 520,
      ringColor: C.accent,
      gapColor: "#faf7ef",
      fillColor: C.side,
      initialColor: C.accent,
      textColor: C.ink,
    });
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = C.accent;
    ctx.font = `500 32px ${SANS}`;
    ctx.fillText(input.text.site, colX, topY);
  }

  ctx.font = `500 26px ${SANS}`;
  const dateW = ctx.measureText(input.date).width;
  roundRectPath(ctx, colR - dateW - 40, topY - 38, dateW + 40, 52, 26);
  ctx.fillStyle = "#efe8d6";
  ctx.fill();
  ctx.textAlign = "right";
  ctx.fillStyle = "#5c635b";
  ctx.fillText(input.date, colR - 20, topY - 4);

  // Slightly tilted taped polaroid/sticker card on the right holding the flame.
  const stW = story ? 248 : 228;
  const stH = story ? 268 : 244;
  const stCx = colR - stW / 2 - 12;
  const stCy = story ? 488 : 332;
  ctx.save();
  ctx.translate(stCx, stCy);
  ctx.rotate(-0.045);
  ctx.shadowColor = "rgba(43, 46, 42, 0.12)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  roundRectPath(ctx, -stW / 2, -stH / 2, stW, stH, 20);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#ded8c8";
  ctx.lineWidth = 2;
  ctx.stroke();
  // Soft translucent washi-tape strip at top edge of sticker.
  ctx.fillStyle = "rgba(232, 201, 118, 0.55)";
  ctx.fillRect(-46, -stH / 2 - 14, 92, 28);
  const flameSize = story ? 186 : 168;
  ctx.drawImage(assets.flame, -flameSize / 2, -flameSize / 2 + 4, flameSize, flameSize);
  ctx.restore();

  // Left hero: butter-gold highlighter swipe behind the numeral baseline + crisp graphite type.
  const numY = story ? 556 : 394;
  const bigNumPx = input.days >= 100 ? (story ? 210 : 184) : story ? 258 : 222;
  ctx.font = `600 ${bigNumPx}px ${SERIF}`;
  const numW = ctx.measureText(String(input.days)).width;
  roundRectPath(ctx, colX - 10, numY - 56, Math.max(numW + 34, 150), 66, 16);
  ctx.fillStyle = "#f2e3b0";
  ctx.fill();

  ctx.textAlign = "left";
  ctx.fillStyle = "#242824";
  ctx.fillText(String(input.days), colX, numY);

  ctx.fillStyle = "#485048";
  ctx.font = `400 ${story ? 40 : 36}px ${SANS}`;
  const tagLines = wrap(ctx, input.text.tagline, colW - stW - 44);
  tagLines.forEach((line, i) => ctx.fillText(line, colX, numY + (story ? 74 : 60) + i * 48));

  // 30-day hand-checked habit tracker boxes (3 × 10).
  const cols = 10;
  const boxW = 58;
  const boxH = story ? 54 : 46;
  const gapX = (colW - cols * boxW) / (cols - 1);
  const gapY = story ? 24 : 18;
  const gridY = story ? 842 : 560;
  input.last30.forEach((on, i) => {
    const x = colX + (i % cols) * (boxW + gapX);
    const y = gridY + Math.floor(i / cols) * (boxH + gapY);
    roundRectPath(ctx, x, y, boxW, boxH, 12);
    if (on) {
      ctx.fillStyle = C.accent;
      ctx.fill();
      // Crisp white checkmark inside checked days.
      ctx.strokeStyle = "#fbfaf6";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x + boxW * 0.28, y + boxH * 0.52);
      ctx.lineTo(x + boxW * 0.44, y + boxH * 0.68);
      ctx.lineTo(x + boxW * 0.72, y + boxH * 0.34);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#d5d0c3";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Sage-highlighted annotation card for the daily verse.
  const noteY = story ? 1230 : 824;
  const { lines, px } = fitVerse(ctx, input.text.verse, colW - 64, story ? [44, 38, 34] : [40, 36, 32], 3);
  const lh = Math.round(px * 1.46);
  const noteH = lines.length * lh + 128;
  roundRectPath(ctx, colX, noteY, colW, noteH, 24);
  ctx.fillStyle = "#edf2ea";
  ctx.fill();
  ctx.strokeStyle = "#d3dfd0";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = C.ink;
  ctx.font = `italic 400 ${px}px ${SERIF}`;
  const textStart = noteY + 72;
  lines.forEach((line, i) => ctx.fillText(line, colX + 34, textStart + i * lh));

  ctx.font = `500 28px ${SANS}`;
  const refW = ctx.measureText(input.text.verseRef).width;
  const refY = textStart + lines.length * lh + 18;
  roundRectPath(ctx, colX + 26, refY - 32, refW + 24, 42, 10);
  ctx.fillStyle = "#d9e7d6";
  ctx.fill();
  ctx.fillStyle = "#365642";
  ctx.fillText(input.text.verseRef, colX + 38, refY);

  // Subtle notebook footer.
  ctx.textAlign = "right";
  ctx.fillStyle = C.accent;
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText(SITE_HOST, colR, h - (story ? 86 : 52));
}

/** 10. Mực đen (Ink Print) — stark Swiss-grid monochrome gallery poster where the flame is the sole jewel of color. */
function drawMonochrome(ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) {
  const { w, h } = SIZES[input.size];
  const story = input.size === "story";
  const ink = "#161716";
  const paper = "#f7f7f4";

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, w, h);

  const fx = 44;
  const fy = story ? 120 : 44;
  const fw = w - fx * 2;
  const fh = h - fy * 2;

  const row1H = story ? 116 : 96;
  const row2H = story ? 530 : 416;
  const row3H = story ? 204 : 168;
  const footH = story ? 94 : 78;

  const y1 = fy + row1H;
  const y2 = y1 + row2H;
  const y3 = y2 + row3H;
  const yFoot = fy + fh - footH;

  const splitTop = fx + Math.round(fw * 0.68);
  const splitHero = fx + Math.round(fw * 0.6);

  // Inverted pure-ink tile on the right side of the hero row.
  ctx.fillStyle = ink;
  ctx.fillRect(splitHero, y1, fx + fw - splitHero, row2H);

  // Bold architectural grid borders.
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(fx, fy, fw, fh);
  ctx.beginPath();
  // Horizontal compartment rules.
  ctx.moveTo(fx, y1);
  ctx.lineTo(fx + fw, y1);
  ctx.moveTo(fx, y2);
  ctx.lineTo(fx + fw, y2);
  ctx.moveTo(fx, y3);
  ctx.lineTo(fx + fw, y3);
  ctx.moveTo(fx, yFoot);
  ctx.lineTo(fx + fw, yFoot);
  // Vertical splits.
  ctx.moveTo(splitTop, fy);
  ctx.lineTo(splitTop, y1);
  ctx.moveTo(splitHero, y1);
  ctx.lineTo(splitHero, y2);
  ctx.stroke();

  ctx.textBaseline = "alphabetic";

  // Row 1: identity left cell, date right cell.
  const r1TextY = fy + Math.round(row1H * 0.62);
  if (input.identity) {
    drawIdentity(ctx, { name: input.identity.name, avatar: assets.avatar }, {
      align: "left",
      x: fx + 36,
      y: r1TextY,
      radius: 26,
      fontSize: 30,
      maxWidth: splitTop - fx - 120,
      ringColor: ink,
      gapColor: paper,
      fillColor: "#e6e6e0",
      initialColor: ink,
      textColor: ink,
    });
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    ctx.font = `600 30px ${SANS}`;
    ctx.fillText(input.text.site, fx + 36, r1TextY);
  }
  ctx.textAlign = "center";
  ctx.fillStyle = ink;
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText(input.date, splitTop + (fx + fw - splitTop) / 2, r1TextY);

  // Row 2 left: giant monochrome numeral + tagline.
  const leftW = splitHero - fx;
  const bigNumPx = input.days >= 100 ? (story ? 210 : 184) : story ? 286 : 238;
  ctx.textAlign = "left";
  ctx.fillStyle = ink;
  ctx.font = `600 ${bigNumPx}px ${SERIF}`;
  const numY = y1 + (story ? 316 : 254);
  ctx.fillText(String(input.days), fx + 40, numY);

  ctx.fillStyle = "#3a3c39";
  ctx.font = `500 ${story ? 40 : 36}px ${SANS}`;
  const tagLines = wrap(ctx, input.text.tagline, leftW - 76);
  tagLines.forEach((line, i) => ctx.fillText(line, fx + 44, numY + (story ? 76 : 62) + i * 48));

  // Row 2 right: stark black gallery tile with white circular aperture for the golden flame.
  const rightCx = splitHero + (fx + fw - splitHero) / 2;
  const rightCy = y1 + row2H / 2;
  const discR = story ? 132 : 114;
  ctx.fillStyle = paper;
  ctx.beginPath();
  ctx.arc(rightCx, rightCy, discR, 0, Math.PI * 2);
  ctx.fill();
  const flameSize = story ? 196 : 168;
  ctx.drawImage(assets.flame, rightCx - flameSize / 2, rightCy - flameSize / 2, flameSize, flameSize);

  // Row 3: 30 crisp vertical monochrome ink bars + numeric ratio.
  const activeDays = input.last30.filter(Boolean).length;
  const pad3 = 44;
  ctx.textAlign = "right";
  ctx.fillStyle = ink;
  ctx.font = `600 28px ${SANS}`;
  ctx.fillText(`${activeDays} / 30`, fx + fw - pad3, y2 + (story ? 52 : 44));

  const barCount = 30;
  const barW = 19;
  const barGap = (fw - pad3 * 2 - barCount * barW) / (barCount - 1);
  const barH = story ? 86 : 68;
  const barY = y2 + (story ? 82 : 68);
  input.last30.forEach((on, i) => {
    const bx = fx + pad3 + i * (barW + barGap);
    ctx.fillStyle = on ? ink : "#dcdcd5";
    ctx.fillRect(bx, on ? barY : barY + Math.round(barH * 0.45), barW, on ? barH : Math.round(barH * 0.55));
  });

  // Row 4: generous gallery scripture compartment.
  const { lines, px } = fitVerse(ctx, input.text.verse, fw - 120, story ? [48, 42, 36] : [42, 38, 34], 3);
  const lh = Math.round(px * 1.44);
  const refGap = 48;
  const contentH = (lines.length - 1) * lh + refGap;
  const verseY = y3 + (yFoot - y3 - contentH) / 2 + Math.round(px * 0.34);

  ctx.textAlign = "center";
  ctx.fillStyle = ink;
  ctx.font = `italic 400 ${px}px ${SERIF}`;
  lines.forEach((line, i) => ctx.fillText(line, w / 2, verseY + i * lh));
  ctx.fillStyle = "#5c5f5a";
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, verseY + (lines.length - 1) * lh + refGap + 8);

  // Row 5: centered colophon URL.
  ctx.textAlign = "center";
  ctx.fillStyle = ink;
  ctx.font = `600 28px ${SANS}`;
  ctx.fillText(SITE_HOST, w / 2, yFoot + Math.round(footH * 0.62));
}

const RENDERERS: Record<ShareTemplate, (ctx: CanvasRenderingContext2D, input: ShareCardInput, assets: LoadedAssets) => void> = {
  paper: drawPaper,
  night: drawNight,
  moss: drawMoss,
  manuscript: drawManuscript,
  dawn: drawDawn,
  editorial: drawEditorial,
  postcard: drawPostcard,
  celestial: drawCelestial,
  terracotta: drawTerracotta,
  journal: drawJournal,
  monochrome: drawMonochrome,
};

/** Paints the streak share card onto `canvas` in the chosen template. */
export async function paintShareCard(canvas: HTMLCanvasElement, input: ShareCardInput): Promise<void> {
  const { w, h } = SIZES[input.size];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  // fonts.ready only covers faces the page already uses; the card's italic verse may not be one of them.
  await Promise.all(
    [`italic 400 44px ${SERIF}`, `600 230px ${SERIF}`, `500 36px ${SANS}`, `400 46px ${SANS}`].map((f) => document.fonts?.load(f)),
  );
  const flame = await loadImage(flameDataUrl(input.flame, "lit"));
  const avatar = input.identity?.avatar ? await loadImage(input.identity.avatar).catch(() => null) : null;
  const template = input.template ?? DEFAULT_SHARE_TEMPLATE;

  RENDERERS[template](ctx, input, { flame, avatar });
}

/** Draws the streak share card in the chosen template and returns it as a PNG. */
export async function drawShareCard(input: ShareCardInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  await paintShareCard(canvas, input);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

const pngFile = (blob: Blob, filename: string) => new File([blob], filename, { type: "image/png" });

/** True when the system share sheet takes this PNG; otherwise `shareOrDownload` downloads it. */
export function canSharePng(blob: Blob, filename: string): boolean {
  return navigator.canShare?.({ files: [pngFile(blob, filename)] }) ?? false;
}

/** System share sheet with the PNG when the browser can share files; otherwise a download. */
export async function shareOrDownload(blob: Blob, filename: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = pngFile(blob, filename);
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
      throw e;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}

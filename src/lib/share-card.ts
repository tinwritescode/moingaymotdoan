import { flameDataUrl, type FlameKind } from "../../lib/streak/flames";
import { initialOf } from "../../lib/profile/profile";
import { addDays } from "../../lib/streak/streak";

export type ShareSize = "post" | "story";

// `foot` is the date and URL baseline's distance from the bottom edge. The post card sits 40px high so a
// two-line verse and its reference clear the footer row.
const SIZES: Record<ShareSize, { w: number; h: number; top: number; foot: number }> = {
  post: { w: 1080, h: 1350, top: -40, foot: 50 },
  story: { w: 1080, h: 1920, top: 240, foot: 70 },
};

const C = { paper: "#f4f3ee", ink: "#2b2e2a", muted: "#636a62", accent: "#4d7059", rule: "#e2e1d9", mark: "#eee5c8", side: "#e3ebe2" };
const SANS = "Lexend, system-ui, sans-serif";
const SERIF = '"Source Serif 4", Georgia, serif';

/** Whether each of the last 30 days, oldest first and ending today, had a đoạn read. */
export function last30Days(readDays: ReadonlyMap<string, number>, today: string): boolean[] {
  return Array.from({ length: 30 }, (_, i) => (readDays.get(addDays(today, i - 29)) ?? 0) > 0);
}

export type ShareCardInput = {
  size: ShareSize;
  days: number;
  flame: FlameKind;
  last30: boolean[];
  /** As printed, e.g. 29.11.2026. */
  date: string;
  text: { site: string; tagline: string; verse: string; verseRef: string };
  /** The reader's name and photo (an image URL) in place of the site name; none keeps the site name. */
  identity?: { name: string; avatar: string | null } | null;
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

/** The reader's photo in a ringed circle (or their initial), then their name, centred as a pair on baseline `y`. */
function drawIdentity(ctx: CanvasRenderingContext2D, identity: { name: string; avatar: HTMLImageElement | null }, w: number, y: number) {
  const r = 38;
  ctx.font = `500 36px ${SANS}`;
  const name = fitText(identity.name, 760, (s) => ctx.measureText(s).width);
  const left = (w - (2 * r + 22 + ctx.measureText(name).width)) / 2;
  const cx = left + r;
  const cy = y - 13;
  const circle = (radius: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  circle(r + 6, C.accent);
  circle(r + 3, C.paper);
  circle(r, C.side);
  const img = identity.avatar;
  if (img) {
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.save();
    ctx.clip();
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, cx - r, cy - r, 2 * r, 2 * r);
    ctx.restore();
  } else {
    ctx.fillStyle = C.accent;
    ctx.font = `600 40px ${SERIF}`;
    ctx.textAlign = "center";
    ctx.fillText(initialOf(identity.name), cx, cy + 14);
  }
  ctx.fillStyle = C.ink;
  ctx.font = `500 36px ${SANS}`;
  ctx.textAlign = "left";
  ctx.fillText(name, cx + r + 22, y);
  ctx.textAlign = "center";
}

/** Draws the streak share card (design: ShareCard / ShareStory boards) and returns it as a PNG. */
export async function drawShareCard(input: ShareCardInput): Promise<Blob> {
  const { w, h, top, foot } = SIZES[input.size];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  // fonts.ready only covers faces the page already uses; the card's italic verse may not be one of them.
  await Promise.all(
    [`italic 400 40px ${SERIF}`, `600 230px ${SERIF}`, `500 34px ${SANS}`, `400 46px ${SANS}`].map((f) => document.fonts?.load(f)),
  );
  const flame = await loadImage(flameDataUrl(input.flame, "lit"));
  const { identity } = input;
  const avatar = identity?.avatar ? await loadImage(identity.avatar).catch(() => null) : null;

  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  if (identity) drawIdentity(ctx, { name: identity.name, avatar }, w, top + 120);
  else {
    ctx.fillStyle = C.accent;
    ctx.font = `500 34px ${SANS}`;
    ctx.fillText(input.text.site, w / 2, top + 120);
  }

  ctx.fillStyle = C.mark;
  ctx.beginPath();
  ctx.arc(w / 2, top + 370, 190, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(flame, w / 2 - 136, top + 234, 272, 272);

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
  // Two lines fit above the footer; a longer verse sets smaller rather than run into it.
  let verse: string[] = [];
  for (const px of [40, 36, 32]) {
    ctx.font = `italic 400 ${px}px ${SERIF}`;
    verse = wrap(ctx, input.text.verse, 860);
    if (verse.length <= 2) break;
  }
  verse.forEach((line, i) => ctx.fillText(line, w / 2, verseTop + i * 54));
  ctx.fillStyle = C.muted;
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText(input.text.verseRef, w / 2, verseTop + 54 * verse.length + 24);

  ctx.font = `400 30px ${SANS}`;
  ctx.textAlign = "left";
  ctx.fillText(input.date, 80, h - foot);
  ctx.textAlign = "right";
  ctx.fillStyle = C.accent;
  ctx.fillText("moingaymotdoan.xyz", w - 80, h - foot);

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

import { MAX_AVATAR_LENGTH } from "../../lib/profile/profile";

const SIZE = 256;

/** A photo as a 256px square JPEG data URL, centre-cropped; null when it cannot be read or stays over the size limit. */
export async function squareJpeg(photo: Blob): Promise<string | null> {
  const bitmap = await createImageBitmap(photo).catch(() => null);
  if (!bitmap) return null;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  // JPEG has no transparency; a see-through PNG would otherwise turn black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SIZE, SIZE);
  const side = Math.min(bitmap.width, bitmap.height);
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bitmap.close();
  for (const quality of [0.85, 0.7, 0.5]) {
    const url = canvas.toDataURL("image/jpeg", quality);
    if (url.length <= MAX_AVATAR_LENGTH) return url;
  }
  return null;
}

/** The account's photo (another origin) as a stored avatar; null when that server refuses CORS or the photo is unreadable. */
export async function avatarFromUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    return res.ok ? await squareJpeg(await res.blob()) : null;
  } catch {
    return null;
  }
}

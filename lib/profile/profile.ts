/** The name and photo a reader puts on their share card. `avatar` is a square JPEG as a data URL, or none. */
export type ReaderProfile = { name: string; avatar: string | null };

export const MAX_NAME_LENGTH = 40;
/** A 256px JPEG runs 20–40 KB of base64; this leaves room and keeps rows small. */
export const MAX_AVATAR_LENGTH = 100_000;

const JPEG_DATA_URL = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/u;
// Letters, marks, digits, punctuation and spaces; no control or format characters.
const CONTROL = /[\p{Cc}\p{Cf}]/u;

/** A profile from storage or the network; null for anything malformed. */
export function parseProfile(v: unknown): ReaderProfile | null {
  if (typeof v !== "object" || v === null) return null;
  if (!("name" in v) || typeof v.name !== "string") return null;
  const name = v.name.normalize("NFC").trim();
  if (name === "" || [...name].length > MAX_NAME_LENGTH || CONTROL.test(name)) return null;
  if (!("avatar" in v)) return null;
  const avatar = v.avatar;
  if (avatar !== null && (typeof avatar !== "string" || avatar.length > MAX_AVATAR_LENGTH || !JPEG_DATA_URL.test(avatar))) {
    return null;
  }
  return { name, avatar };
}

/** The first letter of a name, uppercased, for an avatar without a photo. */
export function initialOf(name: string): string {
  return ([...name.normalize("NFC").trim()][0] ?? "").toLocaleUpperCase("vi");
}

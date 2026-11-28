import { describe, expect, it } from "vitest";
import { MAX_AVATAR_LENGTH, initialOf, parseProfile } from "./profile";

const JPEG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ==";

describe("parseProfile", () => {
  it("keeps a trimmed name and a JPEG data URL", () => {
    expect(parseProfile({ name: "  Tin Nguyễn  ", avatar: JPEG })).toEqual({ name: "Tin Nguyễn", avatar: JPEG });
    expect(parseProfile({ name: "Tin", avatar: null })).toEqual({ name: "Tin", avatar: null });
  });

  it("refuses a missing, blank, too long or control-character name", () => {
    for (const name of [undefined, "", "   ", "x".repeat(41), "Tin\nNguyễn"]) {
      expect(parseProfile({ name, avatar: null })).toBeNull();
    }
  });

  it("refuses an avatar that is not a small JPEG data URL", () => {
    for (const avatar of [
      "https://example.com/me.jpg",
      "data:image/png;base64,iVBORw0KGgo=",
      "data:image/jpeg;base64,<script>",
      `data:image/jpeg;base64,${"A".repeat(MAX_AVATAR_LENGTH)}`,
      undefined,
    ]) {
      expect(parseProfile({ name: "Tin", avatar })).toBeNull();
    }
  });
});

describe("initialOf", () => {
  it("is the name's first letter, uppercased, whole even when it is a combined character", () => {
    expect(initialOf("tin")).toBe("T");
    expect(initialOf("Ê-xơ-ra")).toBe("Ê");
    expect(initialOf("đức")).toBe("Đ");
  });
});

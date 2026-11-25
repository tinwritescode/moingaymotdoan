import { describe, expect, it } from "vitest";
import { formatWorkosUser, translateAuthError } from "./auth";

describe("WorkOS auth helpers", () => {
  it("formats WorkOS user display name with graceful fallbacks", () => {
    expect(
      formatWorkosUser({
        id: "user_01",
        email: "anh@example.com",
        firstName: "Minh",
        lastName: "Anh",
        profilePictureUrl: "https://example.com/a.jpg",
      }),
    ).toEqual({
      id: "user_01",
      email: "anh@example.com",
      name: "Minh Anh",
      avatarUrl: "https://example.com/a.jpg",
    });

    expect(
      formatWorkosUser({
        id: "user_02",
        email: "reader@example.com",
        firstName: null,
        lastName: null,
        profilePictureUrl: null,
      }),
    ).toEqual({
      id: "user_02",
      email: "reader@example.com",
      name: "reader",
      avatarUrl: null,
    });
  });

  it("translates WorkOS OAuth errors to Vietnamese", () => {
    expect(translateAuthError("access_denied")).toBe("Bạn đã hủy quá trình đăng nhập.");
    expect(translateAuthError("invalid_redirect_uri")).toContain("WorkOS Dashboard");
    expect(translateAuthError(new Error("invalid_grant"))).toContain("Phiên đăng nhập đã hết hạn");
  });
});

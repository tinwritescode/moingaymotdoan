import { describe, expect, it } from "vitest";
import { translateAuthError } from "./auth";

describe("translateAuthError", () => {
  it("translates Neon Auth error codes to Vietnamese", () => {
    expect(translateAuthError({ code: "invalid_credentials" })).toBe(
      "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
    );
    expect(translateAuthError({ code: "INVALID_EMAIL_OR_PASSWORD" })).toBe(
      "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
    );
    expect(translateAuthError({ code: "USER_ALREADY_EXISTS" })).toBe(
      "Email này đã được đăng ký. Hãy chuyển sang tab Đăng nhập.",
    );
    expect(translateAuthError({ code: "PASSWORD_TOO_SHORT" })).toBe("Mật khẩu cần có ít nhất 8 ký tự.");
  });
});

import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { ProfileRemote } from "../../lib/history/ports";
import { AuthProvider } from "./auth-context";
import { ProfileEditor } from "./profile-editor";
import { ProfileProvider, useProfile } from "./profile-context";
import { signedInSession } from "./streak-fixtures";

const photo = "data:image/jpeg;base64,AAAA";
vi.mock("../lib/avatar", () => ({
  squareJpeg: vi.fn(async (file: File) => (file.name === "ok.jpg" ? "data:image/jpeg;base64,AAAA" : null)),
  avatarFromUrl: vi.fn(async () => null),
}));

function Shown() {
  const p = useProfile();
  return <p>{p.profile() ? `shown: ${p.profile()?.name} ${p.profile()?.avatar ?? "no photo"}` : "shown: none"}</p>;
}

const editing = (onClose = vi.fn()) => {
  const view = render(() => (
    <ProfileProvider>
      <ProfileEditor onClose={onClose} />
      <Shown />
    </ProfileProvider>
  ));
  flush();
  return { view, onClose };
};

const pickFile = (input: HTMLElement, name: string) =>
  fireEvent.change(input, { target: { files: [new File(["x"], name, { type: "image/jpeg" })] } });

describe("<ProfileEditor />", () => {
  afterEach(() => localStorage.clear());

  test("saves the name and picked photo, then closes", async () => {
    const { view, onClose } = editing();
    fireEvent.input(view.getByLabelText("Tên hiện trên thẻ"), { target: { value: "  Bé Na " } });
    pickFile(view.getByLabelText("Thêm ảnh"), "ok.jpg");
    await view.findByRole("button", { name: "Bỏ ảnh" });
    fireEvent.click(view.getByRole("button", { name: "Lưu" }));
    await view.findByText(`shown: Bé Na ${photo}`);
    expect(onClose).toHaveBeenCalled();
  });

  test("a photo it cannot read says so and keeps none", async () => {
    const { view } = editing();
    pickFile(view.getByLabelText("Thêm ảnh"), "broken.heic");
    await view.findByText("Không đọc được ảnh này. Thử ảnh khác nhé.");
    expect(view.queryByRole("button", { name: "Bỏ ảnh" })).toBeNull();
  });

  test("a save the server refuses stays open with the reason", async () => {
    const refusing: ProfileRemote = { fetch: async () => null, save: async () => Promise.reject(new Error("HTTP 500")) };
    const onClose = vi.fn();
    const view = render(() => (
      <AuthProvider session={signedInSession("user_tin", { name: "Tin" })}>
        <ProfileProvider remoteFor={() => refusing}>
          <ProfileEditor onClose={onClose} />
        </ProfileProvider>
      </AuthProvider>
    ));
    flush();
    await vi.waitFor(() => expect(view.getByLabelText<HTMLInputElement>("Tên hiện trên thẻ").value).toBe("Tin"));
    fireEvent.click(view.getByRole("button", { name: "Lưu" }));
    await view.findByText("Chưa lưu được. Thử lại nhé.");
    expect(onClose).not.toHaveBeenCalled();
  });
});

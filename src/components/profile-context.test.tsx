import { render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createMemoryHistoryRepository, createMemoryProfileRemote } from "../../lib/history/memory-adapters";
import type { HistoryRepository } from "../../lib/history/ports";
import { AuthProvider } from "./auth-context";
import { CARD_IDENTITY_STORAGE_KEY, PROFILE_STORAGE_KEY, ProfileProvider, useProfile } from "./profile-context";
import { signedInSession } from "./streak-fixtures";

const photo = "data:image/jpeg;base64,AAAA";

function Probe() {
  const p = useProfile();
  return (
    <>
      <p>{p.profile() ? `${p.profile()?.name} ${p.profile()?.avatar ?? "no photo"}` : "none"}</p>
      <p>{p.onCard() ? "on card" : "off card"}</p>
      <button onClick={() => void p.save({ name: "Bé Na", avatar: photo })}>save</button>
      <button onClick={() => p.setOnCard(!p.onCard())}>toggle</button>
    </>
  );
}

const guest = () => {
  const view = render(() => (
    <ProfileProvider>
      <Probe />
    </ProfileProvider>
  ));
  flush();
  return view;
};

const reader = (server: HistoryRepository, account = { name: "Tin Nguyen", avatarUrl: "https://img.test/tin.jpg" }) => {
  const view = render(() => (
    <AuthProvider session={signedInSession("user_tin", account)}>
      <ProfileProvider remoteFor={(id) => createMemoryProfileRemote(server, id)}>
        <Probe />
      </ProfileProvider>
    </AuthProvider>
  ));
  flush();
  return view;
};

describe("<ProfileProvider />", () => {
  afterEach(() => localStorage.clear());

  test("a guest has no name until they set one, and this device keeps it", async () => {
    const first = guest();
    first.getByText("none");
    first.getByText("save").click();
    flush();
    await first.findByText(`Bé Na ${photo}`);
    first.unmount();
    await guest().findByText(`Bé Na ${photo}`);
  });

  test("a reader starts with their account's name and photo", async () => {
    await reader(createMemoryHistoryRepository()).findByText("Tin Nguyen https://img.test/tin.jpg");
  });

  test("a reader's saved name and photo follow them to another device", async () => {
    const server = createMemoryHistoryRepository();
    const phone = reader(server);
    await phone.findByText("Tin Nguyen https://img.test/tin.jpg");
    phone.getByText("save").click();
    await phone.findByText(`Bé Na ${photo}`);
    phone.unmount();
    expect(localStorage.getItem(PROFILE_STORAGE_KEY)).toBeNull();
    await reader(server).findByText(`Bé Na ${photo}`);
  });

  test("a name set as a guest moves to the account on sign-in", async () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ name: "Bé Na", avatar: null }));
    const server = createMemoryHistoryRepository();
    await reader(server).findByText("Bé Na no photo");
    await vi.waitFor(async () => expect(await server.fetchProfile("user_tin")).toEqual({ name: "Bé Na", avatar: null }));
  });

  test("hiding the name from the card is remembered on this device", async () => {
    const first = guest();
    first.getByText("on card");
    first.getByText("toggle").click();
    flush();
    first.getByText("off card");
    expect(localStorage.getItem(CARD_IDENTITY_STORAGE_KEY)).toBe("off");
    first.unmount();
    guest().getByText("off card");
  });
});

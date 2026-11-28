import { createSignal } from "solid-js";
import type { SubscriptionPayload } from "../../lib/streak/push-contract";
import { getHistoryApiUrl } from "./browser-history-adapters";

/** Everything the server keeps about a device except its subscription. */
export type SubscriptionReport = Omit<SubscriptionPayload, "endpoint" | "p256dh" | "auth">;

const SENT_KEY = "kt:push:sent";
const vapidKey = (): string => (import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "").trim();
const endpointUrl = (): string => `${getHistoryApiUrl()}/push/subscription`;

/** Reminders need Web Push, a service worker, the VAPID key and the history API. */
export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    vapidKey() !== "" &&
    getHistoryApiUrl() !== "" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

const [subscription, setSubscription] = createSignal<PushSubscription | null>(null);

/** This device's push subscription, once `loadSubscription` has looked. */
export { subscription };

export async function loadSubscription(): Promise<void> {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.getRegistration();
  setSubscription((await reg?.pushManager.getSubscription()) ?? null);
}

function base64UrlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s.replace(/-/gu, "+").replace(/_/gu, "/") + "=".repeat((4 - (s.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function storedSent(): string | null {
  try {
    return localStorage.getItem(SENT_KEY);
  } catch {
    return null;
  }
}

function storeSent(value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(SENT_KEY);
    else localStorage.setItem(SENT_KEY, value);
  } catch {
    // shortcut: without storage the device re-sends its report each page load, harmless.
  }
}

/** Upserts the device on the server; skips a report identical to the last one sent. */
export async function putSubscription(sub: PushSubscription, report: SubscriptionReport): Promise<boolean> {
  const body = JSON.stringify({ subscription: sub.toJSON(), ...report });
  if (storedSent() === body) return true;
  try {
    const res = await fetch(endpointUrl(), { method: "PUT", headers: { "content-type": "application/json" }, body });
    if (!res.ok) return false;
    storeSent(body);
    return true;
  } catch {
    return false;
  }
}

export type SubscribeResult = "on" | "blocked" | "failed";

/** Asks for permission, subscribes and registers the device with its first report. */
export async function subscribe(report: SubscriptionReport): Promise<SubscribeResult> {
  const permission = await Notification.requestPermission();
  if (permission === "denied") return "blocked";
  if (permission !== "granted") return "failed";
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToBytes(vapidKey()) });
    if (!(await putSubscription(sub, report))) {
      await sub.unsubscribe();
      return "failed";
    }
    setSubscription(sub);
    return "on";
  } catch {
    return "failed";
  }
}

export async function unsubscribe(): Promise<void> {
  const sub = subscription();
  if (!sub) return;
  setSubscription(null);
  storeSent(null);
  await Promise.allSettled([
    fetch(endpointUrl(), {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    }),
    sub.unsubscribe(),
  ]);
}

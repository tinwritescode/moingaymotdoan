import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import {
  createContext,
  createMemo,
  createSignal,
  onSettled,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import type { ProfileRemote } from "../../lib/history/ports";
import { parseProfile, type ReaderProfile } from "../../lib/profile/profile";
import { createHttpProfileRemote, getHistoryApiUrl } from "../lib/browser-history-adapters";
import { useAuth } from "./auth-context";
import { readStorage, writeStorage } from "./preferences-context";

/** A guest's name and photo; a signed-in reader's live on the server. */
export const PROFILE_STORAGE_KEY = "kt:profile:v1";
/** "off" when the reader hides their name and photo from the share card. */
export const CARD_IDENTITY_STORAGE_KEY = "kt:card-identity:v1";

export type ProfileContextValue = {
  /**
   * The name and photo to show on the share card and in the header: the reader's own, else their account's;
   * null for a guest who has set none. `avatar` is an image URL (a JPEG data URL, or the account's photo).
   */
  profile: Accessor<ReaderProfile | null>;
  /** Whether the share card shows them; a device setting, on by default. */
  onCard: Accessor<boolean>;
  setOnCard: (on: boolean) => void;
  /** Saves to the account when signed in, else to this device; rejects when the server does not take it. */
  save: (profile: ReaderProfile) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue>({
  profile: () => null,
  onCard: () => true,
  setOnCard: () => {},
  save: async () => {},
});

function readDeviceProfile(): ReaderProfile | null {
  try {
    return parseProfile(JSON.parse(readStorage(PROFILE_STORAGE_KEY) ?? "null"));
  } catch {
    return null;
  }
}

/** The reader's share-card name and photo. `remoteFor` replaces the history API in tests. */
export function ProfileProvider(props: ParentProps<{ remoteFor?: (userId: string) => ProfileRemote | null }>) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [device, setDevice] = createSignal<ReaderProfile | null>(null);
  const [onCard, setOnCard] = createSignal(true);
  const [loaded, setLoaded] = createSignal(false);

  onSettled(() => {
    setDevice(readDeviceProfile());
    setOnCard(readStorage(CARD_IDENTITY_STORAGE_KEY) !== "off");
    setLoaded(true);
  });

  const remote = (userId: string): ProfileRemote | null => {
    if (props.remoteFor) return props.remoteFor(userId);
    const baseUrl = getHistoryApiUrl();
    return baseUrl ? createHttpProfileRemote({ baseUrl, getAccessToken: (force) => auth.getAccessToken(force) }) : null;
  };
  const profileKey = (userId: string) => ["profile", userId] as const;

  // The account's saved profile; a name set as a guest on this device moves to an account without one.
  const loadAccount = async (userId: string): Promise<ReaderProfile | null> => {
    const server = remote(userId);
    const guestProfile = device();
    if (!server) return null;
    return (await server.fetch()) ?? (guestProfile ? server.save(guestProfile) : null);
  };
  const userId = createMemo(() => (loaded() ? (auth.user()?.id ?? "") : ""));
  const account = useQuery(() => ({
    queryKey: profileKey(userId()),
    queryFn: () => loadAccount(userId()),
    enabled: userId() !== "" && remote(userId()) !== null,
    staleTime: Infinity,
  }));

  const saveToAccount = useMutation(() => ({
    mutationFn: async ({ userId, profile }: { userId: string; profile: ReaderProfile }) => {
      const server = remote(userId);
      if (!server) throw new Error("No profile service");
      return server.save(profile);
    },
    onSuccess: (saved, { userId }) => queryClient.setQueryData(profileKey(userId), saved),
  }));

  const profile = createMemo<ReaderProfile | null>(() => {
    const user = auth.user();
    if (!user) return device();
    // A failed or pending load shows the account's name and photo; `data` would suspend or throw.
    const own = account.isSuccess ? account.data : null;
    if (own) return own;
    return user.name ? { name: user.name, avatar: user.avatarUrl } : null;
  });

  const value: ProfileContextValue = {
    profile,
    onCard,
    setOnCard: (on) => {
      setOnCard(on);
      writeStorage(CARD_IDENTITY_STORAGE_KEY, on ? null : "off");
    },
    async save(next) {
      const user = auth.user();
      if (!user) {
        setDevice(next);
        writeStorage(PROFILE_STORAGE_KEY, JSON.stringify(next));
        return;
      }
      await saveToAccount.mutate({ userId: user.id, profile: next });
    },
  };

  return <ProfileContext value={value}>{props.children}</ProfileContext>;
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}

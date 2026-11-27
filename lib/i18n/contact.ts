import { REPO_URL } from "./messages";

export type ContactIcon = "email" | "zalo" | "facebook" | "instagram" | "github" | "guide";

export type ContactChannelId = "email" | "zalo" | "facebook" | "instagram" | "githubIssues" | "contributing";

export type ContactChannel = {
  id: ContactChannelId;
  icon: ContactIcon;
  href: string;
  /** Human-readable handle or address shown on the card. */
  handle?: string;
  /** When set, the card offers a one-tap copy button for this exact string. */
  copyValue?: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
};

export const CONTACT_EMAIL = "justacloud41@gmail.com";
export const CONTACT_ZALO = "0373072464";
export const CONTACT_ZALO_DISPLAY = "0373 072 464";
export const CONTACT_FACEBOOK = "npmrunstart";
export const CONTACT_INSTAGRAM = "justacloud40";

export const DIRECT_CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: "email",
    icon: "email",
    href: `mailto:${CONTACT_EMAIL}`,
    handle: CONTACT_EMAIL,
    copyValue: CONTACT_EMAIL,
  },
  {
    id: "zalo",
    icon: "zalo",
    href: `https://zalo.me/${CONTACT_ZALO}`,
    handle: CONTACT_ZALO_DISPLAY,
    copyValue: CONTACT_ZALO,
    external: true,
  },
  {
    id: "facebook",
    icon: "facebook",
    href: `https://www.facebook.com/${CONTACT_FACEBOOK}`,
    handle: `fb.com/${CONTACT_FACEBOOK}`,
    external: true,
  },
  {
    id: "instagram",
    icon: "instagram",
    href: `https://www.instagram.com/${CONTACT_INSTAGRAM}`,
    handle: `@${CONTACT_INSTAGRAM}`,
    external: true,
  },
];

export function communityContactChannels(contributeUrl: string): readonly ContactChannel[] {
  return [
    {
      id: "githubIssues",
      icon: "github",
      href: `${REPO_URL}/issues`,
      handle: "tinwritescode/moingaymotdoan",
      external: true,
    },
    {
      id: "contributing",
      icon: "guide",
      href: contributeUrl,
      external: true,
    },
  ];
}

export type ShareTemplate =
  | "paper"
  | "night"
  | "moss"
  | "manuscript"
  | "dawn"
  | "editorial"
  | "postcard"
  | "celestial"
  | "terracotta"
  | "journal"
  | "monochrome";

export const DEFAULT_SHARE_TEMPLATE: ShareTemplate = "paper";

/** Device preference for the chosen share-card template. */
export const SHARE_TEMPLATE_STORAGE_KEY = "kt:share-template:v1";

export type ShareTemplateMeta = {
  id: ShareTemplate;
  /** Preview swatch colors [background, accent, ink] for the template selector pill. */
  swatch: readonly [string, string, string];
};

export const SHARE_TEMPLATES: readonly ShareTemplateMeta[] = [
  { id: "paper", swatch: ["#f4f3ee", "#eee5c8", "#4d7059"] },
  { id: "night", swatch: ["#141816", "#e0b553", "#f0ece2"] },
  { id: "moss", swatch: ["#2a4234", "#e6c87a", "#f4f2eb"] },
  { id: "manuscript", swatch: ["#f6f0e2", "#8b6f26", "#2b2e2a"] },
  { id: "dawn", swatch: ["#f7e6cf", "#dfeae1", "#355240"] },
  { id: "editorial", swatch: ["#fbfaf6", "#4d7059", "#1f241f"] },
  { id: "postcard", swatch: ["#e6e1d5", "#8e4a31", "#ffffff"] },
  { id: "celestial", swatch: ["#152138", "#ebd082", "#f6f3ea"] },
  { id: "terracotta", swatch: ["#a85a3e", "#f7f1e6", "#f4d594"] },
  { id: "journal", swatch: ["#faf7ef", "#dce8dc", "#4d7059"] },
  { id: "monochrome", swatch: ["#161716", "#f7f7f4", "#e0ab3c"] },
];

export function isShareTemplate(value: string | null | undefined): value is ShareTemplate {
  return SHARE_TEMPLATES.some((t) => t.id === value);
}

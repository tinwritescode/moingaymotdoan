"use client";

import { createContext } from "react";

export type VerseRange = { from: number; to: number };

/** Lets a chỗ dẫn into the chapter being read open those verses right under its paragraph, instead of a popover. */
export type InlineVerses = {
  bookCode: string;
  chapter: number;
  shown: VerseRange | null;
  toggle(range: VerseRange): void;
};

export const InlineVersesContext = createContext<InlineVerses | null>(null);

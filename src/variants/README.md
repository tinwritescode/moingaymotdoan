# Giao diện (variants)

Each `NN-name.css` here is one look the reader can pick in the "Giao diện" box (bottom right). The file name without `.css` is its id; `src/variants.ts` picks files up by itself, so adding a look touches no other file. `Gốc` (no file) is the base look in `src/app.css` plus the Tailwind classes in the components.

## How a look applies

- The chosen id sits on `<html data-variant="NN-name">`. A script in `<head>` sets it before paint, from `localStorage` (`kt-variant`) or from `?v=NN-name` in the URL (`?v=` resets to Gốc).
- Every rule in a look's file must start with `:root[data-variant="NN-name"]`, so it never leaks into another look. That includes `@media` blocks and keyframe names (prefix keyframe names with `kt-` plus the id without its number, e.g. `kt-may-chu-…`: a CSS name cannot start with a digit).
- All looks ship in one CSS bundle. Rules here are unlayered, so they beat Tailwind utilities without `!important`.

## What a look can change

1. Color tokens on `:root[data-variant="…"]`: `--paper --ink --muted --accent --rule --card --side --mark --cao --vua --thap`. Give dark values too, under `@media (prefers-color-scheme: dark) { :root[data-variant="…"] { … } }`; the base dark tokens lose to the look's selector, so without that block a look stays light at night.
2. Anything about the hooks below: layout (grid, columns, order, widths), type (size, family, weight, spacing), borders, backgrounds, decoration, motion.

Fonts: Literata, Inter and Playfair Display are already loaded; otherwise use system stacks (Georgia, Iowan Old Style, Palatino, ui-serif, ui-sans-serif, ui-monospace…). No `@import` or `url()` to outside hosts: it would load for every reader.

## Hooks

| Hook | What it is |
|---|---|
| `kt-header`, `kt-brand`, `kt-crumbs`, `kt-pager`, `kt-picker` | top bar, site name, breadcrumb, prev/next links, book picker popover |
| `kt-footer`, `kt-switcher` | source line, the look picker |
| `kt-home`, `kt-hero`, `kt-hero-title`, `kt-hero-sub` | home page and its title block |
| `kt-start`, `kt-start-title`, `kt-start-cta`, `kt-start-number` | home "bắt đầu đọc" block |
| `kt-books`, `kt-books-link`, `kt-book`, `kt-book-name`, `kt-chapter-list`, `kt-chapter-link` | home list of books, each book's section and its đoạn links |
| `kt-reader` | the đoạn page grid: `kt-toc` (left), `kt-chapter` (middle), `kt-aside` (right) |
| `kt-kicker`, `kt-title`, `kt-lead` | đoạn page label, title, lead line |
| `kt-scripture`, `kt-verse-number` | the Bible text and its raised verse numbers |
| `kt-divider` | the ornament between Bible text and notes |
| `kt-notes`, `kt-note`, `kt-note-heading`, `kt-note-body` | note sections (`<details>`), their `<summary>` and body |
| `kt-opinion`, `kt-inline-verses`, `kt-byline` | one commentator's view, quoted verses inside a note, the AI/source line |
| `kt-ref`, `kt-ref-popover` | a clickable reference and the verse box it opens |

Plain element selectors under a hook are fine (`.kt-note-body p`, `.kt-chapter h1`).

## Rules

- Readable first: body text at least 16px on phones, contrast at least 4.5:1 in light and dark, visible `:focus-visible`, no horizontal scroll at 360px wide.
- Motion only inside `@media (prefers-reduced-motion: no-preference)`.
- Never hide content or controls (`display:none` on text, notes, references, prev/next, the look picker).
- Check: `pnpm dev`, open `/?v=NN-name` and `/sang-the-ky/1?v=NN-name` (dev shows drafts), at phone and desktop width, light and dark. Then `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

import { For, onSettled } from "solid-js";
import { VARIANT_KEY, VARIANTS } from "../variants";

function pick(id: string) {
  const root = document.documentElement;
  if (id) root.dataset.variant = id;
  else delete root.dataset.variant;
  try {
    localStorage.setItem(VARIANT_KEY, id);
  } catch {
    // Storage blocked (private mode): the look still changes for this page.
  }
}

/** Lets the reader switch looks; the server can't know the saved one, so the select catches up after hydration. */
export function VariantSwitcher() {
  let select!: HTMLSelectElement;
  onSettled(() => {
    select.value = document.documentElement.dataset.variant ?? "";
  });
  return (
    <label class="kt-switcher fixed right-3 bottom-3 z-50 flex items-center gap-2 rounded-lg border border-rule bg-card px-2.5 py-1.5 font-sans text-xs text-muted shadow-md">
      Giao diện
      <select ref={select} class="bg-card text-ink" onChange={(e) => pick(e.currentTarget.value)}>
        <option value="">Gốc</option>
        <For each={VARIANTS}>{(id) => <option value={id}>{id}</option>}</For>
      </select>
    </label>
  );
}

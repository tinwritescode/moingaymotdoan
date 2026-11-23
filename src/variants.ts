// Every CSS file in src/variants is one look; its file name (without .css) is its id.
// shortcut: every look ships to every reader (one CSS bundle); load only the chosen one if the bundle grows past ~300 KB.
const files = import.meta.glob("./variants/*.css", { eager: true });

export const VARIANTS = Object.keys(files)
  .map((path) => path.slice("./variants/".length, -".css".length))
  .sort();

export const VARIANT_KEY = "kt-variant";

/** Runs in <head> before paint: `?v=<id>` (empty resets) saves a choice, then the saved choice goes on <html data-variant>. */
export const APPLY_VARIANT = `try{var q=new URLSearchParams(location.search).get("v");if(q!==null)localStorage.setItem("${VARIANT_KEY}",q);var v=localStorage.getItem("${VARIANT_KEY}");if(v)document.documentElement.dataset.variant=v}catch(e){}`;

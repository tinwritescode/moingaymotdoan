/**
 * Quiet pill toggle backed by a native `<input type="checkbox" role="switch">`, so `<label>`
 * association, Space-key toggling, and assistive-tech semantics come from the browser.
 */
export function ToggleSwitch(props: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <span class="relative inline-flex flex-none items-center">
      <input
        type="checkbox"
        role="switch"
        checked={props.checked}
        onChange={(e) => props.onChange(e.currentTarget.checked)}
        class="peer sr-only"
      />
      <span
        aria-hidden="true"
        class="flex h-6 w-11 items-center rounded-full bg-rule p-0.5 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-quiet)] peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card motion-reduce:transition-none [&>span]:bg-muted peer-checked:[&>span]:translate-x-5 peer-checked:[&>span]:bg-paper"
      >
        <span class="block h-5 w-5 rounded-full shadow-xs transition-transform duration-[var(--dur-micro)] ease-[var(--ease-quiet)] motion-reduce:transition-none" />
      </span>
    </span>
  );
}

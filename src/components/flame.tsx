import { createEffect } from "solid-js";
import { flameSvg, type FlameKind } from "../../lib/streak/flames";

/** lit: burning loop; ignite: bursts from a spark, then the lit loop; dim: guttering loop; out: sputters out, smoke stays. */
export type FlameMode = "lit" | "ignite" | "dim" | "out";

const FILE_SUFFIX: Record<FlameMode, string> = { lit: "", ignite: "-thap", dim: "-leo-let", out: "-tat" };

export const lottieUrl = (kind: FlameKind, mode: FlameMode) => `/lottie/${kind}${FILE_SUFFIX[mode]}.json`;

const reducedMotion = () =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A streak flame. The static drawing renders first (and on the server); in the browser the Lottie animation
 * replaces it once loaded, unless the reader prefers reduced motion or the file cannot load. Decorative only.
 */
export function Flame(props: { kind: FlameKind; mode: FlameMode; class?: string }) {
  let stage!: HTMLDivElement;
  let still!: HTMLDivElement;

  createEffect(
    () => ({ kind: props.kind, mode: props.mode }),
    ({ kind, mode }) => {
      if (reducedMotion()) return;
      let cancelled = false;
      let destroy = () => {};
      const play = async (m: FlameMode) => {
        const [{ default: lottie }, data] = await Promise.all([
          import("lottie-web/build/player/lottie_light"),
          fetch(lottieUrl(kind, m)).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))),
        ]);
        if (cancelled) return;
        destroy();
        const anim = lottie.loadAnimation({
          container: stage,
          renderer: "svg",
          loop: m === "lit" || m === "dim",
          autoplay: true,
          animationData: data,
        });
        destroy = () => anim.destroy();
        anim.addEventListener("DOMLoaded", () => (still.style.visibility = "hidden"));
        if (m === "ignite") anim.addEventListener("complete", () => void play("lit").catch(() => {}));
      };
      // Offline or blocked: the static drawing stays.
      play(mode).catch(() => {});
      return () => {
        cancelled = true;
        destroy();
        still.style.visibility = "";
      };
    },
  );

  return (
    <div aria-hidden="true" class={["relative", props.class ?? "h-24 w-24"]}>
      <div
        ref={still}
        class="absolute inset-0 [&>svg]:h-full [&>svg]:w-full"
        innerHTML={flameSvg(props.kind, props.mode === "ignite" ? "lit" : props.mode)}
      />
      <div ref={stage} class="absolute inset-0" />
    </div>
  );
}

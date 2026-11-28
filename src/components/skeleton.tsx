import type { ParentProps } from "solid-js";
import { useLocale } from "./locale-context";

/** One grey placeholder shape; its size and rounding come from `class`. */
export function Bone(props: { class: string }) {
  return <div class={["animate-calm-pulse rounded-full bg-rule motion-reduce:animate-none", props.class]} />;
}

/** Holds the placeholder shapes of a part still loading; screen readers hear only `label`. */
export function Skeleton(props: ParentProps<{ label: string; class?: string }>) {
  return (
    <div role="status" aria-busy="true" class={props.class}>
      <span class="sr-only">{props.label}</span>
      <div aria-hidden="true">{props.children}</div>
    </div>
  );
}

/** A page-shaped placeholder: eyebrow, title, then a few lines of text. */
export function PageSkeleton() {
  const { t } = useLocale();
  return (
    <Skeleton label={t().skeleton.loading} class="mx-auto w-full max-w-[40rem] px-5 pt-7 pb-12">
      <Bone class="h-3 w-28" />
      <Bone class="mt-3 h-8 w-2/3" />
      <div class="mt-8 space-y-3">
        <Bone class="h-4 w-full" />
        <Bone class="h-4 w-11/12" />
        <Bone class="h-4 w-4/5" />
        <Bone class="h-4 w-full" />
        <Bone class="h-4 w-3/5" />
      </div>
    </Skeleton>
  );
}

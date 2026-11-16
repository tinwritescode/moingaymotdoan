"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Fades its children in. With reduced motion the duration is 0, so the tree is the same on
 * server and client either way (no hydration mismatch). Without JS, a <noscript> style in the
 * layout forces [data-reveal] visible.
 */
export function Reveal(props: { children: React.ReactNode; className?: string; onView?: boolean }) {
  const reduce = useReducedMotion();
  const shown = { opacity: 1, y: 0 };
  return (
    <motion.div
      data-reveal
      className={props.className}
      initial={{ opacity: 0, y: 8 }}
      {...(props.onView ? { whileInView: shown, viewport: { once: true, margin: "-40px" } } : { animate: shown })}
      transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }}
    >
      {props.children}
    </motion.div>
  );
}

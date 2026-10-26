import { MediaQuery } from "svelte/reactivity";

export const reducedMotion = new MediaQuery("prefers-reduced-motion: reduce");

/** Svelte transition easing that snaps in `n` frames, like a GBA sprite moving 8px at a time. */
export const stepped =
  (n = 4) =>
  (t: number) =>
    Math.ceil(t * n) / n;

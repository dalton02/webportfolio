/*
  One IntersectionObserver shared by everything that only needs to move while it is
  on screen (sprite timers, looping CSS, lazy icons), plus a reactive flag for the tab
  being in front. Offscreen or in a background tab, nothing should spend a frame.
*/

const callbacks = new WeakMap<Element, (on: boolean) => void>();
let io: IntersectionObserver | undefined;

function observer() {
  // a little margin, so a sprite is already moving when it scrolls into view
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) callbacks.get(e.target)?.(e.isIntersecting);
    },
    { rootMargin: "64px" },
  );
  return io;
}

/** Calls `cb(true)` when `el` comes near the viewport and `cb(false)` when it leaves. Returns the cleanup. */
export function watch(el: Element, cb: (on: boolean) => void) {
  callbacks.set(el, cb);
  observer().observe(el);
  return () => {
    io?.unobserve(el);
    callbacks.delete(el);
  };
}

class Page {
  visible = $state(typeof document === "undefined" ? true : !document.hidden);
  constructor() {
    if (typeof document === "undefined") return;
    document.addEventListener("visibilitychange", () => (this.visible = !document.hidden));
  }
}

/** Whether the tab is in front. */
export const page = new Page();

/** Svelte action: toggles `.offscreen` on the node, so CSS can pause its looping animations. */
export function onscreen(node: Element) {
  const stop = watch(node, (on) => node.classList.toggle("offscreen", !on));
  return { destroy: stop };
}

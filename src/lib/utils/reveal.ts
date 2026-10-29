import type { Action } from "svelte/action";

let observer: IntersectionObserver | undefined;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.dataset.reveal = "in";
        // drop the filled animation once it lands, so the mosaic filter never lingers
        const land = (e: AnimationEvent) => {
          if (e.target !== el) return; // a child's own loop bubbling up
          el.dataset.reveal = "done";
          el.removeEventListener("animationend", land);
        };
        el.addEventListener("animationend", land);
        observer!.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  return observer;
}

/** Fades the node in once it enters the viewport. `delay` is a stagger step (x90ms). */
export const reveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
  node.dataset.reveal = "";
  node.style.setProperty("--d", String(delay));
  getObserver().observe(node);
  return {
    destroy() {
      observer?.unobserve(node);
    },
  };
};

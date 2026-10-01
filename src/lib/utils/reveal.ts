import type { Action } from "svelte/action";

let observer: IntersectionObserver | undefined;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = "in";
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

<script lang="ts">
  import type { Sprite } from "./sprites.js";
  import { reducedMotion } from "$lib/utils/motion.svelte";

  let {
    sprite,
    scale = 4,
    frame,
    fps = 0,
    label,
    class: css = "",
  }: {
    sprite: Sprite;
    /** whole-number scale, so every art pixel is the same size on screen */
    scale?: number;
    /** pin a frame; leave unset to let `fps` cycle through them */
    frame?: number;
    fps?: number;
    label?: string;
    class?: string;
  } = $props();

  let tick = $state(0);

  $effect(() => {
    if (frame !== undefined || fps <= 0 || sprite.frames.length < 2 || reducedMotion.current) return;
    const id = setInterval(() => tick++, 1000 / fps);
    return () => clearInterval(id);
  });

  let current = $derived(frame ?? tick);

  /** One <path> per colour, built from horizontal runs, so even a 16×16 sprite is a few nodes. */
  let paths = $derived.by(() => {
    const rows = sprite.frames[current % sprite.frames.length];
    const byColor = new Map<string, string>();
    rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const c = row[x];
        let end = x + 1;
        while (end < row.length && row[end] === c) end++;
        if (c !== ".") {
          const fill = sprite.palette[c];
          if (fill) byColor.set(fill, (byColor.get(fill) ?? "") + `M${x} ${y}h${end - x}v1h${x - end}z`);
        }
        x = end;
      }
    });
    return [...byColor];
  });
</script>

<svg
  width={sprite.w * scale}
  height={sprite.h * scale}
  viewBox="0 0 {sprite.w} {sprite.h}"
  shape-rendering="crispEdges"
  class="shrink-0 {css}"
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
>
  {#each paths as [fill, d] (fill)}
    <path {fill} {d} />
  {/each}
</svg>

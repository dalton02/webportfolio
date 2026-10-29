<script lang="ts" module>
  import type { Sheet, Sprite } from "./sprites.js";

  /** Run-length paths per sprite and frame; a frame's paths never change, so build them once. */
  const built = new WeakMap<Sprite, [string, string][][]>();

  /** One <path> per colour, built from horizontal runs, so even a 16×16 sprite is a few nodes. */
  function pathsOf(sprite: Sprite, frame: number) {
    let frames = built.get(sprite);
    if (!frames) built.set(sprite, (frames = []));
    if (frames[frame]) return frames[frame];
    const byColor = new Map<string, string>();
    sprite.frames[frame].forEach((row, y) => {
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
    return (frames[frame] = [...byColor]);
  }
</script>

<script lang="ts">
  import { reducedMotion } from "$lib/utils/motion.svelte";
  import { page, watch } from "$lib/utils/visible.svelte";

  let {
    sprite,
    scale = 4,
    frame,
    fps = 0,
    label,
    class: css = "",
  }: {
    /** a char-map sprite, or a PNG sprite sheet (frames side by side) */
    sprite: Sprite | Sheet;
    /** whole-number scale, so every art pixel is the same size on screen */
    scale?: number;
    /** pin a frame; leave unset to let `fps` cycle through them */
    frame?: number;
    fps?: number;
    label?: string;
    class?: string;
  } = $props();

  let tick = $state(0);
  let count = $derived("src" in sprite ? sprite.frames : sprite.frames.length);

  let el = $state<Element>();
  let near = $state(false);
  $effect(() => (el ? watch(el, (on) => (near = on)) : undefined));

  // the timer only runs while the sprite is near the screen and the tab is in front
  $effect(() => {
    if (frame !== undefined || fps <= 0 || count < 2 || reducedMotion.current || !near || !page.visible) return;
    const id = setInterval(() => tick++, 1000 / fps);
    return () => clearInterval(id);
  });

  let current = $derived((frame ?? tick) % count);

  let paths = $derived("src" in sprite ? [] : pathsOf(sprite, current));
</script>

{#if "src" in sprite}
  <!-- a window one frame wide sliding along the strip, scaled up with hard pixel edges.
       Block, like the svg below gets from Tailwind's preflight, so no line-box gap sits under the feet -->
  <span
    bind:this={el}
    class="block shrink-0 bg-no-repeat {css}"
    style="width: {sprite.w * scale}px; height: {sprite.h * scale}px; background-image: url({sprite.src});
      background-size: {sprite.w * sprite.frames * scale}px {sprite.h * scale}px;
      background-position: {-current * sprite.w * scale}px 0; image-rendering: pixelated;"
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : "true"}
  ></span>
{:else}
  <svg
    bind:this={el}
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
{/if}

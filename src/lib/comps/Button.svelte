<script lang="ts">
  import type { Snippet } from "svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import { cursor } from "$lib/pixel/sprites.js";
  import sfx from "$lib/utils/sfx.svelte";

  let {
    variant = "solid",
    href,
    type = "button",
    value,
    external = false,
    onclick,
    children,
    class: extra = "",
  }: {
    variant?: "solid" | "ghost" | "gold";
    href?: string;
    type?: "button" | "submit";
    value?: string;
    external?: boolean;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
    class?: string;
  } = $props();

  let css = $derived(`px-btn px-btn-${variant} group/btn ${extra}`);

  function click(e: MouseEvent) {
    sfx.select();
    onclick?.(e);
  }
</script>

{#snippet body()}
  <!-- menu cursor that blinks next to the hovered option -->
  <span class="pointer-events-none absolute top-1/2 -left-6 hidden -translate-y-1/2 group-hover/btn:block group-focus-visible/btn:block">
    <span class="block blink"><PixelSprite sprite={cursor} scale={2} /></span>
  </span>
  {@render children()}
{/snippet}

{#if href}
  <a
    {href}
    class={css}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    onclick={click}
    onmouseenter={() => sfx.cursor()}
  >
    {@render body()}
  </a>
{:else}
  <button {type} {value} class={css} onclick={click} onmouseenter={() => sfx.cursor()}>
    {@render body()}
  </button>
{/if}

<style>
  .px-btn {
    --c1: var(--color-snow);
    --c2: var(--color-ink);
    --fill: var(--color-grass-lo);
    --edge: var(--color-grass-deep);
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    min-height: 3rem;
    padding: 0.6rem 1.25rem;
    cursor: pointer;
    font-family: var(--font-label);
    font-size: 15px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    /* a label that still wraps stays centred, with even lines */
    text-align: center;
    text-wrap: balance;
    color: var(--color-snow);
    background: var(--fill);
    box-shadow:
      inset 0 -4px 0 0 var(--edge),
      0 -3px 0 0 var(--c1),
      0 3px 0 0 var(--c1),
      -3px 0 0 0 var(--c1),
      3px 0 0 0 var(--c1),
      0 -6px 0 0 var(--c2),
      0 6px 0 0 var(--c2),
      -6px 0 0 0 var(--c2),
      6px 0 0 0 var(--c2),
      -3px -3px 0 0 var(--c2),
      3px -3px 0 0 var(--c2),
      -3px 3px 0 0 var(--c2),
      3px 3px 0 0 var(--c2),
      0 10px 0 0 rgb(24 16 24 / 0.35);
  }
  .px-btn:hover,
  .px-btn:focus-visible {
    --fill: var(--color-grass);
  }
  .px-btn:active {
    transform: translateY(3px);
    box-shadow:
      inset 0 4px 0 0 var(--edge),
      0 -3px 0 0 var(--c1),
      0 3px 0 0 var(--c1),
      -3px 0 0 0 var(--c1),
      3px 0 0 0 var(--c1),
      0 -6px 0 0 var(--c2),
      0 6px 0 0 var(--c2),
      -6px 0 0 0 var(--c2),
      6px 0 0 0 var(--c2),
      -3px -3px 0 0 var(--c2),
      3px -3px 0 0 var(--c2),
      -3px 3px 0 0 var(--c2),
      3px 3px 0 0 var(--c2);
  }
  .px-btn-ghost {
    --fill: var(--color-parch);
    --edge: var(--color-parch-lo);
    --c1: var(--color-path-lo);
    --c2: var(--color-bark);
    color: var(--color-bark);
  }
  .px-btn-ghost:hover,
  .px-btn-ghost:focus-visible {
    --fill: var(--color-path-hi);
  }
  .px-btn-gold {
    --fill: var(--color-gold);
    --edge: var(--color-gold-lo);
    --c1: var(--color-gold-hi);
    color: var(--color-ink);
  }
  .px-btn-gold:hover,
  .px-btn-gold:focus-visible {
    --fill: var(--color-gold-hi);
  }
</style>

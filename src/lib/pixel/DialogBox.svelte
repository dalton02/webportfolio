<script lang="ts">
  import type { Snippet } from "svelte";
  import PixelSprite from "./PixelSprite.svelte";
  import { nextArrow, soldadinho, type Sheet, type Sprite } from "./sprites.js";
  import sfx from "$lib/utils/sfx.svelte";
  import { reducedMotion } from "$lib/utils/motion.svelte";

  let {
    text,
    speaker,
    portrait = soldadinho,
    cps = 50,
    class: css = "",
    children,
  }: {
    /** `<br>` becomes a line break; `{g:word}`, `{r:word}`, `{b:word}`, `{y:word}` colour a word like in-game hints */
    text: string;
    speaker?: string;
    portrait?: Sprite | Sheet | null;
    /** typing speed, characters per second */
    cps?: number;
    class?: string;
    children?: Snippet;
  } = $props();

  type Part = { text: string; tone?: string };

  let parts = $derived.by(() => {
    const clean = text.replace(/<br\s*\/?>\s*/g, "\n");
    const out: Part[] = [];
    for (const piece of clean.split(/(\{[rgby]:[^}]*\})/)) {
      const m = piece.match(/^\{([rgby]):([^}]*)\}$/);
      if (m) out.push({ text: m[2], tone: m[1] });
      else if (piece) out.push({ text: piece });
    }
    return out;
  });
  let total = $derived(parts.reduce((n, p) => n + p.text.length, 0));
  let plain = $derived(parts.map((p) => p.text).join(""));

  let box = $state<HTMLElement>();
  let shown = $state(0);
  let started = $state(false);
  let done = $derived(shown >= total);

  /** The visible slice of each part for the current letter count. */
  let typed = $derived.by(() => {
    let left = shown;
    return parts.map((p) => {
      const t = p.text.slice(0, Math.max(0, left));
      left -= p.text.length;
      return { ...p, text: t };
    });
  });

  // restart when the text changes (language switch)
  $effect(() => {
    void text;
    shown = reducedMotion.current ? total : 0;
  });

  // start typing the first time the box scrolls into view
  $effect(() => {
    if (!box || started) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          started = true;
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(box);
    return () => io.disconnect();
  });

  $effect(() => {
    if (!started || done || reducedMotion.current) return;
    const id = setInterval(() => {
      shown = Math.min(total, shown + 1);
      if (plain[shown - 1]?.trim()) sfx.blip();
    }, 1000 / cps);
    return () => clearInterval(id);
  });

  function skip() {
    if (!done) shown = total;
  }

  const tones: Record<string, string> = {
    g: "text-gem",
    r: "text-gem-red",
    b: "text-gem-blue",
    y: "text-gold-hi",
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions: skipping is a visual nicety, the full text is always in the DOM for assistive tech -->
<div bind:this={box} class="px-box px-dialog flex gap-4 p-4 sm:p-5 {css}" onclick={skip}>
  {#if portrait}
    <div class="hidden shrink-0 flex-col items-center gap-1 sm:flex">
      <div class="px-box px-slot-dark grid h-[72px] w-[72px] place-items-center">
        <PixelSprite sprite={portrait} scale={portrait.w > 16 ? 3 : 4} fps={0.6} />
      </div>
    </div>
  {/if}

  <div class="flex min-w-0 flex-1 flex-col">
    {#if speaker}
      <span class="mb-1.5 font-label text-[13px] tracking-wider text-gold-hi uppercase">{speaker}</span>
    {/if}

    <p class="sr-only">{plain}</p>
    <!-- full text reserves the space, the typed copy sits on top: no layout jump while typing -->
    <div class="grid text-[19px] leading-[1.45] whitespace-pre-line" aria-hidden="true">
      <span class="invisible col-start-1 row-start-1">{plain}</span>
      <span class="col-start-1 row-start-1">
        {#each typed as p, i (i)}<span class={p.tone ? tones[p.tone] : ""}>{p.text}</span>{/each}
      </span>
    </div>

    {#if children}
      <div class="mt-4">{@render children()}</div>
    {/if}
  </div>

  <span class="absolute right-3 bottom-2 {done && !children ? 'bob' : 'invisible'}" aria-hidden="true">
    <PixelSprite sprite={nextArrow} scale={2} />
  </span>
</div>

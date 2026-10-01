<script lang="ts">
  import { reveal } from "$lib/utils/reveal.js";

  let { index, title, kicker }: { index: number; title: string; kicker?: string } = $props();
</script>

<header class="mb-14 flex flex-col gap-5 sm:mb-20" use:reveal>
  <div class="flex items-center gap-4 font-mono text-[12px] tracking-[0.16em] text-dust uppercase">
    <span class="text-clay">{String(index).padStart(2, "0")}/</span>
    <span>{title}</span>
    <span class="h-px flex-1 bg-gradient-to-r from-line to-transparent"></span>
  </div>
  {#if kicker}
    <h2 class="max-w-3xl font-display text-4xl leading-[1.05] font-light tracking-tight text-sand text-balance sm:text-5xl lg:text-6xl">
      {kicker}
    </h2>
  {/if}
</header>

<script lang="ts">
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import { sign } from "$lib/pixel/sprites.js";
  import { reveal } from "$lib/utils/reveal.js";

  let { title, kicker }: { title: string; kicker?: string } = $props();
</script>

<!-- a wooden signpost names the room, the kicker reads like the area subtitle -->
<header class="mb-14 flex flex-col gap-6 sm:mb-16" use:reveal>
  <div class="flex items-end gap-3">
    <PixelSprite sprite={sign} scale={3} class="hidden sm:block" />
    <div class="px-box px-wood flex items-center px-4 py-2.5">
      <span class="font-title text-[13px] tracking-wide text-parch uppercase sm:text-[15px]">{title}</span>
    </div>
  </div>
  {#if kicker}
    <h2 class="max-w-3xl font-pixel text-[2rem] leading-[1.15] font-bold text-snow text-balance px-outline sm:text-5xl">
      {kicker}
    </h2>
  {/if}
</header>

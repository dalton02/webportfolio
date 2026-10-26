<script lang="ts">
  import Icon from "$lib/comps/Icon.svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import NightForest from "$lib/pixel/NightForest.svelte";
  import Treeline from "$lib/pixel/Treeline.svelte";
  import { heart } from "$lib/pixel/sprites.js";
  import Soldadinho from "$lib/pixel/Soldadinho.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import sfx from "$lib/utils/sfx.svelte";
  import ui from "$lib/json/ui.json" with { type: "json" };

  const made = new Text(ui.footer.made);
  const top = new Text(ui.footer.top);
  const thanks = new Text(ui.footer.thanks);
  const year = new Date().getFullYear();

  // fireflies over the dark ground: [left %, top px, blink delay s]
  const fireflies: [number, number, number][] = [
    [6, 40, 0], [14, 150, 0.6], [23, 70, 0.3], [79, 55, 0.8], [87, 160, 0.2], [94, 30, 0.5], [70, 230, 0.9], [33, 260, 0.4],
    // a few more down among the trees on the sides
    [4, 380, 0.7], [11, 330, 0.1], [90, 420, 0.4], [96, 300, 0.9],
  ];
</script>

<!-- end credits -->
<footer class="relative z-10 mt-32 bg-night text-snow">
  <!-- the field ends in a wood that fades into the night, instead of a hard line -->
  <div class="absolute inset-x-0 bottom-full"><Treeline /></div>
  <!-- a moonlit clearing in the wood, with the credits in the middle -->
  <!-- tall enough for the trees to stand; fireflies outside it are clipped instead of stretching the page -->
  <div class="relative flex min-h-[440px] flex-col justify-center overflow-hidden sm:min-h-[540px]">
    <NightForest />
    {#each fireflies as [left, top, delay], i (i)}
      <span
        class="blink pointer-events-none absolute h-[3px] w-[3px] bg-gold-hi shadow-[0_0_6px_2px_rgba(248,224,112,.45)]"
        style="left: {left}%; top: {top}px; animation-delay: {delay}s; animation-duration: {1.6 + (i % 3) * 0.5}s;"
        aria-hidden="true"
      ></span>
    {/each}
    <div class="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-16 text-center sm:px-8">
      <span class="hop"><Soldadinho scale={4} /></span>
      <p class="font-title text-[16px] leading-relaxed text-balance text-gold-hi sm:text-[22px]">{thanks.value}</p>

      <div class="flex gap-1.5" aria-hidden="true">
        {#each Array(5) as _, i (i)}<PixelSprite sprite={heart(4)} scale={2} />{/each}
      </div>
    </div>
  </div>

  <div class="border-t-4 border-ink">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 font-label text-[12px] text-mist/80 sm:flex-row sm:items-center sm:justify-between sm:px-8"
    >
      <span>© {year} Dalton Gomes Lobato · {made.value}</span>
      <div class="flex items-center gap-5">
        <a href={ui.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="-m-2 p-2 hover:text-gold-hi">
          <Icon name="github" class="h-4 w-4" />
        </a>
        <a href={ui.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="-m-2 p-2 hover:text-gold-hi">
          <Icon name="linkedin" class="h-4 w-4" />
        </a>
        <a href="#home" class="group flex items-center gap-1.5 uppercase hover:text-gold-hi" onclick={() => sfx.select()}>
          {top.value}
          <Icon name="arrowUp" class="h-4 w-4 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  </div>
</footer>

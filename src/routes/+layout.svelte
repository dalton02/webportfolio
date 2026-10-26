<script lang="ts">
  import { onMount } from "svelte";
  import "./layout.css";
  import Background from "$lib/comps/Background.svelte";
  import Header from "$lib/comps/Header.svelte";
  import language, { Text } from "$lib/utils/lang.svelte";
  import ui from "$lib/json/ui.json" with { type: "json" };

  const { children } = $props();

  const title = new Text(ui.meta.title);
  const description = new Text(ui.meta.description);

  let mounted = $state(false);

  onMount(() => {
    language.set();
    mounted = true;
  });

  $effect(() => {
    document.documentElement.lang = language.value === "ptBr" ? "pt-BR" : "en";
  });
</script>

<svelte:head>
  <title>{title.value}</title>
  <meta name="description" content={description.value} />
</svelte:head>

<!--
  Mosaic filters for the room-entry reveal (layout.css → px-mosaic).
  Sample one pixel per n×n block, then grow it back to fill the block.
-->
<svg width="0" height="0" class="absolute" aria-hidden="true">
  <defs>
    {#each [2, 4, 8, 12] as n (n)}
      <filter id="px-mosaic-{n}" x="0" y="0" width="100%" height="100%">
        <feFlood x={n / 2} y={n / 2} width="1" height="1" />
        <feComposite width={n} height={n} />
        <feTile result="grid" />
        <feComposite in="SourceGraphic" in2="grid" operator="in" />
        <feMorphology operator="dilate" radius={n / 2} />
      </filter>
    {/each}
  </defs>
</svg>

<Background />
{#if mounted}
  <Header />
  <main class="relative z-10">
    {@render children()}
  </main>
{/if}

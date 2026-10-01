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
  <meta property="og:title" content={title.value} />
  <meta property="og:description" content={description.value} />
  <meta property="og:type" content="website" />
</svelte:head>

<Background />
{#if mounted}
  <Header />
  <main class="relative z-10">
    {@render children()}
  </main>
{/if}

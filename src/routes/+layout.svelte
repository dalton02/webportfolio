<script lang="ts">
  import { page } from "$app/state";
  import Header from "$lib/comps/Header.svelte";
  import Waves from "$lib/comps/Waves.svelte";
  import { fly } from "svelte/transition";
  import "./layout.css";
  import globalState, { headerSections } from "$lib/utils/global.svelte";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { quadInOut } from "svelte/easing";
  import mediaQuery from "$lib/utils/media.svelte";
  import { onMount } from "svelte";
  import language from "$lib/utils/lang.svelte";
  const { children } = $props();

  let signal = $state({
    in: 1,
    out: 1,
  });
  let key = $state("");

  beforeNavigate((d) => {
    globalState.prevPage = d
      .to!.url.pathname.replaceAll(globalState.basePath, "")
      .replaceAll("/", "");
    const from = globalState.prevPage;
    const to = page.url.pathname
      .replaceAll(globalState.basePath, "")
      .replaceAll("/", "");
    const fromSec = headerSections.findIndex((v) => v.goto === from);
    const toSec = headerSections.findIndex((v) => v.goto === to);
    if (fromSec == toSec) return;
    signal = {
      in: fromSec > toSec ? 1 : -1,
      out: fromSec > toSec ? -1 : 1,
    };
    key = Math.random().toString(36).substring(2, 10);
  });

  const duration = 800;
  let mounted = $state(false);

  let length = $derived.by(() => {
    if (mediaQuery.lg.current) {
      return 2800;
    }
    return 1200;
  });

  onMount(() => {
    language.set();
    mounted = true;
  });
</script>

{#if mounted}
  <div class="w-screen h-svh flex flex-col overflow-hidden">
    <Header />
    <div
      class="relative flex-1 flex-col w-full bg-background text-egg"
      id="main"
    >
      {#key key}
        <div
          class="absolute left-0 top-0 z-10 scroll-bar flex-1 h-full w-full flex overflow-y-auto"
          in:fly={{ x: length * signal.in, easing: quadInOut, duration }}
          out:fly={{ x: length * signal.out, easing: quadInOut, duration }}
        >
          {@render children()}
        </div>
      {/key}
    </div>
  </div>
{/if}

<style>
  .scroll-bar::-webkit-scrollbar {
    width: 6px;
  }
  .scroll-bar::-webkit-scrollbar-track {
    background: transparent;
  }
  .scroll-bar::-webkit-scrollbar-thumb {
    background-color: var(--color-secondary);
    border-radius: 10px;
  }
  .scroll-bar::-webkit-scrollbar-thumb:hover {
    background-color: #494849;
  }
</style>

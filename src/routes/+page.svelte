<script lang="ts">
  import { onMount, type Component } from "svelte";
  import About from "$lib/sections/About.svelte";
  import Hero from "$lib/sections/Hero.svelte";
  import globalState from "$lib/utils/global.svelte";

  // the rooms below the fold arrive a moment later, so the first screen paints on less JavaScript
  let rest = $state<Component[]>();

  onMount(() => {
    const load = () =>
      Promise.all([
        import("$lib/sections/Experience.svelte"),
        import("$lib/sections/Projects.svelte"),
        import("$lib/sections/Contact.svelte"),
        import("$lib/sections/Footer.svelte"),
      ]).then((mods) => {
        rest = mods.map((m) => m.default);
      });
    // a link straight to a lower room can't wait for idle time
    if (location.hash && !["#home", "#about"].includes(location.hash)) load();
    else (window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 1)))(load, { timeout: 800 });
  });

  $effect(() => {
    if (!rest) return;
    globalState.restLoaded = true;
    // the browser gave up on a #room that didn't exist yet; take the visitor there now
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  });
</script>

<Hero />
<About />
{#if rest}
  {#each rest as Section, i (i)}
    <Section />
  {/each}
{:else}
  <!-- holds the page open below About until the rest lands -->
  <div class="min-h-screen" aria-hidden="true"></div>
{/if}

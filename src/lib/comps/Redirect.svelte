<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import globalState, { type SectionsType } from "$lib/utils/global.svelte";

  // Old multi-page routes now live as sections of the single page.
  let { to }: { to: SectionsType } = $props();

  onMount(() => {
    goto(`${globalState.basePath}/#${to}`, { replaceState: true });
  });
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import globalState, {
    headerSections,
    SectionsType,
  } from "$lib/utils/global.svelte";

  let list = $state<HTMLUListElement>();

  let slider = $derived.by(() => {
    const path = page.url.pathname
      .replaceAll(globalState.basePath, "")
      .replaceAll("/", "") as SectionsType;

    if (!list) return { x: 0, width: 0 };

    const items = list.children;

    const moveX = (i: number) => {
      const acc = Object.values(items)
        .slice(0, i)
        .reduce((prev, current) => current.clientWidth + prev, 0);
      return acc + 12 * i;
    };

    switch (path) {
      case "home":
        return {
          x: 0,
          width: items[0].clientWidth,
        };
      case "about":
        return {
          x: moveX(1),
          width: items[1].clientWidth,
        };
      case "projects":
        return {
          x: moveX(2),
          width: items[2].clientWidth,
        };
      case "contact":
        return {
          x: moveX(3),
          width: items[3].clientWidth,
        };
    }
  });
</script>

<header class="sticky top-0 left-0 w-full z-20 pointer-events-auto">
  <div class=" text-egg">
    <div class="bg-secondary shadow-xl/10 flex justify-center items-center">
      <div
        class="flex justify-center lg:justify-between items-center w-full lg max-w-[1400px] px-12"
      >
        <h1 class="font-cursive text-xl not-lg:hidden">Dalton Gomes</h1>

        <div class="relative py-1">
          <ul class="flex items-center gap-3" bind:this={list}>
            {#each headerSections as sec}
              {@const selected =
                sec.goto === page.url.pathname.replaceAll("/", "")}
              <li>
                <button
                  class="h-full flex pointer-events-auto items-center p-3 px-1 {selected
                    ? ''
                    : ''} transition-all duration-200 cursor-pointer"
                  onclick={() => {
                    goto(sec.goto);
                  }}
                >
                  <span class="text-lg font-light tracking-tight">
                    {sec.label.value}
                  </span>
                </button>
              </li>
            {/each}
          </ul>
          {#if slider}
            <div
              class="absolute bottom-0 h-[2px] bg-primary transition-all"
              style="transform:translateX({slider.x ??
                0}px);width:{slider.width ?? 0}px;"
            ></div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</header>

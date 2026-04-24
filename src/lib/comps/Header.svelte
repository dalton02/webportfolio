<script lang="ts">
  import { page } from "$app/state";
  import globalState, { headerSections } from "$lib/utils/global.svelte";
  import language from "$lib/utils/lang.svelte";

  let list = $state<HTMLUListElement>();

  let currentPath = $derived(
    page.url.pathname
      .replace(globalState.basePath, "")
      .replace(/^\/+|\/+$/g, ""),
  );

  let activeIndex = $derived(
    headerSections.findIndex((s) => s.goto === currentPath),
  );

  let slider = $state({ x: 0, width: 0, ready: false });

  function measure() {
    if (!list || activeIndex < 0) {
      slider = { x: 0, width: 0, ready: false };
      return;
    }
    const item = list.children[activeIndex] as HTMLElement | undefined;
    if (!item) return;
    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    slider = {
      x: itemRect.left - listRect.left,
      width: itemRect.width,
      ready: true,
    };
  }

  $effect(() => {
    // re-run when path changes or language flips (label widths change)
    void activeIndex;
    void language.value;
    measure();
  });

  $effect(() => {
    if (!list) return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    for (const child of Array.from(list.children)) ro.observe(child);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  });

  function href(goto: string) {
    return `${globalState.basePath}/${goto}`;
  }
</script>

<header
  class="sticky top-0 left-0 w-full z-20 pointer-events-auto
  bg-secondary/80 backdrop-blur-md shadow-xl/10"
>
  <div class="text-egg">
    <div class="flex justify-center items-center">
      <div
        class="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-[1400px] px-4 sm:px-6 lg:px-12 gap-2"
      >
        <a
          href={href("home")}
          class="font-cursive text-xl not-lg:hidden font-bold italic
          justify-self-start
          transition-opacity hover:opacity-80 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
        >
          Dalton <span class="text-primary">Gomes</span>
        </a>

        <nav aria-label="Primary" class="relative py-1 justify-self-center col-start-2">
          <ul class="flex items-center gap-1 sm:gap-3" bind:this={list}>
            {#each headerSections as sec, i}
              {@const selected = i === activeIndex}
              <li>
                <a
                  href={href(sec.goto)}
                  data-sveltekit-preload-data="hover"
                  aria-current={selected ? "page" : undefined}
                  class="flex items-center px-2.5 sm:px-3 py-2.5 rounded-md
                  transition-colors duration-200
                  hover:bg-white/5 focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-primary/60
                  {selected
                    ? 'text-primary font-medium'
                    : 'text-egg/80 hover:text-egg'}"
                >
                  <span class="text-base sm:text-lg tracking-tight">
                    {sec.label.value}
                  </span>
                </a>
              </li>
            {/each}
          </ul>
          <div
            class="absolute bottom-0 h-[2px] bg-primary transition-all duration-300 ease-out
            {slider.ready ? 'opacity-100' : 'opacity-0'}"
            style="transform:translateX({slider.x}px);width:{slider.width}px;"
            aria-hidden="true"
          ></div>
        </nav>

        <button
          type="button"
          class="justify-self-end col-start-3 flex items-center gap-1
          text-xs font-medium tracking-[0.15em] uppercase
          rounded-full border border-white/10 bg-white/5 px-2.5 py-1
          text-egg/70 hover:text-egg hover:border-primary/40 hover:bg-primary/5
          transition-colors duration-200 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary/60 cursor-pointer"
          aria-label="Toggle language"
          onclick={() =>
            (language.value = language.value === "ptBr" ? "enUs" : "ptBr")}
        >
          <span
            class={language.value === "ptBr" ? "text-primary" : "text-egg/50"}
            >PT</span
          >
          <span class="text-egg/25">/</span>
          <span
            class={language.value === "enUs" ? "text-primary" : "text-egg/50"}
            >EN</span
          >
        </button>
      </div>
    </div>
  </div>
</header>

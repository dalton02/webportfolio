<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import globalState, { headerSections } from "$lib/utils/global.svelte";
  import language, { Text } from "$lib/utils/lang.svelte";
  import ui from "$lib/json/ui.json" with { type: "json" };

  let list = $state<HTMLUListElement>();
  let scrolled = $state(false);
  let open = $state(false);
  let slider = $state({ x: 0, width: 0, ready: false });

  let activeIndex = $derived(headerSections.findIndex((s) => s.id === globalState.activeSection));

  const talk = new Text(ui.nav.talk);
  const menu = new Text(ui.nav.menu);
  const close = new Text(ui.nav.close);

  function measure() {
    if (!list || activeIndex < 0) {
      slider.ready = false;
      return;
    }
    const item = list.children[activeIndex] as HTMLElement | undefined;
    if (!item) return;
    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    slider = { x: itemRect.left - listRect.left, width: itemRect.width, ready: true };
  }

  $effect(() => {
    // re-measure when the active section changes or labels change width
    void activeIndex;
    void language.value;
    measure();
  });

  $effect(() => {
    if (!list) return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    for (const child of Array.from(list.children)) ro.observe(child);
    return () => ro.disconnect();
  });

  onMount(() => {
    const onScroll = () => (scrolled = window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) globalState.activeSection = e.target.id as typeof globalState.activeSection;
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const el of document.querySelectorAll("section[id]")) io.observe(el);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  });

  function toggleLanguage() {
    language.toggle();
  }
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && (open = false)} />

<header
  class="fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500
  {scrolled || open ? 'border-line/80 bg-ink/85 backdrop-blur-xl' : 'border-transparent bg-transparent'}"
>
  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:gap-4 sm:px-8">
    <a
      href="#home"
      class="group flex shrink-0 items-baseline font-display text-[18px] leading-none font-normal tracking-[-0.02em] whitespace-nowrap text-sand sm:text-[20px]"
      aria-label="Dalton Gomes"
    >
      Dalton Gomes<span
        class="ml-0.5 inline-block h-[6px] w-[6px] rounded-full bg-sun transition-[background-color,transform] duration-500
        ease-[var(--ease-soft)] group-hover:scale-125 group-hover:bg-clay"
        aria-hidden="true"
      ></span>
    </a>

    <nav aria-label="Primary" class="relative hidden md:block">
      <ul class="flex items-center gap-1" bind:this={list}>
        {#each headerSections as sec, i (sec.id)}
          <li>
            <a
              href="#{sec.id}"
              aria-current={i === activeIndex ? "true" : undefined}
              class="block px-3 py-2 text-[14px] transition-colors duration-300
              {i === activeIndex ? 'text-sand' : 'text-dust hover:text-sand'}"
            >
              {sec.label.value}
            </a>
          </li>
        {/each}
      </ul>
      <div
        class="absolute -bottom-px h-px bg-clay transition-all duration-500 ease-[var(--ease-soft)]
        {slider.ready ? 'opacity-100' : 'opacity-0'}"
        style="transform: translateX({slider.x}px); width: {slider.width}px;"
        aria-hidden="true"
      ></div>
    </nav>

    <div class="flex items-center gap-2">
      <button
        type="button"
        onclick={toggleLanguage}
        aria-label="Toggle language"
        class="flex cursor-pointer items-center gap-1 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-[0.14em]
        transition-colors duration-300 hover:border-clay/50"
      >
        <span class={language.value === "ptBr" ? "text-clay" : "text-dust"}>PT</span>
        <span class="text-line">/</span>
        <span class={language.value === "enUs" ? "text-clay" : "text-dust"}>EN</span>
      </button>

      <a
        href="#contact"
        class="hidden rounded-full bg-sand px-4 py-1.5 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-clay lg:inline-block"
      >
        {talk.value}
      </a>

      <button
        type="button"
        class="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line md:hidden"
        aria-expanded={open}
        aria-label={open ? close.value : menu.value}
        onclick={() => (open = !open)}
      >
        <span class="relative block h-2.5 w-4">
          <span
            class="absolute left-0 h-px w-4 bg-sand transition-all duration-300 {open ? 'top-1/2 rotate-45' : 'top-0'}"
          ></span>
          <span
            class="absolute left-0 h-px w-4 bg-sand transition-all duration-300 {open ? 'top-1/2 -rotate-45' : 'top-full'}"
          ></span>
        </span>
      </button>
    </div>
  </div>

  {#if open}
    <div class="border-t border-line/80 md:hidden" transition:fade={{ duration: 200 }}>
      <ul class="mx-auto flex max-w-6xl flex-col px-5 py-4">
        {#each headerSections as sec, i (sec.id)}
          <li in:fly={{ y: -8, duration: 400, delay: i * 50, easing: quintOut }}>
            <a
              href="#{sec.id}"
              onclick={() => (open = false)}
              class="flex items-baseline gap-3 py-3 font-display text-2xl
              {i === activeIndex ? 'text-sand' : 'text-dust'}"
            >
              <span class="font-mono text-[11px] text-clay">0{i + 1}</span>
              {sec.label.value}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</header>

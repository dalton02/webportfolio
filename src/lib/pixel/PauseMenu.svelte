<script lang="ts">
  import { tick } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Icon from "$lib/comps/Icon.svelte";
  import PixelSprite from "./PixelSprite.svelte";
  import { book, chest, cursor, daltonHead, heart, house, mailbox, sign, soldadinho, type Sprite } from "./sprites.js";
  import globalState, { allSections, type SectionsType } from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { stepped } from "$lib/utils/motion.svelte";
  import { resumeUrl } from "$lib/utils/resume.js";
  import sfx from "$lib/utils/sfx.svelte";
  import aboutJSON from "$lib/json/about.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.pause).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.pause,
    Text
  >;
  const role = new Text(ui.hero.role);
  const location = new Text(ui.hero.location);
  const languages = new Text(aboutJSON.languages);
  const current = aboutJSON.timeline.find((j) => j.to === null);

  const tabs = ["map", "items", "status"] as const;
  type Tab = (typeof tabs)[number];
  let tab = $state<Tab>("map");
  let dir = $state(1);

  const roomArt: Record<SectionsType, Sprite> = {
    home: house,
    about: book,
    experience: sign,
    projects: chest,
    contact: mailbox,
  };

  type Item = { label: string; detail: Text; href: string; icon: "download" | "mail" | "whatsapp" | "github" | "linkedin" };
  const items: Item[] = [
    { label: "PT", detail: t.resumePt, href: resumeUrl.ptBr, icon: "download" },
    { label: "EN", detail: t.resumeEn, href: resumeUrl.enUs, icon: "download" },
    { label: "Email", detail: t.email, href: `mailto:${ui.links.email}`, icon: "mail" },
    { label: "WhatsApp", detail: new Text({ ptBr: ui.links.whatsappLabel, enUs: ui.links.whatsappLabel }), href: `https://wa.me/${ui.links.whatsapp}`, icon: "whatsapp" },
    { label: "GitHub", detail: new Text({ ptBr: ui.links.githubLabel, enUs: ui.links.githubLabel }), href: ui.links.github, icon: "github" },
    { label: "LinkedIn", detail: new Text({ ptBr: ui.links.linkedinLabel, enUs: ui.links.linkedinLabel }), href: ui.links.linkedin, icon: "linkedin" },
  ];
  let selected = $state(0);

  let panel = $state<HTMLElement>();
  let opener: HTMLElement | null = null;

  $effect(() => {
    if (!globalState.menuOpen) return;
    opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    void tick().then(() => panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    return () => {
      document.body.style.overflow = "";
      opener?.focus();
    };
  });

  function close() {
    sfx.back();
    globalState.menuOpen = false;
  }

  function shift(step: number) {
    dir = step;
    tab = tabs[(tabs.indexOf(tab) + step + tabs.length) % tabs.length];
    sfx.cursor();
  }

  function go(id: SectionsType) {
    sfx.select();
    globalState.menuOpen = false;
    // wait for the overlay to release the scroll lock before jumping
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }

  function onKey(e: KeyboardEvent) {
    if (!globalState.menuOpen || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    // same buttons as a GBA pause screen: B goes back, L / R switch tabs
    if (key === "Escape" || key === "b") {
      e.preventDefault();
      close();
    } else if (key === "ArrowRight" || key === "r" || key === "e") {
      e.preventDefault();
      shift(1);
    } else if (key === "ArrowLeft" || key === "l" || key === "q") {
      e.preventDefault();
      shift(-1);
    } else if (e.key === "Tab" && panel) {
      // keep focus inside the menu
      const f = [...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
</script>

<svelte:window onkeydown={onKey} />

{#if globalState.menuOpen}
  <!-- anchored to the top, not centered, so the tab strip stays put when a tab changes the panel height -->
  <div class="fixed inset-0 z-50 grid items-start justify-items-center p-4 pt-[10svh] sm:p-8 sm:pt-[16svh]" transition:fade={{ duration: 160, easing: stepped(4) }}>
    <button type="button" class="checker absolute inset-0 cursor-default" aria-label={t.close.value} onclick={close}></button>

    <div
      bind:this={panel}
      role="dialog"
      aria-modal="true"
      aria-label={t.title.value}
      class="px-box px-menu relative flex max-h-[min(640px,85svh)] w-full max-w-3xl flex-col"
      in:fly={{ y: 40, duration: 220, easing: stepped(4) }}
    >
      <!-- tab strip with L / R shoulders -->
      <div class="flex items-center justify-between gap-2 border-b-4 border-ink bg-night-hi px-3 py-3 sm:px-5">
        <button type="button" class="shoulder" aria-label={t.prev.value} onclick={() => shift(-1)}>L</button>
        <div class="flex gap-1 sm:gap-3" role="tablist">
          {#each tabs as k (k)}
            <button
              type="button"
              role="tab"
              aria-selected={tab === k}
              class="cursor-pointer px-2 py-1 font-title text-[10px] uppercase sm:px-3 sm:text-[12px]
              {tab === k ? 'bg-gold-hi text-ink' : 'text-mist hover:text-snow'}"
              data-autofocus={tab === k ? "" : undefined}
              onclick={() => {
                dir = tabs.indexOf(k) > tabs.indexOf(tab) ? 1 : -1;
                tab = k;
                sfx.cursor();
              }}
            >
              {t[k].value}
            </button>
          {/each}
        </div>
        <button type="button" class="shoulder" aria-label={t.next.value} onclick={() => shift(1)}>R</button>
      </div>

      <div class="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
        {#key tab}
          <div in:fly={{ x: 60 * dir, duration: 200, easing: stepped(4) }}>
            {#if tab === "map"}
              <ol class="map relative grid grid-cols-1 gap-3 p-4 sm:grid-cols-5 sm:gap-2 sm:p-6">
                {#each allSections as room (room.id)}
                  {@const here = room.id === globalState.activeSection}
                  <li class="relative flex sm:justify-center">
                    <button
                      type="button"
                      class="group flex w-full cursor-pointer items-center gap-3 text-left sm:flex-col sm:text-center"
                      onclick={() => go(room.id)}
                      onmouseenter={() => sfx.cursor()}
                    >
                      <span class="relative grid h-16 w-16 shrink-0 place-items-center">
                        {#if here}
                          <span class="absolute -top-5 left-1/2 -translate-x-1/2 hop">
                            <PixelSprite sprite={soldadinho} scale={2} />
                          </span>
                        {/if}
                        <PixelSprite sprite={roomArt[room.id]} scale={roomArt[room.id].w > 24 ? 2 : 3} />
                      </span>
                      <span class="flex flex-col">
                        <span class="text-[17px] leading-tight text-bark group-hover:text-heart-lo group-focus-visible:text-heart-lo">{room.label.value}</span>
                        {#if here}
                          <span class="font-label text-[11px] text-heart-lo uppercase blink">{t.here.value}</span>
                        {/if}
                      </span>
                    </button>
                  </li>
                {/each}
              </ol>
            {:else if tab === "items"}
              <ul class="grid grid-cols-3 gap-4 pl-2 sm:grid-cols-6">
                {#each items as item, i (item.label)}
                  <li>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group relative flex flex-col items-center gap-2"
                      onmouseenter={() => {
                        selected = i;
                        sfx.cursor();
                      }}
                      onfocus={() => (selected = i)}
                    >
                      <span class="px-box px-slot-dark grid aspect-square w-full max-w-[84px] place-items-center text-snow">
                        <Icon name={item.icon} class="h-8 w-8" />
                        {#if selected === i}
                          <span class="absolute top-1/2 -left-4 -translate-y-1/2 blink">
                            <PixelSprite sprite={cursor} scale={2} />
                          </span>
                        {/if}
                      </span>
                      <span class="font-label text-[11px] text-snow uppercase">{item.label}</span>
                    </a>
                  </li>
                {/each}
              </ul>
              <div
                class="px-box px-dialog mt-6 px-4 py-3 text-[18px]"
                aria-live="polite"
              >
                {items[selected].detail.value}
              </div>
            {:else}
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr]">
                <div class="px-box px-parch flex flex-col items-center gap-2 p-4">
                  <PixelSprite sprite={daltonHead} scale={4} fps={3} label="Dalton" />
                  <span class="font-title text-[11px]">DALTON</span>
                </div>
                <dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2.5 text-[18px]">
                  <dt class="font-label text-[12px] text-gold-hi uppercase">{t.role.value}</dt>
                  <dd>{role.value}</dd>
                  {#if current}
                    <dt class="font-label text-[12px] text-gold-hi uppercase">{t.guild.value}</dt>
                    <dd>{current.title}</dd>
                  {/if}
                  <dt class="font-label text-[12px] text-gold-hi uppercase">{t.home.value}</dt>
                  <dd>{location.value}</dd>
                  <dt class="font-label text-[12px] text-gold-hi uppercase">Lang</dt>
                  <dd>{languages.value}</dd>
                  <dt class="font-label text-[12px] text-gold-hi uppercase">HP</dt>
                  <dd class="flex gap-1">
                    {#each Array(5) as _, i (i)}<PixelSprite sprite={heart(4)} scale={2} />{/each}
                  </dd>
                </dl>
              </div>
            {/if}
          </div>
        {/key}
      </div>

      <p class="hidden border-t-4 border-ink bg-night-hi px-5 py-2 font-label text-[12px] text-snow/80 sm:block">
        {t.hint.value}
      </p>
    </div>
  </div>
{/if}

<style>
  .checker {
    background-color: rgb(16 24 40 / 0.72);
    background-image:
      linear-gradient(45deg, rgb(0 0 0 / 0.18) 25%, transparent 25%, transparent 75%, rgb(0 0 0 / 0.18) 75%),
      linear-gradient(45deg, rgb(0 0 0 / 0.18) 25%, transparent 25%, transparent 75%, rgb(0 0 0 / 0.18) 75%);
    background-size: 16px 16px;
    background-position:
      0 0,
      8px 8px;
  }
  .shoulder {
    display: grid;
    place-items: center;
    width: 2.6rem;
    height: 1.9rem;
    cursor: pointer;
    font-family: var(--font-title);
    font-size: 11px;
    color: var(--color-ink);
    background: var(--color-mist);
    box-shadow:
      0 -2px 0 0 var(--color-ink),
      0 2px 0 0 var(--color-ink),
      -2px 0 0 0 var(--color-ink),
      2px 0 0 0 var(--color-ink),
      inset 0 -3px 0 0 rgb(0 0 0 / 0.2);
  }
  .shoulder:active {
    transform: translateY(2px);
  }
  .map {
    background-color: var(--color-parch);
    background-image: radial-gradient(var(--color-parch-lo) 1.5px, transparent 1.5px);
    background-size: 12px 12px;
    box-shadow:
      inset 0 0 0 3px var(--color-path-lo),
      inset 0 0 0 6px var(--color-parch-lo);
  }
</style>

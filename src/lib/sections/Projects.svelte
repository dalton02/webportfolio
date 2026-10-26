<script lang="ts">
  import { slide } from "svelte/transition";
  import Button from "$lib/comps/Button.svelte";
  import Icon from "$lib/comps/Icon.svelte";
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import DialogBox from "$lib/pixel/DialogBox.svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import { chest, cursor, gem, gemBlue, gemRed, scroll, sparkle } from "$lib/pixel/sprites.js";
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { stepped } from "$lib/utils/motion.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import sfx from "$lib/utils/sfx.svelte";
  import projectsJSON from "$lib/json/projects.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.projects).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.projects,
    Text
  >;

  const projects = projectsJSON.projects.map((p) => ({
    title: new Text(p.title),
    subtitle: new Text(p.subtitle),
    desc: new Text(p.desc),
    url: p.url,
    isRepo: p.url.includes("github.com"),
    image: p.image,
    tags: p.tags,
  }));

  const tagGems = [gem, gemBlue, gemRed];

  let opened = $state<boolean[]>(projects.map(() => false));

  const gotLine = (title: string) => `${t.got.value} {g:${title}}!`;

  function toggle(i: number) {
    opened[i] = !opened[i];
    if (opened[i]) {
      sfx.chest();
      setTimeout(() => sfx.itemGet(), 260);
    } else {
      sfx.back();
    }
  }
</script>

<section id="projects" class="relative py-24 sm:py-32">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <SectionHeading title={t.heading.value} kicker={t.kicker.value} />

    <div class="flex flex-col gap-24 sm:gap-28">
      {#each projects as p, i (p.image)}
        {@const flip = i % 2 === 1}
        {@const linkLabel = p.isRepo ? t.view.value : t.visit.value}
        {@const [intro, ...rest] = p.desc.value.split("\n\n")}
        <article class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
          <!-- cover in a gold frame -->
          <div class="lg:col-span-6 {flip ? 'lg:order-2' : ''}" use:reveal>
            <svelte:element
              this={p.url ? "a" : "div"}
              href={p.url || undefined}
              target={p.url ? "_blank" : undefined}
              rel={p.url ? "noopener noreferrer" : undefined}
              aria-label={p.url ? `${linkLabel}: ${p.title.value}` : undefined}
              role={p.url ? undefined : "presentation"}
              class="cover group px-box px-gold block p-2"
              style="--fill: var(--color-night)"
              onmouseenter={() => sfx.cursor()}
            >
              <div class="relative aspect-[16/10] overflow-hidden">
                <img
                  src="{globalState.basePath}/{p.image}"
                  alt={p.title.value}
                  loading="lazy"
                  class="art h-full w-full object-cover"
                  style="image-rendering: auto;"
                />
                <!-- hover: a light band sweeps the cover, menu-style brackets lock on, a banner slides up -->
                <span class="shine pointer-events-none absolute inset-0" aria-hidden="true"></span>
                {#each ["tl", "tr", "bl", "br"] as c (c)}
                  <span class="corner {c} pointer-events-none absolute" aria-hidden="true"></span>
                {/each}
                <span
                  class="banner pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-night/90 px-3 py-2 font-label text-[12px] uppercase {p.url
                    ? 'text-gold-hi'
                    : 'text-mist'}"
                  aria-hidden="true"
                >
                  {#if p.url}
                    <span class="nudge"><PixelSprite sprite={cursor} scale={2} /></span>
                    {linkLabel}
                  {:else}
                    <Icon name="lock" class="h-4 w-4" />
                    {t.private.value}
                  {/if}
                </span>
              </div>
              <span class="spark pointer-events-none absolute -top-5 -right-5" aria-hidden="true"
                ><PixelSprite sprite={sparkle} scale={3} fps={4} /></span
              >
              <span class="spark pointer-events-none absolute -bottom-4 -left-5 [animation-delay:.15s]" aria-hidden="true"
                ><PixelSprite sprite={sparkle} scale={2} fps={4} /></span
              >
            </svelte:element>
          </div>

          <div class="relative flex flex-col gap-8 lg:col-span-6 {flip ? 'lg:order-1' : ''}" use:reveal={1}>
            <div class="px-box px-dialog flex flex-col gap-4 p-5 sm:p-6">
              <span class="font-label text-[13px] text-gold-hi uppercase">{p.subtitle.value}</span>
              <h3 class="font-title text-[15px] leading-relaxed text-snow sm:text-[18px]">{p.title.value}</h3>
              <p class="text-[17px] leading-relaxed text-snow/90">{intro}</p>

              <ul class="flex flex-wrap gap-x-4 gap-y-2">
                {#each p.tags as tag, j (tag)}
                  <li class="flex items-center gap-1.5 font-label text-[12px] text-mist">
                    <PixelSprite sprite={tagGems[j % tagGems.length]} scale={1} />
                    {tag}
                  </li>
                {/each}
              </ul>

              <div class="flex flex-wrap items-center gap-x-7 gap-y-5 pt-3 pl-6">
                {#if p.url}
                  <Button href={p.url} external variant="ghost">
                    <Icon name={p.isRepo ? "github" : "globe"} class="h-4 w-4" />
                    {linkLabel}
                  </Button>
                {:else}
                  <span class="inline-flex items-center gap-2 font-label text-[12px] text-mist uppercase">
                    <Icon name="lock" class="h-4 w-4" />
                    {t.private.value}
                  </span>
                {/if}
              </div>
            </div>

            {#if rest.length}
              <!-- the build story is the treasure: open the chest to read it -->
              <div class="flex items-end gap-4 pl-2">
                <button
                  type="button"
                  class="group relative flex cursor-pointer items-end gap-3"
                  aria-expanded={opened[i]}
                  aria-controls="project-{i}-details"
                  onclick={() => toggle(i)}
                  onmouseenter={() => sfx.cursor()}
                >
                  <span class="relative {opened[i] ? '' : 'group-hover:hop'}">
                    <PixelSprite sprite={chest} frame={opened[i] ? 1 : 0} scale={3} />
                    {#if opened[i]}
                      <span class="rise pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2">
                        <PixelSprite sprite={scroll} scale={3} />
                      </span>
                      <span class="pointer-events-none absolute -top-16 -left-3 blink"><PixelSprite sprite={sparkle} scale={3} fps={4} /></span>
                      <span class="pointer-events-none absolute -top-8 -right-4 blink [animation-delay:.3s]"
                        ><PixelSprite sprite={sparkle} scale={2} fps={4} /></span
                      >
                    {/if}
                  </span>
                  <span class="mb-1 bg-night px-2.5 py-1.5 font-label text-[13px] text-snow uppercase group-hover:text-gold-hi">
                    {opened[i] ? t.opened.value : t.open.value}
                  </span>
                </button>
              </div>

              {#if opened[i]}
                <div id="project-{i}-details" transition:slide={{ duration: 240, easing: stepped(5) }}>
                  <div class="flash pointer-events-none fixed inset-0 z-30 bg-snow" aria-hidden="true"></div>
                  <DialogBox portrait={scroll} text={gotLine(p.title.value)} cps={70}>
                    <div class="flex flex-col gap-3 text-[17px] leading-relaxed text-snow/90">
                      <span class="font-label text-[12px] text-gold-hi uppercase">{t.details.value}</span>
                      {#each rest as para, j (j)}
                        <p>{para}</p>
                      {/each}
                    </div>
                  </DialogBox>
                </div>
              {:else}
                <div id="project-{i}-details" hidden></div>
              {/if}
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  /* the item rises out of the chest in a few hard steps, then hovers */
  .rise {
    animation: rise 0.5s steps(5, end) both;
  }
  @keyframes rise {
    from {
      transform: translate(-50%, 36px);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    to {
      transform: translate(-50%, 0);
    }
  }
  /* one white frame, like the screen flash when an item is obtained */
  .flash {
    animation: flash 0.3s steps(1, end) both;
  }
  @keyframes flash {
    0% {
      opacity: 0.55;
    }
    33% {
      opacity: 0.25;
    }
    66%,
    100% {
      opacity: 0;
    }
  }

  /* cover hover: lift in two frames, flash, light sweep, bracket cursor and banner */
  .cover {
    transition: transform 0.16s steps(2, end);
  }
  .cover:hover,
  .cover:focus-visible {
    transform: translateY(-6px);
    --drop: rgb(24 16 24 / 0.5);
  }
  .cover:hover .art,
  .cover:focus-visible .art {
    animation: select 0.3s steps(1, end);
  }
  @keyframes select {
    0% {
      filter: brightness(1.45);
    }
    33% {
      filter: brightness(1.2);
    }
    66%,
    100% {
      filter: none;
    }
  }
  .shine {
    background: linear-gradient(
      115deg,
      transparent 42%,
      rgb(248 248 248 / 0.2) 42% 48%,
      transparent 48% 51%,
      rgb(248 248 248 / 0.12) 51% 54%,
      transparent 54%
    );
    transform: translateX(-110%);
  }
  .cover:hover .shine,
  .cover:focus-visible .shine {
    animation: sweep 0.6s steps(10, end) 0.1s both;
  }
  @keyframes sweep {
    to {
      transform: translateX(110%);
    }
  }
  .corner {
    z-index: 1;
    --dx: 0px;
    --dy: 0px;
    width: 14px;
    height: 14px;
    border: 0 solid var(--color-gold-hi);
    filter: drop-shadow(2px 2px 0 var(--color-ink));
    visibility: hidden;
  }
  .tl {
    top: 8px;
    left: 8px;
    border-width: 4px 0 0 4px;
    --dx: -3px;
    --dy: -3px;
  }
  .tr {
    top: 8px;
    right: 8px;
    border-width: 4px 4px 0 0;
    --dx: 3px;
    --dy: -3px;
  }
  .bl {
    bottom: 8px;
    left: 8px;
    border-width: 0 0 4px 4px;
    --dx: -3px;
    --dy: 3px;
  }
  .br {
    bottom: 8px;
    right: 8px;
    border-width: 0 4px 4px 0;
    --dx: 3px;
    --dy: 3px;
  }
  .cover:hover .corner,
  .cover:focus-visible .corner {
    visibility: visible;
    animation: breathe 0.8s steps(1, end) infinite;
  }
  /* bottom brackets sit above the banner while it is up */
  .cover:hover :is(.bl, .br),
  .cover:focus-visible :is(.bl, .br) {
    bottom: 46px;
  }
  @keyframes breathe {
    50% {
      transform: translate(var(--dx), var(--dy));
    }
  }
  .banner {
    border-top: 3px solid var(--color-gold-hi);
    transform: translateY(100%);
    transition: transform 0.18s steps(3, end);
  }
  .cover:hover .banner,
  .cover:focus-visible .banner {
    transform: translateY(0);
  }
  .nudge {
    display: inline-flex;
    animation: nudge 0.6s steps(1, end) infinite;
  }
  @keyframes nudge {
    50% {
      transform: translateX(3px);
    }
  }
  .spark {
    z-index: 1;
    visibility: hidden;
  }
  .cover:hover .spark,
  .cover:focus-visible .spark {
    visibility: visible;
    animation: px-blink 0.8s steps(1) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .cover,
    .banner {
      transition: none;
    }
    .cover:hover .art,
    .cover:hover .shine,
    .cover:hover .corner,
    .cover:hover .spark,
    .nudge {
      animation: none;
    }
    .rise,
    .flash {
      animation: none;
    }
    .flash {
      display: none;
    }
  }
</style>

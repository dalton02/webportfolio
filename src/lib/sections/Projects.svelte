<script lang="ts">
  import Icon from "$lib/comps/Icon.svelte";
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import projectsJSON from "$lib/json/projects.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = {
    heading: new Text(ui.projects.heading),
    kicker: new Text(ui.projects.kicker),
    view: new Text(ui.projects.view),
    private: new Text(ui.projects.private),
  };

  const projects = projectsJSON.projects.map((p) => ({
    title: new Text(p.title),
    subtitle: new Text(p.subtitle),
    desc: new Text(p.desc),
    url: p.url,
    image: p.image,
    tags: p.tags,
  }));
</script>

<section id="projects" class="relative py-28 sm:py-36">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <SectionHeading index={3} title={t.heading.value} kicker={t.kicker.value} />

    <div class="flex flex-col gap-28 sm:gap-36">
      {#each projects as p, i (p.image)}
        {@const flip = i % 2 === 1}
        <article class="group grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div class="relative lg:col-span-7 {flip ? 'lg:order-2' : ''}" use:reveal>
            <span
              class="index pointer-events-none absolute -top-10 z-10 font-display text-[5.5rem] leading-none font-light italic select-none sm:-top-14 sm:text-[7rem]
              {flip ? '-right-2 lg:-right-6' : '-left-2 lg:-left-6'}"
              aria-hidden="true"
            >
              0{i + 1}
            </span>

            <svelte:element
              this={p.url ? "a" : "div"}
              href={p.url || undefined}
              target={p.url ? "_blank" : undefined}
              rel={p.url ? "noopener noreferrer" : undefined}
              aria-label={p.url ? `${t.view.value}: ${p.title.value}` : undefined}
              class="relative block aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface
              transition-[border-color,box-shadow] duration-700 group-hover:border-clay/40 group-hover:shadow-[0_30px_80px_-30px_rgb(232_116_74/0.35)]"
            >
              <img
                src="{globalState.basePath}/{p.image}"
                alt={p.title.value}
                loading="lazy"
                class="h-full w-full scale-[1.02] object-cover grayscale-[0.9] contrast-[1.05] transition-[filter,transform] duration-1000 ease-[var(--ease-soft)]
                group-hover:scale-[1.06] group-hover:grayscale-0"
              />
              <div
                class="absolute inset-0 bg-clay mix-blend-color opacity-50 transition-opacity duration-1000 group-hover:opacity-0"
                aria-hidden="true"
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true"></div>
            </svelte:element>
          </div>

          <div class="flex flex-col gap-5 lg:col-span-5 {flip ? 'lg:order-1' : ''}" use:reveal={1}>
            <span class="font-mono text-[12px] tracking-[0.14em] text-clay uppercase">{p.subtitle.value}</span>
            <h3 class="font-display text-3xl leading-[1.1] font-light tracking-tight text-sand text-balance sm:text-4xl">
              {p.title.value}
            </h3>

            <div class="flex flex-col gap-3.5 text-[15px] leading-relaxed text-dust">
              {#each p.desc.value.split("\n\n") as para, j (j)}
                <p class={j === 0 ? "text-sand/85" : ""}>{para}</p>
              {/each}
            </div>

            <ul class="mt-1 flex flex-wrap gap-2">
              {#each p.tags as tag (tag)}
                <li class="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-dust">{tag}</li>
              {/each}
            </ul>

            <div class="mt-2">
              {#if p.url}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link inline-flex items-center gap-2 pb-1 text-[14px] font-medium text-sand transition-colors duration-300 hover:text-clay"
                >
                  <Icon name="github" class="h-4 w-4" />
                  {t.view.value}
                  <Icon name="arrow" class="h-3.5 w-3.5" />
                </a>
              {:else}
                <span class="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] text-dust/80">
                  <Icon name="lock" class="h-3.5 w-3.5" />
                  {t.private.value}
                </span>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .index {
    color: transparent;
    -webkit-text-stroke: 1px color-mix(in oklab, var(--color-sand) 22%, transparent);
    transition: -webkit-text-stroke-color 0.7s;
  }
  :global(.group:hover) .index {
    -webkit-text-stroke-color: color-mix(in oklab, var(--color-clay) 70%, transparent);
  }
  .link {
    background: linear-gradient(currentColor, currentColor) 0 100% / 0% 1px no-repeat;
    transition:
      background-size 0.5s var(--ease-soft),
      color 0.3s;
  }
  .link:hover {
    background-size: 100% 1px;
  }
</style>

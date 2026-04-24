<script lang="ts">
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";

  interface Props {
    title: string;
    subtitle: string;
    desc: string;
    tags: string[];
    image: string;
    url?: string;
  }

  let { title, subtitle, desc, tags, image, url }: Props = $props();
</script>

<article
  class="group/card relative flex w-full flex-col overflow-hidden
  rounded-2xl bg-secondary/80 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]
  backdrop-blur-sm transition-all duration-500 ease-out
  hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(140,199,196,0.15)]"
>
  <div
    class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5
    opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
    aria-hidden="true"
  ></div>

  <div class="relative h-52 w-full overflow-hidden">
    <img
      alt={title}
      width="600"
      height="338"
      class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
      src="{globalState.basePath}/{image}"
      loading="lazy"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
      aria-hidden="true"
      style="background-image: radial-gradient(circle, rgb(140,199,196) 1px, transparent 1px); background-size: 18px 18px;"
    ></div>

    <div class="absolute bottom-3 left-4 right-4">
      <div class="flex items-center gap-2">
        <span class="h-px w-6 bg-primary"></span>
        <p class="select-none text-xs font-medium uppercase tracking-[0.15em] text-primary">
          {subtitle}
        </p>
      </div>
    </div>
  </div>

  <div class="relative flex flex-1 flex-col px-5 pt-4 pb-5">
    <h3
      class="select-none font-semibold text-egg text-lg leading-tight
      transition-colors duration-300 group-hover/card:text-primary"
    >
      {title}
    </h3>

    <p
      class="mt-3 select-none text-sm leading-relaxed text-egg/70
      lg:line-clamp-4 transition-[color,-webkit-line-clamp] duration-300
      lg:group-hover/card:line-clamp-none group-hover/card:text-egg/85"
    >
      {desc}
    </p>

    <div class="mt-4 flex flex-wrap gap-1.5">
      {#each tags as tag}
        <span
          class="inline-flex shrink-0 select-none items-center rounded-md
          border border-primary/20 bg-primary/5 px-2 py-0.5
          text-[11px] font-medium tracking-wide text-primary/90
          transition-colors duration-300 group-hover/card:border-primary/40 group-hover/card:bg-primary/10"
        >
          {tag}
        </span>
      {/each}
    </div>

    <div class="mt-5 pt-4 border-t border-white/5">
      {#if url}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="group/btn flex items-center justify-between rounded-lg
          px-1 py-1 text-sm font-medium text-egg/90 transition-colors duration-300
          hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <span>
            {new Text({ enUs: "View Project", ptBr: "Ver projeto" }).value}
          </span>
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full
            border border-primary/30 bg-primary/5 transition-all duration-300
            group-hover/btn:border-primary group-hover/btn:bg-primary group-hover/btn:text-background"
          >
            <svg
              class="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </span>
        </a>
      {:else}
        <div
          class="flex items-center justify-between rounded-lg px-1 py-1 text-sm font-medium text-egg/50"
        >
          <span>
            {new Text({ enUs: "Private Project", ptBr: "Projeto Privado" })
              .value}
          </span>
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full
            border border-egg/15 bg-egg/5"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0h-2m6-6V7a4 4 0 10-8 0v4m-2 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z"
              ></path>
            </svg>
          </span>
        </div>
      {/if}
    </div>
  </div>
</article>

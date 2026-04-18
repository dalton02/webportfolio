<script lang="ts">
  import globalState from "$lib/utils/global.svelte";
  import language, { Text } from "$lib/utils/lang.svelte";

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

<div
  class="group/general relative shrink-0 w-[375px] lg:w-[420px] overflow-hidden
  rounded-2xl border border-gray-200/50 shadow-lg backdrop-blur-sm transition-all duration-300"
>
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.1]"
    aria-hidden="true"
    style="background-image: radial-gradient(circle, rgb(45, 209, 110) 1px, transparent 1px); background-size: 20px 20px; transform: translateZ(0px);"
  ></div>
  <div
    class="relative h-60 w-full overflow-hidden border-b-2
     border-gray-700"
  >
    <img
      alt={title}
      width="600"
      height="338"
      class="h-full w-full transition-transform pointer-event-none duration-200 group-hover/general:scale-105 object-cover"
      src="{globalState.basePath}/{image}"
      style="color: transparent; aspect-ratio: 600 / 338;"
    />
  </div>
  <div
    class="relative flex flex-col p-4 md:p-6"
    style="height: calc(100% - 240px);"
  >
    <div class="mb-1 flex items-start justify-between">
      <div>
        <h3 class="select-none font-semibold text-white text-md">
          {title}
        </h3>
        <p class="select-none text-sm">
          {subtitle}
        </p>
      </div>
    </div>
    <div class="mt-4 flex-1 group">
      <p
        class="line-clamp-4 select-none group-hover:line-clamp-none group-active:line-clamp-none text-sm"
      >
        {desc}
      </p>
    </div>

    <div class="mt-4 flex flex-wrap gap-1.5">
      {#each tags as tag}
        <span
          class="inline-flex shrink-0 select-none items-center justify-center rounded-md px-1.5 py-0.5
           text-xs font-medium bg-gray-700 text-gray-300"
        >
          {tag}
        </span>
      {/each}
    </div>
    <div
      class="-mx-6 -mb-6 mt-4 flex flex-col justify-center rounded-b-lg border-t border-gray-200 px-6 py-6 backdrop-blur-sm"
    >
      {#if url}
        <a
          href={url}
          target="_blank"
          class="group/btn rounded-xl border-2 border-primary-500 hover:bg-egg bg-transparent px-6 py-2
          text-center text-base font-semibold text-primary-500 shadow-lg transition-all duration-200
          hover:border-primary-400 hover:bg-primary-500 hover:text-background hover:shadow-lg focus:outline-none
          focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <span class="flex items-center justify-center"
            >{new Text({ enUs: "View Project", ptBr: "Ver projeto" }).value}<svg
              class="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path></svg
            ></span
          >
        </a>
      {:else}
        <div
          class="group/btn rounded-xl bg-orange-500 px-6 py-2
          text-center text-base font-semibold text-red-50 shadow-lg transition-all duration-200
         hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <span class="flex items-center justify-center">
            {new Text({ enUs: "Private Project", ptBr: "Projeto Privado" })
              .value}
          </span>
        </div>
      {/if}
    </div>
  </div>
</div>

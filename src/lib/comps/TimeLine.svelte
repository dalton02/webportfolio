<script lang="ts">
  import language, { Text } from "$lib/utils/lang.svelte";
  import mediaQuery from "$lib/utils/media.svelte";
  import { firstCap } from "$lib/utils/text.js";
  import { format, formatDate, isAfter } from "date-fns";
  import { slide } from "svelte/transition";

  let {
    timeline,
  }: {
    timeline: {
      title: string;
      desc: string;
      from: Date;
      to: Date | null;
    }[];
  } = $props();

  let linesPerJob = $derived.by(() => {
    if (mediaQuery.lg.current) {
      return 14;
    } else {
      return 9;
    }
  });
  let linesBetween = $derived.by(() => {
    if (mediaQuery.lg.current) {
      return 19;
    } else {
      return 10;
    }
  });

  let container = $state<HTMLDivElement>();
  let focus = $state(0);
  let moveX = $derived.by(() => {
    if (!container) return 0;
    const lineFocus = (linesPerJob + 1) * focus + linesBetween + 1;

    const containerWidth = container.clientWidth;

    const lineWidth = 1;
    const gap = 12;

    const lineX = lineFocus * (lineWidth + gap);
    const lineCenter = lineX + lineWidth / 2;

    const containerCenter = containerWidth / 2;

    const translate = containerCenter - lineCenter;

    return translate;
  });
</script>

<div
  class="w-full overflow-hidden h-[300px] flex origin-center relative"
  bind:this={container}
>
  <div
    class="absolute left-0 sh w-30 lg:w-50 z-10 h-full pointer-events-none"
  ></div>
  <div
    class="absolute right-0 sh2 z-10 w-30 lg:w-50 h-full pointer-events-none"
  ></div>

  <div
    class="flex gap-3 transition-all duration-500 pt-4"
    style="transform: translateX({moveX}px)"
  >
    {#each { length: linesBetween } as _, i}
      {@render lineS(i, true)}
    {/each}
    {#each timeline as line, i}
      {@const selected = i === focus}
      <div class="relative w-px flex justify-center">
        <button
          class="flex flex-col absolute top-0 cursor-pointer px-1 gap-2 justify-start items-center"
          onclick={() => (focus = i)}
        >
          <div
            class="absolute w-2.5 h-2.5 top-[-5px] bg-primary rounded-full"
          ></div>
          <div
            class="w-[2px] shrink-0 transition-all duration-500 {selected
              ? 'h-[120px]'
              : 'h-[60px]'} bg-primary"
          ></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="white"
            viewBox="0 0 256 256"
            ><path
              d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"
            ></path></svg
          >
          {#if selected}
            <div class="flex flex-col items-center">
              <b class="text-xl text-white whitespace-nowrap">
                {line.title}
              </b>
              <span
                class="text-lg text-white/55 whitespace-nowrap tracking-tight"
              >
                {line.desc}
              </span>

              <span
                class="text-white/55 whitespace-nowrap text-sm tracking-tight"
              >
                {firstCap(
                  format(line.from, "MMM yyyy", { locale: language.locale }),
                )} -{line.to
                  ? firstCap(
                      format(line.to, "MMM yyyy", { locale: language.locale }),
                    )
                  : new Text({ ptBr: "Presente", enUs: "Present" }).value}
              </span>
            </div>
          {/if}
        </button>
      </div>

      {#each { length: linesPerJob } as _, i}
        {@render lineS(i, false)}
      {/each}
    {/each}

    {#each { length: linesBetween } as _, i}
      {@render lineS(i, true)}
    {/each}
  </div>
</div>

{#snippet lineS(i: number, curve: boolean)}
  <div class="w-px h-[35px] shrink-0 bg-white/45"></div>
{/snippet}

<style>
  .sh {
    opacity: 0.85;
    background: var(--color-background);
    background: linear-gradient(
      90deg,
      var(--color-background) 20%,
      rgba(237, 221, 83, 0) 100%
    );
  }
  .sh2 {
    opacity: 0.85;
    background: var(--color-background);
    background: linear-gradient(
      -90deg,
      var(--color-background) 20%,
      rgba(237, 221, 83, 0) 100%
    );
  }
</style>

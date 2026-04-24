<script lang="ts">
  import language, { Text } from "$lib/utils/lang.svelte";
  import { firstCap } from "$lib/utils/text.js";
  import { format, differenceInMonths } from "date-fns";

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

  let sorted = $derived(
    [...timeline].sort((a, b) => b.from.getTime() - a.from.getTime()),
  );

  const present = new Text({ ptBr: "Presente", enUs: "Present" });
  const yearLabel = new Text({ ptBr: "ano", enUs: "yr" });
  const yearsLabel = new Text({ ptBr: "anos", enUs: "yrs" });
  const monthLabel = new Text({ ptBr: "mês", enUs: "mo" });
  const monthsLabel = new Text({ ptBr: "meses", enUs: "mos" });

  function duration(from: Date, to: Date | null) {
    const end = to ?? new Date();
    const months = Math.max(1, differenceInMonths(end, from));
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts: string[] = [];
    if (y > 0) parts.push(`${y} ${y === 1 ? yearLabel.value : yearsLabel.value}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? monthLabel.value : monthsLabel.value}`);
    return parts.join(" ");
  }

  function fmt(d: Date) {
    return firstCap(format(d, "MMM yyyy", { locale: language.locale }));
  }
</script>

<ol class="relative flex flex-col gap-5 pl-6 border-l border-primary/25">
  {#each sorted as job, i}
    {@const isCurrent = job.to === null}
    <li class="relative">
      <span
        class="absolute left-[-27px] top-5 flex h-3 w-3 items-center justify-center rounded-full bg-primary"
        aria-hidden="true"
      >
        {#if isCurrent}
          <span
            class="absolute inline-flex h-full w-full rounded-full bg-primary/60 animate-ping"
          ></span>
        {/if}
      </span>

      <div
        class="group relative flex flex-col gap-2 rounded-xl border border-white/5 bg-secondary/70 px-5 py-4
        transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30
        hover:bg-secondary hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h4
              class="text-primary text-lg leading-tight font-medium tracking-wide"
            >
              {job.title}
            </h4>
            <p class="mt-0.5 text-sm text-egg/75">
              {job.desc}
            </p>
          </div>
          {#if isCurrent}
            <span
              class="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary"
            >
              {present.value}
            </span>
          {/if}
        </div>

        <div
          class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-wide text-white/45"
        >
          <span>{fmt(job.from)}</span>
          <span class="text-white/25">—</span>
          <span>{job.to ? fmt(job.to) : present.value}</span>
          <span class="text-white/25">·</span>
          <span class="text-white/60">{duration(job.from, job.to)}</span>
        </div>
      </div>
    </li>
  {/each}
</ol>

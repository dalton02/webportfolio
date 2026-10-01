<script lang="ts">
  import { differenceInMonths, format } from "date-fns";
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import language, { Text } from "$lib/utils/lang.svelte";
  import { firstCap } from "$lib/utils/text.js";
  import { reveal } from "$lib/utils/reveal.js";
  import aboutJSON from "$lib/json/about.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.experience).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.experience,
    Text
  >;

  const jobs = aboutJSON.timeline
    .map((j) => ({
      company: j.title,
      role: new Text(j.desc),
      highlights: new Text(j.highlights),
      location: new Text(j.location),
      note: "note" in j && j.note ? new Text(j.note) : null,
      from: new Date(j.from),
      to: j.to ? new Date(j.to) : null,
    }))
    // most recent end date first (current job on top), like the resume
    .sort((a, b) => (b.to?.getTime() ?? Infinity) - (a.to?.getTime() ?? Infinity) || b.from.getTime() - a.from.getTime());

  function duration(from: Date, to: Date | null) {
    const months = Math.max(1, differenceInMonths(to ?? new Date(), from));
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts: string[] = [];
    if (y > 0) parts.push(`${y} ${y === 1 ? t.year.value : t.years.value}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? t.month.value : t.months.value}`);
    return parts.join(" ");
  }

  function fmt(d: Date) {
    return firstCap(format(d, "MMM yyyy", { locale: language.locale }));
  }
</script>

<section id="experience" class="relative py-28 sm:py-36">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <SectionHeading index={2} title={t.heading.value} kicker={t.kicker.value} />

    <ol class="border-b border-line">
      {#each jobs as job (job.company + job.from.getTime())}
        {@const current = job.to === null}
        <li
          class="group relative isolate grid grid-cols-1 gap-4 border-t border-line py-9 transition-colors duration-500 md:grid-cols-12 md:gap-8"
          use:reveal
        >
          <div
            class="pointer-events-none absolute inset-y-0 -inset-x-4 -z-10 rounded-2xl bg-surface/0 transition-colors duration-500 group-hover:bg-surface/50 sm:-inset-x-6"
            aria-hidden="true"
          ></div>

          <div class="flex flex-col gap-1.5 font-mono text-[12px] tracking-[0.04em] text-dust md:col-span-3">
            <span class="flex items-center gap-2.5">
              {#if current}
                <span class="relative flex h-1.5 w-1.5">
                  <span class="absolute inset-0 animate-ping rounded-full bg-clay/70 [animation-duration:2.4s]"></span>
                  <span class="relative h-1.5 w-1.5 rounded-full bg-clay"></span>
                </span>
              {/if}
              {fmt(job.from)} — {job.to ? fmt(job.to) : t.present.value}
            </span>
            <span class="text-dust/60">{duration(job.from, job.to)}</span>
            <span class="text-dust/60">{job.location.value}</span>
          </div>

          <div class="flex flex-col gap-1 md:col-span-4">
            <h3 class="flex items-center gap-3 font-display text-2xl leading-tight text-sand transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-1 sm:text-[1.7rem]">
              {job.company}
              {#if current}
                <span class="rounded-full border border-clay/40 bg-clay/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-clay uppercase">
                  {t.now.value}
                </span>
              {/if}
            </h3>
            <span class="text-[14px] text-clay/90">{job.role.value}</span>
            {#if job.note}
              <span class="font-mono text-[11px] tracking-[0.04em] text-sun/80">↑ {job.note.value}</span>
            {/if}
          </div>

          <p class="text-[15px] leading-relaxed text-dust md:col-span-5">
            {job.highlights.value}
          </p>
        </li>
      {/each}
    </ol>
  </div>
</section>

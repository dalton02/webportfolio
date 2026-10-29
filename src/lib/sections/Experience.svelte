<script lang="ts">
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import { pinwheel, sign, tuft } from "$lib/pixel/sprites.js";
  import Soldadinho from "$lib/pixel/Soldadinho.svelte";
  import globalState from "$lib/utils/global.svelte";
  import language, { Text } from "$lib/utils/lang.svelte";
  import sfx from "$lib/utils/sfx.svelte";
  import { firstCap } from "$lib/utils/text.js";
  import { reveal } from "$lib/utils/reveal.js";
  import aboutJSON from "$lib/json/about.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.experience).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.experience,
    Text
  >;
  const pinwheelLabel = new Text(ui.weather.pinwheel);

  // a paper pinwheel turns lazily in the grass; give it a spin and a gale sweeps the field
  const GALE = 25;
  let windy = $derived(globalState.weather === "wind");
  function callWind() {
    sfx.select();
    globalState.setWeather("wind", GALE);
  }

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
    const end = to ?? new Date();
    // whole months between the two, like date-fns differenceInMonths: a month counts once its day comes round
    const whole = (end.getFullYear() - from.getFullYear()) * 12 + end.getMonth() - from.getMonth() - (end.getDate() < from.getDate() ? 1 : 0);
    const months = Math.max(1, whole);
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts: string[] = [];
    if (y > 0) parts.push(`${y} ${y === 1 ? t.year.value : t.years.value}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? t.month.value : t.months.value}`);
    return parts.join(" ");
  }

  function fmt(d: Date) {
    // "jan. 2024" from Intl, without the abbreviation dot, as "Jan 2024"
    const month = d.toLocaleString(language.locale, { month: "short" }).replace(".", "");
    return firstCap(`${month} ${d.getFullYear()}`);
  }
</script>

<section id="experience" class="relative py-24 sm:py-32">
  <!-- right margin on wide screens, opposite the road; above the heading on small ones -->
  <button
    type="button"
    class="absolute top-6 right-[6%] z-20 flex flex-col items-center xl:top-[260px] xl:right-[max(8px,calc(50%-576px-80px))]"
    aria-label={pinwheelLabel.value}
    onclick={callWind}
    onmouseenter={() => sfx.cursor()}
  >
    <span class="relative z-0 -mb-6"><PixelSprite sprite={pinwheel} scale={3} fps={windy ? 14 : 2} /></span>
    <span class="relative z-[1]" aria-hidden="true"><PixelSprite sprite={tuft} scale={3} /></span>
  </button>
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <!--
      The dirt road is painted by the Background canvas through these [data-trail] anchors.
      On wide screens it comes in from the left edge, turns at the room's signpost, runs down
      the margin and swings over to the signs; on smaller ones it starts in a clearing.
    -->
    <div class="relative flow-root xl:pb-8">
      <SectionHeading title={t.heading.value} kicker={t.kicker.value} />
      <span data-trail="0" data-trail-edge class="anchor hidden top-[44px] left-[-56px] xl:block"></span>
      <span data-trail="1" class="anchor hidden bottom-[56px] left-[-56px] xl:block"></span>
      <span data-trail="2" class="anchor hidden bottom-[40px] left-[calc(50%-110px)] xl:block"></span>
      <span data-trail="2" class="anchor hidden bottom-[20px] left-1/2 md:block xl:hidden"></span>
      <span data-trail="2" class="anchor bottom-[16px] left-[26px] md:hidden"></span>
    </div>

    <!-- each job is a signpost along the road -->
    <div class="relative">
      <span data-trail="3" class="anchor hidden top-[40px] left-1/2 md:block"></span>
      <span data-trail="4" class="anchor bottom-[-48px] left-1/2 hidden md:block"></span>
      <span data-trail="4" class="anchor bottom-[-48px] left-[26px] md:hidden"></span>
      <ol class="relative">
        {#each jobs as job, i (job.company + job.from.getTime())}
          {@const current = job.to === null}
          {@const right = i % 2 === 1}
          <li class="relative grid grid-cols-[52px_1fr] gap-3 pb-16 last:pb-4 md:grid-cols-[1fr_96px_1fr] md:gap-6">
            <div class="relative col-start-1 row-start-1 flex justify-center pt-1 md:col-start-2">
              <PixelSprite sprite={sign} scale={3} />
              {#if current}
                <!-- perched on top of the current job's sign, shadow on the wood -->
                <span class="absolute -top-[50px] left-1/2 hidden -translate-x-1/2 md:block" aria-hidden="true">
                  <Soldadinho scale={3} shade="#2a181098" />
                </span>
              {/if}
            </div>

            <article
              class="px-box px-parch col-start-2 row-start-1 flex flex-col gap-3 p-5 sm:p-6
              {right ? 'md:col-start-3' : 'md:col-start-1'}"
              use:reveal
            >
              <header class="flex flex-col gap-1">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="font-title text-[15px] leading-snug sm:text-[17px]">{job.company}</h3>
                  {#if current}
                    <span class="bg-heart px-2 py-1 font-label text-[11px] text-snow uppercase blink">{t.here.value}</span>
                  {/if}
                </div>
                <span class="text-[18px] font-semibold text-grass-lo">{job.role.value}</span>
                {#if job.note}
                  <span class="font-label text-[12px] text-gold-lo">↑ {job.note.value}</span>
                {/if}
                <span class="font-label text-[12px] text-path-lo uppercase">
                  {fmt(job.from)} — {job.to ? fmt(job.to) : t.present.value} · {duration(job.from, job.to)} · {job.location.value}
                </span>
              </header>
              <p class="text-[17px] leading-relaxed">{job.highlights.value}</p>
            </article>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</section>

<style>
  .anchor {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }
</style>

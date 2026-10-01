<script lang="ts">
  import Button from "$lib/comps/Button.svelte";
  import Icon from "$lib/comps/Icon.svelte";
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import aboutJSON from "$lib/json/about.json" with { type: "json" };
  import homeJSON from "$lib/json/home.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.hero).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.hero,
    Text
  >;

  const catchPhrase = new Text(aboutJSON.catchPhrase);
  const doing = new Text(homeJSON.doing);

  const current = aboutJSON.timeline.find((j) => j.to === null);
  const resume = new Text(ui.links.resume);
</script>

<section id="home" class="relative flex min-h-svh flex-col justify-center overflow-hidden pt-24 pb-16">
  <!-- dusk: a warm horizon glow sitting behind the hero -->
  <div
    class="pointer-events-none absolute inset-x-0 -top-40 h-[640px]"
    style="background: radial-gradient(ellipse 60% 55% at 72% 30%, rgb(232 116 74 / 0.13), transparent 70%), radial-gradient(ellipse 40% 35% at 20% 10%, rgb(242 197 124 / 0.05), transparent 70%);"
    aria-hidden="true"
  ></div>

  <div class="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
    <div class="flex flex-col lg:col-span-7">
      {#if current}
        <p
          class="mb-8 inline-flex w-fit items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface/70 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-dust backdrop-blur-sm"
          use:reveal={0}
        >
          <span class="relative flex h-1.5 w-1.5">
            <span class="absolute inset-0 animate-ping rounded-full bg-clay/70 [animation-duration:2.4s]"></span>
            <span class="relative h-1.5 w-1.5 rounded-full bg-clay"></span>
          </span>
          {t.currently.value} <span class="text-sand">{current.title}</span>
          <span class="hidden text-dust/40 sm:inline">·</span>
          <span class="hidden sm:inline">{t.location.value}</span>
        </p>
      {/if}

      <p class="mb-3 font-mono text-[12px] tracking-[0.2em] text-clay uppercase" use:reveal={1}>
        {t.role.value}
      </p>

      <h1
        class="font-display font-soft text-[clamp(3.6rem,12vw,8.5rem)] leading-[0.88] font-light tracking-[-0.035em] text-sand"
        use:reveal={2}
      >
        Dalton<br />
        <span class="italic text-clay">Gomes</span><span class="text-sun">.</span>
      </h1>

      <p
        class="mt-8 max-w-xl font-display text-2xl leading-snug font-light text-sand/90 text-balance sm:text-[1.9rem]"
        use:reveal={3}
      >
        {catchPhrase.value}
      </p>
      <p class="mt-3 max-w-lg text-[15px] leading-relaxed text-dust" use:reveal={4}>
        {doing.value}
      </p>

      <div class="mt-10 flex flex-wrap items-center gap-3" use:reveal={5}>
        <Button href="#contact">
          {t.ctaContact.value}
          <Icon name="arrow" class="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Button>
        <Button href="#projects" variant="ghost">{t.ctaProjects.value}</Button>
        <Button href="{globalState.basePath}/{resume.value}" variant="ghost" external>
          <Icon name="download" class="h-4 w-4" />
          {t.resume.value}
        </Button>

        <span class="mx-1 hidden h-6 w-px bg-line sm:block"></span>

        <a
          href={ui.links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="grid h-11 w-11 place-items-center rounded-full text-dust transition-colors duration-300 hover:text-clay"
        >
          <Icon name="github" class="h-5 w-5" />
        </a>
        <a
          href={ui.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          class="grid h-11 w-11 place-items-center rounded-full text-dust transition-colors duration-300 hover:text-clay"
        >
          <Icon name="linkedin" class="h-[18px] w-[18px]" />
        </a>
      </div>
    </div>

    <div class="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:col-span-5 lg:max-w-[380px]" use:reveal={2}>
      <!-- setting sun behind the arch -->
      <div
        class="sun-disc pointer-events-none absolute -top-6 -right-4 aspect-square w-[78%] rounded-full sm:-top-10 sm:-right-10"
        aria-hidden="true"
      ></div>

      <div class="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px] border border-line bg-surface">
        <img
          src="{globalState.basePath}/photo.webp"
          alt="Dalton Gomes"
          class="h-full w-full scale-[1.04] object-cover object-[50%_20%] saturate-[0.8] sepia-[0.25] hue-rotate-[-8deg]"
          fetchpriority="high"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" aria-hidden="true"></div>
        <div class="absolute inset-0 rounded-t-full rounded-b-[28px] ring-1 ring-sand/5 ring-inset" aria-hidden="true"></div>

        <div
          class="absolute inset-0 bg-gradient-to-b from-clay/25 via-sun/5 to-transparent mix-blend-soft-light"
          aria-hidden="true"
        ></div>
        <span class="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.18em] text-sun/80 uppercase">
          {homeJSON.stack}
        </span>
      </div>
    </div>
  </div>
</section>

<style>
  .sun-disc {
    background: radial-gradient(circle at 40% 40%, rgb(242 197 124 / 0.22), rgb(232 116 74 / 0.12) 45%, transparent 70%);
    filter: blur(8px);
    animation: drift 18s ease-in-out infinite alternate;
  }
  @keyframes drift {
    to {
      transform: translate(-14px, 10px) scale(1.04);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .sun-disc {
      animation: none;
    }
  }
</style>

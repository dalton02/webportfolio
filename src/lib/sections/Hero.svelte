<script lang="ts">
  import Button from "$lib/comps/Button.svelte";
  import Icon from "$lib/comps/Icon.svelte";
  import DialogBox from "$lib/pixel/DialogBox.svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import { dalton, daltonHi, groundShadow, nextArrow, sparkle } from "$lib/pixel/sprites.js";
  import Soldadinho from "$lib/pixel/Soldadinho.svelte";
  import language, { Text } from "$lib/utils/lang.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import { resumeUrl } from "$lib/utils/resume.js";
  import sfx from "$lib/utils/sfx.svelte";
  import homeJSON from "$lib/json/home.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.hero).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.hero,
    Text
  >;
  const speaker = new Text(ui.dialog.speaker);

  const resume = new Text(resumeUrl);

  const socials = [
    { href: ui.links.github, label: "GitHub", icon: "github" },
    { href: ui.links.linkedin, label: "LinkedIn", icon: "linkedin" },
  ] as const;

  // Soldadinho introduces Dalton in his own words; the whole line lives in ui.json (hero.greet)
  let line = $derived(t.greet.value);

  // hover (or tap) Dalton and he raises his hand and says hi
  let hi = $state(false);
  let hiTimer: ReturnType<typeof setTimeout> | undefined;
  function sayHi() {
    if (!hi) sfx.hi(language.value);
    hi = true;
  }
  // a tap has no "leave", so on touch the hand comes down by itself
  function tapHi() {
    sayHi();
    clearTimeout(hiTimer);
    hiTimer = setTimeout(() => (hi = false), 1600);
  }
  $effect(() => () => clearTimeout(hiTimer));
</script>

<section id="home" class="relative flex min-h-svh flex-col justify-center pt-32 pb-24 sm:pt-28">
  <div class="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
    <div class="flex flex-col lg:col-span-7">
      <p class="mb-4 font-title text-[11px] leading-relaxed text-path-hi uppercase px-outline-sm sm:text-[13px]" use:reveal={1}>
        {t.role.value}
      </p>

      <h1
        class="font-title text-[clamp(2.4rem,9vw,5rem)] leading-[1.15] text-gold-hi uppercase px-outline"
        use:reveal={2}
      >
        Dalton<br />
        <span class="text-snow">Gomes</span>
      </h1>

      <div class="mt-10" use:reveal={3}>
        <DialogBox speaker={speaker.value} text={line} cps={60}>
          <!-- 6px inset = the button's pixel border, so its visible edge lines up with the text -->
          <div class="grid grid-cols-1 gap-7 px-1.5 pt-2 sm:grid-cols-2">
            <Button href="#projects" class="w-full">{t.ctaProjects.value}</Button>
            <Button href="#contact" variant="ghost" class="w-full">{t.ctaContact.value}</Button>
            <Button href={resume.value} variant="gold" external class="w-full sm:col-span-2">
              <Icon name="download" class="h-4 w-4" />
              {t.resume.value}
            </Button>
          </div>
        </DialogBox>
      </div>

      <div class="mt-8 flex items-center gap-5 pl-1" use:reveal={4}>
        {#each socials as l (l.label)}
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.label}
            class="px-box px-slot-dark grid h-12 w-12 place-items-center text-snow hover:text-gold-hi"
          >
            <Icon name={l.icon} class="h-8 w-8" />
          </a>
        {/each}
      </div>
    </div>

    <!-- Dalton in pixel form, standing in the field breathing, with the soldadinho at his feet -->
    <div class="relative mx-auto flex w-full max-w-[300px] flex-col items-center lg:col-span-5 lg:max-w-[340px]" use:reveal={2}>
      <div class="relative flex flex-col items-center">
        <span class="absolute -top-4 right-2 z-10 blink sm:right-[20px]" aria-hidden="true"><PixelSprite sprite={sparkle} scale={4} fps={3} /></span>
        <span class="absolute top-1/3 left-0 z-10 blink [animation-delay:.5s] sm:left-[12px]" aria-hidden="true"
          ><PixelSprite sprite={sparkle} scale={3} fps={3} /></span
        >
        <!-- the sprite carries 12 clear columns each side for the raised arm; only the middle,
             where he stands, takes the hover, so the margin never covers the soldadinho -->
        <button
          type="button"
          class="pointer-events-none relative z-[1]"
          aria-label="Dalton Gomes, say hi"
          onmouseenter={sayHi}
          onmouseleave={() => (hi = false)}
          onclick={tapHi}
        >
          <span class="pointer-events-auto absolute inset-y-0 right-12 left-12 cursor-pointer sm:right-[60px] sm:left-[60px]" aria-hidden="true"></span>
          {#if hi}
            <span class="hi-bubble absolute -top-2 right-10 z-10 font-title text-[16px] whitespace-nowrap text-ink uppercase sm:-top-1 sm:right-12 sm:text-[20px]" aria-hidden="true"
              >{t.hi.value}</span
            >
          {/if}
          <PixelSprite sprite={hi ? daltonHi : dalton} scale={4} fps={hi ? 0 : 3} class="sm:hidden" />
          <PixelSprite sprite={hi ? daltonHi : dalton} scale={5} fps={hi ? 0 : 3} class="hidden sm:block" />
        </button>
        <span class="-mt-5 sm:-mt-8" aria-hidden="true">
          <PixelSprite sprite={groundShadow} scale={8} class="sm:hidden" />
          <PixelSprite sprite={groundShadow} scale={10} class="hidden sm:block" />
        </span>
        <span class="absolute -right-4 bottom-3 z-[2] hop sm:-right-5" aria-hidden="true"
          ><Soldadinho scale={3} /></span
        >
      </div>

      <span class="mt-6 px-box px-wood px-3 py-1.5 font-label text-[12px] tracking-wide">{homeJSON.stack}</span>
    </div>
  </div>

  <a
    href="#about"
    class="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-label text-[12px] text-snow uppercase px-outline-sm"
  >
    {t.scroll.value}
    <span class="bob"><PixelSprite sprite={nextArrow} scale={3} /></span>
  </a>
</section>

<style>
  /* speech bubble beside his head (the waving hand is on the other side), tail pointing at him */
  .hi-bubble {
    padding: 6px 10px 4px;
    background: var(--color-snow);
    box-shadow:
      0 -3px 0 0 var(--color-ink),
      0 3px 0 0 var(--color-ink),
      -3px 0 0 0 var(--color-ink),
      3px 0 0 0 var(--color-ink);
    animation: hi-pop 0.18s steps(3) both;
  }
  .hi-bubble::after {
    content: "";
    position: absolute;
    left: -9px;
    bottom: -9px;
    width: 9px;
    height: 9px;
    background: var(--color-snow);
    box-shadow:
      -3px 0 0 0 var(--color-ink),
      0 3px 0 0 var(--color-ink),
      3px 0 0 0 var(--color-ink);
  }
  @keyframes hi-pop {
    from {
      transform: translateY(6px) scale(0.6);
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .hi-bubble {
      animation: none;
    }
  }
</style>

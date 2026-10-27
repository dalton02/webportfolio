<script lang="ts">
  import { onMount } from "svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import PauseMenu from "$lib/pixel/PauseMenu.svelte";
  import { heart } from "$lib/pixel/sprites.js";
  import globalState, { type SectionsType } from "$lib/utils/global.svelte";
  import language, { Text } from "$lib/utils/lang.svelte";
  import sfx from "$lib/utils/sfx.svelte";
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.hud).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.hud,
    Text
  >;

  const HEARTS = 5;

  /** scroll progress in quarter-hearts; you always start with one full heart */
  let quarters = $state(4);
  let scrolled = $state(false);
  /** HUD tucks away while you walk down the page and comes back on scroll up */
  let goingDown = $state(false);
  /** mouse resting where the HUD lives */
  let peek = $state(false);
  let focused = $state(false);

  let hidden = $derived(scrolled && goingDown && !peek && !focused && !globalState.menuOpen);

  onMount(() => {
    sfx.init();

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // a few px of slack so tiny trackpad jitters don't flicker the HUD
      if (Math.abs(y - lastY) > 6) {
        goingDown = y > lastY;
        lastY = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      quarters = 4 + Math.round(p * (HEARTS - 1) * 4);
      scrolled = window.scrollY > 24;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // the zone grows a bit once the HUD is out, so it doesn't drop the moment you reach a button
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") peek = e.clientY < (hidden ? 48 : 96);
    };
    const onLeave = () => (peek = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          globalState.activeSection = e.target.id as SectionsType;
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const el of document.querySelectorAll("section[id]")) io.observe(el);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      io.disconnect();
    };
  });

  /** The HUD keys do what their badges say: B sound, A language, R (or M) menu. */
  function onKey(e: KeyboardEvent) {
    const typing = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
    if (typing || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey || globalState.menuOpen || globalState.gameOpen) return;
    const key = e.key.toLowerCase();
    if (key === "b") sfx.toggle();
    else if (key === "a") {
      language.toggle();
      sfx.cursor();
    } else if (key === "r" || key === "m") openMenu();
    else return;
    e.preventDefault();
  }

  function openMenu() {
    sfx.select();
    globalState.menuOpen = true;
  }
</script>

<svelte:window onkeydown={onKey} />

<header class="pointer-events-none fixed inset-x-0 top-0 z-40">
  <div
    class="hud {hidden ? 'tucked' : ''}"
    onfocusin={(e) => (focused = (e.target as HTMLElement).matches(":focus-visible"))}
    onfocusout={() => (focused = false)}
  >
    <!-- no strip behind the HUD: the buttons carry their own frames and the hearts a hard shadow -->
    <div class="relative mx-auto flex max-w-6xl items-start justify-between gap-3 px-3 pt-3 sm:px-6 sm:pt-4">
      <!-- left: life and gems, like the top-left of a GBA screen -->
      <div class="pointer-events-auto flex flex-col gap-1.5">
        <div
          class="hearts flex gap-[3px] sm:gap-1"
          role="meter"
          aria-label={t.health.value}
          aria-valuemin={0}
          aria-valuemax={HEARTS * 4}
          aria-valuenow={quarters}
        >
          {#each Array(HEARTS) as _, i (i)}
            {@const q = Math.max(0, Math.min(4, quarters - i * 4))}
            <span class={q > 0 && q < 4 ? "hop" : ""}>
              <PixelSprite sprite={heart(q)} scale={3} class="hidden sm:block" />
              <PixelSprite sprite={heart(q)} scale={2} class="sm:hidden" />
            </span>
          {/each}
        </div>
      </div>

      <!-- right: B / A / R buttons -->
      <div class="pointer-events-auto flex items-center gap-4 pt-1">
        <button
          type="button"
          class="hud-btn"
          aria-pressed={!sfx.muted}
          aria-label={sfx.muted ? t.soundOff.value : t.soundOn.value}
          aria-keyshortcuts="B"
          onclick={() => sfx.toggle()}
        >
          <span class="hud-key">B</span>
          <span class="flex items-center gap-1.5">
            <!-- blinks while the browser still holds the audio back; any click or key starts it -->
            <svg
              viewBox="0 0 8 8"
              class="h-4 w-4 {sfx.locked && !sfx.muted ? 'blink' : ''}"
              shape-rendering="crispEdges"
              aria-hidden="true"
            >
              <path fill="currentColor" d="M0 3h2v2H0zM2 2h1v4H2zM3 1h1v6H3z" />
              {#if sfx.muted}
                <path fill="var(--color-gem-red)" d="M5 2h1v1H5zM7 2h1v1H7zM6 3h1v2H6zM5 5h1v1H5zM7 5h1v1H7z" />
              {:else}
                <path fill="currentColor" d="M5 3h1v2H5zM6 1h1v1H6zM7 2h1v4H7zM6 6h1v1H6z" />
              {/if}
            </svg>
            <span class="hidden sm:inline">{t.sound.value}</span>
          </span>
        </button>

        <button
          type="button"
          class="hud-btn"
          aria-label={t.language.value}
          aria-keyshortcuts="A"
          onclick={() => {
            language.toggle();
            sfx.cursor();
          }}
        >
          <span class="hud-key">A</span>
          <span>
            <span class={language.value === "ptBr" ? "text-gold-hi" : "text-mist/70"}>PT</span><span class="text-mist/50"
              >/</span
            ><span class={language.value === "enUs" ? "text-gold-hi" : "text-mist/70"}>EN</span>
          </span>
        </button>

        <button
          type="button"
          class="hud-btn"
          aria-haspopup="dialog"
          aria-expanded={globalState.menuOpen}
          aria-keyshortcuts="R M"
          onclick={openMenu}
        >
          <span class="hud-key hud-key-r">R</span>
          <span>{t.menu.value}</span>
        </button>
      </div>
    </div>
  </div>
</header>

<PauseMenu />

<style>
  .hud {
    transition: transform 0.24s steps(4, end);
  }
  /* clears the HUD and the key badges that poke above the buttons */
  .hud.tucked {
    transform: translateY(-96px);
  }
  /* hard pixel drop shadow, same as the buttons, so the hearts read on grass and on text */
  .hearts {
    filter: drop-shadow(0 3px 0 rgb(24 16 24 / 0.55)) drop-shadow(2px 0 0 var(--color-ink))
      drop-shadow(-2px 0 0 var(--color-ink));
  }
  @media (prefers-reduced-motion: reduce) {
    .hud {
      transition: none;
    }
  }
  .hud-btn {
    --px: 2px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.25rem;
    padding: 0.35rem 0.55rem 0.35rem 1.1rem;
    cursor: pointer;
    font-family: var(--font-label);
    font-size: 12px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--color-snow);
    background: rgb(16 24 40 / 0.9);
    box-shadow:
      0 -2px 0 0 var(--color-snow),
      0 2px 0 0 var(--color-snow),
      -2px 0 0 0 var(--color-snow),
      2px 0 0 0 var(--color-snow),
      0 -4px 0 0 var(--color-ink),
      0 4px 0 0 var(--color-ink),
      -4px 0 0 0 var(--color-ink),
      4px 0 0 0 var(--color-ink),
      -2px -2px 0 0 var(--color-ink),
      2px -2px 0 0 var(--color-ink),
      -2px 2px 0 0 var(--color-ink),
      2px 2px 0 0 var(--color-ink),
      0 7px 0 0 rgb(24 16 24 / 0.35);
  }
  @media (min-width: 640px) {
    .hud-btn {
      padding: 0.35rem 0.8rem 0.35rem 1.35rem;
      font-size: 13px;
      letter-spacing: 0.05em;
    }
  }
  .hud-btn:hover {
    color: var(--color-gold-hi);
  }
  .hud-btn:active {
    transform: translateY(2px);
  }
  .hud-key {
    position: absolute;
    top: -0.7rem;
    left: -0.7rem;
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    font-family: var(--font-title);
    font-size: 9px;
    color: var(--color-ink);
    background: var(--color-gold-hi);
    box-shadow:
      0 -2px 0 0 var(--color-ink),
      0 2px 0 0 var(--color-ink),
      -2px 0 0 0 var(--color-ink),
      2px 0 0 0 var(--color-ink);
  }
  .hud-key-r {
    background: var(--color-gem-blue);
  }
</style>

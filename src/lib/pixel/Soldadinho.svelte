<script lang="ts">
  /*
    The soldadinho as a little hoverable critter: point at him and he chirps,
    beak flapping open-shut-open in time with the two whistles. He casts a small
    shadow that stays on the ground and shrinks while he is up in a hop.
    In the rain he stops hopping and shivers, fluffed up and dripping; in a gale he crouches
    and faces into it (both are frame strips in ./png).
  */
  import PixelSprite from "./PixelSprite.svelte";
  import { birdShadow, recolor, soldadinho, soldadinhoChirp, soldadinhoCold, soldadinhoWind } from "./sprites.js";
  import globalState from "$lib/utils/global.svelte";
  import sfx from "$lib/utils/sfx.svelte";

  let {
    scale = 3,
    fps = 0.7,
    hop = true,
    shade = "#18481898",
    class: css = "",
  }: {
    scale?: number;
    fps?: number;
    hop?: boolean;
    /** shadow colour, so it reads as grass, wood or night under him */
    shade?: string;
    class?: string;
  } = $props();

  let shadow = $derived(recolor(birdShadow, { k: shade }));
  let weather = $derived(globalState.weather);
  let hopping = $derived(hop && weather === "clear");

  let open = $state(false);
  let pose = $derived(weather === "rain" ? soldadinhoCold : weather === "wind" ? soldadinhoWind : open ? soldadinhoChirp : soldadinho);
  // the gale frames face a wind from the right; mirrored, he faces one from the left
  let flip = $derived(weather === "wind" && globalState.windDir > 0);
  let timers: ReturnType<typeof setTimeout>[] = [];

  function chirp() {
    if (timers.length) return; // let the current chirp finish
    sfx.chirp();
    // open, shut, open, shut: lines up with the two whistles
    const beats: [number, boolean][] = [[0, true], [90, false], [120, true], [210, false]];
    timers = beats.map(([at, o], i) =>
      setTimeout(() => {
        open = o;
        if (i === beats.length - 1) timers = [];
      }, at),
    );
  }

  $effect(() => () => timers.forEach(clearTimeout));
</script>

<span class="pointer-events-auto inline-flex flex-col items-center {css}" onpointerenter={chirp} role="presentation">
  <span class="relative z-[1] {hopping ? 'hop' : ''}" style:transform={flip ? "scaleX(-1)" : undefined}>
    <PixelSprite sprite={pose} {scale} fps={weather === "clear" ? fps : 7} />
  </span>
  <!-- tucked one art pixel up, so the feet stand on its top edge -->
  <span class={hopping ? "shadow-hop" : ""} style="margin-top: {-scale}px;">
    <PixelSprite sprite={shadow} {scale} />
  </span>
</span>

<style>
  /* same 1.2s beat as the hop: the shadow tightens and fades while he is in the air */
  .shadow-hop {
    animation: shadow-hop 1.2s linear infinite;
  }
  @keyframes shadow-hop {
    0%,
    70% {
      scale: 1;
      opacity: 1;
    }
    75% {
      scale: 0.8 1;
      opacity: 0.8;
    }
    85% {
      scale: 0.65 1;
      opacity: 0.6;
    }
    95% {
      scale: 0.9 1;
      opacity: 0.9;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .shadow-hop {
      animation: none;
    }
  }
</style>

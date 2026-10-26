<script lang="ts">
  /*
    The soldadinho as a little hoverable critter: point at him and he chirps,
    beak flapping open-shut-open in time with the two whistles.
  */
  import PixelSprite from "./PixelSprite.svelte";
  import { soldadinho, soldadinhoChirp } from "./sprites.js";
  import sfx from "$lib/utils/sfx.svelte";

  let { scale = 3, fps = 0.7, class: css = "" }: { scale?: number; fps?: number; class?: string } = $props();

  let open = $state(false);
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

<span class="inline-flex pointer-events-auto {css}" onpointerenter={chirp} role="presentation">
  <PixelSprite sprite={open ? soldadinhoChirp : soldadinho} {scale} {fps} />
</span>

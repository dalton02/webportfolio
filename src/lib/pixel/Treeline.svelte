<script lang="ts">
  /*
    The edge of the field: a row of trees at the back, bushes in front, and the ground
    fading into the footer's night colour, so the page ends in a wood instead of a hard line.
    Drawn once per width at the background's pixel size (Background.svelte PX).
  */
  import { hash } from "./world.js";

  const PX = 3;
  const H = 54; // art rows
  const BACK_BASE = 38;
  const FRONT_BASE = 44;
  const FADE = 6; // rows the bushes take to dissolve into the night
  const C = {
    ink: "#181018",
    backLit: "#58a840",
    back: "#307830",
    backDark: "#286830",
    front: "#184818",
    frontLit: "#307830",
    night: "#101828",
  };

  let box = $state<HTMLDivElement>();
  let canvas = $state<HTMLCanvasElement>();

  /** Round crowns along the row; for each column, the highest crown edge and which side of its crown it is on. */
  function crowns(w: number, base: number, gap: [number, number], radius: [number, number], lift: number, seed: number) {
    const top = new Float32Array(w).fill(Infinity);
    const left = new Uint8Array(w);
    for (let cx = -12, i = 0; cx < w + 12; i++) {
      const r = radius[0] + hash(i, seed) * (radius[1] - radius[0]);
      // now and then a crown sits higher, so the skyline isn't one even hedge
      const cy = base - (hash(i + 3, seed + 1) > 0.6 ? hash(i, seed + 2) * lift : 0);
      for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(w, Math.ceil(cx + r)); x++) {
        const dx = x + 0.5 - cx;
        const y = cy - Math.sqrt(Math.max(0, r * r - dx * dx));
        if (y < top[x]) {
          top[x] = y;
          left[x] = dx < 0 ? 1 : 0;
        }
      }
      cx += gap[0] + hash(seed, i) * (gap[1] - gap[0]);
    }
    return { top, left };
  }

  function draw(el: HTMLCanvasElement, width: number) {
    const w = Math.ceil(width / PX);
    if (!w) return;
    el.width = w;
    el.height = H;
    // whole art pixels on screen; the wrapper crops the spare column
    el.style.width = `${w * PX}px`;
    const g = el.getContext("2d")!;
    g.clearRect(0, 0, w, H);
    const back = crowns(w, BACK_BASE, [8, 15], [7, 13], 12, 41);
    const front = crowns(w, FRONT_BASE, [6, 11], [4, 9], 3, 97);
    // 4x4 ordered dither, for the fade from the bushes into the night
    const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    const dot = (x: number, y: number, c: string) => {
      g.fillStyle = c;
      g.fillRect(x, y, 1, 1);
    };
    for (let x = 0; x < w; x++) {
      const tb = Math.ceil(back.top[x]);
      const tf = Math.ceil(front.top[x]);
      for (let y = Math.max(0, tb - 1); y < H; y++) {
        // ground: under the bushes the green thins out, dot by dot, into the night
        if (y > FRONT_BASE) {
          const t = (y - FRONT_BASE) / (FADE + 1);
          dot(x, y, BAYER[(y % 4) * 4 + (x % 4)] / 16 < t ? C.night : C.front);
          continue;
        }
        if (y >= tf - 1) {
          if (y === tf - 1) dot(x, y, C.ink);
          else if (y === tf && front.left[x]) dot(x, y, C.frontLit);
          else dot(x, y, C.front);
          continue;
        }
        if (y === tb - 1) dot(x, y, C.ink);
        else if (y === tb && back.left[x]) dot(x, y, C.backLit);
        else {
          // leafy speckles, same idea as the foliage props: a dark pixel with a lit one above it
          const r = hash(x + 7, y + 13);
          dot(x, y, r < 0.08 ? C.backDark : hash(x + 7, y + 14) < 0.08 ? C.backLit : C.back);
        }
      }
    }
  }

  $effect(() => {
    if (!canvas || !box) return;
    const el = canvas;
    const wrap = box;
    let last = 0;
    const ro = new ResizeObserver(() => {
      if (wrap.clientWidth === last) return;
      last = wrap.clientWidth;
      draw(el, last);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  });
</script>

<div bind:this={box} class="pointer-events-none w-full overflow-hidden" aria-hidden="true">
  <canvas bind:this={canvas} class="block" style="height: {H * PX}px; image-rendering: pixelated;"></canvas>
</div>

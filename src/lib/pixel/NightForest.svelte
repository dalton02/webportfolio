<script lang="ts">
  /*
    The wood the page walks into at the end: a moonlit clearing at night. Three rows of
    trees (far, mid, near) close in from the sides and leave the middle open for the
    footer text. Same pixel size and tricks as Treeline.svelte, drawn once per size.
  */
  import { hash } from "./world.js";

  const PX = 3;
  const C = {
    night: "#101828",
    glow: "#152038",
    star: "#c8d0e0",
    starDim: "#58607a",
    moon: "#f8f0d0",
    moonLit: "#fffff0",
    crater: "#d8d0b0",
    halo: "#1a2640",
    ground: "#08120c",
  };
  // far to near: each row darker and bigger, with a moonlit rim on the side facing the moon
  const LAYERS = [
    { body: "#1a2c3c", lit: "#2c4a5c", speck: 0, seed: 11 },
    { body: "#122a20", lit: "#24543a", speck: 0.05, seed: 37 },
    { body: "#0a1610", lit: "#1c3424", speck: 0.04, seed: 73 },
  ];
  // 4x4 ordered dither, for the moon halo and the glow behind the text
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  let box = $state<HTMLDivElement>();
  let canvas = $state<HTMLCanvasElement>();

  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const smooth = (a: number, b: number, v: number) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  function draw(el: HTMLCanvasElement, width: number, height: number) {
    const w = Math.ceil(width / PX);
    const h = Math.ceil(height / PX);
    if (!w || !h) return;
    el.width = w;
    el.height = h;
    el.style.width = `${w * PX}px`;
    el.style.height = `${h * PX}px`;

    const ground = h - 4;
    const mid = w / 2;
    // the clearing: no near trees inside this half-width, mid trees thin out toward it
    const clearNear = 100;
    const clearMid = Math.min(70, mid * 0.75);

    // which layer covers each pixel (-1 = sky); later layers paint over earlier ones
    const layer = new Int8Array(w * h).fill(-1);
    const fill = (x: number, y: number, l: number) => {
      if (x >= 0 && x < w && y >= 0 && y < h) layer[y * w + x] = l;
    };
    const disc = (cx: number, cy: number, r: number, l: number) => {
      for (let y = Math.floor(cy - r); y <= cy + r; y++)
        for (let x = Math.floor(cx - r); x <= cx + r; x++)
          if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) fill(x, y, l);
    };

    /** A row of trees: trunk down to the ground, a canopy of three overlapping discs on top. */
    function row(l: number, gap: [number, number], radius: [number, number], rise: [number, number], clear: number) {
      const seed = LAYERS[l].seed;
      for (let cx = -20, i = 0; cx < w + 20; i++) {
        const d = Math.abs(cx - mid);
        // 0 at the edge of the clearing, 1 at the side of the screen
        const s = clear > 0 ? smooth(clear, Math.max(clear + 1, mid), d) : 0.5 + 0.5 * smooth(0, mid, d);
        if (d >= clear && (clear === 0 || hash(i, seed + 5) < 0.3 + s)) {
          const r = (radius[0] + hash(i, seed) * (radius[1] - radius[0])) * (0.6 + 0.4 * s);
          const top = ground - (rise[0] + hash(i + 3, seed + 1) * (rise[1] - rise[0])) * (0.45 + 0.55 * s);
          const cy = top + r;
          // the far row is a low wall of crowns with no trunks; nearer rows get thick trunks that flare at the root
          const trunk = l === 0 ? r * 1.6 : Math.max(3, Math.round(r / 2.4));
          for (let y = Math.floor(cy); y < ground + 1; y++) {
            const flare = l === 0 ? 0 : Math.max(0, 3 - (ground - y));
            for (let x = Math.round(cx - trunk / 2 - flare); x < Math.round(cx + trunk / 2 + flare); x++) fill(x, y, l);
          }
          disc(cx, cy, r, l);
          disc(cx - r * 0.6, cy + r * 0.35, r * 0.7, l);
          disc(cx + r * 0.6, cy + r * 0.35, r * 0.7, l);
          // a heavier lower edge, so the canopy reads as a crown and not a ball on a stick
          disc(cx - r * 0.95, cy + r * 0.65, r * 0.5, l);
          disc(cx + r * 0.95, cy + r * 0.65, r * 0.5, l);
          disc(cx, cy + r * 0.75, r * 0.6, l);
        }
        cx += gap[0] + hash(seed, i) * (gap[1] - gap[0]);
      }
    }
    row(0, [7, 12], [6, 10], [16, 32], 0);
    row(1, [10, 17], [10, 15], [44, 78], clearMid);
    row(2, [14, 22], [15, 24], [h * 0.55, h * 0.95], w * PX < 768 ? Infinity : clearNear);

    // the moon sits up in a corner, half hidden behind the trees on that side
    const moonX = w - Math.max(22, w * 0.16);
    const moonY = 18;
    const moonR = 8;

    const img = g(el).createImageData(w, h);
    const px = (x: number, y: number, hex: string) => {
      const [r, gr, b] = rgb(hex);
      const i = (y * w + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = gr;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    };
    const at = (x: number, y: number) => (x < 0 || x >= w || y < 0 || y >= h ? -1 : layer[y * w + x]);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const l = layer[y * w + x];
        const dither = BAYER[(y % 4) * 4 + (x % 4)] / 16;

        if (y > ground) {
          px(x, y, C.ground);
          continue;
        }
        if (y === ground || (y >= ground - 2 && hash(x, 91) < 0.25 && ground - y <= 1 + Math.floor(hash(x, 92) * 2))) {
          // grass blades poking up from the ground line
          px(x, y, C.ground);
          continue;
        }

        if (l >= 0) {
          const L = LAYERS[l];
          // rim light: the next pixel toward the moon (up and to the side) is open sky or a farther row
          const side = moonX > x ? 1 : -1;
          const rim = at(x + side, y - 1) < l || at(x, y - 1) < l;
          if (rim) px(x, y, L.lit);
          else if (L.speck && hash(x + L.seed, y) < L.speck) px(x, y, L.lit);
          else px(x, y, L.body);
          continue;
        }

        // sky
        const md = Math.hypot(x + 0.5 - moonX, y + 0.5 - moonY);
        if (md <= moonR) {
          const crater =
            Math.hypot(x - (moonX - 3), y - (moonY + 1)) < 2 ||
            Math.hypot(x - (moonX + 2), y - (moonY - 3)) < 1.5 ||
            Math.hypot(x - (moonX + 3), y - (moonY + 3)) < 1.2;
          px(x, y, crater ? C.crater : md > moonR - 1.2 && x < moonX && y < moonY ? C.moonLit : C.moon);
          continue;
        }
        if (md < moonR + 7 && dither < 0.55 * (1 - (md - moonR) / 7)) {
          px(x, y, C.halo);
          continue;
        }
        // faint moonlight on the clearing, behind the text
        const gd = Math.hypot((x - mid) / Math.min(mid, 90), (y - h * 0.45) / (h * 0.5));
        if (gd < 1 && dither < 0.3 * (1 - gd)) {
          px(x, y, C.glow);
          continue;
        }
        const st = hash(x * 3 + 1, y * 7 + 2);
        if (y < h * 0.7 && st < 0.003) px(x, y, st < 0.001 ? C.star : C.starDim);
        else px(x, y, C.night);
      }
    }
    g(el).putImageData(img, 0, 0);
  }

  const g = (el: HTMLCanvasElement) => el.getContext("2d")!;

  $effect(() => {
    if (!canvas || !box) return;
    const el = canvas;
    const wrap = box;
    let lw = 0;
    let lh = 0;
    const ro = new ResizeObserver(() => {
      if (wrap.clientWidth === lw && wrap.clientHeight === lh) return;
      lw = wrap.clientWidth;
      lh = wrap.clientHeight;
      draw(el, lw, lh);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  });
</script>

<div bind:this={box} class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  <canvas bind:this={canvas} class="block" style="image-rendering: pixelated;"></canvas>
</div>

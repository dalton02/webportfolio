<script lang="ts">
  /*
    Turns the portrait into a GBA-style character sprite on the client:
    1. crop to head and shoulders and shrink in halving steps (clean averaging),
    2. cut the figure out: flood-fill the light blue/green backdrop from the edges
       and keep only the largest remaining blob,
    3. pick a small palette from the figure alone (k-means), snap it to 15-bit,
       and map pixels to it with no dithering, so faces read as flat shapes,
    4. paint a 1px dark outline around the figure over a banded game sky.
  */
  let {
    src,
    alt,
    width = 72,
    aspect = 4 / 5,
    crop = { x: 0.1, y: 0.075, w: 0.8 },
    colors = 14,
    class: css = "",
  }: {
    src: string;
    alt: string;
    width?: number;
    aspect?: number;
    /** crop box in fractions of the source image; height follows from `aspect` */
    crop?: { x: number; y: number; w: number };
    colors?: number;
    class?: string;
  } = $props();

  let canvas = $state<HTMLCanvasElement>();
  let ready = $state(false);

  type RGB = [number, number, number];
  const dist = (a: RGB, b: RGB) => 2 * (a[0] - b[0]) ** 2 + 4 * (a[1] - b[1]) ** 2 + 3 * (a[2] - b[2]) ** 2;
  const snap = (v: number) => Math.max(0, Math.min(248, Math.round(v / 8) * 8));

  const OUTLINE: RGB = [24, 16, 24];
  // Minish Cap style sky, top to bottom, in flat bands
  const SKY: RGB[] = [
    [112, 176, 240],
    [136, 192, 248],
    [168, 216, 248],
    [200, 232, 248],
  ];

  /** The illustration's backdrop is light and cool (blue, mint, white panels); skin, hair and the shirt are warm or dark. */
  function isBackdrop([r, g, b]: RGB) {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum > 150 && (b >= r - 4 || g - r > 6);
  }

  /** Livelier colours, closer to the saturated GBA look. */
  function punch([r, g, b]: RGB): RGB {
    const avg = (r + g + b) / 3;
    const s = 1.25;
    const c = (v: number) => Math.max(0, Math.min(255, (avg + (v - avg) * s - 128) * 1.08 + 128));
    return [c(r), c(g), c(b)];
  }

  function palette(pixels: RGB[], k: number): RGB[] {
    // seed along brightness so dark hair, mid skin and the light shirt all get slots
    const sorted = [...pixels].sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
    let centres: RGB[] = Array.from({ length: k }, (_, i) => sorted[Math.floor(((i + 0.5) / k) * sorted.length)]);
    for (let iter = 0; iter < 10; iter++) {
      const sums = centres.map(() => [0, 0, 0, 0]);
      for (const p of pixels) {
        let best = 0;
        let bd = Infinity;
        centres.forEach((c, i) => {
          const d = dist(p, c);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        const s = sums[best];
        s[0] += p[0];
        s[1] += p[1];
        s[2] += p[2];
        s[3]++;
      }
      centres = centres.map((c, i) => {
        const s = sums[i];
        return s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : c;
      });
    }
    return centres.map(([r, g, b]) => [snap(r), snap(g), snap(b)]);
  }

  /** Halve the image until it is close to the target, then do the last step: much cleaner than one big jump. */
  function shrink(img: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, w: number, h: number) {
    let cur: CanvasImageSource = img;
    let cw = sw;
    let ch = sh;
    let ox = sx;
    let oy = sy;
    while (cw / 2 > w * 1.5) {
      const c = document.createElement("canvas");
      c.width = Math.round(cw / 2);
      c.height = Math.round(ch / 2);
      const g = c.getContext("2d")!;
      g.imageSmoothingQuality = "high";
      g.drawImage(cur, ox, oy, cw, ch, 0, 0, c.width, c.height);
      cur = c;
      cw = c.width;
      ch = c.height;
      ox = 0;
      oy = 0;
    }
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const g = out.getContext("2d", { willReadFrequently: true })!;
    g.imageSmoothingQuality = "high";
    g.drawImage(cur, ox, oy, cw, ch, 0, 0, w, h);
    return g.getImageData(0, 0, w, h);
  }

  function render(img: HTMLImageElement, el: HTMLCanvasElement) {
    const w = width;
    const h = Math.round(w / aspect);
    const sw = img.naturalWidth * crop.w;
    const sh = sw / aspect;
    const data = shrink(img, img.naturalWidth * crop.x, img.naturalHeight * crop.y, sw, sh, w, h);

    const px: RGB[] = [];
    for (let i = 0; i < data.data.length; i += 4) px.push([data.data[i], data.data[i + 1], data.data[i + 2]]);
    const at = (x: number, y: number) => y * w + x;

    // 1. backdrop: flood fill from the borders through backdrop-coloured pixels
    const bg = new Uint8Array(w * h);
    const stack: number[] = [];
    for (let x = 0; x < w; x++) stack.push(at(x, 0), at(x, h - 1));
    for (let y = 0; y < h; y++) stack.push(at(0, y), at(w - 1, y));
    while (stack.length) {
      const i = stack.pop()!;
      if (bg[i] || !isBackdrop(px[i])) continue;
      bg[i] = 1;
      const x = i % w;
      const y = (i / w) | 0;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - w);
      if (y < h - 1) stack.push(i + w);
    }

    // 2. morphological opening (erode, then dilate) drops 1–2px lines such as the
    //    backdrop monitor touching the shoulder, then keep only the biggest blob (the person)
    const near = (m: Uint8Array, i: number, all: boolean) => {
      const x = i % w;
      const y = (i / w) | 0;
      const n = [x > 0 ? m[i - 1] : 0, x < w - 1 ? m[i + 1] : 0, y > 0 ? m[i - w] : 0, y < h - 1 ? m[i + w] : 0];
      return all ? n.every(Boolean) : n.some(Boolean);
    };
    const solid = new Uint8Array(w * h).map((_, i) => (bg[i] ? 0 : 1));
    const eroded = solid.map((v, i) => (v && near(solid, i, true) ? 1 : 0));
    const opened = eroded.map((v, i) => (v || near(eroded, i, false) ? 1 : 0));
    for (let i = 0; i < w * h; i++) bg[i] = opened[i] ? 0 : 1;

    const label = new Int32Array(w * h).fill(-1);
    let biggest = -1;
    let biggestSize = 0;
    let id = 0;
    for (let s = 0; s < w * h; s++) {
      if (bg[s] || label[s] >= 0) continue;
      let size = 0;
      const q = [s];
      label[s] = id;
      while (q.length) {
        const i = q.pop()!;
        size++;
        const x = i % w;
        const y = (i / w) | 0;
        for (const n of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
          if (n >= 0 && !bg[n] && label[n] < 0) {
            label[n] = id;
            q.push(n);
          }
        }
      }
      if (size > biggestSize) {
        biggestSize = size;
        biggest = id;
      }
      id++;
    }
    const fig = (i: number) => label[i] === biggest;

    // 3. palette from the figure only, no dithering
    const figPx = px.map(punch).filter((_, i) => fig(i));
    const pal = palette(figPx, colors);
    const nearest = (p: RGB) => {
      let best = pal[0];
      let bd = Infinity;
      for (const c of pal) {
        const d = dist(p, c);
        if (d < bd) {
          bd = d;
          best = c;
        }
      }
      return best;
    };

    // 4. compose: sky bands, outline, figure
    const band = Math.ceil(h / 2 / SKY.length);
    for (let i = 0; i < w * h; i++) {
      const x = i % w;
      const y = (i / w) | 0;
      let c: RGB;
      if (fig(i)) {
        c = nearest(punch(px[i]));
      } else {
        const touches =
          (x > 0 && fig(i - 1)) || (x < w - 1 && fig(i + 1)) || (y > 0 && fig(i - w)) || (y < h - 1 && fig(i + w));
        c = touches ? OUTLINE : SKY[Math.min(SKY.length - 1, Math.floor(y / band))];
      }
      data.data[i * 4] = c[0];
      data.data[i * 4 + 1] = c[1];
      data.data[i * 4 + 2] = c[2];
      data.data[i * 4 + 3] = 255;
    }

    el.width = w;
    el.height = h;
    el.getContext("2d")!.putImageData(data, 0, 0);
  }

  $effect(() => {
    if (!canvas) return;
    const el = canvas;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    let cancelled = false;
    img.onload = () => {
      if (cancelled) return;
      render(img, el);
      ready = true;
    };
    return () => {
      cancelled = true;
    };
  });
</script>

<div role="img" aria-label={alt} class="h-full w-full {css}">
  <canvas
    bind:this={canvas}
    class="block h-full w-full {ready ? '' : 'opacity-0'}"
    style="image-rendering: pixelated;"
    aria-hidden="true"
  ></canvas>
</div>

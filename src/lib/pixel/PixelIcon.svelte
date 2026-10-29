<script lang="ts">
  import { watch } from "$lib/utils/visible.svelte";

  /*
    Light pixel pass over a vector logo so it sits with the rest of the art:
    1. rasterise the SVG small (one art pixel = `scale` screen pixels),
    2. hard alpha (no soft edges), a bit more saturation and contrast, colours snapped to 15-bit,
    3. a 1px dark outline around the outside of the shape, so pale logos still read on the parchment slot.
    If the image can't be read back, the plain rasterised version is kept.
  */
  let {
    src,
    size = 24,
    scale = 2,
    class: css = "",
  }: {
    src: string;
    /** art size in pixels, outline included */
    size?: number;
    /** whole-number scale, so every art pixel is the same size on screen */
    scale?: number;
    class?: string;
  } = $props();

  let canvas = $state<HTMLCanvasElement>();
  let ready = $state(false);

  const OUTLINE = [72, 40, 16]; // --color-bark
  const snap = (v: number) => Math.max(0, Math.min(248, Math.round(v / 8) * 8));

  function punch(r: number, g: number, b: number) {
    const avg = (r + g + b) / 3;
    const c = (v: number) => ((avg + (v - avg) * 1.2 - 128) * 1.12 + 128);
    return [snap(c(r)), snap(c(g)), snap(c(b))];
  }

  function render(img: HTMLImageElement, el: HTMLCanvasElement) {
    const n = size;
    el.width = n;
    el.height = n;
    const g = el.getContext("2d", { willReadFrequently: true })!;
    g.imageSmoothingQuality = "high";

    // fit inside the canvas, leaving 1px for the outline
    const box = n - 2;
    const ratio = img.naturalWidth / img.naturalHeight || 1;
    const w = ratio >= 1 ? box : Math.round(box * ratio);
    const h = ratio >= 1 ? Math.round(box / ratio) : box;
    g.drawImage(img, 1 + Math.floor((box - w) / 2), 1 + Math.floor((box - h) / 2), w, h);

    let data: ImageData;
    try {
      data = g.getImageData(0, 0, n, n);
    } catch {
      return;
    }
    const d = data.data;
    const solid = new Uint8Array(n * n);
    for (let i = 0; i < n * n; i++) {
      const a = d[i * 4 + 3];
      if (a < 96) continue;
      solid[i] = 1;
      // undo premultiplied fade on the edges before boosting
      const k = 255 / a;
      const [r, gg, b] = punch(d[i * 4] * Math.min(k, 1.6), d[i * 4 + 1] * Math.min(k, 1.6), d[i * 4 + 2] * Math.min(k, 1.6));
      d[i * 4] = r;
      d[i * 4 + 1] = gg;
      d[i * 4 + 2] = b;
    }
    // only the outside gets an outline: flood the empty area from the borders, so
    // holes and gaps inside a logo (letters, lattices) stay open
    const outside = new Uint8Array(n * n);
    const stack: number[] = [];
    for (let k = 0; k < n; k++) stack.push(k, n * (n - 1) + k, k * n, k * n + n - 1);
    while (stack.length) {
      const i = stack.pop()!;
      if (outside[i] || solid[i]) continue;
      outside[i] = 1;
      const x = i % n;
      const y = (i / n) | 0;
      if (x > 0) stack.push(i - 1);
      if (x < n - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - n);
      if (y < n - 1) stack.push(i + n);
    }
    for (let i = 0; i < n * n; i++) {
      if (solid[i]) {
        d[i * 4 + 3] = 255;
        continue;
      }
      const x = i % n;
      const y = (i / n) | 0;
      const edge = (x > 0 && solid[i - 1]) || (x < n - 1 && solid[i + 1]) || (y > 0 && solid[i - n]) || (y < n - 1 && solid[i + n]);
      d[i * 4] = OUTLINE[0];
      d[i * 4 + 1] = OUTLINE[1];
      d[i * 4 + 2] = OUTLINE[2];
      d[i * 4 + 3] = edge && outside[i] ? 255 : 0;
    }
    g.putImageData(data, 0, 0);
  }

  // fetch the logo only once its slot comes near the screen
  let near = $state(false);
  $effect(() => {
    if (!canvas || near) return;
    return watch(canvas, (on) => (near ||= on));
  });

  $effect(() => {
    if (!canvas || !near) return;
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

<canvas
  bind:this={canvas}
  class="block {ready ? '' : 'opacity-0'} {css}"
  style="width: {size * scale}px; height: {size * scale}px; image-rendering: pixelated;"
  aria-hidden="true"
></canvas>

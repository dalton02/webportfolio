<script lang="ts">
  import { onMount } from "svelte";
  import globalState from "$lib/utils/global.svelte";
  import { BIRD, butterfly, CATTAILS, fence, hash, POND_ART, TREE_ART, WPAL, ZONES, type Art, type Zone } from "$lib/pixel/world.js";

  /*
    The overworld floor, drawn on a low-res canvas and scaled up with crisp pixels.
    Every room gets its own terrain (meadow, tall grass, dry road, wood, pond side),
    blended into the next one with a dither. Big props only grow in the side
    margins so they never sit behind text. The Experience road is painted here
    too, through anchors the section leaves in the DOM ([data-trail]).

    The static ground is rendered once per 256px chunk and cached; only flowers,
    tufts, water, butterflies, birds and cloud shadows are redrawn each frame.
    Toward the footer the light turns gold, so the day sets before the night wood.
    When it rains (globalState.weather) the cloud shadows grow heavy and the butterflies and
    birds take cover; in a gale the clouds race and the butterflies hide too.
  */

  const PX = 3; // screen pixels per art pixel
  const TILE = 16;
  const FPS = 6;
  const CH = 256; // chunk height in art pixels
  const CELL = 48; // margin prop grid
  const BLEND = 6; // half height of the dither between two rooms
  const WAVE = 18; // how far a room boundary wanders up and down
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const ROAD = 6; // road radius
  const COLUMN = 1152; // max-w-6xl, the content column
  const TREELINE = 54; // Treeline.svelte H: art rows the footer's wood rises above it
  const DUSK = 150; // art rows of golden light before the treeline
  const FENCE_ROW = CELL * 3;

  type Item = { frames: HTMLCanvasElement[]; x: number; y: number; phase: number };
  type Chunk = { canvas: HTMLCanvasElement; anim: Item[]; bugs: Item[] };
  type Prop = { a: Art; x: number; y: number; phase: number; rank: number };
  type Sample = { x: number; y: number; r: number };

  function render(rows: string[]) {
    const c = document.createElement("canvas");
    c.width = rows[0].length;
    c.height = rows.length;
    const g = c.getContext("2d")!;
    rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch === "." || !WPAL[ch]) return;
        g.fillStyle = WPAL[ch];
        g.fillRect(x, y, 1, 1);
      }),
    );
    return c;
  }

  const rendered = new Map<Art, HTMLCanvasElement[]>();
  const butterflies = new Map<string, Art>();
  const butterflyArt = (c: string) => butterflies.get(c) ?? (butterflies.set(c, butterfly(c)), butterflies.get(c)!);
  const framesOf = (a: Art) => rendered.get(a) ?? (rendered.set(a, a.frames.map(render)), rendered.get(a)!);

  function pick<T>(list: [T, number][], r: number) {
    let n = r * list.reduce((s, [, w]) => s + w, 0);
    return (list.find(([, w]) => (n -= w) < 0) ?? list[0])[0];
  }

  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

  /** Smooth value noise in [0, 1). */
  function noise(x: number, y: number, s: number, seed: number) {
    const gx = Math.floor(x / s);
    const gy = Math.floor(y / s);
    const fx = x / s - gx;
    const fy = y / s - gy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = hash(gx + seed, gy);
    const b = hash(gx + 1 + seed, gy);
    const c = hash(gx + seed, gy + 1);
    const d = hash(gx + 1 + seed, gy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  let canvas = $state<HTMLCanvasElement>();
  let restart = () => {};

  $effect(() => {
    void globalState.gameOpen;
    void globalState.menuOpen;
    restart();
  });

  onMount(() => {
    const el = canvas!;
    const ctx = el.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    // cloud shadows: a few blobs made of overlapping circles, in art pixels
    const clouds = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * 600,
      y: i * 150 + Math.random() * 60,
      speed: 2 + Math.random() * 2,
      blobs: Array.from({ length: 5 }, () => ({
        dx: Math.random() * 70,
        dy: Math.random() * 22,
        r: 16 + Math.random() * 16,
      })),
    }));

    /**
      A cloud's shadow never changes shape, so it is rasterised once per tint and per dither
      parity (the rim's checkerboard follows the screen, not the cloud) and then just blitted.
    */
    const shadows = new Map<string, HTMLCanvasElement>();
    function shadowOf(c: (typeof clouds)[number], rain: boolean, parity: number) {
      const key = `${clouds.indexOf(c)}${+rain}${parity}`;
      let s = shadows.get(key);
      if (s) return s;
      s = document.createElement("canvas");
      s.width = 141;
      s.height = 124;
      const g = s.getContext("2d")!;
      g.fillStyle = rain ? "rgba(16, 40, 56, 0.3)" : "rgba(24, 72, 24, 0.16)";
      for (let y = 0; y < 124; y++) {
        for (let x = 0; x < 141; x++) {
          for (const b of c.blobs) {
            const d = (x - 34 - b.dx) ** 2 + (y - 34 - b.dy) ** 2;
            if (d <= b.r * b.r || (d <= (b.r + 1.5) ** 2 && ((x + y + parity) & 1) === 0)) {
              g.fillRect(x, y, 1, 1);
              break;
            }
          }
        }
      }
      shadows.set(key, s);
      return s;
    }

    let w = 0;
    let h = 0;
    let frame = 0;
    let t = 0;

    // page layout, in art pixels of the world
    let rooms: { top: number; zone: Zone; colors: number[][] }[] = [];
    let colL = 0;
    let colR = 0;
    let road: Sample[] = [];
    let stopY = Infinity; // where the footer's treeline starts, in world art pixels
    let dusk: HTMLCanvasElement | undefined;
    let signature = "";
    const chunks = new Map<number, Chunk>();

    function measure() {
      const sy = window.scrollY;
      const found = [...document.querySelectorAll<HTMLElement>("section[id]")]
        .filter((s) => ZONES[s.id])
        .map((s) => ({ id: s.id, top: Math.round((s.getBoundingClientRect().top + sy) / PX) }));
      if (!found.length) found.push({ id: "home", top: 0 });
      found[0].top = -Infinity;

      const cw = document.documentElement.clientWidth;
      const half = Math.min(cw, COLUMN) / 2;
      const nextL = Math.floor((cw / 2 - half) / PX) - 4;
      const nextR = Math.ceil((cw / 2 + half) / PX) + 4;

      const anchors = [...document.querySelectorAll<HTMLElement>("[data-trail]")]
        .filter((a) => a.getClientRects().length)
        .sort((a, b) => Number(a.dataset.trail) - Number(b.dataset.trail));
      const pts = anchors.map((a) => {
        const r = a.getBoundingClientRect();
        return { x: Math.round(r.left / PX), y: Math.round((r.top + sy) / PX) };
      });
      const fromEdge = anchors[0]?.dataset.trailEdge !== undefined;
      if (fromEdge && pts.length) pts.unshift({ x: -ROAD * 4, y: pts[0].y });

      const foot = document.querySelector("footer");
      const nextStop = foot ? Math.round((foot.getBoundingClientRect().top + sy) / PX) - TREELINE : Infinity;

      const sig = JSON.stringify([w, found, nextL, nextR, pts, nextStop]);
      if (sig === signature) return;
      signature = sig;
      rooms = found.map((f) => {
        const zone = ZONES[f.id];
        return { top: f.top, zone, colors: [zone.base, zone.light, zone.dark, zone.patch].map(rgb) };
      });
      colL = nextL;
      colR = nextR;
      stopY = nextStop;
      road = buildRoad(pts, !fromEdge);
      dusk = buildDusk();
      chunks.clear();
      draw();
    }

    /**
      Catmull-Rom style curve through the anchors, one sample per art pixel; the end
      rounds off into the grass. Tangents are capped by the shorter neighbouring segment,
      so a long straight stretch can't make the bend before it overshoot into a loop.
    */
    function buildRoad(pts: { x: number; y: number }[], clearing: boolean): Sample[] {
      if (pts.length < 2) return [];
      const len = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(b.x - a.x, b.y - a.y);
      const tangents = pts.map((p, i) => {
        const a = pts[Math.max(0, i - 1)];
        const b = pts[Math.min(pts.length - 1, i + 1)];
        const mx = (b.x - a.x) / 2;
        const my = (b.y - a.y) / 2;
        const cap = Math.min(i > 0 ? len(pts[i - 1], p) : Infinity, i < pts.length - 1 ? len(p, pts[i + 1]) : Infinity);
        const k = Math.min(1, cap / (Math.hypot(mx, my) || 1));
        return { x: mx * k, y: my * k };
      });
      const out: { x: number; y: number }[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const [p1, p2, m1, m2] = [pts[i], pts[i + 1], tangents[i], tangents[i + 1]];
        const n = Math.max(1, Math.ceil(len(p1, p2)));
        for (let k = 0; k < n; k++) {
          const s = k / n;
          const s2 = s * s;
          const s3 = s2 * s;
          // cubic Hermite basis
          const h00 = 2 * s3 - 3 * s2 + 1;
          const h10 = s3 - 2 * s2 + s;
          const h01 = -2 * s3 + 3 * s2;
          const h11 = s3 - s2;
          out.push({
            x: h00 * p1.x + h10 * m1.x + h01 * p2.x + h11 * m2.x,
            y: h00 * p1.y + h10 * m1.y + h01 * p2.y + h11 * m2.y,
          });
        }
      }
      const total = out.length;
      const samples = out.map((p, i) => {
        const left = total - i;
        const wobble = hash(Math.floor(i / 14), 41) > 0.82 ? 1 : 0;
        // a round tip instead of a needle: the radius only drops over the last few pixels
        const r = left < 16 ? ROAD * Math.sqrt(left / 16) : ROAD + wobble;
        return { x: Math.round(p.x), y: Math.round(p.y), r };
      });
      // a little dirt clearing where the road starts, under the room's signpost
      if (clearing) {
        const s = samples[0];
        for (const [dx, dy, r] of [
          [0, 0, 10],
          [-7, 3, 7],
          [7, 2, 8],
          [2, -5, 7],
        ])
          samples.unshift({ x: s.x + dx, y: s.y + dy, r });
      }
      return samples;
    }

    function nearRoad(x: number, y: number, pad: number) {
      for (let i = 0; i < road.length; i += 3) {
        const s = road[i];
        const lim = s.r + pad;
        if (Math.abs(s.x - x) < lim && Math.abs(s.y - y) < lim && (s.x - x) ** 2 + (s.y - y) ** 2 < lim * lim) return true;
      }
      return false;
    }

    /** Where room j starts at column x: a soft wave, so the seam never reads as a ruler line. */
    const edge = (j: number, x: number) =>
      rooms[j].top + Math.round((noise(x, j * 97, 52, 61) * 0.7 + noise(x, j * 97, 13, 83) * 0.3 - 0.5) * 2 * WAVE);

    /** Which room a world pixel belongs to, with an ordered dither across each boundary. */
    function roomAt(x: number, y: number) {
      let i = 0;
      while (i + 1 < rooms.length && rooms[i + 1].top - WAVE - BLEND <= y) i++;
      const t = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
      if (i > 0 && (y - edge(i, x) + BLEND) / (2 * BLEND) < t) return i - 1;
      return i;
    }

    const blade = (x: number, y: number) => hash(x, y) < 0.014;

    function buildChunk(ci: number): Chunk {
      const top = ci * CH;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = CH;
      const g = c.getContext("2d")!;
      const img = g.createImageData(w, CH);
      const data = img.data;

      // road layer: 3 dirt, 2 dirt edge, 1 dark grass edge
      const layer = new Uint8Array(w * CH);
      for (const s of road) {
        const R = Math.ceil(s.r) + 2;
        if (s.r < 0.8 || s.y + R < top || s.y - R >= top + CH) continue;
        for (let dy = -R; dy <= R; dy++) {
          const y = s.y + dy - top;
          if (y < 0 || y >= CH) continue;
          for (let dx = -R; dx <= R; dx++) {
            const x = s.x + dx;
            if (x < 0 || x >= w) continue;
            const d = dx * dx + dy * dy;
            const v = d <= s.r * s.r ? 3 : d <= (s.r + 1) ** 2 ? 2 : d <= (s.r + 2) ** 2 ? 1 : 0;
            const i = y * w + x;
            if (v > layer[i]) layer[i] = v;
          }
        }
      }
      const dirt = [rgb("#e0b070"), rgb("#b07848"), rgb("#f8e0a0")];

      for (let y = 0; y < CH; y++) {
        const wy = top + y;
        for (let x = 0; x < w; x++) {
          const room = rooms[roomAt(x, wy)];
          const [base, light, dark, patch] = room.colors;
          const l = layer[y * w + x];
          let col: number[];
          if (l === 3) {
            const r = hash(x + 911, wy);
            col = r < 0.03 ? dirt[1] : r < 0.05 ? dirt[2] : dirt[0];
          } else if (l === 2) col = dirt[1];
          else if (l === 1) col = dark;
          else {
            // large patches of a second green, with a 1px checker on their edge
            const n = noise(x, wy, 44, 3) * 0.75 + noise(x, wy, 14, 17) * 0.25;
            const inPatch = n > 0.66 || (n > 0.645 && (x + wy) % 2 === 0);
            // grass blades: a dark pixel, a lit one on its left, two pixels tall
            if (blade(x, wy) || blade(x, wy - 1)) col = dark;
            else if (blade(x + 1, wy)) col = light;
            else col = inPatch ? patch : base;
          }
          const i = (y * w + x) * 4;
          data[i] = col[0];
          data[i + 1] = col[1];
          data[i + 2] = col[2];
          data[i + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);

      const anim: Item[] = [];
      const bugs: Item[] = [];
      const place = (a: Art, x: number, y: number, phase: number) => {
        const frames = framesOf(a);
        if (frames.length > 1) {
          // animated things belong to the chunk their top edge falls in
          if (y >= top && y < top + CH) anim.push({ frames, x, y, phase });
        } else g.drawImage(frames[0], x, y - top);
      };
      const inMargin = (x: number, wd: number) => x + wd <= colL || x >= colR;
      const overlaps = (p: Prop, q: Prop) => p.x < q.x + q.a.w && p.x + p.a.w > q.x && p.y < q.y + q.a.h && p.y + p.a.h > q.y;

      // fences first: long runs hugging the content column, one chance per side every few rows
      const fenced: Prop[] = [];
      for (let fy = Math.floor(top / FENCE_ROW) - 1; fy * FENCE_ROW < top + CH; fy++) {
        for (const side of [0, 1]) {
          if (hash(fy + 300, side + 71) > 0.6) continue;
          const y = fy * FENCE_ROW + Math.floor(hash(fy, side + 73) * (FENCE_ROW - 20));
          const room = roomAt(side ? colR : colL, y);
          if (!rooms[room].zone.fences || y + 17 > stopY) continue;
          const gap = 6 + Math.floor(hash(fy + 9, side + 83) * 14);
          const space = side ? w - colR - gap - 2 : colL - gap - 2;
          const n = Math.min(3 + Math.floor(hash(fy + 5, side + 79) * 3), Math.floor((space - 4) / 20));
          if (n < 2) continue;
          const a = fence(n);
          const x = side ? colR + gap : colL - gap - a.w;
          if (roomAt(x, y) !== room || roomAt(x + a.w, y + a.h) !== room) continue;
          let clear = true;
          for (let px = x; px <= x + a.w && clear; px += 8) clear = !nearRoad(px, y + 8, 12);
          if (clear) fenced.push({ a, x, y, phase: 0, rank: 2 });
        }
      }

      /*
        Big props, margins only. Odd rows shift half a cell and each prop wanders a bit past its
        cell, so the wood doesn't line up in columns; a slow noise thins the rate into groves and
        clearings. Whether a prop stands depends only on its neighbours' candidates, never on what
        was drawn before it, so two chunks always agree on a prop that crosses their seam.
      */
      const cands = new Map<string, Prop | null>();
      function candidate(cx: number, cy: number) {
        const key = cx + "," + cy;
        if (cands.has(key)) return cands.get(key)!;
        let p: Prop | null = null;
        const shift = cy & 1 ? CELL / 2 : 0;
        const room = rooms[roomAt(cx * CELL + shift + 24, cy * CELL + 24)].zone;
        const rate = room.bigRate * (0.35 + 1.3 * noise(cx, cy, 4, 211));
        if (hash(cx + 500, cy + 77) < rate) {
          const a = pick(room.big, hash(cx + 13, cy + 501));
          const x = cx * CELL + shift - 6 + Math.floor(hash(cx, cy + 3) * Math.max(1, CELL - a.w + 12));
          const y = cy * CELL + Math.floor(hash(cx + 5, cy) * Math.max(1, CELL - a.h));
          const q = { a, x, y, phase: cx + cy, rank: hash(cx + 31, cy + 907) };
          if (
            inMargin(x, a.w) &&
            y + a.h <= stopY &&
            // a prop sits wholly inside one room, never straddling a seam (a pond half in the wood)
            roomAt(x, y) === roomAt(x + a.w, y + a.h) &&
            !nearRoad(x + a.w / 2, y + a.h / 2, Math.max(a.w, a.h) / 2 + 4) &&
            !fenced.some((f) => overlaps(q, f))
          )
            p = q;
        }
        cands.set(key, p);
        return p;
      }
      const props: Prop[] = [...fenced];
      // cells from two rows above, so tall ones aren't cut at the seam
      for (let cy = Math.floor(top / CELL) - 2; cy * CELL < top + CH; cy++) {
        for (let cx = -1; cx * CELL < w; cx++) {
          const p = candidate(cx, cy);
          if (!p) continue;
          let stands = true;
          // trees may crowd into each other; anything else keeps its own patch of grass
          for (let dy = -1; dy <= 1 && stands; dy++)
            for (let dx = -1; dx <= 1 && stands; dx++) {
              const q = (dx || dy) && candidate(cx + dx, cy + dy);
              if (q && q.rank > p.rank && overlaps(p, q) && !(p.a === TREE_ART && q.a === TREE_ART)) stands = false;
            }
          if (stands) props.push(p);
        }
      }
      // back to front, so a tree lower on the screen covers the one behind it
      props.sort((p, q) => p.y + p.a.h - (q.y + q.a.h));
      for (const p of props) {
        place(p.a, p.x, p.y, p.phase);
        // reeds on the near bank of each pond, swaying in front of the water
        if (p.a === POND_ART && inMargin(p.x + 30, CATTAILS.w)) place(CATTAILS, p.x + 30, p.y + 8, p.phase);
      }
      const taken = props.map((p) => [p.x, p.y, p.x + p.a.w, p.y + p.a.h]);

      // small details on most of the field, sparser inside the content column; clumped where a slow noise runs high
      for (let ty = Math.floor(top / TILE); ty * TILE < top + CH; ty++) {
        for (let tx = 0; tx * TILE < w; tx++) {
          const cxp = tx * TILE + 8;
          const cyp = ty * TILE + 8;
          const room = rooms[roomAt(cxp, cyp)].zone;
          const inside = cxp > colL && cxp < colR;
          const clump = noise(cxp, cyp, 40, 131) > 0.62;
          if (hash(tx, ty) >= room.smallRate * (inside ? 0.6 : 1) * (clump ? 1.8 : 1)) continue;
          if (nearRoad(cxp, cyp, 10)) continue;
          const [x0, y0] = [tx * TILE, ty * TILE];
          if (taken.some(([l, t, r, b]) => x0 < r && x0 + TILE > l && y0 < b && y0 + TILE > t)) continue;
          const a = pick(clump ? room.cluster : room.small, hash(ty + 7, tx + 3));
          place(a, tx * TILE, ty * TILE + TILE - a.h, tx + ty);
        }
      }

      // butterflies hover over the margins of the sunny rooms; they belong to the chunk their cell starts in
      for (let cy = Math.ceil(top / CELL); cy * CELL < top + CH; cy++) {
        for (let cx = 0; cx * CELL < w; cx++) {
          const zone = rooms[roomAt(cx * CELL + 24, cy * CELL + 24)].zone;
          if (!zone.butterflies || hash(cx + 700, cy + 33) >= zone.butterflies[0]) continue;
          const x = cx * CELL + 20;
          const y = cy * CELL + 20;
          // room to flutter 12px either way without crossing into the column
          if (!(x + 20 <= colL || x - 12 >= colR) || y > stopY - 20) continue;
          const colors = zone.butterflies[1];
          bugs.push({ frames: framesOf(butterflyArt(colors[Math.floor(hash(cx, cy + 9) * colors.length)])), x, y, phase: cx * 7 + cy });
        }
      }

      return { canvas: c, anim, bugs };
    }

    /**
      Golden hour: a warm amber light over the last rows before the footer, in four flat levels with an
      ordered dither between them, so it reads as light and not a gradient. It ends at full
      strength under the treeline, where the footer's wood takes over.
    */
    function buildDusk() {
      if (!Number.isFinite(stopY) || !w) return undefined;
      const H = DUSK + TREELINE;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = H;
      const g = c.getContext("2d")!;
      const img = g.createImageData(w, H);
      const alpha = [0, 0.3, 0.55, 0.8];
      for (let y = 0; y < H; y++) {
        const v = Math.min(1, y / DUSK) * 3;
        for (let x = 0; x < w; x++) {
          const level = Math.min(3, Math.floor(v) + ((v % 1) > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 ? 1 : 0));
          const i = (y * w + x) * 4;
          img.data[i] = 248;
          img.data[i + 1] = 168;
          img.data[i + 2] = 120;
          img.data[i + 3] = Math.round(alpha[level] * 255);
        }
      }
      g.putImageData(img, 0, 0);
      return c;
    }

    function chunk(ci: number) {
      let c = chunks.get(ci);
      if (!c) {
        c = buildChunk(ci);
        chunks.set(ci, c);
        // keep memory small: drop chunks far from the camera
        if (chunks.size > 12) for (const k of chunks.keys()) if (Math.abs(k - ci) > 4) chunks.delete(k);
      }
      return c;
    }

    function resize() {
      const nw = Math.ceil(window.innerWidth / PX);
      // one spare row: the canvas slides by the sub-art-pixel remainder of the scroll
      const nh = Math.ceil(window.innerHeight / PX) + 1;
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      el.width = w;
      el.height = h;
      // exact multiple of PX on screen, so every art pixel stays square
      el.style.width = `${w * PX}px`;
      el.style.height = `${h * PX}px`;
      ctx.imageSmoothingEnabled = false;
      // chunks are as wide as the screen, so only a new width rebuilds the ground; a phone's
      // URL bar sliding in and out changes the height alone and just needs a redraw
      measure();
      draw();
    }

    function draw() {
      if (!rooms.length) return;
      const cam = Math.floor(window.scrollY / PX);
      // the night wood's footer is opaque; once it fills the screen there is nothing to see here
      if (cam >= stopY + TREELINE) return;
      // the ground follows the page pixel by pixel instead of jumping PX at a time
      el.style.transform = `translate3d(0, ${-(window.scrollY - cam * PX)}px, 0)`;
      const first = Math.floor(cam / CH);
      const last = Math.floor((cam + h) / CH);
      for (let ci = first; ci <= last; ci++) ctx.drawImage(chunk(ci).canvas, 0, ci * CH - cam);
      for (let ci = first - 1; ci <= last; ci++) {
        for (const it of chunk(ci).anim) {
          if (it.y - cam > h || it.y - cam < -64) continue;
          const n = it.frames.length;
          ctx.drawImage(it.frames[(((frame + it.phase) % n) + n) % n], it.x, it.y - cam);
        }
      }

      const weather = globalState.weather;
      // cloud shadows, translucent dark green, crisp pixels with a dithered rim. They lie on
      // the ground, so they scroll with it, and drift sideways on their own.
      for (const c of clouds) {
        const spanX = w + 280;
        const spanY = h + 200;
        const cx = Math.round((((c.x % spanX) + spanX) % spanX) - 140);
        const cy = Math.round(((((c.y - cam) % spanY) + spanY) % spanY) - 100);
        ctx.drawImage(shadowOf(c, weather === "rain", (cx + cy) & 1), cx - 34, cy - 34);
      }

      for (let ci = first - 1; ci <= last && weather === "clear"; ci++) {
        for (const b of chunk(ci).bugs) {
          // a slow figure-of-eight around its flower patch, flapping every frame
          const bx = b.x + Math.round(Math.sin(t * 0.9 + b.phase) * 12);
          const by = b.y - cam + Math.round(Math.sin(t * 1.8 + b.phase * 2) * 6);
          if (by < -8 || by > h) continue;
          ctx.drawImage(b.frames[(frame + b.phase) & 1], bx, by);
        }
      }

      if (dusk) {
        const dy = stopY - DUSK - cam;
        // multiply: the greens turn warm and a little darker, easing the way into the night below
        if (dy < h && dy + dusk.height > 0) {
          ctx.globalCompositeOperation = "multiply";
          ctx.drawImage(dusk, 0, dy);
          ctx.globalCompositeOperation = "source-over";
        }
      }

      // a small flock crossing the sky now and then; its shadow slides over the field below
      if (flock) {
        const bird = framesOf(BIRD);
        for (const [i, [ox, oy]] of [[0, 0], [-10, -6], [-10, 6]].entries()) {
          const x = Math.round(flock.x + ox * flock.dir);
          const y = flock.y + oy;
          ctx.fillStyle = "rgba(24, 72, 24, 0.28)";
          ctx.fillRect(x + 14, y + 44, 5, 2);
          ctx.drawImage(bird[(frame + i) & 1], x, y);
        }
      }

      prefetch(first - 1);
      prefetch(last + 1);
    }

    /** Build the chunk just past either edge of the screen while the browser is idle, so scrolling never waits on one. */
    const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 50));
    const pending = new Set<number>();
    function prefetch(ci: number) {
      if (ci < 0 || chunks.has(ci) || pending.has(ci)) return;
      pending.add(ci);
      idle(() => {
        pending.delete(ci);
        chunk(ci);
      });
    }

    let flock: { x: number; y: number; dir: number } | undefined;
    let nextFlock = 6;
    function fly() {
      // no birds out in the rain; in a gale they're swept along twice as fast
      if (!flock && t >= nextFlock && globalState.weather !== "rain") {
        const dir = Math.random() < 0.5 ? 1 : -1;
        flock = { x: dir > 0 ? -24 : w + 24, y: Math.round(h * (0.08 + Math.random() * 0.25)), dir };
      }
      if (!flock) return;
      flock.x += (globalState.weather === "wind" ? 6 : 3) * flock.dir;
      if (flock.x < -40 || flock.x > w + 40) {
        flock = undefined;
        nextFlock = t + 25 + Math.random() * 15;
      }
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    function start() {
      stop();
      // the handheld and the pause menu cover the field, so it rests until they close
      if (reduce.matches || document.hidden || globalState.gameOpen || globalState.menuOpen) return;
      timer = setInterval(() => {
        frame++;
        t += 1 / FPS;
        for (const c of clouds) c.x += (c.speed * (globalState.weather === "wind" ? 10 : 1)) / FPS;
        fly();
        draw();
      }, 1000 / FPS);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = undefined;
    }

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        draw();
      });
    };

    // sections grow when fonts, photos and typed dialogs settle; follow them once they
    // stop moving, so a dialog typing line by line doesn't rebuild the field every frame
    let measureTimer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(measureTimer);
      measureTimer = setTimeout(measure, 150);
    });
    ro.observe(document.body);

    resize();
    restart = start;
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", start);
    reduce.addEventListener("change", start);

    return () => {
      stop();
      clearTimeout(measureTimer);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", start);
      reduce.removeEventListener("change", start);
    };
  });
</script>

<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-grass" aria-hidden="true">
  <canvas bind:this={canvas} class="block" style="image-rendering: pixelated;"></canvas>
</div>

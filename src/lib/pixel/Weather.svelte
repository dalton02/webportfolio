<script lang="ts">
  import { onMount } from "svelte";
  import PixelSprite from "./PixelSprite.svelte";
  import { hat } from "./sprites.js";
  import { WPAL } from "./world.js";
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { reducedMotion } from "$lib/utils/motion.svelte";
  import sfx from "$lib/utils/sfx.svelte";
  import ui from "$lib/json/ui.json" with { type: "json" };

  /*
    The weather someone stirred up in the field (globalState.weather), on its own canvas
    between the ground and the page, so the text stays readable. Same crisp 3px art pixels
    as the Background. It only runs while there is weather, fading in and out in four steps
    like an old palette fade, and sleeps the rest of the time.
    Rain: slanted drops that splash where they land, under a blue-grey dim.
    Wind: streaks and loose leaves racing across, and a leather hat blown off someone's head;
    catch the hat and the wind dies down.
  */

  const PX = 3;
  const FPS = 30;
  const FADE = 1.2; // seconds to fade in or out

  type Drop = { x: number; y: number; len: number; v: number; land: number };
  type Splash = { x: number; y: number; life: number };
  type Streak = { x: number; y: number; len: number; v: number };
  type Leaf = { x: number; y: number; v: number; phase: number; color: string };

  const hatLabel = new Text(ui.weather.hat);
  let canvas = $state<HTMLCanvasElement>();
  // the blown hat, in screen pixels; null while it's off screen
  let hatAt = $state<{ x: number; y: number; turn: number } | null>(null);

  function catchHat() {
    sfx.itemGet();
    hatAt = null;
    globalState.setWeather("clear");
  }

  let wake = () => {};
  $effect(() => {
    sfx.weather(globalState.weather);
    if (globalState.weather !== "clear") wake();
  });

  onMount(() => {
    const el = canvas!;
    const ctx = el.getContext("2d")!;
    let w = 0;
    let h = 0;

    // what's on screen now, and how strongly; it lags globalState.weather by a fade
    let kind: "rain" | "wind" | undefined;
    let amt = 0;
    let dir = 1;
    let drops: Drop[] = [];
    let splashes: Splash[] = [];
    let streaks: Streak[] = [];
    let leaves: Leaf[] = [];
    let hatWait = 0;
    let hatBase = 0;
    let hatT = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const drop = (y = rand(-h, 0)): Drop => ({ x: rand(-20, w + 20), y, len: Math.round(rand(3, 6)), v: rand(6, 9), land: rand(h * 0.15, h) });
    const streak = (x = dir > 0 ? rand(-60, -10) : rand(w + 10, w + 60)): Streak => ({ x, y: rand(0, h), len: Math.round(rand(14, 40)), v: rand(12, 20) });
    const leafColors = [WPAL.l, WPAL.m, WPAL.d, WPAL.y, WPAL.p, WPAL.h];
    const leaf = (x = dir > 0 ? rand(-30, -4) : rand(w + 4, w + 30)): Leaf => ({
      x,
      y: rand(0, h),
      v: rand(4, 8),
      phase: rand(0, Math.PI * 2),
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    });

    function resize() {
      w = Math.ceil(window.innerWidth / PX);
      h = Math.ceil(window.innerHeight / PX);
      el.width = w;
      el.height = h;
      el.style.width = `${w * PX}px`;
      el.style.height = `${h * PX}px`;
      ctx.imageSmoothingEnabled = false;
    }

    function begin(next: "rain" | "wind") {
      kind = next;
      dir = next === "wind" ? globalState.windDir : 1;
      const area = w * h;
      drops = Array.from({ length: Math.round(area / 260) }, () => drop(rand(-h, h)));
      splashes = [];
      streaks = Array.from({ length: Math.round(h / 3) }, () => streak(rand(0, w)));
      leaves = Array.from({ length: Math.round(area / 600) }, () => leaf(rand(0, w)));
      hatWait = 1.5;
      hatAt = null;
    }

    function step(dt: number) {
      const want = globalState.weather === "clear" ? undefined : globalState.weather;
      if (!kind && want) begin(want);
      amt = Math.max(0, Math.min(1, amt + (want && want === kind ? dt : -dt) / FADE));
      if (amt === 0 && kind && kind !== want) {
        kind = undefined;
        hatAt = null;
        if (want) begin(want);
      }
      if (!kind || reducedMotion.current) return;

      if (kind === "rain") {
        const n = Math.round(drops.length * amt);
        for (let i = 0; i < n; i++) {
          const d = drops[i];
          d.y += d.v;
          d.x += d.v * 0.25 * dir;
          if (d.y >= d.land) {
            splashes.push({ x: Math.round(d.x), y: Math.round(d.land), life: 2 });
            drops[i] = drop(rand(-12, 0));
          }
        }
        let kept = 0;
        for (const s of splashes) if (--s.life >= 0) splashes[kept++] = s;
        splashes.length = kept;
      } else {
        const n = Math.round(streaks.length * amt);
        for (let i = 0; i < n; i++) {
          const s = streaks[i];
          s.x += s.v * dir;
          if (s.x < -80 || s.x > w + 80) streaks[i] = streak();
        }
        for (let i = 0; i < Math.round(leaves.length * amt); i++) {
          const l = leaves[i];
          l.x += l.v * dir;
          l.phase += 0.3;
          l.y += Math.sin(l.phase) * 1.2 + 0.2;
          if (l.x < -40 || l.x > w + 40 || l.y > h + 4) leaves[i] = leaf();
        }
        flyHat(dt);
      }
    }

    // the hat tumbles across now and then until someone catches it or the wind drops
    function flyHat(dt: number) {
      if (amt < 1) return;
      const vw = window.innerWidth;
      if (!hatAt) {
        hatWait -= dt;
        if (hatWait > 0) return;
        hatBase = window.innerHeight * rand(0.2, 0.6);
        hatT = 0;
        hatAt = { x: dir > 0 ? -60 : vw + 10, y: hatBase, turn: 0 };
        return;
      }
      hatT += dt;
      const x = hatAt.x + dir * 190 * dt;
      if (x < -80 || x > vw + 80) {
        hatAt = null;
        hatWait = rand(1.5, 3);
        return;
      }
      hatAt = { x, y: hatBase + Math.sin(hatT * 2.4) * 46, turn: Math.round(Math.sin(hatT * 3.1) * 4) * 8 };
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (!kind || amt === 0) return;
      // four flat levels instead of a smooth ramp
      const level = Math.ceil(amt * 3) / 3;

      if (kind === "rain") {
        ctx.fillStyle = `rgba(28, 40, 88, ${0.32 * level})`;
        ctx.fillRect(0, 0, w, h);
        if (reducedMotion.current) return;
        ctx.fillStyle = "rgba(200, 228, 248, 0.75)";
        for (let i = 0; i < Math.round(drops.length * amt); i++) {
          const d = drops[i];
          // the slant only shifts a column every few pixels, so each straight stretch is one rect
          const y = Math.round(d.y);
          for (let k = 0; k < d.len; ) {
            const x = Math.round(d.x - k * 0.25 * dir);
            let end = k + 1;
            while (end < d.len && Math.round(d.x - end * 0.25 * dir) === x) end++;
            ctx.fillRect(x, y - end + 1, 1, end - k);
            k = end;
          }
        }
        ctx.fillStyle = "rgba(220, 240, 255, 0.8)";
        for (const s of splashes) {
          const o = s.life === 1 ? 1 : 2;
          ctx.fillRect(s.x - o, s.y - (2 - s.life), 1, 1);
          ctx.fillRect(s.x + o, s.y - (2 - s.life), 1, 1);
        }
        return;
      }

      if (reducedMotion.current) return;
      ctx.fillStyle = `rgba(248, 248, 248, ${0.6 * level})`;
      for (let i = 0; i < Math.round(streaks.length * amt); i++) {
        const s = streaks[i];
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.len, 1);
      }
      for (let i = 0; i < Math.round(leaves.length * amt); i++) {
        const l = leaves[i];
        ctx.fillStyle = l.color;
        // a leaf flips between flat and edge-on as it tumbles
        const flat = Math.sin(l.phase * 1.7) > 0;
        ctx.fillRect(Math.round(l.x), Math.round(l.y), flat ? 2 : 1, flat ? 1 : 2);
      }
    }

    let raf = 0;
    let last = 0;
    let acc = 0;
    function tick(now: number) {
      acc += Math.min(0.25, (now - last) / 1000);
      last = now;
      if (acc >= 1 / FPS) {
        step(acc);
        acc = 0;
        draw();
      }
      // sleep once everything has faded away
      raf = kind || globalState.weather !== "clear" ? requestAnimationFrame(tick) : 0;
      if (!raf) ctx.clearRect(0, 0, w, h);
    }
    wake = () => {
      if (raf) return;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(tick);
    };

    resize();
    if (globalState.weather !== "clear") wake();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      wake = () => {};
      window.removeEventListener("resize", resize);
    };
  });
</script>

<div class="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
  <canvas bind:this={canvas} class="block" style="image-rendering: pixelated;"></canvas>
</div>

{#if hatAt}
  <button
    type="button"
    class="fixed top-0 left-0 z-30 p-2"
    style="transform: translate3d({Math.round(hatAt.x)}px, {Math.round(hatAt.y)}px, 0) rotate({hatAt.turn}deg);"
    aria-label={hatLabel.value}
    onclick={catchHat}
  >
    <PixelSprite sprite={hat} scale={3} />
  </button>
{/if}

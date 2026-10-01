<script lang="ts">
  import { onMount } from "svelte";

  // Grid spacing must match the dot pattern's background-size below.
  const G = 44;
  const MAX_PACKETS = 3;
  const SPEED = 70; // px/s
  const TRAIL = 120; // px
  const COLORS = ["242,197,124", "232,116,74"]; // sun, clay

  type Point = { x: number; y: number };
  type Packet = { path: Point[]; lengths: number[]; total: number; d: number; rgb: string; lit: number };
  type Glow = { x: number; y: number; life: number; rgb: string };

  let canvas = $state<HTMLCanvasElement>();
  let glowEl = $state<HTMLDivElement>();

  onMount(() => {
    const ctx = canvas!.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let packets: Packet[] = [];
    let glows: Glow[] = [];
    let nextSpawn = 0;
    let raf = 0;
    let last = 0;

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / G);
      rows = Math.ceil(h / G);
    }

    const node = (c: number, r: number): Point => ({ x: G / 2 + c * G, y: G / 2 + r * G });
    const rand = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

    function spawn() {
      let c = rand(1, Math.max(1, cols - 2));
      let r = rand(1, Math.max(1, rows - 2));
      const path = [node(c, r)];
      let horizontal = Math.random() > 0.5;
      const segments = rand(3, 6);
      for (let i = 0; i < segments; i++) {
        const step = rand(1, 4) * (Math.random() > 0.5 ? 1 : -1);
        if (horizontal) c = Math.min(cols - 1, Math.max(0, c + step));
        else r = Math.min(rows - 1, Math.max(0, r + step));
        const p = node(c, r);
        const prev = path[path.length - 1];
        if (p.x !== prev.x || p.y !== prev.y) path.push(p);
        horizontal = !horizontal;
      }
      if (path.length < 2) return;
      const lengths = path.slice(1).map((p, i) => Math.abs(p.x - path[i].x) + Math.abs(p.y - path[i].y));
      packets.push({
        path,
        lengths,
        total: lengths.reduce((a, b) => a + b, 0),
        d: 0,
        rgb: COLORS[Math.random() > 0.35 ? 0 : 1],
        lit: 0,
      });
      glows.push({ ...path[0], life: 1, rgb: packets[packets.length - 1].rgb });
    }

    function pointAt(p: Packet, d: number): Point {
      d = Math.max(0, Math.min(p.total, d));
      for (let i = 0; i < p.lengths.length; i++) {
        if (d <= p.lengths[i]) {
          const a = p.path[i];
          const b = p.path[i + 1];
          const t = p.lengths[i] === 0 ? 0 : d / p.lengths[i];
          return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        }
        d -= p.lengths[i];
      }
      return p.path[p.path.length - 1];
    }

    function drawPacket(p: Packet) {
      const head = Math.min(p.d, p.total);
      const tail = Math.max(0, p.d - TRAIL);
      const steps = 16;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      let prev = pointAt(p, tail);
      for (let i = 1; i <= steps; i++) {
        const d = tail + ((head - tail) * i) / steps;
        const pt = pointAt(p, d);
        ctx.strokeStyle = `rgba(${p.rgb},${(i / steps) * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        prev = pt;
      }
      if (p.d <= p.total) {
        const hp = pointAt(p, head);
        const g = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 7);
        g.addColorStop(0, `rgba(${p.rgb},0.4)`);
        g.addColorStop(1, `rgba(${p.rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (now > nextSpawn && packets.length < MAX_PACKETS) {
        spawn();
        nextSpawn = now + 1500 + Math.random() * 2500;
      }

      for (const p of packets) {
        p.d += SPEED * dt;
        // light up every corner the head has passed
        let acc = 0;
        for (let i = 0; i < p.lengths.length; i++) {
          acc += p.lengths[i];
          if (i >= p.lit && p.d >= acc) {
            glows.push({ ...p.path[i + 1], life: 1, rgb: p.rgb });
            p.lit = i + 1;
          }
        }
        drawPacket(p);
      }
      packets = packets.filter((p) => p.d < p.total + TRAIL);

      for (const g of glows) {
        g.life -= dt / 2.2;
        const a = Math.max(0, g.life);
        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, 10);
        grad.addColorStop(0, `rgba(${g.rgb},${a * 0.35})`);
        grad.addColorStop(1, `rgba(${g.rgb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(g.x, g.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      glows = glows.filter((g) => g.life > 0);

      if (finePointer && glowEl) {
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        glowEl.style.setProperty("--mx", `${mouse.x}px`);
        glowEl.style.setProperty("--my", `${mouse.y}px`);
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (reduced || raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onPointer(e: PointerEvent) {
      if (mouse.x === -9999) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    }

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  });
</script>

<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
  <div class="grid-dots absolute inset-0"></div>
  <canvas bind:this={canvas} class="absolute inset-0 h-full w-full"></canvas>
  <div bind:this={glowEl} class="mouse-glow absolute inset-0"></div>
  <div class="vignette absolute inset-0"></div>
  <div class="grain absolute inset-0"></div>
</div>

<style>
  .grid-dots {
    background-image: radial-gradient(circle at center, rgb(239 228 214 / 0.06) 1px, transparent 1.4px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%);
  }
  .mouse-glow {
    background: radial-gradient(
      560px circle at var(--mx, -9999px) var(--my, -9999px),
      rgb(232 116 74 / 0.045),
      transparent 70%
    );
  }
  .vignette {
    background: radial-gradient(ellipse 120% 90% at 50% 30%, transparent 55%, rgb(10 8 12 / 0.7) 100%);
  }
  .grain {
    opacity: 0.035;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }
</style>

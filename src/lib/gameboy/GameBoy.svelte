<script lang="ts">
  /*
    The hidden handheld: a grey brick of a console drawn in CSS, with the game running on a
    160×144 canvas behind the glass. Keys and the shell's own buttons both drive it, so it
    plays on a phone too. Only loaded once someone finds the cartridge.
  */
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { ASCII_BIRD, ASCII_BIRD_SHADE, SHADES } from "./art.js";
  import { Game, type Button, type Sound, type State } from "./engine.js";
  import { cap, capsule, circle, edge, minus, path, pick, shape, shift, union } from "./pixels.js";
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { reducedMotion, stepped } from "$lib/utils/motion.svelte";
  import sfx from "$lib/utils/sfx.svelte";
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.game).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.game,
    Text
  >;

  const TOP_KEY = "gb-top";

  const KEYS: Record<string, Button | "select"> = {
    ArrowLeft: "left",
    a: "left",
    ArrowRight: "right",
    d: "right",
    ArrowUp: "up",
    w: "up",
    ArrowDown: "down",
    s: "down",
    z: "a",
    k: "a",
    " ": "a",
    x: "b",
    j: "b",
    Shift: "b",
    Enter: "start",
    q: "select",
  };

  const sounds: Record<Sound, () => void> = {
    jump: () => sfx.jump(),
    jump2: () => sfx.jump(true),
    flap: () => sfx.flap(),
    coin: () => sfx.coin(),
    stomp: () => sfx.stomp(),
    bump: () => sfx.bump(),
    die: () => sfx.die(),
    clear: () => sfx.clear(),
    boot: () => sfx.boot(),
    oneUp: () => sfx.itemGet(),
    tick: () => sfx.cursor(),
    pause: () => sfx.select(),
  };

  // the title's ASCII soldadinho, split into runs of one shade so each run is a single span
  const ART = ASCII_BIRD.map((line, row) => {
    const runs: { text: string; shade: string }[] = [];
    [...line].forEach((ch, col) => {
      const shade = ASCII_BIRD_SHADE[row][col];
      const last = runs.at(-1);
      if (last && last.shade === shade) last.text += ch;
      else runs.push({ text: ch, shade });
    });
    return runs;
  });

  let scene = $state<State>("boot");
  let canvas = $state<HTMLCanvasElement>();
  let shell = $state<HTMLElement>();
  let game: Game | undefined;
  let held = $state<Partial<Record<Button | "select", boolean>>>({});
  // the D-pad rocks on one arm at a time
  let tilt = $derived((["up", "down", "left", "right"] as const).find((d) => held[d]));

  let vw = $state(1024);
  let vh = $state(768);
  // whole pixels on a desk; on a phone the glass takes whatever the shell leaves (16px rim + 28px bezel a side)
  let scale = $derived(
    vw < 560
      ? Math.max(1, (Math.min(vw - 24, 440) - 88) / 160)
      : Math.max(2, Math.min(4, Math.floor((vh - 330) / 144), Math.floor((vw - 140) / 160))),
  );

  /**
    A rounded box cut on a pixel grid: each corner is a staircase of `px` steps instead of a
    smooth curve, so the shell reads as pixel art like the rest of the site. Radii go
    top-left, top-right, bottom-right, bottom-left.
  */
  function pixelBox(tl: number, tr: number, br: number, bl: number, px = 4) {
    const stair = (r: number) => {
      const n = Math.round(r / px);
      return Array.from({ length: n }, (_, k) => {
        const mid = r - (k + 0.5) * px;
        return Math.round((r - Math.sqrt(Math.max(0, r * r - mid * mid))) / px) * px;
      });
    };
    const L = (v: number) => `${v}px`;
    const R = (v: number) => `calc(100% - ${v}px)`;
    const pts: string[] = [];
    const a = stair(tl);
    for (let k = a.length - 1; k >= 0; k--) pts.push(`${L(a[k])} ${L((k + 1) * px)}`, `${L(a[k])} ${L(k * px)}`);
    if (!a.length) pts.push("0 0");
    const b = stair(tr);
    for (let k = 0; k < b.length; k++) pts.push(`${R(b[k])} ${L(k * px)}`, `${R(b[k])} ${L((k + 1) * px)}`);
    if (!b.length) pts.push("100% 0");
    const c = stair(br);
    for (let k = c.length - 1; k >= 0; k--) pts.push(`${R(c[k])} ${R((k + 1) * px)}`, `${R(c[k])} ${R(k * px)}`);
    if (!c.length) pts.push("100% 100%");
    const d = stair(bl);
    for (let k = 0; k < d.length; k++) pts.push(`${L(d[k])} ${R(k * px)}`, `${L(d[k])} ${R((k + 1) * px)}`);
    if (!d.length) pts.push("0 100%");
    return `clip-path: polygon(${pts.join(", ")});`;
  }

  const SHELL = pixelBox(8, 8, 56, 8);
  const BEZEL = pixelBox(8, 8, 32, 8);

  // the controls are drawn on a 3px grid; each one's cap sinks a cell into its hole when held
  const U = 3;

  // D-pad: a cross with clipped tips, a dimple in the middle and faint arrows, in a shallow disc
  const DPAD = (() => {
    const W = 41;
    const H = 44;
    const C = 20;
    const arm = (a: number, b: number) => a <= 5 && b <= 16 && !(a === 5 && b === 16);
    const face = shape(W, H, (x, y) => {
      const dx = Math.abs(x - 0.5 - C);
      const dy = Math.abs(y - 0.5 - C);
      return arm(dx, dy) || arm(dy, dx);
    });
    const tri = (along: number, across: number) => along >= 11 && along <= 13 && Math.abs(across) <= 13 - along;
    const arrows = shape(W, H, (x, y) => {
      const dx = x - 0.5 - C;
      const dy = y - 0.5 - C;
      return tri(-dy, dx) || tri(dy, dx) || tri(-dx, dy) || tri(dx, dy);
    });
    const disc = shape(W, H, circle(C + 0.5, C + 1.5, 20.5));
    const dimple = shape(W, H, circle(C + 0.5, C + 0.5, 3.3));
    return {
      W,
      H,
      ...cap(face, 2),
      disc: path(disc),
      discTop: path(minus(edge(disc, 0, -1), edge(disc, 0, 1))),
      discBottom: path(edge(disc, 0, 1)),
      arrows: path(arrows),
      dimple: path(dimple),
      dimpleHi: path(union(edge(dimple, 0, 1), edge(dimple, 1, 0))),
      arms: {
        up: path(pick(face, (x, y) => y - C < -5)),
        down: path(pick(face, (x, y) => y - C > 5)),
        left: path(pick(face, (x) => x - C < -5)),
        right: path(pick(face, (x) => x - C > 5)),
      },
    };
  })();

  // A and B: round caps in a slanted tray, B low on the left and A high on the right
  const AB = (() => {
    const W = 43;
    const H = 40;
    const at = { b: [11.5, 21.5], a: [30.5, 12.5] } as const;
    const tray = shape(W, H, capsule(...at.b, ...at.a, 10.5));
    const button = ([cx, cy]: readonly [number, number]) => {
      const [x, y] = [Math.floor(cx), Math.floor(cy)];
      return {
        cx,
        cy,
        ...cap(shape(W, H, circle(cx, cy, 7.4)), 2),
        shine: path(new Set([`${x - 4},${y - 3}`, `${x - 3},${y - 4}`, `${x - 4},${y - 2}`])),
      };
    };
    return { W, H, tray: path(tray), trayTop: path(edge(tray, 0, -1)), a: button(at.a), b: button(at.b) };
  })();

  // SELECT and START: short slanted pills, each in its own groove
  const PILL = { W: 15, H: 10, ...cap(shape(15, 10, capsule(3, 6.5, 12, 2.5, 1.9)), 1) };

  // the speaker: six steep slots, each with a lit lower lip
  const SPEAKER = (() => {
    const W = 38;
    const H = 22;
    const slots = union(...Array.from({ length: 6 }, (_, i) => shape(W, H, capsule(i * 5.4 + 3, 19, i * 5.4 + 10, 3, 1.1))));
    return { W, H, slots: path(slots), lip: path(minus(shift(slots, 1, 1), slots)) };
  })();

  function press(b: Button | "select", down: boolean) {
    if (held[b] === down) return;
    held[b] = down;
    // SELECT is the sound switch, since the page's B key stands down while the console is on
    if (b === "select") {
      if (down) sfx.toggle();
    } else game?.press(b, down);
  }

  function releaseAll() {
    for (const b of Object.keys(held) as (Button | "select")[]) press(b, false);
  }

  function onKey(e: KeyboardEvent, down: boolean) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape") {
      if (down) close();
      return;
    }
    const b = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (!b) return;
    e.preventDefault();
    press(b, down);
  }

  function close() {
    sfx.back();
    globalState.gameOpen = false;
  }

  onMount(() => {
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    sfx.gameMusic(true);

    let top = 0;
    try {
      top = Number(localStorage.getItem(TOP_KEY)) || 0;
    } catch {
      // storage blocked: the record just lasts this visit
    }

    game = new Game(canvas!, {
      sound: (name) => sounds[name](),
      music: (on) => sfx.duck(!on),
      top,
      onTop: (score) => {
        try {
          localStorage.setItem(TOP_KEY, String(score));
        } catch {
          // same as above
        }
      },
      words: () => ({
        start: t.start.value,
        over: t.over.value,
        clear: t.clear.value,
        thanks: t.thanks.value,
        pause: t.pause.value,
        timeUp: t.timeUp.value,
        top: t.top.value,
      }),
      quick: reducedMotion.current,
      scene: (state) => (scene = state),
    });
    game.start();
    shell?.focus();

    return () => {
      game?.stop();
      sfx.gameMusic(false);
      document.body.style.overflow = "";
      opener?.focus();
    };
  });
</script>

<svelte:window
  bind:innerWidth={vw}
  bind:innerHeight={vh}
  onkeydown={(e) => onKey(e, true)}
  onkeyup={(e) => onKey(e, false)}
  onblur={releaseAll}
/>

<!-- a transparent hit area over a control; the drawing underneath shows the press -->
{#snippet key(b: Button | "select", label: string, style: string)}
  <button
    type="button"
    tabindex="-1"
    class="hit"
    {style}
    aria-label={label}
    onpointerdown={(e) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      press(b, true);
    }}
    onpointerup={() => press(b, false)}
    onpointercancel={() => press(b, false)}
    onlostpointercapture={() => press(b, false)}
    oncontextmenu={(e) => e.preventDefault()}
  ></button>
{/snippet}

<!-- a cap in its hole: at rest the dark hole shows under it as its side, held it drops a cell -->
{#snippet capped(c: ReturnType<typeof cap> & { shine?: string }, down: boolean)}
  <path class="well" d={c.well} />
  <path class="hole" d={c.hole} />
  <g class="cap" class:down>
    <path class="face" d={c.face} />
    <path class="lo" d={c.lo} />
    <path class="hi" d={c.hi} />
    {#if c.shine}<path class="shine" d={c.shine} />{/if}
  </g>
{/snippet}

<div class="fixed inset-0 z-50 overflow-y-auto" transition:fade|global={{ duration: 160, easing: stepped(4) }}>
  <button type="button" class="backdrop fixed inset-0 cursor-default" aria-label={t.close.value} onclick={close}></button>

  <div class="pointer-events-none relative flex min-h-full flex-col items-center justify-center gap-4 px-3 py-6">
    <!-- the frame carries the ink outline and drop shadow, since the stepped clip on the shell would cut them off -->
    <div class="frame pointer-events-auto" in:fly|global={{ y: 60, duration: 260, easing: stepped(5) }}>
      <div bind:this={shell} role="dialog" aria-modal="true" aria-label={t.title.value} tabindex="-1" class="shell" style={SHELL}>
        <!-- the rim along the top, where the power switch lives; sliding it off closes the game -->
        <div class="rim">
          <button type="button" class="power" onclick={close} aria-label={t.close.value}>
            <span class="power-slot"><span class="power-knob"></span></span>
            <span>◀OFF·ON</span>
          </button>
        </div>

        <div class="bezel" style={BEZEL}>
          <p class="bezel-text"><span class="line"></span>DOT MATRIX · 4 SHADES<span class="line"></span></p>
          <span class="led" aria-hidden="true"></span>
          <span class="led-label" aria-hidden="true">BATTERY</span>
          <div class="lcd" style="--s: {scale};">
            <canvas bind:this={canvas} width="160" height="144" style="width: {160 * scale}px; height: {144 * scale}px;"
              >Chapada Adventures</canvas
            >
            {#if scene === "title"}
              <pre class="ascii" aria-hidden="true" style="--ink: {SHADES[3]}; --mid: {SHADES[2]}; --light: {SHADES[1]};">{#each ART as runs, row (row)}{#each runs as run, i (i)}<span class="s{run.shade}">{run.text}</span>{/each}{"\n"}{/each}</pre>
            {/if}
          </div>
        </div>

        <p class="brand" aria-hidden="true">
          <span class="brand-name">DALTON</span><span class="brand-boy">BOY</span><span class="brand-tm">TM</span>
        </p>

        <div class="controls">
          <div class="dpad" style="width: {DPAD.W * U}px; height: {DPAD.H * U}px;">
            <svg class="px" viewBox="0 0 {DPAD.W} {DPAD.H}" aria-hidden="true">
              <path class="disc" d={DPAD.disc} />
              <path class="disc-top" d={DPAD.discTop} />
              <path class="disc-bottom" d={DPAD.discBottom} />
              <path class="well" d={DPAD.well} />
              <path class="hole" d={DPAD.hole} />
              <g class="cap" class:down={tilt}>
                <path class="face" d={DPAD.face} />
                <path class="lo" d={DPAD.lo} />
                <path class="hi" d={DPAD.hi} />
                <path class="arrow" d={DPAD.arrows} />
                <path class="dimple" d={DPAD.dimple} />
                <path class="dimple-hi" d={DPAD.dimpleHi} />
                {#if tilt}<path class="arm" d={DPAD.arms[tilt]} />{/if}
              </g>
            </svg>
            {@render key("up", "Up", "left: 45px; top: 0; width: 33px; height: 51px;")}
            {@render key("down", "Down", "left: 45px; top: 72px; width: 33px; height: 51px;")}
            {@render key("left", "Left", "left: 0; top: 45px; width: 51px; height: 33px;")}
            {@render key("right", "Right", "left: 72px; top: 45px; width: 51px; height: 33px;")}
          </div>

          <div class="ab" style="width: {AB.W * U}px; height: {AB.H * U}px;">
            <svg class="px" viewBox="0 0 {AB.W} {AB.H}" aria-hidden="true">
              <path class="tray" d={AB.tray} />
              <path class="tray-top" d={AB.trayTop} />
              {@render capped(AB.b, !!held.b)}
              {@render capped(AB.a, !!held.a)}
            </svg>
            {#each [["b", AB.b], ["a", AB.a]] as const as [b, c] (b)}
              {@render key(b, b.toUpperCase(), `left: ${(c.cx - 9) * U}px; top: ${(c.cy - 9) * U}px; width: 54px; height: 57px;`)}
              <span class="tag tag-ab" style="left: {c.cx * U - 4}px; top: {(c.cy + 11) * U}px;">{b.toUpperCase()}</span>
            {/each}
          </div>
        </div>

        <div class="pills">
          {#each [["select", "SELECT"], ["start", "START"]] as const as [b, label] (b)}
            <div class="pill">
              <svg class="px" viewBox="0 0 {PILL.W} {PILL.H}" width={PILL.W * U} height={PILL.H * U} aria-hidden="true">
                {@render capped(PILL, !!held[b])}
              </svg>
              {@render key(b, label, "inset: -6px;")}
              <span class="tag tag-pill">{label}</span>
            </div>
          {/each}
        </div>

        <svg
          class="px speaker"
          viewBox="0 0 {SPEAKER.W} {SPEAKER.H}"
          width={SPEAKER.W * U}
          height={SPEAKER.H * U}
          aria-hidden="true"
        >
          <path class="lip" d={SPEAKER.lip} />
          <path class="slot" d={SPEAKER.slots} />
        </svg>
      </div>
    </div>

    <p class="hidden font-label text-[12px] text-snow/85 sm:block">{t.hint.value}</p>
  </div>
</div>

<style>
  .backdrop {
    background-color: rgb(16 24 40 / 0.8);
    background-image:
      linear-gradient(45deg, rgb(0 0 0 / 0.18) 25%, transparent 25%, transparent 75%, rgb(0 0 0 / 0.18) 75%),
      linear-gradient(45deg, rgb(0 0 0 / 0.18) 25%, transparent 25%, transparent 75%, rgb(0 0 0 / 0.18) 75%);
    background-size: 16px 16px;
    background-position:
      0 0,
      8px 8px;
  }

  /* a 3px ink outline and a hard drop shadow that follow the stepped edge */
  .frame {
    filter: drop-shadow(3px 0 0 var(--color-ink)) drop-shadow(-3px 0 0 var(--color-ink)) drop-shadow(0 3px 0 var(--color-ink))
      drop-shadow(0 -3px 0 var(--color-ink)) drop-shadow(0 10px 0 rgb(0 0 0 / 0.35));
  }
  /* on a desk the whole console sits a size smaller, so it reads as a handheld and not a wall */
  @media (min-width: 560px) {
    .frame {
      zoom: 0.7;
    }
  }

  .shell {
    --body: #c9c6bd;
    --body-lo: #a9a59b;
    --body-hi: #e4e1d8;
    --groove: #b3afa5;
    --ink: #2b2f7a;
    --berry: #a1235a;
    position: relative;
    padding: 0 16px 28px;
    background: var(--body);
    box-shadow:
      inset -4px -8px 0 0 var(--body-lo),
      inset 4px 4px 0 0 var(--body-hi);
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  /* the seam along the top with its two corner ticks, and the power switch on it */
  .rim {
    position: relative;
    display: flex;
    align-items: center;
    height: 26px;
    margin: 0 -16px 14px;
    padding: 0 22px;
  }
  .rim::before {
    content: "";
    position: absolute;
    inset: auto 0 0;
    height: 4px;
    background: var(--groove);
    box-shadow: 0 2px 0 0 var(--body-hi);
  }
  .rim::after {
    content: "";
    position: absolute;
    inset: 0 12px;
    border-inline: 3px solid var(--groove);
    pointer-events: none;
  }
  .power {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-family: var(--font-label);
    font-size: 9px;
    letter-spacing: 0.08em;
    color: #7d7a72;
  }
  .power-slot {
    width: 30px;
    height: 10px;
    padding: 2px;
    background: #8d8a82;
    box-shadow: inset 0 2px 0 0 #6d6a62;
  }
  .power-knob {
    display: block;
    width: 12px;
    height: 6px;
    margin-left: auto;
    background: var(--body-hi);
    box-shadow: inset 0 -2px 0 0 var(--body-lo);
  }
  .power:hover,
  .power:focus-visible {
    color: var(--berry);
  }
  .power:hover .power-knob,
  .power:focus-visible .power-knob {
    margin-left: 0;
  }

  .bezel {
    position: relative;
    padding: 22px 28px 20px;
    background: #5b5d6e;
    box-shadow: inset 0 4px 0 0 rgb(0 0 0 / 0.25);
  }
  .bezel-text {
    position: absolute;
    top: 6px;
    left: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-label);
    font-size: 8px;
    letter-spacing: 0.06em;
    color: #b8b9c8;
    white-space: nowrap;
  }
  .line {
    flex: 1;
    height: 4px;
    border-top: 2px solid var(--berry);
    border-bottom: 2px solid #4a4fb0;
  }
  /* a round red lamp, cut on the pixel grid, with a little glow */
  .led {
    position: absolute;
    left: 9px;
    top: 42%;
    width: 10px;
    height: 10px;
    background: #ff3a3a;
    box-shadow:
      inset 2px 2px 0 0 #ffb0a8,
      inset -2px -2px 0 0 #b81c1c;
    clip-path: polygon(2px 0, 8px 0, 8px 2px, 10px 2px, 10px 8px, 8px 8px, 8px 10px, 2px 10px, 2px 8px, 0 8px, 0 2px, 2px 2px);
  }
  .led-label {
    position: absolute;
    left: 4px;
    top: calc(42% + 18px);
    font-family: var(--font-label);
    font-size: 6px;
    color: #b8b9c8;
    writing-mode: vertical-rl;
    rotate: 180deg;
  }
  @media (max-width: 559px) {
    .led-label {
      display: none;
    }
  }

  .lcd {
    position: relative;
    line-height: 0;
    box-shadow: 0 0 0 3px #3d3f4c;
  }
  .lcd canvas {
    display: block;
    image-rendering: pixelated;
  }
  /*
    The dot matrix: a visible gap between every LCD pixel, like the old reflective screens,
    and a little shade at the edges where the glass sits deeper than the frame.
  */
  .lcd::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(to right, rgb(155 188 15 / 0.35) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(155 188 15 / 0.35) 1px, transparent 1px);
    background-size: calc(var(--s) * 1px) calc(var(--s) * 1px);
    box-shadow:
      inset 0 6px 0 0 rgb(15 56 15 / 0.18),
      inset 6px 0 0 0 rgb(15 56 15 / 0.1);
  }

  /*
    The title's ASCII art, 120 columns by 70 rows, in game pixels: each row 2px tall and each
    character about 1px wide, starting 22px in. Far finer than the screen's own letters, so it
    sits on the glass as tiny text, under the dot-matrix grid like everything else.
  */
  .ascii {
    position: absolute;
    left: calc(var(--s) * 22px);
    top: calc(var(--s) * 2px);
    margin: 0;
    font-family: ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace;
    /* set at a normal size and shrunk with a transform, since browsers won't draw text this small */
    font-size: 10px;
    line-height: 12.35px;
    font-weight: 700;
    white-space: pre;
    transform: scale(calc(var(--s) * 0.162));
    transform-origin: 0 0;
    pointer-events: none;
    animation: ascii-in 0.5s steps(5) both;
  }
  .ascii .s1 {
    color: var(--light);
  }
  .ascii .s2 {
    color: var(--mid);
  }
  .ascii .s3 {
    color: var(--ink);
  }
  @keyframes ascii-in {
    from {
      opacity: 0;
    }
  }

  /* the logo leans like the real one: a bold word, then BOY in the title face */
  .brand {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin: 14px 0 0 2px;
    color: var(--ink);
    line-height: 1;
  }
  .brand-name,
  .brand-boy {
    transform: skewX(-12deg);
  }
  .brand-name {
    font-family: var(--font-label);
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 0.02em;
  }
  .brand-boy {
    font-family: var(--font-title);
    font-size: 17px;
  }
  .brand-tm {
    align-self: flex-start;
    font-family: var(--font-label);
    font-size: 7px;
  }

  .controls {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 18px;
  }

  /* every control is drawn in SVG on a 3px grid, with a transparent button on top to press */
  .px {
    display: block;
    overflow: visible;
    shape-rendering: crispEdges;
  }
  .dpad,
  .ab {
    position: relative;
  }
  .dpad > .px,
  .ab > .px {
    width: 100%;
    height: 100%;
  }
  .hit {
    position: absolute;
    cursor: pointer;
    touch-action: none;
  }

  .dpad .disc {
    fill: #bfbcb2;
  }
  .dpad .disc-top {
    fill: #aeaaa0;
  }
  .dpad .disc-bottom {
    fill: #d6d3ca;
  }
  .dpad .well {
    fill: #7f7b72;
  }
  .dpad .hole {
    fill: #0e0e12;
  }
  .dpad .face {
    fill: #2a2a30;
  }
  .dpad .hi {
    fill: #4a4a54;
  }
  .dpad .lo {
    fill: #1b1b20;
  }
  .dpad .arrow {
    fill: #3a3a43;
  }
  .dpad .dimple {
    fill: #1f1f25;
  }
  .dpad .dimple-hi {
    fill: #3d3d46;
  }
  .dpad .arm {
    fill: rgb(0 0 0 / 0.32);
  }

  .ab {
    margin-top: 6px;
  }
  .ab .tray {
    fill: var(--body-lo);
  }
  .ab .tray-top {
    fill: #97938a;
  }
  .ab .well {
    fill: #6e6a62;
  }
  .ab .hole {
    fill: #5e0f30;
  }
  .ab .face {
    fill: var(--berry);
  }
  .ab .hi {
    fill: #c94a80;
  }
  .ab .lo {
    fill: #7e1844;
  }
  .ab .shine {
    fill: #e88ab0;
  }

  .pills {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin-top: 18px;
    padding-right: 34px;
  }
  .pill {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pills .well {
    fill: #8f8b82;
  }
  .pills .hole {
    fill: #4c4a52;
  }
  .pills .face {
    fill: #8d8b94;
  }
  .pills .hi {
    fill: #aaa8b2;
  }
  .pills .lo {
    fill: #6c6a74;
  }

  /*
    The press: the cap drops one cell into its hole, so the dark hole shows above it as shadow
    and only a sliver of side is left below; its lit edge goes and the face dims. No easing,
    the way a sprite would swap frames.
  */
  .cap.down {
    transform: translateY(3px);
  }
  .cap.down .hi,
  .cap.down .shine {
    visibility: hidden;
  }
  .ab .cap.down .face,
  .pills .cap.down .face {
    filter: brightness(0.82);
  }

  .tag {
    font-family: var(--font-label);
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--ink);
  }
  .tag-ab {
    position: absolute;
  }
  .tag-pill {
    margin-top: -4px;
    font-size: 9px;
    rotate: -24deg;
  }

  .speaker {
    position: absolute;
    right: 18px;
    bottom: 26px;
  }
  .speaker .slot {
    fill: #8f8b81;
  }
  .speaker .lip {
    fill: var(--body-hi);
  }
</style>

/*
  Chapada Adventures, the tiny platformer inside the hidden handheld. Fixed 60 Hz steps on
  requestAnimationFrame, in four shades. The screen is laid out on a 160×144 grid (HUD, menus,
  words) but the canvas has ZOOM pixels for each of those, and the world is drawn one to one
  on them, so the camera sees that much farther than the old handheld did. The soldadinho
  hops twice, glides while you hold the button, a little like a certain green dinosaur's
  flutter, and dashes once per flight, which is also the only thing that breaks cracked rock.
  The camera follows both ways, so you can always go back for a spring or a coin.
  Units are pixels per frame.
*/
import {
  BIRD, BIRD_COLOR, BIRD_LETTERS, BRANCH, BRICK, CACTUS, CALANGO, CALANGO_FLAT, CANOPY, CARCARA, CLOUD, COIN, COIN_MINI,
  COLOR, CRACKED, DIRT, FERN, FLAG, FONT, GROUND, GROUND_GRASS, HARD, HEART, MESA, MONO, NEST, PIPE, POLE, POLE_TOP,
  POST, QUESTION_FRAMES, SAND, SAPO, SHADES, SPIKES, SPRING, TREE, USED, type Art, type Palette,
} from "./art.js";
import { LEVELS, ROWS } from "./level.js";

export type Button = "left" | "right" | "up" | "down" | "a" | "b" | "start";
export type Sound = "jump" | "jump2" | "flap" | "coin" | "stomp" | "bump" | "die" | "clear" | "boot" | "oneUp" | "tick" | "pause" | "dash" | "spring" | "smash" | "check" | "color";
export type Words = Record<"start" | "over" | "clear" | "thanks" | "pause" | "timeUp" | "top", string>;

export type Hooks = {
  sound(name: Sound): void;
  /** level tune on or hushed (death, pause, course clear) */
  music(on: boolean): void;
  top: number;
  onTop(score: number): void;
  /** on-screen words, read every frame so they follow the page language */
  words(): Words;
  /** skip the power-on logo (reduced motion) */
  quick?: boolean;
  /** told whenever the screen changes, so the console can lay the ASCII art over the title */
  scene?(state: State): void;
  /** told when the world turns to colour and back, so the glass can drop its green tint */
  color?(on: boolean): void;
};

const W = 160;
const H = 144;
const T = 16;
const HUD = 16;
const VIEW = H - HUD;
/** world pixels per screen-grid pixel: the camera sits this many times farther back */
export const ZOOM = 1.8;
/** the canvas, in whole pixels; the HUD band and the view below it share its height */
export const CANVAS = { w: Math.round(W * ZOOM), h: Math.round(H * ZOOM) };
const TOP = Math.round(HUD * ZOOM);
const VW = CANVAS.w; // 18 columns of level on screen
const VH = CANVAS.h - TOP; // about 14 rows, a little more than the level is tall
const DEPTH = ROWS * T;
const STEP = 1000 / 60;
const TIME = 400;
const TIME_TICK = 24; // frames per clock tick, ~0.4s like the old handhelds

// the soldadinho's moves
const WALK = 1.3;
const RUN = 2;
const HOP = 3.6; // about three blocks
const HOP_AGAIN = 3.4; // the second hop, in the air
const GLIDE = 110; // frames of gliding before the wings tire
const GLIDE_FALL = 0.55;
const LIFT = 1.8; // how fast an updraft carries you up
const DASH = 4.2; // B in the air: a quick straight burst
const DASH_TIME = 12;
const SPRING_UP = 5.6; // about seven blocks, as if you held the button all the way up
const CRUMBLE = 36; // frames a sandstone block holds you before it gives way
const REGROW = 300; // and how long until it is back
/*
  Spike traps run on one clock: the tips peek out as a warning, the spikes shoot up, hold,
  and sink back. Each column runs a little behind the one on its left, so across a field they
  roll forward like a wave, and running right behind one takes you through the gap it leaves.
*/
const SPIKE_CYCLE = 120;
const SPIKE_WAVE = 10; // frames between one column and the next

const SOLID = new Set(["#", "B", "?", "!", "U", "H", "[", "]", "{", "}", "^", "~", "D"]);
/** the row the soldadinho starts on and the flag counts from, the top of the valley floor */
const FLOOR = ROWS - 2;

type Body = { x: number; y: number; vx: number; vy: number; ox: number; oy: number; w: number; h: number; ground: boolean };
type Player = Body & {
  face: 1 | -1; walk: number; hops: number; wings: number; gliding: boolean; nested: boolean; dash: number; dashed: boolean;
  /** thrown by a spring: the climb goes as high as a held hop would, button or not */
  sprung: boolean;
};
type Enemy = Body & { kind: "calango" | "carcara" | "sapo"; baseY: number; t: number; dead: number; awake: boolean };
type Heart = Body & { rise: number };
type Pop = { x: number; y: number; t: number };
type Label = { x: number; y: number; t: number; text: string };
type Bump = { c: number; r: number; t: number };
type Puff = { x: number; y: number; t: number };
type Chip = { x: number; y: number; vx: number; vy: number; t: number };

export type State = "boot" | "title" | "intro" | "play" | "dying" | "clear" | "gameover";

function bake(rows: Art, flip = false, pal: Palette = MONO) {
  const c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const g = c.getContext("2d")!;
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      g.fillStyle = pal[ch];
      g.fillRect(flip ? c.width - 1 - x : x, y, 1, 1);
    }),
  );
  return c;
}

/** The colours the world draws with outside its sprites: sky, HUD and words, and the loose bits. */
type Look = { sky: string; ui: Palette; chip: string; puff: string; wind: readonly [string, string] };
const MONO_LOOK: Look = { sky: SHADES[0], ui: MONO, chip: SHADES[3], puff: SHADES[2], wind: [SHADES[2], SHADES[1]] };
const COLOR_LOOK: Look = { sky: COLOR.sky, ui: COLOR.ui, chip: COLOR.chip, puff: COLOR.puff, wind: [COLOR.wind[0], COLOR.wind[1]] };

/**
  Every picture the world needs, in the four greens or, with the colour on, each piece in
  its own palette. Same art either way.
*/
function sprites(color: boolean) {
  const p = (k: keyof typeof COLOR): Palette | undefined => (color ? (COLOR[k] as Palette) : undefined);
  const both = (rows: Art, pal?: Palette) => [bake(rows, false, pal), bake(rows, true, pal)];
  return {
    ground: color ? bake(GROUND_GRASS, false, COLOR.ground) : bake(GROUND),
    dirt: bake(DIRT, false, p("dirt")),
    brick: bake(BRICK, false, p("brick")),
    question: QUESTION_FRAMES.map((f) => bake(f, false, p("question"))),
    used: bake(USED, false, p("used")),
    hard: bake(HARD, false, p("hard")),
    capL: bake(PIPE.capL, false, p("plant")),
    capR: bake(PIPE.capR, false, p("plant")),
    bodyL: bake(PIPE.bodyL, false, p("plant")),
    bodyR: bake(PIPE.bodyR, false, p("plant")),
    pole: bake(POLE, false, p("pole")),
    poleTop: bake(POLE_TOP, false, p("pole")),
    flag: bake(FLAG, false, p("flag")),
    nest: bake(NEST, false, p("nest")),
    cactus: bake(CACTUS, false, p("plant")),
    fern: bake(FERN, false, p("plant")),
    tree: bake(TREE, false, p("tree")),
    spikes: SPIKES.map((f) => bake(f, false, p("spikes"))),
    cloud: bake(CLOUD, false, p("cloud")),
    mesa: bake(MESA, false, p("far")),
    canopy: bake(CANOPY, false, p("far")),
    coin: COIN.map((f) => bake(f, false, p("coin"))),
    coinMini: bake(COIN_MINI, false, p("coin")),
    heart: bake(HEART, false, p("heart")),
    bird: Object.fromEntries(
      Object.entries(color ? BIRD_LETTERS : BIRD).map(([k, v]) => [k, both(v, color ? BIRD_COLOR : undefined)]),
    ) as Record<keyof typeof BIRD, HTMLCanvasElement[]>,
    calango: CALANGO.map((f) => both(f, p("calango"))),
    calangoFlat: bake(CALANGO_FLAT, false, p("calango")),
    carcara: CARCARA.map((f) => bake(f, false, p("carcara"))),
    carcaraDown: bake([...CARCARA[0]].reverse(), false, p("carcara")),
    sapo: SAPO.map((f) => both(f, p("sapo"))),
    sapoDown: bake([...SAPO[0]].reverse(), false, p("sapo")),
    spring: SPRING.map((f) => bake(f, false, p("spring"))),
    branch: bake(BRANCH, false, p("branch")),
    sand: bake(SAND, false, p("sand")),
    cracked: bake(CRACKED, false, p("hard")),
    post: POST.map((f) => bake(f, false, p("post"))),
  };
}
type Sprites = ReturnType<typeof sprites>;

const BOUNCE = [0, 3, 5, 6, 6, 5, 3, 1, 0];

export class Game {
  /** everything draws here first, then lands on the visible canvas through present() */
  private g: CanvasRenderingContext2D;
  private buffer = document.createElement("canvas");
  private screen: CanvasRenderingContext2D;
  private started = false;
  private raf = 0;
  private held = new Set<Button>();
  private pressed = new Set<Button>();
  private frame = 0;

  private state: State = "boot";
  private t = 0; // frames spent in the current state
  private paused = false;

  /** which of LEVELS is being played */
  private level = 0;
  private map: string[][] = [];
  private cols = LEVELS[0].map[0].length;
  private cam = 0;
  private camY = DEPTH - VH;
  private p: Player = this.freshPlayer();
  private enemies: Enemy[] = [];
  private hearts: Heart[] = [];
  private pops: Pop[] = [];
  private labels: Label[] = [];
  private bumps: Bump[] = [];
  private puffs: Puff[] = [];
  /** springs that just threw something, drawn squashed for a beat */
  private springs: Bump[] = [];
  /** sandstone blocks stepped on: t counts up, they give way at CRUMBLE and grow back at REGROW */
  private crumbles: Bump[] = [];
  /** bits of broken rock and sandstone tumbling away */
  private chips: Chip[] = [];
  /** the checkpoint post, and whether the soldadinho has passed it this game */
  private post = { c: -1, r: 0 };
  private saved = false;

  private lives = 3;
  private score = 0;
  private coins = 0;
  /** score and coins when the level began; a lost life rolls back to them */
  private entry = { score: 0, coins: 0 };
  private time = TIME;
  private top: number;
  private clearPhase: "slide" | "walk" | "tally" | "done" = "slide";
  private flagY = 0;

  private pole = { c: 0, top: 0 };
  private nest = { x: 0, y: 0 };

  private mono = sprites(false);
  /** baked the first time SELECT turns the colour on */
  private colored?: Sprites;
  private img: Sprites = this.mono;
  private look = MONO_LOOK;
  /** the frame the colour last came on, for the flash */
  private bloom = -1;
  private glyphs = new Map<string, HTMLCanvasElement>();

  constructor(
    canvas: HTMLCanvasElement,
    private hooks: Hooks,
  ) {
    this.buffer.width = CANVAS.w;
    this.buffer.height = CANVAS.h;
    this.g = this.buffer.getContext("2d")!;
    this.screen = canvas.getContext("2d")!;
    this.g.imageSmoothingEnabled = false;
    this.screen.imageSmoothingEnabled = false;
    this.top = hooks.top;
    if (hooks.quick) this.go("title");
    this.load();
  }

  start() {
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      // a background tab pauses rAF; don't fast-forward through the gap when it comes back
      acc += Math.min(100, now - last);
      last = now;
      let stepped = false;
      while (acc >= STEP) {
        this.step();
        acc -= STEP;
        stepped = true;
      }
      // a 120 or 144 Hz display calls back more often than the game moves; redraw only when it did
      if (stepped) this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  /**
    SELECT: the whole screen between the four greens and colour, like slotting the cartridge
    into the colour handheld. Works anywhere, the title included, and lasts until pressed again.
  */
  toggleColor() {
    const on = this.img === this.mono;
    if (on) this.colored ??= sprites(true);
    this.img = on ? this.colored! : this.mono;
    this.look = on ? COLOR_LOOK : MONO_LOOK;
    this.glyphs.clear();
    this.bloom = on && !this.hooks.quick ? this.frame : -1;
    this.hooks.sound(on ? "color" : "pause");
    this.hooks.color?.(on);
  }

  press(b: Button, down: boolean) {
    if (down && !this.held.has(b)) this.pressed.add(b);
    if (down) this.held.add(b);
    else this.held.delete(b);
  }

  // ---------------------------------------------------------------- setup

  /** The bird is 20×18 on screen; its body is the middle 14×14, feet on the bottom row. */
  private freshPlayer(): Player {
    return {
      x: 2 * T, y: FLOOR * T - 18, vx: 0, vy: 0, ox: 3, oy: 4, w: 14, h: 14, ground: false,
      face: 1, walk: 0, hops: 0, wings: GLIDE, gliding: false, nested: false, dash: 0, dashed: false, sprung: false,
    };
  }

  /** Rebuilds the level from the map: blocks come back, critters respawn, and once the checkpoint is passed you start from it. */
  private load() {
    const level = LEVELS[this.level];
    this.map = level.map.map((row) => [...row]);
    this.cols = this.map[0].length;
    this.enemies = [];
    this.hearts = [];
    this.pops = [];
    this.labels = [];
    this.bumps = [];
    this.puffs = [];
    this.springs = [];
    this.crumbles = [];
    this.chips = [];
    this.map.forEach((row, r) =>
      row.forEach((ch, c) => {
        if (ch === "c") {
          this.enemies.push({ kind: "calango", x: c * T, y: r * T + 8, vx: -0.4, vy: 0, ox: 1, oy: 1, w: 14, h: 7, ground: false, baseY: 0, t: 0, dead: 0, awake: false });
          row[c] = ".";
        } else if (ch === "k") {
          this.enemies.push({ kind: "carcara", x: c * T, y: r * T, vx: -0.45, vy: 0, ox: 2, oy: 4, w: 12, h: 6, ground: false, baseY: r * T, t: 0, dead: 0, awake: false });
          row[c] = ".";
        } else if (ch === "s") {
          this.enemies.push({ kind: "sapo", x: c * T, y: r * T + 6, vx: 0, vy: 0, ox: 1, oy: 3, w: 14, h: 7, ground: false, baseY: 0, t: 0, dead: 0, awake: false });
          row[c] = ".";
        } else if (ch === "F") this.pole = { c, top: r };
        else if (ch === "P") this.post = { c, r };
        else if (ch === "n") {
          this.nest = { x: c * T, y: (r + 1) * T - NEST.length };
          row[c] = ".";
        }
      }),
    );
    this.p = this.freshPlayer();
    this.cam = 0;
    this.camY = DEPTH - VH;
    if (this.saved) {
      this.p.x = this.post.c * T - 2;
      this.p.y = (this.post.r + 1) * T - 18;
      this.cam = Math.max(0, Math.min(this.cols * T - VW, this.p.x - VW * 0.4));
      this.camY = Math.max(-VH, Math.min(DEPTH - VH, this.p.y - VH / 2));
    }
    this.time = TIME;
    this.flagY = this.pole.top * T + 8;
  }

  private go(state: State) {
    this.state = state;
    this.t = 0;
    this.hooks.scene?.(state);
  }

  private newGame() {
    this.lives = 3;
    this.score = 0;
    this.coins = 0;
    this.entry = { score: 0, coins: 0 };
    this.saved = false;
    this.level = 0;
    this.load();
    this.go("intro");
  }

  private add(points: number) {
    this.score = Math.min(999999, this.score + points);
  }

  private saveTop() {
    if (this.score > this.top) {
      this.top = this.score;
      this.hooks.onTop(this.top);
    }
  }

  // ---------------------------------------------------------------- tiles and collision

  private tile(c: number, r: number) {
    if (r < 0 || r >= ROWS) return ".";
    if (c < 0 || c >= this.cols) return "#";
    return this.map[r][c];
  }

  private tileAt(x: number, y: number) {
    return this.tile(Math.floor(x / T), Math.floor(y / T));
  }

  private solidAt(x: number, y: number) {
    const c = Math.floor(x / T);
    if (c < 0 || c >= this.cols) return true;
    return SOLID.has(this.tile(c, Math.floor(y / T)));
  }

  /** Moves along x and stops at walls. Returns true when it hit one. */
  private moveX(b: Body) {
    b.x += b.vx;
    const top = b.y + b.oy;
    const bot = top + b.h - 0.01;
    if (b.vx > 0) {
      const edge = b.x + b.ox + b.w;
      if (this.solidAt(edge, top) || this.solidAt(edge, bot)) {
        b.x = Math.floor(edge / T) * T - b.ox - b.w;
        return true;
      }
    } else if (b.vx < 0) {
      const edge = b.x + b.ox;
      if (this.solidAt(edge, top) || this.solidAt(edge, bot)) {
        b.x = (Math.floor(edge / T) + 1) * T - b.ox;
        return true;
      }
    }
    return false;
  }

  /**
    Moves along y. Returns the block bonked from below, if any. A branch only holds what
    comes down onto it from above, and lets go when `drop` (holding down).
  */
  private moveY(b: Body, drop = false): { c: number; r: number } | undefined {
    b.y += b.vy;
    b.ground = false;
    const l = b.x + b.ox;
    const r = l + b.w - 0.01;
    if (b.vy > 0) {
      const edge = b.y + b.oy + b.h;
      const branch = (x: number) => !drop && this.tileAt(x, edge) === "-" && edge - b.vy <= Math.floor(edge / T) * T + 0.01;
      if (this.solidAt(l, edge) || this.solidAt(r, edge) || branch(l) || branch(r)) {
        b.y = Math.floor(edge / T) * T - b.oy - b.h;
        b.vy = 0;
        b.ground = true;
      }
    } else if (b.vy < 0) {
      const edge = b.y + b.oy;
      if (this.solidAt(l, edge) || this.solidAt(r, edge)) {
        const row = Math.floor(edge / T);
        b.y = (row + 1) * T - b.oy;
        b.vy = 0;
        // the block under the middle of the head wins, like it should
        const mid = (l + r) / 2;
        const c = this.solidAt(mid, edge) ? Math.floor(mid / T) : this.solidAt(l, edge) ? Math.floor(l / T) : Math.floor(r / T);
        return { c, r: row };
      }
    }
  }

  private overlap(a: Body, b: Body) {
    return a.x + a.ox < b.x + b.ox + b.w && a.x + a.ox + a.w > b.x + b.ox && a.y + a.oy < b.y + b.oy + b.h && a.y + a.oy + a.h > b.y + b.oy;
  }

  private follow() {
    const p = this.p;
    // a dead zone in the middle of the screen, so a step back and forth doesn't sway the view
    let cam = this.cam;
    if (p.x - cam > VW * 0.55) cam = p.x - VW * 0.55;
    else if (p.x - cam < VW * 0.3) cam = p.x - VW * 0.3;
    this.cam = Math.max(0, Math.min(this.cols * T - VW, cam));
    // vertical: a hop doesn't move the screen; it follows once you near the top or bottom
    // edge, and settles so the ground you stand on sits low in the view
    const at = p.y - this.camY;
    let target = this.camY;
    const near = VH * 0.22;
    if (p.ground) target = p.y - VH / 2;
    else if (at < near) target = p.y - near;
    else if (at > VH * 0.72) target = p.y - VH * 0.72;
    // it may rise into the open sky above the map, so the HUD never sits on top of the bird
    target = Math.max(-VH, Math.min(DEPTH - VH, target));
    // catch up fast when the bird climbs toward the HUD, gently otherwise
    this.camY += (target - this.camY) * (at < near ? 0.5 : p.ground ? 0.08 : 0.2);
  }

  // ---------------------------------------------------------------- update

  private step() {
    this.frame++;
    this.t++;
    const hit = (b: Button) => this.pressed.has(b);

    switch (this.state) {
      case "boot":
        if (this.t === 96) this.hooks.sound("boot");
        if (this.t > 170 || (this.t > 20 && (hit("start") || hit("a")))) this.go("title");
        break;
      case "title":
        if (hit("start") || hit("a")) {
          this.hooks.sound("pause");
          this.newGame();
        }
        break;
      case "intro":
        if (this.t > 110) {
          this.go("play");
          this.hooks.music(true);
        }
        break;
      case "play":
        if (hit("start")) {
          this.paused = !this.paused;
          this.hooks.sound("pause");
          this.hooks.music(!this.paused);
        }
        if (!this.paused) this.play();
        break;
      case "dying":
        if (this.t === 30) this.p.vy = -4;
        if (this.t > 30) {
          this.p.vy = Math.min(4, this.p.vy + 0.2);
          this.p.y += this.p.vy;
        }
        if (this.t > 170) {
          this.lives--;
          if (this.lives <= 0) {
            this.saveTop();
            this.go("gameover");
          } else {
            // what you picked up on the failed try goes back into the level with the coins
            this.score = this.entry.score;
            this.coins = this.entry.coins;
            this.load();
            this.go("intro");
          }
        }
        break;
      case "clear":
        this.clearing();
        break;
      case "gameover":
        if (this.t > 240 || (this.t > 60 && (hit("start") || hit("a")))) this.go("title");
        break;
    }

    this.labels = this.labels.filter((l) => ++l.t < 40);
    this.puffs = this.puffs.filter((f) => ++f.t < 16);
    for (const k of this.chips) {
      k.vy += 0.25;
      k.x += k.vx;
      k.y += k.vy;
    }
    this.chips = this.chips.filter((k) => ++k.t < 50);
    this.pressed.clear();
  }

  private play() {
    const p = this.p;
    const dir = (this.held.has("right") ? 1 : 0) - (this.held.has("left") ? 1 : 0);
    const max = this.held.has("b") ? RUN : WALK;

    // B in the air: one straight burst per flight, wings swept back, no falling while it lasts
    if (this.pressed.has("b") && !p.ground && !p.dashed) {
      if (dir) p.face = dir as 1 | -1;
      p.dash = DASH_TIME;
      p.dashed = true;
      this.puffs.push({ x: p.x + 4, y: p.y + 8, t: 0 });
      this.hooks.sound("dash");
    }

    if (p.dash) {
      p.vx = p.face * DASH;
    } else if (dir) {
      const skid = Math.sign(p.vx) === -dir;
      // speed up only up to the cap, never past it
      if (skid) p.vx += dir * 0.15;
      else if (Math.abs(p.vx) < max) p.vx = dir * Math.min(max, Math.abs(p.vx) + 0.07);
      p.face = dir as 1 | -1;
    } else {
      const drag = p.ground ? 0.07 : 0.02;
      p.vx = Math.abs(p.vx) <= drag ? 0 : p.vx - Math.sign(p.vx) * drag;
    }
    // over the cap (let go of B mid-run, or the end of a dash): ease back down to walking speed
    if (!p.dash && Math.abs(p.vx) > max) p.vx = Math.sign(p.vx) * Math.max(max, Math.abs(p.vx) - 0.05);

    // A: hop from the ground, hop once more in the air
    const jumped = this.pressed.has("a") && p.hops < 2;
    if (jumped) {
      p.dash = 0;
      if (p.ground || p.hops === 0) {
        p.vy = -HOP - Math.abs(p.vx) * 0.15;
        p.hops = p.ground ? 1 : 2;
        this.hooks.sound("jump");
      } else {
        p.vy = -HOP_AGAIN;
        p.hops = 2;
        this.puffs.push({ x: p.x + 4, y: p.y + 14, t: 0 });
        this.hooks.sound("jump2");
      }
    }

    // holding A on the way down spreads the wings: a slow glide until they tire
    const wind = this.tileAt(p.x + 10, p.y + 10) === "w";
    p.gliding = !p.dash && !p.ground && !jumped && this.held.has("a") && p.vy >= 0 && p.wings > 0;
    if (p.dash) {
      p.dash--;
      p.vy = 0;
    } else if (wind && this.held.has("a") && !p.ground) {
      // an updraft catches open wings, carries you up and lets them rest
      p.vy = Math.max(-LIFT, p.vy - 0.3);
      p.wings = GLIDE;
      p.gliding = true;
    } else if (p.gliding) {
      p.wings--;
      p.vy = Math.min(GLIDE_FALL, p.vy + 0.12);
    } else {
      if (p.vy >= 0) p.sprung = false;
      p.vy = Math.min(4, p.vy + (p.vy < 0 && (p.sprung || this.held.has("a")) ? 0.14 : 0.45));
    }
    if (p.gliding && this.frame % 8 === 0) this.hooks.sound("flap");

    // a dash into cracked rock breaks through and keeps going; anything else stops it
    if (this.moveX(p) && !(p.dash && this.smash(p))) {
      p.vx = 0;
      p.dash = 0;
    }
    const bonk = this.moveY(p, this.held.has("down"));
    if (bonk) this.bonk(bonk.c, bonk.r);
    if (p.ground) {
      p.hops = 0;
      p.wings = GLIDE;
      p.dashed = false;
      this.underfoot();
    }
    this.updateCrumbles();
    p.walk = p.ground && p.vx ? p.walk + Math.abs(p.vx) : 0;

    this.follow();
    this.collect();
    if (this.touchesThorns()) return this.die();
    this.updateEnemies();
    if (this.state !== "play") return;
    this.updateHearts();
    this.pops = this.pops.filter((c) => ++c.t < 26);
    this.bumps = this.bumps.filter((b) => ++b.t < BOUNCE.length);

    if (this.frame % TIME_TICK === 0 && --this.time <= 0) {
      this.labels.push({ x: this.cam + VW / 2 - 40, y: this.camY + VH / 3, t: -60, text: this.hooks.words().timeUp });
      return this.die();
    }
    if (p.y > DEPTH) return this.die();

    // passing the checkpoint: a lost life starts again from here, with what you carry now
    if (!this.saved && this.post.c >= 0 && p.x + p.ox + p.w >= this.post.c * T + 4) {
      this.saved = true;
      this.entry = { score: this.score, coins: this.coins };
      this.hooks.sound("check");
    }

    // reaching the flagpole
    if (p.x + p.ox + p.w >= this.pole.c * T + 7) {
      this.go("clear");
      this.clearPhase = "slide";
      p.x = this.pole.c * T + 7 - p.ox - p.w;
      p.vx = 0;
      p.dash = 0;
      p.face = 1;
      this.add(Math.max(100, (FLOOR - Math.floor((p.y + 10) / T)) * 400));
      this.hooks.music(false);
      this.hooks.sound("clear");
    }
  }

  /** How far the spikes in column `c` stand out of their plate right now, 0 to 12 pixels. */
  private spikeHeight(c: number) {
    const t = (((this.frame - c * SPIKE_WAVE) % SPIKE_CYCLE) + SPIKE_CYCLE) % SPIKE_CYCLE;
    if (t < 24) return t % 8 < 4 ? 2 : 0; // the warning: the tips twitch in the plate
    if (t < 30) return (t - 24) * 2;
    if (t < 70) return 12;
    if (t < 76) return 12 - (t - 70) * 2;
    return 0;
  }

  /** Spikes only hurt while they are out; flush with the plate you can walk over them. */
  private touchesThorns() {
    const p = this.p;
    const l = p.x + p.ox + 2;
    const r = l + p.w - 4;
    const feet = p.y + p.oy + p.h;
    for (const x of [l, r]) {
      const c = Math.floor(x / T);
      const row = Math.floor((feet - 1) / T);
      const h = this.tile(c, row) === "x" ? this.spikeHeight(c) : 0;
      if (h >= 4 && feet > row * T + 14 - h + 2) return true;
    }
    return false;
  }

  /** What the feet just landed on: a spring throws you up, sandstone starts to give. */
  private underfoot() {
    const p = this.p;
    const row = Math.floor((p.y + p.oy + p.h) / T);
    const cols = new Set([Math.floor((p.x + p.ox) / T), Math.floor((p.x + p.ox + p.w - 0.01) / T)]);
    for (const c of cols) {
      const ch = this.tile(c, row);
      if (ch === "^") {
        p.vy = -SPRING_UP;
        p.sprung = true;
        p.ground = false;
        // the spring counts as the first hop, so the second one is still there at the top
        p.hops = 1;
        this.springs = this.springs.filter((s) => s.c !== c || s.r !== row);
        this.springs.push({ c, r: row, t: 0 });
        this.hooks.sound("spring");
        return;
      }
      if (ch === "~" && !this.crumbles.some((k) => k.c === c && k.r === row)) this.crumbles.push({ c, r: row, t: 0 });
    }
  }

  private updateCrumbles() {
    this.springs = this.springs.filter((s) => ++s.t < 8);
    for (const k of this.crumbles) {
      k.t++;
      if (k.t === CRUMBLE) {
        this.map[k.r][k.c] = ".";
        this.shatter(k.c, k.r);
        this.hooks.sound("bump");
      }
    }
    // it grows back once nobody is standing where it was
    const p = this.p;
    this.crumbles = this.crumbles.filter((k) => {
      if (k.t < REGROW) return true;
      const inside = p.x + p.ox < (k.c + 1) * T && p.x + p.ox + p.w > k.c * T && p.y + p.oy < (k.r + 1) * T && p.y + p.oy + p.h > k.r * T;
      if (inside) return true;
      this.map[k.r][k.c] = "~";
      return false;
    });
  }

  /** Breaks the cracked rock the dash ran into. Returns true when there was any. */
  private smash(p: Player) {
    const x = p.face === 1 ? p.x + p.ox + p.w : p.x + p.ox - 1;
    const c = Math.floor(x / T);
    let broke = false;
    for (let r = Math.floor((p.y + p.oy) / T); r <= Math.floor((p.y + p.oy + p.h - 0.01) / T); r++) {
      if (this.tile(c, r) !== "D") continue;
      this.map[r][c] = ".";
      this.shatter(c, r);
      this.add(50);
      broke = true;
    }
    if (broke) this.hooks.sound("smash");
    return broke;
  }

  /** Four bits of the block fly off its corners. */
  private shatter(c: number, r: number) {
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 0], [1, 0]])
      this.chips.push({ x: c * T + 6 + dx * 4, y: r * T + 6 + dy * 4, vx: dx * (0.8 + Math.random() * 0.6), vy: -2.5 + dy - Math.random(), t: 0 });
  }

  private bonk(c: number, r: number) {
    const ch = this.tile(c, r);
    if (ch === "?") {
      this.map[r][c] = "U";
      this.pops.push({ x: c * T + 4, y: r * T - 8, t: 0 });
      this.coin(200, c * T, r * T - 16);
    } else if (ch === "!") {
      this.map[r][c] = "U";
      this.hearts.push({ x: c * T + 4, y: r * T + 4, vx: 0.7, vy: 0, ox: 0, oy: 0, w: 8, h: 8, ground: false, rise: 24 });
      this.hooks.sound("bump");
    } else this.hooks.sound("bump");
    if (ch === "?" || ch === "!" || ch === "B") {
      this.bumps.push({ c, r, t: 0 });
      // a critter standing on a bumped block gets knocked off
      for (const e of this.enemies)
        if (!e.dead && Math.abs(e.x + 8 - (c * T + 8)) < 14 && Math.abs(e.y + e.oy + e.h - r * T) < 3) this.kill(e, 100);
    }
  }

  private coin(points: number, x: number, y: number) {
    this.coins++;
    this.add(points);
    this.hooks.sound("coin");
    this.labels.push({ x, y, t: 0, text: String(points) });
    if (this.coins >= 100) {
      this.coins = 0;
      this.oneUp(x, y);
    }
  }

  private oneUp(x: number, y: number) {
    this.lives = Math.min(99, this.lives + 1);
    this.hooks.sound("oneUp");
    this.labels.push({ x, y, t: 0, text: "1UP" });
  }

  /** Picks up floating coins the body overlaps. */
  private collect() {
    const p = this.p;
    const l = p.x + p.ox;
    const t = p.y + p.oy;
    for (let c = Math.floor(l / T); c <= Math.floor((l + p.w) / T); c++)
      for (let r = Math.floor(t / T); r <= Math.floor((t + p.h) / T); r++) {
        if (this.tile(c, r) !== "o") continue;
        // the coin is the middle 8×8 of the cell
        const cx = c * T + 4;
        const cy = r * T + 4;
        if (l < cx + 8 && l + p.w > cx && t < cy + 8 && t + p.h > cy) {
          this.map[r][c] = ".";
          this.coin(100, c * T, r * T);
        }
      }
  }

  private kill(e: Enemy, points: number) {
    e.dead = 1;
    e.vy = -2;
    this.add(points);
    this.labels.push({ x: e.x, y: e.y - 8, t: 0, text: String(points) });
    this.hooks.sound("stomp");
  }

  private updateEnemies() {
    const p = this.p;
    for (const e of this.enemies) {
      if (!e.awake) {
        if (e.x < this.cam + VW + 8) e.awake = true;
        else continue;
      }
      e.t++;
      if (e.dead) {
        e.dead++;
        // a squashed calango stays flat for a moment; anything else tumbles off screen
        if (!(e.kind === "calango" && e.vy === 0)) {
          e.vy += 0.25;
          e.y += e.vy;
        }
        continue;
      }
      if (e.kind === "calango") {
        e.vy = Math.min(4, e.vy + 0.3);
        if (this.moveX(e)) e.vx = -e.vx;
        this.moveY(e);
      } else if (e.kind === "sapo") {
        // sits a while, then leaps toward the bird
        e.vy = Math.min(4, e.vy + 0.25);
        if (e.ground) e.vx = 0;
        if (e.ground && e.t % 100 === 60) {
          e.vx = p.x < e.x ? -1.1 : 1.1;
          e.vy = -4;
        }
        if (this.moveX(e)) e.vx = 0;
        this.moveY(e);
      } else {
        e.x += e.vx;
        e.y = e.baseY + Math.sin(e.t * 0.06) * 10;
      }

      if (!this.overlap(p, e)) continue;
      const feet = p.y + p.oy + p.h;
      if (p.vy > 0 && feet - (e.y + e.oy) < 8) {
        // a stomp bounces you back up and gives the wings back their second hop
        p.vy = this.held.has("a") ? -4 : -2.6;
        p.hops = 1;
        p.wings = GLIDE;
        p.dash = 0;
        p.dashed = false;
        p.sprung = false;
        if (e.kind === "calango") {
          e.dead = 1;
          e.vy = 0;
          this.add(100);
          this.labels.push({ x: e.x, y: e.y - 8, t: 0, text: "100" });
          this.hooks.sound("stomp");
        } else this.kill(e, 200);
      } else return this.die();
    }
    // critters you leave behind stay where they are, for when you come back
    this.enemies = this.enemies.filter((e) => e.y < DEPTH + 16 && e.x > -32 && !(e.kind === "calango" && e.vy === 0 && e.dead > 30));
  }

  private updateHearts() {
    for (const h of this.hearts) {
      if (h.rise > 0) {
        h.rise--;
        h.y -= 0.5;
        continue;
      }
      h.vy = Math.min(4, h.vy + 0.3);
      if (this.moveX(h)) h.vx = -h.vx;
      this.moveY(h);
      if (this.overlap(this.p, h)) {
        this.oneUp(h.x, h.y - 8);
        h.y = DEPTH + 99;
      }
    }
    this.hearts = this.hearts.filter((h) => h.y < DEPTH + 16);
  }

  private die() {
    this.go("dying");
    this.p.vx = 0;
    this.p.vy = 0;
    this.p.gliding = false;
    this.p.dash = 0;
    this.hooks.music(false);
    this.hooks.sound("die");
  }

  private clearing() {
    const p = this.p;
    switch (this.clearPhase) {
      case "slide":
        p.vy = 1.5;
        this.moveY(p);
        this.flagY = Math.min(p.y + 2, this.flagY + 1.5);
        this.follow();
        if (p.ground && this.t > 40) this.clearPhase = "walk";
        break;
      case "walk":
        // hop along to the nest and settle in
        p.vx = 0.8;
        p.vy = Math.min(4, p.vy + 0.45);
        this.moveX(p);
        this.moveY(p);
        p.walk += p.ground ? 0.8 : 0;
        this.follow();
        if (p.x + 10 >= this.nest.x + 16) {
          p.nested = true;
          p.x = this.nest.x + 6;
          p.y = this.nest.y - 7;
          this.clearPhase = "tally";
          this.t = 0;
        }
        break;
      case "tally":
        if (this.t % 2 === 0 && this.time > 0) {
          this.time = Math.max(0, this.time - 2);
          this.add(100);
          if (this.t % 6 === 0) this.hooks.sound("tick");
        }
        if (this.time === 0 && this.t > 30) {
          this.saveTop();
          this.clearPhase = "done";
          this.t = 0;
        }
        break;
      case "done":
        if (this.t > 330 || (this.t > 60 && (this.pressed.has("start") || this.pressed.has("a")))) {
          if (this.level + 1 < LEVELS.length) {
            // on to the next level with everything you carry; a fall there starts it over
            this.level++;
            this.saved = false;
            this.entry = { score: this.score, coins: this.coins };
            this.load();
            this.go("intro");
          } else this.go("title");
        }
        break;
    }
  }

  // ---------------------------------------------------------------- draw

  private glyph(ch: string, shade: number) {
    const key = ch + shade;
    let c = this.glyphs.get(key);
    if (!c) {
      const rows = FONT[ch] ?? FONT["?"];
      c = bake(rows.map((r) => r.replaceAll("#", String(shade))), false, this.look.ui);
      this.glyphs.set(key, c);
    }
    return c;
  }

  /** Writes on the 4px grid. Letters are upper-cased unless `raw` (the ASCII art needs its "o"). */
  private text(s: string, x: number, y: number, shade = 3, size = 1, raw = false) {
    let cx = x;
    for (const ch of raw ? s : s.toUpperCase()) {
      if (ch !== " ") this.g.drawImage(this.glyph(ch, shade), cx, y, 3 * size, 5 * size);
      cx += 4 * size;
    }
  }

  private centered(s: string, y: number, shade = 3, size = 1) {
    // the last letter's 1px gap doesn't count
    this.text(s, Math.round((W - (s.length * 4 - 1) * size) / 2), y, shade, size);
  }

  private box(x: number, y: number, w: number, h: number) {
    const g = this.g;
    g.fillStyle = this.look.ui[3];
    g.fillRect(x, y, w, h);
    g.fillStyle = this.look.ui[0];
    g.fillRect(x + 2, y + 2, w - 4, h - 4);
  }

  private draw() {
    const g = this.g;
    // menus, HUD and words are laid out on the 160×144 grid; drawWorld steps out of it
    g.setTransform(ZOOM, 0, 0, ZOOM, 0, 0);
    g.fillStyle = this.state === "play" || this.state === "dying" || this.state === "clear" ? this.look.sky : this.look.ui[0];
    g.fillRect(0, 0, W, H);
    const w = this.hooks.words();

    switch (this.state) {
      case "boot": {
        // the logo slides down from the top and lands with a ding
        const y = this.hooks.quick ? 62 : Math.min(62, -12 + this.t * 0.8);
        this.centered("CHAPADA", y, 3, 2);
        if (this.t > 96) this.centered("ADVENTURES", y + 14, 2);
        break;
      }
      case "title":
        this.drawTitle();
        break;
      case "intro":
        this.drawIntro();
        break;
      case "gameover":
        this.drawHud();
        this.centered(w.over, 66, 3, 2);
        break;
      default:
        this.drawWorld();
        this.drawHud();
        if (this.paused) {
          this.box(56, 62, 48, 17);
          this.centered(w.pause, 68);
        }
        if (this.state === "clear" && this.clearPhase === "done") {
          this.box(10, 46, 140, 40);
          this.centered(w.clear, 54, 3, 2);
          this.centered(w.thanks, 72);
        }
    }

    // the colour coming in: a white flash that fades as the screen wakes up
    if (this.bloom >= 0) {
      const a = 1 - (this.frame - this.bloom) / 24;
      if (a > 0) {
        g.globalAlpha = a;
        g.fillStyle = "#ffffff";
        g.fillRect(0, 0, W, H);
        g.globalAlpha = 1;
      } else this.bloom = -1;
    }

    this.present();
  }

  /**
    Copies the frame onto the glass the way an old reflective LCD shows it: the new image
    only partly replaces the last one, so anything that moves leaves a soft trail.
  */
  private present() {
    const s = this.screen;
    // the colour screen smears less, or the trail muddies the colours
    s.globalAlpha = this.started ? (this.img === this.mono ? 0.55 : 0.75) : 1;
    s.drawImage(this.buffer, 0, 0);
    s.globalAlpha = 1;
    this.started = true;
  }

  /**
    The title: the ASCII soldadinho is laid over the glass by the console (see hooks.scene),
    so the canvas only writes the name in the empty sky and the prompt under the branch.
  */
  private drawTitle() {
    const w = this.hooks.words();
    this.text("CHAPADA", 4, 8, 3, 2);
    this.text("ADVENTURES", 19, 22, 2);
    if (Math.floor(this.t / 30) % 2 === 0) this.text(w.start, 108 - Math.round((w.start.length * 4) / 2), 120);
    this.text(`${w.top} ${String(this.top).padStart(6, "0")}`, 108 - Math.round(((w.top.length + 7) * 4) / 2), 132, 2);
  }

  private drawIntro() {
    this.drawHud();
    this.centered(`WORLD ${LEVELS[this.level].name}`, 52, 3, 2);
    this.g.drawImage(this.img.bird.stand[0], 58, 70);
    this.text(`*${this.lives}`, 84, 79);
  }

  /** Two lines, like the old pocket platformers: who and how many, score and coins, world, time. */
  private drawHud() {
    const g = this.g;
    g.fillStyle = this.look.ui[0];
    g.fillRect(0, 0, W, HUD);
    this.text(`SOLDADINHO*${String(Math.max(0, this.lives)).padStart(2, "0")}`, 4, 2);
    this.text("WORLD", 92, 2);
    this.text("TIME", 136, 2);
    this.text(String(this.score).padStart(6, "0"), 4, 9);
    g.drawImage(this.img.coinMini, 36, 9);
    this.text(`*${String(this.coins).padStart(2, "0")}`, 42, 9);
    this.text(LEVELS[this.level].name, 96, 9);
    this.text(String(Math.max(0, this.time)).padStart(3, "0"), 138, 9);
  }

  private drawWorld() {
    const g = this.g;
    const cam = Math.floor(this.cam);
    const camY = Math.round(this.camY);
    // the world is drawn one to one on the canvas, below the HUD
    const top = TOP;
    g.setTransform(1, 0, 0, 1, 0, 0);
    const sx = (x: number) => Math.round(x) - cam;
    const sy = (y: number) => top + Math.round(y) - camY;
    // how far the view sits above the valley floor, for the background to drift with it
    const rise = DEPTH - VH - camY;

    // far away: clouds across the upper sky, then the chapada on the horizon
    for (let i = 0; i < 14; i++) {
      const x = ((((i * 113 - this.cam * 0.2) % (14 * 56)) + 14 * 56) % (14 * 56)) - 28;
      if (x < VW) g.drawImage(this.img.cloud, Math.round(x), top + 6 + ((i * 37) % Math.round(VH * 0.45)) + Math.round(rise * 0.2));
    }
    const mx = -Math.round((this.cam * 0.4) % 256);
    const my = top + VH - 32 - 48 + Math.round(rise * 0.4);
    for (let x = mx; x < VW; x += 256) g.drawImage(this.img[LEVELS[this.level].far], x, my);

    // blocks, and a little past the view so a palm standing just off screen still shows its crown
    const first = Math.floor(cam / T);
    const firstRow = Math.max(0, Math.floor(camY / T));
    for (let c = first - 1; c <= first + VW / T + 1; c++)
      for (let r = firstRow; r <= Math.min(ROWS - 1, firstRow + VH / T + 3); r++) {
        const ch = this.tile(c, r);
        if (ch === ".") continue;
        if (ch === "w") {
          this.drawWind(c, r, cam, camY - top);
          continue;
        }
        const bump = this.bumps.find((b) => b.c === c && b.r === r);
        // sandstone shakes in its last moments before it goes
        const k = ch === "~" ? this.crumbles.find((b) => b.c === c && b.r === r) : undefined;
        const x = c * T - cam + (k && k.t > CRUMBLE / 2 ? (this.frame % 4 < 2 ? 1 : -1) : 0);
        const y = sy(r * T) - (bump ? BOUNCE[bump.t] : 0);
        const img = this.tileImage(ch, c, r);
        // the palm is 32×48, its trunk on the cell it stands on
        if (ch === "t") g.drawImage(img!, x - 8, y + T - img!.height);
        else if (img) g.drawImage(img, ch === "o" ? x + 4 : x, ch === "o" ? y + 4 : y);
      }

    g.drawImage(this.img.flag, sx(this.pole.c * T - 6), sy(this.flagY));

    // coins popping out of blocks
    for (const c of this.pops) g.drawImage(this.img.coin[Math.floor(c.t / 3) % 3], sx(c.x), sy(c.y - Math.sin((c.t / 26) * Math.PI) * 20));
    for (const h of this.hearts) g.drawImage(this.img.heart, sx(h.x), sy(h.y));

    for (const e of this.enemies) {
      if (!e.awake) continue;
      const x = sx(e.x);
      const y = sy(e.y);
      if (e.kind === "calango") {
        if (e.dead && e.vy === 0) g.drawImage(this.img.calangoFlat, x, y);
        else if (e.dead) g.drawImage(this.img.calango[0][0], x, y);
        else g.drawImage(this.img.calango[Math.floor(e.t / 8) % 2][e.vx > 0 ? 1 : 0], x, y);
      } else if (e.kind === "sapo") {
        const face = e.vx > 0 || (!e.vx && this.p.x > e.x) ? 1 : 0;
        g.drawImage(e.dead ? this.img.sapoDown : this.img.sapo[e.ground ? 0 : 1][face], x, y);
      } else {
        g.drawImage(e.dead ? this.img.carcaraDown : this.img.carcara[Math.floor(e.t / 10) % 2], x, y);
      }
    }

    // bits of broken rock
    g.fillStyle = this.look.chip;
    for (const k of this.chips) g.fillRect(sx(k.x), sy(k.y), 3, 3);

    // the little cloud of dust the second hop kicks off
    g.fillStyle = this.look.puff;
    for (const f of this.puffs) {
      const d = Math.floor(f.t / 3);
      for (const dx of [-d - 2, d + 8]) g.fillRect(sx(f.x + dx), sy(f.y + 2 - d / 2), 2, 2);
    }

    // the nest goes over the bird once it settles, so it sits down in it
    if (!this.p.nested) g.drawImage(this.img.nest, sx(this.nest.x), sy(this.nest.y));
    this.drawPlayer(sx, sy);
    if (this.p.nested) g.drawImage(this.img.nest, sx(this.nest.x), sy(this.nest.y));

    // points are written twice as big as the world, so they still read from this far back
    for (const l of this.labels) this.text(l.text, sx(l.x), sy(l.y - Math.max(0, l.t) * 0.5), 3, 2);
    g.setTransform(ZOOM, 0, 0, ZOOM, 0, 0);
  }

  /** Updrafts: short streaks rising through the column. */
  private drawWind(c: number, r: number, cam: number, camY: number) {
    const g = this.g;
    for (let i = 0; i < 3; i++) {
      g.fillStyle = this.look.wind[i === 0 ? 0 : 1];
      const x = c * T + ((c * 7 + i * 5 + r * 3) % 14) + 1 - cam;
      const y = r * T + 15 - ((this.frame * 2 + i * 6 + c * 5 + r * 3) % 16);
      g.fillRect(x, y - camY, 1, 6);
    }
  }

  private tileImage(ch: string, c: number, r: number) {
    const i = this.img;
    switch (ch) {
      case "#":
        return this.tile(c, r - 1) === "#" ? i.dirt : i.ground;
      case "B":
        return i.brick;
      case "?":
      case "!":
        return i.question[Math.floor(this.frame / 20) % 3 === 2 ? 1 : 0];
      case "U":
        return i.used;
      case "H":
        return i.hard;
      case "[":
        return i.capL;
      case "]":
        return i.capR;
      case "{":
        return i.bodyL;
      case "}":
        return i.bodyR;
      case "o":
        return i.coin[[0, 1, 2, 1][Math.floor(this.frame / 8) % 4]];
      case "m":
        return i.cactus;
      case "f":
        return i.fern;
      case "t":
        return i.tree;
      case "x":
        return i.spikes[this.spikeHeight(c) / 2];
      case "|":
        return i.pole;
      case "F":
        return i.poleTop;
      case "^":
        return i.spring[this.springs.some((s) => s.c === c && s.r === r) ? 1 : 0];
      case "-":
        return i.branch;
      case "~":
        return i.sand;
      case "D":
        return i.cracked;
      case "P":
        return i.post[this.saved ? 1 : 0];
    }
  }

  private drawPlayer(sx: (x: number) => number, sy: (y: number) => number) {
    const p = this.p;
    const b = this.img.bird;
    let frame: HTMLCanvasElement[];
    if (this.state === "dying") frame = b.dead;
    else if (p.nested) frame = b.stand;
    else if (p.dash) frame = b.dash;
    else if (p.gliding) frame = Math.floor(this.frame / 5) % 2 ? b.glideUp : b.glideDown;
    else if (!p.ground) frame = b.jump;
    else if (p.vx) frame = Math.floor(p.walk / 6) % 2 ? b.walk : b.stand;
    else frame = b.stand;
    this.g.drawImage(frame[p.face === 1 ? 0 : 1], sx(p.x), sy(p.y));
  }
}

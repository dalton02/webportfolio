/*
  Overworld art for the background: small ground details, bigger props for the
  side margins, and one terrain "zone" per room so the field changes as you
  scroll down. Same char map idea as ./sprites, but drawn on a canvas.
*/

export type Art = { frames: string[][]; w: number; h: number };

export const WPAL: Record<string, string> = {
  o: "#181018", // outline
  k: "#184818",
  d: "#307830",
  m: "#58a840",
  l: "#88d058",
  w: "#f8f8f8",
  y: "#f8d040",
  r: "#f85858",
  R: "#c81818",
  p: "#f8b8d0",
  u: "#58a8f8",
  n: "#f8f0d0",
  s: "#a8a8a0",
  S: "#d0d0c8",
  t: "#787870",
  h: "#e0b070",
  b: "#b07848",
  B: "#704828",
  a: "#4890e0",
  A: "#2858a8",
  c: "#a8d8f8",
};

/** Stable per-position random, so the field doesn't reshuffle as you scroll. */
export function hash(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function art(...frames: string[][]): Art {
  const h = frames[0].length;
  const w = frames[0][0].length;
  if (import.meta.env?.DEV) {
    for (const f of frames)
      for (const [i, row] of f.entries())
        if (row.length !== w || f.length !== h) console.warn(`world art row ${i} is ${row.length} wide, expected ${w}`, f);
  }
  return { frames, w, h };
}

/** A grid of chars, filled by a callback; handy for round shapes that are tedious to type. */
function grid(w: number, h: number, fn: (x: number, y: number) => string) {
  return Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => fn(x, y)).join(""));
}

/** Round foliage from overlapping circles: outlined, lit from the top-left, leafy speckles. */
function foliage(w: number, h: number, circles: [number, number, number][], seed: number) {
  const inside = (x: number, y: number) =>
    circles.some(([cx, cy, r]) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r);
  return grid(w, h, (x, y) => {
    if (!inside(x, y)) {
      return inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1) ? "o" : ".";
    }
    if (!inside(x, y + 1)) return "k";
    if (!inside(x + 1, y + 2) || !inside(x + 2, y + 1)) return "d";
    if (!inside(x - 1, y - 2) || !inside(x - 2, y - 1)) return "l";
    const r = hash(x + seed, y + seed * 3);
    // small "C" leaf marks: a dark pixel with a light one above it
    if (r < 0.1) return "d";
    if (hash(x + seed, y + 1 + seed * 3) < 0.1) return "l";
    return "m";
  });
}

/**
  A flat contact shadow under a prop: two extra rows with a squashed oval, nudged right,
  since the light comes from the top left. Only fills empty pixels, so the art stays on top.
*/
function grounded(rows: string[]) {
  const w = rows[0].length;
  let lo = w;
  let hi = -1;
  for (const row of rows)
    for (let x = 0; x < w; x++)
      if (row[x] !== ".") {
        lo = Math.min(lo, x);
        hi = Math.max(hi, x);
      }
  const cx = (lo + hi) / 2 + 1;
  const half = Math.max(2, ((hi - lo) / 2) * 0.8);
  const shadow = (y: number, r: number) =>
    grid(w, 1, (x) => {
      const c = rows[y]?.[x] ?? ".";
      return c !== "." ? c : Math.abs(x + 0.5 - cx) <= r ? "k" : ".";
    })[0];
  // the last art row gets a sliver too, so the shadow tucks under the base instead of floating below it
  const last = rows.length - 1;
  return [...rows.slice(0, last), shadow(last, half * 0.9), shadow(last + 1, half), shadow(last + 2, half - 2)];
}

/** Sprinkle a few blossoms over the mid-green leaves of a foliage grid. */
function blossoms(rows: string[], colors: string, seed: number) {
  let n = 0;
  return rows.map((row, y) =>
    [...row].map((c, x) => (c === "m" && hash(x + seed, y * 5 + seed) < 0.07 ? colors[n++ % colors.length] : c)).join(""),
  );
}

// ---------------------------------------------------------------- small ground details (16 wide)

const TUFT = art(
  ["....l.....l.....", "...ld.l..ld.....", "...ldld.lld.l...", "..dddddddddddd.."],
  [".....l.....l....", "....ld.l..ld....", "...lddld.lld.l..", "..dddddddddddd.."],
);

const TALL = art(
  [
    "..l.....l.....l.",
    "..ld...ld..l..ld",
    ".lld..lld.ld.lld",
    ".ldd.lldd.ld.ldd",
    "lddd.ldddlddlddd",
    "dddddddddddddddd",
  ],
  [
    "...l.....l.....l",
    "..ld....ld..l.ld",
    ".lld..lld.ld.lld",
    ".ldd.lldd.ld.ldd",
    "lddd.ldddlddlddd",
    "dddddddddddddddd",
  ],
);

const flower = (c: string) =>
  art(
    [".......w........", "......w" + c + "w.......", ".......w........", ".......d........", "........d.......", "......dd........"],
    ["........w.......", ".......w" + c + "w......", "........w.......", ".......d........", ".......d........", "......dd........"],
  );

const STONE = art([".....tttt.......", "....tsSssst.....", "...tsSsssst.....", "...tsssssst.....", "....ttttttk....."]);

const PEBBLES = art(["..ts......st....", "...........t....", ".......ts.......", "................", "...st..........."]);

const CLOVER = art(["......l.l.......", ".....lmlml......", "......lml.......", ".......d........", "..l.l...........", "..lml...........", "...d............"]);

const MUSHROOM = art(
  grounded([
    ".....oooo.......",
    "....orrwro......",
    "...orwrrrro.....",
    "...oRRRRRRo.....",
    "....oonnoo......",
    ".....onno.......",
    "......oo........",
  ]),
);

// ---------------------------------------------------------------- props for the margins

const bushRows = foliage(16, 14, [[8, 8, 6.2], [5, 6.5, 4], [11, 6.5, 4]], 11);
const BUSH = art(grounded(bushRows));
const FLOWER_BUSH = art(grounded(blossoms(bushRows, "rpw", 3)));

const BUSH_BIG = art(grounded(foliage(24, 18, [[12, 10, 8], [7, 8, 5.5], [17, 8, 5.5], [12, 5.5, 5]], 23)));

const TREE = art(
  (() => {
    // every circle stays at least 1px inside the canvas, so the outline never gets cut
    const canopy = foliage(34, 27, [[17, 15, 11], [9, 16, 6.5], [25, 16, 6.5], [17, 9, 7.5], [11, 10, 5], [23, 10, 5]], 5);
    const trunk = [
      "...........kkobhbbBBokk...........",
      "...........kkobhbbBBokk...........",
      "..........kkkobhbbBBokkk..........",
      ".........kkkoobhbbBBookkk.........",
      ".........kkkobbhbbBBBokkk.........",
      "..........kkooooooooookk..........",
      "............kkkkkkkkkk............",
    ];
    return [...canopy, ...trunk].map((row, y) => {
      // the canopy's bottom outline overlaps the top of the trunk
      if (y < 25) return row;
      const t = trunk[y - 27] ?? ".".repeat(34);
      return [...row].map((c, x) => (c === "." ? (t[x] ?? ".") : c)).join("");
    });
  })(),
);

const rockRows = [
  "....oooooo......",
  "...oSSSssso.....",
  "..oSSssssssoo...",
  "..oSssssssssto..",
  ".oSssssssssssto.",
  ".osssssssssstto.",
  ".otsssssssttto..",
  "..ottttttttttoo.",
  "...oooooooooo...",
];
const ROCK = art(grounded(rockRows));
// the same rock after a few rainy seasons in the wood: moss over the lit top
const MOSSY_ROCK = art(
  grounded(
    rockRows.map((row, y) =>
      [...row].map((c, x) => (y > 0 && y < 4 && c !== "o" && c !== "." ? (hash(x, y + 40) < 0.35 ? "l" : "m") : c)).join(""),
    ),
  ),
);

/** A fallen log: a cut end with growth rings on the left, bark lit from above, a tuft of moss. */
const LOG = art(
  (() => {
    const W = 28;
    const H = 10;
    const cap = (x: number, y: number) => ((x + 0.5 - 4) / 2.4) ** 2 + ((y + 0.5 - 4.5) / 3.4) ** 2;
    const inside = (x: number, y: number) =>
      (x >= 4 && x <= 24 && y >= 2 && y <= 7) || cap(x, y) <= 1 || ((x + 0.5 - 24) / 1.8) ** 2 + ((y + 0.5 - 4.5) / 3.4) ** 2 <= 1;
    return grid(W, H, (x, y) => {
      if (!inside(x, y)) {
        if (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1)) return "o";
        return y === H - 1 && x > 5 && x < 27 ? "k" : ".";
      }
      const d = cap(x, y);
      if (d <= 1) return d < 0.2 ? "b" : d < 0.55 ? "h" : "n";
      if (y === 2 && x > 10 && x < 16) return hash(x, 3) < 0.5 ? "l" : "m";
      if (y === 2) return "h";
      if (y >= 6) return "B";
      return x % 6 === 0 ? "B" : "b";
    });
  })(),
);

/** Five little mushrooms in an arc: a fairy ring, rare, deep in the wood. */
const MUSHROOM_RING = art(
  (() => {
    const W = 32;
    const H = 15;
    const cells = Array.from({ length: H }, () => Array(W).fill("."));
    const small = [".ooo.", "orwro", "oRRRo", ".ono.", ".kkk."];
    for (const [ox, oy] of [
      [1, 9],
      [7, 3],
      [14, 0],
      [21, 3],
      [26, 9],
    ])
      small.forEach((row, y) => [...row].forEach((c, x) => c !== "." && (cells[oy + y + 1][ox + x] = c)));
    return cells.map((r) => r.join(""));
  })(),
);

/** Cattails for the pond bank; the heads lean with the wind every other frame. */
function cattails(frame: number) {
  const stalks: [number, number][] = [
    [3, 2],
    [6, 0],
    [9, 4],
  ];
  const leaves: [number, number, string][] = [
    [1, 12, "l"], [1, 13, "l"], [2, 14, "l"], [2, 15, "l"], [3, 16, "l"],
    [11, 11, "m"], [10, 12, "m"], [10, 13, "m"], [9, 14, "m"], [9, 15, "m"], [8, 16, "m"],
  ];
  return grid(12, 18, (x, y) => {
    if (y === 17) return x > 1 && x < 11 ? "k" : ".";
    const leaf = leaves.find(([lx, ly]) => lx === x && ly === y);
    if (leaf) return leaf[2];
    const sx = x - (frame && y < 9 ? 1 : 0);
    for (const [bx, ty] of stalks) {
      if (y === ty && sx === bx) return "d";
      if (y > ty && y <= ty + 4 && (sx === bx || sx === bx + 1)) return sx === bx ? "b" : "B";
      if (y > ty + 4 && x === bx) return "d";
    }
    return ".";
  });
}
export const CATTAILS = art(cattails(0), cattails(1));

const STUMP = art([
  "...oooooooooo...",
  "..obhhhhhhhhbo..",
  "..ohbbbbbbbbho..",
  "..ohbhhhhhhbho..",
  "..obhhhhhhhhbo..",
  "..oBbbbbbbbbBo..",
  "..oBbBbbbBbbBo..",
  ".oBBbBbbbBbbBBo.",
  ".oooooooooooooo.",
  "..kkkkkkkkkkkk..",
]);

/**
  A run of fence with n spans between posts. 20n + 4 wide, so the rails end on the
  last post instead of sticking out past it. Cached, so every run of one length shares a canvas.
*/
const fences = new Map<number, Art>();
export function fence(n: number) {
  let a = fences.get(n);
  if (!a) {
    a = art(
      grid(20 * n + 4, 17, (x, y) => {
        const p = x % 20;
        // the shadow falls down and to the right, under the bottom rail and each post
        if (y === 16) return p > 0 && p < 6 ? "k" : ".";
        if (p < 4) {
          // post: outline, lit left face, dark right face
          if (y === 0 || y === 14 || p === 0 || p === 3) return y < 15 ? "o" : p > 0 ? "k" : ".";
          return p === 1 ? "h" : "b";
        }
        if (y === 12) return "k";
        if (y === 3 || y === 6 || y === 8 || y === 11) return "o";
        if (y === 4 || y === 9) return "h";
        if (y === 5 || y === 10) return "B";
        return ".";
      }),
    );
    fences.set(n, a);
  }
  return a;
}

/*
  A small pond: dark bank on top (depth), water, lily pads, glints and ripples.
  One loop is POND_FRAMES long: glints slide 1px a frame (alternate rows drift opposite
  ways) and wrap at the pond width, and a ripple grows out of each pad, so it loops seamlessly.
  Once a loop a fish jumps out of the middle and lands with a splash.
*/
const POND_FRAMES = 80;
// the jump, one entry per frame from JUMP: fish head and tail pixels, or a splash radius
const JUMP = 60;
const FISH: ([number, number, number, number] | number)[] = [
  1,
  [18, 12, 17, 13],
  [19, 9, 18, 10],
  [21, 8, 20, 8],
  [23, 9, 22, 8],
  [24, 12, 23, 11],
  1,
  2,
  3,
];
function pond(frame: number) {
  const W = 40;
  const H = 26;
  const inside = (x: number, y: number) => ((x + 0.5 - W / 2) / (W / 2 - 1)) ** 2 + ((y + 0.5 - H / 2) / (H / 2 - 1)) ** 2 <= 1;
  const pads: [number, number, number][] = [
    [12, 14, 0],
    [27, 18, 10],
  ];
  const onPad = (x: number, y: number) => pads.some(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 <= 5);
  return grid(W, H, (x, y) => {
    if (!inside(x, y)) return inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1) ? "k" : ".";
    if (!inside(x, y - 2)) return "A";
    const jump = FISH[frame - JUMP];
    if (typeof jump === "object") {
      if (x === jump[0] && y === jump[1]) return "w";
      if (x === jump[2] && y === jump[3]) return "u";
    } else if (jump) {
      // a ring where the fish went in (or comes out), in the same sparse dots as the pad ripples
      const [sx, sy] = frame - JUMP < 3 ? [18, 13] : [25, 13];
      const d = Math.hypot(x - sx, (y - sy) * 1.4);
      if (Math.abs(d - jump) < 0.5 && (x + y) % 2 === 0) return "c";
      if (jump === 1 && d < 0.8) return "w";
    }
    if (onPad(x, y)) return x === 12 && y === 13 ? "y" : (x + y) % 5 === 0 ? "d" : "l";
    // ripple: a sparse ring that grows away from the pad, then rests for a while
    for (const [cx, cy, offset] of pads) {
      const step = (frame + offset) % 20;
      const r = 3.6 + step * 0.3;
      const d = Math.hypot(x - cx, (y - cy) * 1.4);
      if (step < 10 && Math.abs(d - r) < 0.5 && (x + y) % 2 === 0 && (step < 6 || (x + 2 * y) % 4 === 0)) return "c";
    }
    if (y % 4 === 1) {
      const dir = (y >> 2) % 2 ? 1 : -1;
      const sx = (((x + dir * frame) % W) + W) % W;
      if (hash(Math.floor(sx / 3), y * 7 + 1) < 0.16) return "c";
    }
    return "a";
  });
}
const POND = art(...Array.from({ length: POND_FRAMES }, (_, f) => pond(f)));

// ---------------------------------------------------------------- critters

/** Wings open, then folded up over the body. */
export const butterfly = (c: string) =>
  art(
    [c + c + "..." + c + c, c + c + c + "o" + c + c + c, "." + c + c + "o" + c + c + ".", "...o..."],
    ["...o...", ".." + c + "o" + c + "..", ".." + c + "o" + c + "..", "...o..."],
  );

/** A bird seen from below, wings up and wings down. */
export const BIRD = art(["o.....o", ".o...o.", "..ooo.."], [".......", ".ooooo.", "o.....o"]);

// ---------------------------------------------------------------- zones

export type Zone = {
  /** grass base, blade highlight, blade shadow, large patch colour */
  base: string;
  light: string;
  dark: string;
  patch: string;
  /** chance a tile gets a small detail, then which one */
  smallRate: number;
  small: [Art, number][];
  /** details that grow in clumps: used instead of `small` where a slow noise runs high */
  cluster: [Art, number][];
  /** chance a margin cell gets a prop, then which one */
  bigRate: number;
  big: [Art, number][];
  /** long fences along the content column, like the edge of a pasture */
  fences?: boolean;
  /** chance a margin cell gets a butterfly, and its wing colours */
  butterflies?: [number, string];
};

export const POND_ART = POND;
export const TREE_ART = TREE;

export const ZONES: Record<string, Zone> = {
  // starting village: bright meadow, flowers in clumps, butterflies over them
  home: {
    base: "#60b048",
    light: "#98d868",
    dark: "#409038",
    patch: "#70c058",
    smallRate: 0.28,
    small: [
      [TUFT, 5],
      [CLOVER, 1],
      [flower("y"), 1],
    ],
    cluster: [
      [flower("y"), 3],
      [flower("r"), 3],
      [flower("p"), 3],
      [TUFT, 1],
    ],
    bigRate: 0.4,
    big: [
      [BUSH, 3],
      [FLOWER_BUSH, 2],
      [TREE, 1],
      [ROCK, 1],
    ],
    butterflies: [0.05, "yw"],
  },
  // status screen: tall grass and thick bushes
  about: {
    base: "#58a840",
    light: "#88d058",
    dark: "#307830",
    patch: "#489838",
    smallRate: 0.34,
    small: [
      [TALL, 4],
      [TUFT, 4],
      [CLOVER, 1],
    ],
    cluster: [
      [TALL, 4],
      [flower("y"), 2],
    ],
    bigRate: 0.55,
    big: [
      [BUSH, 4],
      [BUSH_BIG, 3],
      [FLOWER_BUSH, 1],
      [TREE, 1],
    ],
    butterflies: [0.03, "w"],
  },
  // the journey: drier ground, rocks, stumps and fenced pastures along the road
  experience: {
    base: "#68a840",
    light: "#a0d060",
    dark: "#488830",
    patch: "#80b048",
    smallRate: 0.26,
    small: [
      [TUFT, 4],
      [STONE, 1],
      [flower("y"), 1],
    ],
    cluster: [
      [PEBBLES, 3],
      [STONE, 2],
      [TUFT, 1],
    ],
    bigRate: 0.32,
    big: [
      [STUMP, 2],
      [ROCK, 2],
      [LOG, 2],
      [BUSH, 1],
    ],
    fences: true,
  },
  // the chests are hidden in a darker wood, with groves and clearings
  projects: {
    base: "#489838",
    light: "#70b850",
    dark: "#286828",
    patch: "#387830",
    smallRate: 0.28,
    small: [
      [TUFT, 4],
      [CLOVER, 2],
      [STONE, 1],
    ],
    cluster: [
      [MUSHROOM, 4],
      [CLOVER, 2],
    ],
    bigRate: 0.75,
    big: [
      [TREE, 7],
      [BUSH_BIG, 2],
      [STUMP, 1],
      [LOG, 1],
      [MOSSY_ROCK, 1],
      [MUSHROOM_RING, 1],
    ],
  },
  // the mailbox sits by the water
  contact: {
    base: "#58a848",
    light: "#90d068",
    dark: "#388838",
    patch: "#68b850",
    smallRate: 0.28,
    small: [
      [TUFT, 4],
      [CLOVER, 1],
      [flower("w"), 1],
    ],
    cluster: [
      [flower("u"), 3],
      [flower("p"), 2],
      [flower("w"), 1],
    ],
    bigRate: 0.5,
    big: [
      [POND, 3],
      [FLOWER_BUSH, 2],
      [BUSH, 1],
      [TREE, 1],
    ],
    butterflies: [0.05, "pu"],
  },
};

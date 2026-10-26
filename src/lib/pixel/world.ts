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

const MUSHROOM = art([
  ".....oooo.......",
  "....orrwro......",
  "...orwrrrro.....",
  "...oRRRRRRo.....",
  "....oonnoo......",
  ".....onno.......",
  "......oo........",
]);

// ---------------------------------------------------------------- props for the margins

const BUSH = art(foliage(16, 14, [[8, 8, 6.2], [5, 6.5, 4], [11, 6.5, 4]], 11));

const BUSH_BIG = art(foliage(24, 18, [[12, 10, 8], [7, 8, 5.5], [17, 8, 5.5], [12, 5.5, 5]], 23));

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

const ROCK = art([
  "....oooooo......",
  "...oSSSssso.....",
  "..oSSssssssoo...",
  "..oSssssssssto..",
  ".oSssssssssssto.",
  ".osssssssssstto.",
  ".otsssssssttto..",
  "..ottttttttttoo.",
  "...oooooooooo...",
]);

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

const FENCE = art(
  // 44 wide so the rails end on the last post instead of sticking out past it
  grid(44, 16, (x, y) => {
    const p = x % 20;
    if (p < 4) {
      // post: outline, lit left face, dark right face
      if (y === 0 || y === 14 || p === 0 || p === 3) return y < 15 ? "o" : ".";
      return p === 1 ? "h" : "b";
    }
    if (y === 15) return p < 5 ? "k" : ".";
    if (y === 3 || y === 6 || y === 8 || y === 11) return "o";
    if (y === 4 || y === 9) return "h";
    if (y === 5 || y === 10) return "B";
    return ".";
  }),
);

/*
  A small pond: dark bank on top (depth), water, lily pads, glints and ripples.
  One loop is POND_FRAMES long: glints slide 1px a frame (alternate rows drift opposite
  ways) and wrap at the pond width, and a ripple grows out of each pad, so it loops seamlessly.
*/
const POND_FRAMES = 40;
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
  /** chance a margin cell gets a prop, then which one */
  bigRate: number;
  big: [Art, number][];
};

export const ZONES: Record<string, Zone> = {
  // starting village: bright meadow full of flowers
  home: {
    base: "#60b048",
    light: "#98d868",
    dark: "#409038",
    patch: "#70c058",
    smallRate: 0.3,
    small: [
      [TUFT, 4],
      [flower("y"), 3],
      [flower("r"), 3],
      [flower("p"), 3],
      [CLOVER, 1],
    ],
    bigRate: 0.4,
    big: [
      [BUSH, 4],
      [TREE, 1],
      [ROCK, 1],
    ],
  },
  // status screen: tall grass and thick bushes
  about: {
    base: "#58a840",
    light: "#88d058",
    dark: "#307830",
    patch: "#489838",
    smallRate: 0.34,
    small: [
      [TALL, 5],
      [TUFT, 4],
      [flower("y"), 1],
      [CLOVER, 1],
    ],
    bigRate: 0.55,
    big: [
      [BUSH, 4],
      [BUSH_BIG, 3],
      [TREE, 1],
    ],
  },
  // the journey: drier ground, rocks, stumps and fences along the road
  experience: {
    base: "#68a840",
    light: "#a0d060",
    dark: "#488830",
    patch: "#80b048",
    smallRate: 0.26,
    small: [
      [TUFT, 4],
      [STONE, 2],
      [PEBBLES, 3],
      [flower("y"), 1],
    ],
    bigRate: 0.5,
    big: [
      [FENCE, 3],
      [STUMP, 2],
      [ROCK, 2],
      [BUSH, 1],
    ],
  },
  // the chests are hidden in a darker wood
  projects: {
    base: "#489838",
    light: "#70b850",
    dark: "#286828",
    patch: "#387830",
    smallRate: 0.3,
    small: [
      [TUFT, 4],
      [MUSHROOM, 2],
      [CLOVER, 2],
      [STONE, 1],
    ],
    bigRate: 0.7,
    big: [
      [TREE, 6],
      [BUSH_BIG, 2],
      [STUMP, 1],
      [MUSHROOM, 1],
    ],
  },
  // the mailbox sits by the water
  contact: {
    base: "#58a848",
    light: "#90d068",
    dark: "#388838",
    patch: "#68b850",
    smallRate: 0.3,
    small: [
      [TUFT, 3],
      [flower("u"), 3],
      [flower("p"), 2],
      [flower("w"), 1],
      [CLOVER, 1],
    ],
    bigRate: 0.5,
    big: [
      [POND, 3],
      [BUSH, 2],
      [TREE, 1],
    ],
  },
};

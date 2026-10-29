/*
  Art for the hidden handheld: four shades of green, "0" (the bare LCD) to "3" (darkest),
  "." for clear. Same character-map idea as sprites.ts. Blocks are 16×16, chunky enough
  for a 160×144 screen, and nothing is traced from a real game.
*/

export const SHADES = ["#9bbc0f", "#78a020", "#306230", "#0f380f"];

export type Art = string[];

function grid(w: number, h: number, fn: (x: number, y: number) => string): Art {
  return Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => fn(x, y)).join(""));
}

/** Darkest shade around every filled pixel that touches a clear one (or the edge). */
function outline(rows: Art): Art {
  const at = (x: number, y: number) => rows[y]?.[x] ?? ".";
  return rows.map((row, y) =>
    [...row].map((c, x) => (c !== "." && [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)].includes(".") ? "3" : c)).join(""),
  );
}

const speck = (x: number, y: number) => ((x * 7 + y * 13) % 11 === 0 ? "2" : (x * 5 + y * 3) % 17 === 0 ? "0" : "1");

// ---------------------------------------------------------------- blocks

export const DIRT = grid(16, 16, speck);

export const GROUND = grid(16, 16, (x, y) => {
  if (y === 0) return "3";
  if (y === 1) return "2";
  if (y === 2) return x % 5 === 1 ? "3" : "2";
  if (y === 3) return x % 4 === 1 ? "1" : "3";
  return speck(x, y);
});

export const BRICK = grid(16, 16, (x, y) => {
  if (y % 4 === 0) return "3";
  const seam = Math.floor(y / 4) % 2 ? [3, 11] : [7, 15];
  if (seam.includes(x)) return "3";
  // a lit pixel on the top-left of each brick
  if (y % 4 === 1 && seam.some((s) => (x - s + 16) % 16 === 1)) return "0";
  return "1";
});

const QUESTION = [
  ".33333333333333.",
  "3111111111111113",
  "3131111111111313",
  "3111113333111113",
  "3111133113311113",
  "3111133113311113",
  "3111111113311113",
  "3111111133111113",
  "3111111331111113",
  "3111111331111113",
  "3111111111111113",
  "3111111331111113",
  "3111111331111113",
  "3131111111111313",
  "3111111111111113",
  ".33333333333333.",
];
/** The "?" glows, then dims for a beat. */
export const QUESTION_FRAMES = [
  QUESTION,
  QUESTION.map((row, y) => (y > 2 && y < 13 ? row.slice(0, 3) + row.slice(3, 13).replaceAll("3", "2") + row.slice(13) : row)),
];

export const USED = grid(16, 16, (x, y) => {
  const edge = x === 0 || y === 0 || x === 15 || y === 15;
  if (edge) return (x === 0 || x === 15) && (y === 0 || y === 15) ? "." : "3";
  if ((x === 2 || x === 13) && (y === 2 || y === 13)) return "3";
  return "2";
});

export const HARD = grid(16, 16, (x, y) => {
  if (x === 0 || y === 0 || x === 15 || y === 15) return "3";
  if (x === 1 || y === 1) return "0";
  if (x === 14 || y === 14) return "2";
  return "1";
});

/** Cracked rock: the hard block split by a zigzag. Only the dash breaks it. */
export const CRACKED = grid(16, 16, (x, y) => {
  if (x === 0 || y === 0 || x === 15 || y === 15) return "3";
  const crack = [6, 6, 7, 7, 8, 9, 9, 8, 7, 7, 8, 9, 10, 10, 9, 9][y];
  if (x === crack || (y === 5 && x > 9 && x < 13) || (y === 11 && x > 3 && x < 7)) return "3";
  if (x === 1 || y === 1) return "0";
  if (x === 14 || y === 14) return "2";
  return "1";
});

/** Sandstone off the chapada's edge, four loose stones that give way a moment after you land. */
export const SAND = grid(16, 16, (x, y) => {
  if (x === 0 || y === 0 || x === 15 || y === 15) return "3";
  if (y === 7 || (y < 7 && x === 9) || (y > 7 && x === 5)) return "2";
  return (x * 3 + y * 7) % 11 === 0 ? "2" : (x + y * 5) % 9 === 0 ? "0" : "1";
});

/** A dry branch sticking out of the rock: land on it from above, hop up through it from below. */
export const BRANCH = [
  "3333333333333333",
  "2121221212212122",
  "2222222222222222",
  "3333333333333333",
  "....33.......33.",
  ".....3........3.",
  ...Array(10).fill("................"),
];

/** A spring, sprung and then squashed for a beat after it throws you. */
export const SPRING = [
  [
    ".33333333333333.",
    "3001111111111223",
    ".33333333333333.",
    "......3..3......",
    "...3333333333...",
    "...3........3...",
    "...3333333333...",
    "......3..3......",
    "...3333333333...",
    "...3........3...",
    "...3333333333...",
    "......3..3......",
    "..333333333333..",
    ".32222222222223.",
    ".32111111111123.",
    "3333333333333333",
  ],
  [
    ...Array(6).fill("................"),
    ".33333333333333.",
    "3001111111111223",
    ".33333333333333.",
    "...3333333333...",
    "...3333333333...",
    "...3333333333...",
    "..333333333333..",
    ".32222222222223.",
    ".32111111111123.",
    "3333333333333333",
  ],
];

/** The checkpoint: a ribbon on a post, hanging low until you pass, then up at the top. */
function post(up: boolean): Art {
  const top = up ? 1 : 8;
  return outline(
    grid(16, 16, (x, y) => {
      if (x >= 3 && x <= 4) return "2";
      const d = y - top;
      if (d >= 0 && d <= 6 && x > 4 && x <= 6 + 2 * (3 - Math.abs(d - 3))) return up ? "0" : "1";
      return ".";
    }),
  );
}
export const POST = [post(false), post(true)];

/** A pipe is two blocks wide: a cap with a lip, then a narrower body. */
function pipe(cap: boolean): Art {
  return grid(32, 16, (x, y) => {
    const l = cap ? 0 : 2;
    const r = 31 - l;
    if (x < l || x > r) return ".";
    if (x === l || x === r || (cap && (y === 0 || y === 15))) return "3";
    if (x >= l + 2 && x <= l + 3) return "0";
    if (x >= r - 6) return x === r - 1 ? "3" : "2";
    return "1";
  });
}
const half = (rows: Art, right: boolean) => rows.map((row) => (right ? row.slice(16) : row.slice(0, 16)));
const PIPE_CAP = pipe(true);
const PIPE_BODY = pipe(false);
export const PIPE = {
  capL: half(PIPE_CAP, false),
  capR: half(PIPE_CAP, true),
  bodyL: half(PIPE_BODY, false),
  bodyR: half(PIPE_BODY, true),
};

export const POLE = grid(16, 16, (x) => (x === 7 ? "2" : x === 8 ? "3" : "."));

export const POLE_TOP = grid(16, 16, (x, y) => {
  const d = Math.hypot(x - 7.5, y - 4.5);
  if (d < 2 && x < 8 && y < 5) return "0";
  if (d < 3.2) return "1";
  if (d < 4.3) return "3";
  return y > 8 ? (x === 7 ? "2" : x === 8 ? "3" : ".") : ".";
});

/** Pennant hanging off the left of the pole. */
export const FLAG = outline(grid(14, 11, (x, y) => (x >= Math.abs(y - 5) * 2.6 ? (x > 6 && y > 3 && y < 7 ? "0" : "2") : ".")));

/** The nest at the end of the road, a bowl of twigs the soldadinho settles into. */
export const NEST = outline(
  grid(32, 14, (x, y) => {
    if (y < 3 || ((x - 15.5) / 16) ** 2 + ((y - 1) / 13) ** 2 > 1) return ".";
    if (y < 5) return (x + y) % 3 === 0 ? "1" : "2";
    return (x * 3 + y * 5) % 7 < 2 ? "3" : (x + y) % 3 === 0 ? "1" : "2";
  }),
);

/**
  A spike trap: a dark plate on the ground with two iron spikes that shoot up out of it and
  sink back. One frame per two pixels of height, from flush (0) to twelve pixels out (6).
*/
export const SPIKES = Array.from({ length: 7 }, (_, i) => {
  const h = i * 2;
  return grid(16, 16, (x, y) => {
    if (y >= 14) return y === 14 && x % 8 > 1 && x % 8 < 6 ? "2" : "3";
    const k = 13 - y; // 0 just above the plate
    if (k >= h) return ".";
    const c = (x % 8) - 3.5; // each spike is eight pixels wide at the base, a point at the top
    const half = 4 * (1 - k / h) + 0.5;
    if (Math.abs(c) >= half) return ".";
    // dark sides, a lit left face and a shaded right one, so they read as metal on the pale screen
    return Math.abs(c) >= half - 1 ? "3" : c < 0 ? "0" : "2";
  });
});

/** Mandacaru, the tall cactus of the sertão, as scenery you walk past. */
export const CACTUS = [
  "......33........",
  ".....3223.......",
  ".....3223.......",
  ".33..3223.......",
  "3223.3223.......",
  "3223.3223..33...",
  "3223.3223.3223..",
  "322222223.3223..",
  ".33333223.3223..",
  ".....322222223..",
  ".....322333333..",
  ".....3223.......",
  ".....3223.......",
  ".....3223.......",
  ".....3223.......",
  ".....3223.......",
];

export const CLOUD = outline(
  grid(28, 12, (x, y) =>
    [[8, 7, 5], [15, 5, 6], [21, 7, 5]].some(([cx, cy, r]) => Math.hypot(x - cx, (y - cy) * 1.3) < r) || (y >= 7 && y <= 10 && x > 3 && x < 25)
      ? "0"
      : ".",
  ),
);

/**
  The Chapada do Araripe on the horizon: long flat-topped mesas with steep sides,
  one strip that tiles every 256px.
*/
export const MESA = (() => {
  const h = 48;
  const mesas: [from: number, to: number, top: number][] = [
    [8, 118, 34],
    [138, 214, 24],
    [226, 250, 14],
  ];
  const height = (x: number) =>
    Math.max(4, ...mesas.map(([a, b, top]) => Math.min(top, (x - a) * 1.6, (b - x) * 1.6)));
  return grid(256, h, (x, y) => (y >= h - height(x) ? "1" : "."));
})();

// ---------------------------------------------------------------- the forest on top (world 1-2)

/*
  Up on the chapada the sertão gives way to the wet forest around the springs. The same
  blocks and critters, plus a few things that only grow up there.
*/

/** A frond as a row of points from (x, y), reaching `len` pixels along angle `a` and drooping as it goes. */
function frond(x: number, y: number, a: number, len: number, droop: number) {
  return Array.from({ length: len * 2 }, (_, i) => {
    const t = i / (len * 2);
    return [x + Math.cos(a) * t * len, y + Math.sin(a) * t * len + t * t * droop, t] as const;
  });
}

function fronds(w: number, h: number, sets: (readonly (readonly [number, number, number])[])[], width = 1.1): Art {
  const pts = sets.flat();
  return grid(w, h, (x, y) => {
    const hit = pts.find(([px, py]) => Math.hypot(x + 0.5 - px, y + 0.5 - py) < width);
    if (!hit) return ".";
    return hit[2] > 0.55 ? "1" : "2";
  });
}

/** Samambaia, a fern by the trail, as scenery. */
export const FERN = outline(
  fronds(16, 16, [-2.7, -2.2, -1.75, -1.4, -0.95, -0.45].map((a) => frond(8, 15, a, 9, 5))),
);

/** Buriti, the tall palm of the veredas around the springs, 32×48 standing on its cell. */
export const TREE = (() => {
  const crown = fronds(32, 48, [-3.0, -2.6, -2.15, -1.75, -1.4, -1.0, -0.55, -0.15].map((a) => frond(16, 12, a, 14, 7)), 1.3);
  return outline(
    crown.map((row, y) =>
      [...row].map((c, x) => {
        if (y > 12 && x >= 15 && x <= 17) return y % 4 === 0 ? "3" : x === 15 ? "1" : "2";
        if (y >= 11 && y <= 14 && x >= 14 && x <= 18 && (x + y) % 2 === 0) return "3"; // the fruit
        return c;
      }).join(""),
    ),
  );
})();

/** The forest canopy rolling away behind, one strip that tiles every 256px. */
export const CANOPY = (() => {
  const h = 48;
  const wave = (x: number, k: number, p = 0) => Math.sin((2 * Math.PI * k * x) / 256 + p);
  const height = (x: number) => 26 + 7 * wave(x, 3) + 4 * wave(x, 7, 1) + 2 * Math.abs(wave(x, 19, 2));
  return grid(256, h, (x, y) => {
    const top = h - height(x);
    if (y < top) return ".";
    return y < top + 2 ? "0" : (x * 5 + y * 3) % 23 === 0 ? "2" : "1";
  });
})();

/** The grass on top of the ground, with the colour on: "g" lit, "G" shaded, the dirt below in tones. */
export const GROUND_GRASS = grid(16, 16, (x, y) => {
  if (y === 0) return "G";
  if (y === 1) return "g";
  if (y === 2) return x % 5 === 1 ? "G" : "g";
  if (y === 3) return x % 4 === 1 ? "g" : "G";
  if (y === 4) return x % 3 === 0 ? "G" : speck(x, y);
  return speck(x, y);
});

// ---------------------------------------------------------------- the soldadinho, 20×18, facing right

/*
  The same bird that narrates the site (sprites.ts), mapped onto four shades: white body
  (lightest), red crest (mid), black wing (darkest), seen side-on with the crest curling
  over the beak. Letters follow the site sprite's palette.
*/
const SHADE_OF: Record<string, string> = { k: "3", r: "2", l: "1", R: "3", w: "0", e: "3", b: "2", p: "1", n: "3", N: "2", s: "1", h: "2", ".": "." };
const shade = (rows: string[]) => rows.map((row) => [...row].map((c) => SHADE_OF[c] ?? c).join(""));

const HEAD = [
  "........kkkk........",
  "......kkrrllkk......",
  ".....krrrrrrllkk....",
  "....krrrlrrrrrrrrk..",
  "....kRrrrrrrrrrrrrrk",
  "...kRRrrrrrrrrrkkkk.",
  "...kRRrrrrrrrrrrk...",
  "...kRrwwwwwwwwewwk..",
  "..kRwwwwwwwwweewwbk.",
  "..kwwwwwwwwwweewwbbk",
];
const FOLDED = [
  "..kwkkkkkwwwwwppwkk.",
  ".kknNNNNnkwwwwwwwk..",
  "knnnnnnnnkwwwwwwsk..",
  "knnnnnnnkwwwwwwssk..",
  ".kknnnnkwwwwwwsssk..",
  "...kkkksssssssssk...",
];
/** body with the wing lifted off it, for the up-beat of a flap */
const OPEN = [
  "..kwwwwwwwwwwwppwkk.",
  "..kwwwwwwwwwwwwwwk..",
  "..kwwwwwwwwwwwwwsk..",
  "...kwwwwwwwwwwwssk..",
  "....kwwwwwwwwsssk...",
  "...kkkksssssssssk...",
];
const FEET = ["......kkhkkkhkkk....", ".......hhh.hhh......"];
const FEET_WIDE = ["......kkhkkkkhkk....", "......hh.....hh....."];
const FEET_TUCKED = ["......kkkkkkkkkk....", "...................."];

/** The wing raised up behind the head. */
const WING_UP = ["", "", ".k..", "knk.", "knnk", "knNk", "knNk", "knnk", ".kn", "..kn"];
const HEAD_WING_UP = HEAD.map((row, y) => (WING_UP[y] ? WING_UP[y] + row.slice(WING_UP[y].length) : row));

/** Lays each overlay row over the start of the matching base row; "" leaves a row alone. */
const over = (base: string[], top: string[]) => base.map((row, y) => (top[y] ? top[y] + row.slice(top[y].length) : row));

/*
  The dash: the head dips a pixel as the bird leans into it, the wing sweeps flat back along
  the body and a few streaks trail off behind.
*/
const DASH_HEAD = over([".".repeat(20), ...HEAD], ["", "", "", "", "hh..", "", "", "hhh", "", "", ""]);
const WING_BACK = ["kkkkkkkk", "knnnnnnNk", ".kknnnNNk", "...kkkkk", "", "h.."];

/** The poses in the site sprite's letters, for the world in colour. */
export const BIRD_LETTERS = {
  stand: [...HEAD, ...FOLDED, ...FEET],
  walk: [...HEAD, ...FOLDED, ...FEET_WIDE],
  jump: [...HEAD, ...FOLDED, ...FEET_TUCKED],
  glideUp: [...HEAD_WING_UP, ...OPEN, ...FEET_TUCKED],
  glideDown: [...HEAD, ...FOLDED, ...FEET_TUCKED],
  dash: [...DASH_HEAD, ...over(OPEN, WING_BACK), FEET_TUCKED[0]],
  /** upside down with feet in the air: the classic "oh no" */
  dead: [...HEAD, ...FOLDED, ...FEET].reverse(),
};

export const BIRD = Object.fromEntries(Object.entries(BIRD_LETTERS).map(([k, v]) => [k, shade(v)])) as typeof BIRD_LETTERS;

// ---------------------------------------------------------------- critters

/** Calango, the quick little lizard of the Caatinga, facing left. */
export const CALANGO = [
  [
    ".333............",
    "30313...........",
    "311113333333....",
    "3111121212123333",
    ".333111111113...",
    "..3.3333333.3...",
    ".33.......33....",
    "................",
  ],
  [
    ".333............",
    "30313...........",
    "311113333333....",
    "3111121212123333",
    ".333111111113...",
    "...33333333.3...",
    "..33.......33...",
    "................",
  ],
];
export const CALANGO_FLAT = [
  "................",
  "................",
  "................",
  "................",
  "................",
  ".33333333333333.",
  "3121212121212123",
  ".33333333333333.",
];

/** Carcará, the hawk of the sertão, facing left, wings up then down. */
export const CARCARA = [
  [
    "........333.....",
    ".......32223....",
    "......322223....",
    "......32223.....",
    ".333..3223......",
    "3011332222333...",
    "331112222222223.",
    ".331122222222333",
    "..3332222223.333",
    ".....333333.....",
    "......3..3......",
    "................",
  ],
  [
    "................",
    "................",
    "................",
    "................",
    ".333............",
    "3011332222333...",
    "331112222222223.",
    ".331122222222333",
    "..3333222223.333",
    "......32223.....",
    "......3223......",
    ".......33.......",
  ],
];

/** Sapo-cururu, the fat toad of the sertão, facing left: sitting, then mid-leap. */
export const SAPO = [
  [
    "................",
    "................",
    "................",
    "..333...........",
    ".30013.3333.....",
    "3111113211233...",
    "31111112121123..",
    "311111112121223.",
    ".32222222222223.",
    "33.3........3.33",
    "................",
    "................",
  ],
  [
    "................",
    "................",
    "..333...........",
    ".30013.3333.....",
    "3111113211233...",
    "31111112121123..",
    ".311111212122333",
    "..3222222222223.",
    "...3..........33",
    "..............33",
    "................",
    "................",
  ],
];

// ---------------------------------------------------------------- pickups

export const COIN = [
  ["..3333..", ".301113.", "30111123", "30121123", "30121123", "30111123", ".311223.", "..3333.."],
  ["...33...", "..3013..", "..3013..", "..3123..", "..3123..", "..3113..", "..3123..", "...33..."],
  ["...33...", "...33...", "...33...", "...33...", "...33...", "...33...", "...33...", "...33..."],
];

export const HEART = [".33.33..", "3223223.", "3022223.", "3222223.", ".32223..", "..323...", "...3....", "........"];

// ---------------------------------------------------------------- colour

/*
  SELECT turns the colour on, like slotting the cartridge into the colour handheld: every
  piece keeps its four tones and gets its own little palette, the way the old 8-bit consoles
  gave each sprite three colours and an outline. The colours come from one short list.
*/

export type Palette = Readonly<Record<string, string>>;

const C = {
  ink: "#181018",
  white: "#f8f8f8",
  sky: "#a8e4fc",
  cloud: "#78a8d8",
  leaf: "#58d854",
  moss: "#00a844",
  pine: "#005800",
  canopy: "#48a858",
  canopyLit: "#88d070",
  canopyDark: "#2c7c40",
  sand: "#fce0a8",
  ochre: "#f0b060",
  clay: "#c07838",
  bark: "#884818",
  soil: "#502808",
  brick: "#c84c0c",
  brickLit: "#fc9838",
  mortar: "#58180c",
  gold: "#f8b800",
  amber: "#c87800",
  stoneLit: "#e8e8e8",
  stone: "#b0b0b8",
  stoneDark: "#787880",
  slate: "#303038",
  red: "#f83838",
  crimson: "#a81000",
  lime: "#b8f818",
  olive: "#a8b838",
  swamp: "#5c6c18",
  yellow: "#f8d800",
  blue: "#6888fc",
} as const;

/** The original four greens as a palette. */
export const MONO: Palette = Object.fromEntries(SHADES.map((c, i) => [i, c]));

const tones = (a: string, b: string, c: string, d: string): Palette => ({ 0: a, 1: b, 2: c, 3: d });

export const COLOR = {
  sky: C.sky,
  /** the HUD, the menus and the words: a white band with dark letters */
  ui: tones(C.white, C.blue, C.blue, C.ink),
  ground: { ...tones(C.sand, C.clay, C.bark, C.soil), g: C.leaf, G: C.moss },
  dirt: tones(C.ochre, C.clay, C.bark, C.soil),
  brick: tones(C.brickLit, C.brick, C.brick, C.mortar),
  question: tones(C.white, C.gold, C.brick, C.mortar),
  used: tones(C.ochre, C.clay, C.clay, C.soil),
  hard: tones(C.stoneLit, C.stone, C.stoneDark, C.slate),
  sand: tones(C.sand, C.ochre, C.clay, C.bark),
  branch: tones(C.ochre, C.clay, C.bark, C.soil),
  spring: tones(C.white, C.red, C.crimson, C.ink),
  spikes: tones(C.white, C.stone, C.stoneDark, C.slate),
  /** the ribbon hangs red and goes up green once you pass */
  post: tones(C.leaf, C.red, C.bark, C.ink),
  pole: tones(C.white, C.lime, C.moss, C.pine),
  flag: tones(C.white, C.red, C.red, C.crimson),
  nest: tones(C.ochre, C.ochre, C.clay, C.bark),
  plant: tones(C.lime, C.leaf, C.moss, C.pine),
  tree: tones(C.lime, C.leaf, C.bark, C.pine),
  cloud: tones(C.white, C.white, C.white, C.cloud),
  far: tones(C.canopyLit, C.canopy, C.canopyDark, C.canopyDark),
  coin: tones(C.white, C.gold, C.amber, C.soil),
  heart: tones(C.white, C.red, C.red, C.ink),
  calango: tones(C.white, C.leaf, C.gold, C.pine),
  carcara: tones(C.white, C.sand, C.bark, C.ink),
  sapo: tones(C.yellow, C.olive, C.swamp, C.ink),
  /** loose bits: broken rock, the dust of the second hop, the streaks of an updraft */
  chip: C.stoneDark,
  puff: C.white,
  wind: [C.white, "#d0f0fc"],
};

/** The soldadinho's own colours, the same as the bird that narrates the site. */
export const BIRD_COLOR: Palette = {
  k: C.ink, w: C.white, r: "#f83838", R: "#c01820", l: "#ff8070", n: "#302840", N: "#585078",
  e: C.ink, s: "#d0c8dc", p: "#f8a0b0", b: "#4a4250", h: "#e09078",
};

// ---------------------------------------------------------------- font

/** A tiny coin for the HUD, the height of a letter. */
export const COIN_MINI = [".33.", "3013", "3013", "3113", ".33."];

/** 3×5 capitals and digits on a 4px advance, chunky like an old handheld's HUD. "*" is the little ×. */
export const FONT: Record<string, string[]> = {
  A: [".#.", "#.#", "###", "#.#", "#.#"],
  B: ["##.", "#.#", "##.", "#.#", "##."],
  C: [".##", "#..", "#..", "#..", ".##"],
  D: ["##.", "#.#", "#.#", "#.#", "##."],
  E: ["###", "#..", "##.", "#..", "###"],
  F: ["###", "#..", "##.", "#..", "#.."],
  G: [".##", "#..", "#.#", "#.#", ".##"],
  H: ["#.#", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  J: ["..#", "..#", "..#", "#.#", ".#."],
  K: ["#.#", "#.#", "##.", "#.#", "#.#"],
  L: ["#..", "#..", "#..", "#..", "###"],
  M: ["#.#", "###", "###", "#.#", "#.#"],
  N: ["##.", "#.#", "#.#", "#.#", "#.#"],
  O: [".#.", "#.#", "#.#", "#.#", ".#."],
  P: ["##.", "#.#", "##.", "#..", "#.."],
  Q: [".#.", "#.#", "#.#", "##.", ".##"],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  S: [".##", "#..", ".#.", "..#", "##."],
  T: ["###", ".#.", ".#.", ".#.", ".#."],
  U: ["#.#", "#.#", "#.#", "#.#", "###"],
  V: ["#.#", "#.#", "#.#", "#.#", ".#."],
  W: ["#.#", "#.#", "###", "###", "#.#"],
  X: ["#.#", "#.#", ".#.", "#.#", "#.#"],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."],
  Z: ["###", "..#", ".#.", "#..", "###"],
  "0": ["###", "#.#", "#.#", "#.#", "###"],
  "1": [".#.", "##.", ".#.", ".#.", "###"],
  "2": ["##.", "..#", ".#.", "#..", "###"],
  "3": ["##.", "..#", ".#.", "..#", "##."],
  "4": ["#.#", "#.#", "###", "..#", "..#"],
  "5": ["###", "#..", "##.", "..#", "##."],
  "6": [".##", "#..", "###", "#.#", "###"],
  "7": ["###", "..#", ".#.", ".#.", ".#."],
  "8": ["###", "#.#", "###", "#.#", "###"],
  "9": ["###", "#.#", "###", "..#", "##."],
  "-": ["...", "...", "###", "...", "..."],
  "!": [".#.", ".#.", ".#.", "...", ".#."],
  "*": ["...", "#.#", ".#.", "#.#", "..."],
  ".": ["...", "...", "...", "...", ".#."],
  ":": ["...", ".#.", "...", ".#.", "..."],
  "?": ["##.", "..#", ".#.", "...", ".#."],
  "'": [".#.", ".#.", "...", "...", "..."],
  ",": ["...", "...", "...", ".#.", "#.."],
  ">": ["#..", ".#.", "..#", ".#.", "#.."],
  // for the ASCII art on the title screen
  "<": ["..#", ".#.", "#..", ".#.", "..#"],
  _: ["...", "...", "...", "...", "###"],
  "/": ["..#", "..#", ".#.", "#..", "#.."],
  "\\": ["#..", "#..", ".#.", "..#", "..#"],
  "|": [".#.", ".#.", ".#.", ".#.", ".#."],
  "(": ["..#", ".#.", ".#.", ".#.", "..#"],
  ")": ["#..", ".#.", ".#.", ".#.", "#.."],
  "`": ["#..", ".#.", "...", "...", "..."],
  "~": ["...", "...", ".##", "##.", "..."],
  "@": [".#.", "###", "###", "###", ".#."],
  o: ["...", ".#.", "#.#", ".#.", "..."],
  "=": ["...", "###", "...", "###", "..."],
  "%": ["#.#", "..#", ".#.", "#..", "#.#"],
  "#": ["#.#", "###", "#.#", "###", "#.#"],
  "[": ["##.", "#..", "#..", "#..", "##."],
  "]": [".##", "..#", "..#", "..#", ".##"],
};

/*
  The soldadinho in ASCII for the title screen, perched on a branch: upright, looking left,
  the red crest swept back, the red band across the white chest, the dark wing and the long
  tail hanging below the branch. 120 columns by 70 rows, far finer than the 160×144 screen
  can draw in its own letters, so the console lays it over the glass as tiny text. Every
  character on the edge of the silhouette is drawn darkest (the white body's "." and ":" there
  become "#"), so the outline holds up against the pale screen.
*/
export const ASCII_BIRD: string[] = [
  "                                                                 #%%%",
  "                                                                #%%%%#",
  "                                                                #%%%%####",
  "                                                                #%%%%%%########  #",
  "                                                           ##%  #%%%%%%%%#############",
  "                                                              #%  %%%@@@%%%#%##%########",
  "                                                                 ## #####@@@@@%%%%%%######",
  "                                                                  #:....%@@@@%@%%%%%%%%%%##",
  "                                                                  #:.@@...@@%##%%%%%%%%%%%%##",
  "                                                                 #:..@@..........#%%%%%%%%%%##",
  "                                                                 #:..............#:-*%%%%%%%%##",
  "                                                                 #:.......#----###::::-#%%%%%%##",
  "                                                                 #:....####:::---::::::-+%%%%%###",
  "                                                                ###--###::::::::::::::::-=%%%%###",
  "                                                              ###:-*###+++=*----------=---*%%####",
  "                                                           ####:-*#################+-::....:=*+*#",
  "                                                        ####:::=###########*=:.................:##",
  "                                                      ###.::::=#######*=:........................##",
  "                                                    ###.::::-*####+-..............................#",
  "                                                   ##..:::-++=+-:...........................:.....#",
  "                                                  ##.:::.:.:........:................:::::::::::::##",
  "                                                 ##.::...............:..........:..:::::::::...:::.#",
  "                                                  #::..............:.............:::::::::..:::::::#",
  "                                                 ##:..............:....:.......::::::......:::::--=#",
  "                                                ##:..:........::::::::::::::.:::::....:::###----==##",
  "%#                                              #:..::.......:::::-:...:::::::::...:######         #",
  " %%%%                                           #..::......:.:::::-:...::..::.:::####           %###",
  "       %%%#                                    ##.:...:::.::.::::-:.::::::::::####            @#-:##",
  "           ##%##                              ##.:::.::::::::::---:##--#-----##             #@#--##",
  "                %%##                         ##:::::.::::::::----=##                  #%%%@@@+--:#",
  "                   #%%%%#                    #-=::::::::::::----###               ##%%%%%@@%=---:#",
  "                         #%%       ##       ##*:.::::::::::#-#-=#                ###%%%%@@#----:##",
  "                             %%%#++#        #+##.::.:::::::#             ########%#%@%@@@+--:::##",
  "                                 %%#           #....:::::::#--=##########%%##%%#%%@@%@@%----####",
  "                                   @%##        #:..:::::::::--####**#%%%%%#%@%%%%%@@@@       ##",
  "                                           ###-#..::::::::::-#%%###%%%@@%%%@%%@%@@@@#",
  "                                           ##%-:::::::::::::-%%##%@@@@@%%@@%%@@@@@@",
  "                                          #%%%::::::####----%@%%@@@@@@%%%@%@@@@@@",
  "                                         #%%%-:###--#       @@%%@@@@@%@@@%@@@@@%",
  "                                        ##%@@-##            %%@@@@@@@@@@@@@@@@",
  "                                        #*@@#-#             @@@%@@@@@@@@@@@@",
  "                                        ##%@=:----######---=%@@@@@@@@@@@@@@",
  "                                        %%@*:::::::::###---=#@@@@@@@@@@@@+=+%%",
  "                                       #%@@=:::::::###::::::::@@@@@@@@@%**+-=%#",
  "                                        %@@:::::::##:::......::@@@@@@@%%%%%%#+#@@#",
  "                                        #++:::#####::...::::::#%%%%@%++%@@@%#%@@@%%#",
  "                                        #*-:::#:::::...::##===%%%%%       #@@@@#@%%#",
  "                                        %=#::##:.....:::#@====%%%#          @@%@@@@%#",
  "                                         #####::....::##%                  @@++++%@@%#",
  "                                         #:::::....::##%%                  %        %%%###",
  "                                         #:......:::%@@@                               %@%%%",
  "                                         #::::::::#@@@@                                   #%%%%#",
  "                                        %##+++##%%@@@@@                                         #%%##",
  "                                       %%@@@@%%%@@@@@@                                               #%%%#",
  "                                       %@@@@%%%%@%@@@#                                                   #%%%#%%",
  "                                      @%@@@@%%@@%@@@@                                                       #@@@%###",
  "                                     %@%@@@%%@@@%@@@                                                           %@@@%%%%###",
  "                                    #@%@@@%%@@@%@@@#                                                                     %",
  "                                    @@%%@@@@@@@@@@@",
  "                                   @@%%@@@@@@@@@@@",
  "                                   @@%@@@@@@@@@@@@",
  "                                  @@%@@@@@@@@@@@@",
  "                                 #@@@@@%@@@@@@@@#",
  "                                 @@%@@@@@@@@@@@%",
  "                                %@@@@@%@@@@@@@@",
  "                                @@@@@@@@@@@@@@%",
  "                               #@@@@@@@@@@@@@@",
  "                               @@@@@@@@@@@@@@",
  "                               @@@@@@@@@@@@@",
  "                                %##====##",
];

/** per-character shade for ASCII_BIRD: "1" light (the white body), "2" mid (its outline, the red, the branch), "3" dark */
export const ASCII_BIRD_SHADE: string[] = [
  "                                                                 3222",
  "                                                                322223",
  "                                                                322223333",
  "                                                                322222233333333  3",
  "                                                           332  3222222223333333333333",
  "                                                              32  2223332223233233333333",
  "                                                                 33 3333333333222222333333",
  "                                                                  3211112333323222222222233",
  "                                                                  321331113323322222222222233",
  "                                                                 32113311111111113222222222233",
  "                                                                 321111111111111132222222222233",
  "                                                                 3211111113222233322222322222233",
  "                                                                 32111133332222222222222222222333",
  "                                                                333223332222222222222222222222333",
  "                                                              33322222222222222222222222222223333",
  "                                                           33332222222222222222222222221111222223",
  "                                                        333322222222222222222211111111111111111233",
  "                                                      333122222222222222211111111111111111111111133",
  "                                                    33312222222222221111111111111111111111111111113",
  "                                                   331122222222221111111111111111111111111112111113",
  "                                                  33122212121111111121111111111111111222222222222233",
  "                                                 331221111111111111112111111111121122222222211122213",
  "                                                  32211111111111111211111111111112222222221122222223",
  "                                                 332111111111111112111121111111222222111111222222223",
  "                                                3321121111111122222222222222122222111122233322222233",
  "23                                              321122111111122222221112222222221112333333         3",
  " 2222                                           3112211111121222222211122112212223333           3333",
  "       2223                                    33121112221221222222122222222223333            332233",
  "           33233                              331222122222222222222332232222233             3332233",
  "                2233                         33222221222222222222233                  333333322223",
  "                   322223                    3222222222222222222333               3333333333222223",
  "                         322       33       332212222222222323223                33333333332222233",
  "                             2223223        3233122122222223             333333333333333322222233",
  "                                 223           3111122222223222333333333333333333333333322223333",
  "                                   2233        321122222222222333322333333333333333333       33",
  "                                           333231122222222222333333333333333333333333",
  "                                           3332222222222222223333333333333333333333",
  "                                          333322222233332222333333333333333333333",
  "                                         333322333223       33333333333333333333",
  "                                        33333233            333333333333333333",
  "                                        3233323             3333333333333333",
  "                                        33332222223333332222333333333333333",
  "                                        33322222222223332222333333333333322233",
  "                                       3333222222223332222222233333333332222233",
  "                                        333222222233222111111223333333333333323333",
  "                                        32222233333221112222223333333223333333333333",
  "                                        322222222222111223322233333       3333333333",
  "                                        32322222111112223322223333          333333333",
  "                                         3222222111122333                  33222233333",
  "                                         3222221111223333                  3        322333",
  "                                         321111112223333                               22222",
  "                                         32222222233333                                   322223",
  "                                        333222333333333                                         32233",
  "                                       333333333333333                                               32223",
  "                                       333333333333333                                                   3222322",
  "                                      333333333333333                                                       32222333",
  "                                     333333333333333                                                           22222222333",
  "                                    3333333333333333                                                                     2",
  "                                    333333333333333",
  "                                   333333333333333",
  "                                   333333333333333",
  "                                  333333333333333",
  "                                 3333333333333333",
  "                                 333333333333333",
  "                                333333333333333",
  "                                333333333333333",
  "                               333333333333333",
  "                               33333333333333",
  "                               3333333333333",
  "                                333222233",
];

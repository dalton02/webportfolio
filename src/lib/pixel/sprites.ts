/*
  Original pixel art, drawn as character maps. Each character is one pixel and
  looks up its colour in the sprite's palette; "." is transparent.
  Nothing here is traced from a game, only the palette mood is borrowed.
*/

import daltonPng from "./png/dalton.png";
import daltonHeadPng from "./png/dalton-head.png";
import daltonHiPng from "./png/dalton-hi.png";
import daltonTalkPng from "./png/dalton-talk.png";
import daltonUmbrellaPng from "./png/dalton-umbrella.png";
import daltonWindPng from "./png/dalton-wind.png";
import soldadinhoPng from "./png/soldadinho.png";
import soldadinhoChirpPng from "./png/soldadinho-chirp.png";
import soldadinhoColdPng from "./png/soldadinho-cold.png";
import soldadinhoWindPng from "./png/soldadinho-wind.png";

export type Sprite = {
  w: number;
  h: number;
  palette: Record<string, string>;
  frames: string[][];
};

const K = "#181018"; // outline used by almost every sprite
const W = "#f8f8f8";

function sprite(palette: Record<string, string>, ...frames: string[][]): Sprite {
  const h = frames[0].length;
  const w = frames[0][0].length;
  if (import.meta.env?.DEV) {
    for (const f of frames)
      for (const [i, row] of f.entries())
        if (row.length !== w || f.length !== h) console.warn(`sprite row ${i} is ${row.length} wide, expected ${w}`, f);
  }
  return { w, h, palette: { k: K, w: W, ...palette }, frames };
}

/** Swaps palette entries, e.g. a green gem into a blue one. */
export function recolor(s: Sprite, palette: Record<string, string>): Sprite {
  return { ...s, palette: { ...s.palette, ...palette } };
}

// ---------------------------------------------------------------- HUD

const HEART = [
  ".kkk.kkk.",
  "krrrkrrrk",
  "krwrrrrrk",
  "krrrrrrrk",
  ".krrrrrk.",
  "..krrrk..",
  "...krk...",
  "....k....",
];

const heartCache = new Map<number, Sprite>();

/** A heart filled by quarters (0–4): bottom-left, top-left, top-right, bottom-right. */
export function heart(quarters: number): Sprite {
  const q = Math.max(0, Math.min(4, Math.round(quarters)));
  const cached = heartCache.get(q);
  if (cached) return cached;
  const order = ["bl", "tl", "tr", "br"].slice(0, q);
  const rows = HEART.map((row, y) =>
    [...row]
      .map((c, x) => {
        if (c !== "r" && c !== "w") return c;
        const quad = (y < 4 ? "t" : "b") + (x <= 4 ? "l" : "r");
        if (!order.includes(quad)) return "e";
        return c;
      })
      .join(""),
  );
  const s = sprite({ r: "#f83838", e: "#584850" }, rows);
  heartCache.set(q, s);
  return s;
}

export const gem = sprite(
  { l: "#a8f8a8", g: "#40d840", d: "#108010" },
  [
    "...k...",
    "..klk..",
    ".kllgk.",
    "klwlgdk",
    "kllggdk",
    "kllggdk",
    "kllggdk",
    "klggddk",
    ".kggdk.",
    "..kdk..",
    "...k...",
  ],
);
export const gemBlue = recolor(gem, { l: "#c8e8f8", g: "#58a8f8", d: "#2050c8" });
export const gemRed = recolor(gem, { l: "#f8c0c0", g: "#f85858", d: "#b01010" });

export const cursor = sprite(
  {},
  [
    "kk....",
    "kwk...",
    "kwwk..",
    "kwwwk.",
    "kwwk..",
    "kwk...",
    "kk....",
  ],
);

export const nextArrow = sprite(
  {},
  [
    "kkkkkkk",
    "kwwwwwk",
    ".kwwwk.",
    "..kwk..",
    "...k...",
  ],
);

// ---------------------------------------------------------------- characters

/*
  Dalton and the soldadinho are PNG sprite sheets in ./png, so they can be opened and touched
  up in a pixel editor: one strip per animation, frames side by side, one art pixel per image
  pixel. PixelSprite plays them like the char-map sprites.
*/
export type Sheet = { src: string; w: number; h: number; frames: number };

const sheets: Sheet[] = [];
function sheet(src: string, w: number, h: number, frames = 1): Sheet {
  const s = { src, w, h, frames };
  sheets.push(s);
  return s;
}

// held on to, so the browser keeps them decoded
const loaded: HTMLImageElement[] = [];

/**
  Fetches and decodes every sheet up front. A pose seen for the first time (the wave on hover,
  the umbrella when it rains) would otherwise blink out for a frame while its image loads.
*/
export function preloadSheets() {
  if (loaded.length) return;
  for (const s of sheets) {
    const img = new Image();
    img.src = s.src;
    img.decode().catch(() => {});
    loaded.push(img);
  }
}

/**
  Soldadinho, a soldadinho-do-araripe: the tiny white bird with a red crest and black
  wings that only lives on the Chapada do Araripe, next to Crato. He narrates the site,
  drawn side-on as a round little ball with a big shiny eye, rosy cheek and the crest
  curling forward over the beak. Two frames: eyes open, blink.
*/
export const soldadinho = sheet(soldadinhoPng, 20, 18, 2);
/** Mid-chirp, beak wide open; shown for a beat when you hover him. */
export const soldadinhoChirp = sheet(soldadinhoChirpPng, 20, 18);
/** Shivering in the rain: fluffed up, heavy-lidded, the wet crest drooping and dripping. */
export const soldadinhoCold = sheet(soldadinhoColdPng, 22, 18, 4);
/** Crouched against a gale from the right, crest swept back, a feather blowing off. */
export const soldadinhoWind = sheet(soldadinhoWindPng, 22, 18, 4);

/**
  Dalton himself, facing the camera: strong build, wavy brown hair, navy glasses, a
  moustache, gold chain, a loose petrol-blue Hawaiian shirt in the Tommy Vercetti mood with
  tone-on-tone palm fronds, baggy brown trousers and green-and-yellow havaianas. Idle loop of six
  frames: stand, stand, breathe in, hair strand sways, settle, blink. 12 clear columns on each
  side leave room for the raised arm, so every pose shares one canvas and never jumps.
*/
export const dalton = sheet(daltonPng, 72, 65, 6);
/** Saying hi, forearm up and palm open. */
export const daltonHi = sheet(daltonHiPng, 72, 65);
/** The same raised arm with the fist closed round an umbrella's shaft; four still frames and a blink. */
export const daltonUmbrella = sheet(daltonUmbrellaPng, 72, 65, 5);
/** In a gale from the right: leaning into it, eyes shut, hair and shirt streaming left. */
export const daltonWind = sheet(daltonWindPng, 72, 65, 4);
/** His head and shoulders, the idle loop, for the pause menu. */
export const daltonHead = sheet(daltonHeadPng, 24, 27, 6);
/** The head with the jaw dropped a pixel on frame 1, for talking. */
export const daltonTalk = sheet(daltonTalkPng, 24, 27, 2);


/**
  A soft oval shadow to stand characters on the grass, drawn at the size it is shown,
  so it can use the same 3px art pixel as the field instead of being blown up.
*/
export function shadowOval(w: number, h: number, color = "#18481870"): Sprite {
  const rows = Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) =>
      ((x + 0.5 - w / 2) / (w / 2)) ** 2 + ((y + 0.5 - h / 2) / (h / 2)) ** 2 <= 1 ? "k" : ".",
    ).join(""),
  );
  return sprite({ k: color }, rows);
}

export const groundShadow = shadowOval(24, 5);

/** A small soft oval for the soldadinho's feet; recolour `k` to match whatever he stands on. */
export const birdShadow = sprite({ k: "#18481898" }, [
  "...kkkkkkkkk...",
  ".kkkkkkkkkkkkk.",
  "...kkkkkkkkk...",
]);

// ---------------------------------------------------------------- props

/*
  Props sit on the overworld, so they are drawn to be shown at scale 3, the same
  pixel size as the background canvas (Background.svelte PX).
*/

/** Closed and open; the open frame shows the lid's underside and the loot inside. */
export const chest = sprite(
  { H: "#f8d898", l: "#e8b878", b: "#c89058", m: "#a06838", d: "#704828", t: "#482810", s: "#f8f0b0", y: "#f8d040", o: "#d09020", O: "#905010", n: "#301808", g: "#40d840", r: "#f85858" },
  [
    "...kkkkkkkkkkkkkkk...",
    "..ksyHHHHHHHHHHHyok..",
    ".ksylllllllllllllyok.",
    ".ksylllllllllllllyok.",
    "ksybbbbbkkkkkbbbbbyok",
    "ksymmmmmksyykmmmmmyok",
    "ksydddddkyyokdddddyok",
    "kkkkkkkkkykokkkkkkkkk",
    "ksylllllkykoklllllyok",
    "ksybbbbbkOOOkbbbbbyok",
    "ksybbbbbbkkkbbbbbbyok",
    "ksyddddddddddddddmyok",
    "ksylllllllllllllllyok",
    "ksybbbbbbbbbbbbbbbyok",
    "ksybbbbbbbbbbbbbbbyok",
    "ksyddddddddddddddmyok",
    "ksymmmmmmmmmmmmmmmyok",
    "kOOddddddddddddddmOOk",
    ".kkkkkkkkkkkkkkkkkkk.",
  ],
  [
    "...kkkkkkkkkkkkkkk...",
    "..kOotttttttttttoOk..",
    ".kOonnnnnnnnnnnnnoOk.",
    ".kkkkkkkkkkkkkkkkkkk.",
    "ksynnnnkkkkkkknnnnyok",
    "ksynnkksyyrsyygokkyok",
    "ksykksyyysyyyyyyokyok",
    "kkkkkkkkkkkkkkkkkkkkk",
    "ksylllllkyyoklllllyok",
    "ksybbbbbkykokbbbbbyok",
    "ksybbbbbkOkOkbbbbbyok",
    "ksyddddddkkkdddddmyok",
    "ksylllllllllllllllyok",
    "ksybbbbbbbbbbbbbbbyok",
    "ksybbbbbbbbbbbbbbbyok",
    "ksyddddddddddddddmyok",
    "ksymmmmmmmmmmmmmmmyok",
    "kOOddddddddddddddmOOk",
    ".kkkkkkkkkkkkkkkkkkk.",
  ],
);

export const sign = sprite(
  { H: "#f8d898", l: "#e8b878", b: "#c89058", m: "#a06838", d: "#704828", t: "#482810", i: "#a8a8b8", g: "#58a840", G: "#307830" },
  [
    ".kkkkkkkkkkkkkkkk.",
    "klllllllllllllllbk",
    "klibbbbbbbbbbbbimk",
    "klbttttbttttttbbmk",
    "klbHHHHbHHHHHHbbmk",
    "kddddddddddddddddk",
    "klltttttttlttttlbk",
    "kliHHHHHHHbHHHHimk",
    "kmmmmmmmmmmmmmmmmk",
    "kddddddddddddddddk",
    ".kkkkkkkttkkkkkkk.",
    ".......klmk.......",
    ".......klmk.......",
    ".......kbmk.......",
    "....k.kkkkbmkk.k..",
    "...kgkgkgGkkGgkgk.",
    "...kkkkkkkkkkkkkk.",
  ],
);

/** Flag up, so there's mail to send; its tip dips on the second frame, like a breeze. */
export const mailbox = sprite(
  { R: "#f88878", r: "#e05048", m: "#b83038", d: "#801828", y: "#f8d040", o: "#c88820", s: "#f8f0b0", i: "#d0d0c8", I: "#787870", L: "#e8b878", B: "#c89058", M: "#a06838", D: "#704828" },
  [
    ".....................kkkkkkkk.",
    "....................kiIssssssk",
    "....................kiIyyyyyyk",
    "....................kiIyyyyyyk",
    "........kkkkkkkkkkkkkiIooooook",
    "......kkRRRRRRRRRRRRkiIkkkkkk.",
    "....kkRRRRRRRRRRRRRRRiIk......",
    "...krkRRrRrrrrrrrrrrRiIRk.....",
    "..krrkrrrRrrrrrrrrrrriIRRk....",
    "..krmkrrrRrrrrrrrrrrriIrRk....",
    ".kymmkrrrRrrrrrrrrrrriIrrk....",
    ".kommkrrrRrrrrrrrrrrryorrk....",
    "..kmmkrrrRrrrrrrrrrrrrrrrk....",
    "..kmmkrrrRrrrrrrrrrrrrrrrk....",
    "..kmmkmmmmmmmmmmmmmmmmmmmk....",
    "..kmmkmmmmmmmmmmmmmmmmmmmk....",
    "..kddkdddddddddddddddddddk....",
    "...kkkkkLLLLLLLLLLLLkkkkk.....",
    ".......kDDDDDDDDDDDDk.........",
    "........kkkkLBMDkkkk..........",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "............kkkk..............",
  ],
  [
    ".....................kkkkkk...",
    "....................kiIsssskk.",
    "....................kiIyyyyssk",
    "....................kiIyyyyyyk",
    "........kkkkkkkkkkkkkiIooooyyk",
    "......kkRRRRRRRRRRRRkiIkkkkook",
    "....kkRRRRRRRRRRRRRRRiIk...kk.",
    "...krkRRrRrrrrrrrrrrRiIRk.....",
    "..krrkrrrRrrrrrrrrrrriIRRk....",
    "..krmkrrrRrrrrrrrrrrriIrRk....",
    ".kymmkrrrRrrrrrrrrrrriIrrk....",
    ".kommkrrrRrrrrrrrrrrryorrk....",
    "..kmmkrrrRrrrrrrrrrrrrrrrk....",
    "..kmmkrrrRrrrrrrrrrrrrrrrk....",
    "..kmmkmmmmmmmmmmmmmmmmmmmk....",
    "..kmmkmmmmmmmmmmmmmmmmmmmk....",
    "..kddkdddddddddddddddddddk....",
    "...kkkkkLLLLLLLLLLLLkkkkk.....",
    ".......kDDDDDDDDDDDDk.........",
    "........kkkkLBMDkkkk..........",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "...........kLBMDk.............",
    "............kkkk..............",
  ],
);

export const house = sprite(
  { r: "#e86848", R: "#f89878", m: "#c04830", d: "#882818", s: "#f8e8c8", S: "#fff8e8", h: "#d0b890", t: "#704828", b: "#c08850", y: "#f8d040", G: "#88c8f8", q: "#a8a8a0", Q: "#d0d0c8", f: "#a89878" },
  [
    "............kk....",
    ".......kkkkkQQk...",
    "......kRrrmkqqk...",
    ".....kRrrmrrqqk...",
    "....kddddddddqk...",
    "...kRrrRrrmrrmk...",
    "..kRrrRrrmrrmrrk..",
    ".kddddddddddddddk.",
    "kddddddddddddddddk",
    "dddddddddddddddddd",
    "kkhhhhhhhhhhhhhhkk",
    ".kStttsttttsttthk.",
    ".kStGtstbmtstGthk.",
    ".kStttstbmtsttthk.",
    ".kSsssstymtssshhk.",
    ".kSsssstbmtssshhk.",
    "kffffffhhhhffffffk",
    ".kkkkkkkkkkkkkkkk.",
  ],
);

export const book = sprite(
  { b: "#2850a0", l: "#5888d8", B: "#183878", y: "#f8d040", o: "#c88820", s: "#f8f0b0", p: "#f8f0d0", P: "#d8c8a0", r: "#f85858" },
  [
    ".kkkkkkkkkkk..",
    "klllllllllllk.",
    "kBlbbbbbbbbBPk",
    "kBlyyyyyyyobpk",
    "kBlybbsbbbobPk",
    "kBlyooooooobpk",
    "kBlbbbbbbbbBPk",
    "kBlbbbyybbbbpk",
    "kBlbbysyobbBPk",
    "kBlbbbyobbbBpk",
    "kBlbbbbbbbbBPk",
    "kBBBBBBBBBBBpk",
    ".kpPpPpPpPpPpk",
    "..kkkkkkkrkkk.",
    ".........k....",
  ],
);

export const scroll = sprite(
  { S: "#fffbe8", e: "#c08850", E: "#704828", p: "#f8f0d0", h: "#e0c890", H: "#b89860", r: "#d86048", R: "#f89878", d: "#983828", t: "#a08060" },
  [
    "kkSSSSSSSSSkk",
    "eepppppppphEE",
    "kkHHHHHHHHHkk",
    ".kSppppppphk.",
    ".kSttttttphk.",
    ".kSppppppphk.",
    ".kSttttprphk.",
    ".kSpppprRrhk.",
    ".kSpppppdphk.",
    ".kSppppppphk.",
    "kkSSSSSSSSSkk",
    "eepppppppphEE",
    "kkHHHHHHHHHkk",
  ],
);

export const sparkle = sprite(
  { y: "#f8f0a0" },
  [
    "..k..",
    ".kyk.",
    "kywyk",
    ".kyk.",
    "..k..",
  ],
  [
    ".....",
    "..k..",
    ".kwk.",
    "..k..",
    ".....",
  ],
);

// ---------------------------------------------------------------- skill icons

export const server = sprite(
  { j: "#e0e8f0", s: "#a8b8c8", d: "#586878", q: "#384858", g: "#40d840", G: "#a8f8a8", y: "#f8d040", r: "#f85858" },
  [
    "................",
    "kkkkkkkkkkkkkkkk",
    "kjjjjjjjjjjjjjjk",
    "kjGsgsskqkqkqsdk",
    "kddddddddddddddk",
    "kkkkkkkkkkkkkkkk",
    "kjjjjjjjjjjjjjjk",
    "kjgsysskqkqkqsdk",
    "kddddddddddddddk",
    "kkkkkkkkkkkkkkkk",
    "kjjjjjjjjjjjjjjk",
    "kjrsssskqkqkqsdk",
    "kddddddddddddddk",
    "kkkkkkkkkkkkkkkk",
    "..kdk......kdk..",
    "..kkk......kkk..",
  ],
);

export const shield = sprite(
  { b: "#2850a0", l: "#58a8f8", B: "#183878", y: "#f8d040", o: "#c88820", O: "#905010", s: "#f8f0b0" },
  [
    "kkkkkkkkkkkkkkkk",
    "kssyyyyyyyyyyyok",
    "kyllbbbbbbbbbBok",
    "kylbbbkkkkbbbBok",
    "kylbbkbbbbkbbBok",
    "kylbbkbbbbkbbBok",
    "kylbkkkkkkkkbBok",
    "kylbksyyyyokbBok",
    "kylbksykkyokbBok",
    ".kybkyykkyokBok.",
    ".kybkOOOOOOkBok.",
    "..kybkkkkkkBok..",
    "...kybbbbbBok...",
    "....kybbbBok....",
    ".....kyyook.....",
    "......kkkk......",
  ],
);

export const bolt = sprite(
  { y: "#f8d040", s: "#f8f8b0", o: "#c88820" },
  [
    ".........kkkkk..",
    "........ksyyyok.",
    ".......ksywyok..",
    "......ksyyyok...",
    ".....ksyyyok....",
    "....ksyyyokkk...",
    "...ksyyyyyyyok..",
    "....kksyyyyok...",
    "......ksyyok....",
    ".....ksyyok.....",
    "....ksyyok......",
    "...ksyyok.......",
    "...ksyok........",
    "..ksyok.........",
    "..ksok..........",
    "...kk...........",
  ],
);

// ---------------------------------------------------------------- tech overrides
/*
  Toolbox logos that don't survive the automatic pixel pass in PixelIcon.svelte
  (too much detail for 24px), drawn by hand at the same 24x24 size instead.
*/

export const tux = sprite(
  { B: "#303040", D: "#606078", e: "#c8c8d8", y: "#f8c830", o: "#e08818", O: "#985010" },
  [
    "........................",
    "........................",
    "..........kkkk..........",
    ".........kBBBBk.........",
    "........kBDBBBBk........",
    ".......kBDBBBBBBk.......",
    ".......kBwwBBwwBk.......",
    ".......kBwkBBkwBk.......",
    ".......kBByyyyBBk.......",
    "......kBBoyyyyoBBk......",
    "......kBBwooooeBBk......",
    ".....kBBwwwwwwweBBk.....",
    ".....kBwwwwwwwwweBk.....",
    "....kBBwwwwwwwwweBBk....",
    "...kBBkwwwwwwwwwekBBk...",
    "...kBBkwwwwwwwwwekBBk...",
    "...kBkwwwwwwwwwwwekBk...",
    "....kBwwwwwwwwwwweBk....",
    ".....kBwwwwwwwweeBk.....",
    "....kkyyykkkkkkyyykk....",
    "...kyyyyyoBBBByyyyyok...",
    "...kOOOOOkkkkkkOOOOOk...",
    "....kkkkk......kkkkk....",
    "........................",
  ],
);

export const gopher = sprite(
  { c: "#78d0e8", h: "#c0f0f8", C: "#3890b8", n: "#f0d0a0", p: "#303040" },
  [
    "........................",
    "...kkk............kkk...",
    "..kcck..kkkkkkkk..kcCk..",
    "..kcckkkcccccccckkkcCk..",
    "...kkchhccccccccccCkk...",
    "...khckkkcccccckkkcCk...",
    "..kcckwwwkcccckwwwkcCk..",
    "..kckwwwwwkcckwwwwwkCk..",
    "..kckwwwppkcckppwwwkCk..",
    "..kckwwwppkcckppwwwkCk..",
    "..kcckwwwkcccckwwwkcCk..",
    "..kccckkkcccccckkkccCk..",
    "..kccccccckkkkccccccCk..",
    "..kccccccknkknkcccccCk..",
    "..kccccccknnnnkcccccCk..",
    "..kccccccckwwkccccccCk..",
    "..kccccccckwwkccccccCk..",
    "..kcccccccccccccccccCk..",
    ".knkcccccccccccccccCknk.",
    ".knkcccccccccccccccCknk.",
    "..kcccccccccccccccccCk..",
    "...kkcccccccccccccCkk...",
    "...knnnkkkkkkkkkknnnk...",
    "...kkkkk........kkkkk...",
  ],
);

export const react = sprite(
  { c: "#1898d0", n: "#58d0f8", h: "#c8f4ff" },
  [
    "........................",
    "........................",
    "......ccc......ccc......",
    "......c.ccc..ccc.c......",
    ".....cc...cccc...cc.....",
    ".....c.....cc.....c.....",
    ".....c....cccc....c.....",
    "......c...c..c...c......",
    ".....cccccccccccccc.....",
    "...cccc.cc.kk.cc.cccc...",
    ".ccc..ccc.knnk.ccc..ccc.",
    ".c.....ccknhnnkcc.....c.",
    ".c.....ccknnnnkcc.....c.",
    ".ccc..ccc.knnk.ccc..ccc.",
    "...cccc.cc.kk.cc.cccc...",
    ".....cccccccccccccc.....",
    "......c...c..c...c......",
    ".....c....cccc....c.....",
    ".....c.....cc.....c.....",
    ".....cc...cccc...cc.....",
    "......c.ccc..ccc.c......",
    "......ccc......ccc......",
    "........................",
    "........................",
  ],
);

export const aws = sprite(
  { N: "#232f3e", o: "#f89820" },
  [
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "..NNNN..NN...NN..NNNN...",
    ".....NN.NN...NN.NN......",
    "..NNNNN.NN.N.NN..NNN....",
    ".NN..NN.NNNNNNN.....NN..",
    "..NNNNN..NN.NN..NNNNN...",
    "........................",
    "..oo..............ooooo.",
    "...ooo...........oo..oo.",
    ".....ooooooooooooo...oo.",
    "........ooooooooo.......",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
  ],
);

export const git = sprite(
  { o: "#f05030", s: "#f88060", O: "#c03818" },
  [
    "........................",
    "...........kk...........",
    "..........kssk..........",
    ".........kssssk.........",
    "........kssoossk........",
    "......kkssoooossk.......",
    ".....kwssoooooossk......",
    ".....kswwwwooooossk.....",
    "....ksswwwwwooooossk....",
    "...kssowwwwwoooooossk...",
    "..kssoowwwwwooooooossk..",
    ".kssoooowwwwwooooooossk.",
    ".kOOooooowoowwwwwoooOOk.",
    "..kOOoooowooowwwwwoOOk..",
    "...kOOoowwwoowwwwwOOk...",
    "....kOOwwwwwowwwwwOk....",
    ".....kOwwwwwoowwwOk.....",
    "......kwwwwwoooOOk......",
    ".......kwwwoooOOk.......",
    "........kOOooOOk........",
    ".........kOOOOk.........",
    "..........kOOk..........",
    "...........kk...........",
    "........................",
  ],
);

// ---------------------------------------------------------------- medallion

const MEDALLION = [
  "............kkkk............",
  ".........kkksssskkk.........",
  ".......kksssssssssskk.......",
  "......ksssyyyyyyyyyyyk......",
  ".....kssyyyOOOOOOyyyyyk.....",
  "....kssyyOOOyyyyOOOyyyok....",
  "...kssyOOyyyyyyyyyyOOyook...",
  "..kssyOOyyyyyyyyyyyyOOyook..",
  "..ksyyOyyyyykkkkyyyyyOyyok..",
  ".kssyOyyyyykllllkyyyyyOyook.",
  ".ksyyOyyyykllwlggkyyyyOyyok.",
  ".ksyOOyyyklwllgggdkyyyOOyok.",
  "kssyOyyyykllllgggdkyyyyOyook",
  "kssyOyyyykglggggddkyyyyOyook",
  "kssyOyyyyykgggggdkyyyyyOoook",
  "kssyOyyyyyykgggdkyyyyyyOoook",
  ".ksyOOyyyyyykddkyyyyyyOOook.",
  ".ksyyOyyyyyyykkyyyyyyoOoook.",
  ".ksyyOyyyyyyyyyyyyyyooOoook.",
  "..kyyyOyyyyyyyyyyyyooOoook..",
  "..kyyyOOyyyyyyyyyyooOOoook..",
  "...kyyyOOyyyyyyyyooOOoook...",
  "....kooyyOOOyyyyOOOooook....",
  ".....kooyyyOOOOOOoooook.....",
  "......koooyyyyoooooook......",
  ".......kkooooooooookk.......",
  ".........kkkooookkk.........",
  "............kkkk............",
];
const MEDALLION_PAL = { y: "#f8d040", h: "#f8f8b0", s: "#f8f8d8", o: "#c08018", O: "#905010", g: "#40d840", l: "#a8f8a8", d: "#108010" };

/** Jagged split column per row, so the two halves only fit one way. */
const CUT = [14, 14, 14, 14, 12, 12, 12, 12, 16, 16, 16, 16, 14, 14, 14, 14, 10, 10, 10, 10, 16, 16, 16, 16, 14, 14, 14, 14];

export const medallionLeft = sprite(
  MEDALLION_PAL,
  MEDALLION.map((row, y) => row.slice(0, CUT[y]) + ".".repeat(row.length - CUT[y])),
);
export const medallionRight = sprite(
  MEDALLION_PAL,
  MEDALLION.map((row, y) => ".".repeat(CUT[y]) + row.slice(CUT[y])),
);

// ---------------------------------------------------------------- secrets

/** An old grey handheld cartridge, lost in the grass at the top of the page. */
export const cartridge = sprite(
  { g: "#b8b8c0", G: "#8888a0", l: "#9bbc0f", L: "#306230" },
  [
    "kkkkkkkkkkkkk...",
    "kwgggggggggggk..",
    "kgGgGgGgGgGggGk.",
    "kggggggggggggggk",
    "kgkkkkkkkkkkkkgk",
    "kgkLLLLLLLLLLkgk",
    "kgkllllllllllkgk",
    "kgklllllllLllkgk",
    "kgkllLLLlLLLlkgk",
    "kgklLLLLLLLLLkgk",
    "kgkLLLLLLLLLLkgk",
    "kgkkkkkkkkkkkkgk",
    "kgggggggggggggGk",
    "kggggGGGGgggggGk",
    "kgggggggggggggGk",
    "kGGGGGGGGGGGGGGk",
    "kkGkGkGkGkGkGkkk",
    ".kkkkkkkkkkkkkk.",
  ],
);

/** A clump of grass to hide things behind. */
export const tuft = sprite(
  { h: "#88d058", m: "#58a840", d: "#307830" },
  [
    "...h.......h....h...",
    "..hm..h...hm...hm...",
    "..mm.hm..mmh..mmh.h.",
    ".hmm.mm.hmmm.hmmm.m.",
    ".mmdhmmhmmdmhmmdmhm.",
    "hmdmmmdmmdmmmmdmmmdh",
    "mdmdmdmdmdmdmmdmdmdm",
    "dmddmdddmddmddmddmdd",
  ],
);

/** A gold coin that pops out of Dalton's head when you poke him enough. */
export const coin = sprite(
  { y: "#f8d040", h: "#f8f8b0", o: "#c08018" },
  [
    "..kkkk..",
    ".kyyyyk.",
    "kyhyyyok",
    "kyhyoyok",
    "kyhyoyok",
    "kyhyyyok",
    ".kyyyok.",
    "..kkkk..",
  ],
);

// ---------------------------------------------------------------- weather

/** A frog on a tuft; frame 1 is the croak, eyes shut and throat puffed. Sing to him and it rains. */
export const frog = sprite(
  { g: "#a8e048", G: "#58a840", y: "#f8f0d0" },
  [
    ".kkk......kkk.",
    "kwkgk....kgkwk",
    "kggggkkkkggggk",
    "kggggggggggggk",
    "kgggkkkkkkgggk",
    ".kggyyyyyyggk.",
    "kGkgyyyyyygkGk",
    "kGGkyyyyyykGGk",
    "kGGGkkkkkkGGGk",
    ".kkk......kkk.",
  ],
  [
    ".kkk......kkk.",
    "kkkgk....kgkkk",
    "kggggkkkkggggk",
    "kggggggggggggk",
    "kgggkkkkkkgggk",
    ".kgywwwwwwygk.",
    "kGkywwwwwwykGk",
    "kGGkyyyyyykGGk",
    "kGGGkkkkkkGGGk",
    ".kkk......kkk.",
  ],
);

/** A furled red umbrella stuck in the grass, there for whoever wants the rain gone. */
export const umbrellaShut = sprite(
  { r: "#f85858", R: "#c81818", b: "#704828" },
  [
    "..kkk..",
    "..kbk..",
    "..kbk..",
    "..kbk..",
    "..krk..",
    ".krRrk.",
    ".krRrk.",
    ".krRrk.",
    ".krRrk.",
    ".krRrk.",
    "..krk..",
    "..krk..",
    "...k...",
    "...k...",
  ],
);

export const umbrellaOpen = sprite(
  { r: "#f85858", R: "#c81818", b: "#704828" },
  [
    ".......kk.......",
    ".....kkrrkk.....",
    "...kkrrRRrrkk...",
    "..krrrRRRRrrrk..",
    ".krrrrRRRRrrrrk.",
    "krrrrRRRRRRrrrrk",
    "k.kkk.kbk.kkk.k.",
    "......kbk.......",
    "......kbk.......",
    "......kbk.......",
    "......kbk.......",
    "......kbk.......",
    "....kbkbk.......",
    "....kbbbk.......",
    ".....kkk........",
  ],
);

/** A paper pinwheel on a stick; its four colours chase each other round, which reads as a spin. */
const PINWHEEL = [
  "kkkkkkkkk",
  "kLTTTTTRk",
  "kLLTTTRRk",
  "kLLLTRRRk",
  "kLLLkRRRk",
  "kLLLBRRRk",
  "kLLBBBRRk",
  "kLBBBBBRk",
  "kkkkkkkkk",
  "...kbk...",
  "...kbk...",
  "...kbk...",
  "...kbk...",
  "...kbk...",
  "...kbk...",
];
const BLADES = ["r", "y", "u", "w"];
export const pinwheel = sprite(
  { r: "#f85858", y: "#f8d040", u: "#58a8f8", b: "#b07848" },
  ...[0, 1, 2, 3].map((i) => PINWHEEL.map((row) => row.replace(/[TRBL]/g, (q) => BLADES[("TRBL".indexOf(q) + 4 - i) % 4]))),
);

/** A leather cowboy hat from the sertão, studded on the crown, that the wind carries off. */
export const hat = sprite(
  { b: "#b07848", B: "#704828", h: "#e0b070", y: "#f8d040" },
  [
    ".....kkkkkk.....",
    "....kbbbbbbk....",
    "...kbhbbbbhbk...",
    "..kbbyhbbhybbk..",
    ".kBbbbbbbbbbbBk.",
    "kBBkkkkkkkkkkBBk",
    "kbhhhhhhhhhhhhbk",
    ".kkbbbbbbbbbbkk.",
    "...kkkkkkkkkk...",
  ],
);

/**
  The big umbrella Dalton holds up in the rain: a red dome in alternating panels, a scalloped
  hem and a long shaft down the middle to his raised hand. Built from an ellipse rather than
  drawn by hand, so the dome stays round at this width.
*/
export const bigUmbrella = (() => {
  const R = 24; // half width of the dome
  const DOME = 11;
  const SHAFT = 13;
  const W = R * 2 + 1;
  const inside = (x: number, y: number) =>
    y >= 0 && y < DOME && Math.abs(x) <= Math.round(R * Math.sqrt(1 - ((DOME - 1 - y) / DOME) ** 2));
  const row = (cell: (i: number) => string) => Array.from({ length: W }, (_, i) => cell(i)).join("");
  const rows = [row((i) => (i === R ? "k" : "."))];
  for (let y = 0; y < DOME; y++)
    rows.push(
      row((i) => {
        const x = i - R;
        if (!inside(x, y)) return ".";
        if (!inside(x, y - 1) || !inside(x - 1, y) || !inside(x + 1, y)) return "k";
        return Math.floor(i / 10) % 2 ? "R" : "r";
      }),
    );
  // the hem, a tip under each panel, and the shaft from there down
  rows.push("k".repeat(W));
  rows.push(row((i) => (Math.abs(i - R) === 1 ? "k" : i === R ? "b" : i % 10 === 4 && Math.abs(i - R) > 2 ? "k" : ".")));
  for (let i = 0; i < SHAFT; i++) rows.push(row((i) => (Math.abs(i - R) === 1 ? "k" : i === R ? "b" : ".")));
  return sprite({ r: "#f85858", R: "#c81818", b: "#704828" }, rows);
})();

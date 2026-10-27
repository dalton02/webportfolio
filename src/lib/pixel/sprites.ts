/*
  Original pixel art, drawn as character maps. Each character is one pixel and
  looks up its colour in the sprite's palette; "." is transparent.
  Nothing here is traced from a game, only the palette mood is borrowed.
*/

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

/** A window into every frame of a sprite, e.g. a portrait out of a full-body sprite. */
export function crop(s: Sprite, x: number, y: number, w: number, h: number): Sprite {
  return { ...s, w, h, frames: s.frames.map((f) => f.slice(y, y + h).map((row) => row.slice(x, x + w))) };
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

/**
  Soldadinho, a soldadinho-do-araripe: the tiny white bird with a red crest and black
  wings that only lives on the Chapada do Araripe, next to Crato. He narrates the site,
  drawn side-on as a round little ball with a big shiny eye, rosy cheek and the crest
  curling forward over the beak. Two frames: eyes open, blink.
*/
export const soldadinho = sprite(
  { r: "#f83838", R: "#c01820", l: "#ff8070", n: "#302840", N: "#585078", e: "#181018", s: "#d0c8dc", p: "#f8a0b0", b: "#4a4250", h: "#e09078" },
  [
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
    "..kwkkkkkwwwwwppwkk.",
    ".kknNNNNnkwwwwwwwk..",
    "knnnnnnnnkwwwwwwsk..",
    "knnnnnnnkwwwwwwssk..",
    ".kknnnnkwwwwwwsssk..",
    "...kkkksssssssssk...",
    "......kkhkkkhkkk....",
    ".......hhh.hhh......",
  ],
  [
    "........kkkk........",
    "......kkrrllkk......",
    ".....krrrrrrllkk....",
    "....krrrlrrrrrrrrk..",
    "....kRrrrrrrrrrrrrrk",
    "...kRRrrrrrrrrrkkkk.",
    "...kRRrrrrrrrrrrk...",
    "...kRrwwwwwwewwewk..",
    "..kRwwwwwwwwweewwbk.",
    "..kwwwwwwwwwwwwwwbbk",
    "..kwkkkkkwwwwwppwkk.",
    ".kknNNNNnkwwwwwwwk..",
    "knnnnnnnnkwwwwwwsk..",
    "knnnnnnnkwwwwwwssk..",
    ".kknnnnkwwwwwwsssk..",
    "...kkkksssssssssk...",
    "......kkhkkkhkkk....",
    ".......hhh.hhh......",
  ],
);

/** The soldadinho mid-chirp, beak wide open; shown for a beat when you hover him. */
export const soldadinhoChirp = { ...soldadinho, frames: [
  [
    "........kkkk........",
    "......kkrrllkk......",
    ".....krrrrrrllkk....",
    "....krrrlrrrrrrrrk..",
    "....kRrrrrrrrrrrrrrk",
    "...kRRrrrrrrrrrkkkk.",
    "...kRRrrrrrrrrrrkkk.",
    "...kRrwwwwwwwwewwbbk",
    "..kRwwwwwwwwweewwRk.",
    "..kwwwwwwwwwweewwRk.",
    "..kwkkkkkwwwwwppwbbk",
    ".kknNNNNnkwwwwwwwkk.",
    "knnnnnnnnkwwwwwwsk..",
    "knnnnnnnkwwwwwwssk..",
    ".kknnnnkwwwwwwsssk..",
    "...kkkksssssssssk...",
    "......kkhkkkhkkk....",
    ".......hhh.hhh......",
  ],
] };

/**
  Dalton himself, facing the camera: strong build, wavy brown hair, navy glasses, a
  moustache, gold chain, a loose petrol-blue Hawaiian shirt in the Tommy Vercetti mood with
  tone-on-tone palm fronds, baggy brown trousers and green-and-yellow havaianas. Idle loop of six
  frames: stand, stand, breathe in (upper body 1px up), hair strand sways, settle, blink.
*/
const daltonStanding = sprite(
  { A: "#2e1a0c", B: "#a8784a", C: "#553620", D: "#10401a", E: "#2e9a40", F: "#1e7a30", a: "#1e1008", b: "#86582e", c: "#5c3a20", d: "#3a2010", e: "#e8a878", f: "#2a1608", g: "#202c68", h: "#6a3020", i: "#f8f0e0", j: "#b8d8f0", m: "#c07850", n: "#181018", o: "#8a3828", p: "#f8c8a0", q: "#0c2a36", r: "#1f6678", s: "#f8d040", t: "#3a8a9a", u: "#164f60", v: "#154a5a", x: "#b07818", y: "#0f3644", z: "#7a5232" },
  [
    "................................................",
    "................aaa.aaaaaaaaaa..................",
    ".................ababbbbbbbbbbaa................",
    "................abcbccccccccccbda...............",
    "...............abccccccccccccccda...............",
    ".............aabcccccccccccccccccaa.............",
    ".............abccccccccccccccccccda.............",
    "..............abccccccccccccccccda..............",
    "..............abcccccccaacccccccda..............",
    "..............abcccaadaeeaaaccccda..............",
    "..............abceffffeeeeffffecda..............",
    "..............aaegggggeeeegggggeaa..............",
    "..............hggienneggggienneggh..............",
    "..............hmgeennegeegeennegmh..............",
    "..............hhegggggeemegggggehh..............",
    "................hpeeeeemmeeeeemh................",
    "................hpeeecccccceeemh................",
    ".................heeceooooecemh.................",
    "..................hpeeeeeeeemh..................",
    "...................hmeeeeeemh...................",
    "...................hmhhhhhhmh...................",
    "...................hpeeeeeemh...................",
    ".........qqqqqqqqqqqmeeeeeemqqqqqqqqqqq.........",
    "......qqqtttrrqttttqsmeeeemsqttttqrrvvvqqq......",
    "....qqttrururrrqttttqspeemsqttttqrrrururvvqq....",
    "...qttururuvrrrrqtttqussssuqtttqrrrrvururuvvq...",
    "..qtururuurvrrrruqtttqhxshqtttqruurrvruururuvq..",
    "..qturuurrrvrruuruqtttqhhqtttqurururvrrruuruvq..",
    "..qtuurrrrrvrurururrqqrrvrqqrrrrruruvrrrrruuvq..",
    "..qyvvvvvvvvururrrrrrrrrvrrrrrrrrrrrvvvvvvvvyq..",
    "..qqqqqqqqqmrrrrrrrrrrrivrrrrrrrrrrrmqqqqqqqqq..",
    "..hmmmmmmmmhqtrrrrrrrrrrvrrrrrrrrryqhmmmmmmmmh..",
    "..hppeeeeemhqtrrrrrrrrrrvrrrrrrruuyqhmeeeeemmh..",
    "..hpeeeeeemhqtururrrrrrrvrrrrruuruyqhmeeeeeemh..",
    "..hpeeeeeemhqtrurururrrivrrruururuvqhmeeeeeemh..",
    "..hpeeeeemmhqtrruurururrvrrurururrvqhmmeeeeemh..",
    "..hpeeeeemh.qtrrrruururuvrururrrrrvq.hmeeeeemh..",
    "..hpeeeeemh.qtrrruuruuruvurrrrrrrrvq.hmeeeeemh..",
    "..hpeeeemmh.qtrrruruuruivrrrrrrrrrvq.hmmeeeemh..",
    "..hpeeeemh..qtrrrururuurvrrrrrrrruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrururuvrrrrrruruvq..hmeeeemh..",
    "..hpeeeemh..qqvvvvvvvyvyqyvvvyvyvyqq..hmeeeemh..",
    "..hppeeemh..qqqqqqqqqqqqqqqqqqqqqqqq..hmeeemmh..",
    "...hpeemh...hzzzzzzzzzzzzzzzzzzzzzzh...hmeemh...",
    "..hpeeeemh..zzzzzzzzzzzzzzzzzzzzzzzz..hmeeeemh..",
    "..hpeeeemehABzzzzzzzzzzAAzzzzzzzzzzCAhemeeeemh..",
    "..hpeeeemh.ABzzzzzzzzzzAAzzzzzzzzzzCA.hmeeeemh..",
    "..hmememh.ABzzzzzzzzzCA..ABzzzzzzzzzCA.hmememh..",
    "...hhhhh..ABzzzzzzzzzCA..ABzzzzzzzzzCA..hhhhh...",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ACCCCCCCCCCCCA..ACCCCCCCCCCCCA.........",
    ".........AAAAAAAAAAAAAA..AAAAAAAAAAAAAA.........",
    "...........hpeeeeeemh......hpeeeeeemh...........",
    "...........hmmmmsmsmh......hmsmsmmmmh...........",
    "...........hhhhshshsh......hshshshhhh...........",
    "..........DEEExEEEEExD....DxEEEEExEEFD..........",
    "..........DFFFFFFFFFFD....DFFFFFFFFFFD..........",
    "...........DDDDDDDDDD......DDDDDDDDDD...........",
    "................................................",
  ],
  [
    "................................................",
    "................aaa.aaaaaaaaaa..................",
    ".................ababbbbbbbbbbaa................",
    "................abcbccccccccccbda...............",
    "...............abccccccccccccccda...............",
    ".............aabcccccccccccccccccaa.............",
    ".............abccccccccccccccccccda.............",
    "..............abccccccccccccccccda..............",
    "..............abcccccccaacccccccda..............",
    "..............abcccaadaeeaaaccccda..............",
    "..............abceffffeeeeffffecda..............",
    "..............aaegggggeeeegggggeaa..............",
    "..............hggienneggggienneggh..............",
    "..............hmgeennegeegeennegmh..............",
    "..............hhegggggeemegggggehh..............",
    "................hpeeeeemmeeeeemh................",
    "................hpeeecccccceeemh................",
    ".................heeceooooecemh.................",
    "..................hpeeeeeeeemh..................",
    "...................hmeeeeeemh...................",
    "...................hmhhhhhhmh...................",
    "...................hpeeeeeemh...................",
    ".........qqqqqqqqqqqmeeeeeemqqqqqqqqqqq.........",
    "......qqqtttrrqttttqsmeeeemsqttttqrrvvvqqq......",
    "....qqttrururrrqttttqspeemsqttttqrrrururvvqq....",
    "...qttururuvrrrrqtttqussssuqtttqrrrrvururuvvq...",
    "..qtururuurvrrrruqtttqhxshqtttqruurrvruururuvq..",
    "..qturuurrrvrruuruqtttqhhqtttqurururvrrruuruvq..",
    "..qtuurrrrrvrurururrqqrrvrqqrrrrruruvrrrrruuvq..",
    "..qyvvvvvvvvururrrrrrrrrvrrrrrrrrrrrvvvvvvvvyq..",
    "..qqqqqqqqqmrrrrrrrrrrrivrrrrrrrrrrrmqqqqqqqqq..",
    "..hmmmmmmmmhqtrrrrrrrrrrvrrrrrrrrryqhmmmmmmmmh..",
    "..hppeeeeemhqtrrrrrrrrrrvrrrrrrruuyqhmeeeeemmh..",
    "..hpeeeeeemhqtururrrrrrrvrrrrruuruyqhmeeeeeemh..",
    "..hpeeeeeemhqtrurururrrivrrruururuvqhmeeeeeemh..",
    "..hpeeeeemmhqtrruurururrvrrurururrvqhmmeeeeemh..",
    "..hpeeeeemh.qtrrrruururuvrururrrrrvq.hmeeeeemh..",
    "..hpeeeeemh.qtrrruuruuruvurrrrrrrrvq.hmeeeeemh..",
    "..hpeeeemmh.qtrrruruuruivrrrrrrrrrvq.hmmeeeemh..",
    "..hpeeeemh..qtrrrururuurvrrrrrrrruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrururuvrrrrrruruvq..hmeeeemh..",
    "..hpeeeemh..qqvvvvvvvyvyqyvvvyvyvyqq..hmeeeemh..",
    "..hppeeemh..qqqqqqqqqqqqqqqqqqqqqqqq..hmeeemmh..",
    "...hpeemh...hzzzzzzzzzzzzzzzzzzzzzzh...hmeemh...",
    "..hpeeeemh..zzzzzzzzzzzzzzzzzzzzzzzz..hmeeeemh..",
    "..hpeeeemehABzzzzzzzzzzAAzzzzzzzzzzCAhemeeeemh..",
    "..hpeeeemh.ABzzzzzzzzzzAAzzzzzzzzzzCA.hmeeeemh..",
    "..hmememh.ABzzzzzzzzzCA..ABzzzzzzzzzCA.hmememh..",
    "...hhhhh..ABzzzzzzzzzCA..ABzzzzzzzzzCA..hhhhh...",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ACCCCCCCCCCCCA..ACCCCCCCCCCCCA.........",
    ".........AAAAAAAAAAAAAA..AAAAAAAAAAAAAA.........",
    "...........hpeeeeeemh......hpeeeeeemh...........",
    "...........hmmmmsmsmh......hmsmsmmmmh...........",
    "...........hhhhshshsh......hshshshhhh...........",
    "..........DEEExEEEEExD....DxEEEEExEEFD..........",
    "..........DFFFFFFFFFFD....DFFFFFFFFFFD..........",
    "...........DDDDDDDDDD......DDDDDDDDDD...........",
    "................................................",
  ],
  [
    "................aaa.aaaaaaaaaa..................",
    ".................ababbbbbbbbbbaa................",
    "................abcbccccccccccbda...............",
    "...............abccccccccccccccda...............",
    ".............aabcccccccccccccccccaa.............",
    ".............abccccccccccccccccccda.............",
    "..............abccccccccccccccccda..............",
    "..............abcccccccaacccccccda..............",
    "..............abcccaadaeeaaaccccda..............",
    "..............abceffffeeeeffffecda..............",
    "..............aaegggggeeeegggggeaa..............",
    "..............hggienneggggienneggh..............",
    "..............hmgeennegeegeennegmh..............",
    "..............hhegggggeemegggggehh..............",
    "................hpeeeeemmeeeeemh................",
    "................hpeeecccccceeemh................",
    ".................heeceooooecemh.................",
    "..................hpeeeeeeeemh..................",
    "...................hmeeeeeemh...................",
    "...................hmhhhhhhmh...................",
    "...................hpeeeeeemh...................",
    ".........qqqqqqqqqqqmeeeeeemqqqqqqqqqqq.........",
    "......qqqtttrrqttttqsmeeeemsqttttqrrvvvqqq......",
    "....qqttrururrrqttttqspeemsqttttqrrrururvvqq....",
    "...qttururuvrrrrqtttqussssuqtttqrrrrvururuvvq...",
    "..qtururuurvrrrruqtttqhxshqtttqruurrvruururuvq..",
    "..qturuurrrvrruuruqtttqhhqtttqurururvrrruuruvq..",
    "..qtuurrrrrvrurururrqqrrvrqqrrrrruruvrrrrruuvq..",
    "..qyvvvvvvvvururrrrrrrrrvrrrrrrrrrrrvvvvvvvvyq..",
    "..qqqqqqqqqmrrrrrrrrrrrivrrrrrrrrrrrmqqqqqqqqq..",
    "..hmmmmmmmmhqtrrrrrrrrrrvrrrrrrrrryqhmmmmmmmmh..",
    "..hppeeeeemhqtrrrrrrrrrrvrrrrrrruuyqhmeeeeemmh..",
    "..hpeeeeeemhqtururrrrrrrvrrrrruuruyqhmeeeeeemh..",
    "..hpeeeeeemhqtrurururrrivrrruururuvqhmeeeeeemh..",
    "..hpeeeeemmhqtrruurururrvrrurururrvqhmmeeeeemh..",
    "..hpeeeeemh.qtrrrruururuvrururrrrrvq.hmeeeeemh..",
    "..hpeeeeemh.qtrrruuruuruvurrrrrrrrvq.hmeeeeemh..",
    "..hpeeeemmh.qtrrruruuruivrrrrrrrrrvq.hmmeeeemh..",
    "..hpeeeemh..qtrrrururuurvrrrrrrrruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrururuvrrrrrruruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrrruruvurrrururuyq..hmeeeemh..",
    "..hppeeemh..qqvvvvvvvvvvqvyvvyvyyvqq..hmeeemmh..",
    "...hpeemh...qqqqqqqqqqqqqqqqqqqqqqqq...hmeemh...",
    "..hpeeeemh..zzzzzzzzzzzzzzzzzzzzzzzz..hmeeeemh..",
    "..hpeeeemehABzzzzzzzzzzzzzzzzzzzzzzCAhemeeeemh..",
    "..hpeeeemh.ABzzzzzzzzzzAAzzzzzzzzzzCA.hmeeeemh..",
    "..hmememh..ABzzzzzzzzzzAAzzzzzzzzzzCA..hmememh..",
    "...hhhhh..ABzzzzzzzzzCA..ABzzzzzzzzzCA..hhhhh...",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ACCCCCCCCCCCCA..ACCCCCCCCCCCCA.........",
    ".........AAAAAAAAAAAAAA..AAAAAAAAAAAAAA.........",
    "...........hpeeeeeemh......hpeeeeeemh...........",
    "...........hmmmmsmsmh......hmsmsmmmmh...........",
    "...........hhhhshshsh......hshshshhhh...........",
    "..........DEEExEEEEExD....DxEEEEExEEFD..........",
    "..........DFFFFFFFFFFD....DFFFFFFFFFFD..........",
    "...........DDDDDDDDDD......DDDDDDDDDD...........",
    "................................................",
  ],
  [
    "................aaa.aaaaaaaaaa..................",
    ".................ababbbbbbbbbbaa................",
    "................abcbccccccccccbda...............",
    "...............abccccccccccccccda...............",
    ".............aabcccccccccccccccccaa.............",
    ".............abccccccccccccccccccda.............",
    "..............abccccccccccccccccda..............",
    "..............abcccccccaacccccccda..............",
    "..............abcccaadaeeaaaccccda..............",
    "..............abceffffeeeeffffecda..............",
    "..............aaegggggeeeegggggeaa..............",
    "..............hggienneggggienneggh..............",
    "..............hmgeennegeegeennegmh..............",
    "..............hhegggggeemegggggehh..............",
    "................hpeeeeemmeeeeemh................",
    "................hpeeecccccceeemh................",
    ".................heeceooooecemh.................",
    "..................hpeeeeeeeemh..................",
    "...................hmeeeeeemh...................",
    "...................hmhhhhhhmh...................",
    "...................hpeeeeeemh...................",
    ".........qqqqqqqqqqqmeeeeeemqqqqqqqqqqq.........",
    "......qqqtttrrqttttqsmeeeemsqttttqrrvvvqqq......",
    "....qqttrururrrqttttqspeemsqttttqrrrururvvqq....",
    "...qttururuvrrrrqtttqussssuqtttqrrrrvururuvvq...",
    "..qtururuurvrrrruqtttqhxshqtttqruurrvruururuvq..",
    "..qturuurrrvrruuruqtttqhhqtttqurururvrrruuruvq..",
    "..qtuurrrrrvrurururrqqrrvrqqrrrrruruvrrrrruuvq..",
    "..qyvvvvvvvvururrrrrrrrrvrrrrrrrrrrrvvvvvvvvyq..",
    "..qqqqqqqqqmrrrrrrrrrrrivrrrrrrrrrrrmqqqqqqqqq..",
    "..hmmmmmmmmhqtrrrrrrrrrrvrrrrrrrrryqhmmmmmmmmh..",
    "..hppeeeeemhqtrrrrrrrrrrvrrrrrrruuyqhmeeeeemmh..",
    "..hpeeeeeemhqtururrrrrrrvrrrrruuruyqhmeeeeeemh..",
    "..hpeeeeeemhqtrurururrrivrrruururuvqhmeeeeeemh..",
    "..hpeeeeemmhqtrruurururrvrrurururrvqhmmeeeeemh..",
    "..hpeeeeemh.qtrrrruururuvrururrrrrvq.hmeeeeemh..",
    "..hpeeeeemh.qtrrruuruuruvurrrrrrrrvq.hmeeeeemh..",
    "..hpeeeemmh.qtrrruruuruivrrrrrrrrrvq.hmmeeeemh..",
    "..hpeeeemh..qtrrrururuurvrrrrrrrruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrururuvrrrrrruruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrrruruvurrrururuyq..hmeeeemh..",
    "..hppeeemh..qqvvvvvvvvvvqvyvvyvyyvqq..hmeeemmh..",
    "...hpeemh...qqqqqqqqqqqqqqqqqqqqqqqq...hmeemh...",
    "..hpeeeemh..zzzzzzzzzzzzzzzzzzzzzzzz..hmeeeemh..",
    "..hpeeeemehABzzzzzzzzzzzzzzzzzzzzzzCAhemeeeemh..",
    "..hpeeeemh.ABzzzzzzzzzzAAzzzzzzzzzzCA.hmeeeemh..",
    "..hmememh..ABzzzzzzzzzzAAzzzzzzzzzzCA..hmememh..",
    "...hhhhh..ABzzzzzzzzzCA..ABzzzzzzzzzCA..hhhhh...",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ACCCCCCCCCCCCA..ACCCCCCCCCCCCA.........",
    ".........AAAAAAAAAAAAAA..AAAAAAAAAAAAAA.........",
    "...........hpeeeeeemh......hpeeeeeemh...........",
    "...........hmmmmsmsmh......hmsmsmmmmh...........",
    "...........hhhhshshsh......hshshshhhh...........",
    "..........DEEExEEEEExD....DxEEEEExEEFD..........",
    "..........DFFFFFFFFFFD....DFFFFFFFFFFD..........",
    "...........DDDDDDDDDD......DDDDDDDDDD...........",
    "................................................",
  ],
  [
    "................................................",
    "................aaa.aaaaaaaaaa..................",
    ".................ababbbbbbbbbbaa................",
    "................abcbccccccccccbda...............",
    "...............abccccccccccccccda...............",
    ".............aabcccccccccccccccccaa.............",
    ".............abccccccccccccccccccda.............",
    "..............abccccccccccccccccda..............",
    "..............abcccccccaacccccccda..............",
    "..............abcccaadaeeaaaccccda..............",
    "..............abceffffeeeeffffecda..............",
    "..............aaegggggeeeegggggeaa..............",
    "..............hggienneggggienneggh..............",
    "..............hmgeennegeegeennegmh..............",
    "..............hhegggggeemegggggehh..............",
    "................hpeeeeemmeeeeemh................",
    "................hpeeecccccceeemh................",
    ".................heeceooooecemh.................",
    "..................hpeeeeeeeemh..................",
    "...................hmeeeeeemh...................",
    "...................hmhhhhhhmh...................",
    "...................hpeeeeeemh...................",
    ".........qqqqqqqqqqqmeeeeeemqqqqqqqqqqq.........",
    "......qqqtttrrqttttqsmeeeemsqttttqrrvvvqqq......",
    "....qqttrururrrqttttqspeemsqttttqrrrururvvqq....",
    "...qttururuvrrrrqtttqussssuqtttqrrrrvururuvvq...",
    "..qtururuurvrrrruqtttqhxshqtttqruurrvruururuvq..",
    "..qturuurrrvrruuruqtttqhhqtttqurururvrrruuruvq..",
    "..qtuurrrrrvrurururrqqrrvrqqrrrrruruvrrrrruuvq..",
    "..qyvvvvvvvvururrrrrrrrrvrrrrrrrrrrrvvvvvvvvyq..",
    "..qqqqqqqqqmrrrrrrrrrrrivrrrrrrrrrrrmqqqqqqqqq..",
    "..hmmmmmmmmhqtrrrrrrrrrrvrrrrrrrrryqhmmmmmmmmh..",
    "..hppeeeeemhqtrrrrrrrrrrvrrrrrrruuyqhmeeeeemmh..",
    "..hpeeeeeemhqtururrrrrrrvrrrrruuruyqhmeeeeeemh..",
    "..hpeeeeeemhqtrurururrrivrrruururuvqhmeeeeeemh..",
    "..hpeeeeemmhqtrruurururrvrrurururrvqhmmeeeeemh..",
    "..hpeeeeemh.qtrrrruururuvrururrrrrvq.hmeeeeemh..",
    "..hpeeeeemh.qtrrruuruuruvurrrrrrrrvq.hmeeeeemh..",
    "..hpeeeemmh.qtrrruruuruivrrrrrrrrrvq.hmmeeeemh..",
    "..hpeeeemh..qtrrrururuurvrrrrrrrruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrururuvrrrrrruruvq..hmeeeemh..",
    "..hpeeeemh..qqvvvvvvvyvyqyvvvyvyvyqq..hmeeeemh..",
    "..hppeeemh..qqqqqqqqqqqqqqqqqqqqqqqq..hmeeemmh..",
    "...hpeemh...hzzzzzzzzzzzzzzzzzzzzzzh...hmeemh...",
    "..hpeeeemh..zzzzzzzzzzzzzzzzzzzzzzzz..hmeeeemh..",
    "..hpeeeemehABzzzzzzzzzzAAzzzzzzzzzzCAhemeeeemh..",
    "..hpeeeemh.ABzzzzzzzzzzAAzzzzzzzzzzCA.hmeeeemh..",
    "..hmememh.ABzzzzzzzzzCA..ABzzzzzzzzzCA.hmememh..",
    "...hhhhh..ABzzzzzzzzzCA..ABzzzzzzzzzCA..hhhhh...",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ACCCCCCCCCCCCA..ACCCCCCCCCCCCA.........",
    ".........AAAAAAAAAAAAAA..AAAAAAAAAAAAAA.........",
    "...........hpeeeeeemh......hpeeeeeemh...........",
    "...........hmmmmsmsmh......hmsmsmmmmh...........",
    "...........hhhhshshsh......hshshshhhh...........",
    "..........DEEExEEEEExD....DxEEEEExEEFD..........",
    "..........DFFFFFFFFFFD....DFFFFFFFFFFD..........",
    "...........DDDDDDDDDD......DDDDDDDDDD...........",
    "................................................",
  ],
  [
    "................................................",
    "................aaa.aaaaaaaaaa..................",
    ".................ababbbbbbbbbbaa................",
    "................abcbccccccccccbda...............",
    "...............abccccccccccccccda...............",
    ".............aabcccccccccccccccccaa.............",
    ".............abccccccccccccccccccda.............",
    "..............abccccccccccccccccda..............",
    "..............abcccccccaacccccccda..............",
    "..............abcccaadaeeaaaccccda..............",
    "..............abceffffeeeeffffecda..............",
    "..............aaegggggeeeegggggeaa..............",
    "..............hggieeeeggggieeeeggh..............",
    "..............hmgeeffegeegeeffegmh..............",
    "..............hhegggggeemegggggehh..............",
    "................hpeeeeemmeeeeemh................",
    "................hpeeecccccceeemh................",
    ".................heeceooooecemh.................",
    "..................hpeeeeeeeemh..................",
    "...................hmeeeeeemh...................",
    "...................hmhhhhhhmh...................",
    "...................hpeeeeeemh...................",
    ".........qqqqqqqqqqqmeeeeeemqqqqqqqqqqq.........",
    "......qqqtttrrqttttqsmeeeemsqttttqrrvvvqqq......",
    "....qqttrururrrqttttqspeemsqttttqrrrururvvqq....",
    "...qttururuvrrrrqtttqussssuqtttqrrrrvururuvvq...",
    "..qtururuurvrrrruqtttqhxshqtttqruurrvruururuvq..",
    "..qturuurrrvrruuruqtttqhhqtttqurururvrrruuruvq..",
    "..qtuurrrrrvrurururrqqrrvrqqrrrrruruvrrrrruuvq..",
    "..qyvvvvvvvvururrrrrrrrrvrrrrrrrrrrrvvvvvvvvyq..",
    "..qqqqqqqqqmrrrrrrrrrrrivrrrrrrrrrrrmqqqqqqqqq..",
    "..hmmmmmmmmhqtrrrrrrrrrrvrrrrrrrrryqhmmmmmmmmh..",
    "..hppeeeeemhqtrrrrrrrrrrvrrrrrrruuyqhmeeeeemmh..",
    "..hpeeeeeemhqtururrrrrrrvrrrrruuruyqhmeeeeeemh..",
    "..hpeeeeeemhqtrurururrrivrrruururuvqhmeeeeeemh..",
    "..hpeeeeemmhqtrruurururrvrrurururrvqhmmeeeeemh..",
    "..hpeeeeemh.qtrrrruururuvrururrrrrvq.hmeeeeemh..",
    "..hpeeeeemh.qtrrruuruuruvurrrrrrrrvq.hmeeeeemh..",
    "..hpeeeemmh.qtrrruruuruivrrrrrrrrrvq.hmmeeeemh..",
    "..hpeeeemh..qtrrrururuurvrrrrrrrruvq..hmeeeemh..",
    "..hpeeeemh..qtrrrrrururuvrrrrrruruvq..hmeeeemh..",
    "..hpeeeemh..qqvvvvvvvyvyqyvvvyvyvyqq..hmeeeemh..",
    "..hppeeemh..qqqqqqqqqqqqqqqqqqqqqqqq..hmeeemmh..",
    "...hpeemh...hzzzzzzzzzzzzzzzzzzzzzzh...hmeemh...",
    "..hpeeeemh..zzzzzzzzzzzzzzzzzzzzzzzz..hmeeeemh..",
    "..hpeeeemehABzzzzzzzzzzAAzzzzzzzzzzCAhemeeeemh..",
    "..hpeeeemh.ABzzzzzzzzzzAAzzzzzzzzzzCA.hmeeeemh..",
    "..hmememh.ABzzzzzzzzzCA..ABzzzzzzzzzCA.hmememh..",
    "...hhhhh..ABzzzzzzzzzCA..ABzzzzzzzzzCA..hhhhh...",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    "..........ABzzzzzzzzzCA..ABzzzzzzzzzCA..........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ABzzzzzzzzzzCA..ABzzzzzzzzzzCA.........",
    ".........ACCCCCCCCCCCCA..ACCCCCCCCCCCCA.........",
    ".........AAAAAAAAAAAAAA..AAAAAAAAAAAAAA.........",
    "...........hpeeeeeemh......hpeeeeeemh...........",
    "...........hmmmmsmsmh......hmsmsmmmmh...........",
    "...........hhhhshshsh......hshshshhhh...........",
    "..........DEEExEEEEExD....DxEEEEExEEFD..........",
    "..........DFFFFFFFFFFD....DFFFFFFFFFFD..........",
    "...........DDDDDDDDDD......DDDDDDDDDD...........",
    "................................................",
  ],
);

/** Clear columns on both sides of every frame. */
function padX(s: Sprite, n: number): Sprite {
  const side = ".".repeat(n);
  return { ...s, w: s.w + n * 2, frames: s.frames.map((f) => f.map((row) => side + row + side)) };
}

// room on both sides for the waving arm, so standing and waving share one canvas and never jump
export const dalton = padX(daltonStanding, 12);

/*
  Dalton saying hi: the hanging arm goes, and a forearm stands straight up with the palm open,
  drawn over the sleeve as if the elbow rested on it. Same widths as his other arm; fingers
  split by shade, thumb toward the head. Columns are the 48-wide frame's, before padding.
*/
const ARM_UP = [
  "..hhhhhhh...", // fingertips
  ".hpemememh..",
  ".hpemememh..",
  ".hpemememh..",
  ".hpeeeeemh..", // palm
  ".hpeeeeemhh.",
  ".hpeeeeeeeh.", // thumb
  ".hpeeeeeeh..",
  ".hpeeeeemh..",
  "..hpeeemh...", // wrist
  ".hpeeeeemh..", // forearm
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hpeeeeemh..",
  ".hmeeeeemh..", // elbow, resting on the sleeve
  ".hmmmmmmmh..",
  "..hhhhhhh...",
];
const ARM_UP_TOP = 5;
const PAD = (dalton.w - daltonStanding.w) / 2;
export const daltonHi: Sprite = {
  ...dalton,
  frames: [
    dalton.frames[0].map((row, y) => {
      const cells = [...row];
      // the hanging arm goes (skin and its outline only; the trousers it overlapped stay).
      // Rows 30–48 only (shoulder to hand): below that the same columns hold the left foot's outline.
      if (y >= 30 && y < 49)
        for (let x = 0; x < 12; x++) {
          const c = cells[PAD + x];
          if ("hpem".includes(c)) cells[PAD + x] = y === 30 && x === 11 ? "q" : ".";
        }
      const arm = ARM_UP[y - ARM_UP_TOP];
      if (arm) for (let x = 0; x < arm.length; x++) if (arm[x] !== ".") cells[PAD + x] = arm[x];
      return cells.join("");
    }),
  ],
};

export const daltonHead = crop(dalton, 24, 0, 24, 27);

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

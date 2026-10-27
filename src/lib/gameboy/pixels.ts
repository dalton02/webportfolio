/*
  Pixel shapes for the handheld's controls. Every part is a set of grid cells, drawn as one
  SVG path of horizontal runs with crisp edges, so the buttons, their holes and the speaker
  all sit on the same pixel grid as the rest of the site.
*/

export type Cells = Set<string>;

const key = (x: number, y: number) => `${x},${y}`;
const cellsOf = (s: Cells) =>
  [...s].map((k) => k.split(",").map(Number) as [number, number]);

/** Every cell of a w×h grid whose centre falls inside the shape. */
export function shape(
  w: number,
  h: number,
  inside: (x: number, y: number) => boolean,
): Cells {
  const s: Cells = new Set();
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) if (inside(x + 0.5, y + 0.5)) s.add(key(x, y));
  return s;
}

function segDist(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy;
  const t = len
    ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len))
    : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** A stadium from one point to another, r cells thick on each side. */
export const capsule =
  (ax: number, ay: number, bx: number, by: number, r: number) =>
  (x: number, y: number) =>
    segDist(x, y, ax, ay, bx, by) <= r;
export const circle = (cx: number, cy: number, r: number) =>
  capsule(cx, cy, cx, cy, r);

export const shift = (s: Cells, dx: number, dy: number): Cells =>
  new Set(cellsOf(s).map(([x, y]) => key(x + dx, y + dy)));
export const union = (...sets: Cells[]): Cells =>
  new Set(sets.flatMap((s) => [...s]));
export const minus = (a: Cells, b: Cells): Cells =>
  new Set([...a].filter((k) => !b.has(k)));
export const pick = (s: Cells, f: (x: number, y: number) => boolean): Cells =>
  new Set(
    cellsOf(s)
      .filter(([x, y]) => f(x, y))
      .map(([x, y]) => key(x, y)),
  );

/** Grows a shape by one cell up, down, left and right. */
export const grow = (s: Cells) =>
  union(s, shift(s, 1, 0), shift(s, -1, 0), shift(s, 0, 1), shift(s, 0, -1));

/** The cells of a shape facing one side: (dx, dy) points at the empty neighbour. */
export const edge = (s: Cells, dx: number, dy: number) =>
  pick(s, (x, y) => !s.has(key(x + dx, y + dy)));

/** One SVG path in cell units, a rectangle per horizontal run. */
export function path(s: Cells) {
  const rows = new Map<number, number[]>();
  for (const [x, y] of cellsOf(s)) {
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y)!.push(x);
  }
  let d = "";
  for (const [y, xs] of rows) {
    xs.sort((a, b) => a - b);
    let start = xs[0];
    for (let i = 1; i <= xs.length; i++) {
      if (xs[i] !== xs[i - 1] + 1) {
        d += `M${start} ${y}h${xs[i - 1] - start + 1}v1h${start - xs[i - 1] - 1}z`;
        start = xs[i];
      }
    }
  }
  return d;
}

/**
  A pressable cap, as paths: the lip of the hole it sits in, the hole itself (dark, showing as
  the cap's side at rest and as shadow above it when pressed), and the face with a lit
  top-left and a shaded right edge. `depth` is how many cells of side show at rest.
*/
export function cap(face: Cells, depth = 2) {
  let side: Cells = new Set();
  for (let i = 1; i <= depth; i++) side = union(side, shift(face, 0, i));
  const hole = union(face, side);
  return {
    well: path(minus(grow(hole), hole)),
    hole: path(hole),
    face: path(face),
    hi: path(union(edge(face, 0, -1), edge(face, -1, 0))),
    lo: path(minus(edge(face, 1, 0), edge(face, 0, -1))),
  };
}

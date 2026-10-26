/*
  8-bit sound effects synthesised with Web Audio (square and triangle waves).
  No samples, no game music. Muted by default; the HUD "B" button turns it on.
*/

const STORAGE_KEY = "sound";

type Note = [freq: number, dur: number, type?: OscillatorType];

function hz(note: string) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const m = note.match(/^([A-G]#?)(\d)$/);
  if (!m) return 440;
  const semis = names.indexOf(m[1]) + (Number(m[2]) + 1) * 12 - 69;
  return 440 * 2 ** (semis / 12);
}

/*
  The background tune: an original, easy-going 8-bar loop in C (C Am F G C Am Dm G),
  written in eighth notes. A soft triangle melody, a quiet pulse arpeggio and a round
  triangle bass, all kept well under the sound effects.
*/
const BPM = 92;
const EIGHTH = 60 / BPM / 2;
const BARS = 8;

// [note or "-" for a rest, length in eighths]; every bar adds up to 8
const MELODY: [string, number][] = [
  ["E5", 2], ["G5", 2], ["A5", 2], ["G5", 2],
  ["E5", 4], ["C5", 2], ["D5", 2],
  ["C5", 2], ["D5", 2], ["F5", 2], ["A5", 2],
  ["G5", 6], ["-", 2],
  ["E5", 2], ["G5", 2], ["C6", 2], ["B5", 2],
  ["A5", 4], ["G5", 2], ["E5", 2],
  ["F5", 2], ["E5", 2], ["D5", 2], ["F5", 2],
  ["D5", 4], ["B4", 2], ["-", 2],
];
// one chord per bar: bass root, then the three notes the arpeggio walks through
const CHORDS: [string, string, string, string][] = [
  ["C3", "C4", "E4", "G4"],
  ["A2", "A3", "C4", "E4"],
  ["F2", "F3", "A3", "C4"],
  ["G2", "G3", "B3", "D4"],
  ["C3", "C4", "E4", "G4"],
  ["A2", "A3", "C4", "E4"],
  ["D3", "D4", "F4", "A4"],
  ["G2", "G3", "B3", "D4"],
];

type Voice = { at: number; len: number; freq: number; type: OscillatorType; vol: number };

/** The whole loop as a flat list of notes, positioned in eighths. */
const SONG: Voice[] = (() => {
  const out: Voice[] = [];
  let at = 0;
  for (const [n, len] of MELODY) {
    if (n !== "-") out.push({ at, len, freq: hz(n), type: "triangle", vol: 0.05 });
    at += len;
  }
  CHORDS.forEach(([bass, a, b, c], bar) => {
    const start = bar * 8;
    out.push({ at: start, len: 3, freq: hz(bass), type: "triangle", vol: 0.07 });
    out.push({ at: start + 4, len: 3, freq: hz(bass), type: "triangle", vol: 0.06 });
    [a, b, c, b, a, b, c, b].forEach((n, i) => out.push({ at: start + i, len: 1, freq: hz(n), type: "square", vol: 0.008 }));
  });
  return out;
})();

class Sfx {
  muted = $state(true);
  private ctx: AudioContext | undefined;
  private lastBlip = 0;
  private music: { bus: GainNode; timer: ReturnType<typeof setInterval> } | undefined;

  /** Reads the saved choice. Audio itself only starts after a click (browser autoplay rules). */
  init() {
    try {
      this.muted = localStorage.getItem(STORAGE_KEY) !== "on";
    } catch {
      this.muted = true;
    }
    // browsers only let audio start after a gesture, so a saved "on" waits for the first one
    const first = () => {
      if (!this.muted) this.startMusic();
    };
    window.addEventListener("pointerdown", first, { once: true });
    window.addEventListener("keydown", first, { once: true });
    // no tune playing to an empty room
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) void this.ctx?.suspend();
      else if (!this.muted) void this.ctx?.resume();
    });
  }

  toggle() {
    this.muted = !this.muted;
    try {
      localStorage.setItem(STORAGE_KEY, this.muted ? "off" : "on");
    } catch {
      // storage blocked: the switch still works for this visit
    }
    if (this.muted) this.stopMusic();
    else {
      this.select();
      this.startMusic();
    }
  }

  /** Starts the loop with a slow fade in; notes are scheduled a little ahead on the audio clock. */
  private startMusic() {
    const ctx = this.audio();
    if (!ctx || this.music) return;
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0, ctx.currentTime);
    bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
    bus.connect(ctx.destination);

    const loop = BARS * 8;
    let step = 0;
    let next = ctx.currentTime + 0.1;
    const schedule = () => {
      while (next < ctx.currentTime + 0.4) {
        const pos = step % loop;
        for (const v of SONG) {
          if (v.at !== pos) continue;
          const dur = v.len * EIGHTH;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = v.type;
          osc.frequency.value = v.freq;
          // quick attack, gentle fall, so nothing drones
          gain.gain.setValueAtTime(0, next);
          gain.gain.linearRampToValueAtTime(v.vol, next + 0.01);
          gain.gain.exponentialRampToValueAtTime(v.vol * 0.4, next + dur * 0.9);
          gain.gain.linearRampToValueAtTime(0, next + dur);
          osc.connect(gain).connect(bus);
          osc.start(next);
          osc.stop(next + dur);
        }
        step++;
        next += EIGHTH;
      }
    };
    schedule();
    this.music = { bus, timer: setInterval(schedule, 100) };
  }

  private stopMusic() {
    const m = this.music;
    const ctx = this.ctx;
    if (!m || !ctx) return;
    this.music = undefined;
    clearInterval(m.timer);
    m.bus.gain.cancelScheduledValues(ctx.currentTime);
    m.bus.gain.setValueAtTime(m.bus.gain.value, ctx.currentTime);
    m.bus.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => m.bus.disconnect(), 500);
  }

  private audio() {
    if (this.muted || typeof AudioContext === "undefined") return;
    this.ctx ??= new AudioContext();
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private play(notes: Note[], volume = 0.06) {
    const ctx = this.audio();
    if (!ctx) return;
    let t = ctx.currentTime + 0.01;
    for (const [freq, dur, type = "square"] of notes) {
      if (freq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, t);
        gain.gain.setValueAtTime(volume, t + dur * 0.8);
        gain.gain.linearRampToValueAtTime(0, t + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur);
      }
      t += dur;
    }
  }

  /** One tick per couple of letters while dialog text types out. */
  blip() {
    const now = performance.now();
    if (now - this.lastBlip < 55) return;
    this.lastBlip = now;
    this.play([[hz("A5") + Math.random() * 40, 0.025]], 0.025);
  }

  cursor() {
    this.play([[hz("E6"), 0.03]], 0.03);
  }

  select() {
    this.play([
      [hz("C6"), 0.04],
      [hz("G6"), 0.06],
    ]);
  }

  back() {
    this.play([
      [hz("G5"), 0.04],
      [hz("C5"), 0.06],
    ]);
  }

  gem() {
    this.play([
      [hz("E6"), 0.05],
      [hz("B6"), 0.09],
    ]);
  }

  chest() {
    this.play(
      [
        [hz("C4"), 0.06, "triangle"],
        [hz("E4"), 0.06, "triangle"],
        [hz("G4"), 0.06, "triangle"],
        [hz("C5"), 0.06, "triangle"],
      ],
      0.12,
    );
  }

  /** The soldadinho's call: two quick whistles sliding up, each a little higher than the last. */
  chirp() {
    const ctx = this.audio();
    if (!ctx) return;
    const t0 = ctx.currentTime + 0.01;
    [0, 0.11].forEach((at, i) => {
      const t = t0 + at;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(2200 + i * 300, t);
      osc.frequency.exponentialRampToValueAtTime(3400 + i * 400, t + 0.07);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  /**
    Dalton saying hi in 8-bit, in the page's language.
    "hi": a breath of noise for the "h", then a square wave whose pitch lifts and falls while
    a band-pass filter slides from an "a" to an "ee" formant.
    "olá": a rounded "o" (low formant), a quick dip in volume for the "l", then an open "a"
    with the pitch rising, since the stress falls on the last syllable.
  */
  hi(lang: "enUs" | "ptBr" = "enUs") {
    const ctx = this.audio();
    if (!ctx) return;
    if (lang === "ptBr") return this.ola(ctx);
    const t = ctx.currentTime + 0.01;

    const breath = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
    const data = breath.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const h = ctx.createBufferSource();
    h.buffer = breath;
    const hiss = ctx.createBiquadFilter();
    hiss.type = "highpass";
    hiss.frequency.value = 1800;
    const hGain = ctx.createGain();
    hGain.gain.setValueAtTime(0.05, t);
    hGain.gain.linearRampToValueAtTime(0, t + 0.06);
    h.connect(hiss).connect(hGain).connect(ctx.destination);
    h.start(t);

    const v = t + 0.04;
    const voice = ctx.createOscillator();
    voice.type = "square";
    voice.frequency.setValueAtTime(196, v);
    voice.frequency.linearRampToValueAtTime(262, v + 0.1);
    voice.frequency.linearRampToValueAtTime(220, v + 0.26);
    const mouth = ctx.createBiquadFilter();
    mouth.type = "bandpass";
    mouth.Q.value = 4;
    mouth.frequency.setValueAtTime(900, v);
    mouth.frequency.exponentialRampToValueAtTime(2400, v + 0.18);
    const vGain = ctx.createGain();
    vGain.gain.setValueAtTime(0, v);
    vGain.gain.linearRampToValueAtTime(0.22, v + 0.02);
    vGain.gain.setValueAtTime(0.22, v + 0.2);
    vGain.gain.linearRampToValueAtTime(0, v + 0.28);
    voice.connect(mouth).connect(vGain).connect(ctx.destination);
    voice.start(v);
    voice.stop(v + 0.3);
  }

  private ola(ctx: AudioContext) {
    const v = ctx.currentTime + 0.01;
    const voice = ctx.createOscillator();
    voice.type = "square";
    voice.frequency.setValueAtTime(196, v);
    voice.frequency.setValueAtTime(196, v + 0.12);
    voice.frequency.linearRampToValueAtTime(294, v + 0.22);
    voice.frequency.linearRampToValueAtTime(262, v + 0.38);
    const mouth = ctx.createBiquadFilter();
    mouth.type = "bandpass";
    mouth.Q.value = 4;
    mouth.frequency.setValueAtTime(520, v); // "o"
    mouth.frequency.setValueAtTime(520, v + 0.1);
    mouth.frequency.linearRampToValueAtTime(1100, v + 0.18); // "á"
    const vGain = ctx.createGain();
    vGain.gain.setValueAtTime(0, v);
    vGain.gain.linearRampToValueAtTime(0.24, v + 0.02);
    vGain.gain.setValueAtTime(0.24, v + 0.1);
    vGain.gain.linearRampToValueAtTime(0.08, v + 0.13); // "l"
    vGain.gain.linearRampToValueAtTime(0.24, v + 0.17);
    vGain.gain.setValueAtTime(0.24, v + 0.32);
    vGain.gain.linearRampToValueAtTime(0, v + 0.4);
    voice.connect(mouth).connect(vGain).connect(ctx.destination);
    voice.start(v);
    voice.stop(v + 0.42);
  }

  /** An original rising fanfare for opening a chest or sending the form. */
  itemGet() {
    this.play([
      [0, 0.2],
      [hz("G5"), 0.1],
      [hz("C6"), 0.1],
      [hz("E6"), 0.1],
      [hz("G6"), 0.12],
      [0, 0.04],
      [hz("E6"), 0.08],
      [hz("G6"), 0.36],
    ]);
  }
}

const sfx = new Sfx();
export default sfx;

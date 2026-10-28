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

type Voice = { at: number; len: number; freq: number; type: OscillatorType; vol: number };
type Song = { voices: Voice[]; eighth: number; loop: number };

/**
  A loop as a flat list of notes, positioned in eighths: a triangle melody, a triangle bass on
  beats one and three, and a quiet square arpeggio walking each chord in eighths.
*/
function compose(bpm: number, melody: [string, number][], chords: [string, string, string, string][], lead: OscillatorType = "triangle"): Song {
  const voices: Voice[] = [];
  let at = 0;
  for (const [n, len] of melody) {
    if (n !== "-") voices.push({ at, len, freq: hz(n), type: lead, vol: lead === "square" ? 0.022 : 0.05 });
    at += len;
  }
  chords.forEach(([bass, a, b, c], bar) => {
    const start = bar * 8;
    voices.push({ at: start, len: 3, freq: hz(bass), type: "triangle", vol: 0.07 });
    voices.push({ at: start + 4, len: 3, freq: hz(bass), type: "triangle", vol: 0.06 });
    [a, b, c, b, a, b, c, b].forEach((n, i) => voices.push({ at: start + i, len: 1, freq: hz(n), type: "square", vol: 0.008 }));
  });
  return { voices, eighth: 60 / bpm / 2, loop: chords.length * 8 };
}

/*
  The background tune: an original, easy-going 8-bar loop in C (C Am F G C Am Dm G),
  written in eighth notes. A soft triangle melody, a quiet pulse arpeggio and a round
  triangle bass, all kept well under the sound effects.
*/
// [note or "-" for a rest, length in eighths]; every bar adds up to 8
const SITE_SONG = compose(
  92,
  [
    ["E5", 2], ["G5", 2], ["A5", 2], ["G5", 2],
    ["E5", 4], ["C5", 2], ["D5", 2],
    ["C5", 2], ["D5", 2], ["F5", 2], ["A5", 2],
    ["G5", 6], ["-", 2],
    ["E5", 2], ["G5", 2], ["C6", 2], ["B5", 2],
    ["A5", 4], ["G5", 2], ["E5", 2],
    ["F5", 2], ["E5", 2], ["D5", 2], ["F5", 2],
    ["D5", 4], ["B4", 2], ["-", 2],
  ],
  // one chord per bar: bass root, then the three notes the arpeggio walks through
  [
    ["C3", "C4", "E4", "G4"],
    ["A2", "A3", "C4", "E4"],
    ["F2", "F3", "A3", "C4"],
    ["G2", "G3", "B3", "D4"],
    ["C3", "C4", "E4", "G4"],
    ["A2", "A3", "C4", "E4"],
    ["D3", "D4", "F4", "A4"],
    ["G2", "G3", "B3", "D4"],
  ],
);

/*
  The handheld's level tune: an original, bouncy 8-bar loop in G (G Em C D G Em Am D) with a
  square lead, quicker and busier than the site tune, like a pocket console on its one speaker.
*/
const GAME_SONG = compose(
  150,
  [
    ["G5", 1], ["-", 1], ["B5", 1], ["D6", 1], ["-", 1], ["B5", 1], ["D6", 2],
    ["E6", 2], ["D6", 1], ["B5", 1], ["G5", 2], ["-", 2],
    ["E5", 1], ["G5", 1], ["C6", 2], ["B5", 1], ["A5", 1], ["G5", 2],
    ["F#5", 2], ["A5", 2], ["D6", 2], ["-", 2],
    ["G5", 1], ["-", 1], ["B5", 1], ["D6", 1], ["-", 1], ["G6", 1], ["F#6", 2],
    ["E6", 2], ["D6", 1], ["B5", 1], ["E5", 2], ["G5", 2],
    ["A5", 1], ["B5", 1], ["C6", 2], ["E6", 2], ["C6", 2],
    ["D6", 3], ["C6", 1], ["B5", 2], ["A5", 2],
  ],
  [
    ["G2", "G3", "B3", "D4"],
    ["E2", "E3", "G3", "B3"],
    ["C3", "C4", "E4", "G4"],
    ["D3", "D4", "F#4", "A4"],
    ["G2", "G3", "B3", "D4"],
    ["E2", "E3", "G3", "B3"],
    ["A2", "A3", "C4", "E4"],
    ["D3", "D4", "F#4", "A4"],
  ],
  "square",
);

class Sfx {
  muted = $state(true);
  /** sound is on, but the browser hasn't let audio start yet (no click or key since the page opened) */
  locked = $state(false);
  private ctx: AudioContext | undefined;
  private lastBlip = 0;
  private music: { bus: GainNode; timer: ReturnType<typeof setInterval> } | undefined;
  private song = SITE_SONG;

  /** Reads the saved choice. Audio itself only starts after a click (browser autoplay rules). */
  init() {
    try {
      this.muted = localStorage.getItem(STORAGE_KEY) !== "on";
    } catch {
      this.muted = true;
    }
    // Browsers only let audio start after a real gesture, so a saved "on" waits for one.
    // Phones count the end of a tap, not its start, so listen to all of them and only stop
    // once the audio clock is actually running.
    this.locked = !this.muted;
    const gestures = ["pointerdown", "pointerup", "touchend", "click", "keydown"] as const;
    const done = () => {
      this.locked = false;
      for (const g of gestures) window.removeEventListener(g, unlock, true);
    };
    const unlock = () => {
      if (this.muted) return;
      this.startMusic();
      const ctx = this.ctx;
      if (ctx?.state === "running") done();
      else void ctx?.resume().then(() => ctx.state === "running" && done());
    };
    for (const g of gestures) window.addEventListener(g, unlock, { capture: true, passive: true });
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
      // turning it on is itself a click or key press, so audio is allowed from here
      this.locked = false;
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

    const { voices, eighth, loop } = this.song;
    let step = 0;
    let next = ctx.currentTime + 0.1;
    const schedule = () => {
      while (next < ctx.currentTime + 0.4) {
        const pos = step % loop;
        for (const v of voices) {
          if (v.at !== pos) continue;
          const dur = v.len * eighth;
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
        next += eighth;
      }
    };
    schedule();
    this.music = { bus, timer: setInterval(schedule, 100) };
  }

  /** Swaps the site tune for the handheld's level tune (and back), if sound is on. */
  gameMusic(on: boolean) {
    const song = on ? GAME_SONG : SITE_SONG;
    if (song === this.song) return;
    this.song = song;
    if (!this.music) return;
    this.stopMusic();
    this.startMusic();
  }

  /** Hushes the tune for a beat (pause, a fall, the end fanfare) without stopping its clock. */
  duck(on: boolean) {
    const m = this.music;
    const ctx = this.ctx;
    if (!m || !ctx) return;
    m.bus.gain.cancelScheduledValues(ctx.currentTime);
    m.bus.gain.setValueAtTime(m.bus.gain.value, ctx.currentTime);
    m.bus.gain.linearRampToValueAtTime(on ? 0 : 1, ctx.currentTime + 0.15);
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

  // ---- the handheld game

  /** A hop: a quick square sweep up. The second hop, in the air, starts and ends higher. */
  jump(again = false) {
    const ctx = this.audio();
    if (!ctx) return;
    const t = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(again ? 520 : 330, t);
    osc.frequency.exponentialRampToValueAtTime(again ? 1320 : 880, t + 0.14);
    gain.gain.setValueAtTime(0.045, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.16);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  /** The dash: a short square whoosh that drops fast, like air rushing past. */
  dash() {
    const ctx = this.audio();
    if (!ctx) return;
    const t = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.14);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  /** A spring: a quick triangle boing climbing an octave. */
  spring() {
    this.play([
      [hz("C4"), 0.04, "triangle"],
      [hz("G4"), 0.04, "triangle"],
      [hz("C5"), 0.09, "triangle"],
    ], 0.12);
  }

  /** Cracked rock giving way to the dash: a low crunch. */
  smash() {
    this.play([
      [hz("A2"), 0.04],
      [hz("D2"), 0.09],
    ], 0.05);
  }

  /** The checkpoint ribbon going up. */
  check() {
    this.play([
      [hz("E5"), 0.07],
      [hz("G5"), 0.07],
      [hz("C6"), 0.16],
    ], 0.045);
  }

  /** A soft wingbeat while gliding. */
  flap() {
    this.play([[hz("D4"), 0.03, "triangle"]], 0.06);
  }

  coin() {
    this.play([
      [hz("B5"), 0.06],
      [hz("E6"), 0.22],
    ], 0.045);
  }

  stomp() {
    this.play([
      [hz("C5"), 0.03],
      [hz("G5"), 0.05],
    ], 0.06);
  }

  bump() {
    this.play([[hz("C3"), 0.06, "triangle"], [hz("G2"), 0.06, "triangle"]], 0.14);
  }

  die() {
    this.play([
      [hz("B4"), 0.1],
      [hz("F5"), 0.2],
      [0, 0.05],
      [hz("F5"), 0.12],
      [hz("E5"), 0.12],
      [hz("D5"), 0.12],
      [hz("C5"), 0.3],
    ], 0.05);
  }

  clear() {
    this.play([
      [hz("G4"), 0.1],
      [hz("C5"), 0.1],
      [hz("E5"), 0.1],
      [hz("G5"), 0.1],
      [hz("C6"), 0.1],
      [hz("E6"), 0.1],
      [hz("G6"), 0.3],
      [hz("E6"), 0.3],
      [0, 0.06],
      [hz("G#5"), 0.1],
      [hz("C6"), 0.1],
      [hz("D#6"), 0.1],
      [hz("G#6"), 0.3],
      [hz("D#6"), 0.3],
      [0, 0.06],
      [hz("A#5"), 0.1],
      [hz("D6"), 0.1],
      [hz("F6"), 0.1],
      [hz("A#6"), 0.3],
      [hz("C7"), 0.6],
    ], 0.04);
  }

  /** The two-note "ding" when the logo lands, on a power-on. */
  boot() {
    this.play([
      [hz("C6"), 0.08],
      [hz("C7"), 0.5],
    ], 0.04);
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

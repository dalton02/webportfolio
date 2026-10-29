import { dev } from "$app/environment";
import { Text } from "./lang.svelte.ts";
import ui from "$lib/json/ui.json" with { type: "json" };

export const SectionsType = {
  HOME: "home",
  ABOUT: "about",
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  CONTACT: "contact",
} as const;

export type SectionsType = (typeof SectionsType)[keyof typeof SectionsType];

export type Weather = "clear" | "rain" | "wind";

export const headerSections: { label: Text; id: SectionsType }[] = [
  { label: new Text(ui.nav.about), id: "about" },
  { label: new Text(ui.nav.experience), id: "experience" },
  { label: new Text(ui.nav.projects), id: "projects" },
  { label: new Text(ui.nav.contact), id: "contact" },
];

/** Every room, in page order, for the pause-menu map. */
export const allSections: { label: Text; id: SectionsType }[] = [
  { label: new Text(ui.nav.home), id: "home" },
  ...headerSections,
];

class Global {
  activeSection = $state<SectionsType>("home");
  menuOpen = $state(false);
  /** the hidden handheld is on; the HUD keys stand down so A / B reach the game */
  gameOpen = $state(false);
  /** the sections below About (loaded after the first paint) are on the page */
  restLoaded = $state(false);
  basePath = dev ? "" : "/webportfolio";
  /** weather someone stirred up in the field: the frog calls rain, the pinwheel calls wind */
  weather = $state<Weather>("clear");
  /** which way the gale blows: 1 left to right, -1 right to left */
  windDir = $state(1);
  private weatherTimer: ReturnType<typeof setTimeout> | undefined;

  /** One weather at a time; a new one replaces the last, and each blows over by itself after `seconds`. */
  setWeather(kind: Weather, seconds = 0) {
    clearTimeout(this.weatherTimer);
    if (kind === "wind") this.windDir = Math.random() < 0.5 ? 1 : -1;
    this.weather = kind;
    if (kind !== "clear") this.weatherTimer = setTimeout(() => (this.weather = "clear"), seconds * 1000);
  }
}

const globalState = new Global();
export default globalState;

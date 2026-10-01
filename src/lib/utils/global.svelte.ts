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

export const headerSections: { label: Text; id: SectionsType }[] = [
  { label: new Text(ui.nav.about), id: "about" },
  { label: new Text(ui.nav.experience), id: "experience" },
  { label: new Text(ui.nav.projects), id: "projects" },
  { label: new Text(ui.nav.contact), id: "contact" },
];

class Global {
  activeSection = $state<SectionsType>("home");
  basePath = dev ? "" : "/webportfolio";
}

const globalState = new Global();
export default globalState;

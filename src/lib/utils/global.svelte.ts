import { Text } from "./lang.svelte.ts";

export const SectionsType = {
  HOME: "home",
  ABOUT: "about",
  PROJECTS: "projects",
  CONTACT: "contact",
} as const;
export const headerSections: { label: Text; goto: SectionsType }[] = [
  {
    label: new Text({
      ptBr: "Home",
      enUs: "Home",
    }),
    goto: "home",
  },
  {
    label: new Text({
      ptBr: "Sobre",
      enUs: "About",
    }),
    goto: "about",
  },
  {
    label: new Text({
      ptBr: "Projetos",
      enUs: "Projects",
    }),
    goto: "projects",
  },
  {
    label: new Text({
      ptBr: "Contato",
      enUs: "Contact",
    }),
    goto: "contact",
  },
];

export type SectionsType = (typeof SectionsType)[keyof typeof SectionsType];
class Global {
  prevPage = $state("");
}

const globalState = new Global();
export default globalState;

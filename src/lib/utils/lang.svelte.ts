import { enUS, ptBR } from "date-fns/locale";

export type TextType = {
  ptBr: string;
  enUs: string;
};

class Language {
  value = $state<keyof TextType>("ptBr");

  locale = $derived.by(() => {
    switch (this.value) {
      case "ptBr":
        return ptBR;
      case "enUs":
        return enUS;
    }
  });

  /** Picks the initial language: the visitor's saved choice, else Portuguese only for pt browsers. */
  set() {
    const saved = readSaved();
    if (saved) {
      this.value = saved;
      return;
    }

    this.value = navigator.language.toLowerCase().startsWith("pt") ? "ptBr" : "enUs";
  }

  /** Manual switch from the header; remembered for the next visit. */
  toggle() {
    this.value = this.value === "ptBr" ? "enUs" : "ptBr";
    try {
      localStorage.setItem(STORAGE_KEY, this.value);
    } catch {
      // storage blocked (private mode etc.): the switch still works for this visit
    }
  }
}

const STORAGE_KEY = "lang";

function readSaved(): keyof TextType | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "ptBr" || v === "enUs" ? v : null;
  } catch {
    return null;
  }
}

const language = new Language();

export default language;

export class Text {
  private text: TextType;
  constructor(text: TextType) {
    this.text = text;
  }

  get value() {
    return this.text[language.value];
  }
}

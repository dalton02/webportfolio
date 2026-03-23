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

  set() {
    const userLanguage = navigator.language;
    console.log(userLanguage);
    const isEnglish = userLanguage.startsWith("en");
    if (isEnglish) {
      this.value = "enUs";
      return;
    }

    this.value = "ptBr";
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

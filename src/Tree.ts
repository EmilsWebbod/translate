import Branch, { BranchObject, Translations } from './Branch';
import Empty from './Empty';
import { arrayToObject, getFirst } from './utils/helpers';

export interface WordTranslations {
  [translate: string]: {
    [locale: string]: string;
  };
}

export interface TreeOptions {
  words?: WordTranslations;
  texts?: WordTranslations;
}

export default class Tree {
  public words: BranchObject = {};
  public texts: BranchObject = {};

  constructor({ words = {}, texts = {} }: TreeOptions) {
    Object.keys(words).map(k => this.addWord(k, words[k]));
    Object.keys(texts).map(k => this.addText(k, texts[k]));
  }

  public addWord(word: string, translations?: Translations, apiID?: string) {
    const char = getFirst(word);

    if (this.words[char]) {
      this.words[char].add(word, translations, apiID);
    } else {
      this.words[char] = new Branch(0, word, false, translations, apiID);
    }
  }

  public addText(text: string, translations?: Translations, apiID?: string) {
    const word = getFirst(text, true);

    if (this.texts[word]) {
      this.texts[word].add(text, translations, apiID);
    } else {
      this.texts[word] = new Branch(0, text, true, translations, apiID);
    }
  }

  public word(word: string): Branch | Empty {
    const char = getFirst(word);
    return this.words[char]
      ? this.words[char].find(word)
      : new Empty(this, word);
  }

  public text(text: string): Branch | Empty {
    const word = getFirst(text, true);
    return this.texts[word]
      ? this.texts[word].find(text)
      : new Empty(this, text, true);
  }

  public suggestions(text: boolean): Branch[] {
    return text
      ? this.textMap(x => x.suggestions()).flat()
      : this.wordMap(x => x.suggestions()).flat();
  }

  public exportWords() {
    return this.wordMap(x => x.export()).reduce(arrayToObject, {});
  }

  public exportTexts() {
    return this.textMap(x => x.export()).reduce(arrayToObject, {});
  }

  private wordMap<T extends any>(fn: (branch: Branch) => T) {
    return Object.keys(this.words).map(k => fn(this.words[k]));
  }

  private textMap<T extends any>(fn: (branch: Branch) => T) {
    return Object.keys(this.texts).map(k => fn(this.texts[k]));
  }
}

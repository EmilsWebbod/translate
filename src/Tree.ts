import Branch, { BranchObject } from './Branch';
import Empty from './Empty';
import { suggestions } from './utils/helpers';

export interface TreeOptions {
  words?: string[];
  texts?: string[];
  sentence?: boolean;
}

export default class Tree {
  public words: BranchObject = {};
  public texts: BranchObject = {};

  constructor({ words = [], texts = [] }: TreeOptions) {
    for (const word of words) {
      this.addWord(word);
    }

    for (const text of texts) {
      this.addText(text);
    }
  }

  public addWord(word: string) {
    const char = this.getFirst(word);

    if (this.words[char]) {
      this.words[char].add(word);
    } else {
      this.words[char] = new Branch(0, word);
    }
  }

  public addText(text: string) {
    const word = this.getFirst(text, true);

    if (this.texts[word]) {
      this.texts[word].add(text);
    } else {
      this.texts[word] = new Branch(0, text, true);
    }
  }

  public w(word: string) {
    return this.word(word);
  }
  public word(word: string): Branch | Empty {
    const char = this.getFirst(word);
    return this.words[char]
      ? this.words[char].find(word)
      : new Empty(this, word);
  }

  public t(text: string) {
    return this.text(text);
  }
  public text(text: string): Branch | Empty {
    const word = this.getFirst(text, true);
    return this.texts[word]
      ? this.texts[word].find(text)
      : new Empty(this, text, true);
  }

  public suggestions(text: boolean): Branch[] {
    return text
      ? this.textMap(x => x.suggestions()).flat()
      : this.wordMap(x => x.suggestions()).flat();
  }

  private getFirst(word: string, sentence = false) {
    if (sentence) {
      return word.split(' ')[0].toLowerCase();
    }
    return word[0].toLowerCase();
  }

  private wordMap<T extends any>(fn: (branch: Branch) => T) {
    return Object.keys(this.words).map(k => fn(this.words[k]));
  }

  private textMap<T extends any>(fn: (branch: Branch) => T) {
    return Object.keys(this.texts).map(k => fn(this.texts[k]));
  }
}

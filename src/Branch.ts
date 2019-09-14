import Empty from './Empty';
import { add } from './utils/math';
import { getWord, suggestions } from './utils/helpers';
import { WordTranslation } from './Tree';

export interface BranchObject {
  [key: string]: Branch;
}

export interface Translations {
  [key: string]: string;
}

export default class Branch {
  public words: BranchObject = {};
  public isWord: boolean = false;
  public word: string;
  public translations: Translations = {};

  constructor(
    public level: number,
    word: string,
    public sentence: boolean = false,
    translations: Translations = {}
  ) {
    this.word = getWord(level, word, sentence);
    const char = this.getNextCharacter(word);

    if (char) {
      this.words[char] = new Branch(
        this.level + 1,
        word,
        sentence,
        translations
      );
    } else {
      this.translations = translations;
      this.isWord = true;
    }
  }

  public add(newWord: string, translations?: Translations) {
    if (this.match(newWord)) {
      return false;
    }

    const char = this.getNextCharacter(newWord);

    if (this.words[char]) {
      this.words[char].add(newWord, translations);
    } else {
      this.words[char] = new Branch(
        this.level + 1,
        newWord,
        this.sentence,
        translations
      );
    }

    return true;
  }

  public find(word: string): Branch | Empty {
    if (this.validateCharacters(word)) {
      return new Empty(this, word);
    }

    if (this.matchWord(word)) {
      return this;
    }

    const char = this.getNextCharacter(word);

    if (this.words[char]) {
      return this.words[char].find(word);
    }

    return new Empty(this, word);
  }

  public addTranslation(locale: string, translation: string) {
    this.translations[locale] = translation;
  }

  public translate(locale: string) {
    return this.translations[locale] || this;
  }

  public suggestions(): Branch[] {
    return suggestions.bind(this)();
  }

  public wordCount(): number {
    return this.map(x => x.wordCount()).reduce(add, 0) + 1;
  }

  public export(): WordTranslation[] {
    return this.isWord
      ? [
          {
            word: this.word,
            translations: this.translations
          },
          ...this.map(x => x.export()).flat()
        ]
      : this.map(x => x.export()).flat();
  }

  public toString(): string {
    const str = `${this.level} ${this.word} \n`;
    return str + this.map(x => x.toString()).join('');
  }

  public map(fn: (branch: Branch) => any) {
    return Object.keys(this.words).map(k => fn(this.words[k]));
  }

  private getNextCharacter(word: string) {
    if (this.sentence) {
      const split = word.split(' ')[this.level + 1];
      return split ? split.toLowerCase() : '';
    } else {
      return word[this.level + 1] ? word[this.level + 1].toLowerCase() : '';
    }
  }

  private match(newWord: string) {
    return this.matchWord(newWord) || this.validateCharacters(newWord);
  }

  private validateCharacters(newWord: string) {
    let w;
    let nw;

    if (this.sentence) {
      w = this.word.split(' ')[this.level];
      nw = newWord.split(' ')[this.level];
    } else {
      w = this.word[this.level];
      nw = newWord[this.level];
    }

    return Boolean(w && nw && w.toLowerCase() !== nw.toLowerCase());
  }

  private matchWord(newWord: string) {
    return this.word.toLowerCase() === newWord.toLowerCase();
  }
}

import Empty from './Empty';

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
    public sentence: boolean = false
  ) {
    this.word = this.getWord(word);
    const char = this.getNextCharacter(word);
    if (char) {
      this.words[char] = new Branch(this.level + 1, word, sentence);
    } else {
      this.isWord = true;
    }
  }

  public add(newWord: string) {
    if (this.match(newWord)) {
      return false;
    }

    const char = this.getNextCharacter(newWord);

    if (this.words[char]) {
      this.words[char].add(newWord);
    } else {
      this.words[char] = new Branch(this.level + 1, newWord, this.sentence);
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
    return this.translations[locale];
  }

  public suggestions(): Branch[] {
    let sug = [];

    if (this.isWord) {
      sug.push(this as Branch);
    }

    for (const key in this.words) {
      if (this.words.hasOwnProperty(key)) {
        sug = [...sug, ...this.words[key].suggestions()];
      }
    }

    return sug;
  }

  public wordCount(): number {
    let count = 1;
    for (const key in this.words) {
      if (this.words.hasOwnProperty(key)) {
        count += this.words[key].wordCount();
      }
    }

    return count;
  }

  public toString() {
    let str = `${this.level} ${this.word} \n`;

    for (const key in this.words) {
      if (this.words.hasOwnProperty(key)) {
        str += this.words[key].toString();
      }
    }

    return str;
  }

  private getWord(word: string) {
    if (this.sentence) {
      return word
        .split(' ')
        .slice(0, this.level + 1)
        .join(' ');
    }
    return word.slice(0, this.level + 1);
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

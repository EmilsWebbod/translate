export interface BranchObject {
  [key: string]: Branch;
}

export default class Branch {
  public words: BranchObject = {};
  public isWord: boolean = false;
  public word: string;

  constructor(public level: number, word: string) {
    this.word = word.slice(0, this.level + 1);
    const char = this.getNextCharacter(word);
    if (char) {
      this.words[char] = new Branch(this.level + 1, word);
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
      this.words[char] = new Branch(this.level + 1, newWord);
    }

    return true;
  }

  public find(word: string): boolean {
    if (this.matchCharacters(word)) {
      return false;
    }

    if (this.matchWord(word)) {
      return true;
    }

    const char = word[this.level + 1];

    if (this.words[char]) {
      return this.words[char].find(word);
    }

    return false;
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

  private getNextCharacter(word: string) {
    return word[this.level + 1] ? word[this.level + 1].toLowerCase() : '';
  }

  private match(newWord: string) {
    return this.matchWord(newWord) || this.matchCharacters(newWord);
  }

  private matchCharacters(newWord: string) {
    const w = this.word[this.level];
    const nw = newWord[this.level];
    return Boolean(w && nw && w.toLowerCase() !== nw.toLowerCase());
  }

  private matchWord(newWord: string) {
    return this.word.toLowerCase() === newWord.toLowerCase();
  }
}

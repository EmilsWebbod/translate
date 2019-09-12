export default class Branch {
  public words: Branch[] = [];
  public word: string;

  constructor(public level: number, word: string) {
    this.word = word.slice(0, this.level + 1);
    if (word[level + 1]) {
      this.words = [new Branch(this.level + 1, word)];
    }
  }

  public add(newWord: string) {
    if (this.match(newWord)) {
      return false;
    }

    let added = false;
    for (const word of this.words) {
      if (word.add(newWord)) {
        added = true;
        break;
      }
    }

    if (!added && !this.words.some(x => this.matchWord.bind(x)(newWord))) {
      this.words.push(new Branch(this.level + 1, newWord));
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

    if (this.words.length) {
      return this.words.some(x => x.find(word));
    }

    return false;
  }

  public wordCount(): number {
    return this.words.reduce<number>((num, word) => num + word.wordCount(), 1);
  }

  public toString() {
    let str = `${this.level} ${this.word} \n`;
    for (const word of this.words) {
      str += word.toString();
    }
    return str;
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

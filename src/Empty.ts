import Branch from './Branch';

export default class Empty {
  public word = null;

  constructor(public branch: Branch, public addWord: string) {}

  public translate(locale: string) {
    return 'N/T';
  }

  public add() {
    this.branch.add(this.addWord);
  }

  public suggestions() {
    const words = this.branch.suggestions();
    return words.map(x => x.word).join(', ');
  }
}

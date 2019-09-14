import Branch from './Branch';
import Tree from './Tree';

export default class Empty {
  public word: null = null;

  constructor(
    public branch: Branch | Tree,
    public addWord: string,
    public treeSentence = false
  ) {}

  public translate(locale: string) {
    return 'N/T';
  }

  public add() {
    if ('isWord' in this.branch) {
      this.branch.add(this.addWord);
    } else {
      if (this.treeSentence) {
        this.branch.addText(this.addWord);
      } else {
        this.branch.addWord(this.addWord);
      }
    }
  }

  public suggestions() {
    let words: Branch[];

    if ('isWord' in this.branch) {
      words = this.branch.suggestions();
    } else {
      words = this.branch.suggestions(this.treeSentence);
    }

    return words.map(x => x.word).join(', ');
  }
}

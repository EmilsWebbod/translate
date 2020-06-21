import Branch, { Translations } from './Branch';
import Tree from './Tree';
import ApiBranch from './ApiBranch';

export default class Empty extends ApiBranch {
  public apiID = '';

  constructor(
    public branch: Branch | Tree,
    word: string,
    public isTreeText = false
  ) {
    super(word);
  }

  public translate(_: string) {
    return `N/W (${this.word})`;
  }

  public add(translations?: Translations) {
    if (this.branch instanceof Branch) {
      this.branch.add(this.word, translations, this.apiID);
    } else {
      if (this.isTreeText) {
        this.branch.addText(this.word, translations, this.apiID);
      } else {
        this.branch.addWord(this.word, translations, this.apiID);
      }
    }
  }

  public suggestions() {
    let words: Branch[];

    if ('isWord' in this.branch) {
      words = this.branch.suggestions();
    } else {
      words = this.branch.suggestions(this.isTreeText);
    }

    return words.map(x => x.word).join(', ');
  }
}

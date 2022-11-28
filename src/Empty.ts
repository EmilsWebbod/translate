import Branch, { Translations } from './Branch.js';
import Tree from './Tree.js';
import ApiBranch from './ApiBranch.js';

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

  public add(translations: Translations = {}) {
    this.translations = translations;
    if (this.branch instanceof Branch) {
      this.branch.add(this.word, translations, {
        apiID: this.apiID,
      });
    } else {
      if (this.isTreeText) {
        this.branch.addText(this.word, translations, {
          apiID: this.apiID,
        });
      } else {
        this.branch.addWord(this.word, translations, {
          apiID: this.apiID,
        });
      }
    }
  }

  public suggestions(): Branch[] {
    let words: Branch[];

    if ('isWord' in this.branch) {
      words = this.branch.suggestions();
    } else {
      words = this.branch.suggestions(this.isTreeText);
    }

    return words;
  }
}

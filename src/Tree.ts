import Branch from './Branch';

export interface TreeOptions {
  words?: string[];
}

export default class Tree {
  public words: Branch[] = [];

  constructor({ words = [] }: TreeOptions) {
    for (const word of words) {
      this.addWord(word);
    }
  }

  public addWord(word: string) {
    let added = false;
    for (const branch of this.words) {
      if (branch.add(word)) {
        added = true;
        break;
      }
    }

    if (!added) {
      const branch = new Branch(0, word);
      this.words.push(branch);
    }
  }
}

import Tree, { TreeOptions } from './Tree';

interface Options {
  lang: string;
  words?: string[];
}

export default class Translate {
  public options: Options;
  public tree: Tree;

  constructor({ lang = 'en', words = [] }: Options) {
    this.options = {
      lang
    };

    this.tree = new Tree({
      words
    });
  }
}

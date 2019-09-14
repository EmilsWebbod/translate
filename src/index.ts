import Tree, { WordTranslation, TreeOptions } from './Tree';
import Empty from './Empty';
import Branch, { Translations, BranchObject } from './Branch';

export interface TranslateOptions {
  defaultLocale: string;
  locale: string;
  words: WordTranslation[];
  texts: WordTranslation[];
}

export interface FindOptions {
  locale?: string;
  noMatch?: (empty: Empty) => void;
  noTranslation?: (empty: Branch) => void;
}

export default class Translate {
  public defaultLocale: string;
  public locale: string;
  public tree: Tree;

  constructor({
    defaultLocale = 'en',
    locale = 'en',
    words = [],
    texts = []
  }: TranslateOptions) {
    this.defaultLocale = defaultLocale;
    this.locale = locale;

    this.tree = new Tree({
      words,
      texts
    });
  }

  public word(
    word: string,
    { noMatch, noTranslation, locale = this.locale }: FindOptions = {}
  ) {
    if (this.defaultLocale === locale) {
      return word;
    }

    const foundWord = this.tree.word(word);

    if (typeof noMatch === 'function' && foundWord instanceof Empty) {
      noMatch(foundWord);
    }

    const translated = foundWord.translate(locale);

    if (typeof noTranslation === 'function' && translated instanceof Branch) {
      noTranslation(translated);
      return 'N/W';
    }

    return translated;
  }

  public text(
    text: string,
    { noMatch, noTranslation, locale = this.locale }: FindOptions = {}
  ) {
    if (this.defaultLocale === locale) {
      return text;
    }

    const foundText = this.tree.text(text);

    if (typeof noMatch === 'function' && foundText instanceof Empty) {
      noMatch(foundText);
    }

    const translated = foundText.translate(locale);

    if (typeof noTranslation === 'function' && translated instanceof Branch) {
      noTranslation(translated);
      return 'N/W';
    }

    return translated;
  }

  public changeLocale(locale: string) {
    this.locale = locale;
  }

  public export() {
    return {
      words: this.exportWords(),
      texts: this.exportTexts()
    };
  }

  public exportWords() {
    return this.tree.exportWords();
  }

  public exportTexts() {
    return this.tree.exportTexts();
  }
}

export {
  Tree,
  Branch,
  Translate,
  WordTranslation,
  TreeOptions,
  Translations,
  BranchObject
};

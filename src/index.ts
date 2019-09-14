import Tree, { WordTranslation, TreeOptions } from './Tree';
import Empty from './Empty';
import Branch, { Translations, BranchObject } from './Branch';

type NoMatchFn = (empty: Empty) => void;
type NoTranslationFn = (empty: Branch) => void;
export interface TranslateOptions {
  defaultLocale: string;
  locale: string;
  words: WordTranslation[];
  texts: WordTranslation[];

  noMatch?: NoMatchFn;
  noTranslation?: NoTranslationFn;
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

  private readonly noMatch: NoMatchFn | undefined;
  private readonly noTranslation: NoTranslationFn | undefined;

  constructor({
    defaultLocale = 'en',
    locale = 'en',
    words = [],
    texts = [],
    noMatch,
    noTranslation
  }: TranslateOptions) {
    this.defaultLocale = defaultLocale;
    this.locale = locale;
    this.noMatch = noMatch;
    this.noTranslation = noTranslation;

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

    if (foundWord instanceof Empty) {
      if (typeof noMatch === 'function') {
        noMatch(foundWord);
      }
      if (typeof this.noMatch === 'function') {
        this.noMatch(foundWord);
      }
    }

    const translated = foundWord.translate(locale);

    if (translated instanceof Branch) {
      if (typeof noTranslation === 'function') {
        noTranslation(translated);
      }

      if (typeof this.noTranslation === 'function') {
        this.noTranslation(translated);
      }

      return 'N/T';
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

    if (foundText instanceof Empty) {
      if (typeof noMatch === 'function') {
        noMatch(foundText);
      }
      if (typeof this.noMatch === 'function') {
        this.noMatch(foundText);
      }
    }

    const translated = foundText.translate(locale);

    if (translated instanceof Branch) {
      if (typeof noTranslation === 'function') {
        noTranslation(translated);
      }

      if (typeof this.noTranslation === 'function') {
        this.noTranslation(translated);
      }

      return 'N/T';
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
  Empty,
  Branch,
  Translate,
  WordTranslation,
  TreeOptions,
  Translations,
  BranchObject
};

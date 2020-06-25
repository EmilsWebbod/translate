import Tree, { WordTranslations, TreeOptions } from './Tree';
import Empty from './Empty';
import Branch, { Translations, BranchObject } from './Branch';
import { VARIABLE_REGEXP } from './utils/helpers';
import { ISO_639_1 } from './utils/iso_639_1';
import { TranslationApi } from './TranslationApi';

type NoMatchFn = (translate: Translate, empty: Empty) => void;
type NoTranslationFn = (translate: Translate, empty: Branch) => void;
interface TranslateOptions {
  defaultLocale: string;
  locale: string;
  words: WordTranslations;
  texts: WordTranslations;

  noMatch?: NoMatchFn;
  noTranslation?: NoTranslationFn;
}

interface Variables {
  [variable: string]: string | number | undefined;
}

interface TextOptions extends Variables {
  locale?: string;
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
    words = {},
    texts = {},
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

  public w(word: string, locale?: string) {
    return this.word(word, locale);
  }
  public word(word: string, locale = this.locale) {
    if (this.defaultLocale === locale) {
      return word;
    }

    const foundWord = this.tree.word(word);

    return this.translateAndRunNoMatch(foundWord, locale);
  }

  public t(text: string, opts?: TextOptions) {
    return this.text(text, opts);
  }
  public text(
    text: string,
    { locale = this.locale, ...variables }: TextOptions = {}
  ) {
    if (this.defaultLocale === locale) {
      return this.replaceVariables(text, variables);
    }

    const foundText = this.tree.text(text);
    const translated = this.translateAndRunNoMatch(foundText, locale);
    return this.replaceVariables(translated, variables);
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

  private replaceVariables(text: string, variables: Variables) {
    if (Object.keys(variables).length === 0) {
      return text;
    }
    return text.replace(VARIABLE_REGEXP, (word, group) => {
      return String(variables[group] || word);
    });
  }

  private translateAndRunNoMatch(foundText: Branch | Empty, locale: string) {
    if (foundText instanceof Empty) {
      if (typeof this.noMatch === 'function') {
        this.noMatch(this, foundText);
      }
    }

    const translated = foundText.translate(locale);

    if (translated instanceof Branch) {
      if (typeof this.noTranslation === 'function') {
        this.noTranslation(this, translated);
      }

      return `N/T (${foundText.word})`;
    }

    return translated;
  }
}

export {
  Tree,
  Empty,
  Branch,
  Translate,
  TranslateOptions,
  WordTranslations,
  TreeOptions,
  Translations,
  BranchObject,
  Variables,
  TextOptions,
  ISO_639_1,
  TranslationApi
};

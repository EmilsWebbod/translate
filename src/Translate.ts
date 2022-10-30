import Tree, { WordTranslations } from './Tree';
import Branch, {
  TranslationAddOptions,
  TranslationExportFilter,
} from './Branch';
import { VARIABLE_REGEXP } from './utils/helpers';
import Empty from './Empty';
import { TextOptions, TranslateOptions, Variables } from './index';

export type NoMatchFn = (translate: Translate, empty: Empty) => void;
export type NoTranslationFn = (translate: Translate, empty: Branch) => void;
let translate: Translate;
export default class Translate {
  public defaultLocale: string = '';
  public locale: string = '';
  public tree: Tree = new Tree({});

  private readonly noMatch: NoMatchFn | undefined;
  private readonly noTranslation: NoTranslationFn | undefined;

  constructor(
    {
      defaultLocale = 'en',
      locale = 'en',
      words = {},
      texts = {},
      noMatch,
      noTranslation,
    }: TranslateOptions = {},
    overrideNew?: boolean
  ) {
    if (!overrideNew && translate) {
      return translate;
    }
    this.defaultLocale = defaultLocale;
    this.locale = locale;
    this.noMatch = noMatch;
    this.noTranslation = noTranslation;

    this.tree = new Tree({
      words,
      texts,
    });

    translate = this;
  }

  public w(word: string, locale?: string) {
    return this.word(word, locale);
  }

  public word(word: string, locale = this.locale) {
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
      texts: this.exportTexts(),
    };
  }

  public exportWords(filter?: TranslationExportFilter) {
    return this.tree.exportWords(filter);
  }

  public exportTexts(filter?: TranslationExportFilter) {
    return this.tree.exportTexts(filter);
  }

  public exportBranches() {
    return [...this.tree.suggestions(false), ...this.tree.suggestions(true)];
  }

  public getWord(word: string) {
    return this.getBranch(word);
  }

  public getText(text: string) {
    return this.getBranch(text, true);
  }

  public getBranch(wordOrText: string, isText = false) {
    return this._branch(wordOrText, isText);
  }

  // todo: Create test
  public delete(wordOrText: string) {
    const branch = this._branch(wordOrText);
    if (branch) {
      branch.isWord = false;
      return branch;
    }
    return null;
  }

  public setLocale(locale: string) {
    this.locale = locale;
  }

  public addWords(words: WordTranslations, opts?: TranslationAddOptions) {
    Object.keys(words).forEach((key) =>
      this.tree.addWord(key, words[key], opts)
    );
  }

  public addTexts(texts: WordTranslations, opts?: TranslationAddOptions) {
    Object.keys(texts).forEach((key) =>
      this.tree.addText(key, texts[key], opts)
    );
  }

  private _branch(wordOrText: string, isText = false) {
    if (!isText) {
      const word = this.tree.word(wordOrText);
      if (word instanceof Branch) {
        return word;
      }
    } else {
      const text = this.tree.text(wordOrText);
      if (text instanceof Branch) {
        return text;
      }
    }
    return null;
  }

  private replaceVariables(text: string, variables: Variables) {
    if (Object.keys(variables).length === 0) {
      return text;
    }
    return text.replace(VARIABLE_REGEXP, (word, group) => {
      return String(variables[group] ?? word);
    });
  }

  private translateAndRunNoMatch(foundText: Branch | Empty, locale: string) {
    if (foundText instanceof Empty) {
      if (typeof this.noMatch === 'function') {
        this.noMatch(this, foundText);
      }
    }

    if (this.defaultLocale === locale) {
      return foundText.word;
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
export { Translate };

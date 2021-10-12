import Empty from './Empty';
import { add } from './utils/math';
import { arrayToObject, getWord, suggestions } from './utils/helpers';
import { WordTranslations } from './Tree';
import ApiBranch from './ApiBranch';

export interface BranchObject {
  [key: string]: Branch;
}

export interface Translations {
  [key: string]: string;
}

export interface TranslationUsage {
  file: string;
  stack: string;
}

export interface TranslationAddOptions {
  apiID?: string;
  packageName?: string | null; // null is root package
}

export type TranslationExportFilter = Pick<
  TranslationAddOptions,
  'packageName'
>;

const FILTER_STACK_PATHS = /(Branch|Tree|Translate)\./;
const FILTER_STACK_TRANS = /Translate._branch/;

export default class Branch extends ApiBranch {
  public words: BranchObject = {};
  public isWord: boolean = false;
  public usageStack: TranslationUsage[] = [];
  public readonly apiID: string = '';
  public readonly packageName: string | null = null;

  constructor(
    public level: number,
    word: string,
    public sentence: boolean = false,
    translations: Translations = {},
    opts: TranslationAddOptions = {}
  ) {
    super(getWord(level, word, sentence));
    const char = this.getNextCharacter(word);

    if (char) {
      this.words[char] = new Branch(
        this.level + 1,
        word,
        sentence,
        translations,
        opts
      );
    } else {
      this.translations = translations;
      this.isWord = true;
      this.apiID = opts?.apiID || '';
      this.packageName = opts?.packageName || null;
    }
  }

  public add(
    newWord: string,
    translations?: Translations,
    opts: TranslationAddOptions = {}
  ) {
    if (this.match(newWord)) {
      if (!this.isWord) {
        this.isWord = true;
        return true;
      } else {
        return false;
      }
    }

    const char = this.getNextCharacter(newWord);

    if (this.words[char]) {
      this.words[char].add(newWord, translations, opts);
    } else {
      this.words[char] = new Branch(
        this.level + 1,
        newWord,
        this.sentence,
        translations,
        opts
      );
    }

    return true;
  }

  public find(word: string): Branch | Empty {
    if (this.isInvalid(word)) {
      return new Empty(this, word, this.sentence);
    }

    if (this.matchWord(word)) {
      const error = new Error();
      if (error.stack) {
        const pathArr = error.stack.split('\n');
        const filterPaths = pathArr.filter((x) => !x.match(FILTER_STACK_PATHS));
        const paths = filterPaths.slice(1).map((x) => x.split('at ')[1] || '');
        const file = paths[0].split(' ')[0];
        const isTranslations = !pathArr.some((x) =>
          x.match(FILTER_STACK_TRANS)
        );
        if (isTranslations && this.usageStack.every((x) => x.file !== file)) {
          this.usageStack.push({
            file,
            stack: filterPaths.join('\n'),
          });
        }
      }
      return this.isWord ? this : new Empty(this, word, this.sentence);
    }

    const char = this.getNextCharacter(word);

    if (this.words[char]) {
      return this.words[char].find(word);
    }

    return new Empty(this, word, this.sentence);
  }

  public addTranslations(translations: Translations) {
    for (const lang in translations) {
      if (translations.hasOwnProperty(lang)) {
        this.addTranslation(lang, translations[lang]);
      }
    }
  }

  public addTranslation(locale: string, translation: string) {
    this.translations[locale] = translation;
  }

  public translate(locale: string) {
    return this.translations[locale] || this;
  }

  public suggestions(): Branch[] {
    return suggestions.bind(this)();
  }

  public wordCount(): number {
    return this.map((x) => x.wordCount()).reduce(add, 0) + 1;
  }

  public export(filter?: TranslationExportFilter): WordTranslations {
    if (this.isWord) {
      if (this.notFiltered(filter)) {
        return {
          [this.word]: this.translations,
          ...this.map((x) => x.export(filter)).reduce(arrayToObject, {}),
        };
      }
    }
    return this.map((x) => x.export(filter)).reduce(arrayToObject, {});
  }

  public toString(): string {
    const str = `${this.level} ${this.word} \n`;
    return str + this.map((x) => x.toString()).join('');
  }

  public map(fn: (branch: Branch) => any) {
    return Object.keys(this.words).map((k) => fn(this.words[k]));
  }

  private notFiltered(filter?: TranslationExportFilter) {
    if (!filter) {
      return true;
    }
    if (
      typeof filter.packageName === 'undefined' ||
      filter.packageName === this.packageName
    ) {
      return true;
    }
    return false;
  }

  private getNextCharacter(word: string) {
    if (this.sentence) {
      const split = word.split(' ')[this.level + 1];
      return split ? split.toLocaleLowerCase() : '';
    } else {
      return word[this.level + 1] || '';
    }
  }

  private match(newWord: string) {
    return this.matchWord(newWord) || this.isInvalid(newWord);
  }

  private isInvalid(newWord: string) {
    let w;
    let nw;

    if (!newWord) {
      return true;
    }

    if (this.sentence) {
      w = this.word.split(' ')[this.level];
      nw = newWord.split(' ')[this.level];
      if (w) {
        w = w.toLocaleLowerCase();
      }
      if (nw) {
        nw = nw.toLocaleLowerCase();
      }
    } else {
      w = this.word[this.level];
      nw = newWord[this.level];
    }

    return Boolean(w && nw && w !== nw);
  }

  private matchWord(newWord: string) {
    return this.sentence
      ? this.word.toLocaleLowerCase() === newWord.toLocaleLowerCase()
      : this.word === newWord;
  }
}

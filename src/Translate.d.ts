import Tree, { WordTranslations } from './Tree.js';
import Branch, { TranslationAddOptions, TranslationExportFilter } from './Branch.js';
import Empty from './Empty.js';
import { TextOptions, TranslateOptions } from './index.js';
export type NoMatchFn = (translate: Translate, empty: Empty) => void;
export type NoTranslationFn = (translate: Translate, empty: Branch) => void;
export default class Translate {
    defaultLocale: string;
    locale: string;
    tree: Tree;
    private readonly noMatch;
    private readonly noTranslation;
    constructor({ defaultLocale, locale, words, texts, noMatch, noTranslation, }?: TranslateOptions, overrideNew?: boolean);
    w(word: string, locale?: string): string;
    word(word: string, locale?: string): string;
    t(text: string, opts?: TextOptions): string;
    text(text: string, { locale, ...variables }?: TextOptions): string;
    changeLocale(locale: string): void;
    export(): {
        words: WordTranslations;
        texts: WordTranslations;
    };
    exportWords(filter?: TranslationExportFilter): WordTranslations;
    exportTexts(filter?: TranslationExportFilter): WordTranslations;
    exportBranches(): Branch[];
    getWord(word: string): Branch | null;
    getText(text: string): Branch | null;
    getBranch(wordOrText: string, isText?: boolean): Branch | null;
    delete(wordOrText: string): Branch | null;
    setLocale(locale: string): void;
    addWords(words: WordTranslations, opts?: TranslationAddOptions): void;
    addTexts(texts: WordTranslations, opts?: TranslationAddOptions): void;
    private _branch;
    private replaceVariables;
    private translateAndRunNoMatch;
}
export { Translate };
//# sourceMappingURL=Translate.d.ts.map
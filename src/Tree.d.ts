import Branch, { BranchObject, TranslationAddOptions, TranslationExportFilter, Translations } from './Branch.js';
import Empty from './Empty.js';
export interface WordTranslations {
    [translate: string]: {
        [locale: string]: string;
    };
}
export interface TreeOptions {
    words?: WordTranslations;
    texts?: WordTranslations;
}
export default class Tree {
    words: BranchObject;
    texts: BranchObject;
    constructor({ words, texts }: TreeOptions);
    addWord(word: string, translations?: Translations, opts?: TranslationAddOptions): void;
    addText(text: string, translations?: Translations, opts?: TranslationAddOptions): void;
    word(word: string): Branch | Empty;
    text(text: string): Branch | Empty;
    suggestions(text: boolean): Branch[];
    exportWords(filter?: TranslationExportFilter): WordTranslations;
    exportTexts(filter?: TranslationExportFilter): WordTranslations;
    private wordMap;
    private textMap;
}
//# sourceMappingURL=Tree.d.ts.map
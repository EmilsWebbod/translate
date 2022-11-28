import Empty from './Empty.js';
import { WordTranslations } from './Tree.js';
import ApiBranch from './ApiBranch.js';
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
    packageName?: string | null;
}
export type TranslationExportFilter = Pick<TranslationAddOptions, 'packageName'>;
export default class Branch extends ApiBranch {
    level: number;
    sentence: boolean;
    words: BranchObject;
    isWord: boolean;
    usageStack: TranslationUsage[];
    packageName: string | null;
    constructor(level: number, word: string, sentence?: boolean, translations?: Translations, opts?: TranslationAddOptions);
    init(opts: TranslationAddOptions): void;
    add(newWord: string, translations?: Translations, opts?: TranslationAddOptions): boolean;
    find(word: string): Branch | Empty;
    addTranslations(translations: Translations): void;
    addTranslation(locale: string, translation: string): void;
    translate(locale: string): string | this;
    suggestions(): Branch[];
    wordCount(): number;
    export(filter?: TranslationExportFilter): WordTranslations;
    toString(): string;
    map(fn: (branch: Branch) => any): any[];
    private notFiltered;
    private getNextCharacter;
    private match;
    private isInvalid;
    private matchWord;
}
//# sourceMappingURL=Branch.d.ts.map
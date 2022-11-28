import Tree, { TreeOptions, WordTranslations } from './Tree.js';
import Empty from './Empty.js';
import Branch, { BranchObject, Translations, TranslationUsage } from './Branch.js';
import { ISO_639_1 } from './utils/iso_639_1.js';
import { TranslationApi } from './TranslationApi.js';
import Translate, { NoMatchFn, NoTranslationFn } from './Translate.js';
export interface TranslateOptions {
    defaultLocale?: string;
    locale?: string;
    words?: WordTranslations;
    texts?: WordTranslations;
    noMatch?: NoMatchFn;
    noTranslation?: NoTranslationFn;
}
export interface Variables {
    [variable: string]: string | number | undefined;
}
export interface TextOptions extends Variables {
    locale?: string;
}
export default Translate;
export { Tree, Empty, Branch, TranslationApi, WordTranslations, TreeOptions, Translations, BranchObject, ISO_639_1, TranslationUsage, };
//# sourceMappingURL=index.d.ts.map
import Tree, { TreeOptions, WordTranslations } from './Tree';
import Empty from './Empty';
import Branch, { BranchObject, Translations, TranslationUsage } from './Branch';
import { ISO_639_1 } from './utils/iso_639_1';
import { TranslationApi } from './TranslationApi';
import Translate, { NoMatchFn, NoTranslationFn } from './Translate';

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

module.exports = Translate;
export default Translate;
export {
  Tree,
  Empty,
  Branch,
  TranslationApi,
  WordTranslations,
  TreeOptions,
  Translations,
  BranchObject,
  ISO_639_1,
  TranslationUsage,
};

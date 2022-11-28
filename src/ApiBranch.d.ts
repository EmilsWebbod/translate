import { ApiTranslation, ISO_639_1 } from './TranslationApi.js';
import { Translations } from './Branch.js';
export default abstract class ApiBranch {
    readonly word: string;
    translations: Translations;
    apiID: string;
    protected constructor(word: string);
    fromApi(language: ISO_639_1, languages: ISO_639_1[]): Promise<ApiTranslation>;
    toApi(language: ISO_639_1): Promise<ApiTranslation>;
    private getApiTranslations;
}
//# sourceMappingURL=ApiBranch.d.ts.map
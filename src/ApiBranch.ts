import {
  ApiTranslatePostValue,
  ApiTranslation,
  ISO_639_1,
  TranslationApi
} from './TranslationApi.js';
import { Translations } from './Branch.js';

export default abstract class ApiBranch {
  public readonly word: string = '';
  public translations: Translations = {};
  public apiID = '';

  protected constructor(word: string) {
    this.word = word;
  }

  public async fromApi(
    language: ISO_639_1,
    languages: ISO_639_1[]
  ): Promise<ApiTranslation> {
    const translation = await TranslationApi.of().get(
      this.word,
      language,
      languages
    );
    this.apiID = translation._id;
    return translation;
  }

  public async toApi(language: ISO_639_1): Promise<ApiTranslation> {
    return TranslationApi.of().post({
      value: this.word,
      type: this.word ? 'word' : 'text',
      language,
      ...this.getApiTranslations()
    });
  }

  private getApiTranslations() {
    const ret: ApiTranslatePostValue = {};
    for (const language in this.translations) {
      if (this.translations.hasOwnProperty(language)) {
        ret[language as ISO_639_1] = [this.translations[language]];
      }
    }
    return ret;
  }
}

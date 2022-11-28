import { TranslationApi } from './TranslationApi.js';
export default class ApiBranch {
    constructor(word) {
        this.word = '';
        this.translations = {};
        this.apiID = '';
        this.word = word;
    }
    async fromApi(language, languages) {
        const translation = await TranslationApi.of().get(this.word, language, languages);
        this.apiID = translation._id;
        return translation;
    }
    async toApi(language) {
        return TranslationApi.of().post({
            value: this.word,
            type: this.word ? 'word' : 'text',
            language,
            ...this.getApiTranslations()
        });
    }
    getApiTranslations() {
        const ret = {};
        for (const language in this.translations) {
            if (this.translations.hasOwnProperty(language)) {
                ret[language] = [this.translations[language]];
            }
        }
        return ret;
    }
}
//# sourceMappingURL=ApiBranch.js.map
let translateApi;
export class TranslationApi {
    static of(url) {
        return new TranslationApi(url);
    }
    static parseTranslations(obj, languages = []) {
        const translations = {};
        for (const language of languages) {
            if (language in obj && obj[language] && Array.isArray(obj[language])) {
                const translation = obj[language];
                translations[language] = translation.map((x) => x.value).join(',');
            }
        }
        return translations;
    }
    constructor(url = '') {
        this.url = url;
        this.apiOpts = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            mode: 'no-cors',
            credentials: 'omit',
        };
        if (translateApi) {
            return translateApi;
        }
        if (!url) {
            throw new Error('TranslationApi: Missing url as parameter on init Singleton');
        }
        translateApi = this;
        return this;
    }
    async get(wordOrId, language, languages = []) {
        const queries = [
            language ? `language=${language}` : '',
            languages.length > 0 ? `populate=${languages.join(',')}` : '',
        ]
            .filter(Boolean)
            .join('&');
        const res = await fetch(`${this.url}/translations/${wordOrId}?${queries}`, {
            credentials: 'omit',
        });
        if (res.status > 400) {
            throw new Error(res.statusText);
        }
        return res.json();
    }
    async search(query = {}) {
        const queries = Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&');
        const res = await fetch(`${this.url}/translations?${queries}`);
        if (res.status > 400) {
            throw new Error(res.statusText);
        }
        return res.json();
    }
    async post(data) {
        const res = await fetch(`${this.url}/translations`, {
            method: 'POST',
            body: this.dataToBody(data),
            ...this.apiOpts,
        });
        if (res.status > 400) {
            console.error(res);
            throw new Error(res.statusText);
        }
        return res.json();
    }
    async put(idOrValue, data) {
        const res = await fetch(`${this.url}/translations/${idOrValue}`, {
            method: 'PUT',
            body: this.dataToBody(data),
            ...this.apiOpts,
        });
        if (res.status > 400) {
            throw new Error(res.statusText);
        }
        return res.json();
    }
    async createOrUpdate(app, words, texts) {
        const res = await fetch(`${this.url}/apps/${app}`, {
            method: 'POST',
            body: JSON.stringify({
                words: Object.keys(words).map((value) => ({ value, ...words[value] })),
                texts: Object.keys(texts).map((value) => ({ value, ...texts[value] })),
            }),
            ...this.apiOpts,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (res.status > 400) {
            throw new Error(res.statusText);
        }
        return res.json();
    }
    dataToBody(data) {
        return Object.keys(data)
            .map((key) => `${encodeURIComponent(String(key))}=${encodeURIComponent(data[key])}`)
            .join('&');
    }
}
//# sourceMappingURL=TranslationApi.js.map
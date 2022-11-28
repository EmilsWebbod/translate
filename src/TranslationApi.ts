import { Translations } from './Branch.js';
import { ISO_639_1 } from './utils/iso_639_1.js';
import { WordTranslations } from './Tree.js';

export type { ISO_639_1 };

export type ApiTranslationValue = {
  [key in ISO_639_1]?: TranslationPopulated[];
};
export type ApiTranslatePostValue = {
  [key in ISO_639_1]?: string[];
};
export type TranslationPopulated = Pick<ApiTranslation, '_id' | 'value'>;

export type ApiTranslation = {
  _id: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  type: 'word' | 'text';
  language: string;
} & ApiTranslationValue;

export type QueryTranslation = Pick<
  ApiTranslation,
  'value' | 'type' | 'language'
>;
export interface Query extends Partial<QueryTranslation> {
  text?: string;
}
export type PostData = Pick<ApiTranslation, 'value' | 'type' | 'language'> &
  ApiTranslatePostValue;

let translateApi: TranslationApi;

export class TranslationApi {
  public static of(url?: string) {
    return new TranslationApi(url);
  }

  public static parseTranslations(
    obj: ApiTranslation,
    languages: ISO_639_1[] = []
  ): Translations {
    const translations: any = {};
    for (const language of languages) {
      if (language in obj && obj[language] && Array.isArray(obj[language])) {
        const translation = obj[language]!;
        translations[language] = translation.map((x) => x.value).join(',');
      }
    }
    return translations;
  }

  private apiOpts: Partial<RequestInit> = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    mode: 'no-cors',
    credentials: 'omit',
  };

  constructor(readonly url: string = '') {
    if (translateApi) {
      return translateApi;
    }

    if (!url) {
      throw new Error(
        'TranslationApi: Missing url as parameter on init Singleton'
      );
    }
    translateApi = this;
    return this;
  }

  public async get(
    wordOrId: string,
    language?: string,
    languages: ISO_639_1[] = []
  ): Promise<ApiTranslation> {
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

  public async search(query: Query = {}): Promise<ApiTranslation[]> {
    const queries = (Object.keys(query) as Array<keyof Query>)
      .map((key) => `${key}=${query[key]}`)
      .join('&');
    const res = await fetch(`${this.url}/translations?${queries}`);
    if (res.status > 400) {
      throw new Error(res.statusText);
    }
    return res.json();
  }

  public async post(data: PostData): Promise<ApiTranslation> {
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

  public async put(
    idOrValue: string,
    data: ApiTranslatePostValue
  ): Promise<ApiTranslation> {
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

  public async createOrUpdate(
    app: string,
    words: WordTranslations,
    texts: WordTranslations
  ) {
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

  private dataToBody<T extends URIComponent>(data: T) {
    return (Object.keys(data) as Array<keyof T>)
      .map(
        (key) =>
          `${encodeURIComponent(String(key))}=${encodeURIComponent(data[key])}`
      )
      .join('&');
  }
}

interface URIComponent {
  [key: string]: string | number | boolean | string[] | undefined | any;
}

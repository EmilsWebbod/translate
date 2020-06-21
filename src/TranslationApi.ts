import { Translations } from './Branch';

export type ISO_639_1 =
  | 'aa'
  | 'ab'
  | 'ae'
  | 'af'
  | 'ak'
  | 'am'
  | 'an'
  | 'ar'
  | 'as'
  | 'av'
  | 'ay'
  | 'az'
  | 'ba'
  | 'be'
  | 'bg'
  | 'bh'
  | 'bi'
  | 'bm'
  | 'bn'
  | 'bo'
  | 'br'
  | 'bs'
  | 'ca'
  | 'cd'
  | 'ce'
  | 'ch'
  | 'co'
  | 'cr'
  | 'cs'
  | 'cu'
  | 'cv'
  | 'cy'
  | 'da'
  | 'de'
  | 'dv'
  | 'dz'
  | 'ee'
  | 'el'
  | 'en'
  | 'eo'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'ff'
  | 'fi'
  | 'fj'
  | 'fo'
  | 'fr'
  | 'fy'
  | 'ga'
  | 'gd'
  | 'gl'
  | 'gn'
  | 'gu'
  | 'gv'
  | 'ha'
  | 'he'
  | 'hi'
  | 'ho'
  | 'hr'
  | 'ht'
  | 'hu'
  | 'hy'
  | 'hz'
  | 'ia'
  | 'id'
  | 'ie'
  | 'ig'
  | 'ii'
  | 'ik'
  | 'io'
  | 'is'
  | 'it'
  | 'iu'
  | 'ja'
  | 'jv'
  | 'ka'
  | 'kg'
  | 'ki'
  | 'kj'
  | 'kk'
  | 'kl'
  | 'km'
  | 'kn'
  | 'ko'
  | 'kr'
  | 'ks'
  | 'ku'
  | 'kv'
  | 'kw'
  | 'ky'
  | 'la'
  | 'lb'
  | 'lg'
  | 'li'
  | 'ln'
  | 'lo'
  | 'lt'
  | 'lu'
  | 'lv'
  | 'mg'
  | 'mh'
  | 'mi'
  | 'mk'
  | 'ml'
  | 'mn'
  | 'mo'
  | 'mr'
  | 'ms'
  | 'mt'
  | 'my'
  | 'na'
  | 'nb'
  | 'nd'
  | 'ne'
  | 'ng'
  | 'nl'
  | 'nn'
  | 'no'
  | 'nr'
  | 'nv'
  | 'ny'
  | 'oc'
  | 'oj'
  | 'om'
  | 'or'
  | 'os'
  | 'pa'
  | 'pi'
  | 'pl'
  | 'ps'
  | 'pt'
  | 'qu'
  | 'rm'
  | 'rn'
  | 'ro'
  | 'ru'
  | 'rw'
  | 'sa'
  | 'sc'
  | 'sd'
  | 'se'
  | 'sg'
  | 'sh'
  | 'si'
  | 'sk'
  | 'sl'
  | 'sm'
  | 'sn'
  | 'so'
  | 'sq'
  | 'sr'
  | 'ss'
  | 'st'
  | 'su'
  | 'sv'
  | 'sw'
  | 'ta'
  | 'te'
  | 'tg'
  | 'th'
  | 'ti'
  | 'tk'
  | 'tl'
  | 'tn'
  | 'to'
  | 'tr'
  | 'ts'
  | 'tt'
  | 'tw'
  | 'ty'
  | 'ug'
  | 'uk'
  | 'ur'
  | 'uz'
  | 've'
  | 'vi'
  | 'vo'
  | 'wa'
  | 'wo'
  | 'xh'
  | 'yi'
  | 'yo'
  | 'za'
  | 'ze'
  | 'zh'
  | 'zu';

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
        if (translation[0] && typeof translation[0] === 'object') {
          translations[language] = translation[0].value;
        }
      }
    }
    return translations;
  }

  private apiOpts: Partial<RequestInit> = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    mode: 'no-cors',
    credentials: 'omit'
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
      languages.length > 0 ? `populate=${languages.join(',')}` : ''
    ]
      .filter(Boolean)
      .join('&');
    const res = await fetch(`${this.url}/translations/${wordOrId}?${queries}`);
    if (res.status > 400) {
      throw new Error(res.statusText);
    }
    return res.json();
  }

  public async search(query: Query = {}): Promise<ApiTranslation[]> {
    const queries = (Object.keys(query) as Array<keyof Query>)
      .map(key => `${key}=${query[key]}`)
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
      ...this.apiOpts
    });
    if (res.status > 400) {
      console.error(await res.json());
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
      ...this.apiOpts
    });
    if (res.status > 400) {
      throw new Error(res.statusText);
    }
    return res.json();
  }

  private dataToBody<T extends URIComponent>(data: T) {
    return (Object.keys(data) as Array<keyof T>)
      .map(key => {
        return (
          encodeURIComponent(String(key)) +
          '=' +
          encodeURIComponent(data[key] as any)
        );
      })
      .join('&');
  }
}

interface URIComponent {
  [key: string]: string | number | boolean | string[] | undefined;
}

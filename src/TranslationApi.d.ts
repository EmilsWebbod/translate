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
export type QueryTranslation = Pick<ApiTranslation, 'value' | 'type' | 'language'>;
export interface Query extends Partial<QueryTranslation> {
    text?: string;
}
export type PostData = Pick<ApiTranslation, 'value' | 'type' | 'language'> & ApiTranslatePostValue;
export declare class TranslationApi {
    readonly url: string;
    static of(url?: string): TranslationApi;
    static parseTranslations(obj: ApiTranslation, languages?: ISO_639_1[]): Translations;
    private apiOpts;
    constructor(url?: string);
    get(wordOrId: string, language?: string, languages?: ISO_639_1[]): Promise<ApiTranslation>;
    search(query?: Query): Promise<ApiTranslation[]>;
    post(data: PostData): Promise<ApiTranslation>;
    put(idOrValue: string, data: ApiTranslatePostValue): Promise<ApiTranslation>;
    createOrUpdate(app: string, words: WordTranslations, texts: WordTranslations): Promise<any>;
    private dataToBody;
}
//# sourceMappingURL=TranslationApi.d.ts.map
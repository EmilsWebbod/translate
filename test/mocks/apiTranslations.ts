import {ApiTranslation, TranslationApi} from '../../src/TranslationApi';
import { API_URL } from './utils';

export const translation = new TranslationApi(API_URL);

export const mockApiUrl = (key: string, lang: string, populate: string) =>
  `${API_URL}/translations/${key}?language=${lang}&populate=${populate}`;

export const mockTranslations: ApiTranslation[] = [
  {
    _id: '5eed306aada314c613e3ae14',
    value: 'hello',
    createdAt: '2020-06-19 23:38:50.2222184 +0200 CEST m=+27.647892301',
    updatedAt: '2020-06-21 14:59:56.5037776 +0200 CEST m=+348.971486001',
    type: 'word',
    language: 'en',
    nb: [
      {
        _id: '5eed3e97c04f25cdb956ed26',
        value: 'hei'
      }
    ]
  },
  {
    _id: '5eed3be16b09f05461150654',
    value: 'postman',
    createdAt: '2020-06-20 00:27:45.7214435 +0200 CEST m=+3.494985401',
    updatedAt: '2020-06-20 00:27:45.7214435 +0200 CEST m=+3.494985401',
    type: 'word',
    language: 'en',
    nb: [
      {
        _id: '5eed3be16b09f05461150655',
        value: 'postman'
      }
    ]
  },
  {
    _id: '5eef4755f02d36da7cbaf552',
    value: 'logg out',
    createdAt: '2020-06-21 13:41:09.478626 +0200 CEST m=+46.418014401',
    updatedAt: '2020-06-21 13:41:09.478626 +0200 CEST m=+46.418014401',
    type: 'text',
    language: 'en',
    nb: [
      {
        _id: '5eef4755f02d36da7cbaf553',
        value: 'Logg ut'
      }
    ]
  },
  {
    _id: '5eef4755f02d36da7cbaf552',
    value: 'allo',
    createdAt: '2020-06-21 13:41:09.478626 +0200 CEST m=+46.418014401',
    updatedAt: '2020-06-21 13:41:09.478626 +0200 CEST m=+46.418014401',
    type: 'text',
    language: 'en',
    nb: [
      {
        _id: '5eef4755f02d36da7cbaf553',
        value: 'hei'
      }
    ]
  },
  {
    _id: '5eef4755f02d36da7cbaf552',
    value: 'abc',
    createdAt: '2020-06-21 13:41:09.478626 +0200 CEST m=+46.418014401',
    updatedAt: '2020-06-21 13:41:09.478626 +0200 CEST m=+46.418014401',
    type: 'text',
    language: 'no',
    en: [
      {
        _id: '5eef4755f02d36da7cbaf553',
        value: 'cba'
      }
    ]
  }
];

export const mockTranslation = mockTranslations[0];
export const mockTranslationAllo = mockTranslations[3];
export const mockTranslationAbc = mockTranslations[4];

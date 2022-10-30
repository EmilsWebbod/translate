import { assert } from 'chai';
import * as fetchMock from 'fetch-mock';

import { ISO_639_1, TranslationApi } from '../src/TranslationApi';
import {
  mockApiUrl,
  mockTranslation,
  mockTranslations,
} from './mocks/apiTranslations';
import { API_URL } from './mocks/utils';
import Tree from '../src/Tree';
import { texts, words } from './mocks';

describe('TranslationAPI', () => {
  const translation = new TranslationApi(API_URL);
  const postData = {
    value: mockTranslation.value,
    language: mockTranslation.language,
    type: mockTranslation.type,
    en: ['translation'],
    no: ['oversettelse'],
  };

  afterEach(() => fetchMock.restore());

  it('should initialize with opts', () => {
    assert.equal(translation.url, API_URL);
  });

  it('should fetch translation with word', async () => {
    try {
      const key = 'hello';
      fetchMock.get(`${API_URL}/translations/${key}?`, mockTranslation);
      const res = await translation.get(key);
      assert.isObject(res);
      assert.equal(res.value, key);
      assert.isArray(res.nb);
    } catch (e) {
      assert.fail(e.message);
    }
  });

  it('should fetch translation with populated values', async () => {
    try {
      const key = 'hello';
      const populate: ISO_639_1[] = ['en', 'nb'];
      fetchMock.get(mockApiUrl(key, 'en', 'en,nb'), mockTranslation);
      const res = await translation.get(key, 'en', populate);
      assert.isObject(res);
      assert.equal(res.value, key);
      assert.isArray(res.nb);
    } catch (e) {
      assert.fail(e.message);
    }
  });

  it('should search translations', async () => {
    try {
      fetchMock.get(`${API_URL}/translations?`, mockTranslations);
      const res = await translation.search();
      assert.isArray(res);
    } catch (e) {
      assert.fail(e.message);
    }
  });

  it('should post translation', async () => {
    try {
      fetchMock.post(`${API_URL}/translations`, mockTranslation);
      const res = await translation.post(postData);
      assert.isObject(res);
      assert.deepEqual(res, mockTranslation);
    } catch (e) {
      assert.fail(e.message);
    }
  });

  it('should put translation', async () => {
    try {
      fetchMock.put(
        `${API_URL}/translations/${mockTranslation._id}`,
        mockTranslation
      );
      const res = await translation.put(mockTranslation._id, postData);
      assert.isObject(res);
      assert.deepEqual(res, mockTranslation);
    } catch (e) {
      assert.fail(e.message);
    }
  });

  it('should create app with help of words and text', async () => {
    try {
      fetchMock.post(`${API_URL}/apps/test`, {});
      const tree = new Tree({ words, texts });
      const treeWords = tree.exportWords();
      const treeTexts = tree.exportTexts();
      const res = await translation.createOrUpdate(
        'test',
        treeWords,
        treeTexts
      );
      assert.isObject(res);
    } catch (e) {
      assert.fail(e.message);
    }
  });

  describe('statics', () => {
    it('should return singleton on .of', () => {
      const item = TranslationApi.of();
      assert.isTrue(item instanceof TranslationApi);
      assert.equal(item.url, API_URL);
    });

    it('should parse translations', () => {
      const transformed = TranslationApi.parseTranslations(mockTranslation, [
        'en',
        'nb',
      ]);
      assert.deepEqual(transformed, {
        nb: 'hei',
      });
    });
  });

  xdescribe('Real API', () => {
    beforeEach(() => {
      fetchMock.config.fallbackToNetwork = 'always';
    });
    afterEach(() => {
      fetchMock.config.fallbackToNetwork = false;
    });

    it('should get from api', async () => {
      const res = await TranslationApi.of().get('hello');
      assert.equal(res.value, 'hello');
    });

    it('should post to api', async () => {
      try {
        const res = await TranslationApi.of().post({
          type: 'word',
          language: 'en',
          value: 'hello',
        });
        assert.equal(res.value, 'hello');
      } catch (e) {
        console.error(e);
        assert.ok(e, e.message);
      }
    });

    it('should put to api', async () => {
      try {
        const hello = await TranslationApi.of().get('hello');
        const res = await TranslationApi.of().put(hello._id, {
          nb: ['hei', 'halla'],
        });
        assert.equal(res.value, 'hello');
        // @ts-ignore
        assert.isAtLeast(res.nb.length, 2);
      } catch (e) {
        console.error(e);
        assert.ok(e, e.message);
      }
    });
  });
});

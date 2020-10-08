import { assert } from 'chai';
import * as fetchMock from 'fetch-mock';

import Branch from '../src/Branch';
import { Empty, WordTranslations } from '../src';
import { ISO_639_1, TranslationApi } from '../src/TranslationApi';
import { mockApiUrl, mockTranslationAbc } from './mocks/apiTranslations';

const words: WordTranslations = {
  Abc: {},
  Abcd: {},
  Abd: {},
  Acd: {},
  Adc: {}
};

describe('Branch word', () => {
  let branch: Branch;

  beforeEach(() => {
    branch = new Branch(0, 'Abc');
    Object.keys(words).map(k => branch.add(k));
  });

  afterEach(() => fetchMock.restore());

  it('should be a class', () => {
    assert.isTrue(Branch instanceof Object);
  });

  it('should add words to branch', () => {
    assert.lengthOf(Object.keys(branch.words), 3);
  });

  it('should add words to children branches', () => {
    assert.lengthOf(Object.keys(branch.words.b.words), 2);
  });

  it('should print out words', () => {
    assert.isString(branch.toString());
  });

  it('should count how many words there are total in children', () => {
    assert.equal(branch.wordCount(), 9);
  });

  it('should find word in list', () => {
    assert.isObject(branch.find('abd'));
    assert.isObject(branch.find('abcd'));
  });

  it('should return empty object if not word', () => {
    const empty = branch.find('abdc');
    assert.equal(empty.constructor.name, 'Empty');
  });

  it('should add isWord only to last branch added', () => {
    assert.isFalse(branch.isWord);
    assert.isFalse(branch.words.b.isWord);
    assert.isTrue(branch.words.b.words.c.isWord);
  });

  it('should add translation', () => {
    const found = branch.find('Abc');

    if (found instanceof Branch) {
      found.addTranslation('en', 'aaa');
      found.addTranslation('se', 'bbb');
      found.addTranslation('no-nb', 'ccc');
      assert.equal(Object.keys(found.translations).length, 3);
    } else {
      assert.fail();
    }
  });

  it('should add translation when lesser is already part of word', () => {
    const added = branch.add('Ab');
    assert.isTrue(added);
    const found = branch.find('Ab') as Branch;
    assert.isTrue(found instanceof Branch);
    assert.isTrue(found.isWord);
  });

  it('should return Empty if invalid find value', () => {
    const found = branch.find(undefined as any);
    assert.isTrue(found instanceof Empty);
  });

  it('should return Empty if invalid match', () => {
    const found = branch.find('');
    assert.isTrue(found instanceof Empty);
  });

  it('should return Empty if partial match', () => {
    const found = branch.find('a');
    assert.isTrue(found instanceof Empty);
  });

  it('should get tranlsation', () => {
    const found = branch.find('Abc');
    if (found instanceof Branch) {
      found.addTranslation('en', 'aaa');
      assert.equal(found.translate('en'), 'aaa');
    } else {
      assert.fail();
    }
  });

  it('should return suggestion branches', () => {
    const suggestions = branch.suggestions();
    assert.lengthOf(suggestions, 5);
  });

  it('should export words to object', () => {
    const exported = branch.export();
    Object.keys(words).map(x => {
      const found = exported[x];
      assert.deepEqual(found, words[x]);
    });
  });

  describe('Translations', () => {
    it('should return Branch object if no translations found', () => {
      const word = branch.find('Abc');
      const translation = word.translate('en');
      assert.isObject(translation);
    });

    it('should add translation if not found and added', () => {
      const word = branch.find('Abc');
      const translation = word.translate('en');

      if (translation instanceof Branch) {
        translation.addTranslation('en', 'aaa');
        assert.equal(word.translate('en'), 'aaa');
      }
    });

    it('should add translations from API', async () => {
      const languages: ISO_639_1[] = ['en'];
      const key = 'Abc';
      fetchMock.get(mockApiUrl(key, 'nb', 'en'), mockTranslationAbc);

      const word = branch.find(key);
      const translations = await word.fromApi('nb', languages);
      if (word instanceof Branch) {
        word.addTranslations(
          TranslationApi.parseTranslations(translations, languages)
        );
      }

      const translation = word.translate('en');
      // @ts-ignore
      assert.equal(translation, mockTranslationAbc.en[0].value);
    });
  });
});

describe('Branch sentence', () => {
  let branch: Branch;

  beforeEach(() => {
    branch = new Branch(0, 'Hei dette er en test', true);
    branch.add('Hei dette er test 2');
    branch.add('Hei dette ble feil');
    branch.add('Hei feil oversettelse');
    branch.add('Hei kul du er');
  });

  it('should add sentence and split up with words', () => {
    assert.lengthOf(Object.keys(branch.words), 3);
    assert.equal(branch.word, 'Hei');
    assert.equal(branch.words.dette.word, 'Hei dette');
  });

  it('should find match', () => {
    const found = branch.find('Hei dette ble feil');
    assert.isNotNull(found.word);
  });

  it('should find word even if not matching uppercase', () => {
    const found = branch.find('hei kul du er');
    assert.exists(found.word);
  });

  it('should return empty and easily find close matches', () => {
    const found = branch.find('Hei dette ble fiel');
    if (!found.word) {
      const suggestions = found.suggestions();
      assert.equal(suggestions[0].word, 'Hei dette ble feil');
    }
  });

  it('should add text with variable', () => {
    const text = 'Hei Sentence with {{length}} words';
    branch.add(text, {
      'no-nb': 'Hei en setning med {{length}} words'
    });
    const found = branch.find(text);
    assert.isTrue(found instanceof Branch);
  });
});

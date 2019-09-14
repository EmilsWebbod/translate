import { assert } from 'chai';
import Translate, { TranslateOptions } from '../src';
import { texts, words } from './mocks';
import Empty from '../src/Empty';

const defaultOptions: TranslateOptions = {
  defaultLocale: 'en',
  locale: 'no-nb',
  words,
  texts
};

describe('Default translation', () => {
  let translate: Translate;

  beforeEach(() => {
    translate = new Translate({
      ...defaultOptions,
      locale: 'en'
    });
  });

  it('should return default translation', () => {
    const word = defaultOptions.words[0].word;
    const translated = translate.word(word);
    assert.equal(translated, word);
  });
});

describe('Translation object', () => {
  let translate: Translate;

  beforeEach(() => {
    translate = new Translate(defaultOptions);
  });

  it('should be typeof class', () => {
    assert.isTrue(Translate instanceof Object);
  });

  it('should create class with default options', () => {
    assert.equal(translate.locale, defaultOptions.locale);
  });

  it('should set up a default tree with list of words in options', () => {
    assert.isTrue(translate.tree instanceof Object);
    assert.isObject(translate.tree.words);
    assert.isObject(translate.tree.words.t);
  });

  it('should find word and translations', () => {
    const checkWord = defaultOptions.words[1];
    const word = translate.word(checkWord.word);
    assert.equal(word, checkWord.translations['no-nb']);
  });

  it('should find text and translations', () => {
    const checkText = defaultOptions.texts[1];
    const text = translate.text(checkText.word);
    assert.equal(text, checkText.translations['no-nb']);
  });

  it('should be able to change language', () => {
    const word = defaultOptions.words[0];
    const text = defaultOptions.texts[0];

    assert.equal(translate.word(word.word), word.translations['no-nb']);
    assert.equal(translate.text(text.word), text.translations['no-nb']);

    translate.changeLocale('se');
    assert.equal(translate.word(word.word), word.translations['se']);
    assert.equal(translate.text(text.word), text.translations['se']);
  });

  it('should return word translation on changed option locale', () => {
    const word = defaultOptions.words[0];
    assert.equal(
      translate.word(word.word, { locale: 'se' }),
      word.translations['se']
    );
  });

  it('should return text translation on changed option locale', () => {
    const text = defaultOptions.texts[0];
    assert.equal(
      translate.text(text.word, { locale: 'se' }),
      text.translations['se']
    );
  });

  it('should run second function if word not found', () => {
    let empty: any;
    const NT = translate.word('No', {
      noMatch: e => {
        empty = e;
      },
      noTranslation: e => {
        empty = e;
      }
    });

    assert.isTrue(empty && empty instanceof Empty);
    assert.equal(NT, 'N/W');
  });

  it('should run second function if text not found', () => {
    let empty: any;
    const NT = translate.text('No translations', {
      noMatch: e => {
        empty = e;
      },
      noTranslation: e => {
        empty = e;
      }
    });

    assert.isTrue(empty && empty instanceof Empty);
    assert.equal(NT, 'N/W');
  });

  describe('Export', () => {
    it('should export words to the same import object', () => {
      const exported = translate.exportWords();
      assert.lengthOf(exported, defaultOptions.words.length);
      assert.deepEqual(exported[0], defaultOptions.words[0]);
    });

    it('should export text to the same import object', () => {
      const exported = translate.exportTexts();
      assert.lengthOf(exported, defaultOptions.texts.length);
      assert.deepEqual(exported[0], defaultOptions.texts[0]);
    });

    it('should export text and words', () => {
      const exported = translate.export();
      assert.lengthOf(exported.words, defaultOptions.words.length);
      assert.lengthOf(exported.texts, defaultOptions.texts.length);
    });

    it('should create the same translation object with exported data', () => {
      const exported = translate.export();
      const newTranslate = new Translate({ ...defaultOptions, ...exported });
      assert.deepEqual(translate, newTranslate);
    });
  });
});

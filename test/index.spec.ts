import { assert } from 'chai';
import Translate, { Branch, TranslateOptions } from '../src';
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
    const translated = translate.word('Test');
    assert.equal(translated, 'Test');
  });
});

describe('Translation object', () => {
  let translate: Translate;
  const wordsLength = Object.keys(words).length;
  const textsLength = Object.keys(texts).length;
  const wordKey = 'Test';
  const textKey = 'This is a test';

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
    const checkWord = defaultOptions.words[wordKey];
    const word = translate.word(wordKey);
    assert.equal(word, checkWord['no-nb']);
  });

  it('should find text and translations', () => {
    const checkText = defaultOptions.texts[textKey];
    const text = translate.text(textKey);
    assert.equal(text, checkText['no-nb']);
  });

  it('should be able to change language', () => {
    const word = defaultOptions.words[wordKey];
    const text = defaultOptions.texts[textKey];

    assert.equal(translate.word(wordKey), word['no-nb']);
    assert.equal(translate.text(textKey), text['no-nb']);

    translate.changeLocale('se');
    assert.equal(translate.word(wordKey), word['se']);
    assert.equal(translate.text(textKey), text['se']);
  });

  it('should return word translation on changed option locale', () => {
    const word = defaultOptions.words[wordKey];
    assert.equal(translate.word(wordKey, 'se'), word['se']);
  });

  it('should return text translation on changed option locale', () => {
    const text = defaultOptions.texts[textKey];
    assert.equal(translate.text(textKey, 'se'), text['se']);
  });

  it('should run noMatch function if word not found', () => {
    let empty: any;
    const _translate = new Translate({
      ...defaultOptions,
      noMatch: (_, empty1) => {
        empty = empty1;
      }
    });
    const NW = _translate.word('No');

    assert.isTrue(empty && empty instanceof Empty);
    assert.equal(NW, 'N/W');
  });

  it('should run noMatch function if text not found', () => {
    let empty: any;
    const _translate = new Translate({
      ...defaultOptions,
      noMatch: (_, empty1) => {
        empty = empty1;
      }
    });
    const NW = _translate.text('No translations');

    assert.isTrue(empty && empty instanceof Empty);
    assert.equal(NW, 'N/W');
  });

  it('should run NoTranslation function if translation not found', () => {
    let branch: any;
    const _translate = new Translate({
      ...defaultOptions,
      noTranslation: (_, branch1) => {
        branch = branch1;
      }
    });
    const NT = _translate.word('Test', 'us');

    assert.isTrue(branch && branch instanceof Branch);
    assert.equal(NT, 'N/T');
  });

  it('should run noMatch function if text not found', () => {
    let branch: any;
    const _translate = new Translate({
      ...defaultOptions,
      noTranslation: (_, branch1) => {
        branch = branch1;
      }
    });
    const NT = _translate.text('This is a test', 'us');

    assert.isTrue(branch && branch instanceof Branch);
    assert.equal(NT, 'N/T');
  });

  describe('Export', () => {
    it('should export words to the same import object', () => {
      const exported = translate.exportWords();
      assert.lengthOf(Object.keys(exported), wordsLength);
      assert.deepEqual(exported[wordKey], defaultOptions.words[wordKey]);
    });

    it('should export text to the same import object', () => {
      const exported = translate.exportTexts();
      assert.lengthOf(Object.keys(exported), textsLength);
      assert.deepEqual(exported[textKey], defaultOptions.texts[textKey]);
    });

    it('should export text and words', () => {
      const exported = translate.export();
      assert.deepEqual(exported.words, words);
      assert.deepEqual(exported.texts, texts);
    });

    it('should create the same translation object with exported data', () => {
      const exported = translate.export();
      const newTranslate = new Translate({ ...defaultOptions, ...exported });
      assert.deepEqual(translate, newTranslate);
    });
  });
});

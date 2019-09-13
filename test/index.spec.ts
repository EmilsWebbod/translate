import { assert } from 'chai';
import Translate from '../src';

const defaultOptions = {
  lang: 'no-nb',
  words: ['Test', 'Awesome', 'Cool', 'Awkward', 'Tent']
};

describe('Translation object', () => {
  it('should be typeof class', () => {
    assert.isTrue(Translate instanceof Object);
  });

  it('should create class with default options', () => {
    const translate = new Translate(defaultOptions);
    assert.deepEqual(translate.options, { lang: defaultOptions.lang });
  });

  it('should set up a default tree with list of words in options', () => {
    const translate = new Translate(defaultOptions);
    assert.isTrue(translate.tree instanceof Object);
    assert.isArray(translate.tree.words);
    assert.isTrue(translate.tree.words[0] instanceof Object);
  });
});

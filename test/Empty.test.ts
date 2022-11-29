import { afterEach, assert, beforeEach, describe, it } from 'vitest';
import fetchMock from 'fetch-mock';

import Empty from '../src/Empty.js';
import Branch from '../src/Branch.js';
import Tree from '../src/Tree.js';
import { texts, words } from './mocks/index.js';
import { ISO_639_1, TranslationApi } from '../src/TranslationApi.js';
import { mockApiUrl, mockTranslationAllo } from './mocks/apiTranslations.js';

describe('Empty', () => {
  let branch: Branch;
  let empty: Empty;

  beforeEach(() => {
    branch = new Branch(0, 'abc');
    branch.add('abd');
    branch.add('abe');
    branch.add('abf');
    branch.add('ade');
    empty = branch.find('abcd') as Empty;
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should be class and created with branch', () => {
    assert.isTrue(Empty instanceof Object);
    assert.isObject(empty.branch);
  });

  it('should have function translate but should return no word', () => {
    assert.isFunction(empty.translate);
    assert.equal(empty.translate('en'), 'N/W (abcd)');
    assert.equal(empty.translate('no'), 'N/W (abcd)');
  });

  it('should have word saved if user want to add', () => {
    assert.equal(empty.word, 'abcd');
  });

  it('should add word if add function is run', () => {
    empty.add();
    const found = branch.find('abcd');
    assert.isNotEmpty(found.word);
  });

  it('should return words that close matches', () => {
    const found = branch.find('abg');
    if (found instanceof Empty) {
      const suggestions = found.suggestions();
      assert.equal(suggestions.map((x) => x.word).join(', '), 'abc, abd, abe, abf');
    }
  });

  it('should add word from api', async () => {
    fetchMock.get(mockApiUrl('allo', 'en', 'en,nb'), mockTranslationAllo);
    const languages: ISO_639_1[] = ['en', 'nb'];
    const foundEmpty = branch.find('allo');
    if (foundEmpty instanceof Empty) {
      const res = await foundEmpty.fromApi('en', languages);
      const translations = TranslationApi.parseTranslations(res, languages);
      foundEmpty.add(translations);
    }
    const found = branch.find('allo') as Branch;
    assert.isTrue(found instanceof Branch);
    // @ts-ignore
    assert.equal(found.translate('nb'), mockTranslationAllo.nb[0].value);
  });
});

describe('Empty tree', () => {
  let tree: Tree;
  let empty: Empty;

  beforeEach(() => {
    tree = new Tree({ words, texts });
    empty = tree.word('abcd') as Empty;
  });

  it('should return empty as instanceof Empty', () => {
    assert.isTrue(empty instanceof Empty);
  });

  it('should return text suggestions', () => {
    const found = tree.word('wasd');
    if (found instanceof Empty) {
      const suggestions = found.suggestions();
      assert.equal(suggestions.map((x) => x.word).join(', '), 'Test, Tent, Awesome, Awkward, Cool');
    } else {
      assert.fail();
    }
  });
});

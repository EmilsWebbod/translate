import { assert } from 'chai';
import Empty from '../src/Empty';
import Branch from '../src/Branch';
import { Tree } from '../src';
import { texts, words } from './mocks';

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

  it('should be class and created with branch', () => {
    assert.isTrue(Empty instanceof Object);
    assert.isObject(empty.branch);
  });

  it('should have word always as null', () => {
    assert.isNull(empty.word);
  });

  it('should have function translate but should return no word', () => {
    assert.isFunction(empty.translate);
    assert.equal(empty.translate('en'), 'N/W (abcd)');
    assert.equal(empty.translate('no'), 'N/W (abcd)');
  });

  it('should have word saved if user want to add', () => {
    assert.equal(empty.addWord, 'abcd');
  });

  it('should add word if add function is run', () => {
    empty.add();
    const found = branch.find('abcd');
    assert.isNotNull(found.word);
  });

  it('should return words that close matches', () => {
    const found = branch.find('abg');
    if (!found.word) {
      const suggestions = found.suggestions();
      assert.equal(suggestions, 'abc, abd, abe, abf');
    }
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
    if (!found.word) {
      const suggestions = found.suggestions();
      assert.equal(suggestions, 'Test, Tent, Awesome, Awkward, Cool');
    } else {
      assert.fail();
    }
  });
});

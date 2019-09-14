import { assert } from 'chai';
import Empty from '../src/Empty';
import Branch from '../src/Branch';

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
    assert.equal(empty.translate('en'), 'N/W');
    assert.equal(empty.translate('no'), 'N/W');
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

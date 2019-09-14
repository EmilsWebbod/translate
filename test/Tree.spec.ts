import { assert } from 'chai';
import Tree from '../src/Tree';
import { texts, words } from './mocks';
import Empty from '../src/Empty';

const defaultOptions = {
  words,
  texts
};

describe('Tree', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = new Tree(defaultOptions);
  });

  it('should be an class', () => {
    assert.isTrue(Tree instanceof Object);
  });

  it('should add word as branches', () => {
    assert.equal(Object.keys(tree.words).length, 3);
    tree.addWord('Word');
    assert.equal(Object.keys(tree.words).length, 4);
  });

  it('should add text to list and split up with words', () => {
    assert.isObject(tree.texts);
    assert.equal(Object.keys(tree.texts).length, 2);
  });

  it('should add sentence to object', () => {
    assert.isFunction(tree.addText);
  });

  it('should find word', () => {
    const found = tree.word('Awesome');
    assert.exists(found.word);
  });

  it('should find sentence', () => {
    const found = tree.text('Dette funker');
    assert.exists(found.word);
  });

  it('should return Empty object if not found', () => {
    const text = tree.text('Ingen match');
    const word = tree.text('Ingen');
    assert.exists(text);
    assert.exists(word);
    assert.equal(text.constructor.name, 'Empty');
    assert.equal(word.constructor.name, 'Empty');
  });

  it('should add text if not found', () => {
    const found = tree.text('Ingen match');

    if (found instanceof Empty) {
      found.add();
      const again = tree.text('Ingen match');
      assert.exists(again.word);
    } else {
      assert.fail();
    }
  });

  it('should add word if not found', () => {
    const found = tree.word('Ingen');

    if (found instanceof Empty) {
      found.add();
      const again = tree.word('Ingen');
      assert.exists(again.word);
    } else {
      assert.fail();
    }
  });
});

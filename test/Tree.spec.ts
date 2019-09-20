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
    assert.lengthOf(Object.keys(tree.words), 3);
    tree.addWord('Word');
    assert.lengthOf(Object.keys(tree.words), 4);
  });

  it('should add text to list and split up with words', () => {
    assert.isObject(tree.texts);
    assert.lengthOf(Object.keys(tree.texts), 3);
  });

  it('should add sentence to object', () => {
    assert.isFunction(tree.addText);
  });

  it('should find word', () => {
    const found = tree.word('Awesome');
    assert.exists(found.word);
  });

  it('should find sentence', () => {
    const found = tree.text('This works');
    assert.exists(found.word);
  });

  it('should return Empty object if not found', () => {
    const text = tree.text('No match');
    const word = tree.text('No');
    assert.exists(text);
    assert.exists(word);
    assert.equal(text.constructor.name, 'Empty');
    assert.equal(word.constructor.name, 'Empty');
  });

  it('should add text if not found', () => {
    const found = tree.text('No match');

    if (found instanceof Empty) {
      found.add();
      const again = tree.text('No match');
      assert.exists(again.word);
    } else {
      assert.fail();
    }
  });

  it('should add word if not found', () => {
    const found = tree.word('None');

    if (found instanceof Empty) {
      found.add();
      const again = tree.word('None');
      assert.exists(again.word);
    } else {
      assert.fail();
    }
  });

  it('should export words', () => {
    const exported = tree.exportWords();
    assert.isObject(exported);
    assert.deepEqual(exported, defaultOptions.words);
  });

  it('should export texts', () => {
    const exported = tree.exportTexts();
    assert.isObject(exported);
    assert.deepEqual(exported, defaultOptions.texts);
  });
});

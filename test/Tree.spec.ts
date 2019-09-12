import { assert } from 'chai';
import Tree from '../src/Tree';

describe('Tree', () => {
  xit('should be an class', () => {
    assert.isTrue(Tree instanceof Object);
  });

  xit('should add word as branches', () => {
    const tree = new Tree({});
    // tree.addWord('Tents');
    // assert.equal(tree.words.length, 1);
  });
});

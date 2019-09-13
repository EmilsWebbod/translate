import { assert } from 'chai';
import Branch from '../src/Branch';

describe('Branch', () => {
  let branch: Branch;

  beforeEach(() => {
    branch = new Branch(0, 'Abc');
    branch.add('Adc');
    branch.add('Acd');
    branch.add('Acd');
    branch.add('Abd');
    branch.add('Abcd');
    branch.add('Abc');
  });

  xit('should be a class', () => {
    assert.isTrue(Branch instanceof Object);
  });

  it('should add words to branch', () => {
    assert.equal(Object.keys(branch.words).length, 3);
  });

  it('should add words to children branches', () => {
    assert.equal(Object.keys(branch.words.b.words).length, 2);
  });

  it('should print out words', () => {
    assert.isString(branch.toString());
  });

  it('should count how many words there are total in children', () => {
    assert.equal(branch.wordCount(), 9);
  });

  it('should find word in list', () => {
    assert.isTrue(branch.find('abd'));
    assert.isTrue(branch.find('abcd'));
  });

  it('should fail to find word in list', () => {
    assert.isFalse(branch.find('abdc'));
  });

  xit('should add isWord only to last branch added', () => {
    assert.isFalse(branch.isWord);
    assert.isFalse(branch.words[0].isWord);
    assert.isTrue(branch.words[0].words[0].isWord);
  });
});

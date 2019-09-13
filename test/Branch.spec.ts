import { assert } from 'chai';
import Branch from '../src/Branch';

describe('Branch word', () => {
  let branch: Branch;

  beforeEach(() => {
    branch = new Branch(0, 'Abc');
    branch.add('Adc');
    branch.add('Acd');
    branch.add('Abd');
    branch.add('Abcd');
    branch.add('Abc');
  });

  it('should be a class', () => {
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
    assert.isObject(branch.find('abd'));
    assert.isObject(branch.find('abcd'));
  });

  it('should return empty object if not word', () => {
    const empty = branch.find('abdc');
    assert.equal(empty.constructor.name, 'Empty');
  });

  it('should add isWord only to last branch added', () => {
    assert.isFalse(branch.isWord);
    assert.isFalse(branch.words.b.isWord);
    assert.isTrue(branch.words.b.words.c.isWord);
  });

  it('should add translation', () => {
    const found = branch.find('abc');

    if (found.word) {
      found.addTranslation('en', 'aaa');
      found.addTranslation('se', 'bbb');
      found.addTranslation('no-nb', 'ccc');
      assert.equal(Object.keys(found.translations).length, 3);
    } else {
      assert.fail();
    }
  });

  it('should get tranlsation', () => {
    const found = branch.find('abc');
    if (found.word) {
      found.addTranslation('en', 'aaa');
      assert.equal(found.translate('en'), 'aaa');
    } else {
      assert.fail();
    }
  });

  it('should return suggestion branches', () => {
    const words = branch.suggestions();
    assert.equal(words.length, 5);
  });
});

describe('Branch sentence', () => {
  let branch: Branch;

  beforeEach(() => {
    branch = new Branch(0, 'Hei dette er en test', true);
    branch.add('Hei dette er test 2');
    branch.add('Hei dette ble feil');
    branch.add('Hei feil oversettelse');
    branch.add('Hei kul du er');
  });

  it('should add sentence and split up with words', () => {
    assert.equal(Object.keys(branch.words).length, 3);
    assert.equal(branch.word, 'Hei');
    assert.equal(branch.words.dette.word, 'Hei dette');
  });

  it('should find match', () => {
    const found = branch.find('Hei dette ble feil');
    assert.isNotNull(found.word);
  });

  it('should find word even if not matching uppercase', () => {
    const found = branch.find('hei kul du er');
    assert.exists(found.word);
  });

  it('should return empty and easily find close matches', () => {
    const found = branch.find('Hei dette ble fiel');
    if (!found.word) {
      const suggestions = found.suggestions();
      assert.equal(suggestions, 'Hei dette ble feil');
    }
  });
});

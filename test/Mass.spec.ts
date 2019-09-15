import { assert } from 'chai';
import Translate, { Branch } from '../src';
import { words } from './mocks/words';

describe('1000 Word testing', () => {
  let translate: Translate;

  beforeEach(() => {
    translate = new Translate({
      defaultLocale: 'en',
      locale: 'no-nb',
      texts: {},
      words
    });
  });

  it('should find word in a reasonable time', () => {
    translate = new Translate({
      defaultLocale: 'en',
      locale: 'no-nb',
      texts: {},
      words
    });

    const random = [
      'baby',
      'break',
      'line',
      'market',
      'develop',
      'increase',
      'interview',
      'civil',
      'Democrat',
      'hair',
      'experience',
      'his',
      'large',
      'likely',
      'customer',
      'final',
      'help',
      'executive'
    ];

    console.time('find');
    const found = random.map(x => translate.tree.word(x));
    console.timeEnd('find');

    assert.isTrue(found[0] instanceof Branch);
  });
});

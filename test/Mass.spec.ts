import { assert } from 'chai';
import Translate, { Branch } from '../src';
import { words } from './mocks/words';

describe('1000 Word testing', () => {
  let translate: Translate;

  beforeEach(() => {
    translate = new Translate({
      defaultLocale: 'en',
      locale: 'no-nb',
      texts: [],
      words: words as any
    });
  });

  it('should find word in a reasonable time', () => {
    translate = new Translate({
      defaultLocale: 'en',
      locale: 'no-nb',
      texts: [],
      words: words as any
    });

    const random = [
      words[0].word,
      words[15].word,
      words[200].word,
      words[455].word,
      words[650].word,
      words[777].word,
      words[123].word,
      words[323].word,
      words[523].word,
      words[353].word,
      words[654].word,
      words[195].word,
      words[954].word,
      words[853].word,
      words[123].word,
      words[153].word,
      words[65].word,
      words[233].word
    ];

    console.time('find');
    const found = random.map(x => translate.tree.word(x));
    console.timeEnd('find');

    assert.isTrue(found[0] instanceof Branch);
  });
});

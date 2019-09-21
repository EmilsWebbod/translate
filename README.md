# Translate library

[![CircleCI](https://circleci.com/gh/EmilsWebbod/translate/tree/master.svg?style=svg)](https://circleci.com/gh/EmilsWebbod/translate/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/EmilsWebbod/translate/badge.svg?branch=master)](https://coveralls.io/github/EmilsWebbod/translate?branch=master)

This library was created to help you translate your application on the go.

You can select the language you want to write in for the input. And there is no need to think about how to setup the structure for translations. Your code will have easily readable code for translation `translate.word('Yes')` or `translate.text('Wrong username')`

If the `locale` is set to the same as default it will print the same text as the input without any lookup.

## Helping libraries

**NodeJS**: In the works (Much work with how to update live)  
**React**: [@ewb/react-translate](https://github.com/EmilsWebbod/react-translate)  
**Minify Version**: [@ewb/translate-minify](https://github.com/EmilsWebbod/translate-minify)

## Setup

```
npm install @ewb/translate

yarn add @ewb/translate
```

```
import Translate from '@ewb/translate';

const translate = new Translate({
    defaultLocale: 'en',
    locale: 'no-nb',
    words: {
        Word: {
            'no-nb': 'Ord'
        },
        Worry: {
            'no-nb': 'Bekymre'
        }
    },
    texts: {
        'This is a sentence': {
            'no-nb': 'Dette er en setning'
        },
        'This is not a sentence': {
            'no-nb': 'Dette er ikke en setning'
        },
        // Variables use
        'Are you {{age}} years old?': {
            'no-nb': 'Er du {{age}} år gammel?'
        }
    }
})
```

This with setup two tree structures in the background.  
One for words and one for texts. These are branched out differently depending on word and text.  
Words are branched with characters "w" "o" "r" "d"  
Text are branched with words "This" "is" "a" "sentence"

Word

```
- w
-- o
--- r
---- d (isWord: Word)
---- r
----- y (isWord: Worry)
```

Text

```
- this
-- is
--- a
---- sentence (isWord: This is a sentence)
--- not
---- a
----- sentence (isWord: This is not a sentence)
```

## Quick guide

If Locale is the same as `defaultLocale` it will return the same text as input.

```
translate.word('Word'); // Ord
translate.text('This is a sentence'); // Dette er en setning

translate.word('Word', 'en'); // Word
translate.text('This is a sentence', { locale: 'en' }); // Dette er en setning

translate.setLocale('en');
translate.word('Worry') // Worry
translate.text('This is not a sentence') // This is not a sentence
```

## Variables

Text function supports variables with parallel to the locale object. `locale` is a reserved key in TextOptions and will not be translated.

Translation is targeted with `{{variable}}`

```
translate.text('Are you {{age}} years old?', { age: 18 })
// no-nb: Er du 18 år gammel?
// en: Are you 18 years old?
```

## Match

If there already exists a translation it will return normal text. Any mismatches will return either `N/W` or `N/T`.  
`N/W`: "No Word" matches the hit  
`N/T`: "No Translation" matches the locale of the found word

## Mismatch

Translations will only give valid match if branch is marked as isWord.  
All other mismatches will return Empty object or Branch object in option functions

```
const translate = new Translate({
    ....,
    noWord: (translate: Translate, empty: Empty) => { ... Handle 'N/W' },
    noTranslation: (translate: Translate, branch: Branch) => { ... Handle 'N/T' }
})
translate('No match')
```

### noWord: Empty

You can run `empty.add()` to add missing word to list if needed or `empty.suggestions()` to return string of suggestions if you want to see if there are any close matches you can use instead.

### noTranslation: Branch

You can run `branch.addTranslation(locale, word)` to add the missing translation

## Advanced

This library will not automatically save any changes. This has to be done remotely with `translation.export()`. The exported data can be changes with the options `words` or `texts`  
So running `empty.add()` or `branch.addTranlsation()` will not save value persistently. You need to remember to export and save data to file or update remote fetch.

## Interfaces

```
interface WordTranslations {
  [translation: string]: {
    [locale: string]: string;
  };
}

interface Translations {
  [key: string]: string;
}

interface Variables {
  [variable: string]: string | number | undefined;
}

interface TextOptions extends Variables {
  locale?: string;
}

interface TranslateOptions {
  defaultLocale: string;
  locale: string;

  words: WordTranslations;
  texts: WordTranslations;

  noMatch?: (translate: Translate, empty: Empty) => void;
  noTranslation?: (translate: Translate, empty: Branch) => void;
}

interface ExportData {
  words: WordTranslations;
  texts: WordTranslations;
}

export interface TreeOptions {
  words?: WordTranslations;
  texts?: WordTranslations;
}
```

## Class definitions

```
class Translate {
    w(word: string, locale?: string): string;
    word(word: string, locale?: string): string;

    t(text: string, opts?: TextOptions): string;
    text(text: string, opts?: TextOptions): string;

    changeLocale(locale: string): void;

    export(): ExportData;
    exportWords(): WordTranslation[];
    exportTexts(): WordTranslation[];
}

class Tree {
    constructor(options: TreeOptions);

    addWord(word: string, translations?: Translations): void;
    addText(text: string, translations?: Translations): void;

    text(text: string): Branch | Empty;
    word(word: string): Branch | Empty;

    suggestions(): Branch[];
    exportWords(): WordTranslation[];
    exportTexts(): WordTranslation[];
}

class Branch {
    constructor(level: string, word: string, isText: boolean, translations: Translations)

    add(word: string, translations?: Translations): true | false;
    find(str: string): Branch | Empty;

    addTranlsation(locale: string, word: string): void;
    translate(locale: string): string | Branch;

    suggestions(): Branch[];
    wordCount(): number;

    export(): WordTranslation[];
    toString(): string;
    map(fn: (b: Branch) => T): T[];
}

class Empty {
    // Will always return N/T (%word%)
    translate(locale: string): 'N/T (%word%)';

    // Add word to the tree with translations if wanted
    add(translations?: { [key: string]: string });

    // Returns string of suggestions that can be used instead.
    suggestions(): string;
}
```

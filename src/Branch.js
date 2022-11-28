import Empty from './Empty.js';
import { add } from './utils/math.js';
import { arrayToObject, getWord, suggestions } from './utils/helpers.js';
import ApiBranch from './ApiBranch.js';
const FILTER_STACK_PATHS = /(Branch|Tree|Translate)\./;
const FILTER_STACK_TRANS = /Translate._branch/;
export default class Branch extends ApiBranch {
    constructor(level, word, sentence = false, translations = {}, opts = {}) {
        super(getWord(level, word, sentence));
        this.level = level;
        this.sentence = sentence;
        this.words = {};
        this.isWord = false;
        this.usageStack = [];
        this.packageName = null;
        const char = this.getNextCharacter(word);
        if (char) {
            this.words[char] = new Branch(this.level + 1, word, sentence, translations, opts);
        }
        else {
            this.translations = translations;
            this.init(opts);
        }
    }
    init(opts) {
        this.isWord = true;
        this.apiID = opts?.apiID || '';
        this.packageName = opts?.packageName || null;
    }
    add(newWord, translations, opts = {}) {
        if (this.match(newWord)) {
            if (!this.isWord) {
                this.translations = { ...this.translations, ...translations };
                this.init(opts);
                return true;
            }
            else {
                return false;
            }
        }
        const char = this.getNextCharacter(newWord);
        if (this.words[char]) {
            this.words[char].add(newWord, translations, opts);
        }
        else {
            this.words[char] = new Branch(this.level + 1, newWord, this.sentence, translations, opts);
        }
        return true;
    }
    find(word) {
        if (this.isInvalid(word)) {
            return new Empty(this, word, this.sentence);
        }
        if (this.matchWord(word)) {
            const error = new Error();
            console.log(error);
            if (error && error.stack) {
                try {
                    const pathArr = error.stack.split('\n');
                    const filterPaths = pathArr.filter((x) => !x.match(FILTER_STACK_PATHS));
                    const paths = filterPaths.slice(1).map((x) => x.split('at ')[1] || '');
                    const file = paths[0].split(' ')[0];
                    const isTranslations = !pathArr.some((x) => x.match(FILTER_STACK_TRANS));
                    if (isTranslations && this.usageStack.every((x) => x.file !== file)) {
                        this.usageStack.push({
                            file,
                            stack: filterPaths.join('\n'),
                        });
                    }
                }
                catch (e) {
                    console.error('Stack error', error);
                }
            }
            return this.isWord ? this : new Empty(this, word, this.sentence);
        }
        const char = this.getNextCharacter(word);
        if (this.words[char]) {
            return this.words[char].find(word);
        }
        return new Empty(this, word, this.sentence);
    }
    addTranslations(translations) {
        for (const lang in translations) {
            if (translations.hasOwnProperty(lang)) {
                this.addTranslation(lang, translations[lang]);
            }
        }
    }
    addTranslation(locale, translation) {
        this.translations[locale] = translation;
    }
    translate(locale) {
        return this.translations[locale] || this;
    }
    suggestions() {
        return suggestions.bind(this)();
    }
    wordCount() {
        return this.map((x) => x.wordCount()).reduce(add, 0) + 1;
    }
    export(filter) {
        if (this.isWord) {
            if (this.notFiltered(filter)) {
                return {
                    [this.word]: this.translations,
                    ...this.map((x) => x.export(filter)).reduce(arrayToObject, {}),
                };
            }
        }
        return this.map((x) => x.export(filter)).reduce(arrayToObject, {});
    }
    toString() {
        const str = `${this.level} ${this.word} \n`;
        return str + this.map((x) => x.toString()).join('');
    }
    map(fn) {
        return Object.keys(this.words).map((k) => fn(this.words[k]));
    }
    notFiltered(filter) {
        if (!filter) {
            return true;
        }
        if (typeof filter.packageName === 'undefined' ||
            filter.packageName === this.packageName) {
            return true;
        }
        return false;
    }
    getNextCharacter(word) {
        if (this.sentence) {
            const split = word.split(' ')[this.level + 1];
            return split ? split.toLocaleLowerCase() : '';
        }
        else {
            return word[this.level + 1] || '';
        }
    }
    match(newWord) {
        return this.matchWord(newWord) || this.isInvalid(newWord);
    }
    isInvalid(newWord) {
        let w;
        let nw;
        if (!newWord) {
            return true;
        }
        if (this.sentence) {
            w = this.word.split(' ')[this.level];
            nw = newWord.split(' ')[this.level];
            if (w) {
                w = w.toLocaleLowerCase();
            }
            if (nw) {
                nw = nw.toLocaleLowerCase();
            }
        }
        else {
            w = this.word[this.level];
            nw = newWord[this.level];
        }
        return Boolean(w && nw && w !== nw);
    }
    matchWord(newWord) {
        return this.sentence
            ? this.word.toLocaleLowerCase() === newWord.toLocaleLowerCase()
            : this.word === newWord;
    }
}
//# sourceMappingURL=Branch.js.map
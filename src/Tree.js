import Branch from './Branch.js';
import Empty from './Empty.js';
import { arrayToObject, getFirst } from './utils/helpers.js';
export default class Tree {
    constructor({ words = {}, texts = {} }) {
        this.words = {};
        this.texts = {};
        Object.keys(words).map((k) => this.addWord(k, words[k]));
        Object.keys(texts).map((k) => this.addText(k, texts[k]));
    }
    addWord(word, translations, opts) {
        const char = getFirst(word);
        if (this.words[char]) {
            this.words[char].add(word, translations, opts);
        }
        else {
            this.words[char] = new Branch(0, word, false, translations, opts);
        }
    }
    addText(text, translations, opts) {
        const word = getFirst(text, true);
        if (this.texts[word]) {
            this.texts[word].add(text, translations, opts);
        }
        else {
            this.texts[word] = new Branch(0, text, true, translations, opts);
        }
    }
    word(word) {
        const char = getFirst(word);
        return this.words[char]
            ? this.words[char].find(word)
            : new Empty(this, word);
    }
    text(text) {
        const word = getFirst(text, true);
        return this.texts[word]
            ? this.texts[word].find(text)
            : new Empty(this, text, true);
    }
    suggestions(text) {
        return text
            ? this.textMap((x) => x.suggestions()).flat()
            : this.wordMap((x) => x.suggestions()).flat();
    }
    exportWords(filter) {
        return this.wordMap((x) => x.export(filter)).reduce(arrayToObject, {});
    }
    exportTexts(filter) {
        return this.textMap((x) => x.export(filter)).reduce(arrayToObject, {});
    }
    wordMap(fn) {
        return Object.keys(this.words).map((k) => fn(this.words[k]));
    }
    textMap(fn) {
        return Object.keys(this.texts).map((k) => fn(this.texts[k]));
    }
}
//# sourceMappingURL=Tree.js.map
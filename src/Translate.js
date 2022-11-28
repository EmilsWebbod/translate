import Tree from './Tree.js';
import Branch from './Branch.js';
import { VARIABLE_REGEXP } from './utils/helpers.js';
import Empty from './Empty.js';
let translate;
export default class Translate {
    constructor({ defaultLocale = 'en', locale = 'en', words = {}, texts = {}, noMatch, noTranslation, } = {}, overrideNew) {
        this.defaultLocale = '';
        this.locale = '';
        this.tree = new Tree({});
        if (!overrideNew && translate) {
            return translate;
        }
        this.defaultLocale = defaultLocale;
        this.locale = locale;
        this.noMatch = noMatch;
        this.noTranslation = noTranslation;
        this.tree = new Tree({
            words,
            texts,
        });
        translate = this;
    }
    w(word, locale) {
        return this.word(word, locale);
    }
    word(word, locale = this.locale) {
        const foundWord = this.tree.word(word);
        return this.translateAndRunNoMatch(foundWord, locale);
    }
    t(text, opts) {
        return this.text(text, opts);
    }
    text(text, { locale = this.locale, ...variables } = {}) {
        const foundText = this.tree.text(text);
        const translated = this.translateAndRunNoMatch(foundText, locale);
        return this.replaceVariables(translated, variables);
    }
    changeLocale(locale) {
        this.locale = locale;
    }
    export() {
        return {
            words: this.exportWords(),
            texts: this.exportTexts(),
        };
    }
    exportWords(filter) {
        return this.tree.exportWords(filter);
    }
    exportTexts(filter) {
        return this.tree.exportTexts(filter);
    }
    exportBranches() {
        return [...this.tree.suggestions(false), ...this.tree.suggestions(true)];
    }
    getWord(word) {
        return this.getBranch(word);
    }
    getText(text) {
        return this.getBranch(text, true);
    }
    getBranch(wordOrText, isText = false) {
        return this._branch(wordOrText, isText);
    }
    delete(wordOrText) {
        const branch = this._branch(wordOrText);
        if (branch) {
            branch.isWord = false;
            return branch;
        }
        return null;
    }
    setLocale(locale) {
        this.locale = locale;
    }
    addWords(words, opts) {
        Object.keys(words).forEach((key) => this.tree.addWord(key, words[key], opts));
    }
    addTexts(texts, opts) {
        Object.keys(texts).forEach((key) => this.tree.addText(key, texts[key], opts));
    }
    _branch(wordOrText, isText = false) {
        if (!isText) {
            const word = this.tree.word(wordOrText);
            if (word instanceof Branch) {
                return word;
            }
        }
        else {
            const text = this.tree.text(wordOrText);
            if (text instanceof Branch) {
                return text;
            }
        }
        return null;
    }
    replaceVariables(text, variables) {
        if (Object.keys(variables).length === 0) {
            return text;
        }
        return text.replace(VARIABLE_REGEXP, (word, group) => {
            return String(variables[group] ?? word);
        });
    }
    translateAndRunNoMatch(foundText, locale) {
        if (foundText instanceof Empty) {
            if (typeof this.noMatch === 'function') {
                this.noMatch(this, foundText);
            }
        }
        if (this.defaultLocale === locale) {
            return foundText.word;
        }
        const translated = foundText.translate(locale);
        if (translated instanceof Branch) {
            if (typeof this.noTranslation === 'function') {
                this.noTranslation(this, translated);
            }
            return `N/T (${foundText.word})`;
        }
        return translated;
    }
}
export { Translate };
//# sourceMappingURL=Translate.js.map
import Branch from './Branch.js';
import ApiBranch from './ApiBranch.js';
export default class Empty extends ApiBranch {
    constructor(branch, word, isTreeText = false) {
        super(word);
        this.branch = branch;
        this.isTreeText = isTreeText;
        this.apiID = '';
    }
    translate(_) {
        return `N/W (${this.word})`;
    }
    add(translations = {}) {
        this.translations = translations;
        if (this.branch instanceof Branch) {
            this.branch.add(this.word, translations, {
                apiID: this.apiID,
            });
        }
        else {
            if (this.isTreeText) {
                this.branch.addText(this.word, translations, {
                    apiID: this.apiID,
                });
            }
            else {
                this.branch.addWord(this.word, translations, {
                    apiID: this.apiID,
                });
            }
        }
    }
    suggestions() {
        let words;
        if ('isWord' in this.branch) {
            words = this.branch.suggestions();
        }
        else {
            words = this.branch.suggestions(this.isTreeText);
        }
        return words;
    }
}
//# sourceMappingURL=Empty.js.map
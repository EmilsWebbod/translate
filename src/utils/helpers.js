export const VARIABLE_REGEXP = /{{(.*?)}}/g;
export function getWord(level, word, sentence = false) {
    if (sentence) {
        return word
            .split(' ')
            .slice(0, level + 1)
            .join(' ');
    }
    return word.slice(0, level + 1);
}
export function suggestions() {
    return this.isWord
        ? [this, ...this.map(x => x.suggestions())]
        : this.map(x => x.suggestions()).flat();
}
export function getFirst(word, isText = false) {
    if (isText) {
        return word.split(' ')[0].toLocaleLowerCase();
    }
    return word[0];
}
export const arrayToObject = (obj, item) => ({
    ...obj,
    ...item
});
//# sourceMappingURL=helpers.js.map